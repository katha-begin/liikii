import React, { useCallback, useMemo, useState } from 'react'
import { TimelineEvent, TimelineMilestone, KanbanTask } from '@/types/designSystem'
import { Stack } from '@/components/layout'
import { Search, ChevronLeft, ChevronRight, X, User, Calendar, Clock, Tag } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Avatar from '../ui/Avatar'
import Input from '../ui/Input'

interface TimelineWidgetProps {
  title?: string
  events?: TimelineEvent[]
  milestones?: TimelineMilestone[]
  tasks?: KanbanTask[]
  groupByDepartment?: boolean
  showPropertiesPanel?: boolean
  showFilters?: boolean
  startDate?: string
  endDate?: string
  viewMode?: 'days' | 'weeks' | 'months' | 'quarters'
  showToday?: boolean
  showWeekends?: boolean
  height?: string | number
  zoomable?: boolean
  interactive?: boolean
  onEventClick?: (event: TimelineEvent) => void
  onMilestoneClick?: (milestone: TimelineMilestone) => void
  onDateRangeChange?: (startDate: string, endDate: string) => void
  onTaskClick?: (task: KanbanTask) => void
  style?: React.CSSProperties
  className?: string
}

interface DepartmentRow {
  id: string
  name: string
  color: string
  tasks: KanbanTask[]
}

interface TaskWithEvent {
  task: KanbanTask
  event: TimelineEvent
}

// Helper function to get today's position on timeline
const getTodayPosition = (): string => {
  // This would calculate today's position based on the timeline range
  // For now, return a placeholder
  return '50%'
}

// Helper function to convert KanbanTask to TimelineEvent
const convertTaskToTimelineEvent = (task: KanbanTask): TimelineEvent => {
  const startDate = task.createdAt

  let endDate = task.dueDate
  if (!endDate && task.estimatedHours) {
    const estimatedDays = Math.ceil(task.estimatedHours / 8)
    endDate = new Date(new Date(startDate).getTime() + estimatedDays * 24 * 60 * 60 * 1000).toISOString()
  }

  const statusMap: Record<string, 'not_started' | 'in_progress' | 'completed' | 'overdue'> = {
    'not_started': 'not_started',
    'in_progress': 'in_progress',
    'review': 'in_progress',
    'approved': 'completed',
    'done': 'completed',
    'completed': 'completed'
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'approved' && task.status !== 'completed'

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    startDate,
    endDate,
    type: 'task',
    status: isOverdue ? 'overdue' : statusMap[task.status] || 'not_started',
    assignee: task.assignee,
    color: task.labels?.[0]?.color || getStatusColor(task.status),
    priority: task.priority,
    projectId: task.projectId,
    progress: calculateTaskProgress(task),
    tags: task.labels?.map(label => label.name) || []
  }
}

// Helper function to get status color using design system pastels
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'not_started': 'var(--text-secondary)',
    'in_progress': 'var(--accent-blue)',
    'review': 'var(--accent-butter)',
    'approved': 'var(--accent-mint)',
    'completed': 'var(--semantic-success)'
  }
  return colorMap[status] || 'var(--text-secondary)'
}

// Helper function to calculate task progress
const calculateTaskProgress = (task: KanbanTask): number => {
  if (task.status === 'approved' || task.status === 'completed') return 100
  if (task.status === 'review') return 80
  if (task.status === 'in_progress') return 50
  return 0
}

// Helper function to get status badge variant
const getStatusVariant = (status: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  const variantMap: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
    'not_started': 'secondary',
    'in_progress': 'primary',
    'review': 'warning',
    'approved': 'success',
    'completed': 'success'
  }
  return variantMap[status] || 'default'
}

// Helper function to get priority badge variant
const getPriorityVariant = (priority: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  const variantMap: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
    'low': 'secondary',
    'medium': 'primary',
    'high': 'warning',
    'urgent': 'danger'
  }
  return variantMap[priority] || 'default'
}

const TimelineWidget: React.FC<TimelineWidgetProps> = ({
  title,
  events = [],
  milestones = [],
  tasks = [],
  groupByDepartment = true,
  showPropertiesPanel = true,
  showFilters = true,
  startDate,
  endDate,
  viewMode = 'weeks',
  showToday = true,
  showWeekends = true,
  height = '400px',
  zoomable = true,
  interactive = true,
  onEventClick,
  onMilestoneClick,
  onDateRangeChange,
  onTaskClick,
  style,
  className
}) => {
  // State for filters and interactions
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [userFilter, setUserFilter] = useState('all')
  const [sequenceFilter, setSequenceFilter] = useState('all')
  const [selectedTask, setSelectedTask] = useState<TaskWithEvent | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  // Department configuration with design system pastel colors
  const departments = useMemo(() => [
    { id: 'animation', name: 'Animation', color: 'var(--accent-blue)' },
    { id: 'modeling', name: 'Modeling', color: 'var(--accent-butter)' },
    { id: 'lighting', name: 'Lighting', color: 'var(--accent-pink)' },
    { id: 'compositing', name: 'Compositing', color: 'var(--accent-mint)' },
    { id: 'fx', name: 'FX', color: 'var(--accent-lilac)' },
    { id: 'rigging', name: 'Rigging', color: 'var(--semantic-info)' },
    { id: 'general', name: 'General', color: 'var(--text-secondary)' }
  ], [])

  // Get department from task labels or default to general
  const getTaskDepartment = useCallback((task: KanbanTask): string => {
    const departmentLabels = task.labels?.find(label =>
      departments.some(dept => dept.name.toLowerCase() === label.name.toLowerCase())
    )
    return departmentLabels?.name.toLowerCase() || 'general'
  }, [departments])

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Department filter
      if (departmentFilter !== 'all' && getTaskDepartment(task) !== departmentFilter) {
        return false
      }

      // User filter
      if (userFilter !== 'all' && task.assignee?.id !== userFilter) {
        return false
      }

      return true
    })
  }, [tasks, searchQuery, departmentFilter, userFilter, getTaskDepartment])

  // Group tasks by department
  const departmentRows = useMemo((): DepartmentRow[] => {
    return departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      color: dept.color,
      tasks: filteredTasks.filter(task => getTaskDepartment(task) === dept.id)
    })).filter(row => row.tasks.length > 0)
  }, [departments, filteredTasks, getTaskDepartment])

  // Calculate date range from tasks
  const dateRange = useMemo(() => {
    if (startDate && endDate) {
      return { start: startDate, end: endDate }
    }

    const taskDates = filteredTasks.flatMap(task => [
      task.createdAt,
      task.dueDate
    ]).filter(Boolean).map(date => new Date(date))

    if (taskDates.length === 0) {
      const now = new Date()
      const start = new Date(now)
      start.setMonth(start.getMonth() - 1)
      const end = new Date(now)
      end.setMonth(end.getMonth() + 2)
      return {
        start: start.toISOString(),
        end: end.toISOString()
      }
    }

    const earliest = new Date(Math.min(...taskDates.map(d => d.getTime())))
    const latest = new Date(Math.max(...taskDates.map(d => d.getTime())))

    // Add padding
    earliest.setDate(earliest.getDate() - 7)
    latest.setDate(latest.getDate() + 14)

    return {
      start: earliest.toISOString(),
      end: latest.toISOString()
    }
  }, [filteredTasks, startDate, endDate])

  // Generate timeline header (months/weeks)
  const timelineHeader = useMemo(() => {
    const start = new Date(dateRange.start)
    const end = new Date(dateRange.end)
    const months = []

    const current = new Date(start.getFullYear(), start.getMonth(), 1)
    while (current <= end) {
      months.push({
        date: new Date(current),
        label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      })
      current.setMonth(current.getMonth() + 1)
    }

    return months
  }, [dateRange])

  // Event handlers
  const handleTaskClick = useCallback((task: KanbanTask) => {
    const event = convertTaskToTimelineEvent(task)
    setSelectedTask({ task, event })
    setIsPanelOpen(true)
    onTaskClick?.(task)
  }, [onTaskClick])

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false)
    setSelectedTask(null)
  }, [])

  // Calculate task position and width on timeline
  const getTaskPosition = useCallback((task: KanbanTask) => {
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    const taskStart = new Date(task.createdAt)
    const taskEnd = task.dueDate ? new Date(task.dueDate) : new Date(taskStart.getTime() + (task.estimatedHours || 8) * 60 * 60 * 1000)

    const startOffset = Math.max(0, Math.ceil((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    const duration = Math.max(1, Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)))

    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    }
  }, [dateRange])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: height,
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-primary)',
      borderRadius: '8px',
      overflow: 'hidden',
      ...style
    }} className={className}>

      {/* Header */}
      {title && (
        <div style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid var(--border-secondary)'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            {title}
          </h3>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-secondary)',
          backgroundColor: 'var(--bg-surface-2)'
        }}>
          <Stack direction="horizontal" gap="md" align="center" wrap>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '200px' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-line)',
                backgroundColor: 'var(--bg-surface-1)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all" style={{ backgroundColor: 'var(--bg-surface-1)', color: 'var(--text-primary)' }}>Filter by department...</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id} style={{ backgroundColor: 'var(--bg-surface-1)', color: 'var(--text-primary)' }}>{dept.name}</option>
              ))}
            </select>

            {/* User Filter */}
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-line)',
                backgroundColor: 'var(--bg-surface-1)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all" style={{ backgroundColor: 'var(--bg-surface-1)', color: 'var(--text-primary)' }}>Filter by user...</option>
              {Array.from(new Set(tasks.map(t => t.assignee).filter(Boolean))).map(assignee => (
                <option key={assignee!.id} value={assignee!.id} style={{ backgroundColor: 'var(--bg-surface-1)', color: 'var(--text-primary)' }}>{assignee!.name}</option>
              ))}
            </select>
          </Stack>
        </div>
      )}

      {/* Main Timeline Content */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>

        {/* Timeline Header */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: showPropertiesPanel && isPanelOpen ? '320px' : 0,
          height: '90px',
          borderBottom: '1px solid var(--border-line)',
          backgroundColor: 'var(--bg-surface-1)',
          zIndex: 10
        }}>
          {/* Period Navigator Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            borderBottom: '1px solid var(--border-line)'
          }}>
            {/* Left spacer for department panel */}
            <div style={{ width: '280px', borderRight: '1px solid var(--border-line)' }}>
              <div style={{
                padding: '0 16px',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--text-primary)'
              }}>
                Tasks
              </div>
            </div>

            {/* Period Controls */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px'
            }}>
              {/* View Mode Controls */}
              <div style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center'
              }}>
                {['Days', 'Weeks', 'Months', 'Quarters'].map(mode => (
                  <button
                    key={mode}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: viewMode === mode.toLowerCase() ? 'var(--accent-blue)' : 'transparent',
                      color: viewMode === mode.toLowerCase() ? 'var(--bg-base)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: viewMode === mode.toLowerCase() ? 600 : 400
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Navigation Controls */}
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <Button variant="ghost" size="sm">
                  <ChevronLeft size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Date Headers Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '50px'
          }}>
            {/* Left spacer for department panel */}
            <div style={{ width: '280px', borderRight: '1px solid var(--border-line)' }} />

            {/* Month Headers */}
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 16px'
            }}>
              <div style={{
                display: 'flex',
                gap: '32px',
                alignItems: 'center'
              }}>
                {timelineHeader.slice(0, 4).map(month => (
                  <div key={month.date.getTime()} style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    minWidth: '80px',
                    textAlign: 'center'
                  }}>
                    {month.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          display: 'flex',
          width: '100%',
          marginTop: '90px',
          height: 'calc(100% - 60px)'
        }}>

          {/* Left Panel - Department Labels */}
          <div style={{
            width: '280px',
            borderRight: '1px solid var(--border-line)',
            backgroundColor: 'var(--bg-surface-2)',
            overflow: 'hidden'
          }}>
            {departmentRows.map((row, index) => (
              <div key={row.id} style={{
                height: '60px',
                borderBottom: index < departmentRows.length - 1 ? '1px solid var(--border-line)' : 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                backgroundColor: `color-mix(in srgb, ${row.color} 8%, transparent)`,
                borderLeft: `3px solid ${row.color}`
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: row.color,
                  marginRight: '8px'
                }} />
                <div>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'var(--text-primary)'
                  }}>
                    {row.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    {row.tasks.length} task{row.tasks.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel - Timeline Rows */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            position: 'relative'
          }}>
            {departmentRows.map((row, rowIndex) => (
              <div key={row.id} style={{
                height: '60px',
                borderBottom: rowIndex < departmentRows.length - 1 ? '1px solid var(--border-line)' : 'none',
                position: 'relative',
                backgroundColor: `color-mix(in srgb, ${row.color} 4%, var(--bg-surface-1))`
              }}>
                {/* Task Bars */}
                {row.tasks.map(task => {
                  const position = getTaskPosition(task)
                  const departmentColor = row.color

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        height: '36px',
                        left: position.left,
                        width: position.width,
                        backgroundColor: departmentColor,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease',
                        overflow: 'hidden',
                        minWidth: '80px',
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                      }}>
                        {task.title}
                      </div>

                      {task.assignee && (
                        <Avatar
                          src={task.assignee.avatar}
                          fallback={task.assignee.name}
                          size="xs"
                          style={{ marginLeft: '8px' }}
                        />
                      )}
                    </div>
                  )
                })}

                {/* Today Line */}
                {showToday && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: getTodayPosition(),
                    width: '2px',
                    backgroundColor: 'var(--semantic-danger)',
                    zIndex: 10,
                    opacity: 0.8
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Properties Panel - Contained within widget */}
        {showPropertiesPanel && isPanelOpen && selectedTask && (
          <div style={{
            position: 'absolute',
            top: '90px',
            right: 0,
            width: '320px',
            height: 'calc(100% - 90px)',
            backgroundColor: 'var(--bg-surface-1)',
            borderLeft: '1px solid var(--border-line)',
            padding: '16px',
            overflowY: 'auto',
            boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
            zIndex: 20
          }}>
            {/* Panel Header */}
            <Stack direction="horizontal" justify="between" align="center" style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Task Details
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClosePanel}
              >
                <X size={16} />
              </Button>
            </Stack>

            {/* Task Information */}
            <Stack direction="vertical" gap="md">
              {/* Title & Description */}
              <div>
                <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedTask.task.title}
                </h5>
                {selectedTask.task.description && (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {selectedTask.task.description}
                  </p>
                )}
              </div>

              {/* Status & Priority */}
              <div>
                <Stack direction="horizontal" gap="sm" wrap>
                  <Badge variant={getStatusVariant(selectedTask.task.status)} size="sm">
                    {selectedTask.task.status.replace('_', ' ')}
                  </Badge>
                  {selectedTask.task.priority && (
                    <Badge variant={getPriorityVariant(selectedTask.task.priority)} size="sm">
                      {selectedTask.task.priority}
                    </Badge>
                  )}
                </Stack>
              </div>

              {/* Assignee */}
              {selectedTask.task.assignee && (
                <div>
                  <Stack direction="horizontal" align="center" gap="sm">
                    <User size={14} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Assignee:</span>
                    <Stack direction="horizontal" align="center" gap="xs">
                      <Avatar
                        src={selectedTask.task.assignee.avatar}
                        fallback={selectedTask.task.assignee.name}
                        size="xs"
                      />
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                        {selectedTask.task.assignee.name}
                      </span>
                    </Stack>
                  </Stack>
                </div>
              )}

              {/* Timeline Data */}
              <div>
                <Stack direction="vertical" gap="xs">
                  <Stack direction="horizontal" align="center" gap="sm">
                    <Calendar size={14} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Created:</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {new Date(selectedTask.task.createdAt).toLocaleDateString()}
                    </span>
                  </Stack>
                  {selectedTask.task.dueDate && (
                    <Stack direction="horizontal" align="center" gap="sm">
                      <Calendar size={14} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Due:</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {new Date(selectedTask.task.dueDate).toLocaleDateString()}
                      </span>
                    </Stack>
                  )}
                </Stack>
              </div>

              {/* Time Estimate */}
              {selectedTask.task.estimatedHours && (
                <div>
                  <Stack direction="horizontal" align="center" gap="sm">
                    <Clock size={14} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Estimated:</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {selectedTask.task.estimatedHours}h
                    </span>
                  </Stack>
                </div>
              )}
            </Stack>
          </div>
        )}

        {/* Properties Panel - Contained within widget */}
        {showPropertiesPanel && isPanelOpen && selectedTask && (
          <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '320px',
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: '0 8px 8px 0',
          padding: '16px',
          overflowY: 'auto',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
          zIndex: 20
        }}>
          {/* Panel Header */}
          <Stack direction="horizontal" justify="between" align="center" style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
              Task Details
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClosePanel}
            >
              <X size={16} />
            </Button>
          </Stack>

          {/* Task Information */}
          <Stack direction="vertical" gap="md">
            {/* Title & Description */}
            <div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>
                {selectedTask.task.title}
              </h5>
              {selectedTask.task.description && (
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {selectedTask.task.description}
                </p>
              )}
            </div>

            {/* Status & Priority */}
            <div>
              <Stack direction="horizontal" gap="sm" wrap>
                <Badge variant={getStatusVariant(selectedTask.task.status)} size="sm">
                  {selectedTask.task.status.replace('_', ' ')}
                </Badge>
                {selectedTask.task.priority && (
                  <Badge variant={getPriorityVariant(selectedTask.task.priority)} size="sm">
                    {selectedTask.task.priority}
                  </Badge>
                )}
              </Stack>
            </div>

            {/* Assignee */}
            {selectedTask.task.assignee && (
              <div>
                <Stack direction="horizontal" align="center" gap="sm">
                  <User size={14} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Assignee:</span>
                  <Stack direction="horizontal" align="center" gap="xs">
                    <Avatar
                      src={selectedTask.task.assignee.avatar}
                      fallback={selectedTask.task.assignee.name}
                      size="xs"
                    />
                    <span style={{ fontSize: '13px' }}>
                      {selectedTask.task.assignee.name}
                    </span>
                  </Stack>
                </Stack>
              </div>
            )}

            {/* Timeline Data */}
            <div>
              <Stack direction="vertical" gap="xs">
                <Stack direction="horizontal" align="center" gap="sm">
                  <Calendar size={14} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Created:</span>
                  <span style={{ fontSize: '13px' }}>
                    {new Date(selectedTask.task.createdAt).toLocaleDateString()}
                  </span>
                </Stack>
                {selectedTask.task.dueDate && (
                  <Stack direction="horizontal" align="center" gap="sm">
                    <Calendar size={14} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Due:</span>
                    <span style={{ fontSize: '13px' }}>
                      {new Date(selectedTask.task.dueDate).toLocaleDateString()}
                    </span>
                  </Stack>
                )}
              </Stack>
            </div>

            {/* Time Estimate */}
            {selectedTask.task.estimatedHours && (
              <div>
                <Stack direction="horizontal" align="center" gap="sm">
                  <Clock size={14} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Estimated:</span>
                  <span style={{ fontSize: '13px' }}>
                    {selectedTask.task.estimatedHours}h
                  </span>
                </Stack>
              </div>
            )}
          </Stack>
          </div>
        )}
      </div>
    </div>
  )
}

export default TimelineWidget