// LocalHistoryAdapter.js
// Implements the storage interface for game history using localStorage.

import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'date_history'

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

export class LocalHistoryAdapter {
  constructor() {
    this.storageKey = STORAGE_KEY
  }

  async getHistory() {
    return loadAll()
  }

  async saveHistory(gameData = {}) {
    const all = loadAll()
    const newEntry = {
      id: uuidv4(),
      timestamp: gameData.timestamp || new Date().toISOString(),
      winners: gameData.winners || [],
    }
    saveAll([...all, newEntry]) 
    return newEntry
  }

  async clearHistory() {
    localStorage.removeItem(this.storageKey)
  }
}