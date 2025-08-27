import React from 'react'
import { clsx } from 'clsx'

export interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  scrollable?: boolean
  padding?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ 
    children, 
    scrollable = true,
    padding = true,
    maxWidth = 'xl',
    className,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'page-wrapper',
          {
            'page-wrapper--scrollable': scrollable,
            'page-wrapper--padded': padding,
          },
          `page-wrapper--${maxWidth}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

PageWrapper.displayName = 'PageWrapper'

export default PageWrapper
