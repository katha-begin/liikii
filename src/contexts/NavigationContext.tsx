import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number }>
  href: string
  badge?: string | number
  children?: NavigationItem[]
}

interface BreadcrumbItem {
  label: string
  href?: string
}

interface NavigationContextType {
  currentProject: string | null
  setCurrentProject: (projectId: string | null) => void
  navigationItems: NavigationItem[]
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  isNavigationExpanded: boolean
  setNavigationExpanded: (expanded: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

interface NavigationProviderProps {
  children: React.ReactNode
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [isNavigationExpanded, setNavigationExpanded] = useState(true)
  const location = useLocation()

  // Base navigation items - these will be dynamic based on current project
  const [navigationItems] = useState<NavigationItem[]>([
    {
      id: 'inbox',
      label: 'Inbox',
      icon: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22,6 16,12 14,14 10,10 6,14 2,10"></polyline>
          <path d="m16,12 5,5-5,5"></path>
          <path d="m8,12-5,5 5,5"></path>
        </svg>
      ),
      href: '/inbox',
      badge: 3
    },
    {
      id: 'my-tasks',
      label: 'My tasks',
      icon: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      href: '/my-tasks'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      href: '/projects'
    },
    {
      id: 'views',
      label: 'Views',
      icon: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="7" height="7" x="3" y="3" rx="1"></rect>
          <rect width="7" height="7" x="14" y="3" rx="1"></rect>
          <rect width="7" height="7" x="14" y="14" rx="1"></rect>
          <rect width="7" height="7" x="3" y="14" rx="1"></rect>
        </svg>
      ),
      href: '/views'
    },
    {
      id: 'design-system',
      label: 'Design System',
      icon: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="13.5" cy="6.5" r=".5"></circle>
          <circle cx="17.5" cy="10.5" r=".5"></circle>
          <circle cx="8.5" cy="7.5" r=".5"></circle>
          <circle cx="6.5" cy="12.5" r=".5"></circle>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
        </svg>
      ),
      href: '/design-system'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
        </svg>
      ),
      href: '/templates'
    }
  ])

  // Update breadcrumbs based on current route
  useEffect(() => {
    const updateBreadcrumbs = () => {
      const path = location.pathname
      const segments = path.split('/').filter(Boolean)
      
      const newBreadcrumbs: BreadcrumbItem[] = [
        { label: 'Workspace', href: '/' }
      ]

      if (segments.length === 0) {
        newBreadcrumbs.push({ label: 'Projects' })
      } else {
        segments.forEach((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/')
          const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
          
          if (index === segments.length - 1) {
            newBreadcrumbs.push({ label })
          } else {
            newBreadcrumbs.push({ label, href })
          }
        })
      }

      setBreadcrumbs(newBreadcrumbs)
    }

    updateBreadcrumbs()
  }, [location.pathname])

  const value: NavigationContextType = {
    currentProject,
    setCurrentProject,
    navigationItems,
    breadcrumbs,
    setBreadcrumbs,
    isNavigationExpanded,
    setNavigationExpanded,
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}
