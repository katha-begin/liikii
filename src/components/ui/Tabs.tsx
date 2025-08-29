import React, { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { TabsProps } from '@/types/designSystem'

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    items, 
    defaultValue, 
    value, 
    onChange, 
    variant = 'default', 
    size = 'md',
    orientation = 'horizontal',
    ...props 
  }, ref) => {
    const [activeTab, setActiveTab] = useState(value || defaultValue || items[0]?.id)
    const tabListRef = useRef<HTMLDivElement>(null)

    // Update active tab when controlled value changes
    useEffect(() => {
      if (value !== undefined) {
        setActiveTab(value)
      }
    }, [value])

    const handleTabClick = (tabId: string) => {
      const tab = items.find(item => item.id === tabId)
      if (tab?.disabled) return

      setActiveTab(tabId)
      onChange?.(tabId)
    }

    const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
      const currentIndex = items.findIndex(item => item.id === tabId)
      let nextIndex = currentIndex

      switch (event.key) {
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            event.preventDefault()
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
          }
          break
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            event.preventDefault()
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
          }
          break
        case 'ArrowUp':
          if (orientation === 'vertical') {
            event.preventDefault()
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
          }
          break
        case 'ArrowDown':
          if (orientation === 'vertical') {
            event.preventDefault()
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
          }
          break
        case 'Home':
          event.preventDefault()
          nextIndex = 0
          break
        case 'End':
          event.preventDefault()
          nextIndex = items.length - 1
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleTabClick(tabId)
          return
      }

      // Find next non-disabled tab
      let attempts = 0
      while (items[nextIndex]?.disabled && attempts < items.length) {
        nextIndex = orientation === 'horizontal' 
          ? (nextIndex + 1) % items.length
          : (nextIndex + 1) % items.length
        attempts++
      }

      if (!items[nextIndex]?.disabled) {
        const nextTabElement = tabListRef.current?.children[nextIndex] as HTMLElement
        nextTabElement?.focus()
      }
    }

    const activeTabContent = items.find(item => item.id === activeTab)?.content

    return (
      <div 
        ref={ref} 
        className={clsx(
          'tabs', 
          `tabs--${variant}`, 
          `tabs--${size}`,
          `tabs--${orientation}`
        )}
        {...props}
      >
        <div
          ref={tabListRef}
          className="tabs__list"
          role="tablist"
          aria-orientation={orientation}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              className={clsx('tabs__tab', {
                'tabs__tab--active': item.id === activeTab,
                'tabs__tab--disabled': item.disabled
              })}
              role="tab"
              tabIndex={item.id === activeTab ? 0 : -1}
              aria-selected={item.id === activeTab}
              aria-disabled={item.disabled}
              disabled={item.disabled}
              onClick={() => handleTabClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
            >
              {item.icon && (
                <span className="tabs__tab-icon">
                  {item.icon}
                </span>
              )}
              <span className="tabs__tab-label">
                {item.label}
              </span>
              {item.badge && (
                <span className="tabs__tab-badge">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div
          className="tabs__content"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
        >
          {activeTabContent}
        </div>
      </div>
    )
  }
)

Tabs.displayName = 'Tabs'

export default Tabs
