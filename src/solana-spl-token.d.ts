declare module '@solana/spl-token' {
	export function getAssociatedTokenAddress(
		mint: PublicKey,
		owner: PublicKey,
		allowOwnerOffCurve?: boolean,
		programId?: PublicKey,
		associatedTokenProgramId?: PublicKey,
	): Promise<PublicKey>

	export function getAssociatedTokenAddressSync(
		mint: PublicKey,
		owner: PublicKey,
		allowOwnerOffCurve?: boolean,
		programId?: PublicKey,
		associatedTokenProgramId?: PublicKey,
	): PublicKey
}
