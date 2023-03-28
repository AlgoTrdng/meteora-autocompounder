import crypto from 'node:crypto'
import { AccountMeta, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

import { FARM_PROGRAM_ADDRESS } from './state.js'
import {
	DYNAMIC_AMM_PROGRAM_ADDRESS,
	STABLE_SWAP_PROGRAM_ADDRESS,
	VAULT_PROGRAM_ADDRESS,
} from './init.js'

const namespaces = {
	claim: createHash('claim'),
	deposit: createHash('deposit'),
	dynamicVaultDeposit: createHash('addImbalanceLiquidity'),
}

function createHash(name: string) {
	const hex = crypto.createHash('sha256').update(`global:${name}`).digest('hex').slice(0, 16)
	return Buffer.from(hex, 'hex')
}

export type DepositToFarmInstructionAccounts = {
	pool: PublicKey
	stakingVault: PublicKey
	user: PublicKey
	owner: PublicKey
	ownerLPTokenAccount: PublicKey
}

export function buildDepositToFarmInstruction(
	{ pool, stakingVault, user, owner, ownerLPTokenAccount }: DepositToFarmInstructionAccounts,
	amount: bigint,
) {
	const data = Buffer.alloc(16)
	data.set(namespaces.deposit)
	data.writeBigInt64LE(amount, 8)

	const accounts = [
		accountMeta(pool, true),
		accountMeta(stakingVault, true),
		accountMeta(user, true),
		accountMeta(owner, false, true),
		accountMeta(ownerLPTokenAccount, true),
		accountMeta(TOKEN_PROGRAM_ID),
	]

	return new TransactionInstruction({
		data,
		keys: accounts,
		programId: FARM_PROGRAM_ADDRESS,
	})
}

export type ClaimInstructionAccounts = {
	pool: PublicKey
	stakingVault: PublicKey
	rewardAVault: PublicKey
	rewardBVault: PublicKey
	user: PublicKey
	owner: PublicKey
	rewardAAccount: PublicKey
	rewardBAccount: PublicKey
}

export function buildClaimInstruction({
	pool,
	stakingVault,
	rewardAVault,
	rewardBVault,
	user,
	owner,
	rewardAAccount,
	rewardBAccount,
}: ClaimInstructionAccounts) {
	const namespace = namespaces.claim
	const accounts = [
		accountMeta(pool, true),
		accountMeta(stakingVault, true),
		accountMeta(rewardAVault, true),
		accountMeta(rewardBVault, true),
		accountMeta(user, true),
		accountMeta(owner, false, true),
		accountMeta(rewardAAccount, true),
		accountMeta(rewardBAccount, true),
		accountMeta(TOKEN_PROGRAM_ID),
	]

	return new TransactionInstruction({
		keys: accounts,
		programId: FARM_PROGRAM_ADDRESS,
		data: namespace,
	})
}

export type DepositToDynamicAmmInstructionAccounts = {
	pool: PublicKey
	lpMint: PublicKey
	userPoolLp: PublicKey
	aVaultLp: PublicKey
	bVaultLp: PublicKey
	aVault: PublicKey
	bVault: PublicKey
	aVaultLpMint: PublicKey
	bVaultLpMint: PublicKey
	aTokenVault: PublicKey
	bTokenVault: PublicKey
	userAToken: PublicKey
	userBToken: PublicKey
	user: PublicKey
}

export type DepositToDynamicAmmInstructionArgs = {
	minimumPoolTokenAmount: bigint
	tokenAAmount: bigint
	tokenBAmount: bigint
}

export function buildDepositToDynamicAmmInstruction(
	{
		pool,
		lpMint,
		userPoolLp,
		aVaultLp,
		bVaultLp,
		aVault,
		bVault,
		aVaultLpMint,
		bVaultLpMint,
		aTokenVault,
		bTokenVault,
		userAToken,
		userBToken,
		user,
	}: DepositToDynamicAmmInstructionAccounts,
	{ minimumPoolTokenAmount, tokenAAmount, tokenBAmount }: DepositToDynamicAmmInstructionArgs,
) {
	const data = Buffer.alloc(32)
	data.set(namespaces.dynamicVaultDeposit)
	data.writeBigInt64LE(minimumPoolTokenAmount, 8)
	data.writeBigInt64LE(tokenAAmount, 16)
	data.writeBigInt64LE(tokenBAmount, 24)

	const accounts = [
		accountMeta(pool, true),
		accountMeta(lpMint, true),
		accountMeta(userPoolLp, true),
		accountMeta(aVaultLp, true),
		accountMeta(bVaultLp, true),
		accountMeta(aVault, true),
		accountMeta(bVault, true),
		accountMeta(aVaultLpMint, true),
		accountMeta(bVaultLpMint, true),
		accountMeta(aTokenVault, true),
		accountMeta(bTokenVault, true),
		accountMeta(userAToken, true),
		accountMeta(userBToken, true),
		accountMeta(user, false, true),
		accountMeta(VAULT_PROGRAM_ADDRESS),
		accountMeta(TOKEN_PROGRAM_ID),
	]

	return new TransactionInstruction({
		programId: DYNAMIC_AMM_PROGRAM_ADDRESS,
		keys: accounts,
		data,
	})
}

export type DepositToStableSwapAmmInstructionAccounts = {
	liquidityPool: PublicKey
	poolAuthority: PublicKey
	owner: PublicKey
	liquidityPoolTokenAccounts: PublicKey[]
	poolTokenMint: PublicKey
	ownerTokenAccounts: PublicKey[]
	ownerLPTokenAccount: PublicKey
}

export type DepositToStableSwapAmmInstructionArgs = {
	depositAmount: bigint[] // 4 * u64 => 4 * 8
	minMintAmount: bigint // u64 => 8
}

// 0104      000000000000000000000000000000000000000000000000c200000000000000b800000000000000
// 010400000000000000000000000000000000000000000000000000000040420f00000000002777f43a00000000

export function buildDepositToStableSwapAmmInstruction(
	{
		liquidityPool,
		poolAuthority,
		owner,
		liquidityPoolTokenAccounts,
		poolTokenMint,
		ownerTokenAccounts,
		ownerLPTokenAccount,
	}: DepositToStableSwapAmmInstructionAccounts,
	{ depositAmount, minMintAmount }: DepositToStableSwapAmmInstructionArgs,
) {
	const data = Buffer.alloc(45)
	data.writeUInt8(1)
	data.writeUInt32LE(liquidityPoolTokenAccounts.length, 1)
	data.writeBigInt64LE(depositAmount[0], 5)
	data.writeBigInt64LE(depositAmount[1], 13)
	data.writeBigInt64LE(depositAmount[2], 21)
	data.writeBigInt64LE(depositAmount[3], 29)
	data.writeBigInt64LE(minMintAmount, 37)

	const accounts = [
		accountMeta(liquidityPool),
		accountMeta(TOKEN_PROGRAM_ID),
		accountMeta(poolAuthority),
		accountMeta(owner),
		accountMeta(liquidityPoolTokenAccounts[0], true),
		accountMeta(liquidityPoolTokenAccounts[1], true),
		accountMeta(liquidityPoolTokenAccounts[2], true),
		accountMeta(liquidityPoolTokenAccounts[3], true),
		accountMeta(poolTokenMint, true),
		accountMeta(ownerTokenAccounts[0], true),
		accountMeta(ownerTokenAccounts[1], true),
		accountMeta(ownerTokenAccounts[2], true),
		accountMeta(ownerTokenAccounts[3], true),
		accountMeta(ownerLPTokenAccount, true),
	]

	return new TransactionInstruction({
		programId: STABLE_SWAP_PROGRAM_ADDRESS,
		keys: accounts,
		data,
	})
}

function accountMeta(address: PublicKey, isWritable = false, isSigner = false): AccountMeta {
	return {
		pubkey: address,
		isSigner,
		isWritable,
	}
}
