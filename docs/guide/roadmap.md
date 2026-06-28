# Version Roadmap

CI/CD Failure Diagnoser evolves through themed releases, each adding a layer of intelligence.

## Current Release

### v0.1.0 — Foundation (Complete)

**Theme**: Basic Diagnosis Capability

**Capabilities**:
- ✅ `diagnose()` — Local file → AI diagnosis
- ✅ Log preprocessing (ANSI stripping, log parsing)
- ✅ Configuration management (`mergeConfig`, `getDefaultConfig`)
- ✅ Formatting utilities (confidence, category, location)
- ✅ TypeScript/Node.js API skeleton
- ✅ CLI with zero-install `npx` support
- ✅ 6 test log samples covering major failure categories

**Use Cases**:
- Manual diagnosis of local CI log files
- Pattern-based failure classification
- Basic fix suggestions

## Planned Releases

### v0.2.0 — Pattern Engine

**Theme**: Failure Pattern Recognition

**Planned Features**:
- Pattern matching engine
- Flaky test detection with fingerprints
- Failure pattern database
- Historical pattern lookup
- Cross-repository pattern sharing

### v0.3.0 — Multi-Platform

**Theme**: CI Platform Integration

**Planned Features**:
- GitHub Actions adapter (gh CLI integration)
- GitLab CI adapter
- Jenkins adapter
- Real-time log fetching
- Run ID-based diagnosis

### v0.4.0 — Intelligence

**Theme**: Advanced Analysis

**Planned Features**:
- Cascading error analysis
- Semantic grouping of failures
- Related failure detection
- Fix recommendation ranking
- Solution confidence scoring

### v1.0.0 — Production

**Theme**: Production Ready

**Planned Features**:
- Claude Code Plugin Marketplace
- Performance optimization
- Comprehensive documentation
- Enterprise features (SLA, audit logs)
- Community building

## Release Philosophy

- **Incremental Value**: Each release delivers usable features
- **Backward Compatible**: APIs remain stable across minor versions
- **Community Driven**: Roadmap shaped by user feedback

## Contributing

Have ideas for future releases? [Open an issue](https://github.com/saqqdy/ci-cd-failure-diagnoser/issues) or join discussions.

## Changelog

See [CHANGELOG.md](https://github.com/saqqdy/ci-cd-failure-diagnoser/blob/master/CHANGELOG.md) for release history.