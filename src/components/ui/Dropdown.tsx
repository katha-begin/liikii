import React, { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'
import { DropdownProps, DropdownItem } from '@/types/designSystem'

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ 
    trigger, 
    items, 
    placement = 'bottom-start', 
    variant = 'default', 
    size = 'md', 
    disabled = false,
    onOpenChange,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)

    const handleToggle = () => {
      if (disabled) return
      const newOpen = !isOpen
      setIsOpen(newOpen)
      onOpenChange?.(newOpen)
    }

    const handleItemClick = (item: DropdownItem) => {
      if (item.disabled) return
      item.onClick?.()
      setIsOpen(false)
      onOpenChange?.(false)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return
      
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleToggle()
          break
        case 'Escape':
          if (isOpen) {
            setIsOpen(false)
            onOpenChange?.(false)
            triggerRef.current?.focus()
          }
          break
        case 'ArrowDown':
          if (isOpen) {
            event.preventDefault()
            // Focus first item
            const firstItem = dropdownRef.current?.querySelector('[role="menuitem"]:not([aria-disabled="true"])') as HTMLElement
            firstItem?.focus()
          } else {
            handleToggle()
          }
          break
      }
    }

    const handleItemKeyDown = (event: React.KeyboardEvent, item: DropdownItem, index: number) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleItemClick(item)
          break
        case 'ArrowDown':
          event.preventDefault()
          const nextItem = dropdownRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')?.[index + 1] as HTMLElement
          nextItem?.focus()
          break
        case 'ArrowUp':
          event.preventDefault()
          const prevItem = dropdownRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')?.[index - 1] as HTMLElement
          prevItem?.focus()
          break
        case 'Escape':
          setIsOpen(false)
          onOpenChange?.(false)
          triggerRef.current?.focus()
          break
      }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          onOpenChange?.(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, onOpenChange])

    return (
      <div 
        ref={ref} 
        className={clsx('dropdown', `dropdown--${variant}`, `dropdown--${size}`, {
          'dropdown--open': isOpen,
          'dropdown--disabled': disabled
        })}
        {...props}
      >
        <button
          ref={triggerRef}
          className={clsx('dropdown__trigger', {
            'dropdown__trigger--disabled': disabled
          })}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {trigger}
          {variant === 'select' && (
            <ChevronDown 
              className={clsx('dropdown__chevron', {
                'dropdown__chevron--rotated': isOpen
              })} 
              size={16} 
            />
          )}
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={clsx('dropdown__content', `dropdown__content--${placement}`)}
            role="menu"
            aria-orientation="vertical"
          >
            {items.map((item, index) => {
              if (item.separator) {
                return <div key={`separator-${index}`} className="dropdown__separator" role="separator" />
              }

              return (
                <div
                  key={item.id}
                  className={clsx('dropdown__item', {
                    'dropdown__item--disabled': item.disabled
                  })}
                  role="menuitem"
                  tabIndex={item.disabled ? -1 : 0}
                  aria-disabled={item.disabled}
                  onClick={() => handleItemClick(item)}
                  onKeyDown={(e) => handleItemKeyDown(e, item, index)}
                >
                  {item.icon && (
                    <span className="dropdown__item-icon">
                      {item.icon}
                    </span>
                  )}
                  <span className="dropdown__item-label">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

Dropdown.displayName = 'Dropdown'

export default Dropdown
