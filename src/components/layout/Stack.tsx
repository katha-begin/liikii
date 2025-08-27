import React from 'react'
import { clsx } from 'clsx'

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical'
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
  children: React.ReactNode
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ 
    direction = 'vertical', 
    gap = 'md', 
    align = 'stretch',
    justify = 'start',
    wrap = false,
    children, 
    className,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'stack',
          `stack--${direction}`,
          `stack--gap-${gap}`,
          `stack--align-${align}`,
          `stack--justify-${justify}`,
          {
            'stack--wrap': wrap,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Stack.displayName = 'Stack'

export default Stack
