import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import ProjectsPage from '@/pages/ProjectsPage'
import DesignSystemDemo from '@/pages/DesignSystemDemo'

const AppShell: React.FC = () => {
  return (
    <Router>
      <div className="app-shell">
        <Header />
        <div className="app-body">
          <Sidebar />
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
