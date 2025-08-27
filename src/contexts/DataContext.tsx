// Data Context - Global State Management
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { UIProject, UITask, Notification } from '@/types/database'
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

  const actions = {
    loadProjects,
    loadTasks,
    loadNotifications,
    createProject,
    updateProject,
    updateTask,
    markNotificationRead,
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
