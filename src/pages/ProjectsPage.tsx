import React from 'react'
import { Plus, Filter, Settings } from 'lucide-react'
import { Button, Badge } from '@/components/ui'

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page">
      {/* Tab bar */}
      <div className="tab-bar">
        <button className="tab active">Projects</button>
        <button className="tab">All projects</button>
        <button className="tab">New view</button>
      </div>

      {/* Filter row */}
      <div className="filter-row">
        <Button variant="ghost" size="sm" leftIcon={<Filter size={14} />}>
          Filter
        </Button>
        <div className="filter-chips">
          <Badge variant="default" size="sm">Project: All</Badge>
          <Badge variant="default" size="sm">Dept: All</Badge>
          <Badge variant="default" size="sm">Assignee: Any</Badge>
        </div>
        <div className="display-options">
          <Button variant="ghost" size="sm" leftIcon={<Settings size={14} />}>
            Display
          </Button>
        </div>
      </div>

      {/* Empty state */}
      <div className="empty-state">
        <div className="empty-illustration">
          <div className="cube-stack">
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
          </div>
        </div>
        
        <h2 className="empty-title">Projects</h2>
        <p className="empty-description">
          Projects are larger units of work with a clear outcome, 
          such as a new feature you want to ship. They can be 
          shared across multiple teams and are comprised of 
          issues and optional documents.
        </p>
        
        <div className="empty-actions">
          <Button variant="primary" leftIcon={<Plus size={16} />}>
            Create new project
          </Button>
          <Button variant="secondary">
            Documentation
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
