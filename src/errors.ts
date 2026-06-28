/**
 * Structured error classes
 */

export class LogFileError extends Error {
	readonly filePath?: string
	readonly operation: 'read' | 'parse' | 'write'

	constructor(options: {
		filePath?: string
		operation: 'read' | 'parse' | 'write'
		message?: string
		cause?: Error
	}) {
		super(options.message ?? `Failed to ${options.operation} log file`)
		this.name = 'LogFileError'
		this.filePath = options.filePath
		this.operation = options.operation
	}
}

export class DiagnosisError extends Error {
	readonly step: string

	constructor(options: { step: string; message?: string }) {
		super(options.message ?? `Diagnosis failed at step: ${options.step}`)
		this.name = 'DiagnosisError'
		this.step = options.step
	}
}
