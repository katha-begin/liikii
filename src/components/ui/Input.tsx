import React from 'react'
import { clsx } from 'clsx'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'search'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    hint, 
    leftIcon, 
    rightIcon, 
    variant = 'default',
    className,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={clsx('input-group', className)}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        
        <div className={clsx(
          'input-container',
          `input-container--${variant}`,
          {
            'input-container--error': error,
            'input-container--with-left-icon': leftIcon,
            'input-container--with-right-icon': rightIcon,
          }
        )}>
          {leftIcon && (
            <div className="input-icon input-icon--left">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={clsx('input', `input--${variant}`)}
            {...props}
          />
          
          {rightIcon && (
            <div className="input-icon input-icon--right">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <div className="input-error">{error}</div>
        )}
        
        {hint && !error && (
          <div className="input-hint">{hint}</div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
