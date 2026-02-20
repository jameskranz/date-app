import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import useGameStore, { flattenItems, computeEliminationSteps, DEFAULT_CATEGORIES } from './gameStore'

describe('gameStore logic', () => {
  it('flattenItems should correctly flatten categories', () => {
    const categories = [
      { name: 'A', items: ['1', '2'] },
      { name: 'B', items: ['3', '4'] },
    ]
    const flat = flattenItems(categories)
    expect(flat).toHaveLength(4)
    expect(flat[0]).toEqual({ catIndex: 0, itemIndex: 0, text: '1' })
    expect(flat[3]).toEqual({ catIndex: 1, itemIndex: 1, text: '4' })
  })

  it('computeEliminationSteps should generate correct number of steps', () => {
    // 4 categories, 4 items each = 16 items. 1 winner per cat = 4 winners.
    // Total eliminations = 16 - 4 = 12.
    const steps = computeEliminationSteps(DEFAULT_CATEGORIES, 3)
    expect(steps).toHaveLength(12)
    expect(steps[0] instanceof Set).toBe(true)
    expect(steps[0].size).toBe(1)
    expect(steps[11].size).toBe(12)
  })
})

describe('gameStore actions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useGameStore.getState().reset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default state', () => {
    const state = useGameStore.getState()
    expect(state.categories).toEqual(DEFAULT_CATEGORIES)
    expect(state.phase).toBe('setup')
    expect(state.done).toBe(false)
  })

  it('should update an item', () => {
    useGameStore.getState().updateItem(0, 0, 'New Value')
    expect(useGameStore.getState().categories[0].items[0]).toBe('New Value')
  })

  it('should fill categories', () => {
    const newData = [
      { name: 'C1', items: ['I1', 'I2', 'I3', 'I4'] },
      { name: 'C2', items: ['I5', 'I6', 'I7', 'I8'] },
      { name: 'C3', items: ['I9', 'I10', 'I11', 'I12'] },
      { name: 'C4', items: ['I13', 'I14', 'I15', 'I16'] },
    ]
    useGameStore.getState().fillCategories(newData)
    expect(useGameStore.getState().categories[0].name).toBe('C1')
    expect(useGameStore.getState().categories[0].items[0]).toBe('I1')
  })

  it('should start elimination and progress through steps', () => {
    const filledData = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      items: cat.items.map((_, i) => `Item ${i}`)
    }))
    useGameStore.getState().fillCategories(filledData)
    
    useGameStore.getState().startElimination(3)
    
    expect(useGameStore.getState().phase).toBe('eliminating')
    expect(useGameStore.getState().magicNumber).toBe(3)
    
    // Each step is 400ms. The first step executes after 0ms, the next at 400ms, etc.
    // Wait, let's look at startElimination implementation:
    // steps.forEach((snapshot, i) => { const t = setTimeout(() => { ... }, i * 400); timers.push(t); })
    // So i=0 is 0ms, i=1 is 400ms...
    
    // At 0ms (after first tick), eliminated.length should be 1
    vi.advanceTimersByTime(0)
    expect(useGameStore.getState().eliminated).toHaveLength(1)
    
    // At 400ms, eliminated.length should be 2
    vi.advanceTimersByTime(400)
    expect(useGameStore.getState().eliminated).toHaveLength(2)
    
    // To reach the end (12 steps): 11 * 400ms more
    vi.advanceTimersByTime(10 * 400)
    expect(useGameStore.getState().eliminated).toHaveLength(12)
    
    // Final result after 800ms more from the last step
    vi.advanceTimersByTime(800)
    expect(useGameStore.getState().done).toBe(true)
    expect(useGameStore.getState().winners).toHaveLength(4)
  })

  it('should reset state and clear timers', () => {
    useGameStore.getState().startElimination(3)
    useGameStore.getState().reset()
    
    const state = useGameStore.getState()
    expect(state.phase).toBe('setup')
    expect(state.animationTimers).toHaveLength(0)
    expect(state.done).toBe(false)
  })
})