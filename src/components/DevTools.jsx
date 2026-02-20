import { useState } from 'react'

const TEST_DATA = [
  {
    name: 'Dinner',
    items: ['Sushi', 'Tacos', 'Pizza', 'Ramen']
  },
  {
    name: 'Activity',
    items: ['Mini Golf', 'Bowling', 'Arcade', 'Walk in the Park']
  },
  {
    name: 'Treat',
    items: ['Ice Cream', 'Boba', 'Churros', 'Cookies']
  },
  {
    name: 'Entertainment',
    items: ['Movie', 'Board Game', 'Karaoke', 'Comedy Show']
  },
]

export default function DevTools({ onFill, onClear }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="devtools">
      <button className="devtools-toggle" onClick={() => setOpen(o => !o)}>
        🛠 {open ? 'Hide' : 'Dev Tools'}
      </button>
      {open && (
        <div className="devtools-panel">
          <p className="devtools-title">Dev Tools</p>
          <div className="devtools-actions">
            <button onClick={() => onFill(TEST_DATA)}>
              Fill Test Data
            </button>
            <button onClick={onClear}>
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}