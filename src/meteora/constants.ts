import { PublicKey } from '@solana/web3.js'

export const FARM_PROGRAM_ADDRESS = new PublicKey('FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1')
export const REWARD_A_TOKEN_MINT = new PublicKey('METDftWNfnkTcnEwh7sovtdiUeo2RjxSAsPQYFrWWGD')
export const ABR_MINT = new PublicKey('a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp')
export const LDO_MINT = new PublicKey('HZRCwxP2Vq9PCpPXooayhJ2bxTpo5xfpQrwB1svh332p')

type PoolAddresses = {
	poolAddress: PublicKey
	rewardBMintAddress: PublicKey
	rewardAVaultAddress: PublicKey
	rewardBVaultAddress: PublicKey
	stakingVaultAddress: PublicKey
}

const afUsdcUsdc = new PublicKey('9Jh5pRf9wwemN6V1EkvFmNrnkz5K4fHz35svj19vWrcP')
const aaUsdt4Pool = new PublicKey('9VCYdv5JFQEiMRjuCwSrUNF1ng3VHFbj4dhqv3pHgRS8')
const acUsdUsdc = new PublicKey('9dGX6N3FLAVfKmvtkwHA9MVGsvEqGKnLFDQQFbw5dprr')
const aUsdc4Pool = new PublicKey('3tfQmoEueBQR6GcjWGyAR5AnAWZSwYEBjSfoxRRewjqG')
const abBusd4Pool = new PublicKey('9S15vE5nR7MJhzrPjBXJ3Kmph9WMDk7p4U4w4TtzeT2u')
const stSol2Pool = new PublicKey('BemLvypFWv85WSR5Ck3LGdaKfaXaeiu8iWJziTELn5cS')

export type Pools =
	| 'acUSD-USDC'
	| 'afUSDC-USDC'
	| 'stSOL-2Pool'
	| 'aUSDC-4Pool'
	| 'abBUSD-4Pool'
	| 'aaUSDT-4Pool'

export const availablePools: Record<Pools, PoolAddresses> = {
	'acUSD-USDC': {
		poolAddress: acUsdUsdc,
		rewardBMintAddress: ABR_MINT,
		rewardAVaultAddress: new PublicKey('8xAtAc4XiW1Pc8bXsnAijYxWQgNhV1Y6KpjXJpqdvQ2Q'),
		rewardBVaultAddress: new PublicKey('7isFhx1eAMZMGH33KwUvgDNL4iQDXJrYAnXaeHE4gyFh'),
		stakingVaultAddress: getStakingVaultAddress(acUsdUsdc),
	},
	'abBUSD-4Pool': {
		poolAddress: abBusd4Pool,
		rewardBMintAddress: ABR_MINT,
		rewardAVaultAddress: new PublicKey('5cqR7RBFFcDnyiFLm7pwYuAZv1qsJa1GuUjtbdzPBG47'),
		rewardBVaultAddress: new PublicKey('HPmduuh6BhcgNM5YFaSpohoAk125hnEE83j3cpMNcWt5'),
		stakingVaultAddress: getStakingVaultAddress(abBusd4Pool),
	},
	'aUSDC-4Pool': {
		poolAddress: aUsdc4Pool,
		rewardBMintAddress: ABR_MINT,
		rewardAVaultAddress: new PublicKey('928nFjvBNGaJqqUgqNvqZE7Ce8hAAd61QwvBTV2nGAy4'),
		rewardBVaultAddress: new PublicKey('FBqtzmh1h94G1531QqPWfroEs4rx1HephUiBzUUUrfsp'),
		stakingVaultAddress: getStakingVaultAddress(aUsdc4Pool),
	},
	'aaUSDT-4Pool': {
		poolAddress: aaUsdt4Pool,
		rewardBMintAddress: ABR_MINT,
		rewardAVaultAddress: new PublicKey('7ZCBokLLLkEZXsAeAZCJzVPfmVkJTXmar9Pt7Uy1YUWt'),
		rewardBVaultAddress: new PublicKey('Hz5mH8e5fDsrdmxGe9GHhgCeaQ8HeMbUd62MubNrtA6t'),
		stakingVaultAddress: getStakingVaultAddress(aaUsdt4Pool),
	},
	'afUSDC-USDC': {
		poolAddress: afUsdcUsdc,
		rewardBMintAddress: ABR_MINT,
		rewardAVaultAddress: new PublicKey('3RMbHr3wHHZoA8Hp23B4oZy4mXYWoiht3hLUUtSc4N38'),
		rewardBVaultAddress: new PublicKey('9dCepJ7QTHPLMB2pyMbYWwVo51SQj1HkQnwSX6YiVyEc'),
		stakingVaultAddress: getStakingVaultAddress(afUsdcUsdc),
	},
	'stSOL-2Pool': {
		poolAddress: stSol2Pool,
		rewardBMintAddress: LDO_MINT,
		rewardAVaultAddress: new PublicKey('GGPEvdnWEoMMJ2AAx4TBDPw4oLxgEnBc1dgS1eMYWeCn'),
		rewardBVaultAddress: new PublicKey('G98SNCwFUfHUBGNsx9r4ssPtfmbztGdzqDnwFbabJAVm'),
		stakingVaultAddress: getStakingVaultAddress(stSol2Pool),
	},
}

function getStakingVaultAddress(poolAddress: PublicKey) {
	return PublicKey.findProgramAddressSync(
		[Buffer.from('staking', 'utf-8'), poolAddress.toBuffer()],
		FARM_PROGRAM_ADDRESS,
	)[0]
}
