import React from 'react'
import { clsx } from 'clsx'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { BreadcrumbsProps, BreadcrumbItem } from '@/types/designSystem'

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ 
    items, 
    separator, 
    maxItems = 5, 
    size = 'md',
    ...props 
  }, ref) => {
    // Handle collapsed breadcrumbs when there are too many items
    const shouldCollapse = items.length > maxItems
    let displayItems = items

    if (shouldCollapse) {
      const firstItem = items[0]
      const lastItems = items.slice(-2) // Show last 2 items
      displayItems = [
        firstItem,
        { id: 'collapsed', label: '...', onClick: undefined } as BreadcrumbItem,
        ...lastItems
      ]
    }

    const defaultSeparator = separator || <ChevronRight size={14} />

    const handleItemClick = (item: BreadcrumbItem, event: React.MouseEvent) => {
      if (item.current || item.id === 'collapsed') {
        event.preventDefault()
        return
      }

      if (item.onClick) {
        event.preventDefault()
        item.onClick()
      }
      // If href is provided, let the default link behavior handle navigation
    }

    const handleKeyDown = (item: BreadcrumbItem, event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (item.current || item.id === 'collapsed') {
          event.preventDefault()
          return
        }

        if (item.onClick) {
          event.preventDefault()
          item.onClick()
        }
      }
    }

    return (
      <nav 
        ref={ref} 
        className={clsx('breadcrumbs', `breadcrumbs--${size}`)}
        aria-label="Breadcrumb navigation"
        {...props}
      >
        <ol className="breadcrumbs__list" role="list">
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1
            const isCollapsed = item.id === 'collapsed'

            return (
              <li 
                key={item.id} 
                className={clsx('breadcrumbs__item', {
                  'breadcrumbs__item--current': item.current || isLast,
                  'breadcrumbs__item--collapsed': isCollapsed
                })}
              >
                {item.href && !item.current && !isCollapsed ? (
                  <a
                    href={item.href}
                    className="breadcrumbs__link"
                    onClick={(e) => handleItemClick(item, e)}
                    onKeyDown={(e) => handleKeyDown(item, e)}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {isCollapsed ? <MoreHorizontal size={16} /> : item.label}
                  </a>
                ) : (
                  <span
                    className={clsx('breadcrumbs__text', {
                      'breadcrumbs__text--clickable': item.onClick && !item.current && !isCollapsed
                    })}
                    onClick={item.onClick && !item.current && !isCollapsed ? (e) => handleItemClick(item, e) : undefined}
                    onKeyDown={item.onClick && !item.current && !isCollapsed ? (e) => handleKeyDown(item, e) : undefined}
                    tabIndex={item.onClick && !item.current && !isCollapsed ? 0 : undefined}
                    role={item.onClick && !item.current && !isCollapsed ? 'button' : undefined}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {isCollapsed ? <MoreHorizontal size={16} /> : item.label}
                  </span>
                )}

                {!isLast && (
                  <span className="breadcrumbs__separator" aria-hidden="true">
                    {defaultSeparator}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)

Breadcrumbs.displayName = 'Breadcrumbs'

export default Breadcrumbs
