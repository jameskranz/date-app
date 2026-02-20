import { LibraryItem, LibraryRepository } from '../../types'

export class CachedStorageAdapter implements LibraryRepository {
  private remote: LibraryRepository

  constructor(remoteAdapter: LibraryRepository) {
    this.remote = remoteAdapter
  }

  async getAllItems(): Promise<LibraryItem[]> {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async getLibrary(category: string): Promise<LibraryItem[]> {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async addItem(category: string, text: string): Promise<LibraryItem> {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async removeItem(id: string): Promise<void> {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async updateItem(id: string, changes: Partial<LibraryItem>): Promise<LibraryItem | undefined> {
    throw new Error('CachedStorageAdapter not yet implemented')
  }
}
