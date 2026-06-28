/**
 * 本地日志文件适配器
 *
 * @description 从本地文件读取 CI 日志
 */

import type { CIJob, CILog, CIStep, LogAdapter } from '../models/types'
import { stripAnsiFromLog } from '../utils/ansi-stripper'

/**
 * 本地文件适配器
 */
export class LocalFileAdapter implements LogAdapter {
	platform = 'local' as const

	/**
	 * 从本地文件读取日志
	 *
	 * @param filePath 日志文件路径
	 * @returns CILog 结构
	 */
	async getLog(filePath?: string): Promise<CILog> {
		if (!filePath) {
			throw new Error('Local file adapter requires a file path')
		}

		// 使用 fs 读取文件
		const fs = await import('node:fs/promises')
		const rawLog = await fs.readFile(filePath, 'utf-8')

		// 清理 ANSI 转义码
		const cleanedLog = stripAnsiFromLog(rawLog)

		// 转换为 CILog 格式（简化版，本地文件通常没有完整 job/step 结构）
		return this.parseLocalLog(cleanedLog, filePath)
	}

	/**
	 * 检查是否可用
	 */
	async isAvailable(): Promise<boolean> {
		return true // 本地文件适配器始终可用
	}

	/**
	 * 解析本地日志为 CILog 格式
	 *
	 * @param log 清理后的日志文本
	 * @param _filePath 文件路径（用于元数据）
	 * @returns CILog 结构
	 */
	private parseLocalLog(log: string, _filePath: string): CILog {
		// 本地文件通常是单个 job 的日志，创建一个简化结构
		const steps = this.splitIntoSteps(log)

		const job: CIJob = {
			name: 'Local Log',
			status: steps.some(s => s.status === 'failure') ? 'failure' : 'success',
			startedAt: new Date().toISOString(),
			completedAt: new Date().toISOString(),
			steps,
		}

		return {
			platform: 'local',
			runId: 'local-file',
			repo: 'local',
			branch: 'unknown',
			commit: 'unknown',
			triggeredAt: new Date().toISOString(),
			jobs: [job],
		}
	}

	/**
	 * 将日志拆分为 steps（基于常见分隔符）
	 *
	 * @param log 日志文本
	 * @returns CIStep 数组
	 */
	private splitIntoSteps(log: string): CIStep[] {
		// 常见的 step 分隔符
		const stepSeparators = [
			/^##\[group\]/gm, // GitHub Actions group
			/^Running step:/gm, // Generic step marker
			/^Step \d+:/gm, // Step number
			/^===+/gm, // 分隔线
			/^---+/gm, // 分隔线
		]

		// 尝试找到最合适的分隔符
		let bestSeparator = stepSeparators[0],
		 maxMatches = 0

		for (const separator of stepSeparators) {
			const matches = log.match(separator)
			if (matches && matches.length > maxMatches) {
				maxMatches = matches.length
				bestSeparator = separator
			}
		}

		// 如果没有找到分隔符，将整个日志作为一个 step
		if (maxMatches === 0) {
			return [
				{
					name: 'Full Log',
					status: this.detectFailureStatus(log),
					exitCode: this.detectExitCode(log),
					log,
				},
			]
		}

		// 按分隔符拆分
		const parts = log.split(bestSeparator).filter(p => p.trim())

		return parts.map((part, index) => ({
			name: `Step ${index + 1}`,
			status: this.detectFailureStatus(part),
			exitCode: this.detectExitCode(part),
			log: part.trim(),
		}))
	}

	/**
	 * 检测失败状态
	 *
	 * @param logPart 日志片段
	 * @returns 状态
	 */
	private detectFailureStatus(logPart: string): CIStep['status'] {
		const failureKeywords = [
			'error',
			'failed',
			'failure',
			'fatal',
			'exception',
			'Error:',
			'FAIL',
			'✖',
			'✗',
		]

		const lowerLog = logPart.toLowerCase()
		if (failureKeywords.some(kw => lowerLog.includes(kw.toLowerCase()))) {
			return 'failure'
		}

		return 'success'
	}

	/**
	 * 检测退出码
	 *
	 * @param logPart 日志片段
	 * @returns 退出码或 null
	 */
	private detectExitCode(logPart: string): number | null {
		const exitCodeRegex = /exit code:\s*(\d+)|exit\s+(\d+)|process exited with code\s+(\d+)/i
		const match = logPart.match(exitCodeRegex)

		if (match) {
			const code = parseInt(match[1] || match[2] || match[3], 10)
			return code
		}

		return null
	}
}
