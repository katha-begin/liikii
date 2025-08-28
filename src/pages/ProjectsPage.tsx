import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Download, Filter, LayoutGrid, List, Calendar, Users, MoreHorizontal, TrendingUp, Clock } from 'lucide-react'
import { PageWrapper, Stack, Grid, ScrollToTop } from '@/components/layout'
import { Button, Badge, Card } from '@/components/ui'
// import { UIProject } from '@/types/database'
import { useProjects, useSelection } from '@/hooks/useData'
import { CreateProjectModal } from '@/components/project/CreateProjectModal'

// Project color mapping
const getProjectColor = (projectId: string): string => {
  const colors = {
    'SWA': '#CBB7E8',
    'RGD': '#B7D3F2',
    'DEMO': '#F4C6D7'
  }
  return colors[projectId as keyof typeof colors] || '#CBB7E8'
}

// Tab interface
interface ProjectTab {
  id: string
  label: string
  count?: number
  isCreateNew?: boolean
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('projects')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Use data management hooks
  const { projects, loading, error, refresh, createProject } = useProjects()
  const { selectedProjects, toggleProjectSelection } = useSelection()

  // Filter projects based on current tab and status filter
  const filteredProjects = projects.filter(project => {
    if (activeTab === 'projects' && project.status !== 'active') return false
    if (filterStatus !== 'all' && project.status !== filterStatus) return false
    return true
  })

  const tabs: ProjectTab[] = [
    { id: 'projects', label: 'Projects', count: projects.filter(p => p.status === 'active').length },
    { id: 'all-projects', label: 'All projects', count: projects.length },
    { id: 'new-view', label: 'New view', isCreateNew: true }
  ]

  const handleCreateProject = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateProjectSubmit = async (projectData: any) => {
    try {
      await createProject({
        name: projectData.name,
        description: projectData.description,
        color: getProjectColor(projectData._id || 'NEW'),
        status: 'active'
      })
      refresh() // Refresh the projects list
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('Failed to create project. Please try again.')
    }
  }

  const handleImportProjects = () => {
    // TODO: Implement in Task 8 (CSV Import)
    alert('Project import coming with CSV import feature!')
    console.log('Import projects triggered')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  // Show loading state
  if (loading && projects.length === 0) {
    return (
      <PageWrapper maxWidth="xl" padding>
        <Stack direction="vertical" gap="lg" align="center" style={{ paddingTop: '4rem' }}>
          <div className="loading-spinner">Loading projects...</div>
        </Stack>
      </PageWrapper>
    )
  }

  // Show error state
  if (error) {
    return (
      <PageWrapper maxWidth="xl" padding>
        <Stack direction="vertical" gap="lg" align="center" style={{ paddingTop: '4rem' }}>
          <div className="error-message">
            <h2 className="text-h2">Error loading projects</h2>
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
    <>
      <PageWrapper maxWidth="xl" padding>
        <Stack direction="vertical" gap="lg">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center">
          <div>
            <h1 className="text-h1">Projects</h1>
            <p className="text-body text-secondary">
              Organize and manage your creative projects
            </p>
          </div>
          <Stack direction="horizontal" gap="sm">
            <Button variant="secondary" leftIcon={<Download size={16} />}>
              Documentation
            </Button>
            <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleCreateProject}>
              Create new project
            </Button>
          </Stack>
        </Stack>

        {/* Tabs */}
        <div className="project-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`project-tab ${activeTab === tab.id ? 'active' : ''} ${tab.isCreateNew ? 'create-new' : ''}`}
              onClick={() => {
                if (tab.isCreateNew) {
                  // TODO: Implement custom view creation
                  alert('Custom view creation coming soon!')
                } else {
                  setActiveTab(tab.id)
                }
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant="default" size="sm" className="tab-count">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Filter Row */}
        <Stack direction="horizontal" justify="between" align="center">
          <Stack direction="horizontal" gap="sm" align="center">
            <Button variant="secondary" size="sm" leftIcon={<Filter size={14} />}>
              Filter
            </Button>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="filter-select"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Stack>
          
          <Stack direction="horizontal" gap="sm" align="center">
            <span className="text-caption text-secondary">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </span>
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </Stack>
        </Stack>

        {/* Projects Content */}
        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3 className="text-h3">No projects found</h3>
              <p className="text-body text-secondary">
                {activeTab === 'projects' 
                  ? "You don't have any active projects yet. Create your first project to get started."
                  : "No projects match your current filters. Try adjusting your search criteria."
                }
              </p>
              <Stack direction="horizontal" gap="sm" justify="center" style={{ marginTop: 'var(--space-4)' }}>
                <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleCreateProject}>
                  Create new project
                </Button>
                <Button variant="secondary" leftIcon={<Download size={16} />} onClick={handleImportProjects}>
                  Import projects
                </Button>
              </Stack>
            </div>
          </div>
        ) : (
          <div className={`projects-container ${viewMode}`}>
            {viewMode === 'grid' ? (
              <Grid cols={1} gap="lg" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {filteredProjects.map((project) => {
                  const completedTasks = Math.floor(project.taskCount * 0.65) // Mock completion rate
                  const progressPercentage = project.taskCount > 0 ? (completedTasks / project.taskCount) * 100 : 0

                  return (
                    <Card
                      key={project.id}
                      className={`project-card ${selectedProjects.includes(project.id) ? 'selected' : ''}`}
                      onClick={() => toggleProjectSelection(project.id)}
                    >
                      {/* Project Header */}
                      <div className="project-card-header">
                        <div className="project-info">
                          <div
                            className="project-color-indicator"
                            style={{ backgroundColor: project.color }}
                          />
                          <div className="project-title-section">
                            <h3 className="project-name">{project.name}</h3>
                            <p className="project-description">{project.description}</p>
                          </div>
                        </div>
                        <button className="project-menu-btn" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal size={16} />
                        </button>
                      </div>

                      {/* Project Progress */}
                      <div className="project-progress-section">
                        <div className="progress-header">
                          <span className="progress-label">Progress</span>
                          <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="progress-stats">
                          <span className="completed-tasks">{completedTasks} of {project.taskCount} tasks completed</span>
                        </div>
                      </div>

                      {/* Project Stats */}
                      <div className="project-stats-grid">
                        <div className="stat-item">
                          <div className="stat-icon">
                            <Calendar size={14} />
                          </div>
                          <div className="stat-content">
                            <span className="stat-label">Updated</span>
                            <span className="stat-value">{formatDate(project.updatedAt)}</span>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-icon">
                            <Users size={14} />
                          </div>
                          <div className="stat-content">
                            <span className="stat-label">Team</span>
                            <span className="stat-value">{project.memberCount} member{project.memberCount !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-icon">
                            <TrendingUp size={14} />
                          </div>
                          <div className="stat-content">
                            <span className="stat-label">Tasks</span>
                            <span className="stat-value">{project.taskCount} total</span>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-icon">
                            <Clock size={14} />
                          </div>
                          <div className="stat-content">
                            <span className="stat-label">Status</span>
                            <Badge
                              variant={project.status === 'active' ? 'success' : 'default'}
                              size="sm"
                            >
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Project Footer */}
                      <div className="project-card-footer">
                        <div className="project-members">
                          {/* Mock member avatars */}
                          <div className="member-avatars">
                            {Array.from({ length: Math.min(project.memberCount, 4) }).map((_, index) => (
                              <div key={index} className="member-avatar" style={{
                                backgroundColor: `hsl(${(index * 60) % 360}, 60%, 70%)`,
                                zIndex: 4 - index
                              }}>
                                {String.fromCharCode(65 + index)}
                              </div>
                            ))}
                            {project.memberCount > 4 && (
                              <div className="member-avatar member-overflow">
                                +{project.memberCount - 4}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/projects/${project.id}`)
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </Grid>
            ) : (
              <div className="projects-list">
                {filteredProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className={`project-list-item ${selectedProjects.includes(project.id) ? 'selected' : ''}`}
                    onClick={() => toggleProjectSelection(project.id)}
                  >
                    <div className="project-list-info">
                      <div 
                        className="project-color" 
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="project-details">
                        <h3 className="project-name">{project.name}</h3>
                        <p className="project-description">{project.description}</p>
                      </div>
                    </div>
                    
                    <div className="project-list-stats">
                      <span className="stat-item">
                        <Calendar size={14} />
                        {formatDate(project.updatedAt)}
                      </span>
                      <span className="stat-item">
                        <Users size={14} />
                        {project.memberCount} member{project.memberCount !== 1 ? 's' : ''}
                      </span>
                      <span className="task-count">
                        {project.taskCount} task{project.taskCount !== 1 ? 's' : ''}
                      </span>
                      <Badge 
                        variant={project.status === 'active' ? 'success' : 'default'}
                        size="sm"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    
                    <button className="project-menu-btn">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </Stack>
      </PageWrapper>
      {filteredProjects.length > 6 && <ScrollToTop />}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProjectSubmit}
      />
    </>
  )
}

export default ProjectsPage
