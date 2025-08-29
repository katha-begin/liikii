import React, { useState, useRef, useCallback } from 'react'
import { clsx } from 'clsx'
import { Plus, MoreHorizontal } from 'lucide-react'
import { KanbanBoardProps, KanbanTask, KanbanColumn } from '@/types/designSystem'
import KanbanColumnComponent from './KanbanColumn'
import Button from './Button'

const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ 
    columns = [],
    tasks = [],
    onTaskMove,
    onTaskClick,
    onColumnAdd,
    onColumnEdit,
    onColumnDelete,
    className,
    style,
    loading = false,
    maxHeight = '600px',
    showAddColumn = true,
    showColumnActions = true,
    ...props 
  }, ref) => {
    const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null)
    const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null)
    const [draggedOverIndex, setDraggedOverIndex] = useState<number>(-1)
    const boardRef = useRef<HTMLDivElement>(null)

    // Get tasks for a specific column
    const getColumnTasks = useCallback((columnId: string): KanbanTask[] => {
      const column = columns.find(col => col.id === columnId)
      if (!column) return []
      
      return column.taskIds
        .map(taskId => tasks.find(task => task.id === taskId))
        .filter((task): task is KanbanTask => task !== undefined)
        .sort((a, b) => {
          // Sort by priority and then by creation date
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          const aPriority = priorityOrder[a.priority || 'medium']
          const bPriority = priorityOrder[b.priority || 'medium']
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority
          }
          
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
    }, [columns, tasks])

    // Handle drag start
    const handleDragStart = useCallback((task: KanbanTask) => {
      setDraggedTask(task)
    }, [])

    // Handle drag end
    const handleDragEnd = useCallback(() => {
      if (draggedTask && draggedOverColumn && draggedOverColumn !== draggedTask.status) {
        const sourceColumn = columns.find(col => col.id === draggedTask.status)
        const targetColumn = columns.find(col => col.id === draggedOverColumn)

        if (sourceColumn && targetColumn) {
          // Enhanced logging for drag-and-drop operations
          console.group('🔄 Kanban Task Move Operation')
          console.log('📋 Task being moved:', {
            id: draggedTask.id,
            title: draggedTask.title,
            priority: draggedTask.priority,
            assignee: draggedTask.assignee?.name
          })
          console.log('📤 Source column:', {
            id: sourceColumn.id,
            title: sourceColumn.title,
            taskCount: sourceColumn.taskIds.length
          })
          console.log('📥 Destination column:', {
            id: targetColumn.id,
            title: targetColumn.title,
            taskCount: targetColumn.taskIds.length
          })
          console.log('📍 New position index:', draggedOverIndex >= 0 ? draggedOverIndex : 0)
          console.groupEnd()

          // Show success notification
          console.log(`✅ Successfully moved "${draggedTask.title}" from "${sourceColumn.title}" to "${targetColumn.title}"`)

          onTaskMove?.(
            draggedTask.id,
            sourceColumn.id,
            targetColumn.id,
            draggedOverIndex >= 0 ? draggedOverIndex : 0
          )
        }
      }

      setDraggedTask(null)
      setDraggedOverColumn(null)
      setDraggedOverIndex(-1)
    }, [draggedTask, draggedOverColumn, draggedOverIndex, columns, onTaskMove])

    // Handle drag over column
    const handleDragOverColumn = useCallback((columnId: string, index: number) => {
      setDraggedOverColumn(columnId)
      setDraggedOverIndex(index)
    }, [])

    // Handle task click
    const handleTaskClick = useCallback((task: KanbanTask) => {
      onTaskClick?.(task)
    }, [onTaskClick])

    // Handle add new column
    const handleAddColumn = useCallback(() => {
      const newColumn: Omit<KanbanColumn, 'id'> = {
        title: 'New Column',
        taskIds: [],
        order: columns.length,
        color: '#6B7280'
      }
      onColumnAdd?.(newColumn)
    }, [columns.length, onColumnAdd])

    if (loading) {
      return (
        <div 
          ref={ref}
          className={clsx('kanban-board', 'kanban-board--loading', className)}
          style={style}
          {...props}
        >
          <div className="kanban-board__loading">
            <div className="loading-spinner" />
            <span>Loading board...</span>
          </div>
        </div>
      )
    }

    return (
      <div 
        ref={ref}
        className={clsx('kanban-board', className)}
        style={{ ...style, maxHeight }}
        {...props}
      >
        <div className="kanban-board__container">
          <div className="kanban-board__columns">
            {columns
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <KanbanColumnComponent
                  key={column.id}
                  column={column}
                  tasks={getColumnTasks(column.id)}
                  onTaskMove={(taskId, newIndex) => handleDragOverColumn(column.id, newIndex)}
                  onTaskClick={handleTaskClick}
                  onTaskDragStart={handleDragStart}
                  onTaskDragEnd={handleDragEnd}
                  onColumnEdit={onColumnEdit ? (updates) => onColumnEdit(column.id, updates) : undefined}
                  onColumnDelete={onColumnDelete ? () => onColumnDelete(column.id) : undefined}
                  showActions={showColumnActions}
                  maxHeight={maxHeight}
                  isDraggedOver={draggedOverColumn === column.id}
                  draggedTask={draggedTask}
                />
              ))}
            
            {showAddColumn && (
              <div className="kanban-board__add-column">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus size={14} />}
                  onClick={handleAddColumn}
                  className="kanban-board__add-column-btn"
                >
                  Add Column
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

KanbanBoard.displayName = 'KanbanBoard'

export default KanbanBoard
