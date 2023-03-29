import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Jupiter } from '@jup-ag/core'

import JSBI from 'jsbi'
import {
	confirmTransaction,
	TxErrorResponse,
	TxSuccessResponse,
	TxUnconfirmedResponse,
} from 'solana-tx-utils'

export async function initJupiter(onwerKeyPair: Keypair, connection: Connection) {
	const jupiter = await Jupiter.load({
		connection,
		cluster: 'mainnet-beta',
		wrapUnwrapSOL: false,
		user: onwerKeyPair,
		routeCacheDuration: 10_000,
	})
	return jupiter
}

export type SwapInstructionParams = {
	inputAmount: bigint
	inputMintAddress: PublicKey
	outputMintAddress: PublicKey
}

export async function swap(
	{ inputAmount, inputMintAddress, outputMintAddress }: SwapInstructionParams,
	jupiter: Jupiter,
	connection: Connection,
) {
	const buildTx = async () => {
		const routes = await jupiter.computeRoutes({
			inputMint: inputMintAddress,
			outputMint: outputMintAddress,
			amount: JSBI.BigInt(inputAmount.toString()),
			slippageBps: 100,
		})
		const { lastValidBlockHeight, blockhash } = await connection.getLatestBlockhash()
		const { execute } = await jupiter.exchange({
			routeInfo: routes.routesInfos[0],
			blockhashWithExpiryBlockHeight: { lastValidBlockHeight, blockhash },
		})
		return {
			execute,
			lastValidBlockHeight,
		}
	}

	let txData = await buildTx()

	while (true) {
		const tryExecTxRes: TxSuccessResponse | TxErrorResponse | TxUnconfirmedResponse =
			await new Promise((resolve) => {
				txData.execute({
					onTransaction: async (txId) => {
						const res = await confirmTransaction({
							txId,
							connection,
							lastValidBlockHeight: txData.lastValidBlockHeight,
						})
						resolve(res)
					},
				})
			})

		switch (tryExecTxRes.status) {
			case 'SUCCESS': {
				return tryExecTxRes.data
			}
			case 'ERROR':
				return null
			case 'BLOCK_HEIGHT_EXCEEDED': {
				txData = await buildTx()
			}
		}
	}
}
