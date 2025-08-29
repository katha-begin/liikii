import React from 'react'
import { clsx } from 'clsx'
import { IconProps } from '@/types/designSystem'
import * as LucideIcons from 'lucide-react'

// Icon size mapping
const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32
} as const

const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ 
    name, 
    size = 'md', 
    color, 
    variant = 'outline', 
    className,
    onClick,
    ...props 
  }, ref) => {
    // Get the icon component from Lucide
    const IconComponent = (LucideIcons as any)[name]
    
    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in Lucide React`)
      return (
        <span 
          ref={ref}
          className={clsx('icon', 'icon--missing', className)}
          {...props}
        >
          ?
        </span>
      )
    }

    // Determine icon size
    const iconSize = typeof size === 'number' ? size : ICON_SIZES[size]

    const handleClick = () => {
      if (onClick) {
        onClick()
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault()
        onClick()
      }
    }

    return (
      <span 
        ref={ref}
        className={clsx(
          'icon', 
          `icon--${variant}`,
          {
            'icon--clickable': onClick
          },
          className
        )}
        onClick={onClick ? handleClick : undefined}
        onKeyDown={onClick ? handleKeyDown : undefined}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        style={{ color }}
        {...props}
      >
        <IconComponent 
          size={iconSize}
          strokeWidth={variant === 'filled' ? 0 : variant === 'duotone' ? 1.5 : 2}
          fill={variant === 'filled' ? 'currentColor' : 'none'}
        />
      </span>
    )
  }
)

Icon.displayName = 'Icon'

export default Icon
