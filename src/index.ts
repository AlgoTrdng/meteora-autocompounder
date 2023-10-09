import { getAssociatedTokenAddress, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { Keypair, TransactionInstruction } from '@solana/web3.js'
import { setTimeout } from 'node:timers/promises'

import { initJupiter, swap } from './jupiter.js'
import { config } from './config.js'
import { getUserFarmAccountAddress } from './meteora/state.js'
import {
	buildClaimInstruction,
	buildDepositToDynamicAmmInstruction,
	buildDepositToFarmInstruction,
	buildDepositToStableSwapAmmInstruction,
} from './meteora/instructions.js'
import {
	REWARD_A_TOKEN_MINT,
	pools,
	StableSwapAmmPoolName,
	DynamicAmmConfig,
} from './meteora/init.js'
import { getTokenDiffAmount, sendTransaction } from './utils.js'
import { rewardsCache } from './cache.js'
import { connection } from './global.js'

const ownerKeyPair = Keypair.fromSecretKey(config.walletPrivateKey)
const jupiter = await initJupiter(ownerKeyPair, connection)

programLoop(config.compoundingTimeout * 60 * 60 * 1000, async () => {
	for (const _poolName of config.pools) {
		const poolName = _poolName as StableSwapAmmPoolName
		const poolConfig = pools[poolName]

		if (!poolConfig) {
			continue
		}

		logMessage(poolName, 'Compounding', 'info')

		const [ownerAAccountAddress, ownerBAccountAddress] = await Promise.all([
			getAssociatedTokenAddress(REWARD_A_TOKEN_MINT, ownerKeyPair.publicKey),
			getAssociatedTokenAddress(poolConfig.farm.rewardBMintAddress, ownerKeyPair.publicKey),
		])

		const userFarmAddress = getUserFarmAccountAddress(
			ownerKeyPair.publicKey,
			poolConfig.farm.address,
		)

		logMessage(poolName, 'Claiming', 'info')

		const claimIx = buildClaimInstruction({
			pool: poolConfig.farm.address,
			stakingVault: poolConfig.farm.stakingVaultAddress,
			rewardAVault: poolConfig.farm.rewardAVaultAddress,
			rewardBVault: poolConfig.farm.rewardBVaultAddress,
			user: userFarmAddress,
			owner: ownerKeyPair.publicKey,
			rewardAAccount: ownerAAccountAddress,
			rewardBAccount: ownerBAccountAddress,
		})
		const claimMeta = await sendTransaction(
			{ instructions: [claimIx], signers: [ownerKeyPair] },
			connection,
		)
		if (!claimMeta) {
			console.error(`[${poolName}]: Claim failed`)
			continue
		}
		const rewardTokenDiffAmount = getTokenDiffAmount(
			claimMeta,
			poolConfig.farm.rewardBMintAddress,
			ownerKeyPair.publicKey,
		)

		logMessage(poolName, `Claimed ${rewardTokenDiffAmount}`, 'ok')
		logMessage(poolName, 'Swapping', 'info')

		const swapMeta = await swap(
			{
				inputAmount: rewardTokenDiffAmount + rewardsCache[poolName].unusedReward,
				inputMintAddress: poolConfig.farm.rewardBMintAddress,
				outputMintAddress: poolConfig.pool.inputMintAddress,
			},
			jupiter,
			connection,
		)

		if (!swapMeta) {
			logMessage(poolName, 'Swap failed', 'err')
			rewardsCache[poolName].unusedReward += rewardTokenDiffAmount
			continue
		} else {
			rewardsCache[poolName].unusedReward = 0n
		}
		const inputTokenDiffAmount = getTokenDiffAmount(
			swapMeta,
			poolConfig.pool.inputMintAddress,
			ownerKeyPair.publicKey,
		)

		logMessage(poolName, `Swapped ${rewardTokenDiffAmount} for ${inputTokenDiffAmount}`, 'ok')
		logMessage(poolName, 'Depositing to LP', 'info')

		const ownerLPTokenAccountAddress = getAssociatedTokenAddressSync(
			poolConfig.pool.poolTokenMintAddress,
			ownerKeyPair.publicKey,
		)

		const depositLiquidityIxs: TransactionInstruction[] = []
		if (poolConfig.type === 'stableSwapPool') {
			const depositToLpAmount = rewardsCache[poolName].unusedInput + inputTokenDiffAmount
			const ownerTokenAccountsAddresses = await Promise.all(
				poolConfig.pool.tokenMintAddresses.map((ma) =>
					getAssociatedTokenAddress(ma, ownerKeyPair.publicKey),
				),
			)

			depositLiquidityIxs.push(
				buildDepositToStableSwapAmmInstruction(
					{
						liquidityPool: poolConfig.pool.address,
						poolAuthority: poolConfig.pool.authorityAddress,
						owner: ownerKeyPair.publicKey,
						liquidityPoolTokenAccounts: poolConfig.pool.tokenAccountsAddresses,
						poolTokenMint: poolConfig.pool.poolTokenMintAddress,
						ownerLPTokenAccount: ownerLPTokenAccountAddress,
						ownerTokenAccounts: ownerTokenAccountsAddresses,
					},
					{
						depositAmount: [0n, 0n, 0n, depositToLpAmount],
						minMintAmount: (depositToLpAmount * 95n) / 100n, // 5% slippage
					},
				),
			)
		} else {
			const depositAmount = rewardsCache[poolName].unusedInput + inputTokenDiffAmount
			// For some reason typescript does not infer this type
			const pc = poolConfig as unknown as DynamicAmmConfig

			const userATokenAccount = getAssociatedTokenAddressSync(
				pc.pool.aTokenMint,
				ownerKeyPair.publicKey,
			)
			const userBTokenAccount = getAssociatedTokenAddressSync(
				pc.pool.bTokenMint,
				ownerKeyPair.publicKey,
			)
			const userPoolTokenAccount = getAssociatedTokenAddressSync(
				pc.pool.poolTokenMintAddress,
				ownerKeyPair.publicKey,
			)

			depositLiquidityIxs.push(
				buildDepositToDynamicAmmInstruction(
					{
						pool: pc.pool.address,
						poolTokenMint: pc.pool.poolTokenMintAddress,
						aVaultPool: pc.pool.aPoolTokenVaultAddress,
						bVaultPool: pc.pool.bPoolTokenVaultAddress,
						aVault: pc.pool.aVaultAuthorityAddress,
						bVault: pc.pool.bVaultAuthorityAddress,
						aVaultPoolMint: pc.pool.aPoolTokenMintAddress,
						bVaultPoolMint: pc.pool.bPoolTokenMintAddress,
						aTokenVault: pc.pool.aVaultAddress,
						bTokenVault: pc.pool.bVaultAddress,
						user: ownerKeyPair.publicKey,
						userPoolTokenAccount,
						userATokenAccount,
						userBTokenAccount,
					},
					{
						// Could not find how to get/calculate pool virtual price
						// in docs or in the source code
						// So deposit amount is just 95% of tokenA, which may cause
						// issues with some pools
						minimumPoolTokenAmount: (depositAmount * 95n) / 100n,
						tokenAAmount: depositAmount,
						tokenBAmount: 0n,
					},
				),
			)
		}

		const depositLiquidityRes = await sendTransaction(
			{ instructions: depositLiquidityIxs, signers: [ownerKeyPair] },
			connection,
		)
		if (!depositLiquidityRes) {
			logMessage(poolName, 'Deposit failed', 'err')
			rewardsCache[poolName].unusedInput += inputTokenDiffAmount
			continue
		} else {
			rewardsCache[poolName].unusedInput = 0n
		}

		const lpTokenDiffAmount = getTokenDiffAmount(
			depositLiquidityRes,
			poolConfig.pool.poolTokenMintAddress,
			ownerKeyPair.publicKey,
		)

		logMessage(poolName, `Deposited ${inputTokenDiffAmount}, received ${lpTokenDiffAmount}`, 'ok')
		logMessage(poolName, `Depositing to farm`, 'info')

		const depositToFarmIx = buildDepositToFarmInstruction(
			{
				pool: poolConfig.farm.address,
				stakingVault: poolConfig.farm.stakingVaultAddress,
				user: userFarmAddress,
				owner: ownerKeyPair.publicKey,
				ownerLPTokenAccount: ownerLPTokenAccountAddress,
			},
			lpTokenDiffAmount + rewardsCache[poolName].unusedLP,
		)
		const depositToFarmRes = await sendTransaction(
			{ instructions: [depositToFarmIx], signers: [ownerKeyPair] },
			connection,
		)

		if (!depositToFarmRes) {
			logMessage(poolName, 'Deposit to farm failed', 'err')
			rewardsCache[poolName].unusedLP += lpTokenDiffAmount
		} else {
			rewardsCache[poolName].unusedLP = 0n
			logMessage(
				poolName,
				`Deposited ${rewardsCache[poolName].unusedLP + lpTokenDiffAmount} to farm`,
				'ok',
			)
		}
	}
})

function logMessage(poolName: string, message: string, status: 'err' | 'ok' | 'info') {
	switch (status) {
		case 'err': {
			console.error(`🚨🚨 [${poolName}]: ${message}`)
			break
		}
		case 'info': {
			console.info(`🔵🔵 [${poolName}]: ${message}`)
			break
		}
		case 'ok': {
			console.log(`✅✅ [${poolName}]: ${message}`)
		}
	}
}

async function programLoop(timeout: number, cb: () => Promise<void>) {
	while (true) {
		await cb()
		await setTimeout(timeout)
	}
}
