// Custom Data Hooks - Simplified data access patterns
import { useEffect, useState, useCallback } from 'react'
import { useData } from '@/contexts/DataContext'
import { UIProject, UITask } from '@/types/database'
import { QueryOptions } from '@/services/DataService'

// Projects hooks
export const useProjects = (options?: QueryOptions) => {
  const { state, actions } = useData()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      actions.loadProjects(options)
      setInitialized(true)
    }
  }, [actions, options, initialized])

  const refresh = useCallback(() => {
    actions.loadProjects(options)
  }, [actions, options])

  return {
    projects: state.projects.items,
    loading: state.projects.loading,
    error: state.projects.error,
    total: state.projects.total,
    hasMore: state.projects.hasMore,
    refresh,
    createProject: actions.createProject,
    updateProject: actions.updateProject
  }
}

export const useProject = (projectId: string | null) => {
  const { state, actions } = useData()
  
  const project = projectId 
    ? state.projects.items.find(p => p.id === projectId) || state.currentProject
    : state.currentProject

  const setCurrentProject = useCallback((project: UIProject | null) => {
    actions.setCurrentProject(project)
  }, [actions])

  return {
    project,
    setCurrentProject,
    loading: state.projects.loading,
    error: state.projects.error
  }
}

// Tasks hooks
export const useTasks = (options?: QueryOptions) => {
  const { state, actions } = useData()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      actions.loadTasks(options)
      setInitialized(true)
    }
  }, [actions, options, initialized])

  const refresh = useCallback(() => {
    actions.loadTasks(options)
  }, [actions, options])

  return {
    tasks: state.tasks.items,
    loading: state.tasks.loading,
    error: state.tasks.error,
    total: state.tasks.total,
    hasMore: state.tasks.hasMore,
    refresh,
    updateTask: actions.updateTask
  }
}

export const useMyTasks = (userId?: string) => {
  const options: QueryOptions = {
    filters: userId ? { artist: userId } : undefined,
    sortBy: 'deadline',
    sortOrder: 'asc'
  }

  return useTasks(options)
}

export const useProjectTasks = (projectId: string) => {
  const options: QueryOptions = {
    filters: { project: projectId },
    sortBy: 'updated_at',
    sortOrder: 'desc'
  }

  return useTasks(options)
}

// Notifications hooks
export const useNotifications = (userId: string) => {
  const { state, actions } = useData()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized && userId) {
      actions.loadNotifications(userId)
      setInitialized(true)
    }
  }, [actions, userId, initialized])

  const refresh = useCallback(() => {
    if (userId) {
      actions.loadNotifications(userId)
    }
  }, [actions, userId])

  const markAsRead = useCallback((notificationId: string) => {
    actions.markNotificationRead(notificationId)
  }, [actions])

  return {
    notifications: state.notifications.items,
    unreadCount: state.notifications.unreadCount,
    loading: state.notifications.loading,
    error: state.notifications.error,
    refresh,
    markAsRead
  }
}

// Selection hooks
export const useSelection = () => {
  const { state, actions } = useData()

  const selectProjects = useCallback((ids: string[]) => {
    actions.selectItems('projects', ids)
  }, [actions])

  const selectTasks = useCallback((ids: string[]) => {
    actions.selectItems('tasks', ids)
  }, [actions])

  const clearSelection = useCallback((type: 'projects' | 'tasks' | 'all' = 'all') => {
    actions.clearSelection(type)
  }, [actions])

  const toggleProjectSelection = useCallback((id: string) => {
    const currentSelection = state.selectedItems.projects
    const newSelection = currentSelection.includes(id)
      ? currentSelection.filter(selectedId => selectedId !== id)
      : [...currentSelection, id]
    
    selectProjects(newSelection)
  }, [state.selectedItems.projects, selectProjects])

  const toggleTaskSelection = useCallback((id: string) => {
    const currentSelection = state.selectedItems.tasks
    const newSelection = currentSelection.includes(id)
      ? currentSelection.filter(selectedId => selectedId !== id)
      : [...currentSelection, id]
    
    selectTasks(newSelection)
  }, [state.selectedItems.tasks, selectTasks])

  return {
    selectedProjects: state.selectedItems.projects,
    selectedTasks: state.selectedItems.tasks,
    selectProjects,
    selectTasks,
    clearSelection,
    toggleProjectSelection,
    toggleTaskSelection,
    hasSelection: state.selectedItems.projects.length > 0 || state.selectedItems.tasks.length > 0
  }
}

// Search hook
export const useSearch = () => {
  const { actions } = useData()
  const [results, setResults] = useState<{ projects: UIProject[]; tasks: UITask[] }>({
    projects: [],
    tasks: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, type?: 'projects' | 'tasks' | 'all') => {
    if (!query.trim()) {
      setResults({ projects: [], tasks: [] })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchResults = await actions.search(query, type)
      setResults(searchResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults({ projects: [], tasks: [] })
    } finally {
      setLoading(false)
    }
  }, [actions])

  const clearResults = useCallback(() => {
    setResults({ projects: [], tasks: [] })
    setError(null)
  }, [])

  return {
    results,
    loading,
    error,
    search,
    clearResults
  }
}

// Real-time data hook (for future WebSocket integration)
export const useRealTimeData = (enabled: boolean = false) => {
  const { actions } = useData()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!enabled) return

    // Placeholder for WebSocket connection
    // This would connect to a real-time service
    console.log('Real-time data connection would be established here')
    setConnected(true)

    // Simulate periodic updates
    const interval = setInterval(() => {
      // In a real implementation, this would be triggered by WebSocket events
      actions.loadNotifications('current_user')
    }, 30000) // Refresh notifications every 30 seconds

    return () => {
      clearInterval(interval)
      setConnected(false)
    }
  }, [enabled, actions])

  return {
    connected,
    enabled
  }
}

// Data statistics hook
export const useDataStats = () => {
  const { state } = useData()

  const stats = {
    projects: {
      total: state.projects.total,
      loaded: state.projects.items.length,
      active: state.projects.items.filter(p => p.status === 'active').length,
      inactive: state.projects.items.filter(p => p.status === 'inactive').length
    },
    tasks: {
      total: state.tasks.total,
      loaded: state.tasks.items.length,
      notStarted: state.tasks.items.filter(t => t.status === 'not_started').length,
      inProgress: state.tasks.items.filter(t => t.status === 'in_progress').length,
      review: state.tasks.items.filter(t => t.status === 'review').length,
      approved: state.tasks.items.filter(t => t.status === 'approved').length
    },
    notifications: {
      total: state.notifications.items.length,
      unread: state.notifications.unreadCount,
      read: state.notifications.items.length - state.notifications.unreadCount
    }
  }

  return stats
}
