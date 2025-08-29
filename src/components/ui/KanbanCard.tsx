import React, { useCallback } from 'react'
import { clsx } from 'clsx'
import { Calendar, MessageCircle, Paperclip, Clock, AlertTriangle } from 'lucide-react'
import { KanbanCardProps } from '@/types/designSystem'
import Avatar from './Avatar'
import Badge from './Badge'
import { Stack } from '@/components/layout'

interface ExtendedKanbanCardProps extends KanbanCardProps {
  onDragStart?: (task: KanbanCardProps['task']) => void
  onDragEnd?: () => void
}

const KanbanCard = React.forwardRef<HTMLDivElement, ExtendedKanbanCardProps>(
  ({ 
    task,
    isDragging = false,
    onClick,
    onDragStart,
    onDragEnd,
    showDetails = true,
    compact = false,
    ...props 
  }, ref) => {
    
    // Handle card click
    const handleClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      onClick?.(task)
    }, [onClick, task])

    // Handle drag start
    const handleDragStart = useCallback((e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', task.id)
      onDragStart?.(task)
    }, [task, onDragStart])

    // Handle drag end
    const handleDragEnd = useCallback(() => {
      onDragEnd?.()
    }, [onDragEnd])

    // Get priority color
    const getPriorityColor = (priority?: string) => {
      switch (priority) {
        case 'urgent': return 'var(--semantic-danger)'
        case 'high': return 'var(--semantic-warning)'
        case 'medium': return 'var(--accent-blue)'
        case 'low': return 'var(--icon-quieter)'
        default: return 'var(--icon-quieter)'
      }
    }

    // Get priority variant for badge
    const getPriorityVariant = (priority?: string) => {
      switch (priority) {
        case 'urgent': return 'danger'
        case 'high': return 'warning'
        case 'medium': return 'info'
        case 'low': return 'default'
        default: return 'default'
      }
    }

    // Format due date
    const formatDueDate = (dateString?: string) => {
      if (!dateString) return null
      
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = date.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) {
        return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true }
      } else if (diffDays === 0) {
        return { text: 'Due today', isToday: true }
      } else if (diffDays === 1) {
        return { text: 'Due tomorrow', isTomorrow: true }
      } else if (diffDays <= 7) {
        return { text: `${diffDays}d left`, isThisWeek: true }
      } else {
        return { text: date.toLocaleDateString(), isFuture: true }
      }
    }

    const dueDateInfo = formatDueDate(task.dueDate)

    return (
      <div 
        ref={ref}
        className={clsx(
          'kanban-card',
          {
            'kanban-card--dragging': isDragging,
            'kanban-card--compact': compact,
            'kanban-card--clickable': onClick,
            'kanban-card--overdue': dueDateInfo?.isOverdue,
            'kanban-card--due-today': dueDateInfo?.isToday
          }
        )}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        {...props}
      >
        {/* Priority Indicator */}
        {task.priority && task.priority !== 'low' && (
          <div 
            className="kanban-card__priority-indicator"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          />
        )}

        {/* Card Content */}
        <div className="kanban-card__content">
          {/* Title */}
          <h4 className="kanban-card__title">
            {task.title}
          </h4>

          {/* Description */}
          {!compact && task.description && (
            <p className="kanban-card__description">
              {task.description}
            </p>
          )}

          {/* Labels */}
          {showDetails && task.labels && task.labels.length > 0 && (
            <div className="kanban-card__labels">
              <Stack direction="horizontal" gap="xs" wrap>
                {task.labels.slice(0, 3).map((label) => (
                  <Badge
                    key={label.id}
                    variant="default"
                    size="xs"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </Badge>
                ))}
                {task.labels.length > 3 && (
                  <Badge variant="default" size="xs">
                    +{task.labels.length - 3}
                  </Badge>
                )}
              </Stack>
            </div>
          )}

          {/* Card Footer - Minimal Design */}
          {showDetails && (
            <div className="kanban-card__footer">
              {/* Top Row: Department | Priority */}
              <div className="kanban-card__meta-row">
                <span className="kanban-card__department">
                  {task.projectId || 'General'}
                </span>
                {task.priority && (
                  <span className={clsx('kanban-card__priority-badge', `kanban-card__priority-badge--${task.priority}`)}>
                    {task.priority}
                  </span>
                )}
              </div>

              {/* Bottom Row: Duration | Avatar */}
              <div className="kanban-card__bottom-row">
                <div className="kanban-card__duration">
                  {task.estimatedHours && (
                    <>
                      <Clock size={10} />
                      <span>{task.estimatedHours}h</span>
                    </>
                  )}
                </div>

                <div className="kanban-card__avatar-section">
                  {task.assignee && (
                    <Avatar
                      src={task.assignee.avatar}
                      fallback={task.assignee.name}
                      size="xs"
                      alt={task.assignee.name}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drag Handle */}
        <div className="kanban-card__drag-handle" />
      </div>
    )
  }
)

KanbanCard.displayName = 'KanbanCard'

export default KanbanCard
