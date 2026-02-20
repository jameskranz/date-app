// LocalGameAdapter.js
// Implements the GameRepository interface using localStorage.

/**
 * @typedef {Object} Game
 * @property {string} id - Unique UUID.
 * @property {'setup' | 'active' | 'completed'} status - Current status of the game.
 * @property {string} createdAt - ISO Timestamp.
 * @property {string[]} participants - Array of user IDs.
 * @property {Array<{name: string, items: string[]}>} categories - The board state.
 * @property {Array<{category: string, item: string}>} winners - Array of winning items.
 */

const STORAGE_KEY = 'date_games'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(games) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}

export class LocalGameAdapter {
  /**
   * @param {Game} game
   * @returns {Promise<Game>}
   */
  async save(game) {
    const all = loadAll()
    const index = all.findIndex(g => g.id === game.id)
    if (index !== -1) {
      all[index] = game
    } else {
      all.push(game)
    }
    saveAll(all)
    return game
  }

  /**
   * @param {string} id
   * @returns {Promise<Game | undefined>}
   */
  async get(id) {
    const all = loadAll()
    return all.find(g => g.id === id)
  }

  /**
   * @param {{status?: string}} filter
   * @returns {Promise<Game[]>}
   */
  async list(filter = {}) {
    let all = loadAll()
    if (filter.status) {
      all = all.filter(g => g.status === filter.status)
    }
    return all
  }
}