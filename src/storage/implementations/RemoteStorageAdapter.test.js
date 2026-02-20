import { describe, it, expect } from 'vitest'
import { RemoteStorageAdapter } from './RemoteStorageAdapter'

describe('RemoteStorageAdapter', () => {
  const adapter = new RemoteStorageAdapter()

  it('getAllItems should throw not implemented', async () => {
    await expect(adapter.getAllItems()).rejects.toThrow('RemoteStorageAdapter not yet implemented')
  })

  it('getLibrary should throw not implemented', async () => {
    await expect(adapter.getLibrary('Dinner')).rejects.toThrow('RemoteStorageAdapter not yet implemented')
  })

  it('addItem should throw not implemented', async () => {
    await expect(adapter.addItem('Dinner', 'Test')).rejects.toThrow('RemoteStorageAdapter not yet implemented')
  })

  it('removeItem should throw not implemented', async () => {
    await expect(adapter.removeItem('id')).rejects.toThrow('RemoteStorageAdapter not yet implemented')
  })

  it('updateItem should throw not implemented', async () => {
    await expect(adapter.updateItem('id', {})).rejects.toThrow('RemoteStorageAdapter not yet implemented')
  })
})