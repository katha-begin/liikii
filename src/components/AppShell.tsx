import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import ProjectsPage from '@/pages/ProjectsPage'
import DesignSystemDemo from '@/pages/DesignSystemDemo'

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
      <div className="app-shell">
        <Header
          isMobile={isMobile}
          onToggleSidebar={toggleSidebar}
        />
        <div className="app-body">
          <Sidebar
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
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectsPage />} />
              <Route path="/design-system" element={<DesignSystemDemo />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default AppShell
