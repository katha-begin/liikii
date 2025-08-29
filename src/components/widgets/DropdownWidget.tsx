import React from 'react'
import { Dropdown } from '@/components/ui'
import { DropdownItem } from '@/types/designSystem'

interface DropdownWidgetProps {
  title?: string
  variant?: 'default' | 'menu' | 'select'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  items?: DropdownItem[]
  triggerText?: string
  disabled?: boolean
  style?: React.CSSProperties
  onItemClick?: (itemId: string) => void
}

const DropdownWidget: React.FC<DropdownWidgetProps> = ({
  title,
  variant = 'default',
  size = 'md',
  items = [],
  triggerText = 'Select Option',
  disabled = false,
  style,
  onItemClick
}) => {
  const handleItemClick = (item: DropdownItem) => {
    onItemClick?.(item.id)
    item.onClick?.()
  }

  const processedItems = items.map(item => ({
    ...item,
    onClick: () => handleItemClick(item)
  }))

  return (
    <div style={style}>
      {title && (
        <div style={{ marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            {title}
          </h3>
        </div>
      )}
      <Dropdown
        trigger={triggerText}
        items={processedItems}
        variant={variant}
        size={size}
        disabled={disabled}
      />
    </div>
  )
}

export default DropdownWidget
