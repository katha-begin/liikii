// Linear-style Task Labels Component
import React, { useState, useRef, useEffect, Fragment } from 'react'
import { clsx } from 'clsx'
import { Tag, X, Plus } from 'lucide-react'

interface Label {
  id: string
  name: string
  color: string
}

interface TaskLabelsProps {
  labels: Label[]
  availableLabels: Label[]
  onChange: (labels: Label[]) => void
  className?: string
}

// Predefined label colors following Linear's design system
const LABEL_COLORS = [
  { name: 'Blue', value: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.1)' },
  { name: 'Purple', value: 'var(--accent-purple)', bg: 'rgba(147, 51, 234, 0.1)' },
  { name: 'Mint', value: 'var(--accent-mint)', bg: 'rgba(16, 185, 129, 0.1)' },
  { name: 'Orange', value: 'var(--accent-orange)', bg: 'rgba(251, 146, 60, 0.1)' },
  { name: 'Pink', value: 'var(--accent-pink)', bg: 'rgba(236, 72, 153, 0.1)' },
  { name: 'Red', value: 'var(--semantic-danger)', bg: 'rgba(239, 68, 68, 0.1)' },
  { name: 'Green', value: 'var(--semantic-success)', bg: 'rgba(34, 197, 94, 0.1)' },
  { name: 'Gray', value: 'var(--text-secondary)', bg: 'var(--bg-surface-2)' }
]

export const TaskLabels: React.FC<TaskLabelsProps> = ({
  labels,
  availableLabels,
  onChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newLabelName, setNewLabelName] = useState('')
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[0])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsCreatingNew(false)
        setSearchTerm('')
        setNewLabelName('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Filter available labels based on search term and exclude already selected
  const filteredLabels = availableLabels.filter(label => 
    !labels.some(selected => selected.id === label.id) &&
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddLabel = (label: Label) => {
    onChange([...labels, label])
    setSearchTerm('')
    setIsOpen(false)
  }

  const handleRemoveLabel = (labelId: string) => {
    onChange(labels.filter(label => label.id !== labelId))
  }

  const handleCreateNewLabel = () => {
    if (newLabelName.trim()) {
      const newLabel: Label = {
        id: `label-${Date.now()}`,
        name: newLabelName.trim(),
        color: selectedColor.value
      }
      onChange([...labels, newLabel])
      setNewLabelName('')
      setIsCreatingNew(false)
      setIsOpen(false)
    }
  }

  const renderLabelBadge = (label: Label, removable = false) => (
    <div
      key={label.id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 6px',
        borderRadius: '4px',
        border: `1px solid ${label.color}`,
        backgroundColor: LABEL_COLORS.find(c => c.value === label.color)?.bg || 'var(--bg-surface-2)',
        color: label.color,
        fontSize: '11px',
        fontWeight: 500,
        gap: '4px',
        maxWidth: '120px'
      }}
    >
      <Tag size={10} />
      <span style={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap' 
      }}>
        {label.name}
      </span>
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleRemoveLabel(label.id)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '14px',
            height: '14px',
            border: 'none',
            borderRadius: '2px',
            backgroundColor: 'transparent',
            color: label.color,
            cursor: 'pointer',
            opacity: 0.7
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.backgroundColor = label.color
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7'
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = label.color
          }}
        >
          <X size={8} />
        </button>
      )}
    </div>
  )

  return (
    <div ref={containerRef} className={clsx('task-labels', className)} style={{ position: 'relative' }}>
      {/* Labels Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          padding: 'var(--space-2)',
          backgroundColor: 'var(--bg-surface-1)',
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--border-line)',
          minHeight: '32px',
          cursor: 'pointer',
          alignItems: 'center',
          transition: 'border-color 150ms ease-out'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'var(--border-focus)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'var(--border-line)'
          }
        }}
      >
        {labels.length > 0 ? (
          labels.map(label => (
            <Fragment key={label.id}>
              {renderLabelBadge(label, true)}
            </Fragment>
          ))
        ) : (
          <span style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--text-body)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Tag size={14} />
            Add labels...
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: '4px',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-line)',
            borderRadius: 'var(--radius-input)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxHeight: '200px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Search Input */}
          <div style={{ padding: '8px' }}>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search or create labels..."
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid var(--border-line)',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-surface-1)',
                fontSize: '13px',
                color: 'var(--text-primary)'
              }}
              autoFocus
            />
          </div>

          {/* Available Labels */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredLabels.map(label => (
              <button
                key={label.id}
                onClick={() => handleAddLabel(label)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 150ms ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {renderLabelBadge(label)}
              </button>
            ))}

            {/* Create New Label Option */}
            {searchTerm && !filteredLabels.some(label => 
              label.name.toLowerCase() === searchTerm.toLowerCase()
            ) && (
              <button
                onClick={() => {
                  setIsCreatingNew(true)
                  setNewLabelName(searchTerm)
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  transition: 'background-color 150ms ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Plus size={14} />
                Create "{searchTerm}"
              </button>
            )}
          </div>

          {/* Create New Label Form */}
          {isCreatingNew && (
            <div style={{ 
              padding: '12px', 
              borderTop: '1px solid var(--border-line)',
              backgroundColor: 'var(--bg-surface-1)'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Label name"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid var(--border-line)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-surface-2)',
                    fontSize: '13px',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              {/* Color Selection */}
              <div style={{ 
                display: 'flex', 
                gap: '4px', 
                marginBottom: '8px',
                flexWrap: 'wrap'
              }}>
                {LABEL_COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: selectedColor.name === color.name 
                        ? `2px solid ${color.value}` 
                        : '1px solid var(--border-line)',
                      backgroundColor: color.bg,
                      cursor: 'pointer'
                    }}
                    title={color.name}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={handleCreateNewLabel}
                  disabled={!newLabelName.trim()}
                  style={{
                    padding: '4px 8px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: 'var(--accent-blue)',
                    color: 'white',
                    fontSize: '12px',
                    cursor: newLabelName.trim() ? 'pointer' : 'not-allowed',
                    opacity: newLabelName.trim() ? 1 : 0.5
                  }}
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingNew(false)
                    setNewLabelName('')
                  }}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid var(--border-line)',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
