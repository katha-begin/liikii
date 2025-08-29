import React from 'react'
import { clsx } from 'clsx'
import { 
  Flag, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Truck, 
  Eye, 
  Award,
  Play,
  Square
} from 'lucide-react'
import { TimelineMilestoneProps } from '@/types/designSystem'
import Tooltip from './Tooltip'
import { Stack } from '@/components/layout'

const TimelineMilestone = React.forwardRef<HTMLDivElement, TimelineMilestoneProps>(
  ({ 
    milestone,
    viewConfig,
    onClick,
    style,
    className,
    ...props 
  }, ref) => {
    
    // Get milestone type icon
    const getMilestoneIcon = () => {
      if (milestone.icon) {
        return milestone.icon
      }
      
      switch (milestone.type) {
        case 'project_start':
          return <Play size={16} />
        case 'project_end':
          return <Square size={16} />
        case 'delivery':
          return <Truck size={16} />
        case 'review':
          return <Eye size={16} />
        case 'approval':
          return <Award size={16} />
        case 'custom':
        default:
          return <Flag size={16} />
      }
    }

    // Get status color
    const getStatusColor = () => {
      switch (milestone.status) {
        case 'completed':
          return 'var(--semantic-success)'
        case 'current':
          return 'var(--accent-blue)'
        case 'missed':
          return 'var(--semantic-danger)'
        case 'upcoming':
        default:
          return 'var(--icon-quieter)'
      }
    }

    // Get status icon
    const getStatusIcon = () => {
      switch (milestone.status) {
        case 'completed':
          return <CheckCircle size={12} />
        case 'current':
          return <Target size={12} />
        case 'missed':
          return <AlertTriangle size={12} />
        case 'upcoming':
        default:
          return <Calendar size={12} />
      }
    }

    // Format milestone date
    const formatDate = () => {
      const date = new Date(milestone.date)
      const now = new Date()
      const diffTime = date.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
      
      if (diffDays < 0) {
        return `${formattedDate} (${Math.abs(diffDays)}d ago)`
      } else if (diffDays === 0) {
        return `${formattedDate} (Today)`
      } else if (diffDays === 1) {
        return `${formattedDate} (Tomorrow)`
      } else if (diffDays <= 7) {
        return `${formattedDate} (${diffDays}d away)`
      } else {
        return formattedDate
      }
    }

    // Handle click
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      onClick?.(milestone)
    }

    // Create tooltip content
    const tooltipContent = (
      <div className="timeline-milestone-tooltip">
        <div className="timeline-milestone-tooltip__header">
          <Stack direction="horizontal" gap="xs" align="center">
            {getMilestoneIcon()}
            <strong>{milestone.title}</strong>
            {getStatusIcon()}
          </Stack>
        </div>
        
        {milestone.description && (
          <p className="timeline-milestone-tooltip__description">
            {milestone.description}
          </p>
        )}
        
        <div className="timeline-milestone-tooltip__meta">
          <Stack direction="horizontal" gap="xs" align="center">
            <Calendar size={12} />
            <span>{formatDate()}</span>
          </Stack>
        </div>
        
        <div className="timeline-milestone-tooltip__type">
          <span className="text-caption text-secondary">
            {milestone.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
      </div>
    )

    return (
      <Tooltip content={tooltipContent} placement="top">
        <div 
          ref={ref}
          className={clsx(
            'timeline-milestone',
            `timeline-milestone--${milestone.type}`,
            `timeline-milestone--${milestone.status}`,
            {
              'timeline-milestone--clickable': onClick,
              'timeline-milestone--overdue': milestone.status === 'missed',
              'timeline-milestone--current': milestone.status === 'current'
            },
            className
          )}
          style={{
            ...style,
            color: milestone.color || getStatusColor()
          }}
          onClick={onClick ? handleClick : undefined}
          {...props}
        >
          {/* Milestone Line */}
          <div className="timeline-milestone__line" />
          
          {/* Milestone Marker */}
          <div 
            className="timeline-milestone__marker"
            style={{
              backgroundColor: milestone.color || getStatusColor(),
              borderColor: milestone.color || getStatusColor()
            }}
          >
            <div className="timeline-milestone__icon">
              {getMilestoneIcon()}
            </div>
          </div>
          
          {/* Milestone Label */}
          <div className="timeline-milestone__label">
            <div className="timeline-milestone__title">
              {milestone.title}
            </div>
            
            {viewConfig.viewMode === 'days' && (
              <div className="timeline-milestone__date">
                {new Date(milestone.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            )}
            
            {/* Status Indicator */}
            <div className="timeline-milestone__status">
              {getStatusIcon()}
            </div>
          </div>

          {/* Pulse Animation for Current Milestones */}
          {milestone.status === 'current' && (
            <div className="timeline-milestone__pulse" />
          )}
        </div>
      </Tooltip>
    )
  }
)

TimelineMilestone.displayName = 'TimelineMilestone'

export default TimelineMilestone
