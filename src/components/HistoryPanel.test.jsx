import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import HistoryPanel from './HistoryPanel'

describe('HistoryPanel', () => {
  let adapterMock

  beforeEach(() => {
    adapterMock = {
      list: vi.fn(),
    }
  })

  it('should render empty state', async () => {
    adapterMock.list.mockResolvedValue([])
    
    await act(async () => {
      render(<HistoryPanel adapter={adapterMock} />)
    })
    
    expect(screen.getByText(/No past games yet/i)).toBeInTheDocument()
  })

  it('should render list of completed games', async () => {
    const mockGames = [
      {
        id: '1',
        createdAt: '2026-02-20T12:00:00Z',
        winners: [{ category: 'Dinner', item: 'Pizza' }]
      }
    ]
    adapterMock.list.mockResolvedValue(mockGames)

    await act(async () => {
      render(<HistoryPanel adapter={adapterMock} />)
    })

    expect(screen.getByText('Pizza')).toBeInTheDocument()
    expect(screen.getByText('Dinner')).toBeInTheDocument()
  })

  it('should handle games with missing winners property gracefully', async () => {
    const mockGames = [{ id: '1', createdAt: '2026-02-20T12:00:00Z' }]
    adapterMock.list.mockResolvedValue(mockGames)

    await act(async () => {
      render(<HistoryPanel adapter={adapterMock} />)
    })

    expect(screen.getByText('History')).toBeInTheDocument()
  })
})