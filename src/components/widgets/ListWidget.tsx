import React from 'react'
import { Card, Badge } from '@/components/ui'
import { Stack } from '@/components/layout'
import { User, Clock } from 'lucide-react'
import { ListWidgetProps } from './index'

const ListWidget: React.FC<ListWidgetProps> = ({
  title = 'List Widget',
  description,
  items = [],
  showStatus = true,
  showAssignee = true,
  showDueDate = true,
  onItemClick,
  className,
  style
}) => {
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'not_started': return 'default'
      case 'in_progress': return 'info'
      case 'review': return 'warning'
      case 'approved': return 'success'
      case 'final': return 'success'
      default: return 'default'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `${diffDays} days`
    return date.toLocaleDateString()
  }

  return (
    <Card 
      variant="outlined" 
      padding="md" 
      className={`list-widget ${className || ''}`}
      style={style}
    >
      <Stack direction="vertical" gap="md">
        {title && (
          <div>
            <h3 className="text-h2">{title}</h3>
            {description && (
              <p className="text-body text-secondary">{description}</p>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <div className="empty-list">
            <p className="text-body text-secondary">No items to display</p>
          </div>
        ) : (
          <Stack direction="vertical" gap="sm">
            {items.map((item, index) => (
              <div
                key={item.id || item._id || index}
                className={`list-item ${onItemClick ? 'clickable' : ''}`}
                onClick={() => onItemClick?.(item)}
              >
                <Stack direction="horizontal" justify="between" align="center">
                  <Stack direction="vertical" gap="xs" style={{ flex: 1 }}>
                    <h4 className="text-body font-medium">
                      {item.title || item.task || item.name || `Item ${index + 1}`}
                    </h4>
                    {item.description && (
                      <p className="text-caption text-secondary line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </Stack>

                  <Stack direction="horizontal" gap="sm" align="center">
                    {showStatus && item.status && (
                      <Badge 
                        variant={getStatusVariant(item.status) as any}
                        size="sm"
                      >
                        {item.status.replace('_', ' ')}
                      </Badge>
                    )}

                    {showAssignee && item.artist && item.artist !== 'Unassigned' && (
                      <Stack direction="horizontal" gap="xs" align="center">
                        <User size={12} />
                        <span className="text-caption text-secondary">
                          {item.artist}
                        </span>
                      </Stack>
                    )}

                    {showDueDate && (
                      <Stack direction="horizontal" gap="xs" align="center">
                        <Clock size={12} />
                        <span className="text-caption text-secondary">
                          {formatDate(item.deadline)}
                        </span>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </div>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}

export default ListWidget
