import { struct, u32, u8, seq } from '@solana/buffer-layout'
import { bool, publicKey, u128, u64 } from '@solana/buffer-layout-utils'
import { PublicKey } from '@solana/web3.js'

export const PROGRAM_ADDRESS = new PublicKey('FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1')
export const REWARD_TOKEN_MINT = new PublicKey('a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp')

export type UserAccountData = {
	pool: PublicKey
	owner: PublicKey
	rewardAPerTokenComplete: bigint
	rewardBPerTokenComplete: bigint
	rewardAPerTokenPending: bigint
	rewardBPerTokenPending: bigint
	balanceStaked: bigint
	nonce: number
}

export const userAccountLayout = struct<UserAccountData>([
	publicKey('pool'),
	publicKey('owner'),
	u128('rewardAPerTokenComplete'),
	u128('rewardBPerTokenComplete'),
	u64('rewardAPerTokenPending'),
	u64('rewardBPerTokenPending'),
	u64('balanceStaked'),
	u8('nonce'),
])

export function getUserAccountAddress(ownerAddress: PublicKey, poolAddress: PublicKey) {
	return PublicKey.findProgramAddressSync(
		[ownerAddress.toBuffer(), poolAddress.toBuffer()],
		PROGRAM_ADDRESS,
	)[0]
}

export type PoolAccountData = {
	authority: PublicKey
	paused: boolean
	stakingMint: PublicKey
	stakingVault: PublicKey
	rewardAMint: PublicKey
	rewardAVault: PublicKey
	rewardBMint: PublicKey
	rewardBVault: PublicKey
	baseKey: PublicKey
	rewardDuration: bigint
	rewardDurationEnd: bigint
	lastUpdateTime: bigint
	rewardARate: bigint
	rewardBRate: bigint
	rewardAPerTokenStored: bigint
	rewardBPerTokenStored: bigint
	userStakeCount: number
	funders: PublicKey[]
	poolBump: number
	totalStaked: bigint
}

export const poolAccountLayout = struct<PoolAccountData>([
	publicKey('authority'),
	bool('paused'),
	publicKey('stakingMint'),
	publicKey('stakingVault'),
	publicKey('rewardAMint'),
	publicKey('rewardAVault'),
	publicKey('rewardBMint'),
	publicKey('rewardBVault'),
	publicKey('baseKey'),
	u64('rewardDuration'),
	u64('rewardDurationEnd'),
	u64('lastUpdateTime'),
	u64('rewardARate'),
	u64('rewardBRate'),
	u128('rewardAPerTokenStored'),
	u128('rewardBPerTokenStored'),
	u32('userStakeCount'),
	seq(publicKey(), 4, 'funders'),
	u8('poolBump'),
	u64('totalStaked'),
])
