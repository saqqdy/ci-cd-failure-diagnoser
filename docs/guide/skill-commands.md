# Skill Commands

CI/CD Failure Diagnoser provides interactive diagnosis commands in Claude Code.

## Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/diagnose <file>` | Diagnose a CI log file | `/diagnose ci-log.txt` |
| `/retry <test>` | Check if a test is flaky | `/retry auth.test.ts` |
| `/fix <error>` | Get fix suggestions | `/fix typescript` |
| `/history <run>` | Show failure history | `/history run-123` |

## `/diagnose` — Root Cause Analysis

Analyze a CI log file and identify root causes.

**Usage**:
```
/diagnose tests/fixtures/github-actions/typescript-error.txt
```

**Output**:
```
🔍 Diagnosing CI failure...

📊 Diagnosis:
  分类: 🔨 编译错误
  置信度: 🟢 高 (≥80%)
  失败步骤: Build

🔍 Root Cause:
  TypeScript type error in src/index.ts

📋 Key Evidence:
  - error TS2322: Type "string" is not assignable to type "number"
  - src/index.ts:42:10

💡 Fix Suggestion:
  - Type: code_fix
  - Change variable type from string to number
  - Command: npx tsc --noEmit

💭 Follow up:
   - /fix typescript
   - /retry build.test.ts
```

## `/retry` — Flaky Test Detection

Check if a failing test is flaky and get retry recommendations.

**Usage**:
```
/retry auth.test.ts
```

**Output**:
```
🎲 Checking flaky test status...

⏭️  Flaky Test Detected
   Test: auth.test.ts::login
   Failure rate: 35% (last 20 runs)
   Pattern: Intermittent timeout

💡 Recommendation:
   - Retry 3 times before marking as failed
   - Add flaky test quarantine
   - Consider fixing root cause

🔧 Commands:
   npx vitest run auth.test.ts --retry=3
```

## `/fix` — Fix Suggestion

Get specific fix suggestions for an error type.

**Usage**:
```
/fix typescript
```

**Output**:
```
🔧 Fix suggestions for typescript errors...

📋 Common fixes:
   1. Check type definitions
   2. Ensure type compatibility
   3. Use type guards

💡 Recommended:
   - Run type check: npx tsc --noEmit
   - Fix specific error at src/index.ts:42

🔗 References:
   - TypeScript Handbook: https://www.typescriptlang.org/docs/
   - Common TS errors: https://example.com/ts-errors
```

## `/history` — Failure Pattern History

Show historical patterns for a CI run.

**Usage**:
```
/history run-123456
```

**Output**:
```
📜 Failure history for run-123456...

📊 Pattern Analysis:
   1. [2024-06-15] TypeScript compile error (3 occurrences)
      → Same error pattern: type mismatch
      → Confidence: 🟢 High

   2. [2024-06-14] Timeout in test suite (2 occurrences)
      → Pattern: flaky test
      → Confidence: 🟡 Medium

🔑 Related Issues:
   - Issue #42: Similar TS error
   - Issue #18: Timeout pattern
```

## Confidence Levels

Commands return confidence levels based on evidence:

| Level | Source | Meaning |
|-------|--------|---------|
| 🟢 High | Clear error pattern + evidence | Verified root cause |
| 🟡 Medium | Partial pattern match | Likely root cause |
| 🔴 Low | Ambiguous or novel error | Needs manual review |

## Tips

### Effective Usage

1. **Start with `/diagnose`** — Understand the failure
2. **Use `/retry` for tests** — Check flaky status
3. **Follow up with `/fix`** — Get specific solutions
4. **Track patterns with `/history`** — Learn from failures

### Combining Commands

Chain commands for deeper insights:

```
/diagnose ci-log.txt
  → reveals TypeScript error
/fix typescript
  → shows fix commands
/retry related.test.ts
  → checks if test is flaky
```

## Programmatic Access

All skill commands use the underlying API. You can achieve the same results programmatically:

```typescript
import { diagnose, formatDiagnosis, getDefaultConfig } from 'ci-cd-failure-diagnoser'

const config = getDefaultConfig()
const result = await diagnose({ file: 'ci-log.txt' })
console.log(formatDiagnosis(result))
```

See [API Reference](/api/) for full details.