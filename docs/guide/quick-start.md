# Quick Start

```bash
ci-cd-failure-diagnoser diagnose ./ci-log.txt
```

```typescript
import { diagnose } from 'ci-cd-failure-diagnoser'
const result = await diagnose({ file: 'tests/fixtures/github-actions/typescript-error.txt' })
```