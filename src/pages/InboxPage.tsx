import React, { useState } from 'react'
import { PageWrapper, Stack } from '@/components/layout'
import { Card, Badge, Button } from '@/components/ui'
import { Mail, User, FileText, GitBranch, Filter, CheckCircle } from 'lucide-react'
import { useNotifications } from '@/hooks/useData'

const InboxPage: React.FC = () => {
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all')
  
  // Use data management hooks
  const { notifications, unreadCount, loading, error, refresh, markAsRead } = useNotifications('current_user')

  // Filter notifications based on read status
  const filteredNotifications = notifications.filter(notification => {
    if (filterRead === 'all') return true
    if (filterRead === 'unread') return !notification.isRead
    if (filterRead === 'read') return notification.isRead
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <User size={16} />
      case 'version': return <GitBranch size={16} />
      case 'update': return <FileText size={16} />
      case 'mention': return <Mail size={16} />
      default: return <Mail size={16} />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'primary'
      case 'version': return 'success'
      case 'update': return 'warning'
      case 'mention': return 'secondary'
      default: return 'default'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.ceil(diffTime / (1000 * 60))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      await Promise.all(unreadNotifications.map(n => markAsRead(n.id)))
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  // Show loading state
  if (loading && notifications.length === 0) {
    return (
      <PageWrapper maxWidth="lg" padding>
        <Stack direction="vertical" gap="lg" align="center" style={{ paddingTop: '4rem' }}>
          <div className="loading-spinner">Loading notifications...</div>
        </Stack>
      </PageWrapper>
    )
  }

  // Show error state
  if (error) {
    return (
      <PageWrapper maxWidth="lg" padding>
        <Stack direction="vertical" gap="lg" align="center" style={{ paddingTop: '4rem' }}>
          <div className="error-message">
            <h2 className="text-h2">Error loading notifications</h2>
            <p className="text-body text-secondary">{error}</p>
            <Button variant="primary" onClick={refresh}>
              Try Again
            </Button>
          </div>
        </Stack>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper maxWidth="lg" padding>
      <Stack direction="vertical" gap="lg">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center">
          <div>
            <h1 className="text-h1">Inbox</h1>
            <p className="text-body text-secondary">
              Stay updated with notifications and messages
              {unreadCount > 0 && (
                <Badge variant="primary" size="sm" style={{ marginLeft: 'var(--space-2)' }}>
                  {unreadCount} unread
                </Badge>
              )}
            </p>
          </div>
          <Stack direction="horizontal" gap="sm">
            {unreadCount > 0 && (
              <Button variant="secondary" leftIcon={<CheckCircle size={16} />} onClick={handleMarkAllAsRead}>
                Mark all read
              </Button>
            )}
            <Button variant="secondary" leftIcon={<Filter size={16} />}>
              Filter
            </Button>
          </Stack>
        </Stack>

        {/* Filter Row */}
        <Stack direction="horizontal" gap="sm" align="center">
          <select 
            value={filterRead} 
            onChange={(e) => setFilterRead(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All notifications</option>
            <option value="unread">Unread only</option>
            <option value="read">Read only</option>
          </select>
          <span className="text-caption text-secondary">
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
          </span>
        </Stack>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3 className="text-h3">No notifications found</h3>
              <p className="text-body text-secondary">
                {filterRead === 'all' 
                  ? "You don't have any notifications yet."
                  : `No ${filterRead} notifications found.`
                }
              </p>
            </div>
          </div>
        ) : (
          <Stack direction="vertical" gap="sm">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <Stack direction="horizontal" gap="md" align="start">
                  <div className={`notification-icon ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <Stack direction="vertical" gap="xs" style={{ flex: 1 }}>
                    <Stack direction="horizontal" justify="between" align="start">
                      <h3 className="text-h3">{notification.title}</h3>
                      <Stack direction="horizontal" gap="sm" align="center">
                        <span className="text-caption text-secondary">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <div className="unread-indicator" />
                        )}
                      </Stack>
                    </Stack>
                    
                    <p className="text-body text-secondary">{notification.description}</p>
                    
                    {notification.metadata && (
                      <Stack direction="horizontal" gap="sm" align="center">
                        {notification.metadata.project && (
                          <Badge variant="default" size="sm">
                            {notification.metadata.project}
                          </Badge>
                        )}
                        {notification.metadata.priority && (
                          <Badge variant={notification.metadata.priority === 'high' ? 'danger' : 'default'} size="sm">
                            {notification.metadata.priority}
                          </Badge>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </PageWrapper>
  )
}

export default InboxPage
