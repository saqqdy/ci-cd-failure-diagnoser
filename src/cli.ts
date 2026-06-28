/**
 * CLI entry point
 */

import { diagnose } from './index.js'

const VERSION = '0.1.0'

function printHelp(): void {
	console.log(`
🔍 CI/CD Failure Diagnoser v${VERSION}

Usage: npx ci-cd-failure-diagnoser diagnose <file>

Commands:
  diagnose <file>  Diagnose a local CI log file
  version          Show version
  help             Show help
`)
}

async function main(): Promise<void> {
	const args = process.argv.slice(2)
	const cmd = args[0]

	if (cmd === 'help' || !cmd) {
		printHelp()
		return
	}
	if (cmd === 'version') {
		console.log(`v${VERSION}`)
		return
	}
	if (cmd === 'diagnose' && args[1]) {
		await diagnose({ file: args[1] })
		return
	}

	console.error('Error: Missing file path')
	process.exit(1)
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
