import { getAssociatedTokenAddress } from '@solana/spl-token'
import { Connection, Keypair } from '@solana/web3.js'
import { buildAndSignTxFromInstructions, sendAndConfirmTransaction } from 'solana-tx-utils'
import { setTimeout } from 'node:timers/promises'

import { config } from './config.js'
import { getUserAccountAddress } from './meteora/state.js'
import { buildClaimInstruction } from './meteora/instructions.js'
import { availablePools, Pools, REWARD_A_TOKEN_MINT } from './meteora/constants.js'

const COMPOUNDING_TIMEOUT = 1000 * 60 * 60 // 1 hour

const connection = new Connection(config.rpcUrl, 'confirmed')
const ownerKeyPair = Keypair.fromSecretKey(config.walletPrivateKey)

while (true) {
	for (const poolName of config.pools) {
		const poolAddresses = availablePools[poolName.toString() as Pools]

		if (!poolAddresses) {
			continue
		}

		console.log(`Compounding on pool ${poolName}`)

		const [ownerAAccountAddress, ownerBAccountAddress] = await Promise.all([
			getAssociatedTokenAddress(REWARD_A_TOKEN_MINT, ownerKeyPair.publicKey),
			getAssociatedTokenAddress(poolAddresses.rewardBMintAddress, ownerKeyPair.publicKey),
		])

		const userAddress = getUserAccountAddress(ownerKeyPair.publicKey, poolAddresses.poolAddress)

		const claimIx = buildClaimInstruction({
			pool: poolAddresses.poolAddress,
			stakingVault: poolAddresses.stakingVaultAddress,
			rewardAVault: poolAddresses.rewardAVaultAddress,
			rewardBVault: poolAddresses.rewardBVaultAddress,
			user: userAddress,
			owner: ownerKeyPair.publicKey,
			rewardAAccount: ownerAAccountAddress,
			rewardBAccount: ownerBAccountAddress,
		})

		const txData = await buildAndSignTxFromInstructions(
			{
				payerKey: ownerKeyPair.publicKey,
				instructions: [claimIx],
				signers: [ownerKeyPair],
			},
			connection,
		)
		const res = await sendAndConfirmTransaction({ ...txData, connection })
		console.log(res)
	}

	await setTimeout(COMPOUNDING_TIMEOUT)
}
