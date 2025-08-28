// Linear-style Collapsible Section Component
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'

interface CollapsibleSectionProps {
  id: string // Unique identifier for local storage
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  contentPreview?: string // Preview text when collapsed (e.g., "3 comments")
  className?: string
  headerClassName?: string
  contentClassName?: string
  disabled?: boolean
  onToggle?: (expanded: boolean) => void
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  title,
  children,
  defaultExpanded = false,
  contentPreview,
  className,
  headerClassName,
  contentClassName,
  disabled = false,
  onToggle
}) => {
  // Get initial state from localStorage or use default
  const getInitialState = useCallback(() => {
    if (typeof window === 'undefined') return defaultExpanded
    
    const stored = localStorage.getItem(`collapsible-section-${id}`)
    if (stored !== null) {
      return JSON.parse(stored)
    }
    return defaultExpanded
  }, [id, defaultExpanded])

  const [isExpanded, setIsExpanded] = useState(getInitialState)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`collapsible-section-${id}`, JSON.stringify(isExpanded))
    }
  }, [id, isExpanded])

  // Handle toggle with animation
  const handleToggle = useCallback(() => {
    if (disabled) return

    setIsAnimating(true)
    setIsExpanded(prev => {
      const newState = !prev
      onToggle?.(newState)
      return newState
    })

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // End animation after Linear's 200ms timing
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 200)
  }, [disabled, onToggle])

  // Keyboard accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggle()
    }
  }, [handleToggle])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Calculate content height for smooth animation
  const contentHeight = isExpanded && contentRef.current 
    ? contentRef.current.scrollHeight 
    : 0

  return (
    <div 
      className={clsx('collapsible-section', className)}
      style={{
        borderTop: '1px solid var(--border-line)'
      }}
    >
      {/* Section Header */}
      <button
        className={clsx('collapsible-section-header', headerClassName)}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isExpanded}
        aria-controls={`collapsible-content-${id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: 'var(--space-4)',
          border: 'none',
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          fontSize: 'var(--text-h2)',
          lineHeight: 'var(--text-h2-lh)',
          fontWeight: 600,
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 150ms ease-out',
          opacity: disabled ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)'
            e.currentTarget.style.outline = '2px solid var(--accent-blue)'
            e.currentTarget.style.outlineOffset = '-2px'
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.outline = 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <h3 style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit' }}>
            {title}
          </h3>
          
          {/* Content Preview when collapsed */}
          {!isExpanded && contentPreview && (
            <span
              style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                fontWeight: 400
              }}
            >
              {contentPreview}
            </span>
          )}
        </div>

        {/* Chevron Icon */}
        <ChevronDown
          size={16}
          style={{
            color: 'var(--text-secondary)',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease-out',
            flexShrink: 0
          }}
        />
      </button>

      {/* Section Content */}
      <div
        id={`collapsible-content-${id}`}
        style={{
          height: isExpanded ? `${contentHeight}px` : '0px',
          overflow: 'hidden',
          transition: 'height 200ms ease-out'
        }}
        aria-hidden={!isExpanded}
      >
        <div
          ref={contentRef}
          className={clsx('collapsible-section-content', contentClassName)}
          style={{
            paddingLeft: 'var(--space-4)',
            paddingRight: 'var(--space-4)',
            paddingBottom: isExpanded ? 'var(--space-4)' : '0',
            paddingTop: 0 // Remove top padding since header provides spacing
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// Specialized variants for common use cases
export const TaskPropertiesSection: React.FC<Omit<CollapsibleSectionProps, 'id'>> = (props) => (
  <CollapsibleSection
    {...props}
    id="task-properties"
    defaultExpanded={true}
  />
)

export const CollaborationSection: React.FC<Omit<CollapsibleSectionProps, 'id'>> = (props) => (
  <CollapsibleSection
    {...props}
    id="collaboration"
    defaultExpanded={false}
  />
)

export const DescriptionSection: React.FC<Omit<CollapsibleSectionProps, 'id'>> = (props) => (
  <CollapsibleSection
    {...props}
    id="description"
    defaultExpanded={false}
  />
)

export const CommentsSection: React.FC<Omit<CollapsibleSectionProps, 'id'>> = (props) => (
  <CollapsibleSection
    {...props}
    id="comments"
    defaultExpanded={false}
  />
)

export const VersionHistorySection: React.FC<Omit<CollapsibleSectionProps, 'id'>> = (props) => (
  <CollapsibleSection
    {...props}
    id="version-history"
    defaultExpanded={false}
  />
)

export const TimeLogsSection: React.FC<Omit<CollapsibleSectionProps, 'id'>> = (props) => (
  <CollapsibleSection
    {...props}
    id="time-logs"
    defaultExpanded={false}
  />
)

// Hook for managing multiple collapsible sections
export const useCollapsibleSections = (sectionIds: string[]) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initialState: Record<string, boolean> = {}
    sectionIds.forEach(id => {
      const stored = localStorage.getItem(`collapsible-section-${id}`)
      initialState[id] = stored !== null ? JSON.parse(stored) : false
    })
    setExpandedSections(initialState)
  }, [sectionIds])

  const toggleSection = useCallback((id: string) => {
    setExpandedSections(prev => {
      const newState = { ...prev, [id]: !prev[id] }
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`collapsible-section-${id}`, JSON.stringify(newState[id]))
      }
      return newState
    })
  }, [])

  const expandAll = useCallback(() => {
    const newState: Record<string, boolean> = {}
    sectionIds.forEach(id => {
      newState[id] = true
      if (typeof window !== 'undefined') {
        localStorage.setItem(`collapsible-section-${id}`, JSON.stringify(true))
      }
    })
    setExpandedSections(newState)
  }, [sectionIds])

  const collapseAll = useCallback(() => {
    const newState: Record<string, boolean> = {}
    sectionIds.forEach(id => {
      newState[id] = false
      if (typeof window !== 'undefined') {
        localStorage.setItem(`collapsible-section-${id}`, JSON.stringify(false))
      }
    })
    setExpandedSections(newState)
  }, [sectionIds])

  return {
    expandedSections,
    toggleSection,
    expandAll,
    collapseAll,
    isExpanded: (id: string) => expandedSections[id] || false
  }
}

// CSS-in-JS styles for animations (would typically be in a separate CSS file)
const collapsibleStyles = `
  .collapsible-section {
    position: relative;
  }

  .collapsible-section-header {
    position: relative;
    z-index: 1;
  }

  .collapsible-section-header:focus-visible {
    outline: 2px solid var(--accent-blue) !important;
    outline-offset: -2px !important;
  }

  .collapsible-section-content {
    position: relative;
  }

  /* Smooth height transitions */
  .collapsible-section [style*="height"] {
    transition: height 200ms ease-out;
  }

  /* Prevent content from jumping during animation */
  .collapsible-section-content > * {
    transform: translateZ(0);
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    .collapsible-section [style*="height"],
    .collapsible-section [style*="transform"] {
      transition: none !important;
    }
  }
`

// Inject styles if in browser environment
if (typeof document !== 'undefined' && !document.getElementById('collapsible-section-styles')) {
  const styleSheet = document.createElement('style')
  styleSheet.id = 'collapsible-section-styles'
  styleSheet.textContent = collapsibleStyles
  document.head.appendChild(styleSheet)
}
