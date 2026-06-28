# CI/CD Failure Diagnoser

> AI-powered CI/CD failure diagnoser — 读取 CI 日志，定位失败根因，生成修复建议

[![npm version](https://img.shields.io/npm/v/ci-cd-failure-diagnoser.svg)](https://www.npmjs.com/package/ci-cd-failure-diagnoser)
[![Node.js Version](https://img.shields.io/node/v/ci-cd-failure-diagnoser.svg)](https://nodejs.org)
[![License](https://img.shields.io/npm/l/ci-cd-failure-diagnoser.svg)](https://github.com/saqqdy/ci-cd-failure-diagnoser/blob/master/LICENSE)

## 简介

CI/CD Failure Diagnoser 是一个 Claude Code Skill 插件，帮助开发者快速定位 CI 失败的根本原因，区分根因错误与级联错误，并生成最小修复方案。

### 核心价值

| 传统方式 | 本项目 |
|---------|--------|
| 手动翻几千行日志 | AI 语义理解，秒级定位根因 |
| 级联错误混淆判断 | 区分"根因错误 → 级联错误 → 无关警告" |
| flaky test 反复排查 | 指纹匹配，自动标记已知 flaky |
| 修复靠经验 | 生成最小修复 PR / patch |

## 安装

```bash
# 使用 npm
npm install -g ci-cd-failure-diagnoser

# 使用 pnpm
pnpm install -g ci-cd-failure-diagnoser
```

## 使用方法

### 在 Claude Code 中使用

安装后，在 Claude Code CLI 中可以使用 `/diagnose` 命令：

```bash
# 分析最近一次 CI 失败
/diagnose

# 分析指定 run
/diagnose --run 12345678

# 指定平台
/diagnose --platform gitlab

# 分析本地日志文件
/diagnose --file path/to/log.txt
```

### 支持的平台

| 优先级 | 平台 | 接入方式 |
|--------|------|----------|
| P0 | GitHub Actions | `gh` CLI / REST API |
| P0 | 本地日志文件 | 文件读取 |
| P1 | GitLab CI | REST API |
| P2 | Jenkins | REST API / CLI |

## 功能特性

### 1. 语义理解

理解 CI 日志语义，区分：
- **根因错误** — 导致失败的真正原因
- **级联错误** — 由根因引发的后续错误
- **无关警告** — 不影响构建的警告信息

### 2. 平台适配

支持多种 CI 平台，统一日志格式，屏蔽平台差异。

### 3. 修复建议

根据失败类别生成针对性修复建议：
- **编译错误** → 生成代码修复 patch
- **测试失败** → 分析断言失败原因
- **依赖冲突** → 建议版本调整
- **环境问题** → 建议配置修正

### 4. Flaky Test 检测

自动识别 flaky test，避免重复排查：
- 跨 run 分析测试稳定性
- 生成 flaky fingerprint
- 建议重试 / 跳过 / 修复

### 5. 模式学习

重复问题秒级响应：
- 第一次遇到问题 → AI 全量诊断
- 第二次遇到相同问题 → 模式匹配，秒级响应

## 支持的失败类别

- `compile_error` — 编译错误
- `test_failure` — 测试失败
- `lint_error` — 代码检查失败
- `env_issue` — 环境问题
- `timeout` — 超时
- `dependency_conflict` — 依赖冲突
- `permission_error` — 权限错误
- `config_error` — 配置错误
- `resource_limit` — 资源限制（OOM、磁盘满等）
- `network_error` — 网络问题
- `unknown` — 未知

## 开发状态

**当前版本**: 0.1.0-alpha.1 (Phase 0 - 项目骨架)

### 已实现 ✅
- 核心数据模型定义
- 项目骨架搭建
- Skill 入口配置

### 开发中 🚧 (Phase 1)
- 本地日志文件读取
- 日志预处理
- AI 分类 + 诊断
- 结构化诊断输出

### 计划中 📋
- GitHub Actions 集成 (Phase 2)
- 修复建议生成 (Phase 3)
- 模式引擎 + Flaky 检测 (Phase 4)
- GitLab CI + Jenkins 适配 (Phase 5)

详见 [开发计划](internal/development-plan.md) 和 [发版计划](internal/release-plan.md)。

## 开发

### 环境要求

- Node.js 18+
- pnpm 9+

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/saqqdy/ci-cd-failure-diagnoser.git
cd ci-cd-failure-diagnoser

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```

### 项目结构

```
ci-cd-failure-diagnoser/
├── src/
│   ├── index.ts           # 入口
│   ├── models/types.ts    # 核心数据模型
│   ├── adapters/          # 平台适配器
│   ├── analyzer/          # 日志分析引擎
│   ├── patterns/          # 模式引擎
│   └── fixer/             # 修复建议
├── .claude/skills/        # Claude Code Skill 定义
├── tests/                 # 测试
├── docs/                  # 文档
└── internal/              # 内部文档
```

## 贡献

欢迎贡献代码、报告问题或提出建议！

请阅读 [贡献指南](CONTRIBUTING.md) 了解详情。

## 许可证

[MIT](LICENSE)

## 作者

saqqdy

## 链接

- [GitHub](https://github.com/saqqdy/ci-cd-failure-diagnoser)
- [npm](https://www.npmjs.com/package/ci-cd-failure-diagnoser)
- [问题反馈](https://github.com/saqqdy/ci-cd-failure-diagnoser/issues)