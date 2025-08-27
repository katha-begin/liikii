// Task Detail View - Comprehensive task information display
import React from 'react'
import { Calendar, User, Flag, Clock, Folder } from 'lucide-react'
import { UITask } from '@/types/database'
import Badge from '@/components/ui/Badge'
import './TaskDetailView.css'

interface TaskDetailViewProps {
  task: UITask
}

export const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'var(--color-status-error)'
      case 'medium':
        return 'var(--color-status-warning)'
      case 'low':
        return 'var(--color-status-success)'
      default:
        return 'var(--color-text-secondary)'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'var(--semantic-success)'
      case 'in progress':
      case 'active':
        return 'var(--semantic-warning)'
      case 'blocked':
      case 'on hold':
        return 'var(--semantic-danger)'
      default:
        return 'var(--text-secondary)'
    }
  }

  return (
    <div className="task-detail-view">
      {/* Task Title and Description */}
      <div className="task-detail-main">
        <h1 className="task-detail-task-title">{task.title}</h1>
        <p className="task-detail-task-id">{task.id}</p>
        
        {task.milestone_note && (
          <div className="task-detail-description">
            <p>{task.milestone_note}</p>
          </div>
        )}
      </div>

      {/* Task Metadata */}
      <div className="task-detail-metadata">
        {/* Status */}
        <div className="task-detail-field">
          <div className="task-detail-field-label">
            <Flag size={16} />
            Status
          </div>
          <Badge
            variant="default"
            style={{
              borderColor: getStatusColor(task.status),
              color: getStatusColor(task.status)
            }}
          >
            {task.status}
          </Badge>
        </div>

        {/* Priority */}
        {task.priority && (
          <div className="task-detail-field">
            <div className="task-detail-field-label">
              <Flag size={16} />
              Priority
            </div>
            <Badge
              variant="default"
              style={{
                borderColor: getPriorityColor(task.priority),
                color: getPriorityColor(task.priority)
              }}
            >
              {task.priority}
            </Badge>
          </div>
        )}

        {/* Assignee */}
        {task.assignee && (
          <div className="task-detail-field">
            <div className="task-detail-field-label">
              <User size={16} />
              Assignee
            </div>
            <div className="task-detail-field-value">{task.assignee}</div>
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className="task-detail-field">
            <div className="task-detail-field-label">
              <Calendar size={16} />
              Due Date
            </div>
            <div className="task-detail-field-value">{formatDate(task.dueDate)}</div>
          </div>
        )}

        {/* Project Information */}
        <div className="task-detail-field">
          <div className="task-detail-field-label">
            <Folder size={16} />
            Project
          </div>
          <div className="task-detail-field-value">{task.projectName || 'Unknown Project'}</div>
        </div>

        {/* Task Details */}
        {task.task && (
          <div className="task-detail-field">
            <div className="task-detail-field-label">
              Task Type
            </div>
            <div className="task-detail-field-value">{task.task}</div>
          </div>
        )}

        {/* Episode/Sequence/Shot */}
        {(task.episode || task.sequence || task.shot) && (
          <div className="task-detail-field">
            <div className="task-detail-field-label">
              Location
            </div>
            <div className="task-detail-field-value">
              {[task.episode, task.sequence, task.shot].filter(Boolean).join(' / ')}
            </div>
          </div>
        )}

        {/* Updated At */}
        <div className="task-detail-field">
          <div className="task-detail-field-label">
            <Clock size={16} />
            Last Updated
          </div>
          <div className="task-detail-field-value">{formatDate(task.updated_at)}</div>
        </div>
      </div>
    </div>
  )
}
