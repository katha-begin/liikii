// Data Service Layer - JSON Database Integration
import { Version, UIProject, UITask, Notification } from '@/types/database'
import { mockDataService } from './MockDataService'

export interface DataServiceConfig {
  baseUrl?: string
  timeout?: number
  retryAttempts?: number
}

export interface QueryOptions {
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}

export interface DataResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export class DataService {
  private config: DataServiceConfig
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor(config: DataServiceConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || '/data',
      timeout: config.timeout || 10000,
      retryAttempts: config.retryAttempts || 3,
      ...config
    }
  }

  // Generic fetch method with caching and error handling
  private async fetchWithCache<T>(
    endpoint: string, 
    options: RequestInit = {},
    cacheKey?: string,
    cacheTTL?: number
  ): Promise<T> {
    const key = cacheKey || endpoint
    const ttl = cacheTTL || this.CACHE_TTL

    // Check cache first
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Cache the result
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      })

      return data as T
    } catch (error) {
      console.error(`DataService fetch error for ${endpoint}:`, error)
      throw error
    }
  }

  // Cache management
  public clearCache(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern)
      for (const [key] of this.cache) {
        if (regex.test(key)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }

  // Projects API
  public async getProjects(options: QueryOptions = {}): Promise<DataResponse<UIProject>> {
    const queryParams = new URLSearchParams()
    if (options.limit) queryParams.set('limit', options.limit.toString())
    if (options.offset) queryParams.set('offset', options.offset.toString())
    if (options.sortBy) queryParams.set('sortBy', options.sortBy)
    if (options.sortOrder) queryParams.set('sortOrder', options.sortOrder)

    const endpoint = `/projects?${queryParams.toString()}`
    return this.fetchWithCache<DataResponse<UIProject>>(endpoint)
  }

  public async getProject(projectId: string): Promise<UIProject> {
    return this.fetchWithCache<UIProject>(`/projects/${projectId}`)
  }

  public async createProject(project: Partial<UIProject>): Promise<UIProject> {
    const response = await fetch(`${this.config.baseUrl}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    })

    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`)
    }

    const newProject = await response.json()
    this.clearCache('projects')
    return newProject
  }

  public async updateProject(projectId: string, updates: Partial<UIProject>): Promise<UIProject> {
    const response = await fetch(`${this.config.baseUrl}/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error(`Failed to update project: ${response.statusText}`)
    }

    const updatedProject = await response.json()
    this.clearCache(`projects/${projectId}`)
    this.clearCache('projects')
    return updatedProject
  }

  // Tasks API
  public async getTasks(options: QueryOptions = {}): Promise<DataResponse<UITask>> {
    const queryParams = new URLSearchParams()
    if (options.limit) queryParams.set('limit', options.limit.toString())
    if (options.offset) queryParams.set('offset', options.offset.toString())
    if (options.filters?.project) queryParams.set('project', options.filters.project)
    if (options.filters?.status) queryParams.set('status', options.filters.status)
    if (options.filters?.artist) queryParams.set('artist', options.filters.artist)

    const endpoint = `/tasks?${queryParams.toString()}`
    return this.fetchWithCache<DataResponse<UITask>>(endpoint)
  }

  public async getTask(taskId: string): Promise<UITask> {
    return this.fetchWithCache<UITask>(`/tasks/${taskId}`)
  }

  public async updateTask(taskId: string, updates: Partial<UITask>): Promise<UITask> {
    const response = await fetch(`${this.config.baseUrl}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.statusText}`)
    }

    const updatedTask = await response.json()
    this.clearCache(`tasks/${taskId}`)
    this.clearCache('tasks')
    return updatedTask
  }

  // Versions API
  public async getVersions(taskId: string): Promise<Version[]> {
    return this.fetchWithCache<Version[]>(`/tasks/${taskId}/versions`)
  }

  public async createVersion(taskId: string, version: Partial<Version>): Promise<Version> {
    const response = await fetch(`${this.config.baseUrl}/tasks/${taskId}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(version)
    })

    if (!response.ok) {
      throw new Error(`Failed to create version: ${response.statusText}`)
    }

    const newVersion = await response.json()
    this.clearCache(`tasks/${taskId}/versions`)
    return newVersion
  }

  // Notifications API
  public async getNotifications(userId: string, options: QueryOptions = {}): Promise<DataResponse<Notification>> {
    const queryParams = new URLSearchParams()
    queryParams.set('userId', userId)
    if (options.limit) queryParams.set('limit', options.limit.toString())
    if (options.filters?.isRead !== undefined) {
      queryParams.set('isRead', options.filters.isRead.toString())
    }

    const endpoint = `/notifications?${queryParams.toString()}`
    return this.fetchWithCache<DataResponse<Notification>>(endpoint, {}, endpoint, 60000) // 1 minute cache
  }

  public async markNotificationRead(notificationId: string): Promise<void> {
    const response = await fetch(`${this.config.baseUrl}/notifications/${notificationId}/read`, {
      method: 'PATCH'
    })

    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.statusText}`)
    }

    this.clearCache('notifications')
  }

  // Search API
  public async search(query: string, type?: 'projects' | 'tasks' | 'all'): Promise<{
    projects: UIProject[]
    tasks: UITask[]
  }> {
    const queryParams = new URLSearchParams()
    queryParams.set('q', query)
    if (type && type !== 'all') queryParams.set('type', type)

    const endpoint = `/search?${queryParams.toString()}`
    return this.fetchWithCache<{ projects: UIProject[]; tasks: UITask[] }>(
      endpoint, 
      {}, 
      endpoint, 
      30000 // 30 seconds cache for search
    )
  }
}

// Development mode - use mock service
const isDevelopment = process.env.NODE_ENV === 'development'

// Create and export the appropriate service instance
export const dataService = isDevelopment ? mockDataService : new DataService()
