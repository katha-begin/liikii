import React from 'react'
import { clsx } from 'clsx'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: boolean
  children: React.ReactNode
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    size = 'xl', 
    padding = true, 
    children, 
    className,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'container',
          `container--${size}`,
          {
            'container--padded': padding,
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

Container.displayName = 'Container'

export default Container
