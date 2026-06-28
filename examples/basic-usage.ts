# Basic Usage

```typescript
import { diagnose } from 'ci-cd-failure-diagnoser'

const result = await diagnose({ file: 'ci-log.txt' })
console.log(result.rootCause.category)
```