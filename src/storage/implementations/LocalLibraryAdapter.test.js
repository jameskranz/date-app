import { describe, it, expect, beforeEach } from 'vitest'
import { LocalLibraryAdapter } from './LocalLibraryAdapter'

describe('LocalLibraryAdapter', () => {
  let adapter
  const STORAGE_KEY = 'date_library'

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalLibraryAdapter()
  })

  it('should initialize with empty library', async () => {
    const items = await adapter.getAllItems()
    expect(items).toEqual([])
  })

  it('should add an item to the library', async () => {
    const newItem = await adapter.addItem('Dinner', 'Pizza')
    expect(newItem).toHaveProperty('id')
    expect(newItem.category).toBe('Dinner')
    expect(newItem.text).toBe('Pizza')

    const items = await adapter.getAllItems()
    expect(items).toHaveLength(1)
    expect(items[0]).toEqual(newItem)
  })

  it('should remove an item from the library', async () => {
    const item1 = await adapter.addItem('Dinner', 'Pizza')
    const item2 = await adapter.addItem('Activity', 'Movies')
    
    await adapter.removeItem(item1.id)
    
    const items = await adapter.getAllItems()
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe(item2.id)
  })

  it('should update an item in the library', async () => {
    const item = await adapter.addItem('Dinner', 'Pizza')
    const updated = await adapter.updateItem(item.id, { text: 'Sushi' })
    
    expect(updated.text).toBe('Sushi')
    
    const items = await adapter.getAllItems()
    expect(items[0].text).toBe('Sushi')
  })

  it('should get library by category', async () => {
    await adapter.addItem('Dinner', 'Pizza')
    await adapter.addItem('Activity', 'Movies')
    
    const dinnerItems = await adapter.getLibrary('Dinner')
    expect(dinnerItems).toHaveLength(1)
    expect(dinnerItems[0].text).toBe('Pizza')
  })

  it('should handle corrupted local storage gracefully', async () => {
    localStorage.setItem(STORAGE_KEY, '{invalid_json}')
    const items = await adapter.getAllItems()
    expect(items).toEqual([])
  })
})