# 🔍 CI/CD Failure Diagnoser

> AI-powered CI/CD failure diagnoser — understand **WHY** your pipeline failed, not just **THAT** it failed.

[![npm version](https://img.shields.io/npm/v/ci-cd-failure-diagnoser.svg)](https://www.npmjs.com/package/ci-cd-failure-diagnoser)
[![license](https://img.shields.io/npm/l/ci-cd-failure-diagnoser.svg)](https://github.com/saqqdy/ci-cd-failure-diagnoser/blob/master/LICENSE)

## Quick Links

- [Installation](/guide/installation) — Get started in minutes
- [Quick Start](/guide/quick-start) — See it in action
- [API Reference](/api/) — Programmatic usage
- [Skill Commands](/guide/skill-commands) — Interactive diagnosis

## The Problem

Traditional CI/CD logs tell you **what** failed, but not **why**:

```
Error: Process completed with exit code 1.
##[error]Node.js 12 actions are deprecated.
```

Questions it can't answer:
- What is the root cause?
- Is this a flaky test or a real failure?
- How do I fix this?
- Are there related cascading errors?

## The Solution

CI/CD Failure Diagnoser traces **root causes** through three layers:

| Layer | Capability | Output |
|-------|------------|--------|
| **Log Preprocessing** | Parse & normalize CI logs | `CILog`, `CIJob`, `CIStep` |
| **Pattern Analysis** | Classify failures, detect flaky tests | `DiagnosisResult`, `FailurePattern` |
| **Fix Suggestion** | Generate actionable fixes with evidence | `FixSuggestion`, confidence levels |

## Key Features

### 📋 Log Preprocessing

Structured parsing with zero configuration:

- **ANSI stripping** — Clean raw CI log output
- **Log parsing** — Extract jobs, steps, and error lines
- **Multi-platform** — GitHub Actions, GitLab CI, Jenkins

### 🧠 AI-Powered Analysis

- **Failure classification** — compile_error, test_failure, lint_error, etc.
- **Root cause detection** — Trace the actual cause from cascading errors
- **Flaky test detection** — Identify intermittent failures with fingerprints
- **Confidence scoring** — 🟢🟡🔴 levels based on evidence

### 💡 Actionable Fix Suggestions

- **Code fixes** — Specific patches and commands
- **Config fixes** — Configuration corrections
- **Dependency fixes** — Version conflict resolutions
- **Retry guidance** — For flaky test scenarios

### 🔄 Interactive Commands

In Claude Code, use natural language diagnosis:

| Command | Purpose |
|---------|---------|
| `/diagnose <file>` | Diagnose a CI log file |
| `/retry <test>` | Check if a test is flaky |
| `/fix <error>` | Get fix suggestions |

## Confidence Levels

| Level | Source | Meaning |
|-------|--------|---------|
| 🟢 **High** | Clear error pattern + evidence | Verified root cause |
| 🟡 **Medium** | Partial pattern match | Likely root cause |
| 🔴 **Low** | Ambiguous or novel error | Needs manual review |

## Example Output

```
/diagnose ci-log.txt

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

## Get Started

### 1. Claude Code Plugin (Recommended)

```bash
# Plugin marketplace
/plugin marketplace add saqqdy/ci-cd-failure-diagnoser
/plugin install ci-cd-failure-diagnoser
```

### 2. NPM Package

```bash
pnpm add ci-cd-failure-diagnoser
```

### 3. CLI (Zero-Install)

```bash
npx ci-cd-failure-diagnoser diagnose ci-log.txt
```

### 4. Clone & Explore

```bash
git clone https://github.com/saqqdy/ci-cd-failure-diagnoser.git
cd ci-cd-failure-diagnoser
pnpm install
npx tsx examples/basic-usage.ts
```

## Project Status

| Version | Theme | Status |
|---------|-------|--------|
| v0.1.0 | Basic diagnosis | 🚧 In Progress |
| v0.2.0 | Pattern engine | 📋 Planned |
| v0.3.0 | Multi-platform adapters | 📋 Planned |
| v1.0.0 | Production-ready | 📋 Planned |

See [Roadmap](/guide/roadmap) for details.

## License

MIT — use freely in personal and commercial projects.