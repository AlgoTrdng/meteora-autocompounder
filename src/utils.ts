import {
	ConfirmedTransactionMeta,
	Connection,
	PublicKey,
	Signer,
	TokenBalance,
	TransactionInstruction,
} from '@solana/web3.js'
import { buildAndSignTxFromInstructions, sendAndConfirmTransaction } from 'solana-tx-utils'

export type TransactionInput = {
	instructions: TransactionInstruction[]
	signers: Signer[]
}

export async function sendTransaction(
	{ instructions, signers }: TransactionInput,
	connection: Connection,
) {
	let txData = await buildAndSignTxFromInstructions(
		{
			instructions,
			signers,
		},
		connection,
	)

	while (true) {
		const res = await sendAndConfirmTransaction({
			...txData,
			connection,
		})
		switch (res.status) {
			case 'SUCCESS': {
				return res.data
			}
			case 'ERROR': {
				console.error(`Transaction with ID: ${res.txId} failed with error: ${res.error}`)
				console.log(res)
				return null
			}
			case 'BLOCK_HEIGHT_EXCEEDED': {
				txData = await buildAndSignTxFromInstructions(
					{
						instructions,
						signers,
					},
					connection,
				)
			}
		}
	}
}

export function getTokenDiffAmount(
	txMeta: ConfirmedTransactionMeta,
	tokenMintAddress: PublicKey,
	ownerAddress: PublicKey,
) {
	const { preTokenBalances, postTokenBalances } = txMeta

	if (!preTokenBalances || !postTokenBalances) {
		throw Error('Token balances have not changed')
	}

	const preTokenBalance = getTokenBalance(preTokenBalances, tokenMintAddress, ownerAddress)
	const postTokenBalance = getTokenBalance(postTokenBalances, tokenMintAddress, ownerAddress)

	return postTokenBalance - preTokenBalance
}

function getTokenBalance(
	tokenBalances: TokenBalance[],
	mintAddress: PublicKey,
	ownerAddress: PublicKey,
) {
	const tokenBalance = tokenBalances.find(
		({ mint, owner }) => mint === mintAddress.toString() && owner === ownerAddress.toString(),
	)

	if (!tokenBalance) {
		throw Error(`Balance of ${mintAddress.toString()} has not changed`)
	}

	return BigInt(tokenBalance.uiTokenAmount.amount)
}
