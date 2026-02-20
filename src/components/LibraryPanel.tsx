import React, { useEffect, useState } from 'react'
import useLibraryStore from '../stores/libraryStore'
import { Category } from '../types'

interface LibraryPanelProps {
  categories: Category[];
  onSelectItem: (categoryName: string, text: string) => void;
}

export default function LibraryPanel({ categories, onSelectItem }: LibraryPanelProps) {
  const initialized = useLibraryStore(s => s.initialized)
  const initialize = useLibraryStore(s => s.initialize)
  const addItem = useLibraryStore(s => s.addItem)
  const removeItem = useLibraryStore(s => s.removeItem)
  const getCategory = useLibraryStore(s => s.getCategory)
  const [newItemText, setNewItemText] = useState<Record<string, string>>({})

  useEffect(() => {
    initialize()
  }, [initialize])

  async function handleAdd(category: string) {
    const text = (newItemText[category] || '').trim()
    if (!text) return
    await addItem(category, text)
    setNewItemText(prev => ({ ...prev, [category]: '' }))
  }

  function handleKeyDown(e: React.KeyboardEvent, category: string) {
    if (e.key === 'Enter') handleAdd(category)
  }

  if (!initialized) return null

  return (
    <div className="library-panel">
      <h2 className="library-title">Library</h2>
      <p className="library-subtitle">Tap an item to add it to the board</p>
      <div className="library-columns">
        {categories?.map(cat => (
          <div key={cat.name} className="library-column">
            <h3 className="library-category-name">{cat.name}</h3>
            <div className="library-items">
              {getCategory(cat.name)?.length === 0 && (
                <p className="library-empty">No items yet</p>
              )}
              {getCategory(cat.name)?.map(item => (
                <div key={item.id} className="library-item">
                  <button
                    className="library-item-text"
                    onClick={() => onSelectItem(cat.name, item.text)}
                    title="Add to board"
                  >
                    {item.text}
                  </button>
                  <button
                    className="library-item-remove"
                    onClick={() => removeItem(item.id)}
                    title="Remove from library"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="library-add">
              <input
                type="text"
                className="library-add-input"
                placeholder="Add item..."
                value={newItemText[cat.name] || ''}
                onChange={e => setNewItemText(prev => ({ ...prev, [cat.name]: e.target.value }))}
                onKeyDown={e => handleKeyDown(e, cat.name)}
                maxLength={30}
              />
              <button
                className="library-add-button"
                onClick={() => handleAdd(cat.name)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
