import { pools, PoolName } from './meteora/init.js'

export const rewardsCache = {} as Record<
	PoolName,
	{ unusedReward: bigint; unusedInput: bigint; unusedLP: bigint }
>

Object.keys(pools).forEach((pool) => {
	rewardsCache[pool as PoolName] = { unusedInput: 0n, unusedReward: 0n, unusedLP: 0n }
})
