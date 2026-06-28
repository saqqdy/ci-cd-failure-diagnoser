# Changelog

## 0.1.0 (2026-06-28)

### 🚀 Features

- **cli**: add zero-install CLI for quick experience
  - `npx ci-cd-failure-diagnoser diagnose <file>` — diagnose local log file
  - `npx ci-cd-failure-diagnoser version` — show version
  - `npx ci-cd-failure-diagnoser help` — show help

- **adapters**: add local file adapter
  - `LocalFileAdapter` — read local CI log files
  - `getLog()` — parse log into structured `CILog` format

- **analyzer**: add log preprocessing layer
  - `preprocessor.ts` — normalize and prepare logs for AI analysis
  - `ansi-stripper.ts` — remove ANSI control characters
  - `log-parser.ts` — extract jobs, steps, error lines

- **prompts**: add AI prompt templates
  - `classify.md` — two-stage classification prompt
  - `diagnose.md` — detailed diagnosis prompt

- **types**: add core data models and configuration type definitions
  - `CILog`, `CIJob`, `CIStep` — unified CI log structure
  - `DiagnosisResult` — diagnosis output model
  - `FailureCategory` — 11 failure categories
  - `FixSuggestion` — fix suggestion model
  - `FailurePattern`, `FlakyFingerprint` — pattern models
  - `AnalyzerConfig` — Analysis settings (iterations, timeout, model preferences)
  - `CacheConfig` — Cache settings (enabled, dir, TTL)
  - `DiagnoserConfig` — Global configuration (log size, cache, patterns, analyzer)

- **utils**: add configuration and formatting utilities
  - `mergeConfig()` / `getDefaultConfig()` / `validateConfig()` for `DiagnoserConfig`
  - `formatCategory()` — Format failure category with emoji
  - `formatConfidence()` — Format confidence level with color indicators
  - `formatDuration()` / `truncate()` / `formatLocation()` / `formatCodeSnippet()` — General formatting helpers
  - `formatDiagnosis()` — Format full diagnosis result as Markdown

- **diagnose**: add main diagnosis function skeleton
  - `diagnose()` — placeholder for Phase 1 implementation

- **index**: update exports to include config and format utilities
  - Export all config functions (`mergeConfig`, `getDefaultConfig`, `validateConfig`)
  - Export all format functions for user convenience

- **examples**: add usage examples
  - `examples/basic-usage.ts` — demonstrates diagnose API usage
  - `examples/skill-commands.ts` — Simulates `/diagnose`, `/retry`, `/fix` commands
  - `examples/with-cache.ts` — Demonstrates cache configuration and performance gains

### 📝 Documentation

- **skill**: add Claude Code Skill definition
  - `.claude/skills/ci-cd-failure-diagnoser/skill.md`
  - Commands: `/diagnose`, `/retry`, `/fix`, `/history`
  - Confidence levels: 🟢 High / 🟡 Medium / 🔴 Low

- **readme**: comprehensive README enhancement
  - Enhanced landing page with problem/solution comparison
  - Added confidence levels explanation (🟢🟡🔴)
  - Added interactive commands table
  - Added output examples
  - Added version roadmap with themed releases
  - Added project structure overview
  - Added comparison section vs manual analysis

- **readme-cn**: complete Chinese documentation
  - Full Chinese translation of enhanced README
  - Maintained consistent structure with English version
  - Used proper Chinese terminology (根因链, 指纹匹配, etc.)

- **docs**: add complete guide and API documentation (English + Chinese)
  - `docs/guide/roadmap.md` — Version roadmap with themed releases
  - `docs/guide/skill-commands.md` — Interactive command documentation
  - `docs/api/index.md` — Expanded API reference with usage patterns
  - `docs/zh/index.md` — Chinese homepage
  - `docs/zh/guide/roadmap.md` — Chinese version roadmap
  - `docs/zh/guide/skill-commands.md` — Chinese skill commands

### ✅ Testing

- **tests**: add initial test suite
  - `tests/adapters/local.test.ts` — LocalFileAdapter tests
  - `tests/analyzer/preprocessor.test.ts` — preprocessor tests
  - `tests/utils/ansi-stripper.test.ts` — ANSI stripper tests
  - `tests/utils/log-parser.test.ts` — log parser tests

- **format**: add comprehensive test suite for formatting utilities
  - Test all format functions (`formatCategory`, `formatConfidence`, `formatDuration`, etc.)
  - Test edge cases and all failure categories
  - Test full diagnosis result formatting

- **fixtures**: complete test log sample coverage (6 samples)
  - `typescript-error.txt` — TypeScript compilation error (`compile_error`)
  - `test-failure.txt` — Jest test failure (`test_failure`)
  - `lint-error.txt` — ESLint lint errors (`lint_error`)
  - `dependency-conflict.txt` — npm peer dependency conflict (`dependency_conflict`)
  - `timeout-error.txt` — Cypress E2E timeout (`timeout`)
  - `env-issue.txt` — Missing environment variables (`env_issue`)

### 🔧 Chores

- **project**: initialize project skeleton and align with git-unearth patterns
  - TypeScript 5.9 configuration
  - tsup build setup (ESM + CJS)
  - Vitest test framework
  - ESLint 9 + Prettier
  - VitePress documentation site
  - Added `src/utils/config.ts` — configuration management
  - Added `src/utils/format.ts` — output formatting utilities
  - Added `src/models/types.ts` config type definitions
  - Updated `src/index.ts` exports