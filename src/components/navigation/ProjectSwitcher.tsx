import React, { useState } from 'react'
import { ChevronDown, Plus, Search } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { Stack } from '@/components/layout'

interface Project {
  id: string
  name: string
  description?: string
  color: string
  isActive: boolean
}

interface ProjectSwitcherProps {
  currentProject?: Project | null
  onProjectChange?: (project: Project) => void
  onCreateProject?: () => void
}

const ProjectSwitcher: React.FC<ProjectSwitcherProps> = ({
  currentProject,
  onProjectChange,
  onCreateProject
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock projects data - in real app this would come from a store/API
  const projects: Project[] = [
    {
      id: '1',
      name: 'Animation Pipeline',
      description: 'Main animation production pipeline',
      color: '#CBB7E8',
      isActive: true
    },
    {
      id: '2', 
      name: 'Character Design',
      description: 'Character design and modeling',
      color: '#B7D3F2',
      isActive: true
    },
    {
      id: '3',
      name: 'Environment Art',
      description: 'Environment and background art',
      color: '#F4C6D7',
      isActive: false
    },
    {
      id: '4',
      name: 'VFX Development',
      description: 'Visual effects and compositing',
      color: '#CDE8D6',
      isActive: true
    }
  ]

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleProjectSelect = (project: Project) => {
    onProjectChange?.(project)
    setIsOpen(false)
    setSearchQuery('')
  }

  const currentProjectDisplay = currentProject || projects[0]

  return (
    <div className="project-switcher">
      <button
        className="project-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="project-avatar" style={{ backgroundColor: currentProjectDisplay.color }}>
          {currentProjectDisplay.name.charAt(0)}
        </div>
        <div className="project-info">
          <div className="project-name">{currentProjectDisplay.name}</div>
          <div className="project-status">
            {currentProjectDisplay.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        <ChevronDown 
          size={14} 
          className={`chevron ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="project-switcher-overlay" onClick={() => setIsOpen(false)} />
          <Card className="project-switcher-dropdown" variant="elevated">
            <Stack direction="vertical" gap="sm">
              <div className="dropdown-header">
                <Input
                  variant="search"
                  placeholder="Search projects..."
                  leftIcon={<Search size={14} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="projects-list">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    className={`project-item ${project.id === currentProjectDisplay.id ? 'active' : ''}`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <div className="project-avatar" style={{ backgroundColor: project.color }}>
                      {project.name.charAt(0)}
                    </div>
                    <div className="project-details">
                      <div className="project-name">{project.name}</div>
                      {project.description && (
                        <div className="project-description">{project.description}</div>
                      )}
                    </div>
                    <div className={`project-status-indicator ${project.isActive ? 'active' : 'inactive'}`} />
                  </button>
                ))}
              </div>

              <div className="dropdown-footer">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus size={14} />}
                  onClick={() => {
                    onCreateProject?.()
                    setIsOpen(false)
                  }}
                >
                  Create new project
                </Button>
              </div>
            </Stack>
          </Card>
        </>
      )}
    </div>
  )
}

export default ProjectSwitcher
