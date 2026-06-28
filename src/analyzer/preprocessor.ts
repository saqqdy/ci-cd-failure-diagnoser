/**
 * 日志预处理器
 *
 * @description 预处理日志，提取关键信息，准备 AI 分析输入
 */

import type { CILog, CIStep } from '../models/types'
import { extractErrorLines, parseLogLines } from '../utils/log-parser'

/**
 * 预处理结果
 */
export interface PreprocessedLog {
	/** 原始 CILog */
	original: CILog
	/** 失败的 steps */
	failedSteps: CIStep[]
	/** 提取的错误行 */
	errorLines: Array<{
		stepName: string
		lines: string[]
	}>
	/** 日志摘要（用于 AI 分析） */
	summary: string
}

/**
 * 预处理日志
 *
 * @param ciLog CI 日志结构
 * @returns 预处理结果
 */
export function preprocessLog(ciLog: CILog): PreprocessedLog {
	// 找出所有失败的 steps
	const failedSteps = ciLog.jobs
		.flatMap(job => job.steps)
		.filter(step => step.status === 'failure')

	// 提取每个失败 step 的错误行
	const errorLines = failedSteps.map(step => {
		const parsedLines = parseLogLines(step.log)
		const errors = extractErrorLines(parsedLines)

		return {
			stepName: step.name,
			lines: errors.map(l => l.content).slice(0, 50), // 限制最多50行，避免过大
		}
	})

	// 生成摘要
	const summary = generateSummary(ciLog, failedSteps, errorLines)

	return {
		original: ciLog,
		failedSteps,
		errorLines,
		summary,
	}
}

/**
 * 生成日志摘要（用于 AI 分析）
 *
 * @param ciLog CI 日志
 * @param failedSteps 失败的 steps
 * @param errorLines 错误行
 * @returns 摘要文本
 */
function generateSummary(
	ciLog: CILog,
	failedSteps: CIStep[],
	errorLines: Array<{ stepName: string; lines: string[] }>
): string {
	const parts: string[] = []

	// 基本信息
	parts.push(`# CI Log Summary`)
	parts.push(`Platform: ${ciLog.platform}`)
	parts.push(`Run ID: ${ciLog.runId}`)
	parts.push(`Branch: ${ciLog.branch}`)
	parts.push(`Commit: ${ciLog.commit}`)
	parts.push('')

	// 失败信息
	parts.push(`## Failed Steps (${failedSteps.length})`)

	for (const step of failedSteps) {
		parts.push(`- **${step.name}** (exit code: ${step.exitCode || 'unknown'})`)
	}

	parts.push('')

	// 错误详情
	parts.push(`## Error Details`)

	for (const { stepName, lines } of errorLines) {
		parts.push(`### Step: ${stepName}`)
		parts.push('')
		parts.push('Key error lines:')

		for (const line of lines.slice(0, 20)) {
			// 每个step最多20行
			parts.push(`  ${line}`)
		}

		parts.push('')
	}

	return parts.join('\n')
}

/**
 * 截断超长日志
 *
 * @param log 日志文本
 * @param maxLength 最大长度（字符）
 * @returns 截断后的日志
 */
export function truncateLog(log: string, maxLength: number = 10000): string {
	if (log.length <= maxLength) {
		return log
	}

	// 保留前 40% 和后 60%
	const headLength = Math.floor(maxLength * 0.4)
	const tailLength = maxLength - headLength

	const head = log.slice(0, headLength)
	const tail = log.slice(-tailLength)

	return `${head}\n\n... [truncated ${log.length - maxLength} characters] ...\n\n${tail}`
}
