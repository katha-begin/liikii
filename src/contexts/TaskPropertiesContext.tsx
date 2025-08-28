// Task Properties Context - Linear-style task property management
import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { UITask, StatusHistoryEntry } from '@/types/database'

// Linear-compatible property update types
export type TaskPropertyUpdate = {
  taskId: string
  property: keyof UITask
  value: any
  previousValue?: any
}

export type OptimisticUpdate = {
  id: string
  taskId: string
  property: keyof UITask
  value: any
  previousValue: any
  timestamp: number
  status: 'pending' | 'success' | 'error'
}

interface TaskPropertiesContextType {
  // Optimistic updates state
  pendingUpdates: OptimisticUpdate[]
  
  // Linear-style property update methods
  updateTaskProperty: (taskId: string, property: keyof UITask, value: any) => Promise<void>
  updateTaskStatus: (taskId: string, status: UITask['status'], note?: string) => Promise<void>
  updateTaskPriority: (taskId: string, priority: UITask['priority']) => Promise<void>
  updateTaskAssignees: (taskId: string, assignees: string[]) => Promise<void>
  updateTaskLabels: (taskId: string, labels: string[]) => Promise<void>
  updateTaskDates: (taskId: string, startDate?: string, dueDate?: string) => Promise<void>
  updateTaskDateRange: (taskId: string, range: { startDate: string | null; endDate: string | null }) => Promise<void>
  linkTasks: (taskId: string, linkedTaskIds: string[]) => Promise<void>
  
  // Rollback capability
  rollbackUpdate: (updateId: string) => Promise<void>
  
  // Property validation
  validateProperty: (property: keyof UITask, value: any) => { valid: boolean; error?: string }
  
  // Linear-style interaction helpers
  getPropertyDisplayValue: (task: UITask, property: keyof UITask) => string
  getPropertyEditOptions: (property: keyof UITask) => any[]
}

const TaskPropertiesContext = createContext<TaskPropertiesContextType | undefined>(undefined)

export const useTaskProperties = () => {
  const context = useContext(TaskPropertiesContext)
  if (!context) {
    throw new Error('useTaskProperties must be used within a TaskPropertiesProvider')
  }
  return context
}

interface TaskPropertiesProviderProps {
  children: React.ReactNode
}

export const TaskPropertiesProvider: React.FC<TaskPropertiesProviderProps> = ({ children }) => {
  const [pendingUpdates, setPendingUpdates] = useState<OptimisticUpdate[]>([])
  const updateIdCounter = useRef(0)

  // Generate unique update ID
  const generateUpdateId = useCallback(() => {
    return `update_${Date.now()}_${++updateIdCounter.current}`
  }, [])

  // Linear-style optimistic update with rollback
  const updateTaskProperty = useCallback(async (
    taskId: string, 
    property: keyof UITask, 
    value: any
  ): Promise<void> => {
    const updateId = generateUpdateId()
    
    // Get current value for rollback
    // In a real implementation, this would come from the current task state
    const previousValue = null // TODO: Get from current task state
    
    // Create optimistic update
    const optimisticUpdate: OptimisticUpdate = {
      id: updateId,
      taskId,
      property,
      value,
      previousValue,
      timestamp: Date.now(),
      status: 'pending'
    }
    
    // Add to pending updates (optimistic UI)
    setPendingUpdates(prev => [...prev, optimisticUpdate])
    
    try {
      // Simulate API call with Linear's 200ms response time
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // TODO: Actual API call would go here
      // await dataService.updateTaskProperty(taskId, property, value)
      
      // Mark as successful
      setPendingUpdates(prev => 
        prev.map(update => 
          update.id === updateId 
            ? { ...update, status: 'success' as const }
            : update
        )
      )
      
      // Remove successful update after brief delay (Linear's pattern)
      setTimeout(() => {
        setPendingUpdates(prev => prev.filter(update => update.id !== updateId))
      }, 1000)
      
    } catch (error) {
      // Mark as error and keep for manual retry/rollback
      setPendingUpdates(prev => 
        prev.map(update => 
          update.id === updateId 
            ? { ...update, status: 'error' as const }
            : update
        )
      )
      throw error
    }
  }, [generateUpdateId])

  // Specialized update methods following Linear's patterns
  const updateTaskStatus = useCallback(async (
    taskId: string, 
    status: UITask['status'], 
    note?: string
  ): Promise<void> => {
    // Add to status history
    const statusEntry: StatusHistoryEntry = {
      status,
      changed_at: new Date().toISOString(),
      changed_by: 'current_user', // TODO: Get from auth context
      note
    }
    
    await updateTaskProperty(taskId, 'status', status)
    // TODO: Also update status_history array
  }, [updateTaskProperty])

  const updateTaskPriority = useCallback(async (
    taskId: string, 
    priority: UITask['priority']
  ): Promise<void> => {
    await updateTaskProperty(taskId, 'priority', priority)
  }, [updateTaskProperty])

  const updateTaskAssignees = useCallback(async (
    taskId: string, 
    assignees: string[]
  ): Promise<void> => {
    await updateTaskProperty(taskId, 'assignees', assignees)
  }, [updateTaskProperty])

  const updateTaskLabels = useCallback(async (
    taskId: string, 
    labels: string[]
  ): Promise<void> => {
    await updateTaskProperty(taskId, 'labels', labels)
  }, [updateTaskProperty])

  const updateTaskDates = useCallback(async (
    taskId: string,
    startDate?: string,
    dueDate?: string
  ): Promise<void> => {
    if (startDate !== undefined) {
      await updateTaskProperty(taskId, 'start_date', startDate)
    }
    if (dueDate !== undefined) {
      await updateTaskProperty(taskId, 'deadline', dueDate)
    }
  }, [updateTaskProperty])

  const updateTaskDateRange = useCallback(async (
    taskId: string,
    range: { startDate: string | null; endDate: string | null }
  ): Promise<void> => {
    // Calculate estimated hours based on date range (8 hours per business day)
    let estimatedHours = 0
    if (range.startDate && range.endDate) {
      const start = new Date(range.startDate)
      const end = new Date(range.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      // Calculate business days (excluding weekends)
      let businessDays = 0
      const currentDate = new Date(start)
      while (currentDate <= end) {
        const dayOfWeek = currentDate.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
          businessDays++
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Estimate 8 hours per business day
      estimatedHours = businessDays * 8
    }

    // Update dates and estimated hours simultaneously for better UX
    const promises = []
    if (range.startDate !== undefined) {
      promises.push(updateTaskProperty(taskId, 'start_date', range.startDate))
    }
    if (range.endDate !== undefined) {
      promises.push(updateTaskProperty(taskId, 'deadline', range.endDate))
    }
    if (estimatedHours > 0) {
      promises.push(updateTaskProperty(taskId, 'estimated_duration_hours', estimatedHours))
    }
    await Promise.all(promises)
  }, [updateTaskProperty])

  const linkTasks = useCallback(async (
    taskId: string, 
    linkedTaskIds: string[]
  ): Promise<void> => {
    await updateTaskProperty(taskId, 'linked_task_ids', linkedTaskIds)
  }, [updateTaskProperty])

  // Rollback failed or unwanted updates
  const rollbackUpdate = useCallback(async (updateId: string): Promise<void> => {
    const update = pendingUpdates.find(u => u.id === updateId)
    if (!update) return
    
    // Revert to previous value
    await updateTaskProperty(update.taskId, update.property, update.previousValue)
    
    // Remove the failed update
    setPendingUpdates(prev => prev.filter(u => u.id !== updateId))
  }, [pendingUpdates, updateTaskProperty])

  // Property validation following Linear's patterns
  const validateProperty = useCallback((
    property: keyof UITask, 
    value: any
  ): { valid: boolean; error?: string } => {
    switch (property) {
      case 'priority':
        if (!['urgent', 'high', 'medium', 'low', 'none'].includes(value)) {
          return { valid: false, error: 'Invalid priority level' }
        }
        break
      case 'status':
        if (!['not_started', 'in_progress', 'review', 'approved', 'final'].includes(value)) {
          return { valid: false, error: 'Invalid status' }
        }
        break
      case 'start_date':
      case 'deadline':
        if (value && isNaN(Date.parse(value))) {
          return { valid: false, error: 'Invalid date format' }
        }
        break
      case 'assignees':
        if (!Array.isArray(value)) {
          return { valid: false, error: 'Assignees must be an array' }
        }
        break
      case 'labels':
        if (!Array.isArray(value)) {
          return { valid: false, error: 'Labels must be an array' }
        }
        break
    }
    return { valid: true }
  }, [])

  // Display helpers for Linear-style UI
  const getPropertyDisplayValue = useCallback((
    task: UITask, 
    property: keyof UITask
  ): string => {
    const value = task[property]
    
    switch (property) {
      case 'priority':
        return value === 'none' ? 'No priority' : String(value).charAt(0).toUpperCase() + String(value).slice(1)
      case 'status':
        return String(value).replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
      case 'assignees':
        return Array.isArray(value) ? `${value.length} assignee${value.length !== 1 ? 's' : ''}` : 'Unassigned'
      case 'labels':
        return Array.isArray(value) ? `${value.length} label${value.length !== 1 ? 's' : ''}` : 'No labels'
      case 'start_date':
      case 'deadline':
        return value ? new Date(value).toLocaleDateString() : 'Not set'
      default:
        return String(value || '')
    }
  }, [])

  // Get options for property editing dropdowns
  const getPropertyEditOptions = useCallback((property: keyof UITask): any[] => {
    switch (property) {
      case 'priority':
        return [
          { value: 'urgent', label: 'Urgent', color: 'var(--semantic-danger)' },
          { value: 'high', label: 'High', color: 'var(--semantic-warning)' },
          { value: 'medium', label: 'Medium', color: 'var(--accent-blue)' },
          { value: 'low', label: 'Low', color: 'var(--text-secondary)' },
          { value: 'none', label: 'No priority', color: 'var(--text-secondary)' }
        ]
      case 'status':
        return [
          { value: 'not_started', label: 'Not Started', color: 'var(--text-secondary)' },
          { value: 'in_progress', label: 'In Progress', color: 'var(--accent-blue)' },
          { value: 'review', label: 'Review', color: 'var(--semantic-warning)' },
          { value: 'approved', label: 'Approved', color: 'var(--semantic-success)' },
          { value: 'final', label: 'Final', color: 'var(--semantic-success)' }
        ]
      case 'task_type':
        return [
          { value: 'shot', label: 'Shot Task', color: 'var(--accent-blue)' },
          { value: 'asset', label: 'Asset Task', color: 'var(--accent-mint)' }
        ]
      case 'asset_category':
        return [
          { value: 'character', label: 'Character', color: 'var(--accent-mint)' },
          { value: 'prop', label: 'Prop', color: 'var(--accent-mint)' },
          { value: 'set', label: 'Set', color: 'var(--accent-mint)' },
          { value: 'environment', label: 'Environment', color: 'var(--accent-mint)' }
        ]
      default:
        return []
    }
  }, [])

  const contextValue: TaskPropertiesContextType = {
    pendingUpdates,
    updateTaskProperty,
    updateTaskStatus,
    updateTaskPriority,
    updateTaskAssignees,
    updateTaskLabels,
    updateTaskDates,
    updateTaskDateRange,
    linkTasks,
    rollbackUpdate,
    validateProperty,
    getPropertyDisplayValue,
    getPropertyEditOptions
  }

  return (
    <TaskPropertiesContext.Provider value={contextValue}>
      {children}
    </TaskPropertiesContext.Provider>
  )
}
