import useGameStore from '../stores/gameStore'

export default function HistoryPanel() {
  const games = useGameStore(s => s.history)

  return (
    <div className="history-panel">
      <h2 className="history-title">History</h2>
      {!games || games.length === 0 ? (
        <p className="history-empty">No past games yet</p>
      ) : (
        <div className="history-list">
          {games.map(game => {
            const date = new Date(game.createdAt)
            const isValidDate = !isNaN(date.getTime())
            const dateString = isValidDate ? date.toLocaleDateString() : 'Unknown Date'

            return (
              <div key={game.id} className="history-card">
                <div className="history-card-header">
                  <span className="history-date">{dateString}</span>
                </div>
                <div className="history-winners">
                  {game.winners?.map(winner => (
                    <div key={winner.category} className="history-winner">
                      <span className="history-cat">{winner.category}</span>
                      <span className="history-item">{winner.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
