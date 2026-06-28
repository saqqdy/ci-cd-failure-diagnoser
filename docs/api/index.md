# API Reference

Complete TypeScript/Node.js API for CI/CD failure diagnosis.

## Core Functions

### Diagnosis

| Function | Description | Returns |
|----------|-------------|---------|
| `diagnose()` | Diagnose a CI log file | `DiagnosisResult` |

### Configuration

| Function | Description | Returns |
|----------|-------------|---------|
| `mergeConfig()` | Merge user config with defaults | `DiagnoserConfig` |
| `getDefaultConfig()` | Get default configuration | `DiagnoserConfig` |
| `validateConfig()` | Validate config settings | `boolean` |

### Formatting

| Function | Description | Returns |
|----------|-------------|---------|
| `formatCategory()` | Format failure category | `string` |
| `formatConfidence()` | Format confidence level | `string` |
| `formatDuration()` | Format duration in ms | `string` |
| `truncate()` | Truncate long strings | `string` |
| `formatLocation()` | Format file:line:column | `string` |
| `formatCodeSnippet()` | Format code with line numbers | `string` |
| `formatDiagnosis()` | Format full diagnosis result | `string` |

## Types

### Diagnosis Types

```typescript
import type {
  CILog,
  CIJob,
  CIStep,
  DiagnosisResult,
  FailureCategory,
  FixSuggestion,
  FixType,
} from 'ci-cd-failure-diagnoser'
```

### Configuration Types

```typescript
import type {
  DiagnoserConfig,
  AnalyzerConfig,
  CacheConfig,
} from 'ci-cd-failure-diagnoser'
```

## Common Patterns

### Basic Diagnosis

```typescript
import { diagnose, formatDiagnosis } from 'ci-cd-failure-diagnoser'

const result = await diagnose({
  file: 'ci-log.txt',
})

console.log(formatDiagnosis(result))
```

### Custom Configuration

```typescript
import { diagnose, mergeConfig } from 'ci-cd-failure-diagnoser'

const config = mergeConfig({
  enableCache: true,
  cacheDir: '.ci-diagnoser-cache',
  cacheTTL: 3600,
  analyzerConfig: {
    maxIterations: 10,
    timeoutMs: 60000,
  },
})

const result = await diagnose({ file: 'ci-log.txt' })
```

### Format Output

```typescript
import { diagnose, formatCategory, formatConfidence } from 'ci-cd-failure-diagnoser'

const result = await diagnose({ file: 'ci-log.txt' })

console.log('Category:', formatCategory(result.rootCause.category))
console.log('Confidence:', formatConfidence(result.rootCause.confidence))
console.log('Summary:', result.rootCause.summary)
```

## Error Handling

```typescript
import { diagnose } from 'ci-cd-failure-diagnoser'

try {
  const result = await diagnose({ file: 'ci-log.txt' })
  if (!result) {
    console.log('No diagnosis result found')
  }
} catch (error) {
  console.error('Diagnosis failed:', error)
}
```

## Configuration Options

### DiagnoserConfig

```typescript
interface DiagnoserConfig {
  maxLogSize: number          // Maximum log size in bytes (default: 1MB)
  enableCache: boolean       // Enable caching (default: true)
  cacheDir: string           // Cache directory (default: '.ci-diagnoser-cache')
  cacheTTL: number           // Cache TTL in seconds (default: 3600)
  excludePatterns: string[]  // Patterns to exclude
  analyzerConfig: AnalyzerConfig  // Analysis settings
}
```

### AnalyzerConfig

```typescript
interface AnalyzerConfig {
  maxIterations: number      // Maximum analysis iterations (default: 5)
  timeoutMs: number          // Timeout in milliseconds (default: 30000)
  modelPreferences: {
    classification: string   // Model for classification (default: 'haiku')
    diagnosis: string        // Model for diagnosis (default: 'sonnet')
    solution: string         // Model for solutions (default: 'sonnet')
  }
}
```

## CLI Reference

```bash
# Diagnose a log file
npx ci-cd-failure-diagnoser diagnose ci-log.txt

# Show version
npx ci-cd-failure-diagnoser version

# Help
npx ci-cd-failure-diagnoser help
```

## Next Steps

- Check [Skill Commands](/guide/skill-commands) for interactive usage
- See [Roadmap](/guide/roadmap) for planned features