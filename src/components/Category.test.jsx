import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Category from './Category'

// Mock the store
vi.mock('../stores/gameStore', () => ({
  default: vi.fn(),
}))

import useGameStore from '../stores/gameStore'

describe('Category', () => {
  const mockUpdateItem = vi.fn()
  const category = {
    name: 'Dinner',
    items: ['Pizza', 'Sushi', 'Burger', 'Tacos'],
  }
  const allItems = category.items.map((text, i) => ({ catIndex: 0, itemIndex: i, text }))

  beforeEach(() => {
    vi.mocked(useGameStore).mockImplementation((selector) => selector({
      updateItem: mockUpdateItem,
    }))
  })

  it('should render inputs in setup phase', () => {
    render(
      <Category
        category={category}
        catIndex={0}
        allItems={allItems}
        eliminated={[]}
        phase="setup"
      />
    )
    
    expect(screen.getByText('Dinner')).toBeInTheDocument()
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(4)
    expect(inputs[0].value).toBe('Pizza')
  })

  it('should call updateItem on input change', () => {
    render(
      <Category
        category={category}
        catIndex={0}
        allItems={allItems}
        eliminated={[]}
        phase="setup"
      />
    )
    
    const input = screen.getAllByRole('textbox')[0]
    fireEvent.change(input, { target: { value: 'Pasta' } })
    
    expect(mockUpdateItem).toHaveBeenCalledWith(0, 0, 'Pasta')
  })

  it('should render spans in eliminating phase', () => {
    render(
      <Category
        category={category}
        catIndex={0}
        allItems={allItems}
        eliminated={[]}
        phase="eliminating"
      />
    )
    
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()
  })

  it('should show eliminated items with MarkerStrike', () => {
    render(
      <Category
        category={category}
        catIndex={0}
        allItems={allItems}
        eliminated={[0]} // Pizza is eliminated
        phase="eliminating"
      />
    )
    
    // Check for eliminated class
    const pizzaWrapper = screen.getByText('Pizza').parentElement
    expect(pizzaWrapper).toHaveClass('eliminated')
  })

  it('should show winner with HandCircle', () => {
    // Only Sushi (index 1) remains
    const eliminated = [0, 2, 3] 
    render(
      <Category
        category={category}
        catIndex={0}
        allItems={allItems}
        eliminated={eliminated}
        phase="eliminating"
      />
    )
    
    const sushiWrapper = screen.getByText('Sushi').parentElement
    expect(sushiWrapper).toHaveClass('winner-glow')
  })
})