import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NavigationProvider } from '@/contexts/NavigationContext'
import Header from './Header'
import NavigationSidebar from './navigation/NavigationSidebar'
import ProjectsPage from '@/pages/ProjectsPage'
import InboxPage from '@/pages/InboxPage'
import MyTasksPage from '@/pages/MyTasksPage'
import DesignSystemDemo from '@/pages/DesignSystemDemo'
import TemplateSystemDemo from '@/pages/TemplateSystemDemo'

const AppShell: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false) // Close mobile sidebar when switching to desktop
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <Router>
      <NavigationProvider>
        <div className="app-shell">
          <Header
            isMobile={isMobile}
            onToggleSidebar={toggleSidebar}
          />
          <div className="app-body">
            <NavigationSidebar
              isMobile={isMobile}
              isOpen={sidebarOpen}
              onClose={closeSidebar}
            />
            {isMobile && sidebarOpen && (
              <div
                className="sidebar-overlay"
                onClick={closeSidebar}
              />
            )}
            <main className="main-content">
              <Routes>
                <Route path="/" element={<ProjectsPage />} />
                <Route path="/inbox" element={<InboxPage />} />
                <Route path="/my-tasks" element={<MyTasksPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectsPage />} />
                <Route path="/views" element={<div>Views Page - Coming Soon</div>} />
                <Route path="/design-system" element={<DesignSystemDemo />} />
                <Route path="/templates" element={<TemplateSystemDemo />} />
                {/* Add more routes as needed */}
              </Routes>
            </main>
          </div>
        </div>
      </NavigationProvider>
    </Router>
  )
}

export default AppShell
