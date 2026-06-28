/**
 * 通用日志解析工具
 *
 * @description 解析日志行，提取时间戳、级别、内容等
 */

/**
 * 日志行解析结果
 */
export interface LogLine {
	/** 原始行内容 */
	raw: string
	/** 时间戳（如果存在） */
	timestamp?: string
	/** 日志级别（如果存在） */
	level?: 'error' | 'warning' | 'info' | 'debug' | 'trace'
	/** 内容（去除时间戳和级别后） */
	content: string
	/** 行号 */
	lineNumber: number
}

/**
 * 时间戳正则表达式（常见格式）
 */
const TIMESTAMP_REGEX =
	/^(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?|\d{2}:\d{2}:\d{2}|\[\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\])\s*/

/**
 * 日志级别正则表达式
 */
const LEVEL_REGEX = /^(ERROR|WARN|WARNING|INFO|DEBUG|TRACE|ERR|INF)\s*:?\s*/i

/**
 * 解析单行日志
 *
 * @param line 日志行
 * @param lineNumber 行号
 * @returns 解析后的日志行
 */
export function parseLogLine(line: string, lineNumber: number): LogLine {
	const raw = line
	let timestamp: string | undefined,
	 level: LogLine['level'] | undefined,
	 content = line

	// 提取时间戳
	const timestampMatch = line.match(TIMESTAMP_REGEX)
	if (timestampMatch) {
		timestamp = timestampMatch[1]
		content = content.slice(timestampMatch[0].length)
	}

	// 提取日志级别
	const levelMatch = content.match(LEVEL_REGEX)
	if (levelMatch) {
		const levelStr = levelMatch[1].toUpperCase()
		if (levelStr === 'ERROR' || levelStr === 'ERR') level = 'error'
		else if (levelStr === 'WARN' || levelStr === 'WARNING') level = 'warning'
		else if (levelStr === 'INFO' || levelStr === 'INF') level = 'info'
		else if (levelStr === 'DEBUG') level = 'debug'
		else if (levelStr === 'TRACE') level = 'trace'
		content = content.slice(levelMatch[0].length)
	}

	return {
		raw,
		timestamp,
		level,
		content: content.trim(),
		lineNumber,
	}
}

/**
 * 解析多行日志
 *
 * @param log 多行日志文本
 * @returns 解析后的日志行数组
 */
export function parseLogLines(log: string): LogLine[] {
	return log
		.split('\n')
		.filter(line => line.trim().length > 0)
		.map((line, index) => parseLogLine(line, index + 1))
}

/**
 * 提取错误行
 *
 * @param lines 解析后的日志行
 * @returns 错误级别和警告级别的行
 */
export function extractErrorLines(lines: LogLine[]): LogLine[] {
	return lines.filter(line => line.level === 'error' || line.level === 'warning')
}
