// Linear-style Date Range Picker
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface DateRange {
  startDate: string | null
  endDate: string | null
}

interface LinearDateRangePickerProps {
  startDate?: string | null
  endDate?: string | null
  onChange: (range: DateRange) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  allowClear?: boolean
}

export const LinearDateRangePicker: React.FC<LinearDateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  placeholder = 'Select date range',
  disabled = false,
  className,
  allowClear = true
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    startDate: startDate || null,
    endDate: endDate || null
  })
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [selectingStart, setSelectingStart] = useState(true)
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Update internal state when props change
  useEffect(() => {
    setSelectedRange({
      startDate: startDate || null,
      endDate: endDate || null
    })
  }, [startDate, endDate])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const calendarElement = document.querySelector('.linear-date-range-picker-calendar')

      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        calendarElement &&
        !calendarElement.contains(target)
      ) {
        setIsOpen(false)
        setSelectingStart(true)
        setHoverDate(null)
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
          setSelectingStart(true)
          setHoverDate(null)
          triggerRef.current?.focus()
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Format display date range
  const formatDisplayRange = useCallback(() => {
    if (!selectedRange.startDate && !selectedRange.endDate) {
      return placeholder
    }

    const start = selectedRange.startDate ? new Date(selectedRange.startDate) : null
    const end = selectedRange.endDate ? new Date(selectedRange.endDate) : null

    if (start && end) {
      const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
      const startDay = start.getDate()
      const endDay = end.getDate()
      const year = start.getFullYear()

      // Same month
      if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${startMonth} ${startDay} - ${endDay}, ${year}`
      }
      // Different months
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
    }

    if (start) {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ...`
    }

    if (end) {
      return `... - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }

    return placeholder
  }, [selectedRange, placeholder])

  // Calculate estimated hours from date range
  const calculateEstimatedHours = useCallback((startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Calculate business days (excluding weekends)
    let businessDays = 0
    const currentDate = new Date(start)
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        businessDays++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Estimate 8 hours per business day
    return businessDays * 8
  }, [])

  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    const dateString = date.toISOString().split('T')[0]

    if (selectingStart || !selectedRange.startDate) {
      // Selecting start date
      const newRange = { startDate: dateString, endDate: null }
      setSelectedRange(newRange)
      setSelectingStart(false)
    } else {
      // Selecting end date
      const startDate = new Date(selectedRange.startDate)

      if (date < startDate) {
        // If selected date is before start, make it the new start
        const newRange = { startDate: dateString, endDate: selectedRange.startDate }
        setSelectedRange(newRange)
        onChange(newRange)
        setIsOpen(false)
        setSelectingStart(true)
      } else {
        // Normal end date selection
        const newRange = { startDate: selectedRange.startDate, endDate: dateString }
        setSelectedRange(newRange)
        onChange(newRange)
        setIsOpen(false)
        setSelectingStart(true)
      }
    }
  }, [selectedRange, selectingStart, onChange])

  // Handle clear
  const handleClear = useCallback(() => {
    const newRange = { startDate: null, endDate: null }
    setSelectedRange(newRange)
    onChange(newRange)
    setIsOpen(false)
    setSelectingStart(true)
  }, [onChange])

  // Navigate months
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }, [])

  // Check if date is in range
  const isDateInRange = useCallback((date: Date) => {
    if (!selectedRange.startDate || !selectedRange.endDate) return false
    const start = new Date(selectedRange.startDate)
    const end = new Date(selectedRange.endDate)
    return date >= start && date <= end
  }, [selectedRange])

  // Check if date is range start or end
  const isRangeStart = useCallback((date: Date) => {
    return selectedRange.startDate && date.toDateString() === new Date(selectedRange.startDate).toDateString()
  }, [selectedRange.startDate])

  const isRangeEnd = useCallback((date: Date) => {
    return selectedRange.endDate && date.toDateString() === new Date(selectedRange.endDate).toDateString()
  }, [selectedRange.endDate])

  // Check if date is in hover range
  const isDateInHoverRange = useCallback((date: Date) => {
    if (!hoverDate || !selectedRange.startDate || selectedRange.endDate) return false
    const start = new Date(selectedRange.startDate)
    const minDate = date < start ? date : start
    const maxDate = date < start ? start : hoverDate
    return date >= minDate && date <= maxDate
  }, [hoverDate, selectedRange])

  // Generate calendar days
  const calendarDays = useCallback(() => {
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
      const isStart = isRangeStart(date)
      const isEnd = isRangeEnd(date)
      const inRange = isDateInRange(date)
      const inHoverRange = isDateInHoverRange(date)
      
      days.push(
        <button
          key={i}
          className={clsx('calendar-day', {
            'current-month': isCurrentMonth,
            'other-month': !isCurrentMonth,
            'today': isToday,
            'range-start': isStart,
            'range-end': isEnd,
            'in-range': inRange,
            'in-hover-range': inHoverRange
          })}
          onClick={() => handleDateSelect(date)}
          onMouseEnter={() => setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          style={{
            width: '28px',
            height: '28px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: isStart || isEnd
              ? 'var(--accent-blue)' 
              : inRange || inHoverRange
                ? 'var(--bg-surface-2)'
                : isToday 
                  ? 'var(--bg-surface-1)' 
                  : 'transparent',
            color: isStart || isEnd
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
        >
          {date.getDate()}
        </button>
      )
    }

    return days
  }, [
    currentMonth,
    selectedRange,
    hoverDate,
    selectingStart,
    handleDateSelect,
    isDateInRange,
    isRangeStart,
    isRangeEnd,
    isDateInHoverRange
  ])

  // Render calendar portal
  const renderCalendar = useCallback(() => {
    if (!triggerRect) return null

    return createPortal(
      <div
        className="linear-date-range-picker-calendar"
        style={{
          position: 'fixed',
          top: triggerRect.bottom + 8,
          left: triggerRect.left,
          zIndex: 10000,
          backgroundColor: 'var(--bg-surface-2)',
          border: '1px solid var(--border-line)',
          borderRadius: 'var(--radius-input)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          padding: '12px',
          width: '260px' // Reduced from 280px to fit better in task panel
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
          {calendarDays()}
        </div>

        {/* Range Selection Status */}
        <div
          style={{
            marginTop: '8px',
            padding: '6px 8px',
            backgroundColor: 'var(--bg-surface-1)',
            borderRadius: '4px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}
        >
          {selectingStart ? 'Select start date' : 'Select end date'}
        </div>

        {/* Estimated Hours Display */}
        {selectedRange.startDate && selectedRange.endDate && (
          <div
            style={{
              marginTop: '8px',
              padding: '6px 8px',
              backgroundColor: 'var(--accent-blue)',
              borderRadius: '4px',
              fontSize: '11px',
              color: 'white',
              textAlign: 'center',
              fontWeight: 500
            }}
          >
            Estimated: {calculateEstimatedHours(selectedRange.startDate, selectedRange.endDate)} hours
          </div>
        )}

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
            onClick={() => {
              const today = new Date()
              const tomorrow = new Date(today)
              tomorrow.setDate(today.getDate() + 1)
              const newRange = {
                startDate: today.toISOString().split('T')[0],
                endDate: tomorrow.toISOString().split('T')[0]
              }
              setSelectedRange(newRange)
              onChange(newRange)
              setIsOpen(false)
              setSelectingStart(true)
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '11px',
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
            Today - Tomorrow
          </button>
          
          {allowClear && (selectedRange.startDate || selectedRange.endDate) && (
            <button
              onClick={handleClear}
              style={{
                padding: '4px 8px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '11px',
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
      </div>,
      document.body
    )
  }, [
    currentMonth, 
    selectedRange, 
    hoverDate, 
    selectingStart, 
    triggerRect, 
    handleDateSelect, 
    navigateMonth, 
    handleClear, 
    allowClear,
    isDateInRange,
    isRangeStart,
    isRangeEnd,
    isDateInHoverRange,
    calendarDays,
    calculateEstimatedHours
  ])

  return (
    <div ref={containerRef} className={clsx('linear-date-range-picker', className)} style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        className="linear-date-range-picker-trigger"
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
          color: (selectedRange.startDate || selectedRange.endDate) ? 'var(--text-primary)' : 'var(--text-secondary)',
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
          {formatDisplayRange()}
        </span>
      </button>

      {/* Clear button positioned outside the trigger button */}
      {allowClear && (selectedRange.startDate || selectedRange.endDate) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleClear()
          }}
          style={{
            position: 'absolute',
            right: 'var(--space-2)',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            border: 'none',
            borderRadius: '2px',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            zIndex: 1
          }}
        >
          <X size={12} />
        </button>
      )}

      {isOpen && renderCalendar()}
    </div>
  )
}
