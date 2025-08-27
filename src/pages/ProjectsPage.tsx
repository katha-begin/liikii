import React, { useState } from 'react'
import { Plus, Download, Filter, LayoutGrid, List, Calendar, Users, MoreHorizontal } from 'lucide-react'
import { Container, Stack, Grid } from '@/components/layout'
import { Button, Badge, Card } from '@/components/ui'
import { UIProject } from '@/types/database'

// Helper function to generate UI color from project ID
const getProjectColor = (projectId: string): string => {
  const colors = ['#CBB7E8', '#B7D3F2', '#F4C6D7', '#CDE8D6', '#F4E4A6']
  const index = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
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

  // Mock project data based on actual JSON database schema
  const mockProjects: UIProject[] = [
    {
      id: 'SWA',
      name: 'Sky Wars Anthology',
      description: 'VFX project for Sky Wars Anthology series',
      color: getProjectColor('SWA'),
      status: 'active',
      memberCount: 8,
      taskCount: 156, // Based on actual task count in JSON
      updatedAt: '2025-08-17T14:13:05.705798',
      // Database schema fields
      drive_mapping: {
        working_files: 'V:',
        render_outputs: 'W:',
        media_files: 'E:',
        cache_files: 'E:',
        backup_files: 'E:'
      },
      path_segments: {
        middle_path: 'all/scene',
        version_dir: 'version',
        work_dir: 'work',
        publish_dir: 'publish',
        cache_dir: 'cache'
      },
      templates: {
        working_file: '{drive_working}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/{filename}',
        render_output: '{drive_render}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/',
        media_file: '{drive_media}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/media/',
        cache_file: '{drive_cache}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/cache/',
        submission: '{drive_render}/{project}/deliveries/{client}/{episode}/{sequence_clean}/{shot_clean}/{task}/v{client_version}/'
      },
      filename_patterns: {
        maya_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.ma',
        nuke_script: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.nk',
        houdini_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.hip',
        blender_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.blend',
        render_sequence: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}.{frame}.{ext}',
        playblast: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}_playblast.mov',
        thumbnail: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}_thumb.jpg'
      },
      name_cleaning_rules: {
        sequence_pattern: '^SWA_Ep[0-9]+_(.+)$',
        sequence_replacement: '\\1',
        shot_pattern: '^SWA_Ep[0-9]+_(.+)$',
        shot_replacement: '\\1',
        episode_pattern: '^(Ep[0-9]+)$',
        episode_replacement: '\\1'
      },
      version_settings: {
        padding: 3,
        start_version: 1,
        increment: 1,
        format: 'v{version:03d}'
      },
      task_settings: {
        default_file_extensions: {
          lighting: '.ma',
          comp: '.nk',
          modeling: '.ma',
          rigging: '.ma',
          animation: '.ma',
          fx: '.hip',
          lookdev: '.ma',
          layout: '.ma'
        },
        render_formats: {
          lighting: ['exr', 'jpg'],
          comp: ['exr', 'mov', 'jpg'],
          fx: ['exr', 'mov'],
          lookdev: ['exr', 'jpg']
        }
      },
      milestones: ['not_started', 'single_frame', 'low_quality', 'final_render', 'final_comp', 'approved'],
      task_types: ['modeling', 'rigging', 'animation', 'layout', 'lighting', 'comp', 'fx', 'lookdev'],
      priority_levels: ['low', 'medium', 'high', 'urgent'],
      client_settings: {
        version_reset: true,
        default_client: 'SWA_Client',
        delivery_formats: ['mov', 'mp4'],
        approval_required: true
      },
      platform_settings: {
        windows: {
          working_root: 'V:/SWA',
          render_root: 'W:/SWA',
          media_root: 'J:/SWA'
        },
        linux: {
          working_root: '/mnt/projects/SWA',
          render_root: '/mnt/renders/SWA',
          media_root: '/mnt/media/SWA'
        }
      },
      frame_settings: {
        padding: 4,
        default_start: 1001,
        default_fps: 24
      },
      _created_at: '2025-08-03T16:45:00.000000',
      _updated_at: '2025-08-03T16:45:00.000000'
    },
    {
      id: 'RGD',
      name: 'Relic the Guardian of Dream',
      description: 'Animation project for Relic the Guardian of Dream',
      color: getProjectColor('RGD'),
      status: 'active',
      memberCount: 5,
      taskCount: 42,
      updatedAt: '2025-08-06T23:32:03.180796',
      // Abbreviated database fields for brevity
      drive_mapping: {
        working_files: 'V:',
        render_outputs: 'W:',
        media_files: 'E:',
        cache_files: 'E:',
        backup_files: 'E:'
      },
      path_segments: {
        middle_path: 'all/scene',
        version_dir: 'version',
        work_dir: 'work',
        publish_dir: 'publish',
        cache_dir: 'cache'
      },
      templates: {
        working_file: '{drive_working}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/{filename}',
        render_output: '{drive_render}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/',
        media_file: '{drive_media}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/media/',
        cache_file: '{drive_cache}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/cache/',
        submission: '{drive_render}/{project}/deliveries/{client}/{episode}/{sequence_clean}/{shot_clean}/{task}/v{client_version}/'
      },
      filename_patterns: {
        maya_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.ma',
        nuke_script: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.nk',
        houdini_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.hip',
        blender_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.blend',
        render_sequence: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}.{frame}.{ext}',
        playblast: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}_playblast.mov',
        thumbnail: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}_thumb.jpg'
      },
      name_cleaning_rules: {
        sequence_pattern: '^RGD_Ep[0-9]+_(.+)$',
        sequence_replacement: '\\1',
        shot_pattern: '^RGD_Ep[0-9]+_(.+)$',
        shot_replacement: '\\1',
        episode_pattern: '^(Ep[0-9]+)$',
        episode_replacement: '\\1'
      },
      version_settings: {
        padding: 3,
        start_version: 1,
        increment: 1,
        format: 'v{version:03d}'
      },
      task_settings: {
        default_file_extensions: {
          animation: '.ma',
          comp: '.nk',
          fx: '.hip',
          layout: '.ma',
          lighting: '.ma',
          lookdev: '.ma',
          modeling: '.ma',
          rigging: '.ma'
        },
        render_formats: {
          animation: ['mov', 'jpg'],
          comp: ['exr', 'mov', 'jpg'],
          fx: ['exr', 'mov'],
          layout: ['mov', 'jpg'],
          lighting: ['exr', 'jpg'],
          lookdev: ['exr', 'jpg'],
          modeling: ['jpg', 'png'],
          rigging: ['jpg', 'png']
        }
      },
      milestones: ['not_started', 'single_frame', 'low_quality', 'final_render', 'final_comp', 'approved'],
      task_types: ['modeling', 'rigging', 'animation', 'layout', 'lighting', 'comp', 'fx', 'lookdev'],
      priority_levels: ['low', 'medium', 'high', 'urgent'],
      client_settings: {
        version_reset: true,
        default_client: 'RGD_Client',
        delivery_formats: ['mov', 'mp4'],
        approval_required: true
      },
      platform_settings: {
        windows: {
          working_root: 'V:/RGD',
          render_root: 'W:/RGD',
          media_root: 'E:/RGD'
        },
        linux: {
          working_root: '/mnt/projects/RGD',
          render_root: '/mnt/renders/RGD',
          media_root: '/mnt/media/RGD'
        }
      },
      frame_settings: {
        padding: 4,
        default_start: 1001,
        default_fps: 24
      },
      project_budget: {
        allocated_mandays: 0,
        remaining_mandays: 100.0,
        total_mandays: 100.0
      },
      project_timeline: {
        start_date: '2025-08-06',
        end_date: '2026-02-06'
      },
      _created_at: '2025-08-06T09:25:38.807298',
      _updated_at: '2025-08-06T23:32:03.180796'
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
