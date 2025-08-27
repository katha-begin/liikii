import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMenuActions, useThemeToggle } from '@/hooks/useDesktop'
import { useNotificationHelpers } from './NotificationSystem'

interface DesktopIntegrationProps {
  onToggleTheme?: () => void
  onToggleSidebar?: () => void
}

const DesktopIntegration: React.FC<DesktopIntegrationProps> = ({
  onToggleTheme,
  onToggleSidebar
}) => {
  const navigate = useNavigate()
  const { lastAction, clearLastAction } = useMenuActions()
  const { themeToggleRequested, clearThemeToggleRequest } = useThemeToggle()
  const { showInfo, showSuccess, showWarning } = useNotificationHelpers()

  // Handle menu actions
  useEffect(() => {
    if (!lastAction) return

    const handleMenuAction = async () => {
      switch (lastAction) {
        case 'new-project':
          navigate('/projects')
          showInfo('New Project', 'Navigate to Projects page to create a new project')
          break

        case 'open-project':
          navigate('/projects')
          showInfo('Open Project', 'Select a project from the Projects page')
          break

        case 'import-csv':
          showInfo('CSV Import', 'CSV import wizard will be available soon')
          break

        case 'export-data':
          showInfo('Export Data', 'Data export functionality will be available soon')
          break

        case 'preferences':
          showInfo('Preferences', 'Preferences panel will be available soon')
          break

        case 'find':
          showInfo('Find', 'Global search functionality will be available soon')
          break

        case 'toggle-theme':
          if (onToggleTheme) {
            onToggleTheme()
            showSuccess('Theme Toggled', 'Application theme has been changed')
          }
          break

        case 'toggle-sidebar':
          if (onToggleSidebar) {
            onToggleSidebar()
            showInfo('Sidebar Toggled', 'Sidebar visibility has been changed')
          }
          break

        case 'dcc-launcher':
          showInfo('DCC Launcher', 'DCC Launcher will be available soon')
          break

        case 'environment-manager':
          showInfo('Environment Manager', 'Environment Manager will be available soon')
          break

        case 'build-picker':
          showInfo('Build Picker', 'Build Picker will be available soon')
          break

        case 'task-manager':
          navigate('/my-tasks')
          showInfo('Task Manager', 'Navigated to My Tasks page')
          break

        case 'keyboard-shortcuts':
          showInfo('Keyboard Shortcuts', 'Keyboard shortcuts help will be available soon')
          break

        default:
          console.log('Unhandled menu action:', lastAction)
      }
    }

    handleMenuAction()
    clearLastAction()
  }, [lastAction, navigate, onToggleTheme, onToggleSidebar, showInfo, showSuccess, showWarning, clearLastAction])

  // Handle theme toggle requests
  useEffect(() => {
    if (themeToggleRequested && onToggleTheme) {
      onToggleTheme()
      showSuccess('Theme Toggled', 'Application theme has been changed')
      clearThemeToggleRequest()
    }
  }, [themeToggleRequested, onToggleTheme, showSuccess, clearThemeToggleRequest])

  // This component doesn't render anything visible
  return null
}

export default DesktopIntegration
