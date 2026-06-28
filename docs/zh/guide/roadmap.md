# 版本路线图

CI/CD Failure Diagnoser 通过主题化版本迭代，每一版增加一层智能。

## 当前版本

### v0.1.0 — 基础（已完成）

**主题**：基础诊断能力

**功能**：
- ✅ `diagnose()` — 本地文件 → AI 诊断
- ✅ 日志预处理（ANSI 清理、日志解析）
- ✅ 配置管理（`mergeConfig`、`getDefaultConfig`）
- ✅ 格式化工具（置信度、分类、位置）
- ✅ TypeScript/Node.js API 骨架
- ✅ 支持零安装 `npx` 的 CLI
- ✅ 涵盖主要失败类型的 6 个测试日志样本

**使用场景**：
- 本地 CI 日志文件的手动诊断
- 基于模式的失败分类
- 基础修复建议

## 规划版本

### v0.2.0 — 模式引擎

**主题**：失败模式识别

**规划功能**：
- 模式匹配引擎
- 带指纹的偶发测试检测
- 失败模式数据库
- 历史模式查询
- 跨仓库模式共享

### v0.3.0 — 多平台

**主题**：CI 平台集成

**规划功能**：
- GitHub Actions 适配器（gh CLI 集成）
- GitLab CI 适配器
- Jenkins 适配器
- 实时日志获取
- 基于 Run ID 的诊断

### v0.4.0 — 智能

**主题**：高级分析

**规划功能**：
- 级联错误分析
- 失败的语义分组
- 相关失败检测
- 修复推荐排序
- 解决方案置信度评分

### v1.0.0 — 生产

**主题**：生产就绪

**规划功能**：
- Claude Code 插件市场
- 性能优化
- 全面的文档
- 企业功能（SLA、审计日志）
- 社区建设

## 发布理念

- **增量价值**：每个版本都提供可用功能
- **向后兼容**：API 在次要版本间保持稳定
- **社区驱动**：路线图由用户反馈塑造

## 参与贡献

对未来版本有想法？[提交 Issue](https://github.com/saqqdy/ci-cd-failure-diagnoser/issues) 或参与讨论。

## 更新日志

发布历史请参阅 [CHANGELOG.md](https://github.com/saqqdy/ci-cd-failure-diagnoser/blob/master/CHANGELOG.md)。