import React, { useState } from 'react'
import { PageWrapper, Stack, Grid } from '@/components/layout'
import { Card, Badge, Button } from '@/components/ui'
import { Calendar, Clock, Flag, Play, Film, Filter, MoreHorizontal } from 'lucide-react'
// import { UITask } from '@/types/database'
import { useMyTasks } from '@/hooks/useData'

const MyTasksPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'review' | 'approved'>('all')
  
  // Use data management hooks
  const { tasks, loading, error, refresh } = useMyTasks('current_user')

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true
    return task.status === filterStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'not_started': return 'default'
      case 'in_progress': return 'primary'
      case 'review': return 'warning'
      case 'approved': return 'success'
      default: return 'default'
    }
  }

  const getTaskIcon = (taskType: string) => {
    switch (taskType?.toLowerCase()) {
      case 'animation': return <Play size={16} />
      case 'lighting': return <Calendar size={16} />
      case 'comp': return <Film size={16} />
      default: return <Calendar size={16} />
    }
  }

  const formatDueDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    if (diffDays < 7) return `Due in ${diffDays} days`
    return date.toLocaleDateString()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger'
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'default'
      default: return 'default'
    }
  }

  // const handleTaskUpdate = async (taskId: string, updates: Partial<UITask>) => {
  //   try {
  //     await updateTask(taskId, updates)
  //   } catch (error) {
  //     console.error('Failed to update task:', error)
  //     alert('Failed to update task. Please try again.')
  //   }
  // }

  // Show loading state
  if (loading && tasks.length === 0) {
    return (
      <PageWrapper maxWidth="lg" padding>
        <Stack direction="vertical" gap="lg" align="center" style={{ paddingTop: '4rem' }}>
          <div className="loading-spinner">Loading tasks...</div>
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
            <h2 className="text-h2">Error loading tasks</h2>
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
            <h1 className="text-h1">My Tasks</h1>
            <p className="text-body text-secondary">
              Track your assigned tasks and progress
            </p>
          </div>
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filter
          </Button>
        </Stack>

        {/* Filter Row */}
        <Stack direction="horizontal" gap="sm" align="center">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All tasks</option>
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="review">In review</option>
            <option value="approved">Approved</option>
          </select>
          <span className="text-caption text-secondary">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </span>
        </Stack>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3 className="text-h3">No tasks found</h3>
              <p className="text-body text-secondary">
                {filterStatus === 'all' 
                  ? "You don't have any assigned tasks yet."
                  : `No tasks match the "${filterStatus}" status filter.`
                }
              </p>
            </div>
          </div>
        ) : (
          <Grid cols={1} gap="md" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {filteredTasks.map((task) => (
              <Card key={task.id} className="task-card">
                <Stack direction="vertical" gap="md">
                  {/* Task Header */}
                  <Stack direction="horizontal" justify="between" align="start">
                    <Stack direction="horizontal" gap="sm" align="center">
                      {getTaskIcon(task.task)}
                      <div>
                        <h3 className="text-h3">{task.title}</h3>
                        <p className="text-caption text-secondary">
                          {task.projectName} • {task.episode} {task.sequence} {task.shot}
                        </p>
                      </div>
                    </Stack>
                    <button className="task-menu-btn">
                      <MoreHorizontal size={16} />
                    </button>
                  </Stack>

                  {/* Task Status and Priority */}
                  <Stack direction="horizontal" gap="sm" align="center">
                    <Badge variant={getStatusBadgeVariant(task.status)} size="sm">
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant={getPriorityColor(task.priority)} size="sm">
                      <Flag size={12} />
                      {task.priority}
                    </Badge>
                  </Stack>

                  {/* Task Details */}
                  <Stack direction="vertical" gap="sm">
                    {task.milestone_note && (
                      <p className="text-body text-secondary">{task.milestone_note}</p>
                    )}
                    
                    <Stack direction="horizontal" justify="between" align="center">
                      <Stack direction="horizontal" gap="sm" align="center">
                        <Clock size={14} />
                        <span className="text-caption text-secondary">
                          {task.actual_time_logged}h / {task.estimated_duration_hours}h
                        </span>
                      </Stack>
                      {task.dueDate && (
                        <span className="text-caption text-secondary">
                          {formatDueDate(task.dueDate)}
                        </span>
                      )}
                    </Stack>

                    {/* Progress Bar */}
                    <div className="progress-track">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${Math.min(100, (task.actual_time_logged / task.estimated_duration_hours) * 100)}%` 
                        }}
                      />
                    </div>

                    {/* Frame Range */}
                    {task.frame_range && (
                      <Stack direction="horizontal" gap="sm" align="center">
                        <Film size={14} />
                        <span className="text-caption text-secondary">
                          Frames {task.frame_range.start}-{task.frame_range.end}
                        </span>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Grid>
        )}
      </Stack>
    </PageWrapper>
  )
}

export default MyTasksPage
