import React, { useState } from 'react'
import { Plus, Download, Filter, LayoutGrid, List, Calendar, Users, MoreHorizontal } from 'lucide-react'
import { Container, Stack, Grid } from '@/components/layout'
import { Button, Badge, Card } from '@/components/ui'

interface Project {
  id: string
  name: string
  description?: string
  color: string
  status: 'active' | 'inactive' | 'archived'
  updatedAt: string
  createdAt: string
  ownerId: string
  memberCount: number
  taskCount: number
}

interface ProjectTab {
  id: string
  label: string
  count?: number
  isCreateNew?: boolean
}

const ProjectsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('projects')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // Mock project data - will be replaced with real data later
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Animation Pipeline',
      description: 'Main animation production pipeline with character rigging and scene setup',
      color: '#CBB7E8',
      status: 'active',
      updatedAt: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T09:00:00Z',
      ownerId: 'user-1',
      memberCount: 8,
      taskCount: 24
    },
    {
      id: '2',
      name: 'Character Design',
      description: 'Character design and modeling for main characters',
      color: '#B7D3F2',
      status: 'active',
      updatedAt: '2024-01-14T16:45:00Z',
      createdAt: '2024-01-02T11:30:00Z',
      ownerId: 'user-2',
      memberCount: 5,
      taskCount: 18
    },
    {
      id: '3',
      name: 'Environment Art',
      description: 'Environment and background art creation',
      color: '#F4C6D7',
      status: 'inactive',
      updatedAt: '2024-01-10T14:20:00Z',
      createdAt: '2023-12-15T08:15:00Z',
      ownerId: 'user-1',
      memberCount: 3,
      taskCount: 12
    },
    {
      id: '4',
      name: 'VFX Development',
      description: 'Visual effects and compositing pipeline',
      color: '#CDE8D6',
      status: 'active',
      updatedAt: '2024-01-13T12:10:00Z',
      createdAt: '2024-01-05T13:45:00Z',
      ownerId: 'user-3',
      memberCount: 6,
      taskCount: 31
    }
  ]

  const tabs: ProjectTab[] = [
    { id: 'projects', label: 'Projects', count: mockProjects.filter(p => p.status === 'active').length },
    { id: 'all-projects', label: 'All projects', count: mockProjects.length },
    { id: 'new-view', label: 'New view', isCreateNew: true }
  ]

  const filteredProjects = mockProjects.filter(project => {
    if (activeTab === 'projects' && project.status !== 'active') return false
    if (filterStatus !== 'all' && project.status !== filterStatus) return false
    return true
  })

  const handleCreateProject = () => {
    // TODO: Implement in Task 5.5
    alert('Project creation coming in next update!')
    console.log('Create project triggered')
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

  return (
    <Container size="xl" padding>
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
        <Stack direction="horizontal" justify="between" align="center" className="filter-row">
          <Stack direction="horizontal" gap="sm" align="center">
            <Button variant="ghost" size="sm" leftIcon={<Filter size={14} />}>
              Filter
            </Button>
            <div className="filter-chips">
              <Badge
                variant={filterStatus === 'all' ? 'primary' : 'default'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className="filter-chip"
              >
                All
              </Badge>
              <Badge
                variant={filterStatus === 'active' ? 'primary' : 'default'}
                size="sm"
                onClick={() => setFilterStatus('active')}
                className="filter-chip"
              >
                Active
              </Badge>
              <Badge
                variant={filterStatus === 'inactive' ? 'primary' : 'default'}
                size="sm"
                onClick={() => setFilterStatus('inactive')}
                className="filter-chip"
              >
                Inactive
              </Badge>
            </div>
          </Stack>

          <Stack direction="horizontal" gap="sm" align="center">
            <Button
              variant={viewMode === 'grid' ? 'tertiary' : 'ghost'}
              size="sm"
              leftIcon={<LayoutGrid size={14} />}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'tertiary' : 'ghost'}
              size="sm"
              leftIcon={<List size={14} />}
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </Stack>
        </Stack>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          /* Empty State */
          <Card variant="outlined" padding="lg" className="empty-state">
            <Stack direction="vertical" gap="lg" align="center">
              <div className="empty-illustration">
                <div className="cube-stack">
                  <div className="cube"></div>
                  <div className="cube"></div>
                  <div className="cube"></div>
                </div>
              </div>

              <Stack direction="vertical" gap="sm" align="center">
                <h2 className="text-h2">
                  {activeTab === 'projects' ? 'No active projects' : 'No projects found'}
                </h2>
                <p className="text-body text-secondary text-center">
                  {activeTab === 'projects'
                    ? 'Create your first project to get started with organizing your work.'
                    : 'Try adjusting your filters or create a new project.'
                  }
                </p>
              </Stack>

              <Stack direction="horizontal" gap="sm">
                <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleCreateProject}>
                  Create new project
                </Button>
                <Button variant="secondary" onClick={handleImportProjects}>
                  Import projects
                </Button>
              </Stack>
            </Stack>
          </Card>
        ) : (
          /* Projects Grid/List */
          <div className={`projects-display ${viewMode}`}>
            {viewMode === 'grid' ? (
              <Grid cols={3} gap="md" responsive>
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    variant={selectedProjectId === project.id ? 'outlined' : 'default'}
                    padding="md"
                    className={`project-card ${selectedProjectId === project.id ? 'selected' : ''}`}
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    <Stack direction="vertical" gap="md">
                      <Stack direction="horizontal" justify="between" align="start">
                        <Stack direction="horizontal" gap="sm" align="center">
                          <div
                            className="project-avatar"
                            style={{ backgroundColor: project.color }}
                          >
                            {project.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-h2">{project.name}</h3>
                            <Badge
                              variant={project.status === 'active' ? 'success' : 'default'}
                              size="sm"
                            >
                              {project.status}
                            </Badge>
                          </div>
                        </Stack>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={14} />
                        </Button>
                      </Stack>

                      {project.description && (
                        <p className="text-body text-secondary project-description">
                          {project.description}
                        </p>
                      )}

                      <Stack direction="horizontal" justify="between" align="center">
                        <Stack direction="horizontal" gap="md" align="center">
                          <Stack direction="horizontal" gap="xs" align="center">
                            <Users size={12} />
                            <span className="text-caption text-secondary">
                              {project.memberCount}
                            </span>
                          </Stack>
                          <Stack direction="horizontal" gap="xs" align="center">
                            <Calendar size={12} />
                            <span className="text-caption text-secondary">
                              {project.taskCount} tasks
                            </span>
                          </Stack>
                        </Stack>
                        <span className="text-caption text-secondary">
                          {formatDate(project.updatedAt)}
                        </span>
                      </Stack>
                    </Stack>
                  </Card>
                ))}
              </Grid>
            ) : (
              /* List View */
              <div className="projects-list">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    variant="outlined"
                    padding="md"
                    className={`project-list-item ${selectedProjectId === project.id ? 'selected' : ''}`}
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    <Stack direction="horizontal" justify="between" align="center">
                      <Stack direction="horizontal" gap="md" align="center">
                        <div
                          className="project-avatar"
                          style={{ backgroundColor: project.color }}
                        >
                          {project.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-h2">{project.name}</h3>
                          {project.description && (
                            <p className="text-body text-secondary">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </Stack>

                      <Stack direction="horizontal" gap="lg" align="center">
                        <Badge
                          variant={project.status === 'active' ? 'success' : 'default'}
                          size="sm"
                        >
                          {project.status}
                        </Badge>
                        <Stack direction="horizontal" gap="xs" align="center">
                          <Users size={12} />
                          <span className="text-caption text-secondary">
                            {project.memberCount}
                          </span>
                        </Stack>
                        <Stack direction="horizontal" gap="xs" align="center">
                          <Calendar size={12} />
                          <span className="text-caption text-secondary">
                            {project.taskCount}
                          </span>
                        </Stack>
                        <span className="text-caption text-secondary">
                          {formatDate(project.updatedAt)}
                        </span>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={14} />
                        </Button>
                      </Stack>
                    </Stack>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Stack>
    </Container>
  )
}

export default ProjectsPage
