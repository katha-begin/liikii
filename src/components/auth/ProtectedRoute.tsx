import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermissions = [] 
}) => {
  const { state } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (state.isLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading__content">
          <Loader2 size={32} className="animate-spin" />
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!state.isAuthenticated || !state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check permissions if required
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      state.user?.permissions.includes(permission)
    )

    if (!hasRequiredPermissions) {
      return (
        <div className="auth-error">
          <div className="auth-error__content">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <p>Required permissions: {requiredPermissions.join(', ')}</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
