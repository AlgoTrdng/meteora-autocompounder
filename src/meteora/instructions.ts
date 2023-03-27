import { AccountMeta, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PROGRAM_ADDRESS } from './state.js'

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
	const namespace = Buffer.from('3ec6d6c1d59f6cd2', 'hex')
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
		programId: PROGRAM_ADDRESS,
		data: namespace,
	})
}

function accountMeta(address: PublicKey, isWritable = false, isSigner = false): AccountMeta {
	return {
		pubkey: address,
		isSigner,
		isWritable,
	}
}
