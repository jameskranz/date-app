import { create } from 'zustand'
import { LocalLibraryAdapter } from '../storage/implementations/LocalLibraryAdapter'
import { LibraryItem, LibraryRepository } from '../types'

export interface LibraryState {
  items: LibraryItem[];
  initialized: boolean;
}

export interface LibraryActions {
  getCategory: (category: string) => LibraryItem[];
  initialize: () => Promise<void>;
  addItem: (category: string, text: string) => Promise<LibraryItem>;
  removeItem: (id: string) => Promise<void>;
  updateItem: (id: string, changes: Partial<LibraryItem>) => Promise<LibraryItem | undefined>;
}

export type LibraryStore = LibraryState & LibraryActions;

// Default adapter
const defaultAdapter = new LocalLibraryAdapter()

export const createLibraryStore = (adapter: LibraryRepository = defaultAdapter) => 
  create<LibraryStore>((set, get) => ({
    // ── State ──────────────────────────────────────────────────────────────
    items: [],
    initialized: false,

    // ── Derived ────────────────────────────────────────────────────────────
    getCategory: (category: string) => {
      return get().items.filter(item => item.category === category)
    },

    // ── Actions ────────────────────────────────────────────────────────────

    initialize: async () => {
      if (get().initialized) return
      const items = await adapter.getAllItems()
      set({ items, initialized: true })
    },

    addItem: async (category: string, text: string) => {
      const newItem = await adapter.addItem(category, text)
      set(state => ({ items: [...state.items, newItem] }))
      return newItem
    },

    removeItem: async (id: string) => {
      await adapter.removeItem(id)
      set(state => ({ items: state.items.filter(item => item.id !== id) }))
    },

    updateItem: async (id: string, changes: Partial<LibraryItem>) => {
      const updated = await adapter.updateItem(id, changes)
      if (updated) {
        set(state => ({
          items: state.items.map(item => item.id === id ? updated : item)
        }))
      }
      return updated
    },
  }))

// Export the default store instance
const useLibraryStore = createLibraryStore()
export default useLibraryStore
