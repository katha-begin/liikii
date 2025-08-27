import React from 'react'
import { clsx } from 'clsx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    children, 
    leftIcon, 
    rightIcon, 
    loading = false,
    className,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'btn',
          `btn--${variant}`,
          `btn--${size}`,
          {
            'btn--loading': loading,
            'btn--disabled': disabled || loading,
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <div className="btn__spinner" />}
        {!loading && leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
        <span className="btn__text">{children}</span>
        {!loading && rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
