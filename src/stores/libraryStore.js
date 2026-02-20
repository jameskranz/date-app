import { create } from 'zustand'
import { LocalLibraryAdapter } from '../storage/implementations/LocalLibraryAdapter'

// Swap this import to switch adapter implementations:
// import { RemoteStorageAdapter } from '../storage/implementations/RemoteStorageAdapter'
// import { CachedStorageAdapter } from '../storage/implementations/CachedStorageAdapter'
const adapter = new LocalLibraryAdapter()

const useLibraryStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────
  items: [],          // all library items across all categories
  initialized: false,

  // ── Derived ────────────────────────────────────────────────────────────
  getCategory: (category) => {
    return get().items.filter(item => item.category === category)
  },

  // ── Actions ────────────────────────────────────────────────────────────

  // Load all items from the adapter into the store
  initialize: async () => {
    if (get().initialized) return
    const items = await adapter.getAllItems()
    set({ items, initialized: true })
  },

  addItem: async (category, text) => {
    const newItem = await adapter.addItem(category, text)
    set(state => ({ items: [...state.items, newItem] }))
    return newItem
  },

  removeItem: async (id) => {
    await adapter.removeItem(id)
    set(state => ({ items: state.items.filter(item => item.id !== id) }))
  },

  updateItem: async (id, changes) => {
    const updated = await adapter.updateItem(id, changes)
    set(state => ({
      items: state.items.map(item => item.id === id ? updated : item)
    }))
    return updated
  },
}))

export default useLibraryStore