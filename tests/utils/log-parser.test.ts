import { describe, expect, it } from 'vitest'
import { extractErrorLines, parseLogLine } from '../../src/utils/log-parser'

describe('log-parser', () => {
	it('should parse plain line', () => {
		const r = parseLogLine('Test message', 1)
		expect(r.content).toBe('Test message')
	})
	it('should extract error level', () => {
		const r = parseLogLine('ERROR: Failed', 1)
		expect(r.level).toBe('error')
	})
	it('should extract errors', () => {
		const lines = [
			{ level: 'error', content: 'E1' },
			{ level: 'info', content: 'I1' },
		] as any
		expect(extractErrorLines(lines).length).toBe(1)
	})
})
