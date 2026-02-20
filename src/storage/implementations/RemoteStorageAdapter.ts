import { LibraryItem, LibraryRepository } from '../../types'

export class RemoteStorageAdapter implements LibraryRepository {
  async getAllItems(): Promise<LibraryItem[]> {
    throw new Error('RemoteStorageAdapter not yet implemented')
  }

  async getLibrary(_category: string): Promise<LibraryItem[]> {
    throw new Error('RemoteStorageAdapter not yet implemented')
  }

  async addItem(_category: string, _text: string): Promise<LibraryItem> {
    throw new Error('RemoteStorageAdapter not yet implemented')
  }

  async removeItem(_id: string): Promise<void> {
    throw new Error('RemoteStorageAdapter not yet implemented')
  }

  async updateItem(_id: string, _changes: Partial<LibraryItem>): Promise<LibraryItem | undefined> {
    throw new Error('RemoteStorageAdapter not yet implemented')
  }
}
