import { describe, expect, it } from 'vitest'
import { stripAnsi, stripAnsiFromLog } from '../../src/utils/ansi-stripper'

describe('ansi-stripper', () => {
	it('should strip ANSI codes', () => {
		expect(stripAnsi('\x1B[31mError\x1B[0m')).toBe('Error')
	})
	it('should handle plain text', () => {
		expect(stripAnsi('Plain text')).toBe('Plain text')
	})
	it('should preserve newlines', () => {
		expect(stripAnsiFromLog('Line 1\n\x1B[31mLine 2\x1B[0m')).toBe('Line 1\nLine 2')
	})
})
