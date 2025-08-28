// Data Context - Global State Management
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import {
  UIProject,
  UITask,
  Notification,
  EnhancedNotification,
  Message,
  InboxFilters,
  InboxStats,
  BulkOperation
} from '@/types/database'
import { dataService, QueryOptions } from '@/services/DataService'

// State interfaces
export interface DataState {
  projects: {
    items: UIProject[]
    loading: boolean
    error: string | null
    total: number
    hasMore: boolean
  }
  tasks: {
    items: UITask[]
    loading: boolean
    error: string | null
    total: number
    hasMore: boolean
  }
  notifications: {
    items: Notification[]
    loading: boolean
    error: string | null
    unreadCount: number
  }
  enhancedNotifications: {
    items: EnhancedNotification[]
    loading: boolean
    error: string | null
    unreadCount: number
    stats: InboxStats | null
  }
  messages: {
    items: Message[]
    loading: boolean
    error: string | null
    threads: Record<string, Message[]>
  }
  inbox: {
    filters: InboxFilters
    selectedNotifications: string[]
    bulkOperationInProgress: boolean
  }
  currentProject: UIProject | null
  selectedItems: {
    projects: string[]
    tasks: string[]
  }
}

// Action types
export type DataAction =
  | { type: 'SET_PROJECTS_LOADING'; payload: boolean }
  | { type: 'SET_PROJECTS_SUCCESS'; payload: { items: UIProject[]; total: number; hasMore: boolean } }
  | { type: 'SET_PROJECTS_ERROR'; payload: string }
  | { type: 'ADD_PROJECT'; payload: UIProject }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<UIProject> } }
  | { type: 'SET_TASKS_LOADING'; payload: boolean }
  | { type: 'SET_TASKS_SUCCESS'; payload: { items: UITask[]; total: number; hasMore: boolean } }
  | { type: 'SET_TASKS_ERROR'; payload: string }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<UITask> } }
  | { type: 'SET_NOTIFICATIONS_LOADING'; payload: boolean }
  | { type: 'SET_NOTIFICATIONS_SUCCESS'; payload: { items: Notification[]; unreadCount: number } }
  | { type: 'SET_NOTIFICATIONS_ERROR'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_ENHANCED_NOTIFICATIONS_LOADING'; payload: boolean }
  | { type: 'SET_ENHANCED_NOTIFICATIONS_SUCCESS'; payload: { items: EnhancedNotification[]; unreadCount: number; stats: InboxStats } }
  | { type: 'SET_ENHANCED_NOTIFICATIONS_ERROR'; payload: string }
  | { type: 'SET_MESSAGES_LOADING'; payload: boolean }
  | { type: 'SET_MESSAGES_SUCCESS'; payload: { items: Message[] } }
  | { type: 'SET_MESSAGES_ERROR'; payload: string }
  | { type: 'SET_MESSAGE_THREAD'; payload: { threadId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'BULK_MARK_NOTIFICATIONS_READ'; payload: string[] }
  | { type: 'BULK_DELETE_NOTIFICATIONS'; payload: string[] }
  | { type: 'SET_INBOX_FILTERS'; payload: Partial<InboxFilters> }
  | { type: 'SELECT_NOTIFICATIONS'; payload: string[] }
  | { type: 'TOGGLE_NOTIFICATION_SELECTION'; payload: string }
  | { type: 'CLEAR_NOTIFICATION_SELECTION' }
  | { type: 'SET_BULK_OPERATION_IN_PROGRESS'; payload: boolean }
  | { type: 'SET_CURRENT_PROJECT'; payload: UIProject | null }
  | { type: 'SELECT_ITEMS'; payload: { type: 'projects' | 'tasks'; ids: string[] } }
  | { type: 'CLEAR_SELECTION'; payload: 'projects' | 'tasks' | 'all' }

// Initial state
const initialState: DataState = {
  projects: {
    items: [],
    loading: false,
    error: null,
    total: 0,
    hasMore: false
  },
  tasks: {
    items: [],
    loading: false,
    error: null,
    total: 0,
    hasMore: false
  },
  notifications: {
    items: [],
    loading: false,
    error: null,
    unreadCount: 0
  },
  enhancedNotifications: {
    items: [],
    loading: false,
    error: null,
    unreadCount: 0,
    stats: null
  },
  messages: {
    items: [],
    loading: false,
    error: null,
    threads: {}
  },
  inbox: {
    filters: {
      projectId: null,
      type: null,
      priority: null,
      readStatus: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
      searchQuery: ''
    },
    selectedNotifications: [],
    bulkOperationInProgress: false
  },
  currentProject: null,
  selectedItems: {
    projects: [],
    tasks: []
  }
}

// Reducer
function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'SET_PROJECTS_LOADING':
      return {
        ...state,
        projects: { ...state.projects, loading: action.payload, error: null }
      }
    case 'SET_PROJECTS_SUCCESS':
      return {
        ...state,
        projects: {
          ...state.projects,
          items: action.payload.items,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
          loading: false,
          error: null
        }
      }
    case 'SET_PROJECTS_ERROR':
      return {
        ...state,
        projects: { ...state.projects, loading: false, error: action.payload }
      }
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: {
          ...state.projects,
          items: [action.payload, ...state.projects.items],
          total: state.projects.total + 1
        }
      }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: {
          ...state.projects,
          items: state.projects.items.map(project =>
            project.id === action.payload.id
              ? { ...project, ...action.payload.updates }
              : project
          )
        },
        currentProject: state.currentProject?.id === action.payload.id
          ? { ...state.currentProject, ...action.payload.updates }
          : state.currentProject
      }
    case 'SET_TASKS_LOADING':
      return {
        ...state,
        tasks: { ...state.tasks, loading: action.payload, error: null }
      }
    case 'SET_TASKS_SUCCESS':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          items: action.payload.items,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
          loading: false,
          error: null
        }
      }
    case 'SET_TASKS_ERROR':
      return {
        ...state,
        tasks: { ...state.tasks, loading: false, error: action.payload }
      }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          items: state.tasks.items.map(task =>
            task.id === action.payload.id
              ? { ...task, ...action.payload.updates }
              : task
          )
        }
      }
    case 'SET_NOTIFICATIONS_LOADING':
      return {
        ...state,
        notifications: { ...state.notifications, loading: action.payload, error: null }
      }
    case 'SET_NOTIFICATIONS_SUCCESS':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          items: action.payload.items,
          unreadCount: action.payload.unreadCount,
          loading: false,
          error: null
        }
      }
    case 'SET_NOTIFICATIONS_ERROR':
      return {
        ...state,
        notifications: { ...state.notifications, loading: false, error: action.payload }
      }
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          items: state.notifications.items.map(notification =>
            notification.id === action.payload
              ? { ...notification, isRead: true }
              : notification
          ),
          unreadCount: Math.max(0, state.notifications.unreadCount - 1)
        },
        enhancedNotifications: {
          ...state.enhancedNotifications,
          items: state.enhancedNotifications.items.map(notification =>
            notification.id === action.payload
              ? { ...notification, isRead: true }
              : notification
          ),
          unreadCount: Math.max(0, state.enhancedNotifications.unreadCount - 1)
        }
      }
    case 'SET_ENHANCED_NOTIFICATIONS_LOADING':
      return {
        ...state,
        enhancedNotifications: { ...state.enhancedNotifications, loading: action.payload, error: null }
      }
    case 'SET_ENHANCED_NOTIFICATIONS_SUCCESS':
      return {
        ...state,
        enhancedNotifications: {
          ...state.enhancedNotifications,
          items: action.payload.items,
          unreadCount: action.payload.unreadCount,
          stats: action.payload.stats,
          loading: false,
          error: null
        }
      }
    case 'SET_ENHANCED_NOTIFICATIONS_ERROR':
      return {
        ...state,
        enhancedNotifications: { ...state.enhancedNotifications, loading: false, error: action.payload }
      }
    case 'SET_MESSAGES_LOADING':
      return {
        ...state,
        messages: { ...state.messages, loading: action.payload, error: null }
      }
    case 'SET_MESSAGES_SUCCESS':
      return {
        ...state,
        messages: {
          ...state.messages,
          items: action.payload.items,
          loading: false,
          error: null
        }
      }
    case 'SET_MESSAGES_ERROR':
      return {
        ...state,
        messages: { ...state.messages, loading: false, error: action.payload }
      }
    case 'SET_MESSAGE_THREAD':
      return {
        ...state,
        messages: {
          ...state.messages,
          threads: {
            ...state.messages.threads,
            [action.payload.threadId]: action.payload.messages
          }
        }
      }
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          items: [action.payload, ...state.messages.items]
        }
      }
    case 'BULK_MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        enhancedNotifications: {
          ...state.enhancedNotifications,
          items: state.enhancedNotifications.items.map(notification =>
            action.payload.includes(notification.id)
              ? { ...notification, isRead: true }
              : notification
          ),
          unreadCount: Math.max(0, state.enhancedNotifications.unreadCount - action.payload.length)
        }
      }
    case 'BULK_DELETE_NOTIFICATIONS':
      return {
        ...state,
        enhancedNotifications: {
          ...state.enhancedNotifications,
          items: state.enhancedNotifications.items.filter(notification =>
            !action.payload.includes(notification.id)
          ),
          unreadCount: state.enhancedNotifications.unreadCount -
            action.payload.filter(id =>
              state.enhancedNotifications.items.find(n => n.id === id && !n.isRead)
            ).length
        }
      }
    case 'SET_INBOX_FILTERS':
      return {
        ...state,
        inbox: {
          ...state.inbox,
          filters: { ...state.inbox.filters, ...action.payload }
        }
      }
    case 'SELECT_NOTIFICATIONS':
      return {
        ...state,
        inbox: {
          ...state.inbox,
          selectedNotifications: action.payload
        }
      }
    case 'TOGGLE_NOTIFICATION_SELECTION':
      const isSelected = state.inbox.selectedNotifications.includes(action.payload)
      return {
        ...state,
        inbox: {
          ...state.inbox,
          selectedNotifications: isSelected
            ? state.inbox.selectedNotifications.filter(id => id !== action.payload)
            : [...state.inbox.selectedNotifications, action.payload]
        }
      }
    case 'CLEAR_NOTIFICATION_SELECTION':
      return {
        ...state,
        inbox: {
          ...state.inbox,
          selectedNotifications: []
        }
      }
    case 'SET_BULK_OPERATION_IN_PROGRESS':
      return {
        ...state,
        inbox: {
          ...state.inbox,
          bulkOperationInProgress: action.payload
        }
      }
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload
      }
    case 'SELECT_ITEMS':
      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [action.payload.type]: action.payload.ids
        }
      }
    case 'CLEAR_SELECTION':
      if (action.payload === 'all') {
        return {
          ...state,
          selectedItems: { projects: [], tasks: [] }
        }
      }
      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [action.payload]: []
        }
      }
    default:
      return state
  }
}

// Context
interface DataContextType {
  state: DataState
  actions: {
    loadProjects: (options?: QueryOptions) => Promise<void>
    loadTasks: (options?: QueryOptions) => Promise<void>
    loadNotifications: (userId: string) => Promise<void>
    createProject: (project: Partial<UIProject>) => Promise<void>
    updateProject: (id: string, updates: Partial<UIProject>) => Promise<void>
    updateTask: (id: string, updates: Partial<UITask>) => Promise<void>
    markNotificationRead: (id: string) => Promise<void>
    // Enhanced inbox methods
    loadEnhancedNotifications: (userId: string, filters?: InboxFilters) => Promise<void>
    loadInboxStats: (userId: string) => Promise<void>
    bulkMarkNotificationsRead: (ids: string[]) => Promise<void>
    bulkDeleteNotifications: (ids: string[]) => Promise<void>
    performBulkOperation: (operation: BulkOperation, ids: string[]) => Promise<void>
    setInboxFilters: (filters: Partial<InboxFilters>) => void
    selectNotifications: (ids: string[]) => void
    toggleNotificationSelection: (id: string) => void
    clearNotificationSelection: () => void
    // Message methods
    loadMessages: (userId: string) => Promise<void>
    sendMessage: (message: Omit<Message, 'id' | 'createdAt'>) => Promise<void>
    replyToMessage: (parentMessageId: string, reply: Omit<Message, 'id' | 'createdAt' | 'parentMessageId' | 'threadId'>) => Promise<void>
    loadMessageThread: (threadId: string) => Promise<void>
    markMessageRead: (messageId: string) => Promise<void>
    // Existing methods
    setCurrentProject: (project: UIProject | null) => void
    selectItems: (type: 'projects' | 'tasks', ids: string[]) => void
    clearSelection: (type: 'projects' | 'tasks' | 'all') => void
    search: (query: string, type?: 'projects' | 'tasks' | 'all') => Promise<{ projects: UIProject[]; tasks: UITask[] }>
  }
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Provider component
interface DataProviderProps {
  children: React.ReactNode
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState)

  // Actions
  const loadProjects = useCallback(async (options: QueryOptions = {}) => {
    dispatch({ type: 'SET_PROJECTS_LOADING', payload: true })
    try {
      const response = await dataService.getProjects(options)
      dispatch({
        type: 'SET_PROJECTS_SUCCESS',
        payload: {
          items: response.data,
          total: response.total,
          hasMore: response.hasMore
        }
      })
    } catch (error) {
      dispatch({
        type: 'SET_PROJECTS_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load projects'
      })
    }
  }, [])

  const loadTasks = useCallback(async (options: QueryOptions = {}) => {
    dispatch({ type: 'SET_TASKS_LOADING', payload: true })
    try {
      const response = await dataService.getTasks(options)
      dispatch({
        type: 'SET_TASKS_SUCCESS',
        payload: {
          items: response.data,
          total: response.total,
          hasMore: response.hasMore
        }
      })
    } catch (error) {
      dispatch({
        type: 'SET_TASKS_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load tasks'
      })
    }
  }, [])

  const loadNotifications = useCallback(async (userId: string) => {
    dispatch({ type: 'SET_NOTIFICATIONS_LOADING', payload: true })
    try {
      const response = await dataService.getNotifications(userId)
      const unreadCount = response.data.filter(n => !n.isRead).length
      dispatch({
        type: 'SET_NOTIFICATIONS_SUCCESS',
        payload: {
          items: response.data,
          unreadCount
        }
      })
    } catch (error) {
      dispatch({
        type: 'SET_NOTIFICATIONS_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load notifications'
      })
    }
  }, [])

  const createProject = useCallback(async (project: Partial<UIProject>) => {
    try {
      const newProject = await dataService.createProject(project)
      dispatch({ type: 'ADD_PROJECT', payload: newProject })
    } catch (error) {
      throw error
    }
  }, [])

  const updateProject = useCallback(async (id: string, updates: Partial<UIProject>) => {
    try {
      await dataService.updateProject(id, updates)
      dispatch({ type: 'UPDATE_PROJECT', payload: { id, updates } })
    } catch (error) {
      throw error
    }
  }, [])

  const updateTask = useCallback(async (id: string, updates: Partial<UITask>) => {
    try {
      await dataService.updateTask(id, updates)
      dispatch({ type: 'UPDATE_TASK', payload: { id, updates } })
    } catch (error) {
      throw error
    }
  }, [])

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await dataService.markNotificationRead(id)
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id })
    } catch (error) {
      throw error
    }
  }, [])

  const setCurrentProject = useCallback((project: UIProject | null) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project })
  }, [])

  const selectItems = useCallback((type: 'projects' | 'tasks', ids: string[]) => {
    dispatch({ type: 'SELECT_ITEMS', payload: { type, ids } })
  }, [])

  const clearSelection = useCallback((type: 'projects' | 'tasks' | 'all') => {
    dispatch({ type: 'CLEAR_SELECTION', payload: type })
  }, [])

  const search = useCallback(async (query: string, type?: 'projects' | 'tasks' | 'all') => {
    return dataService.search(query, type)
  }, [])

  // Enhanced inbox methods
  const loadEnhancedNotifications = useCallback(async (userId: string, filters?: InboxFilters) => {
    dispatch({ type: 'SET_ENHANCED_NOTIFICATIONS_LOADING', payload: true })
    try {
      const response = await (dataService as any).getEnhancedNotifications(userId, filters)
      const stats = await (dataService as any).getInboxStats(userId)
      dispatch({
        type: 'SET_ENHANCED_NOTIFICATIONS_SUCCESS',
        payload: {
          items: response.items,
          unreadCount: response.items.filter((n: EnhancedNotification) => !n.isRead).length,
          stats
        }
      })
    } catch (error) {
      dispatch({ type: 'SET_ENHANCED_NOTIFICATIONS_ERROR', payload: error instanceof Error ? error.message : 'Failed to load notifications' })
    }
  }, [])

  const loadInboxStats = useCallback(async (userId: string) => {
    try {
      const stats = await (dataService as any).getInboxStats(userId)
      dispatch({
        type: 'SET_ENHANCED_NOTIFICATIONS_SUCCESS',
        payload: {
          items: state.enhancedNotifications.items,
          unreadCount: state.enhancedNotifications.unreadCount,
          stats
        }
      })
    } catch (error) {
      console.error('Failed to load inbox stats:', error)
    }
  }, [state.enhancedNotifications.items, state.enhancedNotifications.unreadCount])

  const bulkMarkNotificationsRead = useCallback(async (ids: string[]) => {
    dispatch({ type: 'SET_BULK_OPERATION_IN_PROGRESS', payload: true })
    try {
      await (dataService as any).bulkMarkNotificationsRead(ids)
      dispatch({ type: 'BULK_MARK_NOTIFICATIONS_READ', payload: ids })
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    } finally {
      dispatch({ type: 'SET_BULK_OPERATION_IN_PROGRESS', payload: false })
    }
  }, [])

  const bulkDeleteNotifications = useCallback(async (ids: string[]) => {
    dispatch({ type: 'SET_BULK_OPERATION_IN_PROGRESS', payload: true })
    try {
      await (dataService as any).bulkDeleteNotifications(ids)
      dispatch({ type: 'BULK_DELETE_NOTIFICATIONS', payload: ids })
    } catch (error) {
      console.error('Failed to delete notifications:', error)
    } finally {
      dispatch({ type: 'SET_BULK_OPERATION_IN_PROGRESS', payload: false })
    }
  }, [])

  const performBulkOperation = useCallback(async (operation: BulkOperation, ids: string[]) => {
    dispatch({ type: 'SET_BULK_OPERATION_IN_PROGRESS', payload: true })
    try {
      await (dataService as any).performBulkOperation(operation, ids)

      switch (operation) {
        case 'markAsRead':
          dispatch({ type: 'BULK_MARK_NOTIFICATIONS_READ', payload: ids })
          break
        case 'markAsUnread':
          // Handle mark as unread
          dispatch({
            type: 'SET_ENHANCED_NOTIFICATIONS_SUCCESS',
            payload: {
              items: state.enhancedNotifications.items.map(n =>
                ids.includes(n.id) ? { ...n, isRead: false } : n
              ),
              unreadCount: state.enhancedNotifications.unreadCount + ids.length,
              stats: state.enhancedNotifications.stats!
            }
          })
          break
        case 'delete':
          dispatch({ type: 'BULK_DELETE_NOTIFICATIONS', payload: ids })
          break
        case 'archive':
          dispatch({ type: 'BULK_MARK_NOTIFICATIONS_READ', payload: ids })
          break
      }
    } catch (error) {
      console.error('Failed to perform bulk operation:', error)
    } finally {
      dispatch({ type: 'SET_BULK_OPERATION_IN_PROGRESS', payload: false })
    }
  }, [state.enhancedNotifications.items, state.enhancedNotifications.unreadCount, state.enhancedNotifications.stats])

  const setInboxFilters = useCallback((filters: Partial<InboxFilters>) => {
    dispatch({ type: 'SET_INBOX_FILTERS', payload: filters })
  }, [])

  const selectNotifications = useCallback((ids: string[]) => {
    dispatch({ type: 'SELECT_NOTIFICATIONS', payload: ids })
  }, [])

  const toggleNotificationSelection = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_NOTIFICATION_SELECTION', payload: id })
  }, [])

  const clearNotificationSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION_SELECTION' })
  }, [])

  // Message methods
  const loadMessages = useCallback(async (userId: string) => {
    dispatch({ type: 'SET_MESSAGES_LOADING', payload: true })
    try {
      const response = await (dataService as any).getMessages(userId)
      dispatch({ type: 'SET_MESSAGES_SUCCESS', payload: { items: response.items } })
    } catch (error) {
      dispatch({ type: 'SET_MESSAGES_ERROR', payload: error instanceof Error ? error.message : 'Failed to load messages' })
    }
  }, [])

  const sendMessage = useCallback(async (message: Omit<Message, 'id' | 'createdAt'>) => {
    try {
      const newMessage = await (dataService as any).sendMessage(message)
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage })
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }, [])

  const replyToMessage = useCallback(async (parentMessageId: string, reply: Omit<Message, 'id' | 'createdAt' | 'parentMessageId' | 'threadId'>) => {
    try {
      const newReply = await (dataService as any).replyToMessage(parentMessageId, reply)
      dispatch({ type: 'ADD_MESSAGE', payload: newReply })
    } catch (error) {
      console.error('Failed to reply to message:', error)
      throw error
    }
  }, [])

  const loadMessageThread = useCallback(async (threadId: string) => {
    try {
      const messages = await (dataService as any).getMessageThread(threadId)
      dispatch({ type: 'SET_MESSAGE_THREAD', payload: { threadId, messages } })
    } catch (error) {
      console.error('Failed to load message thread:', error)
    }
  }, [])

  const markMessageRead = useCallback(async (messageId: string) => {
    try {
      await (dataService as any).markMessageRead(messageId)
      // Update the message in state
      dispatch({
        type: 'SET_MESSAGES_SUCCESS',
        payload: {
          items: state.messages.items.map(m =>
            m.id === messageId ? { ...m, isRead: true } : m
          )
        }
      })
    } catch (error) {
      console.error('Failed to mark message as read:', error)
    }
  }, [state.messages.items])

  const actions = {
    loadProjects,
    loadTasks,
    loadNotifications,
    createProject,
    updateProject,
    updateTask,
    markNotificationRead,
    // Enhanced inbox methods
    loadEnhancedNotifications,
    loadInboxStats,
    bulkMarkNotificationsRead,
    bulkDeleteNotifications,
    performBulkOperation,
    setInboxFilters,
    selectNotifications,
    toggleNotificationSelection,
    clearNotificationSelection,
    // Message methods
    loadMessages,
    sendMessage,
    replyToMessage,
    loadMessageThread,
    markMessageRead,
    // Existing methods
    setCurrentProject,
    selectItems,
    clearSelection,
    search
  }

  return (
    <DataContext.Provider value={{ state, actions }}>
      {children}
    </DataContext.Provider>
  )
}
