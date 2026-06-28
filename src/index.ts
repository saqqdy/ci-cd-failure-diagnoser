/**
 * CI/CD Failure Diagnoser
 *
 * @description AI-powered CI/CD failure diagnoser entry point
 */

// Core types
export * from './models/types'

// Configuration utilities
export { getDefaultConfig, mergeConfig, validateConfig } from './utils/config'

// Formatting utilities
export {
	formatCategory,
	formatCodeSnippet,
	formatConfidence,
	formatDiagnosis,
	formatDuration,
	formatLocation,
	truncate,
} from './utils/format'

/**
 * Placeholder for diagnose function
 * Will be implemented in Phase 1
 */
export async function diagnose(_options?: unknown): Promise<void> {
	console.info('🚧 CI/CD Failure Diagnoser - Phase 0 skeleton')
	console.info('💡 This functionality is under development')
	console.info('📋 Next: Phase 1 - Basic diagnosis capability (local file → AI diagnosis)')
}
