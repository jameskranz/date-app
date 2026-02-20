import useGameStore from './stores/gameStore'
import Board from './components/Board'
import LibraryPanel from './components/LibraryPanel'
import DevTools from './components/DevTools'
import './App.css'

export default function App() {
  const phase = useGameStore(s => s.phase)
  const categories = useGameStore(s => s.categories)
  const reset = useGameStore(s => s.reset)
  const fillCategories = useGameStore(s => s.fillCategories)
  const updateItem = useGameStore(s => s.updateItem)

  function handleSelectLibraryItem(categoryName, text) {
    const catIndex = categories.findIndex(c => c.name === categoryName)
    if (catIndex === -1) return
    const emptyIndex = categories[catIndex].items.findIndex(item => item.trim() === '')
    if (emptyIndex === -1) return
    updateItem(catIndex, emptyIndex, text)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">DATE</h1>
        <p className="app-subtitle">Dinner · Activity · Treat · Entertainment</p>
      </header>

      <Board />

      {phase === 'setup' && (
        <LibraryPanel
          categories={categories}
          onSelectItem={handleSelectLibraryItem}
        />
      )}

      <DevTools onFill={fillCategories} onClear={reset} />
    </div>
  )
}