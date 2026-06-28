# 🔍 CI/CD Failure Diagnoser

> AI-powered CI/CD failure diagnoser — understand **WHY** your pipeline failed, not just **THAT** it failed. Root cause analysis via Claude Code Skill.

[![npm version](https://img.shields.io/npm/v/ci-cd-failure-diagnoser.svg)](https://www.npmjs.com/package/ci-cd-failure-diagnoser)
[![license](https://img.shields.io/npm/l/ci-cd-failure-diagnoser.svg)](https://github.com/saqqdy/ci-cd-failure-diagnoser/blob/master/LICENSE)

[中文文档](README_CN.md)

---

## 🎯 The Problem It Solves

| Scenario | Traditional CI Logs | CI/CD Failure Diagnoser |
|----------|---------------------|-------------------------|
| "What failed?" | Thousands of log lines | AI extracts root cause in seconds |
| "Root cause vs cascading?" | All errors look equally important | Distinguishes root → cascading → unrelated |
| "Is this a flaky test?" | Manual retry testing | Fingerprint-based detection + recommendation |
| "How to fix?" | Experience-based guessing | Generated minimal fix patch/command |

**Core insight**: Failure diagnosis requires understanding **root cause chains**, not just error messages.

---

## ✨ Core Features

### 📋 Log Preprocessing Layer (v0.1.0)

Structured parsing of CI log output:

- **ANSI Stripping** — Clean raw CI log output
- **Log Parsing** — Extract jobs, steps, error lines
- **Preprocessor** — Normalize multi-platform formats

### 🧠 AI-Powered Analysis

- **Failure Classification** — compile_error, test_failure, lint_error, etc.
- **Root Cause Detection** — Trace actual cause from cascading errors
- **Flaky Test Detection** — Identify intermittent failures with fingerprints
- **Confidence Scoring** — 🟢🟡🔴 levels based on evidence

### 💡 Actionable Fix Suggestions

- **Code Fixes** — Specific patches and commands
- **Config Fixes** — Configuration corrections
- **Dependency Fixes** — Version conflict resolutions
- **Retry Guidance** — For flaky test scenarios

### 🔄 Interactive Diagnosis Commands

| Command | Description |
|---------|-------------|
| `/diagnose <file>` | Diagnose a CI log file, identify root cause |
| `/retry <test>` | Check if a test is flaky, get retry recommendation |
| `/fix <error>` | Get specific fix suggestions for error type |
| `/history <run>` | Show failure pattern history for a run |

---

## 🚀 Getting Started

### Option 1: Claude Code Plugin (Recommended)

This project is a **Claude Code Plugin**. Install via marketplace for one-click setup.

#### Method A: Plugin Marketplace (Recommended)

```bash
# In Claude Code, run:
/plugin marketplace add saqqdy/ci-cd-failure-diagnoser
/plugin install ci-cd-failure-diagnoser
```

#### Method B: Local Install

```bash
# 1. Go to your project
cd your-project

# 2. Install npm package
pnpm add -D ci-cd-failure-diagnoser

# 3. Copy plugin files
mkdir -p .claude/skills
cp -r node_modules/ci-cd-failure-diagnoser/.claude/skills/ci-cd-failure-diagnoser .claude/skills/
```

#### Available Commands

Type these commands in Claude Code:

| Command | Description | Example |
|---------|-------------|---------|
| `/diagnose` | Diagnose a CI log file | `/diagnose ci-log.txt` |
| `/retry` | Check if a test is flaky | `/retry auth.test.ts` |
| `/fix` | Get fix suggestions | `/fix typescript` |
| `/history` | Show failure history | `/history run-123` |

#### Output Example

```
/diagnose tests/fixtures/github-actions/typescript-error.txt

🔍 Diagnosing CI failure...

📊 Diagnosis:
  分类: 🔨 编译错误
  置信度: 🟢 高 (≥80%)
  失败步骤: Build

🔍 Root Cause:
  TypeScript type error: Type "string" is not assignable to type "number"

📋 Key Evidence:
  - error TS2322: Type "string" is not assignable to type "number"
  - src/index.ts:42:10

💡 Fix Suggestion:
  - Type: code_fix
  - Change variable type from string to number
  - Command: npx tsc --noEmit
```

### Option 2: Programmatic Usage

```bash
pnpm add ci-cd-failure-diagnoser
```

```typescript
import { diagnose, formatDiagnosis, getDefaultConfig } from 'ci-cd-failure-diagnoser'

// Basic diagnosis
const result = await diagnose({ file: 'ci-log.txt' })
console.log(formatDiagnosis(result))

// With custom config
const config = getDefaultConfig()
const result2 = await diagnose({
  file: 'ci-log.txt',
  config,
})

// Access specific fields
console.log('Category:', result.rootCause.category)
console.log('Confidence:', result.rootCause.confidence)
console.log('Fix:', result.suggestedFix?.description)
```

### Option 3: CLI (Zero-Install)

```bash
# In any project, run directly:
npx ci-cd-failure-diagnoser diagnose ci-log.txt
npx ci-cd-failure-diagnoser version
npx ci-cd-failure-diagnoser help
```

### Option 4: Clone and Run Examples

```bash
git clone https://github.com/saqqdy/ci-cd-failure-diagnoser.git
cd ci-cd-failure-diagnoser
pnpm install

# Run examples
npx tsx examples/basic-usage.ts
npx tsx examples/with-cache.ts
npx tsx examples/skill-commands.ts
```

---

## 📋 Version Roadmap

| Version | Codename | Theme | Status |
|---------|----------|-------|--------|
| v0.1.0 | Foundation | Basic diagnosis capability (local file → AI diagnosis) | ✅ Current |
| v0.2.0 | Pattern Engine | Failure pattern recognition + flaky detection | 📋 Planned |
| v0.3.0 | Multi-Platform | GitHub Actions/GitLab CI/Jenkins adapters | 📋 Planned |
| v0.4.0 | Intelligence | Cascading analysis + fix ranking | 📋 Planned |
| v1.0.0 | Production | Marketplace + enterprise features | 📋 Planned |

---

## 🗂️ Project Structure

```
ci-cd-failure-diagnoser/
├── .claude/skills/ci-cd-failure-diagnoser/  # Skill prompts (core product)
│   └── skill.md                              # Commands + execution flow
├── src/                                      # TypeScript source
│   ├── index.ts                              # Public API exports
│   ├── models/types.ts                       # Core types
│   ├── errors.ts                             # Custom error types
│   ├── adapters/                             # CI platform adapters
│   │   └── local.ts                          # Local file adapter
│   ├── analyzer/                             # AI analyzer
│   │   ├── preprocessor.ts                   # Log preprocessing
│   │   └── prompts/                          # AI prompts
│   │       ├── classify.md                   # Classification prompt
│   │       └── diagnose.md                   # Diagnosis prompt
│   └── utils/                                # Utilities
│       ├── config.ts                         # Config management
│       ├── format.ts                         # Output formatting
│       ├── ansi-stripper.ts                  # ANSI cleaning
│       └── log-parser.ts                     # Log parsing
├── tests/                                    # Test files
├── examples/                                 # Usage examples
├── docs/                                     # VitePress docs
└── internal/                                 # Planning docs
```

---

## 🛠️ Development

```bash
pnpm install          # Install dependencies
pnpm run lint         # ESLint + auto-fix
pnpm run typecheck    # TypeScript check
pnpm run test         # Run tests (vitest)
pnpm run build        # Build (ESM + CJS)
pnpm run docs:dev     # Start docs server
```

---

## 🆚 Comparison

### vs Manual Log Analysis

| Dimension | Manual Analysis | CI/CD Failure Diagnoser |
|-----------|-----------------|-------------------------|
| Output | Thousands of log lines | Structured `DiagnosisResult` + fix suggestion |
| Root Cause? | ❌ Manual search | ✅ AI traces root → cascading chain |
| Flaky Detection | ❌ Manual retry | ✅ Fingerprint-based detection |
| Confidence | ❌ No | ✅ 🟢🟡🔴 levels based on evidence |
| Fix Suggestion | ❌ No | ✅ Generated patch/command |

---

## 📄 License

[MIT](./LICENSE)