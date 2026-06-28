import { describe, expect, it } from 'vitest'
import { preprocessLog } from '../../src/analyzer/preprocessor'

describe('preprocessor', () => {
	it('should extract failed steps', () => {
		const log = {
			platform: 'local',
			jobs: [{ steps: [{ status: 'failure', log: 'error' }] }],
		} as any
		const r = preprocessLog(log)
		expect(r.failedSteps.length).toBe(1)
	})
})
