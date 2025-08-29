import React, { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { TooltipProps } from '@/types/designSystem'

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ 
    content, 
    children, 
    placement = 'top', 
    delay = 500, 
    disabled = false,
    variant = 'default',
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [actualPlacement, setActualPlacement] = useState(placement)
    const timeoutRef = useRef<NodeJS.Timeout>()
    const tooltipRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    const showTooltip = () => {
      if (disabled) return
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
        updatePlacement()
      }, delay)
    }

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(false)
    }

    const updatePlacement = () => {
      if (!tooltipRef.current || !triggerRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      let newPlacement = placement

      // Check if tooltip would overflow and adjust placement
      switch (placement) {
        case 'top':
          if (triggerRect.top - tooltipRect.height < 0) {
            newPlacement = 'bottom'
          }
          break
        case 'bottom':
          if (triggerRect.bottom + tooltipRect.height > viewport.height) {
            newPlacement = 'top'
          }
          break
        case 'left':
          if (triggerRect.left - tooltipRect.width < 0) {
            newPlacement = 'right'
          }
          break
        case 'right':
          if (triggerRect.right + tooltipRect.width > viewport.width) {
            newPlacement = 'left'
          }
          break
      }

      setActualPlacement(newPlacement)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        hideTooltip()
      }
    }

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    // Update placement when tooltip becomes visible
    useEffect(() => {
      if (isVisible) {
        updatePlacement()
      }
    }, [isVisible])

    return (
      <div 
        ref={ref} 
        className="tooltip-wrapper"
        {...props}
      >
        <div
          ref={triggerRef}
          className="tooltip__trigger"
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onFocus={showTooltip}
          onBlur={hideTooltip}
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>

        {isVisible && !disabled && (
          <div
            ref={tooltipRef}
            className={clsx(
              'tooltip',
              `tooltip--${actualPlacement}`,
              `tooltip--${variant}`
            )}
            role="tooltip"
            aria-hidden={!isVisible}
          >
            <div className="tooltip__content">
              {content}
            </div>
            <div className={clsx('tooltip__arrow', `tooltip__arrow--${actualPlacement}`)} />
          </div>
        )}
      </div>
    )
  }
)

Tooltip.displayName = 'Tooltip'

export default Tooltip
