import { NATIVE_MINT } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'

import { connection } from '../global.js'
import { stableSwapPoolAccountLayout } from './state.js'

export const FARM_PROGRAM_ADDRESS = new PublicKey('FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1')
export const DYNAMIC_AMM_PROGRAM_ADDRESS = new PublicKey(
	'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB',
)
export const VAULT_PROGRAM_ADDRESS = new PublicKey('24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi')
export const STABLE_SWAP_PROGRAM_ADDRESS = new PublicKey(
	'MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky',
)

export const REWARD_A_TOKEN_MINT = new PublicKey('METDftWNfnkTcnEwh7sovtdiUeo2RjxSAsPQYFrWWGD')
export const ABR_MINT = new PublicKey('a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp')
export const LDO_MINT = new PublicKey('HZRCwxP2Vq9PCpPXooayhJ2bxTpo5xfpQrwB1svh332p')
export const USDC_MINT_ADDRESS = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
export const USDT_MINT_ADDRESS = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')

// FARMS ADDRESSES
const afUsdcUsdcFarmAddress = new PublicKey('9Jh5pRf9wwemN6V1EkvFmNrnkz5K4fHz35svj19vWrcP')
const aaUsdt4FarmAddress = new PublicKey('9VCYdv5JFQEiMRjuCwSrUNF1ng3VHFbj4dhqv3pHgRS8')
const acUsdUsdcFarmAddress = new PublicKey('9dGX6N3FLAVfKmvtkwHA9MVGsvEqGKnLFDQQFbw5dprr')
const aUsdc4FarmAddress = new PublicKey('3tfQmoEueBQR6GcjWGyAR5AnAWZSwYEBjSfoxRRewjqG')
const abBusd4FarmAddress = new PublicKey('9S15vE5nR7MJhzrPjBXJ3Kmph9WMDk7p4U4w4TtzeT2u')
const stSol2FarmAddress = new PublicKey('BemLvypFWv85WSR5Ck3LGdaKfaXaeiu8iWJziTELn5cS')

// STABLE SWAP AMMS
const stSol2LPAddress = new PublicKey('LiDoU8ymvYptqxenJ4YpcURBchn4ef63tcbdznBCKJh')
const aUsdc4LPAddress = new PublicKey('USD4WhBLkQsNm8bXMfxoKuMRtE281CYrPGcfJXZxQL9')
const abBusd4LPAddress = new PublicKey('abUDCvrNgN9snpRKo2x73pSxaWP1m7gysnBeVmi2XPW')
const aaUsdt4LPAddress = new PublicKey('abUTXJ1KTSaKocx3gr6UQDn5kaN666c9x7UXZSXepbh')

export type StableSwapPoolConfig = {
	address: PublicKey
	inputMintAddress: PublicKey
	authorityAddress: PublicKey
	poolTokenMintAddress: PublicKey
	tokenAccountsAddresses: PublicKey[]
	tokenMintAddresses: PublicKey[]
}

export type FarmPoolConfig = {
	address: PublicKey
	rewardBMintAddress: PublicKey
	rewardAVaultAddress: PublicKey
	rewardBVaultAddress: PublicKey
	stakingVaultAddress: PublicKey
}

export type StableSwapAmmConfig = {
	type: 'stableSwapPool'
	pool: StableSwapPoolConfig
	farm: FarmPoolConfig
}

export type DynamicAmmConfig = {
	type: 'dynamicAmm'
	farm: FarmPoolConfig
}

export type StableSwapAmmPoolName = 'stSOL-2Pool' | 'abBUSD-4Pool' | 'aUSDC-4Pool' | 'aaUSDT-4Pool'
export type DynamicAmmPoolName = 'acUSD-USDC' | 'afUSDC-USDC'

export type PoolName = StableSwapAmmPoolName | DynamicAmmPoolName

const farmConfigs: Record<PoolName, FarmPoolConfig> = {
	'acUSD-USDC': {
		address: acUsdUsdcFarmAddress,
		rewardBMintAddress: ABR_MINT,
		rewardAVaultAddress: new PublicKey('8xAtAc4XiW1Pc8bXsnAijYxWQgNhV1Y6KpjXJpqdvQ2Q'),
		rewardBVaultAddress: new PublicKey('7isFhx1eAMZMGH33KwUvgDNL4iQDXJrYAnXaeHE4gyFh'),
		stakingVaultAddress: getStakingVaultAddress(acUsdUsdcFarmAddress),
	},
	'abBUSD-4Pool': {
		address: abBusd4FarmAddress,
		rewardBMintAddress: ABR_MINT,
		rewardAVaultAddress: new PublicKey('5cqR7RBFFcDnyiFLm7pwYuAZv1qsJa1GuUjtbdzPBG47'),
		rewardBVaultAddress: new PublicKey('HPmduuh6BhcgNM5YFaSpohoAk125hnEE83j3cpMNcWt5'),
		stakingVaultAddress: getStakingVaultAddress(abBusd4FarmAddress),
	},
	'aUSDC-4Pool': {
		address: aUsdc4FarmAddress,
		rewardBMintAddress: ABR_MINT,
		rewardAVaultAddress: new PublicKey('928nFjvBNGaJqqUgqNvqZE7Ce8hAAd61QwvBTV2nGAy4'),
		rewardBVaultAddress: new PublicKey('FBqtzmh1h94G1531QqPWfroEs4rx1HephUiBzUUUrfsp'),
		stakingVaultAddress: getStakingVaultAddress(aUsdc4FarmAddress),
	},
	'aaUSDT-4Pool': {
		address: aaUsdt4FarmAddress,
		rewardBMintAddress: ABR_MINT,
		rewardAVaultAddress: new PublicKey('7ZCBokLLLkEZXsAeAZCJzVPfmVkJTXmar9Pt7Uy1YUWt'),
		rewardBVaultAddress: new PublicKey('Hz5mH8e5fDsrdmxGe9GHhgCeaQ8HeMbUd62MubNrtA6t'),
		stakingVaultAddress: getStakingVaultAddress(aaUsdt4FarmAddress),
	},
	'afUSDC-USDC': {
		address: afUsdcUsdcFarmAddress,
		rewardBMintAddress: ABR_MINT,
		rewardAVaultAddress: new PublicKey('3RMbHr3wHHZoA8Hp23B4oZy4mXYWoiht3hLUUtSc4N38'),
		rewardBVaultAddress: new PublicKey('9dCepJ7QTHPLMB2pyMbYWwVo51SQj1HkQnwSX6YiVyEc'),
		stakingVaultAddress: getStakingVaultAddress(afUsdcUsdcFarmAddress),
	},
	'stSOL-2Pool': {
		address: stSol2FarmAddress,
		rewardBMintAddress: LDO_MINT,
		rewardAVaultAddress: new PublicKey('GGPEvdnWEoMMJ2AAx4TBDPw4oLxgEnBc1dgS1eMYWeCn'),
		rewardBVaultAddress: new PublicKey('G98SNCwFUfHUBGNsx9r4ssPtfmbztGdzqDnwFbabJAVm'),
		stakingVaultAddress: getStakingVaultAddress(stSol2FarmAddress),
	},
}

const stableSwapPools = {
	'stSOL-2Pool': {
		type: 'stableSwapPool',
		farm: farmConfigs['stSOL-2Pool'],
		pool: {
			address: stSol2LPAddress,
			inputMintAddress: NATIVE_MINT,
			authorityAddress: new PublicKey('pG6noYMPVR9ykNgD4XSNa6paKKGGwciU2LckEQPDoSW'),
			tokenMintAddresses: [
				new PublicKey('7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj'),
				NATIVE_MINT,
			],
		},
	},
	'aUSDC-4Pool': {
		type: 'stableSwapPool',
		farm: farmConfigs['aUSDC-4Pool'],
		pool: {
			address: aUsdc4LPAddress,
			inputMintAddress: USDC_MINT_ADDRESS,
			authorityAddress: new PublicKey('5g5yYtiCy3ZrUpfvNg3LXVQDnVJtjmL1eMWXoMgqEuRx'),
			tokenMintAddresses: [
				new PublicKey('eqKJTf1Do4MDPyKisMYqVaUFpkEFAs3riGF3ceDH2Ca'),
				new PublicKey('DdFPRnccQqLD4zCHrBqdY95D6hvw6PLWp9DEXj1fLCL9'),
				new PublicKey('8Yv9Jz4z7BUHP68dz8E8m3tMe6NKgpMUKn8KVqrPA6Fr'),
				USDC_MINT_ADDRESS,
			],
		},
	},
	'aaUSDT-4Pool': {
		type: 'stableSwapPool',
		farm: farmConfigs['aaUSDT-4Pool'],
		pool: {
			address: aaUsdt4LPAddress,
			inputMintAddress: USDT_MINT_ADDRESS,
			authorityAddress: new PublicKey('A2UHy42vcoKKK4JhNzNTY9PJ5kPcb4EZUSxRAbUtKeUU'),
			tokenMintAddresses: [
				new PublicKey('FwEHs3kJEdMa2qZHv7SgzCiFXUQPEycEXksfBkwmS8gj'),
				new PublicKey('Bn113WT6rbdgwrm12UJtnmNqGqZjY4it2WoUQuQopFVn'),
				new PublicKey('DNhZkUaxHXYvpxZ7LNnHtss8sQgdAfd1ZYS1fB7LKWUZ'),
				USDT_MINT_ADDRESS,
			],
		},
	},
	'abBUSD-4Pool': {
		type: 'stableSwapPool',
		farm: farmConfigs['abBUSD-4Pool'],
		pool: {
			address: abBusd4LPAddress,
			inputMintAddress: USDC_MINT_ADDRESS,
			authorityAddress: new PublicKey('89WiJDwdAqjgsKrb9gxXcVgsmh38BBNm13xnPTuXjBwA'),
			tokenMintAddresses: [
				new PublicKey('6nuaX3ogrr2CaoAPjtaKHAoBNWok32BMcRozuf32s2QF'),
				new PublicKey('8XSsNvaKU9FDhYWAv7Yc7qSNwuJSzVrXBNEk7AFiWF69'),
				new PublicKey('E77cpQ4VncGmcAXX16LHFFzNBEBb2U7Ar7LBmZNfCgwL'),
				USDC_MINT_ADDRESS,
			],
		},
	},
} as Record<StableSwapAmmPoolName, StableSwapAmmConfig>

const stableSwapPoolsAddresses = Object.values(stableSwapPools).map(({ pool }) => pool.address)
const stableSwapPoolsAIs = await connection.getMultipleAccountsInfo(stableSwapPoolsAddresses)
Object.keys(stableSwapPools).forEach((poolName, i) => {
	const poolData = stableSwapPoolsAIs[i]?.data
	if (!poolData) {
		throw Error(`Could not fetch pool ${stableSwapPoolsAddresses[i].toString()}`)
	}
	const poolAccount = stableSwapPoolAccountLayout.decode(poolData)
	stableSwapPools[poolName as StableSwapAmmPoolName].pool.poolTokenMintAddress =
		poolAccount.poolMint
	stableSwapPools[poolName as StableSwapAmmPoolName].pool.tokenAccountsAddresses =
		poolAccount.tokenAccounts
})

export const pools = {
	...stableSwapPools,
}

function getStakingVaultAddress(poolAddress: PublicKey) {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('staking', 'utf-8'), poolAddress.toBuffer()],
		FARM_PROGRAM_ADDRESS,
	)[0]
}
