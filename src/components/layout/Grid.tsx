import React from 'react'
import { clsx } from 'clsx'

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'sm' | 'md' | 'lg'
  responsive?: boolean
  children: React.ReactNode
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    cols = 1, 
    gap = 'md', 
    responsive = true,
    children, 
    className,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'grid',
          `grid--cols-${cols}`,
          `grid--gap-${gap}`,
          {
            'grid--responsive': responsive,
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

Grid.displayName = 'Grid'

export default Grid
