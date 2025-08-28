// Linear-style Compact Date Picker
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface LinearDatePickerProps {
  value?: string | null
  onChange: (date: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  allowClear?: boolean
}

export const LinearDatePicker: React.FC<LinearDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  className,
  allowClear = true
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  )
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          triggerRef.current?.focus()
          break
        case 'Enter':
          event.preventDefault()
          if (selectedDate) {
            handleDateSelect(selectedDate)
          }
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, selectedDate])

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date)
    onChange(date.toISOString())
    setIsOpen(false)
  }, [onChange])

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDate(null)
    onChange(null)
  }, [onChange])

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return placeholder
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    if (dateOnly.getTime() === today.getTime()) {
      return 'Today'
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      return 'Yesterday'
    } else if (dateOnly.getTime() === tomorrow.getTime()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const renderCalendar = () => {
    if (!isOpen) return null

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const today = new Date()
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const isCurrentMonth = date.getMonth() === month
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
      
      days.push(
        <button
          key={i}
          className={clsx('calendar-day', {
            'current-month': isCurrentMonth,
            'other-month': !isCurrentMonth,
            'today': isToday,
            'selected': isSelected
          })}
          onClick={() => handleDateSelect(date)}
          style={{
            width: '28px',
            height: '28px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: isSelected
              ? 'var(--accent-blue)'
              : isToday
                ? 'var(--bg-surface-2)'
                : 'transparent',
            color: isSelected
              ? 'white'
              : !isCurrentMonth
                ? 'var(--text-secondary)'
                : 'var(--text-primary)',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 150ms ease-out',
            fontWeight: isToday ? 600 : 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = isToday ? 'var(--bg-surface-2)' : 'transparent'
            }
          }}
        >
          {date.getDate()}
        </button>
      )
    }

    if (!triggerRect) return null

    return createPortal(
      <div
        className="linear-date-picker-calendar"
        style={{
          position: 'fixed',
          top: triggerRect.bottom + 8, // 8px gap below trigger
          left: triggerRect.left,
          zIndex: 10000,
          backgroundColor: 'var(--bg-surface-2)',
          border: '1px solid var(--border-line)',
          borderRadius: 'var(--radius-input)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          padding: '12px',
          width: '280px'
        }}
      >
        {/* Calendar Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-2)',
            padding: '0 var(--space-1)'
          }}
        >
          <button
            onClick={() => navigateMonth('prev')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'background-color 150ms ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <ChevronLeft size={14} />
          </button>
          
          <div
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              textAlign: 'center'
            }}
          >
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>

          <button
            onClick={() => navigateMonth('next')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'background-color 150ms ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Day Headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            marginBottom: '8px'
          }}
        >
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                padding: '4px 2px'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px'
          }}
        >
          {days}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-line)'
          }}
        >
          <button
            onClick={() => handleDateSelect(new Date())}
            style={{
              padding: 'var(--space-1) var(--space-2)',
              border: 'none',
              borderRadius: 'var(--radius-input)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-caption)',
              cursor: 'pointer',
              transition: 'all 150ms ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            Today
          </button>
          
          {allowClear && selectedDate && (
            <button
              onClick={() => {
                setSelectedDate(null)
                onChange(null)
                setIsOpen(false)
              }}
              style={{
                padding: 'var(--space-1) var(--space-2)',
                border: 'none',
                borderRadius: 'var(--radius-input)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-caption)',
                cursor: 'pointer',
                transition: 'all 150ms ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--semantic-danger)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={clsx('linear-date-picker', className)} style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        className="linear-date-picker-trigger"
        onClick={() => {
          if (!disabled) {
            if (!isOpen && triggerRef.current) {
              const rect = triggerRef.current.getBoundingClientRect()
              setTriggerRect(rect)
            }
            setIsOpen(!isOpen)
          }
        }}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--space-1) var(--space-2)',
          border: '1px solid transparent',
          borderRadius: 'var(--radius-input)',
          backgroundColor: isOpen ? 'var(--bg-surface-2)' : 'transparent',
          color: selectedDate ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--text-body-lh)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 150ms ease-out',
          minHeight: '28px',
          width: '100%'
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isOpen) {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <Calendar size={14} style={{ marginRight: 'var(--space-2)', flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: 'left' }}>
          {formatDisplayDate(selectedDate)}
        </span>
        
        {allowClear && selectedDate && (
          <div
            onClick={handleClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'var(--text-secondary)',
              color: 'var(--bg-base)',
              cursor: 'pointer',
              marginLeft: 'var(--space-1)',
              transition: 'background-color 150ms ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--semantic-danger)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--text-secondary)'
            }}
          >
            <X size={10} />
          </div>
        )}
      </button>

      {renderCalendar()}
    </div>
  )
}
