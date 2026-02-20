import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Board from './Board'

// Mock the store
vi.mock('../stores/gameStore', () => ({
  default: vi.fn(),
}))

import useGameStore from '../stores/gameStore'

describe('Board', () => {
  const categories = [
    { name: 'Dinner', items: ['', '', '', ''] },
    { name: 'Activity', items: ['', '', '', ''] },
    { name: 'Treat', items: ['', '', '', ''] },
    { name: 'Entertainment', items: ['', '', '', ''] },
  ]

  beforeEach(() => {
    vi.mocked(useGameStore).mockImplementation((selector) => selector({
      currentGame: { categories },
      eliminated: [],
      phase: 'setup',
      magicNumber: null,
      startElimination: vi.fn(),
      done: false,
      reset: vi.fn(),
    }))
  })

  it('should render hint when not ready', () => {
    render(<Board />)
    expect(screen.getByText(/Fill in all 16 options/i)).toBeInTheDocument()
  })

  it('should render SpiralButton when ready', () => {
    const readyCategories = categories.map(cat => ({
      ...cat,
      items: ['A', 'B', 'C', 'D']
    }))
    
    vi.mocked(useGameStore).mockImplementation((selector) => selector({
      currentGame: { categories: readyCategories },
      eliminated: [],
      phase: 'setup',
      magicNumber: null,
      startElimination: vi.fn(),
      done: false,
      reset: vi.fn(),
    }))

    render(<Board />)
    // SpiralButton shows 'Press and hold' in idle state
    expect(screen.getByText(/Press and hold/i)).toBeInTheDocument()
  })

  it('should show magic number during elimination', () => {
    vi.mocked(useGameStore).mockImplementation((selector) => selector({
      currentGame: { categories },
      eliminated: [1],
      phase: 'eliminating',
      magicNumber: 7,
      startElimination: vi.fn(),
      done: false,
      reset: vi.fn(),
    }))

    render(<Board />)
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('Magic Number')).toBeInTheDocument()
  })

  it('should show reset button when done', () => {
    vi.mocked(useGameStore).mockImplementation((selector) => selector({
      currentGame: { categories },
      eliminated: [],
      phase: 'result',
      magicNumber: 7,
      startElimination: vi.fn(),
      done: true,
      reset: vi.fn(),
    }))

    render(<Board />)
    expect(screen.getByText('Play Again')).toBeInTheDocument()
  })
})