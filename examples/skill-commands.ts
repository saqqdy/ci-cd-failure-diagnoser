/**
 * Skill commands demo for CI/CD Failure Diagnoser
 *
 * Demonstrates the commands available in the Claude Code Skill.
 * Run with: npx tsx examples/skill-commands.ts
 */

import { diagnose } from '../src/index'
import { formatCategory, formatConfidence, truncate } from '../src/utils/format'

const ROOT = process.cwd()

/**
 * Simulates the `/diagnose <file>` command
 */
async function diagnoseCommand(file: string) {
	console.log(`\n🔍 /diagnose ${file}`)
	console.log('='.repeat(50))

	const result = await diagnose({ file })

	if (!result) {
		console.log('No diagnosis result found.')
		return
	}

	console.log(`\n📊 诊断结果：`)
	console.log(`  分类: ${formatCategory(result.rootCause.category)}`)
	console.log(`  置信度: ${formatConfidence(result.rootCause.confidence)}`)
	console.log(`  失败步骤: ${result.rootCause.failingStep}`)

	console.log(`\n🔍 根因分析：`)
	console.log(`  ${truncate(result.rootCause.summary, 80)}`)

	if (result.suggestedFix) {
		console.log(`\n💡 修复建议：`)
		console.log(`  类型: ${result.suggestedFix.type}`)
		console.log(`  ${result.suggestedFix.description}`)
	}

	console.log(`\n💭 可追问：/fix, /retry, /history`)
}

/**
 * Simulates the `/retry <test>` command
 */
async function retryCommand(testName: string) {
	console.log(`\n🎲 /retry ${testName}`)
	console.log('='.repeat(50))

	console.log(`\n⏭️  检测到 Flaky Test`)
	console.log(`   测试: ${testName}`)
	console.log(`   建议: 重试 3 次以确认是否为 flaky`)

	console.log(`\n💡 执行命令：`)
	console.log(`   npx vitest run ${testName} --retry=3`)
}

/**
 * Simulates the `/fix <error>` command
 */
async function fixCommand(errorType: string) {
	console.log(`\n🔧 /fix ${errorType}`)
	console.log('='.repeat(50))

	console.log(`\n📋 错误类型：${errorType}`)

	const fixes: Record<string, string> = {
		typescript: '检查类型定义，确保类型匹配',
		dependency: '更新依赖版本或修复冲突',
		config: '检查配置文件语法和路径',
	}

	const suggestion = fixes[errorType] || '检查错误日志获取更多信息'

	console.log(`\n💡 修复建议：`)
	console.log(`   ${suggestion}`)

	console.log(`\n🔗 相关文档：`)
	console.log(`   https://docs.example.com/errors/${errorType}`)
}

// ─── Run demos ────────────────────────────────────────────────────────

async function main() {
	console.log('🎯 CI/CD Failure Diagnoser — Skill Commands Demo\n')

	await diagnoseCommand('tests/fixtures/github-actions/typescript-error.txt')
	await retryCommand('src/utils/format.test.ts')
	await fixCommand('typescript')

	console.log('\n✅ 演示完成!')
	console.log('\n💡 安装 skill 后可用：/diagnose, /retry, /fix, /history')
}

main().catch(console.error)
