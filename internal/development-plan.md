# CI/CD Failure Diagnoser — 详细开发计划

> CI 故障诊断器：读取 CI 日志，定位失败根因，生成修复建议

---

## 一、项目概述

### 1.1 定位

Claude Code Skill 插件，开发者在 CI 失败后触发，AI 自动分析日志、定位根因、给出最小修复方案。

### 1.2 核心价值

| 传统方式 | 本项目 |
|---------|--------|
| 手动翻几千行日志 | AI 语义理解，秒级定位根因 |
| 级联错误混淆判断 | 区分"根因错误 → 级联错误 → 无关警告" |
| flaky test 反复排查 | 指纹匹配，自动标记已知 flaky |
| 修复靠经验 | 生成最小修复 PR / patch |

### 1.3 触发场景

```bash
# 命令行触发
/diagnose                          # 分析最近一次 CI 失败
/diagnose --run 12345678           # 分析指定 run
/diagnose --platform gitlab        # 指定平台
/diagnose --file path/to/log.txt   # 分析本地日志文件

# Hook 自动触发（CI 失败后自动运行）
# 配置于 .claude/settings.json
```

### 1.4 支持平台

| 优先级 | 平台 | 接入方式 |
|--------|------|----------|
| P0 | GitHub Actions | `gh` CLI / REST API |
| P0 | 本地日志文件 | 文件读取 |
| P1 | GitLab CI | REST API |
| P2 | Jenkins | REST API / CLI |

---

## 二、架构设计

```
┌─────────────────────────────────────────────────┐
│                  Claude Code CLI                 │
│                 /diagnose 触发                    │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              Skill 入口 (index.md)               │
│          参数解析 → 流程编排 → 结果输出           │
└──────────────────────┬──────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
┌────────▼────┐ ┌──────▼──────┐ ┌───▼────────┐
│  Log Fetch  │ │ Log Analyzer│ │ Fix Suggest │
│  日志获取层  │ │ 日志分析层   │ │ 修复建议层   │
└────────┬────┘ └──────┬──────┘ └───┬────────┘
         │             │             │
┌────────▼────┐ ┌──────▼──────┐ ┌───▼────────┐
│   Platform   │ │   Pattern   │ │  Template   │
│   Adapters   │ │   Engine    │ │  Generator  │
│  平台适配器   │ │  模式引擎    │ │  模板生成器  │
└─────────────┘ └─────────────┘ └─────────────┘
```

### 2.1 分层职责

| 层 | 职责 | 关键决策 |
|----|------|----------|
| **Log Fetch** | 从平台拉取原始日志 | 统一输出格式，屏蔽平台差异 |
| **Log Analyzer** | 语义分析日志，定位根因 | AI 核心层，输出结构化诊断结果 |
| **Fix Suggest** | 生成修复建议 / patch | 基于诊断结果 + 代码上下文 |
| **Pattern Engine** | 已知失败模式匹配 + flaky 指纹 | 减少重复分析，加速已知问题识别 |
| **Platform Adapters** | 各 CI 平台 API 封装 | 统一接口，可扩展 |
| **Template Generator** | 修复代码生成 | 使用 AI 生成，人审核后应用 |

---

## 三、核心模块详细设计

### 3.1 Log Fetch — 日志获取层

**统一日志模型：**

```typescript
interface CILog {
  platform: 'github' | 'gitlab' | 'jenkins' | 'local'
  runId: string
  repo: string
  branch: string
  commit: string
  triggeredAt: string
  jobs: CIJob[]
}

interface CIJob {
  name: string
  status: 'success' | 'failure' | 'cancelled' | 'skipped'
  startedAt: string
  completedAt: string
  steps: CIStep[]
}

interface CIStep {
  name: string
  status: 'success' | 'failure' | 'cancelled' | 'skipped'
  exitCode: number | null
  log: string  // 原始日志文本
}
```

**GitHub Actions 适配器核心逻辑：**

```
1. gh run list --status=failure --limit=1  → 获取失败 run ID
2. gh run view <id> --log                  → 获取完整日志
3. gh api repos/{owner}/{repo}/actions/runs/{id}/jobs → 获取 job 详情
4. 解析为 CILog 统一格式
```

### 3.2 Log Analyzer — 日志分析层

**分析流程：**

```
原始日志
  │
  ├─ Phase 1: 预处理 ────── 去除 ANSI 转义码、时间戳标准化、截断超长步骤
  │
  ├─ Phase 2: 结构化 ────── 按 step 拆分、标记失败 step、提取错误行
  │
  ├─ Phase 3: AI 诊断 ───── 冷启动：全量 AI 分析
  │                        热启动：先匹配 Pattern Engine，命中则跳过 AI
  │
  └─ Phase 4: 结果汇总 ──── 输出 DiagnosisResult
```

**诊断结果模型：**

```typescript
interface DiagnosisResult {
  rootCause: {
    category: FailureCategory
    confidence: number       // 0-1
    summary: string          // 一句话根因
    evidence: string[]       // 日志中的关键证据行
    failingStep: string
  }
  cascadingErrors: {
    summary: string
    relatedSteps: string[]
  }[]
  warnings: {
    summary: string
    line: string
  }[]
  isFlaky: boolean
  flakyFingerprint?: string
  suggestedFix?: FixSuggestion
}

type FailureCategory =
  | 'compile_error'       // 编译错误
  | 'test_failure'        // 测试失败
  | 'lint_error'          // 代码检查失败
  | 'env_issue'           // 环境问题
  | 'timeout'             // 超时
  | 'dependency_conflict' // 依赖冲突
  | 'permission_error'    // 权限错误
  | 'config_error'        // 配置错误
  | 'resource_limit'      // 资源限制（OOM、磁盘满等）
  | 'network_error'       // 网络问题
  | 'unknown'             // 未知
```

**AI 诊断 Prompt 策略：**

采用两阶段 prompt：

1. **分类阶段**（轻量）：判断失败类别 + 置信度
2. **定位阶段**（深度）：对单个失败 step 做精细分析，提取根因证据

这样可以在大多数场景下节省 token —— 分类阶段只需处理失败 step，定位阶段只聚焦根因。

### 3.3 Pattern Engine — 模式引擎

**模式匹配策略：**

```
新日志进入
  │
  ├─ 精确匹配：error message hash → 已知模式库
  │             命中 → 直接返回历史诊断结果
  │
  ├─ 模糊匹配：embedding 相似度 → 相似历史案例
  │             相似度 > 0.85 → 返回历史结果 + 补充差异
  │
  └─ 未命中 → 走 AI 全量诊断 → 结果写入模式库
```

**Flaky Test 指纹：**

```typescript
interface FlakyFingerprint {
  testId: string          // test file + test name 的 hash
  pattern: string         // 失败模式描述
  failureRate: number     // 历史失败率
  lastSeen: string
  suggestedAction: 'retry' | 'skip' | 'fix'
}
```

**存储：** 本地 JSON 文件 `.ci-diagnoser/patterns.json`，按项目隔离。

### 3.4 Fix Suggest — 修复建议层

**修复建议模型：**

```typescript
interface FixSuggestion {
  type: 'code_fix' | 'config_fix' | 'dependency_fix' | 'retry' | 'skip_test' | 'manual'
  confidence: number
  description: string           // 自然语言描述
  patch?: string                // 统一 diff 格式的修复补丁
  targetFiles?: string[]        // 需要修改的文件
  commands?: string[]           // 建议执行的命令
  references?: string[]         // 相关文档 / issue 链接
}
```

**修复生成策略：**

| 根因类别 | 修复策略 |
|---------|---------|
| compile_error | 读取错误对应的源文件 + 上下文 → AI 生成代码修复 patch |
| test_failure | 读取测试文件 + 被测代码 → AI 分析断言失败原因 → 生成修复 |
| lint_error | 直接修复（格式化 / 补全类型） |
| dependency_conflict | 分析 package.json / lock 文件 → 建议版本调整 |
| timeout | 分析超时步骤 → 建议增加 timeout / 优化性能 / 拆分步骤 |
| env_issue | 分析环境变量 / Dockerfile → 建议配置修正 |
| resource_limit | 建议增加资源 / 优化内存使用 |
| flaky test | 标记 flaky → 建议重试 / 跳过 / 修复 |

### 3.5 Skill 入口 — 流程编排

**`/diagnose` 命令的完整流程：**

```
1. 解析参数（--run, --platform, --file）
2. 确定日志来源
   ├── 本地文件 → 直接读取
   ├── GitHub → gh CLI 拉取
   └── GitLab → API 拉取（需 token）
3. 日志获取 → CILog 统一格式
4. Pattern Engine 匹配
   ├── 命中 → 直接返回历史结果
   └── 未命中 → 继续
5. Log Analyzer 诊断
   ├── 预处理
   ├── 结构化
   ├── AI 分析（两阶段 prompt）
   └── 结果汇总
6. Fix Suggest 生成修复建议
   ├── 读取相关源文件上下文
   └── AI 生成 patch / 建议
7. 输出结构化诊断报告
8. 写入 Pattern Engine（供下次匹配）
9. 用户可选择：应用 patch / 查看详细日志 / 忽略
```

---

## 四、项目结构

```
ci-cd-failure-diagnoser/
├── CLAUDE.md                          # 项目指引
├── README.md                          # 项目说明
├── package.json                       # NPM 包配置
├── tsconfig.json                      # TypeScript 配置
│
├── src/
│   ├── index.ts                       # 入口
│   │
│   ├── adapters/                      # 平台适配器
│   │   ├── base.ts                    # 适配器接口定义
│   │   ├── github.ts                  # GitHub Actions
│   │   ├── gitlab.ts                  # GitLab CI
│   │   ├── jenkins.ts                 # Jenkins
│   │   └── local.ts                   # 本地文件
│   │
│   ├── analyzer/                      # 日志分析引擎
│   │   ├── preprocessor.ts            # 日志预处理
│   │   ├── classifier.ts              # 失败分类器（AI 第一阶段）
│   │   ├── diagnoser.ts               # 根因定位器（AI 第二阶段）
│   │   └── prompts/                   # AI Prompt 模板
│   │       ├── classify.md            # 分类 prompt
│   │       └── diagnose.md            # 诊断 prompt
│   │
│   ├── patterns/                      # 模式引擎
│   │   ├── matcher.ts                 # 模式匹配器
│   │   ├── store.ts                   # 模式存储
│   │   └── flaky-detector.ts          # Flaky test 检测
│   │
│   ├── fixer/                         # 修复建议
│   │   ├── suggester.ts               # 修复建议生成
│   │   ├── patch-generator.ts         # Patch 生成
│   │   └── prompts/                   # 修复 Prompt 模板
│   │       ├── code-fix.md            # 代码修复 prompt
│   │       └── config-fix.md          # 配置修复 prompt
│   │
│   ├── models/                        # 数据模型
│   │   └── types.ts                   # 所有 TypeScript 类型定义
│   │
│   └── utils/                         # 工具函数
│       ├── log-parser.ts              # 通用日志解析
│       ├── ansi-stripper.ts           # ANSI 转义码清除
│       └── hash.ts                    # Hash 工具
│
├── skill/                             # Claude Code Skill 定义
│   ├── diagnose.md                    # Skill 入口文件
│   └── diagnose-config.json           # Skill 配置
│
├── tests/                             # 测试
│   ├── fixtures/                      # 测试日志样本
│   │   ├── github-actions/
│   │   ├── gitlab-ci/
│   │   └── local-logs/
│   ├── adapters/
│   ├── analyzer/
│   ├── patterns/
│   └── fixer/
│
├── docs/                              # 文档
│   ├── architecture.md                # 架构文档
│   └── supported-platforms.md         # 平台支持说明
│
├── examples/                          # 示例
│   └── sample-diagnosis.md            # 诊断报告示例
│
└── internal/                          # 内部文档（不发布）
    ├── claude-code-skill-ideas.md
    ├── claude-code-skill-ideas-project.md
    └── development-plan.md            # 本文件
```

---

## 五、技术选型

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 语言 | TypeScript | Claude Code 生态首选，与 `gh` CLI 交互方便 |
| 运行时 | Node.js (Bun 兼容) | 主流，Skill 插件标准环境 |
| CI 平台对接 | `gh` CLI 优先 | GitHub 用户无需额外配置 token |
| AI 分析 | Claude API (via Skill) | Skill 天然在 Claude Code 环境内运行，零配置 |
| 模式存储 | 本地 JSON 文件 | 轻量，无需数据库，按项目隔离 |
| 构建 | tsdown | 轻量 TypeScript 构建 |
| 测试 | Vitest | 快速，TypeScript 原生支持 |
| Lint | ESLint + oxlint | 双重保障 |
| 格式化 | Prettier | 一致代码风格 |

---

## 六、开发阶段规划

### Phase 0：项目骨架（0.5 天）

**目标：** 能运行，能输出 hello world

- [ ] 初始化项目（package.json、tsconfig、git）
- [ ] 定义核心数据模型（`models/types.ts`）
- [ ] 搭建 Skill 入口（`skill/diagnose.md`）
- [ ] 配置开发工具链（ESLint、Prettier、Vitest）
- [ ] 编写 CLAUDE.md

**验证：** `/diagnose` 能触发，输出"功能开发中"

---

### Phase 1：基础诊断能力 — MVP（1.5 天）

**目标：** 本地日志文件 → AI 诊断 → 输出根因分析

核心是最小可用路径：**本地文件 → 预处理 → AI 分类 + 诊断 → 结构化输出**

- [ ] `adapters/local.ts` — 本地日志文件读取
- [ ] `utils/ansi-stripper.ts` — ANSI 转义码清除
- [ ] `utils/log-parser.ts` — 通用日志行解析
- [ ] `analyzer/preprocessor.ts` — 日志预处理（分隔步骤、提取失败步骤）
- [ ] `analyzer/classifier.ts` — 失败分类器（第一阶段 AI prompt）
- [ ] `analyzer/diagnoser.ts` — 根因定位器（第二阶段 AI prompt）
- [ ] `analyzer/prompts/classify.md` — 分类 prompt 模板
- [ ] `analyzer/prompts/diagnose.md` — 诊断 prompt 模板
- [ ] 收集 5+ 真实 CI 失败日志样本放入 `tests/fixtures/`
- [ ] 编写分类器 + 诊断器测试

**验证：** 给一个真实 CI 失败日志，`/diagnose --file log.txt` 能输出正确的根因类别 + 证据行

---

### Phase 2：GitHub Actions 集成（1 天）

**目标：** 直接从 GitHub 拉取失败日志并诊断

- [ ] `adapters/github.ts` — GitHub Actions 适配器
  - 获取最近失败 run（`gh run list --status=failure`）
  - 获取日志（`gh run view <id> --log`）
  - 解析 job / step 结构
- [ ] 参数路由：无 `--file` 时默认走 GitHub
- [ ] `adapters/base.ts` — 抽象适配器接口
- [ ] 集成测试（用真实公开仓库的 CI 日志）

**验证：** 在有失败 CI run 的仓库中，`/diagnose` 能自动拉取日志并诊断

---

### Phase 3：修复建议生成（1 天）

**目标：** 不仅告诉你哪里错了，还告诉你怎么修

- [ ] `fixer/suggester.ts` — 修复建议生成主体
- [ ] `fixer/patch-generator.ts` — 代码 patch 生成
- [ ] `fixer/prompts/code-fix.md` — 代码修复 prompt
- [ ] `fixer/prompts/config-fix.md` — 配置修复 prompt
- [ ] 分类 → 修复策略路由
- [ ] 读取失败文件上下文辅助修复生成

**验证：** 对编译错误 + 测试失败日志，能生成可应用的 patch

---

### Phase 4：模式引擎 + Flaky 检测（1 天）

**目标：** 重复问题秒级响应，flaky test 自动标记

- [ ] `patterns/store.ts` — 模式存储（JSON 文件读写）
- [ ] `patterns/matcher.ts` — 精确 + 模糊匹配
- [ ] `patterns/flaky-detector.ts` — Flaky test 检测（跨 run 分析）
- [ ] 诊断流程集成：先匹配模式，命中则跳过 AI
- [ ] 诊断后自动存储新模式

**验证：** 同一个失败日志第二次分析，响应时间 < 2秒，输出"已知问题"标记

---

### Phase 5：GitLab CI + Jenkins 适配（1 天）

**目标：** 扩展平台覆盖

- [ ] `adapters/gitlab.ts` — GitLab CI REST API 适配
- [ ] `adapters/jenkins.ts` — Jenkins REST API 适配
- [ ] Token 配置指引文档
- [ ] 各平台测试 fixtures

**验证：** GitLab / Jenkins 项目的 CI 日志能被正确解析和诊断

---

### Phase 6：打磨 & 发布（1 天）

**目标：** 可公开发布的 Claude Code Skill

- [ ] 边界场景处理（超大日志、乱码、部分失败）
- [ ] 错误处理 & 用户友好提示
- [ ] README.md 编写
- [ ] 使用示例 + 截图
- [ ] Skill 配置优化（description、trigger 精调）
- [ ] 发布到 Claude Code Skill 市场（如适用）

**验证：** 新用户零配置可用，README 足够清晰

---

## 七、AI Prompt 设计要点

### 7.1 分类 Prompt 核心原则

1. **只输入失败 step 的日志**，减少 token 消耗
2. **输出严格 JSON**，便于程序解析
3. **必须给出置信度**，低置信度时提示人工排查

### 7.2 诊断 Prompt 核心原则

1. **提供分类结果作为上下文**，聚焦分析方向
2. **要求逐行引用证据**，确保可追溯
3. **区分根因 vs 级联错误**，这是核心差异化能力
4. **禁止编造不存在的日志内容**，防止幻觉

### 7.3 修复 Prompt 核心原则

1. **必须读取实际源文件**，不做无根据的推测
2. **生成统一 diff 格式**，便于程序化应用
3. **区分自动修复 vs 需人工判断**，不盲目自信
4. **对于 flaky test，优先建议重试**，而非修改代码

---

## 八、测试策略

### 8.1 测试金字塔

```
        ┌──────────┐
        │  E2E 测试  │   ← 真实 CI 日志端到端诊断
        │   (5%)    │
        ├──────────┤
        │ 集成测试   │   ← 适配器 + 分析器联调
        │  (15%)   │
        ├──────────┤
        │  单元测试  │   ← 预处理、解析、模式匹配
        │  (80%)   │
        └──────────┘
```

### 8.2 测试日志样本清单

| 场景 | 平台 | 日志来源 |
|------|------|---------|
| TypeScript 编译错误 | GitHub Actions | 自造 |
| npm 依赖冲突 | GitHub Actions | 自造 |
| 单元测试断言失败 | GitHub Actions | 自造 |
| E2E 测试超时 | GitHub Actions | 自造 |
| Docker 构建失败 | GitLab CI | 自造 |
| 环境变量缺失 | GitHub Actions | 自造 |
| OOM 崩溃 | Jenkins | 自造 |
| Flaky test 间歇失败 | GitHub Actions | 多次 run |
| 级联错误（编译失败 → 测试全挂） | GitHub Actions | 自造 |
| lint 错误 | GitHub Actions | 自造 |

---

## 九、关键决策记录

| # | 决策 | 备选方案 | 理由 |
|---|------|---------|------|
| 1 | `gh` CLI 优先于直接 REST API | REST API | 用户零配置，gh CLI 通常已安装 |
| 2 | 本地 JSON 存储模式 | SQLite / 远程 DB | 轻量，无依赖，符合 Skill 插件定位 |
| 3 | 两阶段 AI prompt | 单阶段全量 prompt | 省 token，分类阶段轻量快捷 |
| 4 | 统一 diff 格式 patch | 直接输出修改后文件 | 标准化，可审计，可用 `git apply` |
| 5 | TypeScript | Python | Claude Code 生态标准化，前端开发者友好 |
| 6 | 先支持本地文件再支持平台 API | 反过来 | MVP 最简路径，降低首次使用门槛 |

---

## 十、风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| AI 幻觉导致错误诊断 | 中 | 高 | 要求引用证据行 + 置信度标注 + 低置信度时建议人工 |
| 日志格式千变万化 | 高 | 中 | 预处理标准化 + 平台适配器做初步结构化 |
| 超大日志消耗过多 token | 中 | 中 | 只发送失败 step 日志 + 截断策略（保留首尾部） |
| `gh` CLI 未安装或未认证 | 中 | 低 | 自动检测 + 回退提示 + 支持文件模式 |
| 模式库无限增长 | 低 | 低 | LRU 淘汰 + 相似模式合并 |

---

## 十一、成功指标

### MVP 阶段（Phase 1-2 完成时）

- [ ] 10 个测试日志样本的根因分类准确率 **≥ 80%**
- [ ] 分类平均响应时间 **< 10 秒**
- [ ] GitHub Actions 日志自动拉取成功率 **≥ 90%**

### 完整版（Phase 6 完成时）

- [ ] 根因分类准确率 **≥ 90%**
- [ ] 修复建议可直接应用率 **≥ 50%**（无需人工修改）
- [ ] 重复问题模式匹配率 **≥ 70%**（第二次出现时秒级响应）
- [ ] Flaky test 自动标记准确率 **≥ 80%**

---

## 十二、里程碑时间线

| 阶段 | 工期 | 累计 | 交付物 |
|------|------|------|--------|
| Phase 0 骨架 | 0.5 天 | 0.5 天 | 可运行的空壳项目 |
| Phase 1 MVP | 1.5 天 | 2 天 | 本地日志诊断能力 |
| Phase 2 GitHub | 1 天 | 3 天 | GitHub Actions 集成 |
| Phase 3 修复建议 | 1 天 | 4 天 | 最小修复 patch 生成 |
| Phase 4 模式引擎 | 1 天 | 5 天 | 重复问题秒级响应 |
| Phase 5 多平台 | 1 天 | 6 天 | GitLab + Jenkins 支持 |
| Phase 6 打磨 | 1 天 | 7 天 | 可发布的 Skill |

**总计：7 个工作日**

---

*文档版本：v1.0 | 创建日期：2026-06-21 | 状态：规划中*
