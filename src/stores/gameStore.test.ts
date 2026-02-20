import { describe, it, expect, beforeEach, vi, afterEach, Mock } from 'vitest'
import { createGameStore, flattenItems, computeEliminationSteps, DEFAULT_CATEGORIES, GameStore } from './gameStore'
import { GameRepository, Category } from '../types'
import { UseBoundStore, StoreApi } from 'zustand'

describe('gameStore logic', () => {
  it('flattenItems should correctly flatten categories', () => {
    const categories: Category[] = [
      { name: 'A', items: ['1', '2'] },
      { name: 'B', items: ['3', '4'] },
    ]
    const flat = flattenItems(categories)
    expect(flat).toHaveLength(4)
    expect(flat[0]).toEqual({ catIndex: 0, itemIndex: 0, text: '1' })
    expect(flat[3]).toEqual({ catIndex: 1, itemIndex: 1, text: '4' })
  })

  it('computeEliminationSteps should generate correct number of steps', () => {
    const steps = computeEliminationSteps(DEFAULT_CATEGORIES, 3)
    expect(steps).toHaveLength(12)
    expect(steps[0] instanceof Set).toBe(true)
    expect(steps[0].size).toBe(1)
    expect(steps[11].size).toBe(12)
  })
})

describe('gameStore actions', () => {
  let useGameStore: UseBoundStore<StoreApi<GameStore>>
  let adapterMock: Record<keyof GameRepository, Mock>

  beforeEach(() => {
    vi.useFakeTimers()
    adapterMock = {
      save: vi.fn().mockImplementation(g => Promise.resolve(g)),
      get: vi.fn(),
      list: vi.fn(),
    }
    useGameStore = createGameStore(adapterMock as unknown as GameRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should initialize with default state', () => {
    const state = useGameStore.getState()
    expect(state.currentGame.categories).toEqual(DEFAULT_CATEGORIES)
    expect(state.phase).toBe('setup')
    expect(state.done).toBe(false)
  })

  it('should update an item', () => {
    useGameStore.getState().updateItem(0, 0, 'New Value')
    expect(useGameStore.getState().currentGame.categories[0].items[0]).toBe('New Value')
  })

  it('should fill categories', () => {
    const newData: Category[] = [
      { name: 'C1', items: ['I1', 'I2', 'I3', 'I4'] },
      { name: 'C2', items: ['I5', 'I6', 'I7', 'I8'] },
      { name: 'C3', items: ['I9', 'I10', 'I11', 'I12'] },
      { name: 'C4', items: ['I13', 'I14', 'I15', 'I16'] },
    ]
    useGameStore.getState().fillCategories(newData)
    expect(useGameStore.getState().currentGame.categories[0].name).toBe('C1')
    expect(useGameStore.getState().currentGame.categories[0].items[0]).toBe('I1')
  })

  it('should start elimination and progress through steps', async () => {
    const filledData = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      items: cat.items.map((_, i) => `Item ${i}`)
    }))
    useGameStore.getState().fillCategories(filledData)
    
    useGameStore.getState().startElimination(3)
    
    expect(useGameStore.getState().phase).toBe('eliminating')
    expect(useGameStore.getState().magicNumber).toBe(3)
    
    vi.advanceTimersByTime(0)
    expect(useGameStore.getState().eliminated).toHaveLength(1)
    
    vi.advanceTimersByTime(400)
    expect(useGameStore.getState().eliminated).toHaveLength(2)
    
    vi.advanceTimersByTime(10 * 400)
    expect(useGameStore.getState().eliminated).toHaveLength(12)
    
    await act(async () => {
      vi.advanceTimersByTime(800)
    })
    
    expect(useGameStore.getState().done).toBe(true)
    expect(useGameStore.getState().currentGame.winners).toHaveLength(4)
  })

  it('should reset state and clear timers', async () => {
    useGameStore.getState().startElimination(3)
    
    await useGameStore.getState().reset()
    
    const state = useGameStore.getState()
    expect(state.phase).toBe('setup')
    expect(state.animationTimers).toHaveLength(0)
    expect(state.done).toBe(false)
  })
})

async function act(cb: () => void) {
  cb()
  await Promise.resolve()
}
