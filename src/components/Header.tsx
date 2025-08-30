import React, { useState } from 'react'
import { Search, Plus, Settings, Sun, Moon, Bell, User, Menu, LogOut, ChevronDown } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useAuth } from '@/contexts/AuthContext'
import { Input, Avatar } from '@/components/ui'
import Breadcrumbs from './navigation/Breadcrumbs'
import BuildChannelSelector from './desktop/BuildChannelSelector'

interface HeaderProps {
  isMobile?: boolean
  onToggleSidebar?: () => void
}

const Header: React.FC<HeaderProps> = ({ isMobile, onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme()
  const { state, logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    setUserMenuOpen(false)
    logout()
  }

  return (
    <header className="header">
      <div className="header-left">
        {isMobile && (
          <button
            className="header-button mobile-menu-button"
            onClick={onToggleSidebar}
            title="Toggle menu"
          >
            <Menu size={16} />
          </button>
        )}
        <Breadcrumbs />
      </div>

      <div className="header-center">
        <Input
          variant="search"
          placeholder="Search..."
          leftIcon={<Search size={14} />}
        />
      </div>

      <div className="header-right">
        <BuildChannelSelector showLabel={false} />

        <button className="header-button" title="Add project">
          <Plus size={16} />
        </button>

        <button className="header-button" title="Display options">
          <Settings size={16} />
        </button>

        <button
          className="header-button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className="header-button" title="Notifications">
          <Bell size={16} />
        </button>

        {/* User Menu */}
        <div className="user-menu-container">
          <button
            className="header-button user-menu-trigger"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            title="User menu"
          >
            <Avatar
              src={state.user?.profile.avatarUrl}
              alt={state.user?.displayName}
              fallback={state.user?.displayName || 'User'}
              size="xs"
              variant="circle"
            />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="user-menu-overlay"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <div className="user-menu-info">
                    <strong>{state.user?.displayName}</strong>
                    <span>{state.user?.email}</span>
                    <span className="user-role">{state.user?.profile.role} • {state.user?.profile.department}</span>
                  </div>
                </div>
                <div className="user-menu-divider" />
                <div className="user-menu-actions">
                  <button className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                    <Settings size={16} />
                    Settings
                  </button>
                  <button className="user-menu-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
