# 🔍 CI/CD Failure Diagnoser

> AI 驱动的 CI/CD 失败诊断器 —— 理解你的流水线**为什么**失败，而不仅仅是**失败**了。

[![npm version](https://img.shields.io/npm/v/ci-cd-failure-diagnoser.svg)](https://www.npmjs.com/package/ci-cd-failure-diagnoser)
[![license](https://img.shields.io/npm/l/ci-cd-failure-diagnoser.svg)](https://github.com/saqqdy/ci-cd-failure-diagnoser/blob/master/LICENSE)

## 快速链接

- [安装](/zh/guide/installation) — 几分钟内上手
- [快速开始](/zh/guide/quick-start) — 查看实际效果
- [API 参考](/zh/api/) — 编程使用
- [技能命令](/zh/guide/skill-commands) — 交互式诊断

## 问题所在

传统的 CI/CD 日志只告诉你失败**什么**，而不是**为什么**：

```
Error: Process completed with exit code 1.
##[error]Node.js 12 actions are deprecated.
```

它无法回答的问题：
- 根本原因是什么？
- 这是偶发性测试还是真正的失败？
- 如何修复？
- 是否有相关的级联错误？

## 解决方案

CI/CD Failure Diagnoser 通过三层追踪**根本原因**：

| 层级 | 能力 | 输出 |
|------|------|------|
| **日志预处理** | 解析和规范化 CI 日志 | `CILog`、`CIJob`、`CIStep` |
| **模式分析** | 分类失败、检测偶发测试 | `DiagnosisResult`、`FailurePattern` |
| **修复建议** | 生成可操作的修复方案和证据 | `FixSuggestion`、置信度等级 |

## 核心功能

### 📋 日志预处理

零配置的结构化解析：

- **ANSI 清理** — 清理原始 CI 日志输出
- **日志解析** — 提取作业、步骤和错误行
- **多平台** — GitHub Actions、GitLab CI、Jenkins

### 🧠 AI 驱动分析

- **失败分类** — compile_error、test_failure、lint_error 等
- **根本原因检测** — 从级联错误中追踪实际原因
- **偶发测试检测** — 使用指纹识别间歇性失败
- **置信度评分** — 🟢🟡🔴 基于证据的等级

### 💡 可操作的修复建议

- **代码修复** — 具体的补丁和命令
- **配置修复** — 配置更正
- **依赖修复** — 版本冲突解决
- **重试指导** — 针对偶发测试场景

### 🔄 交互式命令

在 Claude Code 中使用自然语言诊断：

| 命令 | 用途 |
|------|------|
| `/diagnose <file>` | 诊断 CI 日志文件 |
| `/retry <test>` | 检查测试是否偶发 |
| `/fix <error>` | 获取修复建议 |

## 置信度等级

| 等级 | 来源 | 含义 |
|------|------|------|
| 🟢 **高** | 清晰的错误模式 + 证据 | 已验证的根本原因 |
| 🟡 **中** | 部分模式匹配 | 可能的根本原因 |
| 🔴 **低** | 模糊或新错误 | 需要人工审查 |

## 示例输出

```
/diagnose ci-log.txt

🔍 正在诊断 CI 失败...

📊 诊断结果:
  分类: 🔨 编译错误
  置信度: 🟢 高 (≥80%)
  失败步骤: Build

🔍 根本原因:
  TypeScript 类型错误: Type "string" is not assignable to type "number"

📋 关键证据:
  - error TS2322: Type "string" is not assignable to type "number"
  - src/index.ts:42:10

💡 修复建议:
  - 类型: code_fix
  - 将变量类型从 string 改为 number
  - 命令: npx tsc --noEmit
```

## 快速开始

### 1. Claude Code 插件（推荐）

```bash
# 插件市场
/plugin marketplace add saqqdy/ci-cd-failure-diagnoser
/plugin install ci-cd-failure-diagnoser
```

### 2. NPM 包

```bash
pnpm add ci-cd-failure-diagnoser
```

### 3. CLI（零安装）

```bash
npx ci-cd-failure-diagnoser diagnose ci-log.txt
```

### 4. 克隆并探索

```bash
git clone https://github.com/saqqdy/ci-cd-failure-diagnoser.git
cd ci-cd-failure-diagnoser
pnpm install
npx tsx examples/basic-usage.ts
```

## 项目状态

| 版本 | 主题 | 状态 |
|------|------|------|
| v0.1.0 | 基础诊断 | 🚧 进行中 |
| v0.2.0 | 模式引擎 | 📋 已规划 |
| v0.3.0 | 多平台适配器 | 📋 已规划 |
| v1.0.0 | 生产就绪 | 📋 已规划 |

详情请参阅[路线图](/zh/guide/roadmap)。

## 许可证

MIT — 个人和商业项目均可自由使用。