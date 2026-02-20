import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import LibraryPanel from './LibraryPanel'
import { Category } from '../types'

// Mock the store
vi.mock('../stores/libraryStore', () => ({
  default: vi.fn(),
}))

import useLibraryStore from '../stores/libraryStore'

describe('LibraryPanel', () => {
  const categories: Category[] = [{ name: 'Dinner', items: [] }, { name: 'Activity', items: [] }]
  const onSelectItem = vi.fn()
  const mockInitialize = vi.fn()
  const mockAddItem = vi.fn()
  const mockRemoveItem = vi.fn()
  const mockGetCategory = vi.fn()

  beforeEach(() => {
    vi.mocked(useLibraryStore).mockImplementation((selector: any) => selector({
      items: [],
      initialized: true,
      initialize: mockInitialize,
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
      getCategory: mockGetCategory,
    }))
    mockGetCategory.mockReturnValue([])
  })

  it('should call initialize on mount', () => {
    render(<LibraryPanel categories={categories} onSelectItem={onSelectItem} />)
    expect(mockInitialize).toHaveBeenCalled()
  })

  it('should render categories and empty state', () => {
    render(<LibraryPanel categories={categories} onSelectItem={onSelectItem} />)
    expect(screen.getByText('Dinner')).toBeInTheDocument()
    expect(screen.getByText('Activity')).toBeInTheDocument()
    expect(screen.getAllByText('No items yet')).toHaveLength(2)
  })

  it('should add an item', async () => {
    render(<LibraryPanel categories={categories} onSelectItem={onSelectItem} />)
    
    const input = screen.getAllByPlaceholderText('Add item...')[0]
    fireEvent.change(input, { target: { value: 'Pizza' } })
    
    const addButton = screen.getAllByText('+')[0]
    await act(async () => {
      fireEvent.click(addButton)
    })
    
    expect(mockAddItem).toHaveBeenCalledWith('Dinner', 'Pizza')
  })

  it('should remove an item', async () => {
    mockGetCategory.mockImplementation((cat: string) => {
        if (cat === 'Dinner') return [{ id: '1', text: 'Pizza', category: 'Dinner', createdAt: '' }]
        return []
    })

    render(<LibraryPanel categories={categories} onSelectItem={onSelectItem} />)
    
    const removeButton = screen.getByTitle('Remove from library')
    fireEvent.click(removeButton)
    
    expect(mockRemoveItem).toHaveBeenCalledWith('1')
  })

  it('should select an item', () => {
    mockGetCategory.mockImplementation((cat: string) => {
        if (cat === 'Dinner') return [{ id: '1', text: 'Pizza', category: 'Dinner', createdAt: '' }]
        return []
    })

    render(<LibraryPanel categories={categories} onSelectItem={onSelectItem} />)
    
    const itemText = screen.getByText('Pizza')
    fireEvent.click(itemText)
    
    expect(onSelectItem).toHaveBeenCalledWith('Dinner', 'Pizza')
  })

  it('should handle missing items in store gracefully', () => {
    vi.mocked(useLibraryStore).mockImplementation((selector: any) => selector({
      items: undefined,
      initialized: true,
      initialize: mockInitialize,
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
      getCategory: mockGetCategory,
    }))
    
    expect(() => render(<LibraryPanel categories={[]} onSelectItem={onSelectItem} />)).not.toThrow()
  })
})
