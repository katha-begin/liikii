import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Card } from '@/components/ui'
import { useTheme } from '@/components/ThemeProvider'

const LoginPage: React.FC = () => {
  const { state, login, clearError } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    projectId: 'SWA'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    if (state.error) {
      clearError()
    }
  }, [formData, clearError])

  // Redirect if already authenticated
  if (state.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      return
    }

    await login({
      email: formData.email,
      password: formData.password,
      projectId: formData.projectId
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Background decoration */}
        <div className="login-background">
          <div className="login-background__grid"></div>
          <div className="login-background__gradient"></div>
        </div>

        {/* Login form */}
        <div className="login-form-wrapper">
          <Card className="login-card">
            {/* Header */}
            <div className="login-header">
              <div className="login-logo">
                <div className="login-logo__icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect width="32" height="32" rx="8" fill="var(--accent-primary)" />
                    <path 
                      d="M8 12L16 8L24 12V20L16 24L8 20V12Z" 
                      stroke="white" 
                      strokeWidth="2" 
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="login-logo__text">
                  <h1>Liikii</h1>
                  <p>VFX Production Management</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Input */}
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                leftIcon={<Mail size={18} />}
                required
                autoComplete="email"
                autoFocus
              />

              {/* Password Input */}
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="password-toggle"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
                autoComplete="current-password"
              />

              {/* Project Selection */}
              <div className="input-group">
                <label htmlFor="projectId" className="input-label">
                  Project
                </label>
                <div className="input-container">
                  <select
                    id="projectId"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    className="input project-select"
                    required
                  >
                    <option value="SWA">Star Wars: Ahsoka</option>
                    <option value="MANDO">The Mandalorian</option>
                    <option value="BOBF">The Book of Boba Fett</option>
                    <option value="DEMO">Demo Project</option>
                  </select>
                </div>
              </div>

              {/* Remember Me */}
              <div className="login-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox"
                  />
                  <span className="checkbox-text">Remember me</span>
                </label>
              </div>

              {/* Error Message */}
              {state.error && (
                <div className="login-error">
                  <p>{state.error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={state.isLoading}
                disabled={!formData.email || !formData.password || state.isLoading}
                className="login-submit"
              >
                {state.isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              <p className="login-footer__text">
                Demo credentials: <strong>demo@studio.com</strong> / <strong>demo123</strong>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
