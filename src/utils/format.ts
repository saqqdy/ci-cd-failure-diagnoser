/**
 * Formatting utility functions for CI/CD Failure Diagnoser
 */

import type { DiagnosisResult, FailureCategory } from '../models/types'

/** Format failure category as emoji + label */
export function formatCategory(category: FailureCategory): string {
	const labels: Record<FailureCategory, string> = {
		compile_error: '🔨 编译错误',
		test_failure: '❌ 测试失败',
		lint_error: '⚠️ 代码检查',
		env_issue: '🌍 环境问题',
		timeout: '⏱️ 执行超时',
		dependency_conflict: '📦 依赖冲突',
		permission_error: '🔒 权限错误',
		config_error: '⚙️ 配置错误',
		resource_limit: '💾 资源限制',
		network_error: '🌐 网络问题',
		unknown: '❓ 未知错误',
	}
	return labels[category] || category
}

/** Format diagnosis result as Markdown */
export function formatDiagnosis(result: DiagnosisResult): string {
	const lines: string[] = []

	lines.push(`## ${formatCategory(result.rootCause.category)}`)
	lines.push('')
	lines.push(`**置信度**: ${formatConfidence(result.rootCause.confidence)}`)
	lines.push(`**失败步骤**: ${result.rootCause.failingStep}`)
	lines.push('')

	if (result.rootCause.summary) {
		lines.push('### 🔍 根因分析')
		lines.push(result.rootCause.summary)
		lines.push('')
	}

	if (result.rootCause.evidence.length > 0) {
		lines.push('### 📋 关键证据')
		for (const ev of result.rootCause.evidence) {
			lines.push(`- ${truncate(ev, 100)}`)
		}
		lines.push('')
	}

	if (result.cascadingErrors.length > 0) {
		lines.push('### ⚠️ 级联错误')
		for (const err of result.cascadingErrors) {
			lines.push(`- ${err.summary} (${err.relatedSteps.join(', ')})`)
		}
		lines.push('')
	}

	if (result.warnings.length > 0) {
		lines.push('### 💡 警告')
		for (const warn of result.warnings) {
			lines.push(`- ${warn.summary}`)
		}
		lines.push('')
	}

	if (result.isFlaky) {
		lines.push('### 🎲 Flaky Test 检测')
		lines.push(`- 指纹: ${result.flakyFingerprint || '未生成'}`)
		lines.push('')
	}

	if (result.suggestedFix) {
		lines.push('### 💡 修复建议')
		lines.push(`- 类型: ${result.suggestedFix.type}`)
		lines.push(`- 描述: ${result.suggestedFix.description}`)
		if (result.suggestedFix.commands) {
			lines.push('- 命令:')
			for (const cmd of result.suggestedFix.commands) {
				lines.push(`  - \`${cmd}\``)
			}
		}
		lines.push('')
	}

	return lines.join('\n')
}

/** Format confidence level with color indicator */
export function formatConfidence(confidence: number): string {
	if (confidence >= 0.8) return '🟢 高 (≥80%)'
	if (confidence >= 0.6) return '🟡 中 (≥60%)'
	if (confidence >= 0.4) return '🟠 低 (≥40%)'
	return '🔴 很低 (<40%)'
}

/** Format duration in ms to human-readable */
export function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms}ms`
	const seconds = Math.round(ms / 1000)
	if (seconds < 60) return `${seconds}s`
	const minutes = Math.floor(seconds / 60)
	const secs = seconds % 60
	return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`
}

/** Truncate a string to maxLen, adding ellipsis if needed */
export function truncate(str: string, maxLen: number): string {
	if (str.length <= maxLen) return str
	return `${str.slice(0, maxLen - 1)}…`
}

/** Format error location (file:line:column) */
export function formatLocation(file: string, line?: number, column?: number): string {
	if (!line) return `\`${file}\``
	if (!column) return `\`${file}:${line}\``
	return `\`${file}:${line}:${column}\``
}

/** Format a code snippet with line numbers */
export function formatCodeSnippet(code: string, startLine: number = 1): string {
	const lines = code.split('\n')
	const formatted = lines.map((line, i) => {
		const num = startLine + i
		return `${num.toString().padStart(4)} | ${line}`
	})
	return formatted.join('\n')
}
