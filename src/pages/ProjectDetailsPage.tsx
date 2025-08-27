import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Users, Calendar, TrendingUp, Clock, Play, Palette, Zap, Eye, Film, Settings } from 'lucide-react'
import { PageWrapper, Stack, Grid } from '@/components/layout'
import { Button, Badge, Card, Input } from '@/components/ui'
import { useProject, useProjectTasks } from '@/hooks/useData'
import { useTaskDetail } from '@/contexts/TaskDetailContext'

// Department configuration with icons and colors
const DEPARTMENTS = {
  modeling: { name: 'Modeling', icon: <Settings size={16} />, color: '#FF6B6B' },
  rigging: { name: 'Rigging', icon: <Zap size={16} />, color: '#4ECDC4' },
  animation: { name: 'Animation', icon: <Play size={16} />, color: '#45B7D1' },
  layout: { name: 'Layout', icon: <Eye size={16} />, color: '#96CEB4' },
  lighting: { name: 'Lighting', icon: <Calendar size={16} />, color: '#FFEAA7' },
  comp: { name: 'Compositing', icon: <Film size={16} />, color: '#DDA0DD' },
  fx: { name: 'FX', icon: <Zap size={16} />, color: '#FFB347' },
  lookdev: { name: 'Look Dev', icon: <Palette size={16} />, color: '#98D8C8' }
}

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { openTaskDetail } = useTaskDetail()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Use data hooks
  const { project, loading: projectLoading, error: projectError } = useProject(projectId || null)
  const { tasks, loading: tasksLoading, error: tasksError } = useProjectTasks(projectId || '')

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.shot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sequence.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDepartment = selectedDepartment === 'all' || task.task === selectedDepartment
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Group tasks by department
  const tasksByDepartment = filteredTasks.reduce((acc, task) => {
    const dept = task.task
    if (!acc[dept]) {
      acc[dept] = []
    }
    acc[dept].push(task)
    return acc
  }, {} as Record<string, typeof tasks>)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'not_started': return 'default'
      case 'in_progress': return 'primary'
      case 'review': return 'warning'
      case 'approved': return 'success'
      default: return 'default'
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

  // Show loading state
  if (projectLoading || tasksLoading) {
    return (
      <PageWrapper maxWidth="xl" padding>
        <Stack direction="vertical" gap="lg" align="center" style={{ paddingTop: '4rem' }}>
          <div className="loading-spinner">Loading project details...</div>
        </Stack>
      </PageWrapper>
    )
  }

  // Show error state
  if (projectError || tasksError || !project) {
    return (
      <PageWrapper maxWidth="xl" padding>
        <Stack direction="vertical" gap="lg" align="center" style={{ paddingTop: '4rem' }}>
          <div className="error-message">
            <h2 className="text-h2">Error loading project</h2>
            <p className="text-body text-secondary">
              {projectError || tasksError || 'Project not found'}
            </p>
            <Button variant="primary" onClick={() => navigate('/projects')}>
              Back to Projects
            </Button>
          </div>
        </Stack>
      </PageWrapper>
    )
  }

  const completedTasks = tasks.filter(t => t.status === 'approved').length
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  return (
    <PageWrapper maxWidth="xl" padding>
      <Stack direction="vertical" gap="lg">
        {/* Header */}
        <Stack direction="horizontal" align="center" gap="md">
          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/projects')}
          >
            Back to Projects
          </Button>
          <div 
            className="project-color-indicator" 
            style={{ backgroundColor: project.color }}
          />
          <div>
            <h1 className="text-h1">{project.name}</h1>
            <p className="text-body text-secondary">{project.description}</p>
          </div>
        </Stack>

        {/* Project Stats Overview */}
        <Card className="project-overview">
          <Stack direction="horizontal" gap="xl" align="center">
            <div className="overview-stat">
              <div className="stat-icon">
                <TrendingUp size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{tasks.length}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
            </div>
            <div className="overview-stat">
              <div className="stat-icon">
                <Users size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{project.memberCount}</span>
                <span className="stat-label">Team Members</span>
              </div>
            </div>
            <div className="overview-stat">
              <div className="stat-icon">
                <Clock size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{Math.round(progressPercentage)}%</span>
                <span className="stat-label">Complete</span>
              </div>
            </div>
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="progress-text">
                {completedTasks} of {tasks.length} tasks completed
              </span>
            </div>
          </Stack>
        </Card>

        {/* Filters */}
        <Stack direction="horizontal" gap="md" align="center">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={16} />}
            style={{ maxWidth: '300px' }}
          />
          
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Departments</option>
            {Object.entries(DEPARTMENTS).map(([key, dept]) => (
              <option key={key} value={key}>{dept.name}</option>
            ))}
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="approved">Approved</option>
          </select>

          <span className="text-caption text-secondary">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </span>
        </Stack>

        {/* Tasks by Department */}
        {Object.keys(tasksByDepartment).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3 className="text-h3">No tasks found</h3>
              <p className="text-body text-secondary">
                No tasks match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          </div>
        ) : (
          <Stack direction="vertical" gap="xl">
            {Object.entries(tasksByDepartment).map(([deptKey, deptTasks]) => {
              const department = DEPARTMENTS[deptKey as keyof typeof DEPARTMENTS] || 
                { name: deptKey, icon: <Settings size={16} />, color: '#999' }
              
              return (
                <div key={deptKey} className="department-section">
                  <div className="department-header">
                    <div className="department-info">
                      <div 
                        className="department-icon" 
                        style={{ color: department.color }}
                      >
                        {department.icon}
                      </div>
                      <h2 className="department-name">{department.name}</h2>
                      <Badge variant="default" size="sm">
                        {deptTasks.length} task{deptTasks.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>

                  <Grid cols={1} gap="sm" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
                    {deptTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="task-card clickable"
                        onClick={() => openTaskDetail(task)}
                      >
                        <Stack direction="vertical" gap="sm">
                          <Stack direction="horizontal" justify="between" align="start">
                            <div>
                              <h3 className="task-title">{task.title}</h3>
                              <p className="task-subtitle">
                                {task.episode} • {task.sequence} • {task.shot}
                              </p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(task.status)} size="sm">
                              {task.status.replace('_', ' ')}
                            </Badge>
                          </Stack>

                          {task.milestone_note && (
                            <p className="task-note">{task.milestone_note}</p>
                          )}

                          <Stack direction="horizontal" justify="between" align="center">
                            <Stack direction="horizontal" gap="md" align="center">
                              <span className="task-meta">
                                <Clock size={12} />
                                {task.actual_time_logged}h / {task.estimated_duration_hours}h
                              </span>
                              {task.frame_range && (
                                <span className="task-meta">
                                  <Film size={12} />
                                  {task.frame_range.start}-{task.frame_range.end}
                                </span>
                              )}
                            </Stack>
                            {task.dueDate && (
                              <span className="task-due-date">
                                {formatDueDate(task.dueDate)}
                              </span>
                            )}
                          </Stack>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </div>
              )
            })}
          </Stack>
        )}
      </Stack>
    </PageWrapper>
  )
}

export default ProjectDetailsPage
