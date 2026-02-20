import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DevTools from './DevTools'

describe('DevTools', () => {
  const onFill = vi.fn()
  const onClear = vi.fn()

  it('should be closed by default', () => {
    render(<DevTools onFill={onFill} onClear={onClear} />)
    expect(screen.queryByText('Dev Tools')).not.toBeInTheDocument()
    expect(screen.getByText(/🛠 Dev Tools/i)).toBeInTheDocument()
  })

  it('should toggle open/close', () => {
    render(<DevTools onFill={onFill} onClear={onClear} />)
    const toggle = screen.getByRole('button')
    
    fireEvent.click(toggle)
    expect(screen.getByText('Dev Tools')).toBeInTheDocument()
    expect(screen.getByText(/🛠 Hide/i)).toBeInTheDocument()
    
    fireEvent.click(toggle)
    expect(screen.queryByText('Dev Tools')).not.toBeInTheDocument()
  })

  it('should call onFill with test data', () => {
    render(<DevTools onFill={onFill} onClear={onClear} />)
    fireEvent.click(screen.getByRole('button'))
    
    fireEvent.click(screen.getByText('Fill Test Data'))
    expect(onFill).toHaveBeenCalled()
    expect(onFill.mock.calls[0][0]).toHaveLength(4)
  })

  it('should call onClear', () => {
    render(<DevTools onFill={onFill} onClear={onClear} />)
    fireEvent.click(screen.getByRole('button'))
    
    fireEvent.click(screen.getByText('Clear All'))
    expect(onClear).toHaveBeenCalled()
  })
})