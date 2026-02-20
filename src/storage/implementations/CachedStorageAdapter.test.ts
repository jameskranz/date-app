import { describe, it, expect } from 'vitest'
import { CachedStorageAdapter } from './CachedStorageAdapter'
import { LibraryRepository } from '../../types'

describe('CachedStorageAdapter', () => {
  const adapter = new CachedStorageAdapter({} as LibraryRepository)

  it('getAllItems should throw not implemented', async () => {
    await expect(adapter.getAllItems()).rejects.toThrow('CachedStorageAdapter not yet implemented')
  })

  it('getLibrary should throw not implemented', async () => {
    await expect(adapter.getLibrary('Dinner')).rejects.toThrow('CachedStorageAdapter not yet implemented')
  })

  it('addItem should throw not implemented', async () => {
    await expect(adapter.addItem('Dinner', 'Test')).rejects.toThrow('CachedStorageAdapter not yet implemented')
  })

  it('removeItem should throw not implemented', async () => {
    await expect(adapter.removeItem('id')).rejects.toThrow('CachedStorageAdapter not yet implemented')
  })

  it('updateItem should throw not implemented', async () => {
    await expect(adapter.updateItem('id', {})).rejects.toThrow('CachedStorageAdapter not yet implemented')
  })
})
