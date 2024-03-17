
# Disclaimer
## Important:

This software is provided for testing and educational purposes only. Utilizing this software as provided may result in financial loss. The creator(s) of this software bear no responsibility for any financial or other damages incurred.

# Meteora Autocompounder Bot

- This is a bot that collects rewards earned in specified pools on [Meteora](https://meteora.ag) based on specified time interval

## How it works

- Every x hours bot executes transactions to claim rewards for each pool
- Claimed rewards are then swapped to one of pool liquidity tokens via [Jupiter aggregator](https://jup.ag)
  - If swap fails, remaining rewards will be swapped at next cycle
- Liquidity tokens are then deposited into liquidity pool

## Configuration

- Create config.json
- Based on [example config](https://config.sample.json) Specify pools, wallet private key, rpc url and compounding timeout (in hours)

- Available pools:
  - acUSD-USDC
  - afUSDC-USDC
  - stSOL-2Pool
  - aUSDC-4Pool
  - abBUSD-4Pool
  - aaUSDT-4Pool

## How to use

- Clone the repo

```sh
git clone https://github.com/AlgoTrdng/meteora-autocompounder.git
```

- Install dependencies and build

```
pnpm i
pnpm build
```

- Run with nodejs or in background with pm2

```sh
pnpm start
# or
pnpm pm2:start
```
