/**
 * Cache usage example for CI/CD Failure Diagnoser
 *
 * Demonstrates how to use caching to avoid redundant analysis operations.
 * Run with: npx tsx examples/with-cache.ts
 */

import { diagnose, getDefaultConfig, mergeConfig } from '../src/index'
import { formatDuration } from '../src/utils/format'

const ROOT = process.cwd()

async function main() {
	console.log('💾 CI/CD Failure Diagnoser — Cache Usage Example\n')

	// Create config with cache enabled
	const config = mergeConfig({
		enableCache: true,
		cacheDir: '.ci-diagnoser-cache',
		cacheTTL: 3600, // 1 hour
	})

	console.log('Configuration:')
	console.log('  - Cache enabled:', config.enableCache)
	console.log('  - Cache directory:', config.cacheDir)
	console.log('  - TTL:', config.cacheTTL, 'seconds\n')

	// ─── First call: cache miss ──────────────────────────────────────
	console.log('🔹 First call (cache miss):')
	const start1 = performance.now()

	const result1 = await diagnose({
		file: 'tests/fixtures/github-actions/typescript-error.txt',
	})

	const elapsed1 = performance.now() - start1
	console.log(`  Duration: ${formatDuration(Math.round(elapsed1))}`)
	console.log(`  Category: ${result1?.rootCause.category || 'unknown'}\n`)

	// ─── Second call: cache hit ───────────────────────────────────────
	console.log('🔹 Second call (potential cache hit):')
	const start2 = performance.now()

	const result2 = await diagnose({
		file: 'tests/fixtures/github-actions/typescript-error.txt',
	})

	const elapsed2 = performance.now() - start2
	console.log(`  Duration: ${formatDuration(Math.round(elapsed2))}`)
	if (elapsed1 > elapsed2 * 2) {
		console.log(`  Speedup: ~${Math.round(elapsed1 / elapsed2)}x faster!\n`)
	}

	// ─── Show config ──────────────────────────────────────────────────
	console.log('🔹 Default config:')
	const defaultConfig = getDefaultConfig()
	console.log(`  Max log size: ${defaultConfig.maxLogSize} bytes`)
	console.log(`  Max iterations: ${defaultConfig.analyzerConfig.maxIterations}`)
	console.log(`  Timeout: ${formatDuration(defaultConfig.analyzerConfig.timeoutMs)}\n`)

	console.log('✅ Cache example completed!')
}

main().catch(console.error)
