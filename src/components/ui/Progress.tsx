import React from 'react'
import { clsx } from 'clsx'
import { ProgressProps } from '@/types/designSystem'

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    value, 
    max = 100, 
    variant = 'default', 
    size = 'md', 
    showLabel = false, 
    label,
    animated = false,
    ...props 
  }, ref) => {
    // Ensure value is within bounds
    const clampedValue = Math.max(0, Math.min(value, max))
    const percentage = (clampedValue / max) * 100

    // Generate label text
    const displayLabel = label || `${Math.round(percentage)}%`

    return (
      <div 
        ref={ref} 
        className={clsx(
          'progress', 
          `progress--${variant}`, 
          `progress--${size}`,
          {
            'progress--animated': animated,
            'progress--with-label': showLabel
          }
        )}
        {...props}
      >
        {showLabel && (
          <div className="progress__label">
            <span className="progress__label-text">
              {displayLabel}
            </span>
          </div>
        )}
        
        <div 
          className="progress__track"
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${Math.round(percentage)}%`}
        >
          <div 
            className={clsx('progress__fill', `progress__fill--${variant}`)}
            style={{ 
              width: `${percentage}%`,
              transition: animated ? 'width 0.3s ease' : undefined
            }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'

export default Progress
