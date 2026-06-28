# 快速开始

```bash
ci-cd-failure-diagnoser diagnose ./ci-log.txt
```

编程方式：

```typescript
import { diagnose } from 'ci-cd-failure-diagnoser'
const result = await diagnose({ file: 'tests/fixtures/github-actions/typescript-error.txt' })
```