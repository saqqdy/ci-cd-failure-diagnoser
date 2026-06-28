# CI/CD Failure Diagnoser - Claude Code Context

## 项目简介

这是一个 Claude Code Skill 插件，用于诊断 CI/CD 失败。

## 开发指南

### 技术栈
- TypeScript
- Node.js 18+
- tsup (构建)
- Vitest (测试)
- ESLint + Prettier (代码质量)

### 项目结构
```
src/
├── index.ts           # 入口
├── models/types.ts    # 核心数据模型
├── adapters/          # 平台适配器
├── analyzer/          # 日志分析引擎
├── patterns/          # 模式引擎
└── fixer/             # 修复建议
```

### 开发流程
1. 安装依赖: `pnpm install`
2. 开发模式: `pnpm dev`
3. 构建: `pnpm build`
4. 测试: `pnpm test`
5. 类型检查: `pnpm typecheck`
6. 代码检查: `pnpm lint`

### Git 提交规范
使用 Conventional Commits:
- `feat(scope): 描述` - 新功能
- `fix(scope): 描述` - Bug 修复
- `docs(scope): 描述` - 文档更新
- `refactor(scope): 描述` - 重构
- `test(scope): 描述` - 测试

### 发版流程
参考 `internal/release-plan.md`

## 核心原则

1. **语义理解优先** — 理解日志语义，不是简单正则匹配
2. **证据驱动** — 所有诊断结论必须引用日志原文
3. **最小修复** — 生成最小化的修复方案，不做过度修改
4. **用户确认** — 每次修复都要用户确认后再应用
5. **渐进式** — 支持逐步诊断，不要求一次性完成