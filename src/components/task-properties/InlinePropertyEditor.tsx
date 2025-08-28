// Linear-style Inline Property Editor
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { clsx } from 'clsx'
import { ChevronDown, Check, X, AlertCircle } from 'lucide-react'
import { UITask } from '@/types/database'
import { useTaskProperties } from '@/contexts/TaskPropertiesContext'

interface InlinePropertyEditorProps {
  task: UITask
  property: keyof UITask
  className?: string
  disabled?: boolean
  onUpdate?: (value: any) => void
}

export const InlinePropertyEditor: React.FC<InlinePropertyEditorProps> = ({
  task,
  property,
  className,
  disabled = false,
  onUpdate
}) => {
  const {
    updateTaskProperty,
    validateProperty,
    getPropertyDisplayValue,
    getPropertyEditOptions,
    pendingUpdates
  } = useTaskProperties()

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState<any>(task && property ? task[property as keyof typeof task] : value)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Check if this property has pending updates
  const pendingUpdate = pendingUpdates.find(
    update => update.taskId === task.id && update.property === property
  )

  // Get display value and options
  const displayValue = getPropertyDisplayValue(task, property)
  const options = getPropertyEditOptions(property)
  const hasOptions = options.length > 0

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        handleCancel()
      }
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditing])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isEditing) return

      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          handleCancel()
          break
        case 'Enter':
          event.preventDefault()
          handleSave()
          break
        case 'ArrowDown':
        case 'ArrowUp':
          if (hasOptions) {
            event.preventDefault()
            // TODO: Implement arrow key navigation through options
          }
          break
      }
    }

    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditing, hasOptions])

  const handleEdit = useCallback(() => {
    if (disabled) return
    setIsEditing(true)
    setEditValue(task[property])
    setError(null)
  }, [disabled, task, property])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setEditValue(task[property])
    setError(null)
  }, [task, property])

  const handleSave = useCallback(async () => {
    // Validate the new value
    const validation = validateProperty(property, editValue)
    if (!validation.valid) {
      setError(validation.error || 'Invalid value')
      return
    }

    try {
      await updateTaskProperty(task.id, property, editValue)
      setIsEditing(false)
      setError(null)
      onUpdate?.(editValue)
    } catch (err) {
      setError('Failed to update property')
    }
  }, [task.id, property, editValue, validateProperty, updateTaskProperty, onUpdate])

  const handleOptionSelect = useCallback(async (value: any) => {
    setEditValue(value)
    
    // Auto-save for dropdown selections (Linear's pattern)
    const validation = validateProperty(property, value)
    if (!validation.valid) {
      setError(validation.error || 'Invalid value')
      return
    }

    try {
      await updateTaskProperty(task.id, property, value)
      setIsEditing(false)
      setError(null)
      onUpdate?.(value)
    } catch (err) {
      setError('Failed to update property')
    }
  }, [task.id, property, validateProperty, updateTaskProperty, onUpdate])

  // Render dropdown options
  const renderDropdown = () => {
    if (!isEditing || !hasOptions) return null

    return (
      <div
        ref={dropdownRef}
        className="inline-property-dropdown"
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          zIndex: 1000,
          minWidth: '200px',
          marginTop: 'var(--space-1)',
          backgroundColor: 'var(--bg-surface-2)',
          border: '1px solid var(--border-line)',
          borderRadius: 'var(--radius-input)',
          boxShadow: 'var(--shadow-elev2)',
          padding: 'var(--space-1)',
          animation: 'fadeIn 150ms ease-out'
        }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            className="inline-property-option"
            onClick={() => handleOptionSelect(option.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-body)',
              lineHeight: 'var(--text-body-lh)',
              borderRadius: 'var(--radius-input)',
              cursor: 'pointer',
              transition: 'background-color 150ms ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {option.color && (
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: option.color,
                  marginRight: 'var(--space-2)',
                  flexShrink: 0
                }}
              />
            )}
            <span>{option.label}</span>
            {editValue === option.value && (
              <Check size={14} style={{ marginLeft: 'auto', color: 'var(--semantic-success)' }} />
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={clsx('inline-property-editor', className)} style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        className={clsx(
          'inline-property-trigger',
          {
            'editing': isEditing,
            'disabled': disabled,
            'pending': pendingUpdate?.status === 'pending',
            'error': pendingUpdate?.status === 'error' || error
          }
        )}
        onClick={handleEdit}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--space-1) var(--space-2)',
          border: '1px solid transparent',
          borderRadius: 'var(--radius-input)',
          backgroundColor: isEditing ? 'var(--bg-surface-2)' : 'transparent',
          color: 'var(--text-primary)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--text-body-lh)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 150ms ease-out',
          minHeight: '28px'
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isEditing) {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isEditing) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>
          {displayValue}
        </span>
        
        {pendingUpdate?.status === 'pending' && (
          <div
            className="pending-indicator"
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-blue)',
              marginLeft: 'var(--space-2)',
              animation: 'pulse 1s infinite'
            }}
          />
        )}
        
        {pendingUpdate?.status === 'success' && (
          <Check
            size={14}
            style={{
              color: 'var(--semantic-success)',
              marginLeft: 'var(--space-2)'
            }}
          />
        )}
        
        {(pendingUpdate?.status === 'error' || error) && (
          <AlertCircle
            size={14}
            style={{
              color: 'var(--semantic-danger)',
              marginLeft: 'var(--space-2)'
            }}
          />
        )}
        
        {hasOptions && !pendingUpdate && (
          <ChevronDown
            size={14}
            style={{
              color: 'var(--text-secondary)',
              marginLeft: 'var(--space-2)',
              transform: isEditing ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 150ms ease-out'
            }}
          />
        )}
      </button>

      {renderDropdown()}

      {error && (
        <div
          className="inline-property-error"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 'var(--space-1)',
            padding: 'var(--space-1) var(--space-2)',
            backgroundColor: 'var(--semantic-danger)',
            color: 'white',
            fontSize: 'var(--text-caption)',
            borderRadius: 'var(--radius-input)',
            whiteSpace: 'nowrap',
            zIndex: 1001
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}

// CSS animations (would typically be in a separate CSS file)
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`

// Inject styles (in a real app, these would be in CSS files)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}
