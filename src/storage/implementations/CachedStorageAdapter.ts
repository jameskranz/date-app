import { LibraryItem, LibraryRepository } from '../../types'

export class CachedStorageAdapter implements LibraryRepository {
  private _remote: LibraryRepository

  constructor(remoteAdapter: LibraryRepository) {
    this._remote = remoteAdapter
  }

  // Helper to satisfy tsc until implemented
  protected get remote(): LibraryRepository {
    return this._remote;
  }

  async getAllItems(): Promise<LibraryItem[]> {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async getLibrary(_category: string): Promise<LibraryItem[]> {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async addItem(_category: string, _text: string): Promise<LibraryItem> {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async removeItem(_id: string): Promise<void> {
    throw new Error('CachedStorageAdapter not yet implemented')
  }

  async updateItem(_id: string, _changes: Partial<LibraryItem>): Promise<LibraryItem | undefined> {
    throw new Error('CachedStorageAdapter not yet implemented')
  }
}
