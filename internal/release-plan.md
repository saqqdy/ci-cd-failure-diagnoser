# CI/CD Failure Diagnoser — 发版计划

> 版本迭代节奏、发布标准、变更策略全览

---

## 一、版本号规范

采用 **Semantic Versioning 2.0**：

```
MAJOR.MINOR.PATCH[-prerelease]

示例：
0.1.0-alpha.1    ← 开发早期预览
0.9.0-beta.1     ← 公测前预览
1.0.0            ← 首个正式版
1.1.0            ← 新增 GitLab 适配
1.1.1            ← 修补日志解析 bug
2.0.0            ← 破坏性 API 变更
```

### 版本递增规则

| 类型 | 触发条件 | 示例 |
|------|---------|------|
| **MAJOR** | 破坏性变更：Skill 接口重构、命令参数不兼容、数据模型不可迁移 | 0.x → 1.0, 1.x → 2.0 |
| **MINOR** | 新功能：新增平台适配器、新诊断类别、新修复策略 | 1.0 → 1.1 |
| **PATCH** | Bug 修复：诊断不准、解析异常、命令参数遗漏 | 1.0 → 1.0.1 |
| **prerelease** | 开发中版本：alpha（内部）、beta（公测）、rc（候选） | 0.1.0-alpha.1 |

### 特殊约定

- `0.x.y` 阶段允许破坏性变更，不递增 MAJOR
- 每个 prerelease 标签只递增编号（alpha.1 → alpha.2），不加日期
- 正式版不带 prerelease 后缀

---

## 二、版本里程碑与开发阶段映射

```
开发阶段          版本              定位
─────────────────────────────────────────────
Phase 0 骨架   → 0.1.0-alpha.1   项目可运行
Phase 1 MVP    → 0.1.0-alpha.2   本地日志诊断
               → 0.1.0-beta.1    内测通过
Phase 2 GitHub → 0.2.0-alpha.1   GitHub 集成
               → 0.2.0-beta.1    内测通过
Phase 3 修复   → 0.3.0-alpha.1   修复建议生成
               → 0.3.0-beta.1    内测通过
Phase 4 模式   → 0.4.0-alpha.1   模式引擎
               → 0.4.0-beta.1    内测通过
Phase 5 多平台 → 0.5.0-alpha.1   GitLab + Jenkins
               → 0.5.0-beta.1    内测通过
Phase 6 打磨   → 0.9.0-rc.1      发布候选
               → 1.0.0           正式发布
```

---

## 三、各版本详细规划

### v0.1.0-alpha.1 — 项目骨架

> 对应 Phase 0，0.5 天

| 项目 | 内容 |
|------|------|
| **范围** | 初始化项目结构、核心类型定义、Skill 入口搭建 |
| **包含** | package.json、tsconfig、CLAUDE.md、models/types.ts、skill/diagnose.md 空壳 |
| **不包含** | 任何诊断功能 |
| **发布物** | npm 包（私有）、Git tag |

**发布标准：**
- [ ] `tsc --noEmit` 零错误
- [ ] `/diagnose` 命令可触发并输出提示信息
- [ ] 项目结构符合规划

---

### v0.1.0-alpha.2 → v0.1.0 — 本地日志诊断 MVP

> 对应 Phase 1，1.5 天

| 项目 | 内容 |
|------|------|
| **范围** | 本地日志文件 → AI 诊断 → 结构化输出 |
| **新增功能** | 本地文件适配器、日志预处理、两阶段 AI 分类+诊断、诊断结果输出 |
| **支持命令** | `/diagnose --file <path>` |

**alpha.2 发布标准：**
- [ ] 核心模块单元测试通过
- [ ] 5 种测试日志样本可诊断出正确类别
- [ ] AI 输出可被程序解析为 DiagnosisResult

**beta.1 发布标准：**
- [ ] 10 种测试日志样本准确率 ≥ 80%
- [ ] 错误处理完备（文件不存在、空文件、非文本文件）
- [ ] 解析异常给出友好提示

**v0.1.0 正式发布标准：**
- [ ] beta 反馈问题全部关闭
- [ ] README 包含基本使用说明
- [ ] `npm pack` 可正常打包

---

### v0.2.0 — GitHub Actions 集成

> 对应 Phase 2，1 天

| 项目 | 内容 |
|------|------|
| **范围** | 直接从 GitHub 拉取失败 run 日志 |
| **新增功能** | GitHub Actions 适配器、`gh` CLI 调用、job/step 结构解析 |
| **支持命令** | `/diagnose`（自动检测 GitHub）、`/diagnose --run <id>` |
| **依赖** | 需 `gh` CLI 已安装并认证 |

**alpha.1 发布标准：**
- [ ] `gh run list --status=failure` 成功调用
- [ ] 日志自动拉取并转换为 CILog 格式
- [ ] 失败 step 正确识别

**v0.2.0 正式发布标准：**
- [ ] 3 个公开仓库的失败 CI 日志可正确拉取和诊断
- [ ] `gh` 未安装时给出安装指引而非报错
- [ ] `gh` 未认证时给出认证指引
- [ ] 多 job 仓库正确识别失败 job

---

### v0.3.0 — 修复建议生成

> 对应 Phase 3，1 天

| 项目 | 内容 |
|------|------|
| **范围** | 诊断结果 → 可执行修复方案 |
| **新增功能** | 修复建议引擎、代码 patch 生成、配置修复建议 |
| **输出增强** | 诊断报告追加 FixSuggestion 部分 |

**alpha.1 发布标准：**
- [ ] compile_error 类型可生成源码修复 patch
- [ ] test_failure 类型可给出断言失败原因分析
- [ ] patch 格式为统一 diff，可被 `git apply --check` 验证

**v0.3.0 正式发布标准：**
- [ ] 编译错误 patch 可直接应用率 ≥ 60%
- [ ] 每种 FailureCategory 至少有 1 个修复建议测试用例
- [ ] 无法自动修复时明确标注 `type: 'manual'`
- [ ] 修复建议附带置信度

---

### v0.4.0 — 模式引擎 + Flaky 检测

> 对应 Phase 4，1 天

| 项目 | 内容 |
|------|------|
| **范围** | 重复问题缓存、已知模式秒级响应、flaky test 标记 |
| **新增功能** | 模式存储（JSON）、精确+模糊匹配、flaky 检测（跨 run）、自动模式学习 |
| **性能目标** | 已知模式匹配 < 2 秒 |

**alpha.1 发布标准：**
- [ ] 首次诊断结果写入 patterns.json
- [ ] 同一日志第二次分析命中模式库
- [ ] flaky test 运行 ≥ 3 次后可被标记

**v0.4.0 正式发布标准：**
- [ ] 同一日志二次分析响应时间 < 2 秒
- [ ] 模式匹配准确率 ≥ 95%（无误匹配）
- [ ] .ci-diagnoser/ 目录自动创建，.gitignore 自动追加
- [ ] 模式库体积 > 1MB 时自动 LRU 淘汰
- [ ] flaky 检测跨 run 统计正确

---

### v0.5.0 — 多平台适配

> 对应 Phase 5，1 天

| 项目 | 内容 |
|------|------|
| **范围** | GitLab CI + Jenkins 日志拉取 |
| **新增功能** | GitLab 适配器（REST API）、Jenkins 适配器（REST API）、平台自动检测 |
| **支持命令** | `/diagnose --platform gitlab`、`/diagnose --platform jenkins` |

**alpha.1 发布标准：**
- [ ] GitLab CI 项目失败 pipeline 日志可拉取
- [ ] Jenkins 项目失败 build 日志可拉取
- [ ] 各平台 2+ 测试 fixtures 通过

**v0.5.0 正式发布标准：**
- [ ] GitLab CI Token 配置文档完整
- [ ] Jenkins Token 配置文档完整
- [ ] 无效 Token 友好提示
- [ ] 不支持的平台提示可用平台列表

---

### v0.9.0-rc.1 → v1.0.0 — 正式发布

> 对应 Phase 6，1 天

| 项目 | 内容 |
|------|------|
| **范围** | 全面打磨、文档完善、发布准备 |
| **重点** | 边界场景、错误处理、文档、用户体验 |

**rc.1 发布标准：**
- [ ] 所有 Phase 1-5 的发布标准全部满足
- [ ] 10 种测试日志样本根因分类准确率 ≥ 90%
- [ ] 修复建议可直接应用率 ≥ 50%
- [ ] 重复问题模式匹配率 ≥ 70%
- [ ] 完整 README.md
- [ ] 完整架构文档
- [ ] 使用示例 + 输出示例
- [ ] 无已知 P0/P1 bug

**v1.0.0 发布标准：**
- [ ] rc 阶段反馈问题全部关闭
- [ ] 至少 3 位外部用户试用并反馈
- [ ] `npm publish` 包可正常安装
- [ ] CHANGELOG.md 完整记录
- [ ] GitHub Release 带有完整 release notes

---

## 四、1.x 后续版本规划

| 版本 | 主题 | 预计周期 | 说明 |
|------|------|---------|------|
| v1.1.0 | CircleCI 适配 | 1 周 | 新增 CircleCI 平台支持 |
| v1.2.0 | 诊断报告增强 | 1 周 | HTML/SQLite 格式报告、趋势图表 |
| v1.3.0 | 团队模式 | 2 周 | 模式库云端同步、团队共享 flaky 标记 |
| v1.4.0 | 自动修复 | 2 周 | 修复建议自动生成 PR（可选） |
| v1.5.0 | 自定义规则 | 1 周 | 用户自定义失败模式规则、项目级模式覆盖 |
| v2.0.0 | 多语言支持 | 3 周 | Python / Go / Rust 项目日志分析 |

---

## 五、分支策略

```
main               ← 稳定发布分支，只接受 PR
  │
  ├── develop      ← 日常开发分支
  │     │
  │     ├── feat/gh-adapter     ← 功能分支
  │     ├── feat/fix-suggest
  │     ├── feat/pattern-engine
  │     └── fix/log-parse-bug   ← 修复分支
  │
  └── release/     ← 发版分支
        ├── release/0.1.0
        ├── release/0.2.0
        └── release/1.0.0
```

### 流转规则

| 操作 | 规则 |
|------|------|
| 功能开发 | `develop` ← merge `feat/*` |
| Bug 修复 | `develop` ← merge `fix/*` |
| 发版准备 | `release/x.y.z` ← 从 `develop` 切出 |
| 发版完成 | `main` ← merge `release/*`，打 tag `vx.y.z` |
| 紧急热修 | `main` ← merge `hotfix/*`，同步回 `develop` |

### 分支命名规范

```
feat/<简短描述>       例：feat/gh-adapter
fix/<简短描述>        例：fix/ansi-strip-regex
release/<版本号>      例：release/0.3.0
hotfix/<版本号>-<描述> 例：hotfix/0.2.1-log-truncation
```

---

## 六、Git 提交规范

采用 **Conventional Commits**：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 清单

| Type | 用途 | 是否影响版本 |
|------|------|-------------|
| `feat` | 新功能 | MINOR |
| `fix` | Bug 修复 | PATCH |
| `docs` | 文档变更 | 否 |
| `style` | 代码格式 | 否 |
| `refactor` | 重构（不变行为） | 否 |
| `perf` | 性能优化 | PATCH |
| `test` | 测试补充 | 否 |
| `chore` | 构建 / 工具链 | 否 |
| `ci` | CI 配置变更 | 否 |

### Scope 清单

| Scope | 覆盖范围 |
|-------|---------|
| `adapter` | 平台适配器 |
| `analyzer` | 日志分析引擎 |
| `pattern` | 模式引擎 |
| `fixer` | 修复建议 |
| `model` | 数据模型 |
| `skill` | Skill 入口 / 配置 |
| `util` | 工具函数 |
| `deps` | 依赖更新 |

### 示例

```
feat(adapter): add GitHub Actions log fetcher

Implement GitHub Actions adapter using `gh` CLI:
- Fetch failed runs via `gh run list`
- Pull logs via `gh run view --log`
- Parse job/step structure

Closes #12
```

```
fix(analyzer): handle multi-line error messages in classifier

Error messages spanning multiple lines were truncated,
causing misclassification. Now the preprocessor groups
consecutive error lines before classification.

Fixes #34
```

---

## 七、发版流程 Checklist

每次发版（从 alpha → beta → 正式）均需执行：

### 1. 代码质量

- [ ] ESLint 零 error
- [ ] TypeScript 严格模式零 error
- [ ] 所有测试通过（`vitest run`）
- [ ] 测试覆盖率 ≥ 80%（核心模块 ≥ 90%）

### 2. 功能验证

- [ ] 新功能测试日志样本全部通过
- [ ] 回归测试：上一版本测试样本全部通过
- [ ] 边界场景（空日志、超大日志、非文本文件）无崩溃
- [ ] 错误提示用户友好（无 stack trace 暴露）

### 3. 文档

- [ ] CHANGELOG.md 更新
- [ ] README.md 使用说明同步
- [ ] 新增配置项 / 命令参数已记录
- [ ] 破坏性变更标注迁移指引

### 4. 构建

- [ ] `npm pack` 打包正常
- [ ] 全新环境 `npm install -g <tarball>` 后 `/diagnose` 可用
- [ ] 包体积无异常增长（与上一版本对比）

### 5. 发布

- [ ] Git tag 打标正确（`v0.3.0`）
- [ ] GitHub Release 创建，附带 release notes
- [ ] npm publish（公开发布时）
- [ ] 通知渠道同步（如适用）：Twitter / Discord / 微信群

---

## 八、CHANGELOG 格式

```markdown
# Changelog

## [0.3.0] - 2026-06-24

### Added
- 修复建议引擎，支持 compile_error 和 test_failure 类型的代码 patch 生成 (#23)
- 配置修复建议，支持 env_issue 和 config_error 类型 (#25)

### Changed
- 诊断报告输出格式追加 FixSuggestion 部分
- AI 诊断 prompt 新增修复上下文注入

### Fixed
- 修复超大日志截断后丢失最后错误行的问题 (#27)

---

## [0.2.0] - 2026-06-23

### Added
- GitHub Actions 适配器，支持 `gh` CLI 自动拉取失败 run 日志 (#12)
- `/diagnose --run <id>` 命令指定 run ID

### Fixed
- 修复 `gh` 未安装时的异常崩溃，改为友好提示 (#18)
```

---

## 九、版本兼容性矩阵

| 版本 | Node.js 最低 | gh CLI | Claude Code 最低 | 模式库格式 |
|------|-------------|--------|-----------------|-----------|
| 0.1.x | 18 | 不需要 | 最新 | v1 |
| 0.2.x | 18 | 可选 | 最新 | v1 |
| 0.3.x | 18 | 可选 | 最新 | v1 |
| 0.4.x | 18 | 可选 | 最新 | v2 |
| 0.5.x | 18 | 可选 | 最新 | v2 |
| 1.0.x | 18 | 可选 | 最新 | v2 |

### 模式库迁移

当模式库格式变更时（如 v1 → v2），提供自动迁移：

```
首次运行新版自动触发迁移
.ci-diagnoser/patterns.json  →  自动升级格式，备份旧版为 patterns.v1.json.bak
```

---

## 十、发布节奏总结

```
2026-06
───────
W1: v0.1.0-alpha.1 → v0.1.0-alpha.2 → v0.1.0
W2: v0.2.0-alpha.1 → v0.2.0
W3: v0.3.0-alpha.1 → v0.3.0
W4: v0.4.0-alpha.1 → v0.4.0

2026-07
───────
W1: v0.5.0-alpha.1 → v0.5.0
W2: v0.9.0-rc.1 → v1.0.0 🎉
```

| 版本 | 预计日期 | 工期 |
|------|---------|------|
| v0.1.0 | 06-22 | 2 天 |
| v0.2.0 | 06-23 | 1 天 |
| v0.3.0 | 06-24 | 1 天 |
| v0.4.0 | 06-25 | 1 天 |
| v0.5.0 | 06-28 | 1 天 |
| v1.0.0 | 06-29 | 1 天 |

---

*文档版本：v1.0 | 创建日期：2026-06-21 | 状态：规划中*
