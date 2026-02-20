import { describe, it, expect, beforeEach } from 'vitest'
import { LocalGameAdapter } from './LocalGameAdapter'

describe('LocalGameAdapter', () => {
  let adapter
  const STORAGE_KEY = 'date_games'

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalGameAdapter()
  })

  it('should initialize with empty list', async () => {
    const games = await adapter.list()
    expect(games).toEqual([])
  })

  it('should save a new game', async () => {
    const mockGame = {
      id: 'game-1',
      status: 'setup',
      createdAt: new Date().toISOString(),
      participants: ['user-1'],
      categories: [],
      winners: []
    }

    const saved = await adapter.save(mockGame)
    expect(saved).toEqual(mockGame)

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0]).toEqual(mockGame)
  })

  it('should update an existing game', async () => {
    const mockGame = { id: 'game-1', status: 'setup' }
    await adapter.save(mockGame)

    const updatedGame = { ...mockGame, status: 'active' }
    await adapter.save(updatedGame)

    const games = await adapter.list()
    expect(games).toHaveLength(1)
    expect(games[0].status).toBe('active')
  })

  it('should get a game by id', async () => {
    const mockGame = { id: 'game-1', name: 'Game 1' }
    await adapter.save(mockGame)

    const game = await adapter.get('game-1')
    expect(game).toEqual(mockGame)
  })

  it('should return undefined if game not found', async () => {
    const game = await adapter.get('non-existent')
    expect(game).toBeUndefined()
  })

  it('should list games with status filter', async () => {
    await adapter.save({ id: '1', status: 'setup' })
    await adapter.save({ id: '2', status: 'completed' })
    await adapter.save({ id: '3', status: 'completed' })

    const completed = await adapter.list({ status: 'completed' })
    expect(completed).toHaveLength(2)
    expect(completed.every(g => g.status === 'completed')).toBe(true)
  })

  it('should handle corrupted local storage', async () => {
    localStorage.setItem(STORAGE_KEY, '{invalid')
    const games = await adapter.list()
    expect(games).toEqual([])
  })
})