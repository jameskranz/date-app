import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createGameStore } from './gameStore'

describe('gameStore persistence', () => {
  let adapterMock
  let useGameStore

  beforeEach(() => {
    vi.useFakeTimers()
    adapterMock = {
      save: vi.fn().mockImplementation(g => Promise.resolve(g)),
      get: vi.fn(),
      list: vi.fn(),
    }
    useGameStore = createGameStore(adapterMock)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should create a new game', async () => {
    await useGameStore.getState().createGame()
    
    const game = useGameStore.getState().currentGame
    expect(game).toBeDefined()
    expect(game.status).toBe('setup')
    expect(game.participants).toContain('local-user')
    expect(adapterMock.save).toHaveBeenCalledWith(game)
  })

  it('should update and save game item', async () => {
    await useGameStore.getState().createGame()
    const gameId = useGameStore.getState().currentGame.id
    
    useGameStore.getState().updateItem(0, 0, 'Pizza')
    
    expect(useGameStore.getState().currentGame.categories[0].items[0]).toBe('Pizza')
    // Auto-save on change? PRD doesn't explicitly say but spec says "save significant changes"
    // For now, let's assume we want to save on update
    expect(adapterMock.save).toHaveBeenCalledTimes(2) // 1 for create, 1 for update
  })

  it('should finish game and mark as completed', async () => {
    await useGameStore.getState().createGame()
    
    // Fill items to allow finishing? Logic might check isReady.
    // For this test, let's just trigger finishGame.
    await useGameStore.getState().finishGame([{ category: 'Dinner', item: 'Pizza' }])
    
    const game = useGameStore.getState().currentGame
    expect(game.status).toBe('completed')
    expect(game.winners).toHaveLength(1)
    expect(adapterMock.save).toHaveBeenCalled()
  })

  it('should load an existing game', async () => {
    const mockGame = { id: 'old-game', status: 'setup', categories: [] }
    adapterMock.get.mockResolvedValue(mockGame)

    await useGameStore.getState().loadGame('old-game')

    expect(useGameStore.getState().currentGame).toEqual(mockGame)
  })
})