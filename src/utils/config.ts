/**
 * Configuration management for CI/CD Failure Diagnoser
 */

import type { DiagnoserConfig } from '../models/types'

/** Default configuration */
const DEFAULT_CONFIG: DiagnoserConfig = {
	maxLogSize: 1024 * 1024, // 1MB
	enableCache: true,
	cacheDir: '.ci-diagnoser-cache',
	cacheTTL: 3600, // 1 hour
	excludePatterns: ['node_modules/', 'dist/', 'coverage/', '.git/', '*.log'],
	analyzerConfig: {
		maxIterations: 5,
		timeoutMs: 30000,
		modelPreferences: {
			classification: 'haiku',
			diagnosis: 'sonnet',
			solution: 'sonnet',
		},
	},
}

/** Deep merge user config with defaults */
export function mergeConfig(user: Partial<DiagnoserConfig>): DiagnoserConfig {
	return {
		...DEFAULT_CONFIG,
		...user,
		cache: {
			enabled: user.enableCache ?? DEFAULT_CONFIG.enableCache,
			dir: user.cacheDir ?? DEFAULT_CONFIG.cacheDir,
			ttl: user.cacheTTL ?? DEFAULT_CONFIG.cacheTTL,
		},
		excludePatterns: user.excludePatterns ?? DEFAULT_CONFIG.excludePatterns,
		analyzerConfig: {
			...DEFAULT_CONFIG.analyzerConfig,
			...user.analyzerConfig,
			modelPreferences: {
				...DEFAULT_CONFIG.analyzerConfig.modelPreferences,
				...user.analyzerConfig?.modelPreferences,
			},
		},
	}
}

/** Get default configuration (fresh copy) */
export function getDefaultConfig(): DiagnoserConfig {
	return structuredClone(DEFAULT_CONFIG)
}

/** Validate configuration */
export function validateConfig(config: DiagnoserConfig): boolean {
	if (config.maxLogSize < 0) return false
	if (config.cacheTTL < 0) return false
	if (config.analyzerConfig.maxIterations < 1) return false
	if (config.analyzerConfig.timeoutMs < 1000) return false
	return true
}
