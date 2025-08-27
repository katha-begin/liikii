import React, { useState } from 'react'
import { 
  Inbox, 
  User, 
  FolderOpen, 
  Grid3X3, 
  MoreHorizontal,
  Upload,
  UserPlus,
  HelpCircle
} from 'lucide-react'

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true)

  const navItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, active: false },
    { id: 'myTasks', label: 'My tasks', icon: User, active: false },
    { id: 'projects', label: 'Projects', icon: FolderOpen, active: true },
    { id: 'views', label: 'Views', icon: Grid3X3, active: false },
    { id: 'more', label: 'More', icon: MoreHorizontal, active: false },
  ]

  const tryItems = [
    { id: 'importCsv', label: 'Import tasks (CSV)', icon: Upload },
    { id: 'invite', label: 'Invite people', icon: UserPlus },
  ]

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-content">
        {/* Workspace section */}
        <div className="workspace-section">
          <div className="workspace-avatar">
            <User size={20} />
          </div>
          {isExpanded && <span className="workspace-name">Workspace</span>}
        </div>

        {/* Main navigation */}
        <nav className="nav-section">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${item.active ? 'active' : ''}`}
              title={!isExpanded ? item.label : undefined}
            >
              <item.icon size={16} />
              {isExpanded && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Try section */}
        {isExpanded && (
          <div className="try-section">
            <div className="section-header">Try</div>
            {tryItems.map((item) => (
              <button key={item.id} className="nav-item">
                <item.icon size={16} />
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Help section */}
        <div className="help-section">
          <button 
            className="nav-item"
            title={!isExpanded ? 'Help' : undefined}
          >
            <HelpCircle size={16} />
            {isExpanded && <span className="nav-label">Help</span>}
          </button>
        </div>
      </div>

      {/* Toggle button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <MoreHorizontal size={16} />
      </button>
    </aside>
  )
}

export default Sidebar
