import React from 'react'
import { Plus } from 'lucide-react'

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
        <button className="filter-button">Filter</button>
        <div className="filter-chips">
          <span className="filter-chip">Project: All</span>
          <span className="filter-chip">Dept: All</span>
          <span className="filter-chip">Assignee: Any</span>
        </div>
        <div className="display-options">
          <button className="display-button">Display</button>
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
          <button className="primary-button">
            <Plus size={16} />
            Create new project
          </button>
          <button className="secondary-button">
            Documentation
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
