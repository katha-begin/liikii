import React, { useState } from 'react'
import { 
  Mail, 
  User, 
  FileText, 
  GitBranch, 
  MessageCircle, 
  AlertCircle,
  ExternalLink,
  Reply,
  MoreHorizontal,
  Check
} from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { Stack } from '@/components/layout'
import { EnhancedNotification } from '@/types/database'
import './EnhancedNotificationCard.css'

interface EnhancedNotificationCardProps {
  notification: EnhancedNotification
  isSelected: boolean
  onSelect: (id: string) => void
  onToggleSelect: (id: string) => void
  onMarkAsRead: (id: string) => void
  onReply: (notification: EnhancedNotification) => void
  onNavigateToTask: (notification: EnhancedNotification) => void
  className?: string
}

const EnhancedNotificationCard: React.FC<EnhancedNotificationCardProps> = ({
  notification,
  isSelected,
  onSelect,
  onToggleSelect,
  onMarkAsRead,
  onReply,
  onNavigateToTask,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <User size={16} />
      case 'mention': return <Mail size={16} />
      case 'comment': return <MessageCircle size={16} />
      case 'version': return <GitBranch size={16} />
      case 'update': return <FileText size={16} />
      default: return <AlertCircle size={16} />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'blue'
      case 'mention': return 'orange'
      case 'comment': return 'green'
      case 'version': return 'purple'
      case 'update': return 'gray'
      default: return 'gray'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#FF4444'
      case 'high': return '#FF8800'
      case 'medium': return '#0088FF'
      case 'low': return '#888888'
      default: return '#888888'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on interactive elements
    if ((e.target as HTMLElement).closest('.notification-checkbox, .notification-actions, .action-btn')) {
      return
    }
    
    if (!notification.isRead) {
      onMarkAsRead(notification.id)
    }
    setIsExpanded(!isExpanded)
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleSelect(notification.id)
  }

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onReply(notification)
  }

  const handleNavigateClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onNavigateToTask(notification)
  }

  return (
    <Card 
      className={`enhanced-notification-card ${!notification.isRead ? 'unread' : ''} ${isSelected ? 'selected' : ''} ${className || ''}`}
      onClick={handleCardClick}
    >
      <div className="notification-content">
        {/* Selection Checkbox */}
        <div className="notification-checkbox" onClick={handleCheckboxClick}>
          <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
            {isSelected && <Check size={12} />}
          </div>
        </div>

        {/* Notification Icon */}
        <div className={`notification-icon ${getNotificationColor(notification.type)}`}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Main Content */}
        <div className="notification-main">
          {/* Header */}
          <div className="notification-header">
            <Stack direction="horizontal" justify="between" align="start" gap="sm">
              <div className="notification-meta">
                <Stack direction="horizontal" align="center" gap="sm">
                  {/* Project Badge */}
                  <Badge 
                    variant="default" 
                    size="sm" 
                    className="project-badge"
                    style={{ '--project-color': notification.projectColor } as React.CSSProperties}
                  >
                    <span className="project-dot" />
                    {notification.projectName}
                  </Badge>

                  {/* Priority Badge */}
                  <Badge 
                    variant="default" 
                    size="sm" 
                    className="priority-badge"
                    style={{ '--priority-color': getPriorityColor(notification.priority) } as React.CSSProperties}
                  >
                    <span className="priority-dot" />
                    {notification.priority}
                  </Badge>

                  {/* Time */}
                  <span className="notification-time">
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                </Stack>
              </div>

              {/* Actions */}
              <div className="notification-actions">
                {notification.canReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Reply size={14} />}
                    onClick={handleReplyClick}
                    className="action-btn reply-btn"
                    title="Reply"
                  />
                )}
                
                {notification.actionUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<ExternalLink size={14} />}
                    onClick={handleNavigateClick}
                    className="action-btn navigate-btn"
                    title="Go to task"
                  />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<MoreHorizontal size={14} />}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowActions(!showActions)
                  }}
                  className="action-btn more-btn"
                  title="More actions"
                />
              </div>
            </Stack>
          </div>

          {/* Title */}
          <h3 className="notification-title">
            {notification.title}
          </h3>

          {/* Description */}
          <p className="notification-description">
            {notification.description}
          </p>

          {/* Replies Info */}
          {notification.hasReplies && notification.replyCount && notification.replyCount > 0 && (
            <div className="notification-replies">
              <MessageCircle size={14} />
              <span>{notification.replyCount} {notification.replyCount === 1 ? 'reply' : 'replies'}</span>
              {notification.lastReplyAt && (
                <span className="last-reply">
                  • Last reply {formatTimeAgo(notification.lastReplyAt)}
                </span>
              )}
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && notification.metadata && (
            <div className="notification-expanded">
              <div className="metadata-grid">
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <div key={key} className="metadata-item">
                    <span className="metadata-key">{key.replace(/_/g, ' ')}:</span>
                    <span className="metadata-value">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Unread Indicator */}
        {!notification.isRead && (
          <div className="unread-indicator" />
        )}
      </div>

      {/* Actions Dropdown */}
      {showActions && (
        <>
          <div 
            className="actions-backdrop"
            onClick={() => setShowActions(false)}
          />
          <div className="actions-dropdown">
            {!notification.isRead && (
              <button 
                className="action-item"
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkAsRead(notification.id)
                  setShowActions(false)
                }}
              >
                <Mail size={14} />
                Mark as read
              </button>
            )}
            <button 
              className="action-item"
              onClick={(e) => {
                e.stopPropagation()
                onToggleSelect(notification.id)
                setShowActions(false)
              }}
            >
              <Check size={14} />
              {isSelected ? 'Deselect' : 'Select'}
            </button>
          </div>
        </>
      )}
    </Card>
  )
}

export default EnhancedNotificationCard
