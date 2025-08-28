// Sub-Task States Manager - Following FR specifications
import React, { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import {
  Plus,
  Clock,
  CheckCircle,
  Play,
  Pause,
  MoreHorizontal,
  Layout,
  User,
  Calendar
} from 'lucide-react'
import { UITask, SubTaskState, TaskStateTemplate } from '@/types/database'

interface SubTaskStatesManagerProps {
  task: UITask
  onUpdateStates?: (states: SubTaskState[]) => void
}

// Predefined templates
const TASK_STATE_TEMPLATES: TaskStateTemplate[] = [
  {
    template_id: 'animation_standard',
    template_name: 'Animation Standard',
    task_type: 'animation',
    states: [
      { name: 'Blocking', percentage: 30, description: 'Initial pose and timing' },
      { name: 'Spline', percentage: 40, description: 'Smooth curves and arcs' },
      { name: 'Polish', percentage: 30, description: 'Final refinement and details' }
    ]
  },
  {
    template_id: 'modeling_standard',
    template_name: 'Modeling Standard',
    task_type: 'modeling',
    states: [
      { name: 'Base Mesh', percentage: 40, description: 'Basic shape and proportions' },
      { name: 'Detail Pass', percentage: 35, description: 'Add details and refinement' },
      { name: 'Final Cleanup', percentage: 25, description: 'Topology and optimization' }
    ]
  },
  {
    template_id: 'lighting_standard',
    template_name: 'Lighting Standard',
    task_type: 'lighting',
    states: [
      { name: 'Key Light Setup', percentage: 25, description: 'Primary lighting setup' },
      { name: 'Fill & Rim', percentage: 35, description: 'Secondary lighting' },
      { name: 'Final Render', percentage: 40, description: 'Render optimization and final output' }
    ]
  }
]

export const SubTaskStatesManager: React.FC<SubTaskStatesManagerProps> = ({ task, onUpdateStates }) => {
  const [states, setStates] = useState<SubTaskState[]>(task.sub_task_states || [])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  // Calculate total allocated hours
  const totalAllocatedHours = states.reduce((sum, state) => sum + state.allocated_hours, 0)
  const maxHours = task.estimated_duration_hours || 0

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'var(--semantic-success)', icon: <CheckCircle size={14} /> }
      case 'in_progress':
        return { color: 'var(--accent-blue)', icon: <Play size={14} /> }
      case 'review':
        return { color: 'var(--semantic-warning)', icon: <Pause size={14} /> }
      default:
        return { color: 'var(--text-secondary)', icon: <Clock size={14} /> }
    }
  }

  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = TASK_STATE_TEMPLATES.find(t => t.template_id === templateId)
    if (!template) return

    const newStates: SubTaskState[] = template.states.map((state, index) => ({
      id: `state_${Date.now()}_${index}`,
      name: state.name,
      order: index + 1,
      allocated_hours: Math.round((maxHours * state.percentage / 100) * 10) / 10,
      actual_hours: 0,
      status: 'not_started',
      assignee: task.assignees?.[0] || undefined,
      notes: state.description
    }))

    setStates(newStates)
    onUpdateStates?.(newStates)
    setShowTemplateSelector(false)
  }

  // Add custom state
  const addCustomState = () => {
    const newState: SubTaskState = {
      id: `state_${Date.now()}`,
      name: `State ${states.length + 1}`,
      order: states.length + 1,
      allocated_hours: Math.max(0, maxHours - totalAllocatedHours),
      actual_hours: 0,
      status: 'not_started'
    }

    const updatedStates = [...states, newState]
    setStates(updatedStates)
    onUpdateStates?.(updatedStates)
  }

  // Update state
  const updateState = (stateId: string, updates: Partial<SubTaskState>) => {
    const updatedStates = states.map(state => 
      state.id === stateId ? { ...state, ...updates } : state
    )
    setStates(updatedStates)
    onUpdateStates?.(updatedStates)
  }

  // Remove state
  const removeState = (stateId: string) => {
    const updatedStates = states.filter(state => state.id !== stateId)
    setStates(updatedStates)
    onUpdateStates?.(updatedStates)
  }

  // Calculate progress percentage
  const getProgressPercentage = (state: SubTaskState): number => {
    if (state.status === 'completed') return 100
    if (state.allocated_hours === 0) return 0
    return Math.min(100, (state.actual_hours / state.allocated_hours) * 100)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Header with Template Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ 
            margin: 0, 
            fontSize: 'var(--text-body)', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-1)'
          }}>
            Task States ({states.length})
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: 'var(--text-caption)', 
            color: 'var(--text-secondary)' 
          }}>
            {totalAllocatedHours}h allocated of {maxHours}h total
            {totalAllocatedHours > maxHours && (
              <span style={{ color: 'var(--semantic-danger)', marginLeft: 'var(--space-1)' }}>
                (Over allocated!)
              </span>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--border-line)',
              borderRadius: 'var(--radius-input)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-caption)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              transition: 'all 150ms ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <Layout size={14} />
            Template
          </button>
          
          <button
            onClick={addCustomState}
            disabled={totalAllocatedHours >= maxHours}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              border: 'none',
              borderRadius: 'var(--radius-input)',
              backgroundColor: 'var(--accent-blue)',
              color: 'white',
              fontSize: 'var(--text-caption)',
              cursor: totalAllocatedHours >= maxHours ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              opacity: totalAllocatedHours >= maxHours ? 0.5 : 1,
              transition: 'all 150ms ease-out'
            }}
            onMouseEnter={(e) => {
              if (totalAllocatedHours < maxHours) {
                e.currentTarget.style.backgroundColor = 'var(--accent-lilac)'
              }
            }}
            onMouseLeave={(e) => {
              if (totalAllocatedHours < maxHours) {
                e.currentTarget.style.backgroundColor = 'var(--accent-blue)'
              }
            }}
          >
            <Plus size={14} />
            Add State
          </button>
        </div>
      </div>

      {/* Template Selector */}
      {showTemplateSelector && (
        <div style={{
          padding: 'var(--space-3)',
          backgroundColor: 'var(--bg-surface-2)',
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--border-line)'
        }}>
          <h4 style={{ 
            margin: 0, 
            marginBottom: 'var(--space-2)', 
            fontSize: 'var(--text-body)', 
            fontWeight: 600, 
            color: 'var(--text-primary)' 
          }}>
            Choose Template
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {TASK_STATE_TEMPLATES.map(template => (
              <button
                key={template.template_id}
                onClick={() => applyTemplate(template.template_id)}
                style={{
                  padding: 'var(--space-3)',
                  border: '1px solid var(--border-line)',
                  borderRadius: 'var(--radius-input)',
                  backgroundColor: 'var(--bg-surface-1)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 150ms ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-base)'
                  e.currentTarget.style.borderColor = 'var(--accent-blue)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
                  e.currentTarget.style.borderColor = 'var(--border-line)'
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  {template.template_name}
                </div>
                <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                  {template.states.map(state => `${state.name} (${state.percentage}%)`).join(' → ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* States Timeline */}
      {states.length > 0 && (
        <div style={{
          padding: 'var(--space-3)',
          backgroundColor: 'var(--bg-surface-2)',
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--border-line)'
        }}>
          <div style={{ display: 'flex', marginBottom: 'var(--space-3)' }}>
            {states.map((state, index) => {
              const progress = getProgressPercentage(state)
              const statusInfo = getStatusInfo(state.status)
              
              return (
                <div
                  key={state.id}
                  style={{
                    flex: state.allocated_hours / maxHours,
                    minWidth: '120px',
                    marginRight: index < states.length - 1 ? 'var(--space-2)' : 0
                  }}
                >
                  <div
                    style={{
                      height: '8px',
                      backgroundColor: 'var(--bg-surface-1)',
                      borderRadius: 'var(--radius-pill)',
                      overflow: 'hidden',
                      marginBottom: 'var(--space-2)'
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: statusInfo.color,
                        transition: 'width 200ms ease-out'
                      }}
                    />
                  </div>
                  <div style={{ 
                    fontSize: 'var(--text-caption)', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    {state.name}
                  </div>
                  <div style={{ 
                    fontSize: 'var(--text-caption)', 
                    color: 'var(--text-secondary)' 
                  }}>
                    {state.actual_hours}h / {state.allocated_hours}h
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* States List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {states.map((state) => {
          const statusInfo = getStatusInfo(state.status)
          
          return (
            <div
              key={state.id}
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-surface-2)',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--border-line)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ color: statusInfo.color }}>
                    {statusInfo.icon}
                  </div>
                  <input
                    type="text"
                    value={state.name}
                    onChange={(e) => updateState(state.id, { name: e.target.value })}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: 'var(--text-body)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      padding: 'var(--space-1)',
                      borderRadius: 'var(--radius-input)'
                    }}
                  />
                </div>
                
                <button
                  onClick={() => removeState(state.id)}
                  style={{
                    padding: 'var(--space-1)',
                    border: 'none',
                    borderRadius: 'var(--radius-input)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <MoreHorizontal size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Status
                  </label>
                  <select
                    value={state.status}
                    onChange={(e) => updateState(state.id, { status: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--border-line)',
                      borderRadius: 'var(--radius-input)',
                      backgroundColor: 'var(--bg-surface-1)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-body)'
                    }}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Allocated Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max={maxHours}
                    value={state.allocated_hours}
                    onChange={(e) => updateState(state.id, { allocated_hours: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--border-line)',
                      borderRadius: 'var(--radius-input)',
                      backgroundColor: 'var(--bg-surface-1)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-body)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Actual Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={state.actual_hours}
                    onChange={(e) => updateState(state.id, { actual_hours: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--border-line)',
                      borderRadius: 'var(--radius-input)',
                      backgroundColor: 'var(--bg-surface-1)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-body)'
                    }}
                  />
                </div>
              </div>

              {state.notes && (
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                    {state.notes}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {states.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-6)', 
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-body)'
        }}>
          <Layout size={32} style={{ marginBottom: 'var(--space-2)' }} />
          <div>No task states defined</div>
          <div style={{ fontSize: 'var(--text-caption)', marginTop: 'var(--space-1)' }}>
            Use a template or add custom states to break down this task
          </div>
        </div>
      )}
    </div>
  )
}
