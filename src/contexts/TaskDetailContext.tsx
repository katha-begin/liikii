// Task Detail Panel Context - Manages panel state and selected task
import React, { createContext, useContext, useState, useCallback } from 'react'
import { UITask } from '@/types/database'

interface TaskDetailContextType {
  // Panel state
  isOpen: boolean
  selectedTask: UITask | null
  
  // Actions
  openTaskDetail: (task: UITask) => void
  closeTaskDetail: () => void
  updateSelectedTask: (task: UITask) => void
}

const TaskDetailContext = createContext<TaskDetailContextType | undefined>(undefined)

export const useTaskDetail = () => {
  const context = useContext(TaskDetailContext)
  if (!context) {
    throw new Error('useTaskDetail must be used within a TaskDetailProvider')
  }
  return context
}

interface TaskDetailProviderProps {
  children: React.ReactNode
}

export const TaskDetailProvider: React.FC<TaskDetailProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<UITask | null>(null)

  const openTaskDetail = useCallback((task: UITask) => {
    setSelectedTask(task)
    setIsOpen(true)
  }, [])

  const closeTaskDetail = useCallback(() => {
    setIsOpen(false)
    // Keep selectedTask for a moment to allow smooth closing animation
    setTimeout(() => setSelectedTask(null), 300)
  }, [])

  const updateSelectedTask = useCallback((task: UITask) => {
    setSelectedTask(task)
  }, [])

  const value: TaskDetailContextType = {
    isOpen,
    selectedTask,
    openTaskDetail,
    closeTaskDetail,
    updateSelectedTask
  }

  return (
    <TaskDetailContext.Provider value={value}>
      {children}
    </TaskDetailContext.Provider>
  )
}
