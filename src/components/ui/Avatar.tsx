import React, { useState } from 'react'
import { clsx } from 'clsx'
import { AvatarProps } from '@/types/designSystem'

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    src, 
    alt, 
    fallback, 
    size = 'md', 
    variant = 'circle', 
    status,
    showStatus = false,
    onClick,
    ...props 
  }, ref) => {
    const [imageError, setImageError] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const handleImageError = () => {
      setImageError(true)
    }

    const handleImageLoad = () => {
      setImageLoaded(true)
      setImageError(false)
    }

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

    // Generate initials from fallback text
    const getInitials = (text: string) => {
      return text
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const displayFallback = fallback || alt || '?'
    const initials = getInitials(displayFallback)

    return (
      <div 
        ref={ref} 
        className={clsx(
          'avatar', 
          `avatar--${size}`, 
          `avatar--${variant}`,
          {
            'avatar--clickable': onClick,
            'avatar--with-status': showStatus && status
          }
        )}
        onClick={onClick ? handleClick : undefined}
        onKeyDown={onClick ? handleKeyDown : undefined}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={alt}
        {...props}
      >
        <div className="avatar__content">
          {src && !imageError ? (
            <img
              src={src}
              alt={alt || ''}
              className={clsx('avatar__image', {
                'avatar__image--loaded': imageLoaded
              })}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="avatar__fallback">
              <span className="avatar__initials">
                {initials}
              </span>
            </div>
          )}
        </div>

        {showStatus && status && (
          <div 
            className={clsx('avatar__status', `avatar__status--${status}`)}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
