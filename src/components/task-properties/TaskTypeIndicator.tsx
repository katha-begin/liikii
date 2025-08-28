// Linear-style Task Type Indicator Badge
import React from 'react'
import { clsx } from 'clsx'
import { Package, Camera, Folder } from 'lucide-react'
import { UITask } from '@/types/database'

interface TaskTypeIndicatorProps {
  task: UITask
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showLabel?: boolean
  className?: string
}

export const TaskTypeIndicator: React.FC<TaskTypeIndicatorProps> = ({
  task,
  size = 'md',
  showIcon = true,
  showLabel = true,
  className
}) => {
  // Determine task type and category
  const taskType = task.task_type || (task.type === 'asset' ? 'asset' : 'shot')
  const assetCategory = task.asset_category

  // Get appropriate icon
  const getIcon = () => {
    if (taskType === 'asset') {
      switch (assetCategory) {
        case 'character':
          return <Package size={getIconSize()} />
        case 'prop':
          return <Package size={getIconSize()} />
        case 'set':
          return <Folder size={getIconSize()} />
        case 'environment':
          return <Folder size={getIconSize()} />
        default:
          return <Package size={getIconSize()} />
      }
    } else {
      return <Camera size={getIconSize()} />
    }
  }

  // Get icon size based on badge size
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 12
      case 'md': return 14
      case 'lg': return 16
      default: return 14
    }
  }

  // Get display label
  const getLabel = () => {
    if (taskType === 'asset') {
      if (assetCategory) {
        return `${assetCategory.charAt(0).toUpperCase() + assetCategory.slice(1)} Asset`
      }
      return 'Asset'
    } else {
      return 'Shot'
    }
  }

  // Get colors based on task type
  const getColors = () => {
    if (taskType === 'asset') {
      return {
        backgroundColor: 'var(--accent-mint)',
        color: 'var(--bg-base)',
        borderColor: 'var(--accent-mint)'
      }
    } else {
      return {
        backgroundColor: 'var(--accent-blue)',
        color: 'var(--bg-base)',
        borderColor: 'var(--accent-blue)'
      }
    }
  }

  // Get size-specific styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'var(--space-1) var(--space-2)',
          fontSize: 'var(--text-caption)',
          lineHeight: 'var(--text-caption-lh)',
          gap: 'var(--space-1)'
        }
      case 'md':
        return {
          padding: 'var(--space-1) var(--space-2)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--text-body-lh)',
          gap: 'var(--space-1)'
        }
      case 'lg':
        return {
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--text-body-lh)',
          gap: 'var(--space-2)'
        }
      default:
        return {
          padding: 'var(--space-1) var(--space-2)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--text-body-lh)',
          gap: 'var(--space-1)'
        }
    }
  }

  const colors = getColors()
  const sizeStyles = getSizeStyles()

  return (
    <div
      className={clsx('task-type-indicator', `task-type-indicator--${size}`, className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 'var(--radius-pill)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        border: '1px solid',
        ...colors,
        ...sizeStyles
      }}
    >
      {showIcon && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {getIcon()}
        </span>
      )}
      
      {showLabel && (
        <span>{getLabel()}</span>
      )}
    </div>
  )
}

// Specialized components for different contexts
export const TaskTypeIconOnly: React.FC<Omit<TaskTypeIndicatorProps, 'showIcon' | 'showLabel'>> = (props) => (
  <TaskTypeIndicator {...props} showIcon={true} showLabel={false} />
)

export const TaskTypeLabelOnly: React.FC<Omit<TaskTypeIndicatorProps, 'showIcon' | 'showLabel'>> = (props) => (
  <TaskTypeIndicator {...props} showIcon={false} showLabel={true} />
)

// Compact version for use in lists
export const TaskTypeCompact: React.FC<TaskTypeIndicatorProps> = (props) => (
  <TaskTypeIndicator {...props} size="sm" />
)

// Helper function to get task type color for use in other components
export const getTaskTypeColor = (task: UITask): string => {
  const taskType = task.task_type || (task.type === 'asset' ? 'asset' : 'shot')
  return taskType === 'asset' ? 'var(--accent-mint)' : 'var(--accent-blue)'
}

// Helper function to get task type label
export const getTaskTypeLabel = (task: UITask): string => {
  const taskType = task.task_type || (task.type === 'asset' ? 'asset' : 'shot')
  const assetCategory = task.asset_category

  if (taskType === 'asset') {
    if (assetCategory) {
      return `${assetCategory.charAt(0).toUpperCase() + assetCategory.slice(1)} Asset`
    }
    return 'Asset'
  } else {
    return 'Shot'
  }
}

// Helper function to determine if task is asset or shot
export const isAssetTask = (task: UITask): boolean => {
  return task.task_type === 'asset' || (task.type === 'asset')
}

export const isShotTask = (task: UITask): boolean => {
  return task.task_type === 'shot' || (task.type === 'shot')
}
