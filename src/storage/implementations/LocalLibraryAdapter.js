// LocalLibraryAdapter.js
// Implements the storage interface using localStorage.
// All methods are async to match the interface contract,
// making it a drop-in replacement for remote adapters.
//
// Interface contract (all adapters must implement):
//   getLibrary(category: string) → Promise<Item[]>
//   addItem(category: string, text: string) → Promise<Item>
//   removeItem(id: string) → Promise<void>
//   updateItem(id: string, changes: object) → Promise<Item>
//   getAllItems() → Promise<Item[]>

import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'date_library'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export class LocalLibraryAdapter {
  async getAllItems() {
    return loadAll()
  }

  async getLibrary(category) {
    const all = loadAll()
    return all.filter(item => item.category === category)
  }

  async addItem(category, text) {
    const all = loadAll()
    const newItem = {
      id: uuidv4(),
      category,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }
    saveAll([...all, newItem])
    return newItem
  }

  async removeItem(id) {
    const all = loadAll()
    saveAll(all.filter(item => item.id !== id))
  }

  async updateItem(id, changes) {
    const all = loadAll()
    const updated = all.map(item =>
      item.id === id ? { ...item, ...changes } : item
    )
    saveAll(updated)
    return updated.find(item => item.id === id)
  }
}