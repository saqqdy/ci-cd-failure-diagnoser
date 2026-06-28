# API 概览

## diagnose(options)

诊断 CI 失败的主函数。

```typescript
const result = await diagnose({ file: 'path/to/log.txt' })
```

## LocalFileAdapter

读取本地 CI 日志文件。

```typescript
const adapter = new LocalFileAdapter()
const log = await adapter.getLog('ci-log.txt')
```