const idl = {
	version: '0.2.0',
	name: 'farming',
	instructions: [
		{
			name: 'initializePool',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'stakingMint',
					isMut: !1,
					isSigner: !1,
				},
				{
					name: 'stakingVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardAMint',
					isMut: !1,
					isSigner: !1,
				},
				{
					name: 'rewardAVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardBMint',
					isMut: !1,
					isSigner: !1,
				},
				{
					name: 'rewardBVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'authority',
					isMut: !0,
					isSigner: !0,
				},
				{
					name: 'base',
					isMut: !1,
					isSigner: !0,
				},
				{
					name: 'systemProgram',
					isMut: !1,
					isSigner: !1,
				},
				{
					name: 'tokenProgram',
					isMut: !1,
					isSigner: !1,
				},
				{
					name: 'rent',
					isMut: !1,
					isSigner: !1,
				},
			],
			args: [
				{
					name: 'rewardDuration',
					type: 'u64',
				},
			],
		},
		{
			name: 'createUser',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'user',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'owner',
					isMut: !0,
					isSigner: !0,
				},
				{
					name: 'systemProgram',
					isMut: !1,
					isSigner: !1,
				},
			],
			args: [],
		},
		{
			name: 'pause',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'authority',
					isMut: !1,
					isSigner: !0,
				},
			],
			args: [],
		},
		{
			name: 'unpause',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'authority',
					isMut: !1,
					isSigner: !0,
				},
			],
			args: [],
		},
		{
			name: 'deposit',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'stakingVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'user',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'owner',
					isMut: !1,
					isSigner: !0,
				},
				{
					name: 'stakeFromAccount',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'tokenProgram',
					isMut: !1,
					isSigner: !1,
				},
			],
			args: [
				{
					name: 'amount',
					type: 'u64',
				},
			],
		},
		{
			name: 'withdraw',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'stakingVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'user',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'owner',
					isMut: !1,
					isSigner: !0,
				},
				{
					name: 'stakeFromAccount',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'tokenProgram',
					isMut: !1,
					isSigner: !1,
				},
			],
			args: [
				{
					name: 'sptAmount',
					type: 'u64',
				},
			],
		},
		{
			name: 'authorizeFunder',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'authority',
					isMut: !1,
					isSigner: !0,
				},
			],
			args: [
				{
					name: 'funderToAdd',
					type: 'publicKey',
				},
			],
		},
		{
			name: 'deauthorizeFunder',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'authority',
					isMut: !1,
					isSigner: !0,
				},
			],
			args: [
				{
					name: 'funderToRemove',
					type: 'publicKey',
				},
			],
		},
		{
			name: 'fund',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'stakingVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardAVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardBVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'funder',
					isMut: !1,
					isSigner: !0,
				},
				{
					name: 'fromA',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'fromB',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'tokenProgram',
					isMut: !1,
					isSigner: !1,
				},
			],
			args: [
				{
					name: 'amountA',
					type: 'u64',
				},
				{
					name: 'amountB',
					type: 'u64',
				},
			],
		},
		{
			name: 'claim',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'stakingVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardAVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardBVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'user',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'owner',
					isMut: !1,
					isSigner: !0,
				},
				{
					name: 'rewardAAccount',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardBAccount',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'tokenProgram',
					isMut: !1,
					isSigner: !1,
				},
			],
			args: [],
		},
		{
			name: 'withdrawExtraToken',
			accounts: [
				{
					name: 'pool',
					isMut: !1,
					isSigner: !1,
				},
				{
					name: 'stakingVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'withdrawToAccount',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'authority',
					isMut: !1,
					isSigner: !0,
				},
				{
					name: 'tokenProgram',
					isMut: !1,
					isSigner: !1,
				},
			],
			args: [],
		},
		{
			name: 'closeUser',
			accounts: [
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'user',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'owner',
					isMut: !0,
					isSigner: !0,
				},
			],
			args: [],
		},
		{
			name: 'closePool',
			accounts: [
				{
					name: 'refundee',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'stakingRefundee',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardARefundee',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardBRefundee',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'pool',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'authority',
					isMut: !1,
					isSigner: !0,
				},
				{
					name: 'stakingVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardAVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'rewardBVault',
					isMut: !0,
					isSigner: !1,
				},
				{
					name: 'tokenProgram',
					isMut: !1,
					isSigner: !1,
				},
			],
			args: [],
		},
	],
	accounts: [
		{
			name: 'pool',
			type: {
				kind: 'struct',
				fields: [
					{
						name: 'authority',
						type: 'publicKey',
					},
					{
						name: 'paused',
						type: 'bool',
					},
					{
						name: 'stakingMint',
						type: 'publicKey',
					},
					{
						name: 'stakingVault',
						type: 'publicKey',
					},
					{
						name: 'rewardAMint',
						type: 'publicKey',
					},
					{
						name: 'rewardAVault',
						type: 'publicKey',
					},
					{
						name: 'rewardBMint',
						type: 'publicKey',
					},
					{
						name: 'rewardBVault',
						type: 'publicKey',
					},
					{
						name: 'baseKey',
						type: 'publicKey',
					},
					{
						name: 'rewardDuration',
						type: 'u64',
					},
					{
						name: 'rewardDurationEnd',
						type: 'u64',
					},
					{
						name: 'lastUpdateTime',
						type: 'u64',
					},
					{
						name: 'rewardARate',
						type: 'u64',
					},
					{
						name: 'rewardBRate',
						type: 'u64',
					},
					{
						name: 'rewardAPerTokenStored',
						type: 'u128',
					},
					{
						name: 'rewardBPerTokenStored',
						type: 'u128',
					},
					{
						name: 'userStakeCount',
						type: 'u32',
					},
					{
						name: 'funders',
						type: {
							array: ['publicKey', 4],
						},
					},
					{
						name: 'poolBump',
						type: 'u8',
					},
					{
						name: 'totalStaked',
						type: 'u64',
					},
				],
			},
		},
		{
			name: 'user',
			type: {
				kind: 'struct',
				fields: [
					{
						name: 'pool',
						type: 'publicKey',
					},
					{
						name: 'owner',
						type: 'publicKey',
					},
					{
						name: 'rewardAPerTokenComplete',
						type: 'u128',
					},
					{
						name: 'rewardBPerTokenComplete',
						type: 'u128',
					},
					{
						name: 'rewardAPerTokenPending',
						type: 'u64',
					},
					{
						name: 'rewardBPerTokenPending',
						type: 'u64',
					},
					{
						name: 'balanceStaked',
						type: 'u64',
					},
					{
						name: 'nonce',
						type: 'u8',
					},
				],
			},
		},
	],
	events: [
		{
			name: 'EventDeposit',
			fields: [
				{
					name: 'amount',
					type: 'u64',
					index: !1,
				},
			],
		},
		{
			name: 'EventWithdraw',
			fields: [
				{
					name: 'amount',
					type: 'u64',
					index: !1,
				},
			],
		},
		{
			name: 'EventFund',
			fields: [
				{
					name: 'amountA',
					type: 'u64',
					index: !1,
				},
				{
					name: 'amountB',
					type: 'u64',
					index: !1,
				},
			],
		},
		{
			name: 'EventClaim',
			fields: [
				{
					name: 'amountA',
					type: 'u64',
					index: !1,
				},
				{
					name: 'amountB',
					type: 'u64',
					index: !1,
				},
			],
		},
		{
			name: 'EventAuthorizeFunder',
			fields: [
				{
					name: 'newFunder',
					type: 'publicKey',
					index: !1,
				},
			],
		},
		{
			name: 'EventUnauthorizeFunder',
			fields: [
				{
					name: 'funder',
					type: 'publicKey',
					index: !1,
				},
			],
		},
	],
	errors: [
		{
			code: 6000,
			name: 'InsufficientFundWithdraw',
			msg: 'Insufficient funds to withdraw.',
		},
		{
			code: 6001,
			name: 'AmountMustBeGreaterThanZero',
			msg: 'Amount must be greater than zero.',
		},
		{
			code: 6002,
			name: 'SingleDepositTokenBCannotBeFunded',
			msg: 'Reward B cannot be funded - pool is single deposit.',
		},
		{
			code: 6003,
			name: 'PoolPaused',
			msg: 'Pool is paused.',
		},
		{
			code: 6004,
			name: 'DurationTooShort',
			msg: 'Duration cannot be shorter than one day.',
		},
		{
			code: 6005,
			name: 'FunderAlreadyAuthorized',
			msg: 'Provided funder is already authorized to fund.',
		},
		{
			code: 6006,
			name: 'MaxFunders',
			msg: 'Maximum funders already authorized.',
		},
		{
			code: 6007,
			name: 'CannotDeauthorizePoolAuthority',
			msg: 'Cannot deauthorize the primary pool authority.',
		},
		{
			code: 6008,
			name: 'CannotDeauthorizeMissingAuthority',
			msg: 'Authority not found for deauthorization.',
		},
		{
			code: 6009,
			name: 'MathOverflow',
			msg: 'Math operation overflow',
		},
	],
}
