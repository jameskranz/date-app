import { Game } from '../../types'

const STORAGE_KEY = 'date_games'

function loadAll(): Game[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(games: Game[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}

export class LocalGameAdapter {
  async save(game: Game): Promise<Game> {
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

  async get(id: string): Promise<Game | undefined> {
    const all = loadAll()
    return all.find(g => g.id === id)
  }

  async list(filter: { status?: string } = {}): Promise<Game[]> {
    let all = loadAll()
    if (filter.status) {
      all = all.filter(g => g.status === filter.status)
    }
    return all
  }
}
