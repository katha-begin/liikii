import React, { useMemo } from 'react'
import { clsx } from 'clsx'
import { Calendar, Clock, User, AlertTriangle, CheckCircle, Play, Pause } from 'lucide-react'
import { TimelineEventProps } from '@/types/designSystem'
import Avatar from './Avatar'
import Badge from './Badge'
import Tooltip from './Tooltip'
import { Stack } from '@/components/layout'

const TimelineEvent = React.forwardRef<HTMLDivElement, TimelineEventProps>(
  ({ 
    event,
    viewConfig,
    onClick,
    style,
    className,
    ...props 
  }, ref) => {
    
    // Calculate event width and duration
    const eventDimensions = useMemo(() => {
      const startDate = new Date(event.startDate)
      const endDate = event.endDate ? new Date(event.endDate) : startDate
      
      // Calculate duration in days
      const durationMs = endDate.getTime() - startDate.getTime()
      const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)))
      
      // Calculate width based on view mode and zoom
      let unitWidth = 40
      let unitsPerDay = 1
      
      switch (viewConfig.viewMode) {
        case 'days':
          unitWidth = 60 * viewConfig.zoomLevel
          unitsPerDay = 1
          break
        case 'weeks':
          unitWidth = 100 * viewConfig.zoomLevel
          unitsPerDay = 1/7
          break
        case 'months':
          unitWidth = 120 * viewConfig.zoomLevel
          unitsPerDay = 1/30
          break
        case 'quarters':
          unitWidth = 150 * viewConfig.zoomLevel
          unitsPerDay = 1/90
          break
      }
      
      const width = Math.max(20, durationDays * unitsPerDay * unitWidth)
      
      return {
        width,
        durationDays,
        isMultiDay: durationDays > 1
      }
    }, [event, viewConfig])

    // Get event type icon
    const getEventIcon = () => {
      switch (event.type) {
        case 'task':
          return <CheckCircle size={14} />
        case 'milestone':
          return <AlertTriangle size={14} />
        case 'deadline':
          return <Clock size={14} />
        case 'meeting':
          return <User size={14} />
        case 'review':
          return <Play size={14} />
        default:
          return <Calendar size={14} />
      }
    }

    // Get status color
    const getStatusColor = () => {
      switch (event.status) {
        case 'completed':
          return 'var(--semantic-success)'
        case 'in_progress':
          return 'var(--accent-blue)'
        case 'overdue':
          return 'var(--semantic-danger)'
        case 'not_started':
        default:
          return 'var(--icon-quieter)'
      }
    }

    // Get priority color
    const getPriorityColor = () => {
      switch (event.priority) {
        case 'urgent':
          return 'var(--semantic-danger)'
        case 'high':
          return 'var(--semantic-warning)'
        case 'medium':
          return 'var(--accent-blue)'
        case 'low':
        default:
          return 'var(--icon-quieter)'
      }
    }

    // Format date range
    const formatDateRange = () => {
      const start = new Date(event.startDate)
      const end = event.endDate ? new Date(event.endDate) : null
      
      if (!end || start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: start.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        })
      }
      
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }

    // Handle click
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      onClick?.(event)
    }

    // Create tooltip content
    const tooltipContent = (
      <div className="timeline-event-tooltip">
        <div className="timeline-event-tooltip__header">
          <Stack direction="horizontal" gap="xs" align="center">
            {getEventIcon()}
            <strong>{event.title}</strong>
          </Stack>
        </div>
        
        {event.description && (
          <p className="timeline-event-tooltip__description">
            {event.description}
          </p>
        )}
        
        <div className="timeline-event-tooltip__meta">
          <Stack direction="vertical" gap="xs">
            <Stack direction="horizontal" gap="xs" align="center">
              <Calendar size={12} />
              <span>{formatDateRange()}</span>
            </Stack>
            
            {event.assignee && (
              <Stack direction="horizontal" gap="xs" align="center">
                <User size={12} />
                <span>{event.assignee.name}</span>
              </Stack>
            )}
            
            {event.progress !== undefined && (
              <Stack direction="horizontal" gap="xs" align="center">
                <Clock size={12} />
                <span>{event.progress}% complete</span>
              </Stack>
            )}
          </Stack>
        </div>
        
        {event.tags && event.tags.length > 0 && (
          <div className="timeline-event-tooltip__tags">
            <Stack direction="horizontal" gap="xs" wrap>
              {event.tags.map((tag, index) => (
                <Badge key={index} variant="default" size="xs">
                  {tag}
                </Badge>
              ))}
            </Stack>
          </div>
        )}
      </div>
    )

    return (
      <Tooltip content={tooltipContent} placement="top">
        <div 
          ref={ref}
          className={clsx(
            'timeline-event',
            `timeline-event--${event.type}`,
            `timeline-event--${event.status}`,
            {
              'timeline-event--clickable': onClick,
              'timeline-event--multi-day': eventDimensions.isMultiDay,
              'timeline-event--high-priority': event.priority === 'high' || event.priority === 'urgent'
            },
            className
          )}
          style={{
            ...style,
            width: eventDimensions.width,
            backgroundColor: event.color || getStatusColor(),
            borderLeftColor: getPriorityColor()
          }}
          onClick={onClick ? handleClick : undefined}
          {...props}
        >
          {/* Event Content */}
          <div className="timeline-event__content">
            {/* Event Header */}
            <div className="timeline-event__header">
              <Stack direction="horizontal" gap="xs" align="center">
                <div className="timeline-event__icon">
                  {getEventIcon()}
                </div>
                
                <span className="timeline-event__title">
                  {event.title}
                </span>
                
                {event.priority && (event.priority === 'high' || event.priority === 'urgent') && (
                  <div className="timeline-event__priority-indicator">
                    <AlertTriangle size={12} />
                  </div>
                )}
              </Stack>
            </div>

            {/* Event Details (shown on wider events) */}
            {eventDimensions.width > 120 && (
              <div className="timeline-event__details">
                <Stack direction="horizontal" justify="between" align="center">
                  {/* Left side - Progress/Status */}
                  <div className="timeline-event__status">
                    {event.progress !== undefined ? (
                      <span className="text-caption">
                        {event.progress}%
                      </span>
                    ) : (
                      <Badge variant="default" size="xs">
                        {event.status?.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>

                  {/* Right side - Assignee */}
                  {event.assignee && eventDimensions.width > 180 && (
                    <Avatar
                      src={event.assignee.avatar}
                      fallback={event.assignee.name}
                      size="xs"
                      alt={event.assignee.name}
                    />
                  )}
                </Stack>
              </div>
            )}

            {/* Progress Bar (for in-progress events) */}
            {event.progress !== undefined && event.status === 'in_progress' && (
              <div className="timeline-event__progress">
                <div 
                  className="timeline-event__progress-bar"
                  style={{ width: `${event.progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Resize Handle (for interactive mode) */}
          {onClick && eventDimensions.isMultiDay && (
            <div className="timeline-event__resize-handle" />
          )}
        </div>
      </Tooltip>
    )
  }
)

TimelineEvent.displayName = 'TimelineEvent'

export default TimelineEvent
