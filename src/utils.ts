import {
	AddressLookupTableAccount,
	ConfirmedTransactionMeta,
	Connection,
	MessageV0,
	PublicKey,
	Signer,
	TokenBalance,
	TransactionInstruction,
} from '@solana/web3.js'
import {
	buildAndSignTxFromInstructions,
	buildAndSignTxFromMessageV0,
	sendAndConfirmTransaction,
} from 'solana-tx-utils'

export type TransactionInput = (
	| {
			type: 'messageV0'
			input: MessageV0
	  }
	| {
			type: 'instructions'
			input: TransactionInstruction[]
	  }
) & {
	signers: Signer[]
	addressTableLookups?: AddressLookupTableAccount[]
}

export async function sendTransaction(input: TransactionInput, connection: Connection) {
	let txData = await buildTxData(input, connection)

	while (true) {
		const res = await sendAndConfirmTransaction({
			...txData,
			connection,
		})
		switch (res.status) {
			case 'SUCCESS': {
				return res.data
			}
			case 'BLOCK_HEIGHT_EXCEEDED': {
				txData = await buildTxData(input, connection)
			}
			case 'ERROR': {
				console.error(`Transaction with ID: ${res.txId} failed with error: ${res.error}`)
				console.log(res)
				return null
			}
		}
	}
}

function buildTxData(
	{ type, input, signers, addressTableLookups }: TransactionInput,
	connection: Connection,
) {
	if (type === 'instructions') {
		return buildAndSignTxFromInstructions(
			{
				instructions: input,
				addressLookupTables: addressTableLookups,
				signers,
			},
			connection,
		)
	}
	return buildAndSignTxFromMessageV0(
		{
			message: input,
			signers,
		},
		connection,
	)
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
