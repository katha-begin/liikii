import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MoreHorizontal, Upload, UserPlus, HelpCircle } from 'lucide-react'
import { useNavigation } from '@/contexts/NavigationContext'
import ProjectSwitcher from './ProjectSwitcher'
import { Badge } from '@/components/ui'

interface NavigationSidebarProps {
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ 
  isMobile, 
  isOpen, 
  onClose 
}) => {
  const { navigationItems, isNavigationExpanded, setNavigationExpanded } = useNavigation()
  const location = useLocation()

  // On mobile, always show expanded when open
  const shouldShowExpanded = isMobile ? isOpen : isNavigationExpanded
  const shouldShowSidebar = isMobile ? isOpen : true

  // Debug logging (remove in production)
  // console.log('NavigationSidebar render:', {
  //   isMobile,
  //   isOpen,
  //   isNavigationExpanded,
  //   shouldShowExpanded,
  //   shouldShowSidebar
  // })

  const tryItems = [
    { id: 'importCsv', label: 'Import tasks (CSV)', icon: Upload },
    { id: 'invite', label: 'Invite people', icon: UserPlus },
  ]

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  const handleProjectChange = (project: any) => {
    console.log('Project changed:', project)
    // In a real app, this would update the global project state
  }

  const handleCreateProject = () => {
    console.log('Create new project')
    // In a real app, this would open a create project modal
  }

  if (!shouldShowSidebar) return null

  return (
    <aside className={`navigation-sidebar ${shouldShowExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-content">
        {/* Project Switcher */}
        <div className="project-switcher-section">
          {shouldShowExpanded ? (
            <ProjectSwitcher
              onProjectChange={handleProjectChange}
              onCreateProject={handleCreateProject}
            />
          ) : (
            <div className="project-avatar-collapsed">
              <div className="project-avatar" style={{ backgroundColor: '#CBB7E8' }}>
                A
              </div>
            </div>
          )}
        </div>

        {/* Main navigation */}
        <nav className="nav-section">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/' && location.pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={!shouldShowExpanded ? item.label : undefined}
                onClick={handleNavClick}
              >
                <item.icon size={16} />
                {shouldShowExpanded && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <Badge variant="primary" size="sm" className="nav-badge">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Try section */}
        {shouldShowExpanded && (
          <div className="try-section">
            <div className="section-header">Try</div>
            {tryItems.map((item) => (
              <button 
                key={item.id} 
                className="nav-item" 
                onClick={handleNavClick}
              >
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
            title={!shouldShowExpanded ? 'Help' : undefined}
            onClick={handleNavClick}
          >
            <HelpCircle size={16} />
            {shouldShowExpanded && <span className="nav-label">Help</span>}
          </button>
        </div>
      </div>

      {/* Toggle button - only show on desktop */}
      {!isMobile && (
        <button
          className="sidebar-toggle"
          onClick={() => setNavigationExpanded(!isNavigationExpanded)}
          title={isNavigationExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <MoreHorizontal size={16} />
        </button>
      )}
    </aside>
  )
}

export default NavigationSidebar
