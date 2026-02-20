import { v4 as uuidv4 } from 'uuid'
import { LibraryItem } from '../../types'

const STORAGE_KEY = 'date_library'

function loadAll(): LibraryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(items: LibraryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export class LocalLibraryAdapter {
  async getAllItems(): Promise<LibraryItem[]> {
    return loadAll()
  }

  async getLibrary(category: string): Promise<LibraryItem[]> {
    const all = loadAll()
    return all.filter(item => item.category === category)
  }

  async addItem(category: string, text: string): Promise<LibraryItem> {
    const all = loadAll()
    const newItem: LibraryItem = {
      id: uuidv4(),
      category,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }
    saveAll([...all, newItem])
    return newItem
  }

  async removeItem(id: string): Promise<void> {
    const all = loadAll()
    saveAll(all.filter(item => item.id !== id))
  }

  async updateItem(id: string, changes: Partial<LibraryItem>): Promise<LibraryItem | undefined> {
    const all = loadAll()
    const updated = all.map(item =>
      item.id === id ? { ...item, ...changes } : item
    )
    saveAll(updated)
    return updated.find(item => item.id === id)
  }
}
