import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import HistoryPanel from './HistoryPanel'
import { Game, GameStatus } from '../types'
import { createGameStore } from '../stores/gameStore'

// Mock the default useGameStore export to avoid singleton issues in tests
vi.mock('../stores/gameStore', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    default: vi.fn(),
  }
})

import useGameStore from '../stores/gameStore'

describe('HistoryPanel', () => {
  let store: any

  beforeEach(() => {
    // Create a real store with a minimal mock adapter
    const adapterMock = {
      list: vi.fn().mockResolvedValue([]),
      save: vi.fn(),
      get: vi.fn(),
      subscribe: vi.fn(),
    }
    store = createGameStore(adapterMock as any)
    
    // Make our mocked useGameStore call the actual store's hooks
    ;(useGameStore as unknown as Mock).mockImplementation((selector) => selector(store.getState()))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render empty state', async () => {
    await act(async () => {
      render(<HistoryPanel />)
    })
    
    expect(screen.getByText(/No past games yet/i)).toBeInTheDocument()
  })

  it('should render list of completed games', async () => {
    const mockGames: Game[] = [
      {
        id: '1',
        status: 'completed' as GameStatus,
        createdAt: '2026-02-20T12:00:00Z',
        participants: [],
        categories: [],
        winners: [{ category: 'Dinner', item: 'Pizza' }]
      }
    ]
    
    // Set the store state directly for this test
    store.setState({ history: mockGames })

    await act(async () => {
      render(<HistoryPanel />)
    })

    expect(screen.getByText('Pizza')).toBeInTheDocument()
    expect(screen.getByText('Dinner')).toBeInTheDocument()
  })
})
