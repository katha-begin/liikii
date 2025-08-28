import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, Stack } from '@/components/layout'
import { Card, Badge, Button } from '@/components/ui'
import {
  Mail,
  User,
  FileText,
  GitBranch,
  Filter,
  CheckCircle,
  Plus,
  Search,
  MoreHorizontal,
  Archive,
  Trash2,
  ExternalLink,
  Reply,
  Forward,
  Star,
  Clock,
  AlertCircle,
  ChevronDown
} from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import { useTaskDetail } from '@/contexts/TaskDetailContext'
import { MessageComposer } from '@/components/inbox'
import type { EnhancedNotification } from '@/types/database'

const InboxPage: React.FC = () => {
  const navigate = useNavigate()
  const { state, actions } = useData()
  const { openTaskDetail } = useTaskDetail()

  // Get data from state
  const projects = state.projects?.items || []
  const regularNotifications = state.notifications?.items || []

  // Two-panel inbox state
  const [selectedNotification, setSelectedNotification] = useState<EnhancedNotification | null>(null)
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [replyToNotification, setReplyToNotification] = useState<EnhancedNotification | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'unread' | 'read'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'project' | 'priority'>('date')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  // Simple data transformation without memoization to avoid dependency issues
  const notifications: EnhancedNotification[] = regularNotifications.map(notification => {
    const project = projects.find(p => p.id === notification.projectId)
    return {
      ...notification,
      priority: notification.priority || 'medium',
      projectName: project?.name || 'Unknown Project',
      projectColor: project?.color || '#6366f1',
      canReply: notification.type === 'comment' || notification.type === 'mention',
      hasReplies: false,
      replyCount: 0,
      actionUrl: notification.relatedType === 'task' ? `/tasks/${notification.relatedId}` : undefined
    }
  })

  const loading = state.notifications?.loading || false
  const error = state.notifications?.error || null

  // Load data only once on mount
  useEffect(() => {
    if (regularNotifications.length === 0) {
      actions.loadNotifications('current_user')
    }
    if (projects.length === 0) {
      actions.loadProjects()
    }
  }, []) // Empty dependency array - only run once

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false)
      }
    }

    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isFilterDropdownOpen])

  // Simple filtering without memoization
  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      if (!notification.title.toLowerCase().includes(searchLower) &&
          !notification.description.toLowerCase().includes(searchLower) &&
          !notification.projectName.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // Read/unread filter
    if (filterBy === 'unread' && notification.status === 'read') return false
    if (filterBy === 'read' && notification.status !== 'read') return false

    // Project filter
    if (selectedProject !== 'all' && notification.projectId !== selectedProject) return false

    return true
  })

  // Simple sorting without memoization
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortBy) {
      case 'project':
        return a.projectName.localeCompare(b.projectName)
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // Event handlers
  const handleCompose = useCallback(() => {
    setIsComposerOpen(true)
    setReplyToNotification(null)
  }, [])

  const handleReply = useCallback((notification: EnhancedNotification) => {
    setReplyToNotification(notification)
    setIsComposerOpen(true)
  }, [])

  const handleSendMessage = useCallback(async (messageData: any) => {
    try {
      console.log('Sending message:', messageData)
      setIsComposerOpen(false)
      setReplyToNotification(null)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [])

  const handleNotificationClick = useCallback((notification: EnhancedNotification) => {
    setSelectedNotification(notification)
    // Mark as read when clicked
    if (notification.status !== 'read') {
      // TODO: Mark as read
    }
  }, [])

  const handleJumpToTask = useCallback(async (notification: EnhancedNotification) => {
    if (notification.relatedType === 'task' && notification.relatedId) {
      console.log('Jumping to task:', notification.relatedId)

      // Find the task in our current data
      let task = state.tasks?.items?.find(t => t.id === notification.relatedId)

      if (task) {
        openTaskDetail(task)
      } else {
        try {
          // If not found, try to load from JSON database
          const tasksData = await import('../../data/json_db/tasks.json')
          const allTasks = tasksData.default

          // Find the task in the JSON database
          const dbTask = allTasks.find((t: any) => t._id === notification.relatedId)

          if (dbTask) {
            // Convert database task to UI task format
            const uiTask = {
              id: dbTask._id,
              title: `${dbTask.task} - ${dbTask.episode} ${dbTask.sequence} ${dbTask.shot}`,
              project: dbTask.project,
              projectName: dbTask.project === 'SWA' ? 'Sky Wars Anthology' :
                          dbTask.project === 'RGD' ? 'Relic the Guardian of Dream' :
                          'Demo Project',
              type: dbTask.type,
              episode: dbTask.episode,
              sequence: dbTask.sequence,
              shot: dbTask.shot,
              task: dbTask.task,
              artist: dbTask.artist,
              assignee: dbTask.artist,
              status: dbTask.status,
              milestone: dbTask.milestone,
              milestone_note: dbTask.milestone_note,
              frame_range: dbTask.frame_range,
              priority: dbTask.priority,
              start_time: dbTask.start_time,
              deadline: dbTask.deadline,
              dueDate: dbTask.deadline,
              actual_time_logged: dbTask.actual_time_logged,
              estimated_duration_hours: dbTask.estimated_duration_hours,
              versions: dbTask.versions,
              current_version: dbTask.current_version,
              published_version: dbTask.published_version,
              file_extension: dbTask.file_extension,
              master_file: dbTask.master_file
            }

            openTaskDetail(uiTask)
            return
          }

          // If still not found, show error
          console.error('Task not found in database:', notification.relatedId)
          alert(`Task "${notification.relatedId}" not found. It may have been moved or deleted.`)
        } catch (error) {
          console.error('Error loading task data:', error)
          alert('Error loading task data. Please try again.')
        }
      }
    }
  }, [state.tasks?.items, openTaskDetail])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444'
      case 'high': return '#f97316'
      case 'medium': return '#eab308'
      case 'low': return '#22c55e'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Stack direction="horizontal" align="center" gap="sm">
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid var(--color-border)',
              borderTop: '2px solid var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Loading inbox...</span>
          </Stack>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div>Error loading inbox: {error}</div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {/* Two-Panel Layout - More Minimal Like Linear */}
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 80px)',
        gap: '1px',
        backgroundColor: 'var(--color-border)'
      }}>
        {/* Left Panel - Mail List (Narrower) */}
        <div style={{
          width: '320px',
          backgroundColor: 'var(--color-background)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header with filters - More Compact */}
          <div style={{
            padding: 'var(--space-3)',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-background)'
          }}>
            <Stack direction="horizontal" justify="between" align="center" style={{ marginBottom: 'var(--space-2)' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Inbox</h1>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={handleCompose}
              >
                Compose
              </Button>
            </Stack>

            {/* Search - More Compact */}
            <div style={{ position: 'relative', marginBottom: 'var(--space-2)' }}>
              <Search size={14} style={{
                position: 'absolute',
                left: 'var(--space-2)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)'
              }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-1) var(--space-2) var(--space-1) var(--space-8)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  backgroundColor: 'var(--color-surface)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Linear-style Filter Dropdown - Compact */}
            <div style={{ position: 'relative' }} ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  border: '1px solid var(--border-line)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface-1)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  height: '28px'
                }}
              >
                <Filter size={12} />
                Filter
                <ChevronDown size={12} style={{
                  transform: isFilterDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} />
              </button>

              {isFilterDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '200px',
                  marginTop: '2px',
                  backgroundColor: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-line)',
                  borderRadius: '6px',
                  boxShadow: 'var(--shadow-elev2)',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  {/* Notification Type */}
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px', padding: '0 12px' }}>
                      NOTIFICATION TYPE
                    </div>
                    {['all', 'unread', 'read'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilterBy(option as 'all' | 'unread' | 'read')
                          setIsFilterDropdownOpen(false)
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          padding: '6px 12px',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: filterBy === option ? 'var(--bg-surface-2)' : 'transparent',
                          color: filterBy === option ? 'var(--text-primary)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: 'background-color 0.1s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (filterBy !== option) {
                            e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (filterBy !== option) {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }
                        }}
                      >
                        {option === 'all' ? 'All notifications' : option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Project Filter */}
                  <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                      Project
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProject('all')
                        setIsFilterDropdownOpen(false)
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: 'var(--space-2)',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: selectedProject === 'all' ? 'var(--color-primary-light)' : 'transparent',
                        color: selectedProject === 'all' ? 'var(--color-primary)' : 'var(--color-text)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-sm)',
                        marginBottom: 'var(--space-1)'
                      }}
                    >
                      All projects
                    </button>
                    {projects.slice(0, 8).map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project.id)
                          setIsFilterDropdownOpen(false)
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: 'var(--space-2)',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: selectedProject === project.id ? 'var(--color-primary-light)' : 'transparent',
                          color: selectedProject === project.id ? 'var(--color-primary)' : 'var(--color-text)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-sm)',
                          marginBottom: 'var(--space-1)'
                        }}
                      >
                        {project.name}
                      </button>
                    ))}
                  </div>

                  {/* Sort Options */}
                  <div style={{ padding: 'var(--space-3)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                      Sort by
                    </div>
                    {[
                      { value: 'date', label: 'Date' },
                      { value: 'project', label: 'Project' },
                      { value: 'priority', label: 'Priority' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as 'date' | 'project' | 'priority')
                          setIsFilterDropdownOpen(false)
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: 'var(--space-2)',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: sortBy === option.value ? 'var(--color-primary-light)' : 'transparent',
                          color: sortBy === option.value ? 'var(--color-primary)' : 'var(--color-text)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-sm)',
                          marginBottom: 'var(--space-1)'
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mail List */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {sortedNotifications.length === 0 ? (
              <div style={{
                padding: 'var(--space-8)',
                textAlign: 'center',
                color: 'var(--color-text-secondary)'
              }}>
                <Mail size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
                <p>No messages found</p>
              </div>
            ) : (
              sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    borderBottom: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    backgroundColor: selectedNotification?.id === notification.id
                      ? 'var(--color-primary-50)'
                      : 'transparent',
                    borderLeft: selectedNotification?.id === notification.id
                      ? '2px solid var(--color-primary)'
                      : '2px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedNotification?.id !== notification.id) {
                      e.currentTarget.style.backgroundColor = 'var(--color-background-hover)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedNotification?.id !== notification.id) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: notification.status === 'read' ? 'transparent' : 'var(--color-primary)',
                            flexShrink: 0
                          }}
                        />
                        <span style={{
                          fontSize: '13px',
                          fontWeight: notification.status === 'read' ? 'normal' : '500',
                          color: 'var(--color-text)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {notification.title}
                        </span>
                      </div>

                      <p style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: '1.3'
                      }}>
                        {notification.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>
                        <span style={{
                          fontSize: '11px',
                          color: notification.projectColor,
                          backgroundColor: notification.projectColor + '15',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          {notification.projectName}
                        </span>

                        {notification.priority !== 'medium' && (
                          <div
                            style={{
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              backgroundColor: getPriorityColor(notification.priority)
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div style={{
                      fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      flexShrink: 0,
                      marginLeft: 'var(--space-2)',
                      fontWeight: '500'
                    }}>
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Message Detail */}
        <div style={{
          flex: 1,
          backgroundColor: 'var(--color-background)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {selectedNotification ? (
            <>
              {/* Message Header */}
              <div style={{
                padding: 'var(--space-4)',
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)'
              }}>
                <Stack direction="horizontal" justify="between" align="start">
                  <div style={{ flex: 1 }}>
                    <h2 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      margin: '0 0 var(--space-2) 0',
                      color: 'var(--color-text)'
                    }}>
                      {selectedNotification.title}
                    </h2>

                    <Stack direction="horizontal" align="center" gap="sm" style={{ marginBottom: 'var(--space-3)' }}>
                      <Badge
                        variant="default"
                        size="sm"
                        style={{
                          backgroundColor: selectedNotification.projectColor + '20',
                          color: selectedNotification.projectColor,
                          border: `1px solid ${selectedNotification.projectColor}40`
                        }}
                      >
                        {selectedNotification.projectName}
                      </Badge>

                      <Badge
                        variant={selectedNotification.priority === 'urgent' ? 'danger' :
                                selectedNotification.priority === 'high' ? 'warning' : 'default'}
                        size="sm"
                      >
                        {selectedNotification.priority}
                      </Badge>

                      <span style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        {new Date(selectedNotification.createdAt).toLocaleString()}
                      </span>
                    </Stack>
                  </div>

                  <Stack direction="horizontal" gap="sm">
                    {selectedNotification.actionUrl && (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<ExternalLink size={16} />}
                        onClick={() => handleJumpToTask(selectedNotification)}
                      >
                        View Task
                      </Button>
                    )}

                    {selectedNotification.canReply && (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Reply size={16} />}
                        onClick={() => handleReply(selectedNotification)}
                      >
                        Reply
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<MoreHorizontal size={16} />}
                    >
                    </Button>
                  </Stack>
                </Stack>
              </div>

              {/* Message Content */}
              <div style={{
                flex: 1,
                padding: 'var(--space-4)',
                overflow: 'auto'
              }}>
                <div style={{
                  fontSize: 'var(--text-base)',
                  lineHeight: '1.6',
                  color: 'var(--color-text)'
                }}>
                  {selectedNotification.description}
                </div>

                {/* Related Task Info */}
                {selectedNotification.relatedType === 'task' && selectedNotification.relatedId && (
                  <Card style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)' }}>
                    <Stack direction="horizontal" align="center" gap="sm">
                      <FileText size={16} style={{ color: 'var(--color-text-secondary)' }} />
                      <div>
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: '500',
                          margin: 0,
                          color: 'var(--color-text)'
                        }}>
                          Related Task
                        </p>
                        <p style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-secondary)',
                          margin: 0
                        }}>
                          Task ID: {selectedNotification.relatedId}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<ExternalLink size={14} />}
                        onClick={() => handleJumpToTask(selectedNotification)}
                        style={{ marginLeft: 'auto' }}
                      >
                        Open Task
                      </Button>
                    </Stack>
                  </Card>
                )}
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <Mail size={64} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
                <p style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Composer */}
      <MessageComposer
        isOpen={isComposerOpen}
        onClose={() => {
          setIsComposerOpen(false)
          setReplyToNotification(null)
        }}
        onSend={handleSendMessage}
        replyTo={replyToNotification || undefined}
        relatedTaskId={replyToNotification?.relatedType === 'task' ? replyToNotification.relatedId : undefined}
        relatedProjectId={replyToNotification?.projectId}
      />
    </PageWrapper>
  )
}

export default InboxPage
