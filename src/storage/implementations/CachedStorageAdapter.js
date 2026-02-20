// CachedStorageAdapter.js
// Phase 3: wraps RemoteStorageAdapter with LocalStorage as a read cache.
// Reads hit local first; writes propagate to both.
//
// Usage:
//   const adapter = new CachedStorageAdapter(new RemoteStorageAdapter())

export class CachedStorageAdapter {
  constructor(remoteAdapter) {
    this.remote = remoteAdapter
  }

  async getAllItems() {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async getLibrary(category) {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async addItem(category, text) {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async removeItem(id) {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async updateItem(id, changes) {
    throw new Error('CachedStorageAdapter not yet implemented')
  }
}