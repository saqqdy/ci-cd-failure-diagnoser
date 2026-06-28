# 技能命令

CI/CD Failure Diagnoser 在 Claude Code 中提供交互式诊断命令。

## 可用命令

| 命令 | 描述 | 示例 |
|------|------|------|
| `/diagnose <file>` | 诊断 CI 日志文件 | `/diagnose ci-log.txt` |
| `/retry <test>` | 检查测试是否偶发 | `/retry auth.test.ts` |
| `/fix <error>` | 获取修复建议 | `/fix typescript` |
| `/history <run>` | 显示失败历史 | `/history run-123` |

## `/diagnose` — 根本原因分析

分析 CI 日志文件并识别根本原因。

**用法**：
```
/diagnose tests/fixtures/github-actions/typescript-error.txt
```

**输出**：
```
🔍 正在诊断 CI 失败...

📊 诊断结果:
  分类: 🔨 编译错误
  置信度: 🟢 高 (≥80%)
  失败步骤: Build

🔍 根本原因:
  src/index.ts 中的 TypeScript 类型错误

📋 关键证据:
  - error TS2322: Type "string" is not assignable to type "number"
  - src/index.ts:42:10

💡 修复建议:
  - 类型: code_fix
  - 将变量类型从 string 改为 number
  - 命令: npx tsc --noEmit

💭 后续步骤:
   - /fix typescript
   - /retry build.test.ts
```

## `/retry` — 偶发测试检测

检查失败的测试是否偶发，并获取重试建议。

**用法**：
```
/retry auth.test.ts
```

**输出**：
```
🎲 正在检查偶发测试状态...

⏭️  检测到偶发测试
   测试: auth.test.ts::login
   失败率: 35% (最近 20 次运行)
   模式: 间歇性超时

💡 建议:
   - 失败前重试 3 次
   - 添加偶发测试隔离
   - 考虑修复根本原因

🔧 命令:
   npx vitest run auth.test.ts --retry=3
```

## `/fix` — 修复建议

获取针对特定错误类型的修复建议。

**用法**：
```
/fix typescript
```

**输出**：
```
🔧 TypeScript 错误的修复建议...

📋 常见修复:
   1. 检查类型定义
   2. 确保类型兼容
   3. 使用类型守卫

💡 推荐:
   - 运行类型检查: npx tsc --noEmit
   - 修复 src/index.ts:42 的具体错误

🔗 参考资料:
   - TypeScript 手册: https://www.typescriptlang.org/docs/
   - 常见 TS 错误: https://example.com/ts-errors
```

## `/history` — 失败模式历史

显示 CI 运行的历史模式。

**用法**：
```
/history run-123456
```

**输出**：
```
📜 run-123456 的失败历史...

📊 模式分析:
   1. [2024-06-15] TypeScript 编译错误 (3 次)
      → 相同错误模式: 类型不匹配
      → 置信度: 🟢 高

   2. [2024-06-14] 测试套件超时 (2 次)
      → 模式: 偶发测试
      → 置信度: 🟡 中

🔑 相关 Issue:
   - Issue #42: 类似的 TS 错误
   - Issue #18: 超时模式
```

## 置信度等级

命令根据证据返回置信度等级：

| 等级 | 来源 | 含义 |
|------|------|------|
| 🟢 高 | 清晰的错误模式 + 证据 | 已验证的根本原因 |
| 🟡 中 | 部分模式匹配 | 可能的根本原因 |
| 🔴 低 | 模糊或新错误 | 需要人工审查 |

## 使用技巧

### 有效使用

1. **从 `/diagnose` 开始** — 了解失败原因
2. **对测试使用 `/retry`** — 检查偶发状态
3. **跟进 `/fix`** — 获取具体解决方案
4. **用 `/history` 追踪模式** — 从失败中学习

### 组合命令

链接命令以获得更深入的见解：

```
/diagnose ci-log.txt
  → 发现 TypeScript 错误
/fix typescript
  → 显示修复命令
/retry related.test.ts
  → 检查测试是否偶发
```

## 编程访问

所有技能命令都使用底层 API。你可以通过编程实现相同的结果：

```typescript
import { diagnose, formatDiagnosis, getDefaultConfig } from 'ci-cd-failure-diagnoser'

const config = getDefaultConfig()
const result = await diagnose({ file: 'ci-log.txt' })
console.log(formatDiagnosis(result))
```

完整详情请参阅 [API 参考](/zh/api/)。