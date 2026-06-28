import type { DiagnosisResult, FailureCategory } from '../../src/models/types'
import { describe, expect, it } from 'vitest'
import {
	formatCategory,
	formatCodeSnippet,
	formatConfidence,
	formatDiagnosis,
	formatDuration,
	formatLocation,
	truncate,
} from '../../src/utils/format'

describe('formatCategory', () => {
	it('formats category as emoji + label', () => {
		expect(formatCategory('compile_error')).toContain('🔨')
		expect(formatCategory('compile_error')).toContain('编译错误')
		expect(formatCategory('test_failure')).toContain('❌')
		expect(formatCategory('unknown')).toContain('❓')
	})

	it('handles all categories', () => {
		const categories: FailureCategory[] = [
			'compile_error',
			'test_failure',
			'lint_error',
			'env_issue',
			'timeout',
			'dependency_conflict',
			'permission_error',
			'config_error',
			'resource_limit',
			'network_error',
			'unknown',
		]
		for (const cat of categories) {
			expect(formatCategory(cat)).toBeTruthy()
		}
	})
})

describe('formatConfidence', () => {
	it('formats high confidence', () => {
		expect(formatConfidence(0.9)).toContain('🟢')
	})
	it('formats medium confidence', () => {
		expect(formatConfidence(0.7)).toContain('🟡')
	})
	it('formats low confidence', () => {
		expect(formatConfidence(0.5)).toContain('🟠')
	})
	it('formats very low confidence', () => {
		expect(formatConfidence(0.3)).toContain('🔴')
	})
})

describe('formatDuration', () => {
	it('formats milliseconds', () => {
		expect(formatDuration(500)).toBe('500ms')
	})
	it('formats seconds', () => {
		expect(formatDuration(5000)).toBe('5s')
	})
	it('formats minutes', () => {
		expect(formatDuration(120000)).toBe('2m')
	})
	it('formats minutes and seconds', () => {
		expect(formatDuration(90000)).toBe('1m 30s')
	})
})

describe('truncate', () => {
	it('does not truncate short strings', () => {
		expect(truncate('hello', 10)).toBe('hello')
	})
	it('truncates long strings', () => {
		expect(truncate('hello world', 8)).toBe('hello w…')
	})
})

describe('formatLocation', () => {
	it('formats file only', () => {
		expect(formatLocation('src/index.ts')).toBe('`src/index.ts`')
	})
	it('formats file with line', () => {
		expect(formatLocation('src/index.ts', 42)).toBe('`src/index.ts:42`')
	})
	it('formats file with line and column', () => {
		expect(formatLocation('src/index.ts', 42, 10)).toBe('`src/index.ts:42:10`')
	})
})

describe('formatCodeSnippet', () => {
	it('formats code with line numbers', () => {
		const result = formatCodeSnippet('const x = 1\nconst y = 2', 1)
		expect(result).toContain('   1 |')
		expect(result).toContain('   2 |')
	})
	it('supports custom start line', () => {
		const result = formatCodeSnippet('const x = 1', 100)
		expect(result).toContain(' 100 |')
	})
})

describe('formatDiagnosis', () => {
	it('formats a full diagnosis result', () => {
		const result: DiagnosisResult = {
			rootCause: {
				category: 'compile_error',
				confidence: 0.85,
				summary: 'TypeScript type error in src/index.ts',
				evidence: ['error TS2322: Type "string" is not assignable to type "number"'],
				failingStep: 'Build',
			},
			cascadingErrors: [],
			warnings: [],
			isFlaky: false,
			suggestedFix: {
				type: 'code_fix',
				confidence: 0.9,
				description: 'Change variable type from string to number',
				commands: ['npx tsc --noEmit'],
			},
		}
		const formatted = formatDiagnosis(result)
		expect(formatted).toContain('🔨')
		expect(formatted).toContain('🟢')
		expect(formatted).toContain('TypeScript type error')
		expect(formatted).toContain('修复建议')
		expect(formatted).toContain('npx tsc --noEmit')
	})
})
