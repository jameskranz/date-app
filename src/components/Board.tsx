import useGameStore, { flattenItems, FlattenedItem } from '../stores/gameStore'
import Category from './Category'
import SpiralButton from './SpiralButton'

export default function Board() {
  const categories = useGameStore(s => s.currentGame?.categories || [])
  const eliminated = useGameStore(s => s.eliminated || [])
  const phase = useGameStore(s => s.phase)
  const magicNumber = useGameStore(s => s.magicNumber)
  const startElimination = useGameStore(s => s.startElimination)
  const done = useGameStore(s => s.done)
  const reset = useGameStore(s => s.reset)

  // Compute these locally from categories instead of calling store functions
  const allItems: FlattenedItem[] = flattenItems(categories)
  const isReady = categories.every(cat => cat.items?.every(item => item?.trim() !== ''))

  return (
    <div className="board-wrapper">
      <div className="board">
        {categories.map((cat, ci) => (
          <Category
            key={cat.name}
            category={cat}
            catIndex={ci}
            allItems={allItems}
            eliminated={eliminated}
            phase={phase}
          />
        ))}
      </div>

      <div className="controls">
        {phase === 'setup' && (
          <>
            {!isReady && <p className="hint">Fill in all 16 options to begin</p>}
            {isReady && <SpiralButton onMagicNumber={startElimination} />}
          </>
        )}
        {phase === 'eliminating' && !done && magicNumber && (
          <div className="magic-display">
            <span className="magic-label">Magic Number</span>
            <span className="magic-number">{magicNumber}</span>
          </div>
        )}
        {done && (
          <button className="reset-button" onClick={reset}>
            Play Again
          </button>
        )}
      </div>
    </div>
  )
}
