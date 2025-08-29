import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'

// Types
export interface User {
  id: string
  email: string
  displayName: string
  projectId: string
  permissions: string[]
  profile: {
    department: string
    role: string
    avatarUrl?: string
  }
  lastLogin: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  token: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  projectId?: string
}

export interface GoogleLoginCredentials {
  googleToken: string
  projectId?: string
}

// Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_RESTORE_SESSION'; payload: { user: User; token: string } }

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
}

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      }
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      }
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
      }
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'AUTH_RESTORE_SESSION':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      }
    default:
      return state
  }
}

// Context
interface AuthContextType {
  state: AuthState
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithGoogle: (credentials: GoogleLoginCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
  checkAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mock authentication service (replace with real API calls)
const mockAuthService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock validation
    if (credentials.email === 'demo@studio.com' && credentials.password === 'demo123') {
      const user: User = {
        id: 'user_123',
        email: credentials.email,
        displayName: 'Demo User',
        projectId: credentials.projectId || 'SWA',
        permissions: ['read', 'write'],
        profile: {
          department: 'Lighting',
          role: 'Senior Artist',
          avatarUrl: undefined,
        },
        lastLogin: new Date().toISOString(),
      }

      const token = 'mock_jwt_token_' + Date.now()

      return { user, token }
    } else {
      throw new Error('Invalid email or password')
    }
  },

  async loginWithGoogle(credentials: GoogleLoginCredentials): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In real implementation, this would call your Firebase backend
    // which verifies the Google token and returns user data

    // Mock Google user data (replace with actual Firebase response)
    const user: User = {
      id: 'google_user_' + Date.now(),
      email: 'user@gmail.com', // Would come from Google token
      displayName: 'Google User', // Would come from Google token
      projectId: credentials.projectId || 'SWA',
      permissions: ['read', 'write'],
      profile: {
        department: 'General',
        role: 'Artist',
        avatarUrl: 'https://lh3.googleusercontent.com/a/default-user', // Google profile picture
      },
      lastLogin: new Date().toISOString(),
    }

    const token = 'google_jwt_token_' + Date.now()

    return { user, token }
  },

  async validateToken(token: string): Promise<User> {
    // Simulate token validation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (token.startsWith('mock_jwt_token_')) {
      return {
        id: 'user_123',
        email: 'demo@studio.com',
        displayName: 'Demo User',
        projectId: 'SWA',
        permissions: ['read', 'write'],
        profile: {
          department: 'Lighting',
          role: 'Senior Artist',
        },
        lastLogin: new Date().toISOString(),
      }
    } else {
      throw new Error('Invalid token')
    }
  }
}

// Storage utilities
const TOKEN_KEY = 'liikii_auth_token'
const USER_KEY = 'liikii_user_data'

const storage = {
  setAuthData(user: User, token: string) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  
  getAuthData(): { user: User; token: string } | null {
    const token = localStorage.getItem(TOKEN_KEY)
    const userData = localStorage.getItem(USER_KEY)
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        return { user, token }
      } catch {
        return null
      }
    }
    
    return null
  },
  
  clearAuthData() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

// Provider component
interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' })

    try {
      const { user, token } = await mockAuthService.login(credentials)

      // Store auth data
      storage.setAuthData(user, token)

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage
      })
    }
  }, [])

  // Google login function
  const loginWithGoogle = useCallback(async (credentials: GoogleLoginCredentials) => {
    dispatch({ type: 'AUTH_START' })

    try {
      const { user, token } = await mockAuthService.loginWithGoogle(credentials)

      // Store auth data
      storage.setAuthData(user, token)

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google authentication failed'
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage
      })
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    storage.clearAuthData()
    dispatch({ type: 'AUTH_LOGOUT' })
  }, [])

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' })
  }, [])

  // Check authentication status on app load
  const checkAuthStatus = useCallback(async () => {
    const authData = storage.getAuthData()
    
    if (authData) {
      try {
        // Validate token with backend
        const user = await mockAuthService.validateToken(authData.token)
        dispatch({ 
          type: 'AUTH_RESTORE_SESSION', 
          payload: { user, token: authData.token } 
        })
      } catch {
        // Token is invalid, clear stored data
        storage.clearAuthData()
        dispatch({ type: 'AUTH_LOGOUT' })
      }
    }
  }, [])

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const contextValue: AuthContextType = {
    state,
    login,
    loginWithGoogle,
    logout,
    clearError,
    checkAuthStatus,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
