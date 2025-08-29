import React, { useState, useCallback } from 'react'
import KanbanBoard from '../ui/KanbanBoard'
import { KanbanColumn, KanbanTask } from '@/types/designSystem'

interface KanbanWidgetProps {
  title?: string
  columns?: KanbanColumn[]
  tasks?: KanbanTask[]
  showAddColumn?: boolean
  showColumnActions?: boolean
  maxHeight?: string | number
  onTaskMove?: (taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void
  onTaskClick?: (task: KanbanTask) => void
  onColumnAdd?: (column: Omit<KanbanColumn, 'id'>) => void
  onColumnEdit?: (columnId: string, updates: Partial<KanbanColumn>) => void
  onColumnDelete?: (columnId: string) => void
  style?: React.CSSProperties
  className?: string
}

const KanbanWidget: React.FC<KanbanWidgetProps> = ({
  title,
  columns = [],
  tasks = [],
  showAddColumn = true,
  showColumnActions = true,
  maxHeight = '600px',
  onTaskMove,
  onTaskClick,
  onColumnAdd,
  onColumnEdit,
  onColumnDelete,
  style,
  className
}) => {
  // Default columns if none provided
  const defaultColumns: KanbanColumn[] = [
    {
      id: 'not_started',
      title: 'Not Started',
      color: '#6B7280',
      taskIds: [],
      order: 0
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: '#3B82F6',
      taskIds: [],
      order: 1
    },
    {
      id: 'review',
      title: 'Review',
      color: '#F59E0B',
      taskIds: [],
      order: 2
    },
    {
      id: 'approved',
      title: 'Approved',
      color: '#10B981',
      taskIds: [],
      order: 3
    }
  ]

  // Default sample tasks if none provided
  const defaultTasks: KanbanTask[] = [
    {
      id: 'task-1',
      title: 'Character Animation - Hero Walk Cycle',
      description: 'Create walk cycle animation for main character',
      status: 'not_started',
      priority: 'high',
      assignee: {
        id: 'user-1',
        name: 'John Doe',
        avatar: undefined
      },
      labels: [
        { id: 'label-1', name: 'Animation', color: '#3B82F6' },
        { id: 'label-2', name: 'Character', color: '#10B981' }
      ],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedHours: 16,
      comments: 2,
      attachments: 1
    },
    {
      id: 'task-2',
      title: 'Environment Modeling - Forest Scene',
      description: 'Model detailed forest environment for Act 2',
      status: 'in_progress',
      priority: 'medium',
      assignee: {
        id: 'user-2',
        name: 'Jane Smith',
        avatar: undefined
      },
      labels: [
        { id: 'label-3', name: 'Modeling', color: '#F59E0B' },
        { id: 'label-4', name: 'Environment', color: '#8B5CF6' }
      ],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedHours: 24,
      comments: 5,
      attachments: 3
    },
    {
      id: 'task-3',
      title: 'Lighting Setup - Interior Scenes',
      description: 'Set up lighting for all interior scenes in sequence 010',
      status: 'review',
      priority: 'urgent',
      assignee: {
        id: 'user-3',
        name: 'Mike Johnson',
        avatar: undefined
      },
      labels: [
        { id: 'label-5', name: 'Lighting', color: '#EF4444' },
        { id: 'label-6', name: 'Interior', color: '#06B6D4' }
      ],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedHours: 12,
      comments: 8,
      attachments: 0
    }
  ]

  // Simple state for task management
  const [localTasks, setLocalTasks] = useState<KanbanTask[]>(tasks.length > 0 ? tasks : defaultTasks)

  // Update local tasks when props change
  React.useEffect(() => {
    if (tasks.length > 0) {
      setLocalTasks(tasks)
    }
  }, [tasks])

  // Use provided data or defaults
  const boardColumns = columns.length > 0 ? columns : defaultColumns
  const boardTasks = localTasks

  // Populate column task IDs based on task status
  const populatedColumns = boardColumns.map(column => ({
    ...column,
    taskIds: boardTasks
      .filter(task => task.status === column.id)
      .map(task => task.id)
  }))

  // Handle task movement
  const handleTaskMove = useCallback((taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    console.group('🎯 KanbanWidget: handleTaskMove called')
    console.log('📋 Parameters:', { taskId, fromColumnId, toColumnId, newIndex })

    // Update local task state immediately for UI responsiveness
    setLocalTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          console.log('✅ Updating task status:', {
            taskId,
            oldStatus: task.status,
            newStatus: toColumnId
          })
          return {
            ...task,
            status: toColumnId // Update task status to match destination column
          }
        }
        return task
      })

      console.log('📊 Tasks by status after update:', {
        not_started: updatedTasks.filter(t => t.status === 'not_started').length,
        in_progress: updatedTasks.filter(t => t.status === 'in_progress').length,
        review: updatedTasks.filter(t => t.status === 'review').length,
        approved: updatedTasks.filter(t => t.status === 'approved').length
      })

      console.groupEnd()
      return updatedTasks
    })

    // Call external handler if provided
    onTaskMove?.(taskId, fromColumnId, toColumnId, newIndex)
  }, [onTaskMove])

  // Handle task click
  const handleTaskClick = useCallback((task: KanbanTask) => {
    console.log('Task clicked:', task)
    onTaskClick?.(task)
  }, [onTaskClick])

  // Handle column add
  const handleColumnAdd = useCallback((column: Omit<KanbanColumn, 'id'>) => {
    console.log('Column added:', column)
    onColumnAdd?.(column)
  }, [onColumnAdd])

  // Handle column edit
  const handleColumnEdit = useCallback((columnId: string, updates: Partial<KanbanColumn>) => {
    console.log('Column edited:', { columnId, updates })
    onColumnEdit?.(columnId, updates)
  }, [onColumnEdit])

  // Handle column delete
  const handleColumnDelete = useCallback((columnId: string) => {
    console.log('Column deleted:', columnId)
    onColumnDelete?.(columnId)
  }, [onColumnDelete])

  return (
    <div style={style} className={className}>
      {title && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            {title}
          </h3>
        </div>
      )}
      
      <KanbanBoard
        columns={populatedColumns}
        tasks={boardTasks}
        onTaskMove={handleTaskMove}
        onTaskClick={handleTaskClick}
        onColumnAdd={handleColumnAdd}
        onColumnEdit={handleColumnEdit}
        onColumnDelete={handleColumnDelete}
        showAddColumn={showAddColumn}
        showColumnActions={showColumnActions}
        maxHeight={maxHeight}
      />
    </div>
  )
}

export default KanbanWidget
