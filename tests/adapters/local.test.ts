import { describe, expect, it } from 'vitest'
import { LocalFileAdapter } from '../../src/adapters/local'

describe('LocalFileAdapter', () => {
	it('should be available', async () => {
		const adapter = new LocalFileAdapter()
		expect(await adapter.isAvailable()).toBe(true)
	})
})
