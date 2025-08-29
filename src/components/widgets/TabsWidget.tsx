import React, { useState } from 'react'
import { Tabs } from '@/components/ui'
import { TabItem } from '@/types/designSystem'

interface TabsWidgetProps {
  title?: string
  variant?: 'default' | 'pills' | 'underline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  orientation?: 'horizontal' | 'vertical'
  tabs?: Array<{
    id: string
    label: string
    content?: string
    badge?: string | number
    disabled?: boolean
  }>
  defaultTab?: string
  style?: React.CSSProperties
  onTabChange?: (tabId: string) => void
}

const TabsWidget: React.FC<TabsWidgetProps> = ({
  title,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  tabs = [],
  defaultTab,
  style,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const tabItems: TabItem[] = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    content: (
      <div style={{ padding: '16px' }}>
        {tab.content || `Content for ${tab.label}`}
      </div>
    ),
    badge: tab.badge,
    disabled: tab.disabled
  }))

  return (
    <div style={style}>
      {title && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            {title}
          </h3>
        </div>
      )}
      <Tabs
        items={tabItems}
        variant={variant}
        size={size}
        orientation={orientation}
        value={activeTab}
        onChange={handleTabChange}
      />
    </div>
  )
}

export default TabsWidget
