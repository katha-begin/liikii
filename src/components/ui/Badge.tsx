import React from 'react'
import { clsx } from 'clsx'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  children: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'default', 
    size = 'md', 
    children, 
    removable = false,
    onRemove,
    className,
    ...props 
  }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'badge',
          `badge--${variant}`,
          `badge--${size}`,
          {
            'badge--removable': removable,
          },
          className
        )}
        {...props}
      >
        <span className="badge__text">{children}</span>
        {removable && onRemove && (
          <button
            type="button"
            className="badge__remove"
            onClick={onRemove}
            aria-label="Remove"
          >
            ×
          </button>
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
