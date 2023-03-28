import {
	AddressLookupTableAccount,
	PublicKey,
	TransactionMessage,
	VersionedTransaction,
} from '@solana/web3.js'
import fetch from 'node-fetch'

import { connection } from './global.js'

const QUOTE_URL = 'https://quote-api.jup.ag/v4/quote?slippageBps=100'
const IX_URL = 'https://quote-api.jup.ag/v4/swap'

type Route = {
	inAmount: string
	outAmount: string
	priceImpactPct: number
	amount: string
	slippageBps: number
	otherAmountThreshold: string
	swapMode: 'ExactIn' | 'ExactOut'
}

type QuoteRes = {
	data: Route[]
}

type IxRes = { swapTransaction: string }

export type SwapInstructionParams = {
	inputAmount: bigint
	inputMintAddress: PublicKey
	outputMintAddress: PublicKey
	ownerAddress: PublicKey
}

export async function buildSwapInstruction({
	inputAmount,
	inputMintAddress,
	outputMintAddress,
	ownerAddress,
}: SwapInstructionParams) {
	const urlParams = new URLSearchParams({
		amount: inputAmount.toString(),
		inputMint: inputMintAddress.toString(),
		outputMint: outputMintAddress.toString(),
	})
	const { data: routes } = (await (
		await fetch(`${QUOTE_URL}&${urlParams.toString()}`)
	).json()) as QuoteRes
	const { swapTransaction } = (await (
		await fetch(IX_URL, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				route: routes[0],
				userPublicKey: ownerAddress.toString(),
				wrapUnwrapSOL: false,
			}),
		})
	).json()) as IxRes

	const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'))
	const atlsAddresses = tx.message.addressTableLookups.map(({ accountKey }) => accountKey)
	const atlsAis = await connection.getMultipleAccountsInfo(atlsAddresses)
	const atls = atlsAis.map((ai, i) => {
		if (!ai?.data) {
			throw Error('Could not load address lookup table')
		}
		return new AddressLookupTableAccount({
			key: atlsAddresses[i],
			state: AddressLookupTableAccount.deserialize(ai.data),
		})
	})
	return {
		messageV0: TransactionMessage.decompile(tx.message, {
			addressLookupTableAccounts: atls,
		}).compileToV0Message(),
		addressTableLookups: atls,
	}
}
