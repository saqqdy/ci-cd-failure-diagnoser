/**
 * ANSI 转义码清除工具
 *
 * @description 清理日志中的 ANSI 颜色/样式代码，便于后续分析
 */

/**
 * ANSI 转义码正则表达式
 * 匹配所有 ANSI escape sequences (颜色、样式、光标移动等)
 * ESLint规则允许此处使用控制字符，因为ANSI码必须包含ESC字符(\x1b)
 */
// eslint-disable-next-line no-control-regex, regexp/no-control-character
const ANSI_REGEX = /\x1B\[[0-9;]*[a-zA-Z]|\x1B\][0-9;]*[a-zA-Z]|\x1B[()][AB012ab]"/g

/**
 * 清除 ANSI 转义码
 *
 * @param text Text containing ANSI escape codes
 * @returns 清理后的纯文本
 */
export function stripAnsi(text: string): string {
	return text.replace(ANSI_REGEX, '')
}

/**
 * 清除 ANSI 转义码并保留换行
 *
 * @param log 多行日志文本
 * @returns 清理后的日志（每行保留）
 */
export function stripAnsiFromLog(log: string): string {
	return log
		.split('\n')
		.map(line => stripAnsi(line))
		.join('\n')
}
