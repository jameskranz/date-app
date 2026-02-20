import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createLibraryStore } from './libraryStore'

describe('libraryStore', () => {
  let adapterMock
  let useLibraryStore

  beforeEach(() => {
    // Create a mock adapter
    adapterMock = {
      getAllItems: vi.fn(),
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateItem: vi.fn(),
    }
    
    // Create a new store instance with the mock adapter
    useLibraryStore = createLibraryStore(adapterMock)
  })

  it('should initialize with items from adapter', async () => {
    const mockItems = [{ id: '1', text: 'Test' }]
    adapterMock.getAllItems.mockResolvedValue(mockItems)

    await useLibraryStore.getState().initialize()

    expect(useLibraryStore.getState().items).toEqual(mockItems)
    expect(useLibraryStore.getState().initialized).toBe(true)
  })

  it('should not re-initialize if already initialized', async () => {
    useLibraryStore.setState({ initialized: true })
    
    await useLibraryStore.getState().initialize()
    
    expect(adapterMock.getAllItems).not.toHaveBeenCalled()
  })

  it('should add an item', async () => {
    const newItem = { id: '2', text: 'New' }
    adapterMock.addItem.mockResolvedValue(newItem)

    await useLibraryStore.getState().addItem('Dinner', 'New')

    expect(useLibraryStore.getState().items).toContainEqual(newItem)
    expect(adapterMock.addItem).toHaveBeenCalledWith('Dinner', 'New')
  })

  it('should remove an item', async () => {
    const item = { id: '3', text: 'To Remove' }
    useLibraryStore.setState({ items: [item] })
    adapterMock.removeItem.mockResolvedValue()

    await useLibraryStore.getState().removeItem('3')

    expect(useLibraryStore.getState().items).toHaveLength(0)
    expect(adapterMock.removeItem).toHaveBeenCalledWith('3')
  })

  it('should update an item', async () => {
    const item = { id: '4', text: 'Old' }
    const updated = { id: '4', text: 'Updated' }
    useLibraryStore.setState({ items: [item] })
    adapterMock.updateItem.mockResolvedValue(updated)

    await useLibraryStore.getState().updateItem('4', { text: 'Updated' })

    expect(useLibraryStore.getState().items[0].text).toBe('Updated')
    expect(adapterMock.updateItem).toHaveBeenCalledWith('4', { text: 'Updated' })
  })

  it('should filter items by category', () => {
    const items = [
      { id: '1', category: 'Dinner', text: 'A' },
      { id: '2', category: 'Activity', text: 'B' },
    ]
    useLibraryStore.setState({ items })

    const dinnerItems = useLibraryStore.getState().getCategory('Dinner')
    expect(dinnerItems).toHaveLength(1)
    expect(dinnerItems[0].text).toBe('A')
  })
})