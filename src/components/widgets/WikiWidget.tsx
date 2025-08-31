import React from 'react'
import { Card } from '@/components/ui'
import WikiPage from '@/components/wiki/WikiPage'
import { BaseWidgetProps } from './index'

export interface WikiWidgetProps extends BaseWidgetProps {
  projectId: string
  height?: string
}

const WikiWidget: React.FC<WikiWidgetProps> = ({
  title = 'Project Wiki',
  projectId,
  height = '600px',
  className,
  style
}) => {
  return (
    <Card
      variant="outlined"
      padding="none"
      className={className}
      style={{
        height,
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      {title && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <h3 className="text-h3">{title}</h3>
        </div>
      )}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <WikiPage projectId={projectId} />
      </div>
    </Card>
  )
}

export default WikiWidget
