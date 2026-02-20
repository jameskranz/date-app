import { describe, it, expect, beforeEach, vi, afterEach, Mock } from 'vitest'
import { createGameStore, GameStore } from './gameStore'
import { GameRepository, GameStatus } from '../types'
import { UseBoundStore, StoreApi } from 'zustand'

describe('gameStore persistence', () => {
  let adapterMock: Record<keyof GameRepository, Mock>
  let useGameStore: UseBoundStore<StoreApi<GameStore>>

  beforeEach(() => {
    vi.useFakeTimers()
    adapterMock = {
      save: vi.fn().mockImplementation(g => Promise.resolve(g)),
      get: vi.fn(),
      list: vi.fn().mockResolvedValue([]),
      subscribe: vi.fn(),
    }
    useGameStore = createGameStore(adapterMock as unknown as GameRepository)
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
    
    useGameStore.getState().updateItem(0, 0, 'Pizza')
    
    expect(useGameStore.getState().currentGame.categories[0].items[0]).toBe('Pizza')
    expect(adapterMock.save).toHaveBeenCalledTimes(2) 
  })

  it('should finish game and mark as completed', async () => {
    await useGameStore.getState().createGame()
    
    await useGameStore.getState().finishGame([{ category: 'Dinner', item: 'Pizza' }])
    
    const game = useGameStore.getState().currentGame
    expect(game.status).toBe('completed' as GameStatus)
    expect(game.winners).toHaveLength(1)
    expect(adapterMock.save).toHaveBeenCalled()
  })

  it('should load an existing game', async () => {
    const mockGame = { id: 'old-game', status: 'setup' as GameStatus, categories: [], winners: [], participants: [], createdAt: '' }
    adapterMock.get.mockResolvedValue(mockGame)

    await useGameStore.getState().loadGame('old-game')

    expect(useGameStore.getState().currentGame).toEqual(mockGame)
  })

  it('should reload history when adapter notifies of changes', async () => {
    let capturedListener: () => Promise<void> = async () => {}
    adapterMock.subscribe.mockImplementation((l) => {
      capturedListener = l
      return vi.fn()
    })
    
    // Recreate store to capture the listener
    useGameStore = createGameStore(adapterMock as unknown as GameRepository)
    
    const mockGames: Game[] = [
      { id: '1', status: 'completed' as GameStatus, createdAt: '2026-02-20T12:00:00Z', winners: [], participants: [], categories: [] }
    ]
    adapterMock.list.mockResolvedValue(mockGames)
    
    await capturedListener()
    
    expect(useGameStore.getState().history).toHaveLength(1)
    expect(adapterMock.list).toHaveBeenCalledWith({ status: 'completed' })
  })
})
