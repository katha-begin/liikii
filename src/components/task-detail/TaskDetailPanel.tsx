// Task Detail Panel - Slide-out panel for comprehensive task information
import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { useTaskDetail } from '@/contexts/TaskDetailContext'
import { TaskDetailView } from './TaskDetailView'
import { TaskStatusSelector } from './TaskStatusSelector'
import { TaskComments } from './TaskComments'
import './TaskDetailPanel.css'

export const TaskDetailPanel: React.FC = () => {
  const { isOpen, selectedTask, closeTaskDetail } = useTaskDetail()

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeTaskDetail()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeTaskDetail])

  if (!isOpen || !selectedTask) {
    return null
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="task-detail-backdrop"
        onClick={closeTaskDetail}
      />
      
      {/* Panel */}
      <div className={`task-detail-panel ${isOpen ? 'open' : ''}`}>
        {/* Panel Header */}
        <div className="task-detail-header">
          <div className="task-detail-header-content">
            <h2 className="task-detail-title">Task Details</h2>
            <button
              className="task-detail-close-btn"
              onClick={closeTaskDetail}
              aria-label="Close task details"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Panel Content */}
        <div className="task-detail-content">
          {/* Task Information */}
          <div className="task-detail-section">
            <TaskDetailView task={selectedTask} />
          </div>

          {/* Status Update */}
          <div className="task-detail-section">
            <h3 className="task-detail-section-title">Status</h3>
            <TaskStatusSelector task={selectedTask} />
          </div>

          {/* Comments */}
          <div className="task-detail-section task-detail-comments-section">
            <h3 className="task-detail-section-title">Comments</h3>
            <TaskComments taskId={selectedTask.id} />
          </div>
        </div>
      </div>
    </>
  )
}
