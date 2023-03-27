import { z } from 'zod'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const configLayout = z.object({
	walletPrivateKey: z
		.string()
		.transform((pkString) => new Uint8Array(pkString.split(',').map((x) => Number(x)))),
	pools: z.array(z.string()),
	rpcUrl: z.string().url(),
})

const configPath = path.join(__dirname, '../config.json')
let configUnsafe: Record<string, unknown>
try {
	const configStr = await fs.readFile(configPath, { encoding: 'utf-8' })
	configUnsafe = JSON.parse(configStr)
} catch (error) {
	console.log(error)
	console.error('Config `config.json` is either missing or is not valid json')
	throw Error('Invalid config')
}

const parseResult = configLayout.safeParse(configUnsafe)

if (!parseResult.success) {
	const errorsFormatted = Object.entries(parseResult.error)
		.map(([name, value]) => {
			if (value && '_errors' in value) return `${name}: ${value._errors.join(', ')}\n`
		})
		.filter(Boolean)
	console.error(errorsFormatted)
	throw Error('Invalid ENV config')
}

export const config = parseResult.data
