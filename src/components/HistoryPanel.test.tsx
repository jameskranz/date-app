import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import HistoryPanel from './HistoryPanel'
import { GameRepository, Game, GameStatus } from '../types'

describe('HistoryPanel', () => {
  let adapterMock: Record<keyof GameRepository, Mock>

  beforeEach(() => {
    adapterMock = {
      list: vi.fn(),
      save: vi.fn(),
      get: vi.fn(),
    }
  })

  it('should render empty state', async () => {
    adapterMock.list.mockResolvedValue([])
    
    await act(async () => {
      render(<HistoryPanel adapter={adapterMock as unknown as GameRepository} />)
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
    adapterMock.list.mockResolvedValue(mockGames)

    await act(async () => {
      render(<HistoryPanel adapter={adapterMock as unknown as GameRepository} />)
    })

    expect(screen.getByText('Pizza')).toBeInTheDocument()
    expect(screen.getByText('Dinner')).toBeInTheDocument()
  })

  it('should handle games with missing winners property gracefully', async () => {
    const mockGames: Partial<Game>[] = [{ id: '1', createdAt: '2026-02-20T12:00:00Z' }]
    adapterMock.list.mockResolvedValue(mockGames)

    await act(async () => {
      render(<HistoryPanel adapter={adapterMock as unknown as GameRepository} />)
    })

    expect(screen.getByText('History')).toBeInTheDocument()
  })
})
