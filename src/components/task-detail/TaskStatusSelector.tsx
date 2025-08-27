// Task Status Selector - Interface for updating task status
import React, { useState } from 'react'
import { Check, Clock, Play, Square, AlertCircle } from 'lucide-react'
import { UITask } from '@/types/database'
import { useTaskDetail } from '@/contexts/TaskDetailContext'
import { mockDataService } from '@/services/MockDataService'
import './TaskStatusSelector.css'

interface TaskStatusSelectorProps {
  task: UITask
}

const statusOptions = [
  {
    value: 'Not Started',
    label: 'Not Started',
    icon: Square,
    color: 'var(--color-text-tertiary)'
  },
  {
    value: 'In Progress',
    label: 'In Progress',
    icon: Play,
    color: 'var(--color-status-warning)'
  },
  {
    value: 'Review',
    label: 'Review',
    icon: Clock,
    color: 'var(--color-status-info)'
  },
  {
    value: 'Completed',
    label: 'Completed',
    icon: Check,
    color: 'var(--color-status-success)'
  },
  {
    value: 'Blocked',
    label: 'Blocked',
    icon: AlertCircle,
    color: 'var(--color-status-error)'
  }
]

export const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({ task }) => {
  const { updateSelectedTask } = useTaskDetail()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === task.status || isUpdating) return

    setIsUpdating(true)
    try {
      const updatedTask = await mockDataService.updateTaskStatus(task.id, newStatus)
      if (updatedTask) {
        updateSelectedTask(updatedTask)
      }
    } catch (error) {
      console.error('Failed to update task status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getCurrentStatus = () => {
    return statusOptions.find(option => 
      option.value.toLowerCase() === task.status.toLowerCase()
    ) || statusOptions[0]
  }

  const currentStatus = getCurrentStatus()

  return (
    <div className="task-status-selector">
      <div className="task-status-current">
        <div className="task-status-current-indicator">
          <currentStatus.icon 
            size={16} 
            style={{ color: currentStatus.color }}
          />
          <span style={{ color: currentStatus.color }}>
            {currentStatus.label}
          </span>
        </div>
      </div>

      <div className="task-status-options">
        {statusOptions.map((option) => {
          const isActive = option.value.toLowerCase() === task.status.toLowerCase()
          const IconComponent = option.icon

          return (
            <button
              key={option.value}
              className={`task-status-option ${isActive ? 'active' : ''}`}
              onClick={() => handleStatusChange(option.value)}
              disabled={isUpdating || isActive}
              style={{
                '--status-color': option.color
              } as React.CSSProperties}
            >
              <IconComponent size={16} />
              <span>{option.label}</span>
              {isActive && <Check size={14} className="task-status-check" />}
            </button>
          )
        })}
      </div>

      {isUpdating && (
        <div className="task-status-updating">
          <div className="task-status-spinner" />
          <span>Updating status...</span>
        </div>
      )}
    </div>
  )
}
