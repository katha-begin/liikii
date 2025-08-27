import React from 'react'
import { Search, Plus, Settings, Sun, Moon, Bell, User } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { Input } from '@/components/ui'

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="header-left">
        <div className="breadcrumb">
          <span className="workspace-name">Workspace</span>
          <span className="separator">»</span>
          <span className="page-name">Projects</span>
        </div>
      </div>

      <div className="header-center">
        <Input
          variant="search"
          placeholder="Search..."
          leftIcon={<Search size={14} />}
        />
      </div>

      <div className="header-right">
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
        
        <button className="header-button user-avatar" title="User menu">
          <User size={16} />
        </button>
      </div>
    </header>
  )
}

export default Header
