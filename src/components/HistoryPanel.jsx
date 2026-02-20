import { useState, useEffect } from 'react'

export default function HistoryPanel({ adapter }) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await adapter.list({ status: 'completed' })
        // Newest first
        setGames(history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [adapter])

  if (loading) return null

  return (
    <div className="history-panel">
      <h2 className="history-title">History</h2>
      {games?.length === 0 ? (
        <p className="history-empty">No past games yet</p>
      ) : (
        <div className="history-list">
          {games?.map(game => (
            <div key={game.id} className="history-card">
              <div className="history-card-header">
                <span className="history-date">
                  {new Date(game.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="history-winners">
                {game.winners?.map(winner => (
                  <div key={winner.category} className="history-winner">
                    <span className="history-cat">{winner.category}:</span>
                    <span className="history-item">{winner.item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}