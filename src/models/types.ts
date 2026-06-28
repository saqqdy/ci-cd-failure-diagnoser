/**
 * CI/CD Failure Diagnoser - Core Data Models
 *
 * @description 统一数据模型定义，覆盖 CI 日志、诊断结果、修复建议等
 */

// ============================================================================
// CI Log Models
// ============================================================================

/**
 * CI 平台类型
 */
export type CIPlatform = 'github' | 'gitlab' | 'jenkins' | 'local'

/**
 * 统一 CI 日志模型
 */
export interface CILog {
	/** CI 平台 */
	platform: CIPlatform
	/** Run ID */
	runId: string
	/** 仓库路径（owner/repo） */
	repo: string
	/** 分支名 */
	branch: string
	/** Commit SHA */
	commit: string
	/** 触发时间 */
	triggeredAt: string
	/** Job 列表 */
	jobs: CIJob[]
}

/**
 * CI Job 模型
 */
export interface CIJob {
	/** Job 名称 */
	name: string
	/** Job 状态 */
	status: 'success' | 'failure' | 'cancelled' | 'skipped'
	/** 开始时间 */
	startedAt: string
	/** 完成时间 */
	completedAt: string
	/** Step 列表 */
	steps: CIStep[]
}

/**
 * CI Step 模型
 */
export interface CIStep {
	/** Step 名称 */
	name: string
	/** Step 状态 */
	status: 'success' | 'failure' | 'cancelled' | 'skipped'
	/** 退出码 */
	exitCode: number | null
	/** 原始日志文本 */
	log: string
}

// ============================================================================
// Diagnosis Models
// ============================================================================

/**
 * 失败分类
 */
export type FailureCategory =
	| 'compile_error' // 编译错误
	| 'test_failure' // 测试失败
	| 'lint_error' // 代码检查失败
	| 'env_issue' // 环境问题
	| 'timeout' // 超时
	| 'dependency_conflict' // 依赖冲突
	| 'permission_error' // 权限错误
	| 'config_error' // 配置错误
	| 'resource_limit' // 资源限制（OOM、磁盘满等）
	| 'network_error' // 网络问题
	| 'unknown' // 未知

/**
 * 诊断结果模型
 */
export interface DiagnosisResult {
	/** 根因分析 */
	rootCause: {
		/** 失败分类 */
		category: FailureCategory
		/** 置信度（0-1） */
		confidence: number
		/** 一句话根因 */
		summary: string
		/** 日志中的关键证据行 */
		evidence: string[]
		/** 失败的 Step 名称 */
		failingStep: string
	}
	/** 级联错误列表 */
	cascadingErrors: {
		/** 错误摘要 */
		summary: string
		/** 相关 Step 名称 */
		relatedSteps: string[]
	}[]
	/** 警告列表 */
	warnings: {
		/** 警告摘要 */
		summary: string
		/** 警告行内容 */
		line: string
	}[]
	/** 是否为 Flaky Test */
	isFlaky: boolean
	/** Flaky 指纹（如果是 Flaky） */
	flakyFingerprint?: string
	/** 修复建议 */
	suggestedFix?: FixSuggestion
}

// ============================================================================
// Fix Suggestion Models
// ============================================================================

/**
 * 修复建议类型
 */
export type FixType =
	| 'code_fix' // 代码修复
	| 'config_fix' // 配置修复
	| 'dependency_fix' // 依赖修复
	| 'retry' // 重试
	| 'skip_test' // 跳过测试
	| 'manual' // 需人工处理

/**
 * 修复建议模型
 */
export interface FixSuggestion {
	/** 修复类型 */
	type: FixType
	/** 置信度（0-1） */
	confidence: number
	/** 自然语言描述 */
	description: string
	/** 统一 diff 格式的修复补丁 */
	patch?: string
	/** 需要修改的文件路径 */
	targetFiles?: string[]
	/** 建议执行的命令 */
	commands?: string[]
	/** 相关文档 / issue 链接 */
	references?: string[]
}

// ============================================================================
// Pattern Engine Models
// ============================================================================

/**
 * 失败模式模型（用于模式匹配）
 */
export interface FailurePattern {
	/** 模式 ID */
	id: string
	/** 错误消息 hash */
	errorHash: string
	/** 失败分类 */
	category: FailureCategory
	/** 根因摘要 */
	rootCauseSummary: string
	/** 上次诊断结果 */
	lastDiagnosis: DiagnosisResult
	/** 出现次数 */
	occurrenceCount: number
	/** 最后出现时间 */
	lastSeen: string
	/** 首次出现时间 */
	firstSeen: string
}

/**
 * Flaky Test 指纹模型
 */
export interface FlakyFingerprint {
	/** Test ID（test file + test name 的 hash） */
	testId: string
	/** Failure pattern description */
	pattern: string
	/** 历史失败率（0-1） */
	failureRate: number
	/** 最后出现时间 */
	lastSeen: string
	/** 建议操作 */
	suggestedAction: 'retry' | 'skip' | 'fix'
}

// ============================================================================
// Config Models
// ============================================================================

/**
 * 分析器配置
 */
export interface AnalyzerConfig {
	/** 最大迭代次数 */
	maxIterations: number
	/** 超时时间(ms) */
	timeoutMs: number
	/** 模型偏好 */
	modelPreferences: {
		classification: string
		diagnosis: string
		solution: string
	}
}

/**
 * 缓存配置
 */
export interface CacheConfig {
	/** 是否启用缓存 */
	enabled: boolean
	/** 缓存目录 */
	dir: string
	/** 缓存 TTL(秒) */
	ttl: number
}

/**
 * 诊断器全局配置
 */
export interface DiagnoserConfig {
	/** 最大日志大小(字节) */
	maxLogSize: number
	/** 是否启用缓存 */
	enableCache: boolean
	/** 缓存目录 */
	cacheDir: string
	/** 缓存 TTL(秒) */
	cacheTTL: number
	/** 排除模式 */
	excludePatterns: string[]
	/** 缓存配置（由 mergeConfig 生成） */
	cache?: CacheConfig
	/** 分析器配置 */
	analyzerConfig: AnalyzerConfig
}

// ============================================================================
// Adapter Models
// ============================================================================

/**
 * 日志获取适配器接口
 */
export interface LogAdapter {
	/** 平台名称 */
	platform: CIPlatform
	/** 获取最近的失败 Run */
	getLatestFailedRun?: () => Promise<string>
	/** 获取指定 Run 的日志 */
	getLog: (runId?: string) => Promise<CILog>
	/** 检查是否可用（如 gh CLI 是否安装） */
	isAvailable: () => Promise<boolean>
}

/**
 * 诊断选项
 */
export interface DiagnoseOptions {
	/** Run ID（可选） */
	runId?: string
	/** 平台（可选） */
	platform?: CIPlatform
	/** 本地日志文件路径（可选） */
	file?: string
}
