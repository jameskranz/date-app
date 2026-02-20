import { create } from 'zustand'

export const DEFAULT_CATEGORIES = [
  { name: 'Dinner', items: ['', '', '', ''] },
  { name: 'Activity', items: ['', '', '', ''] },
  { name: 'Treat', items: ['', '', '', ''] },
  { name: 'Entertainment', items: ['', '', '', ''] },
]

export function flattenItems(categories) {
  return categories.flatMap((cat, ci) =>
    cat.items.map((item, ii) => ({ catIndex: ci, itemIndex: ii, text: item }))
  )
}

export function computeEliminationSteps(categories, magicNumber) {
  const allItems = flattenItems(categories)
  const totalItems = allItems.length
  const targetEliminations = categories.length * (categories[0].items.length - 1)
  const eliminatedSet = new Set()
  let pointer = 0
  const steps = []

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

const useGameStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────
  categories: DEFAULT_CATEGORIES,
  phase: 'setup',       // 'setup' | 'spiraling' | 'eliminating' | 'result'
  magicNumber: null,
  eliminated: [],
  winners: [],
  animationTimers: [],
  done: false,

  // ── Actions ────────────────────────────────────────────────────────────

  updateItem: (catIndex, itemIndex, value) => set(state => ({
    categories: state.categories.map((cat, ci) =>
      ci !== catIndex ? cat : {
        ...cat,
        items: cat.items.map((item, ii) => ii === itemIndex ? value : item)
      }
    )
  })),

  fillCategories: (data) => set({
    categories: data.map(cat => ({ ...cat, items: [...cat.items] }))
  }),

  setPhase: (phase) => set({ phase }),

  startSpiraling: () => set({ phase: 'spiraling' }),

  startElimination: (magicNumber) => {
    const { categories, animationTimers } = get()
    animationTimers.forEach(clearTimeout)

    const steps = computeEliminationSteps(categories, magicNumber)
    const timers = []

    set({ phase: 'eliminating', magicNumber, eliminated: [] })

    steps.forEach((snapshot, i) => {
        const t = setTimeout(() => {
        set({ eliminated: [...snapshot] })

        if (i === steps.length - 1) {
            const finalTimer = setTimeout(() => {
            const allItems = flattenItems(get().categories)
            const winners = get().categories.map((cat, ci) => {
                const survivorIndex = cat.items.findIndex((_, ii) => {
                const flatIdx = allItems.findIndex(
                    item => item.catIndex === ci && item.itemIndex === ii
                )
                return !snapshot.has(flatIdx)
                })
                return { category: cat.name, item: cat.items[survivorIndex] }
            })
            set({ winners, done: true })
            }, 800)
            timers.push(finalTimer)
        }
        }, i * 400)
        timers.push(t)
    })

    set({ animationTimers: timers })
    },

  reset: () => {
    const { animationTimers } = get()
    animationTimers.forEach(clearTimeout)
    set({
      categories: DEFAULT_CATEGORIES,
      phase: 'setup',
      magicNumber: null,
      eliminated: [],
      winners: [],
      animationTimers: [],
      done: false,
    })
  },
}))

export default useGameStore