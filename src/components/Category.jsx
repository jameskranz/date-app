import useGameStore from '../stores/gameStore'

// Generates a consistent but unique wobbly circle based on the item text
function seedRand(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return () => {
    h = (Math.imul(1664525, h) + 1013904223) | 0
    return ((h >>> 0) / 0xFFFFFFFF)
  }
}

function HandCircle({ text }) {
  const rand = seedRand(text)
  const r = () => (rand() - 0.5)

  // Center and radii with slight variance
  const cx = 100 + r() * 4
  const cy = 22 + r() * 3
  const rx = 92 + r() * 6
  const ry = 17 + r() * 4

  // Build a wobbly ellipse using 4 cubic bezier segments
  // Each control point is nudged slightly off a perfect ellipse
  const wobble = 6
  const w = () => r() * wobble

  const path1 = `
    M ${cx - rx + w()},${cy + w()}
    C ${cx - rx + w()},${cy - ry + w()} ${cx + w()},${cy - ry + w()} ${cx + rx + w()},${cy + w()}
    C ${cx + rx + w()},${cy + ry + w()} ${cx + w()},${cy + ry + w()} ${cx - rx + w()},${cy + w()}
  `

  // Second stroke — slightly different wobble, offset, thinner
  const rand2 = seedRand(text + '2')
  const r2 = () => (rand2() - 0.5)
  const w2 = () => r2() * (wobble * 0.8)
  const cx2 = cx + r2() * 3
  const cy2 = cy + r2() * 2

  const path2 = `
    M ${cx2 - rx + w2()},${cy2 + w2()}
    C ${cx2 - rx + w2()},${cy2 - ry + w2()} ${cx2 + w2()},${cy2 - ry + w2()} ${cx2 + rx + w2()},${cy2 + w2()}
    C ${cx2 + rx + w2()},${cy2 + ry + w2()} ${cx2 + w2()},${cy2 + ry + w2()} ${cx2 - rx + w2()},${cy2 + w2()}
  `

  return (
    <svg className="winner-circle" viewBox="0 0 200 44" preserveAspectRatio="none">
      <path
        d={path1}
        fill="none"
        stroke="#c17f5a"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
        className="winner-circle-path"
      />
      <path
        d={path2}
        fill="none"
        stroke="#c17f5a"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
        className="winner-circle-path winner-circle-path-2"
      />
    </svg>
  )
}

// Generates a slightly wobbly path across the item to mimic a marker stroke
function MarkerStrike() {
  // Two slightly offset paths layered for a soft tip feel
  return (
    <svg className="marker-strike" viewBox="0 0 200 44" preserveAspectRatio="none">
      {/* Main stroke */}
      <path
        d="M 4,24 C 40,21 80,26 120,22 C 155,19 175,24 196,22"
        fill="none"
        stroke="#c0392b"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
        className="marker-strike-path"
      />
      {/* Slightly offset secondary stroke for soft tip texture */}
      <path
        d="M 4,27 C 35,25 85,29 125,26 C 158,23 178,27 196,25"
        fill="none"
        stroke="#c0392b"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        className="marker-strike-path"
      />
    </svg>
  )
}

export default function Category({ category, catIndex, allItems, eliminated, phase }) {
  const updateItem = useGameStore(s => s.updateItem)

  return (
    <div className="category">
      <h2 className="category-name">{category.name}</h2>
      <div className="category-items">
        {category.items.map((item, ii) => {
          const flatIdx = allItems.findIndex(
            a => a.catIndex === catIndex && a.itemIndex === ii
          )
          const isEliminated = eliminated.includes(flatIdx)
          const isWinner = phase === 'eliminating' &&
            !isEliminated &&
            eliminated.length > 0 &&
            allItems.filter(a => a.catIndex === catIndex && !eliminated.includes(
              allItems.findIndex(b => b.catIndex === a.catIndex && b.itemIndex === a.itemIndex)
            )).length === 1

          return (
            <div
              key={ii}
              className={`item ${isEliminated ? 'eliminated' : ''} ${isWinner ? 'winner-glow' : ''}`}
            >
              {phase === 'setup' ? (
                <input
                  type="text"
                  className="item-input"
                  placeholder={`Option ${ii + 1}`}
                  value={item}
                  onChange={e => updateItem(catIndex, ii, e.target.value)}
                  maxLength={30}
                />
              ) : (
                <span className="item-text">
                  {item}
                  {isEliminated && <MarkerStrike />}
                  {isWinner && <HandCircle text={item} />}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}