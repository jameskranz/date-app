import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalHistoryAdapter } from './LocalHistoryAdapter'

describe('LocalHistoryAdapter', () => {
  let adapter
  const STORAGE_KEY = 'date_history'

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalHistoryAdapter()
  })

  it('should initialize with an empty history', async () => {
    const history = await adapter.getHistory()
    expect(history).toEqual([])
  })

  it('should save a game history entry', async () => {
    const mockGameData = {
      winners: [{ category: 'Dinner', item: 'Pizza' }],
      timestamp: '2023-10-27T10:00:00Z',
    }

    const savedEntry = await adapter.saveHistory(mockGameData)

    expect(savedEntry).toHaveProperty('id')
    expect(savedEntry.winners).toEqual(mockGameData.winners)
    expect(savedEntry.timestamp).toBe(mockGameData.timestamp)

    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(storedData).toHaveLength(1)
    expect(storedData[0].id).toBe(savedEntry.id)
  })

  it('should retrieve multiple history entries', async () => {
    const entry1 = await adapter.saveHistory({ winners: [], timestamp: '1' })
    const entry2 = await adapter.saveHistory({ winners: [], timestamp: '2' })

    const history = await adapter.getHistory()
    expect(history).toHaveLength(2)
    // Should be ordered by most recent first? Or insertion order?
    // Let's assume insertion order for now, or simply existence.
    expect(history).toEqual(expect.arrayContaining([entry1, entry2]))
  })

  it('should clear history', async () => {
    await adapter.saveHistory({ winners: [], timestamp: '1' })
    await adapter.clearHistory()

    const history = await adapter.getHistory()
    expect(history).toEqual([])
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull() // or '[]' depending on impl
  })

  it('should save with default timestamp when gameData is empty', async () => {
    const entry = await adapter.saveHistory()
    expect(entry.timestamp).toBeDefined()
    expect(entry.winners).toEqual([])
  })

  it('should handle corrupted local storage gracefully', async () => {
    localStorage.setItem(STORAGE_KEY, '{invalid_json}')
    const history = await adapter.getHistory()
    expect(history).toEqual([])
  })
})