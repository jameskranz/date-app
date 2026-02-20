import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import SpiralButton from './SpiralButton'

describe('SpiralButton', () => {
  const onMagicNumber = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    // Mocking requestAnimationFrame properly for Vitest
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 16))
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => clearTimeout(id))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should render in idle state', () => {
    render(<SpiralButton onMagicNumber={onMagicNumber} />)
    expect(screen.getByText(/Press and hold/i)).toBeInTheDocument()
    expect(screen.getByText('DATE')).toBeInTheDocument()
  })

  it('should transition to holding state on mouse down', async () => {
    render(<SpiralButton onMagicNumber={onMagicNumber} />)
    const wrapper = screen.getByText(/Press and hold/i).parentElement
    
    fireEvent.mouseDown(wrapper)
    
    expect(screen.getByText(/Release when ready/i)).toBeInTheDocument()
  })

  it('should transition back to idle if held for too short', async () => {
    render(<SpiralButton onMagicNumber={onMagicNumber} />)
    const wrapper = screen.getByText(/Press and hold/i).parentElement
    
    fireEvent.mouseDown(wrapper)
    vi.advanceTimersByTime(100) 
    fireEvent.mouseUp(wrapper)
    
    expect(screen.getByText(/Press and hold/i)).toBeInTheDocument()
  })

  it('should progress to counting and done after long hold', async () => {
    render(<SpiralButton onMagicNumber={onMagicNumber} />)
    const wrapper = screen.getByText(/Press and hold/i).parentElement
    
    fireEvent.mouseDown(wrapper)
    vi.advanceTimersByTime(2000)
    
    await act(async () => {
      fireEvent.mouseUp(wrapper)
    })
    
    expect(screen.getByText(/Counting intersections/i)).toBeInTheDocument()
    
    await act(async () => {
      vi.advanceTimersByTime(500)
    })
    
    await act(async () => {
      vi.advanceTimersByTime(600)
    })
    
    expect(screen.getByText(/Magic Number:/i)).toBeInTheDocument()
    expect(onMagicNumber).toHaveBeenCalled()
  })
})