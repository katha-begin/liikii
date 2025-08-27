import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Inbox,
  User,
  FolderOpen,
  Grid3X3,
  MoreHorizontal,
  Upload,
  UserPlus,
  HelpCircle,
  Palette
} from 'lucide-react'

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const location = useLocation()

  const navItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, href: '/inbox' },
    { id: 'myTasks', label: 'My tasks', icon: User, href: '/my-tasks' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, href: '/projects' },
    { id: 'views', label: 'Views', icon: Grid3X3, href: '/views' },
    { id: 'designSystem', label: 'Design System', icon: Palette, href: '/design-system' },
    { id: 'more', label: 'More', icon: MoreHorizontal, href: '/more' },
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
            <Link
              key={item.id}
              to={item.href}
              className={`nav-item ${location.pathname === item.href ? 'active' : ''}`}
              title={!isExpanded ? item.label : undefined}
            >
              <item.icon size={16} />
              {isExpanded && <span className="nav-label">{item.label}</span>}
            </Link>
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
