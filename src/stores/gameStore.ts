import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { LocalGameAdapter } from '../storage/implementations/LocalGameAdapter'
import { Category, Game, Winner, GameRepository, GameStatus } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Dinner', items: ['', '', '', ''] },
  { name: 'Activity', items: ['', '', '', ''] },
  { name: 'Treat', items: ['', '', '', ''] },
  { name: 'Entertainment', items: ['', '', '', ''] },
]

const createDefaultGame = (): Game => ({
  id: uuidv4(),
  status: 'setup',
  createdAt: new Date().toISOString(),
  participants: ['local-user'],
  categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
  winners: [],
})

export interface FlattenedItem {
  catIndex: number;
  itemIndex: number;
  text: string;
}

export function flattenItems(categories: Category[]): FlattenedItem[] {
  return categories.flatMap((cat, ci) =>
    cat.items.map((item, ii) => ({ catIndex: ci, itemIndex: ii, text: item }))
  )
}

export function computeEliminationSteps(categories: Category[], magicNumber: number): Set<number>[] {
  const allItems = flattenItems(categories)
  const totalItems = allItems.length
  const targetEliminations = categories.length * (categories[0].items.length - 1)
  const eliminatedSet = new Set<number>()
  let pointer = 0
  const steps: Set<number>[] = []

  while (eliminatedSet.size < targetEliminations) {
    let stepped = 0
    while (stepped < magicNumber) {
      if (!eliminatedSet.has(pointer % totalItems)) {
        stepped++
        if (stepped === magicNumber) break
      }
      pointer = (pointer + 1) % totalItems
    }

    const flat = pointer % totalItems
    const catIndex = allItems[flat].catIndex
    const survivorsInCat = allItems.filter(
      (item, idx) => item.catIndex === catIndex && !eliminatedSet.has(idx)
    ).length

    if (survivorsInCat > 1) {
      eliminatedSet.add(flat)
      steps.push(new Set([...eliminatedSet]))
    }

    pointer = (pointer + 1) % totalItems
  }

  return steps
}

export interface GameState {
  currentGame: Game;
  phase: string;
  magicNumber: number | null;
  eliminated: number[];
  animationTimers: ReturnType<typeof setTimeout>[];
  done: boolean;
}

export interface GameActions {
  createGame: () => Promise<void>;
  loadGame: (id: string) => Promise<void>;
  saveGame: () => Promise<void>;
  updateItem: (catIndex: number, itemIndex: number, value: string) => void;
  fillCategories: (data: Category[]) => void;
  setPhase: (phase: string) => void;
  startSpiraling: () => void;
  startElimination: (magicNumber: number) => void;
  finishGame: (winners: Winner[]) => Promise<void>;
  reset: () => Promise<void>;
}

export type GameStore = GameState & GameActions;

const defaultAdapter = new LocalGameAdapter()

export const createGameStore = (adapter: GameRepository = defaultAdapter) => 
  create<GameStore>((set, get) => ({
    // ── State ──────────────────────────────────────────────────────────────
    currentGame: createDefaultGame(),
    phase: 'setup',
    magicNumber: null,
    eliminated: [],
    animationTimers: [],
    done: false,

    // ── Actions ────────────────────────────────────────────────────────────

    createGame: async () => {
      const newGame = createDefaultGame()
      set({
        currentGame: newGame,
        phase: 'setup',
        magicNumber: null,
        eliminated: [],
        done: false,
      })
      await adapter.save(newGame)
    },

    loadGame: async (id: string) => {
      const game = await adapter.get(id)
      if (game) {
        set({
          currentGame: game,
          phase: game.status === 'completed' ? 'result' : 'setup',
          done: game.status === 'completed',
        })
      }
    },

    saveGame: async () => {
      const { currentGame } = get()
      await adapter.save(currentGame)
    },

    updateItem: (catIndex: number, itemIndex: number, value: string) => {
      set(state => {
        const newCategories = state.currentGame.categories.map((cat, ci) =>
          ci !== catIndex ? cat : {
            ...cat,
            items: cat.items.map((item, ii) => ii === itemIndex ? value : item)
          }
        )
        return {
          currentGame: {
            ...state.currentGame,
            categories: newCategories
          }
        }
      })
      get().saveGame()
    },

    fillCategories: (data: Category[]) => {
      set(state => ({
        currentGame: {
          ...state.currentGame,
          categories: data.map(cat => ({ ...cat, items: [...cat.items] }))
        }
      }))
      get().saveGame()
    },

    setPhase: (phase: string) => set({ phase }),

    startSpiraling: () => set({ phase: 'spiraling' }),

    startElimination: (magicNumber: number) => {
      const { currentGame, animationTimers } = get()
      const { categories } = currentGame
      animationTimers.forEach(clearTimeout)

      const steps = computeEliminationSteps(categories, magicNumber)
      const timers: ReturnType<typeof setTimeout>[] = []

      set({ phase: 'eliminating', magicNumber, eliminated: [] })

      steps.forEach((snapshot, i) => {
          const t = setTimeout(() => {
          set({ eliminated: [...snapshot] })

          if (i === steps.length - 1) {
              const finalTimer = setTimeout(() => {
              const allItems = flattenItems(get().currentGame.categories)
              const winners = get().currentGame.categories.map((cat, ci) => {
                  const survivorIndex = cat.items.findIndex((_, ii) => {
                  const flatIdx = allItems.findIndex(
                      item => item.catIndex === ci && item.itemIndex === ii
                  )
                  return !snapshot.has(flatIdx)
                  })
                  return { category: cat.name, item: cat.items[survivorIndex] }
              })
              get().finishGame(winners)
              }, 800)
              timers.push(finalTimer)
          }
          }, i * 400)
          timers.push(t)
      })

      set({ animationTimers: timers })
    },

    finishGame: async (winners: Winner[]) => {
      set(state => ({
        currentGame: {
          ...state.currentGame,
          status: 'completed' as GameStatus,
          winners,
        },
        done: true,
      }))
      await get().saveGame()
    },

    reset: async () => {
      const { animationTimers } = get()
      animationTimers.forEach(clearTimeout)
      set({ animationTimers: [] })
      await get().createGame()
    },
  }))

const useGameStore = createGameStore()
export default useGameStore
