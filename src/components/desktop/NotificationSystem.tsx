import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useDesktop } from '@/hooks/useDesktop'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
  persistent?: boolean
  actions?: Array<{
    label: string
    action: () => void
    variant?: 'primary' | 'secondary'
  }>
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (notification: Omit<Notification, 'id'>) => string
  hideNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { showNotification: showNativeNotification } = useDesktop()

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000
    }

    setNotifications(prev => [...prev, newNotification])

    // Show native notification if available
    showNativeNotification({
      title: notification.title,
      body: notification.message,
      silent: notification.type === 'info',
      id
    })

    // Auto-hide after duration (unless persistent)
    if (!notification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        hideNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [showNativeNotification])

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      hideNotification,
      clearAllNotifications
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

const NotificationContainer: React.FC = () => {
  const { notifications, hideNotification } = useNotifications()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onClose: () => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} />
      case 'error':
        return <AlertCircle size={20} />
      case 'warning':
        return <AlertTriangle size={20} />
      case 'info':
      default:
        return <Info size={20} />
    }
  }

  return (
    <div className={`notification-item notification-${notification.type}`}>
      <div className="notification-icon">
        {getIcon()}
      </div>
      
      <div className="notification-content">
        <div className="notification-title">
          {notification.title}
        </div>
        <div className="notification-message">
          {notification.message}
        </div>
        
        {notification.actions && notification.actions.length > 0 && (
          <div className="notification-actions">
            {notification.actions.map((action, index) => (
              <button
                key={index}
                className={`notification-action ${action.variant || 'secondary'}`}
                onClick={() => {
                  action.action()
                  onClose()
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <button
        className="notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}

// Convenience hooks for different notification types
export const useNotificationHelpers = () => {
  const { showNotification } = useNotifications()

  const showSuccess = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return showNotification({ ...options, type: 'success', title, message })
  }, [showNotification])

  const showError = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return showNotification({ ...options, type: 'error', title, message, persistent: true })
  }, [showNotification])

  const showWarning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return showNotification({ ...options, type: 'warning', title, message })
  }, [showNotification])

  const showInfo = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return showNotification({ ...options, type: 'info', title, message })
  }, [showNotification])

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export default NotificationProvider
