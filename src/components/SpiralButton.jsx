import { useRef, useState, useEffect, useCallback } from 'react'

const CANVAS_SIZE = 220
const CENTER = CANVAS_SIZE / 2
const MAX_HOLD_MS = 5000
const ANGLE_PER_MS = (Math.PI * 2 * 6) / MAX_HOLD_MS
const SPIRAL_SPACING = 7
const MIN_NUMBER = 3
const MAX_NUMBER = 15

function getSpiralPoint(angle) {
  const r = (angle / (Math.PI * 2)) * SPIRAL_SPACING
  return {
    x: CENTER + r * Math.cos(angle - Math.PI / 2),
    y: CENTER + r * Math.sin(angle - Math.PI / 2),
  }
}

export default function SpiralButton({ onMagicNumber }) {
  const canvasRef = useRef(null)
  const holdingRef = useRef(false)
  const startTimeRef = useRef(null)
  const startedRef = useRef(false)
  const rafRef = useRef(null)
  const angleRef = useRef(0)
  const pointsRef = useRef([])
  const [phase, setPhase] = useState('idle')
  const [magicNumber, setMagicNumber] = useState(null)

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  }, [])

  const drawSpiral = useCallback((ctx, points) => {
    if (points.length < 2) return
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
    ctx.strokeStyle = '#c17f5a'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }, [])

  const animate = useCallback(() => {
    if (!holdingRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const elapsed = Date.now() - startTimeRef.current
    const targetAngle = Math.min(elapsed * ANGLE_PER_MS, ANGLE_PER_MS * MAX_HOLD_MS)
    angleRef.current = targetAngle
    const lastAngle = (pointsRef.current.length - 1) * 0.05
    for (let a = lastAngle; a <= targetAngle; a += 0.05) {
      pointsRef.current.push(getSpiralPoint(a))
    }
    clearCanvas()
    drawSpiral(ctx, pointsRef.current)
    rafRef.current = requestAnimationFrame(animate)
  }, [clearCanvas, drawSpiral])

  function startHold(e) {
    e.preventDefault()
    if (phase !== 'idle') return
    startedRef.current = true
    holdingRef.current = true
    startTimeRef.current = Date.now()
    angleRef.current = 0
    pointsRef.current = [getSpiralPoint(0)]
    setPhase('holding')
    rafRef.current = requestAnimationFrame(animate)
    }

  function endHold(e) {
    e.preventDefault()
    if (!startedRef.current) return
    if (!holdingRef.current) return
    startedRef.current = false
    holdingRef.current = false
    cancelAnimationFrame(rafRef.current)

    if (angleRef.current < Math.PI * 2) {
        clearCanvas()
        setPhase('idle')
        return
    }

    setPhase('counting')
    drawCenterLineAndCount()
    }

  function drawCenterLineAndCount() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const points = pointsRef.current
    const lineStartX = 10
    const lineEndX = CANVAS_SIZE - 10
    const lineY = CENTER
    let progress = 0
    const lineSteps = 30

    const animateLine = () => {
      progress++
      const currentX = lineStartX + (lineEndX - lineStartX) * (progress / lineSteps)
      clearCanvas()
      drawSpiral(ctx, points)
      ctx.beginPath()
      ctx.moveTo(lineStartX, lineY)
      ctx.lineTo(currentX, lineY)
      ctx.strokeStyle = '#4a7fb5'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.stroke()
      ctx.setLineDash([])

      if (progress < lineSteps) {
        requestAnimationFrame(animateLine)
      } else {
        const intersections = []
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1]
          const curr = points[i]
          const prevDy = prev.y - CENTER
          const currDy = curr.y - CENTER
          if (prevDy * currDy < 0) {
            const x = prev.x + (curr.x - prev.x) * (Math.abs(prevDy) / (Math.abs(prevDy) + Math.abs(currDy)))
            if (x > 10 && x < CANVAS_SIZE - 10) intersections.push({ x, y: CENTER })
          }
        }
        intersections.forEach(pt => {
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2)
          ctx.fillStyle = '#4a7fb5'
          ctx.fill()
        })
        const raw = intersections.length
        const num = Math.max(MIN_NUMBER, Math.min(MAX_NUMBER, raw === 0 ? MIN_NUMBER : raw))
        setTimeout(() => {
          setMagicNumber(num)
          setPhase('done')
          onMagicNumber(num)
        }, 600)
      }
    }
    requestAnimationFrame(animateLine)
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <div
        className="spiral-wrapper"
        onMouseDown={startHold}
        onMouseUp={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
        <p className="spiral-hint">
        {phase === 'idle' && 'Press and hold to draw your spiral'}
        {phase === 'holding' && 'Release when ready...'}
        {phase === 'counting' && 'Counting intersections...'}
        {phase === 'done' && <>Magic Number: <strong>{magicNumber}</strong></>}
        </p>
        <div
        className={`spiral-canvas-wrapper ${phase === 'idle' ? 'pulse' : ''}`}
        style={{ cursor: phase === 'idle' ? 'pointer' : 'default', position: 'relative' }}
        >
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} style={{ display: 'block' }} />
        {phase === 'idle' && <div className="spiral-idle-label">DATE</div>}
        </div>
    </div>
    )
}