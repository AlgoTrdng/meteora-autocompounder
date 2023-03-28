import { Connection } from '@solana/web3.js'

import { config } from './config.js'

export const connection = new Connection(config.rpcUrl, 'confirmed')
export const COMPOUNDING_TIMEOUT = 1000 * 60 * 60 // 1 hour
