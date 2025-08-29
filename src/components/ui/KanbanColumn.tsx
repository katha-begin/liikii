import React, { useState, useRef, useCallback } from 'react'
import { clsx } from 'clsx'
import { MoreHorizontal, Plus, Edit2, Trash2, ChevronRight, ChevronDown } from 'lucide-react'
import { KanbanColumnProps, KanbanTask } from '@/types/designSystem'
import KanbanCard from './KanbanCard'
import Button from './Button'
import Dropdown from './Dropdown'

interface ExtendedKanbanColumnProps extends KanbanColumnProps {
  onTaskDragStart?: (task: KanbanTask) => void
  onTaskDragEnd?: () => void
  isDraggedOver?: boolean
  draggedTask?: KanbanTask | null
}

const KanbanColumn = React.forwardRef<HTMLDivElement, ExtendedKanbanColumnProps>(
  ({ 
    column,
    tasks = [],
    onTaskMove,
    onTaskClick,
    onTaskDragStart,
    onTaskDragEnd,
    onColumnEdit,
    onColumnDelete,
    showActions = true,
    maxHeight = '600px',
    isDraggedOver = false,
    draggedTask,
    ...props 
  }, ref) => {
    const [isCollapsed, setIsCollapsed] = useState(column.collapsed || false)
    const [dragOverIndex, setDragOverIndex] = useState<number>(-1)
    const columnRef = useRef<HTMLDivElement>(null)
    const tasksRef = useRef<HTMLDivElement>(null)

    // Handle drag over
    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (!draggedTask || !tasksRef.current) return

      const rect = tasksRef.current.getBoundingClientRect()
      const y = e.clientY - rect.top
      const cardHeight = 120 // Approximate card height
      const index = Math.floor(y / cardHeight)
      
      setDragOverIndex(Math.max(0, Math.min(index, tasks.length)))
      onTaskMove?.(draggedTask.id, index)
    }, [draggedTask, tasks.length, onTaskMove])

    // Handle drop
    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOverIndex(-1)
      onTaskDragEnd?.()
    }, [onTaskDragEnd])

    // Handle drag leave
    const handleDragLeave = useCallback((e: React.DragEvent) => {
      if (!columnRef.current?.contains(e.relatedTarget as Node)) {
        setDragOverIndex(-1)
      }
    }, [])

    // Toggle column collapse
    const handleToggleCollapse = useCallback(() => {
      const newCollapsed = !isCollapsed
      setIsCollapsed(newCollapsed)
      onColumnEdit?.({ collapsed: newCollapsed })
    }, [isCollapsed, onColumnEdit])

    // Get WIP limit status
    const getWipStatus = () => {
      if (!column.wipLimit) return 'normal'
      if (tasks.length > column.wipLimit) return 'exceeded'
      if (tasks.length === column.wipLimit) return 'at-limit'
      return 'normal'
    }

    const wipStatus = getWipStatus()

    // Column actions dropdown items
    const columnActions = [
      {
        id: 'edit',
        label: 'Edit Column',
        icon: <Edit2 size={16} />,
        onClick: () => {
          const newTitle = prompt('Enter new column title:', column.title)
          if (newTitle && newTitle !== column.title) {
            onColumnEdit?.({ title: newTitle })
          }
        }
      },
      {
        id: 'set-wip',
        label: 'Set WIP Limit',
        icon: <Plus size={16} />,
        onClick: () => {
          const wipLimit = prompt('Enter WIP limit (0 for no limit):', String(column.wipLimit || 0))
          if (wipLimit !== null) {
            const limit = parseInt(wipLimit, 10)
            onColumnEdit?.({ wipLimit: limit > 0 ? limit : undefined })
          }
        }
      },
      {
        id: 'separator',
        label: '',
        separator: true
      },
      {
        id: 'delete',
        label: 'Delete Column',
        icon: <Trash2 size={16} />,
        onClick: () => {
          if (confirm(`Are you sure you want to delete "${column.title}"? This action cannot be undone.`)) {
            onColumnDelete?.()
          }
        }
      }
    ]

    return (
      <div 
        ref={ref}
        className={clsx(
          'kanban-column',
          {
            'kanban-column--collapsed': isCollapsed,
            'kanban-column--drag-over': isDraggedOver,
            'kanban-column--wip-exceeded': wipStatus === 'exceeded',
            'kanban-column--wip-at-limit': wipStatus === 'at-limit'
          }
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        {...props}
      >
        {/* Column Header */}
        <div className="kanban-column__header">
          <div className="kanban-column__title-section">
            <button
              className="kanban-column__title-btn"
              onClick={handleToggleCollapse}
              title={isCollapsed ? 'Expand column' : 'Collapse column'}
            >
              <div className="kanban-column__title-content">
                {isCollapsed ? (
                  <ChevronRight size={12} className="kanban-column__chevron" />
                ) : (
                  <ChevronDown size={12} className="kanban-column__chevron" />
                )}
                <h3 className="kanban-column__title" title={isCollapsed ? `${column.title} (${tasks.length} tasks)` : undefined}>
                  {isCollapsed ? column.title.substring(0, 2) : column.title}
                </h3>
              </div>
              {!isCollapsed && (
                <div className="kanban-column__count">
                  <span className={clsx('kanban-column__task-count', {
                    'kanban-column__task-count--exceeded': wipStatus === 'exceeded'
                  })}>
                    {tasks.length}
                    {column.wipLimit && ` / ${column.wipLimit}`}
                  </span>
                </div>
              )}
            </button>
          </div>

          {showActions && onColumnEdit && (
            <div className="kanban-column__actions">
              <Dropdown
                trigger="⋯"
                items={columnActions}
                placement="bottom-end"
              />
            </div>
          )}
        </div>

        {/* Column Content */}
        {!isCollapsed && (
          <div 
            ref={tasksRef}
            className="kanban-column__content"
            style={{ maxHeight: typeof maxHeight === 'string' ? maxHeight : `${maxHeight}px` }}
          >
            <div className="kanban-column__tasks">
              {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  {/* Drop zone indicator */}
                  {isDraggedOver && dragOverIndex === index && (
                    <div className="kanban-column__drop-zone" />
                  )}
                  
                  <KanbanCard
                    task={task}
                    onClick={onTaskClick}
                    onDragStart={onTaskDragStart}
                    onDragEnd={onTaskDragEnd}
                    isDragging={draggedTask?.id === task.id}
                  />
                </React.Fragment>
              ))}
              
              {/* Final drop zone */}
              {isDraggedOver && dragOverIndex >= tasks.length && (
                <div className="kanban-column__drop-zone" />
              )}
            </div>

            {/* Empty state */}
            {tasks.length === 0 && (
              <div className="kanban-column__empty">
                <p className="text-body text-secondary">
                  No tasks in this column
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

KanbanColumn.displayName = 'KanbanColumn'

export default KanbanColumn
