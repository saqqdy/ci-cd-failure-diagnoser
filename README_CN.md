# 🔍 CI/CD Failure Diagnoser

> AI 驱动的 CI/CD 故障诊断器 — 理解"**流水线为什么失败**"，而不只是"失败了"。通过 Claude Code Skill 实现根因分析。

[![npm version](https://img.shields.io/npm/v/ci-cd-failure-diagnoser.svg)](https://www.npmjs.com/package/ci-cd-failure-diagnoser)
[![license](https://img.shields.io/npm/l/ci-cd-failure-diagnoser.svg)](https://github.com/saqqdy/ci-cd-failure-diagnoser/blob/master/LICENSE)

[English Docs](README.md)

---

## 🎯 解决的问题

| 场景 | 传统 CI 日志 | CI/CD Failure Diagnoser |
|------|-------------|-------------------------|
| "哪里失败了？" | 几千行日志手动翻 | AI 秒级定位根因 |
| "根因还是级联错误？" | 所有错误看起来一样 | 区分"根因错误 → 级联错误 → 无关警告" |
| "是 flaky test 吗？" | 手动反复重试 | 指纹匹配自动检测 + 建议 |
| "怎么修复？" | 靠经验猜 | 生成最小修复 patch/命令 |

**核心洞察**：故障诊断需要理解**根因链**，而不只是错误消息。

---

## ✨ 核心功能

### 📋 日志预处理层 (v0.1.0)

结构化解析 CI 日志输出：

- **ANSI 清理** — 清理原始 CI 日志中的控制字符
- **日志解析** — 提取 jobs、steps、错误行
- **预处理器** — 统一多平台格式

### 🧠 AI 驱动分析

- **失败分类** — compile_error、test_failure、lint_error 等 11 种类别
- **根因检测** — 从级联错误中追溯真正原因
- **Flaky Test 检测** — 通过指纹识别间歇性失败
- **置信度评分** — 🟢🟡🔴 三级证据置信度

### 💡 可操作的修复建议

- **代码修复** — 具体的补丁和命令
- **配置修复** — 配置纠正
- **依赖修复** — 版本冲突解决
- **重试指导** — 针对 flaky test 的场景

### 🔄 交互式诊断命令

| 命令 | 描述 |
|------|------|
| `/diagnose <file>` | 诊断 CI 日志文件，识别根因 |
| `/retry <test>` | 检查测试是否为 flaky，获取重试建议 |
| `/fix <error>` | 获取针对错误类型的修复建议 |
| `/history <run>` | 查看 run 的失败模式历史 |

---

## 🚀 快速开始

### 方式 1：Claude Code Skill（推荐）

本项目是一个 **Claude Code Plugin**，可通过插件市场一键安装。

#### 安装方式 A：插件市场（推荐）

```bash
# 在 Claude Code 中运行：
/plugin marketplace add saqqdy/ci-cd-failure-diagnoser
/plugin install ci-cd-failure-diagnoser
```

#### 安装方式 B：本地安装

```bash
# 1. 进入项目目录
cd your-project

# 2. 安装 npm 包
pnpm add -D ci-cd-failure-diagnoser

# 3. 复制插件文件
mkdir -p .claude/skills
cp -r node_modules/ci-cd-failure-diagnoser/.claude/skills/ci-cd-failure-diagnoser .claude/skills/
```

#### 可用命令

在 Claude Code 中输入以下命令：

| 命令 | 描述 | 示例 |
|------|------|------|
| `/diagnose` | 诊断 CI 日志文件 | `/diagnose ci-log.txt` |
| `/retry` | 检查测试是否为 flaky | `/retry auth.test.ts` |
| `/fix` | 获取修复建议 | `/fix typescript` |
| `/history` | 查看失败历史 | `/history run-123` |

#### 输出示例

```
/diagnose tests/fixtures/github-actions/typescript-error.txt

🔍 正在诊断 CI 失败...

📊 诊断结果：
  分类: 🔨 编译错误
  置信度: 🟢 高 (≥80%)
  失败步骤: Build

🔍 根因分析：
  TypeScript 类型错误：Type "string" is not assignable to type "number"

📋 关键证据：
  - error TS2322: Type "string" is not assignable to type "number"
  - src/index.ts:42:10

💡 修复建议：
  - 类型: code_fix
  - 将变量类型从 string 改为 number
  - 命令: npx tsc --noEmit
```

### 方式 2：程序化调用

```bash
pnpm add ci-cd-failure-diagnoser
```

```typescript
import { diagnose, formatDiagnosis, getDefaultConfig } from 'ci-cd-failure-diagnoser'

// 基础诊断
const result = await diagnose({ file: 'ci-log.txt' })
console.log(formatDiagnosis(result))

// 使用自定义配置
const config = getDefaultConfig()
const result2 = await diagnose({
  file: 'ci-log.txt',
  config,
})

// 访问具体字段
console.log('分类:', result.rootCause.category)
console.log('置信度:', result.rootCause.confidence)
console.log('修复:', result.suggestedFix?.description)
```

### 方式 3：CLI（零安装）

```bash
# 在任何项目中，一条命令即可体验：
npx ci-cd-failure-diagnoser diagnose ci-log.txt
npx ci-cd-failure-diagnoser version
npx ci-cd-failure-diagnoser help
```

### 方式 4：Clone 并运行示例

```bash
git clone https://github.com/saqqdy/ci-cd-failure-diagnoser.git
cd ci-cd-failure-diagnoser
pnpm install

# 运行示例
npx tsx examples/basic-usage.ts
npx tsx examples/with-cache.ts
npx tsx examples/skill-commands.ts
```

---

## 📋 版本路线图

| 版本 | 代号 | 主题 | 状态 |
|------|------|------|------|
| v0.1.0 | Foundation | 基础诊断能力（本地文件 → AI 诊断） | ✅ 当前 |
| v0.2.0 | Pattern Engine | 失败模式识别 + Flaky 检测 | 📋 计划中 |
| v0.3.0 | Multi-Platform | GitHub Actions/GitLab CI/Jenkins 适配 | 📋 计划中 |
| v0.4.0 | Intelligence | 级联分析 + 修复排序 | 📋 计划中 |
| v1.0.0 | Production | Marketplace + 企业级功能 | 📋 计划中 |

---

## 🗂️ 项目结构

```
ci-cd-failure-diagnoser/
├── .claude/skills/ci-cd-failure-diagnoser/  # Skill 提示词（核心产品）
│   └── skill.md                              # 命令 + 执行流程
├── src/                                      # TypeScript 源码
│   ├── index.ts                              # 公开 API 导出
│   ├── models/types.ts                       # 核心类型
│   ├── errors.ts                             # 自定义错误类型
│   ├── adapters/                             # CI 平台适配器
│   │   └── local.ts                          # 本地文件适配器
│   ├── analyzer/                             # AI 分析器
│   │   ├── preprocessor.ts                   # 日志预处理
│   │   └── prompts/                          # AI 提示词
│   │       ├── classify.md                   # 分类提示词
│   │       └── diagnose.md                   # 诊断提示词
│   └── utils/                                # 工具函数
│       ├── config.ts                         # 配置管理
│       ├── format.ts                         # 输出格式化
│       ├── ansi-stripper.ts                  # ANSI 清理
│       └── log-parser.ts                     # 日志解析
├── tests/                                    # 测试文件
├── examples/                                 # 使用示例
├── docs/                                     # VitePress 文档
└── internal/                                 # 规划文档
```

---

## 🛠️ 开发

```bash
pnpm install          # 安装依赖
pnpm run lint         # ESLint + 自动修复
pnpm run typecheck    # TypeScript 检查
pnpm run test         # 运行测试 (vitest)
pnpm run build        # 构建 (ESM + CJS)
pnpm run docs:dev     # 启动文档服务器
```

---

## 🆚 对比

### vs 手动日志分析

| 维度 | 手动分析 | CI/CD Failure Diagnoser |
|------|---------|-------------------------|
| 输出 | 几千行日志 | 结构化 `DiagnosisResult` + 修复建议 |
| 根因定位 | ❌ 手动搜索 | ✅ AI 追溯根因 → 级联链 |
| Flaky 检测 | ❌ 手动重试 | ✅ 指纹匹配检测 |
| 置信度 | ❌ 无 | ✅ 🟢🟡🔴 证据级别 |
| 修复建议 | ❌ 无 | ✅ 生成 patch/命令 |

---

## 📄 许可证

[MIT](./LICENSE)