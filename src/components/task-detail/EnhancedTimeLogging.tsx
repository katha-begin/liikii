// Enhanced Time Logging Component with Additive Time Entries
import React, { useState, useCallback } from 'react'
import { clsx } from 'clsx'
import { 
  Plus, 
  Clock, 
  Calendar, 
  User, 
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react'
import { UITask, TimeEntry } from '@/types/database'

interface EnhancedTimeLoggingProps {
  task: UITask
  onUpdateTimeEntries?: (entries: TimeEntry[]) => void
}

export const EnhancedTimeLogging: React.FC<EnhancedTimeLoggingProps> = ({ 
  task, 
  onUpdateTimeEntries 
}) => {
  const [isAddingTime, setIsAddingTime] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [newTimeEntry, setNewTimeEntry] = useState({
    duration: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    task_state: 'in_progress'
  })

  const timeEntries = task.time_entries || []
  const totalLoggedTime = timeEntries.reduce((sum, entry) => sum + entry.duration_hours, 0)
  const estimatedTime = task.estimated_duration_hours || 0
  const remainingTime = Math.max(0, estimatedTime - totalLoggedTime)
  const progressPercentage = estimatedTime > 0 ? Math.min(100, (totalLoggedTime / estimatedTime) * 100) : 0

  // Helper function to get task state colors
  const getTaskStateColor = (state: string) => {
    switch (state) {
      case 'not_started':
        return { color: 'var(--text-secondary)', bg: 'var(--bg-surface-2)' }
      case 'in_progress':
        return { color: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.1)' }
      case 'review':
        return { color: 'var(--accent-orange)', bg: 'rgba(251, 146, 60, 0.1)' }
      case 'approved':
        return { color: 'var(--semantic-success)', bg: 'rgba(34, 197, 94, 0.1)' }
      case 'final':
        return { color: 'var(--accent-purple)', bg: 'rgba(147, 51, 234, 0.1)' }
      default:
        return { color: 'var(--text-secondary)', bg: 'var(--bg-surface-2)' }
    }
  }

  // Add new time entry
  const handleAddTimeEntry = useCallback(() => {
    if (!newTimeEntry.duration || parseFloat(newTimeEntry.duration) <= 0) return

    const entry: TimeEntry = {
      id: `time_${Date.now()}`,
      task_id: task.id,
      user_id: 'current_user', // TODO: Get from auth context
      duration_hours: parseFloat(newTimeEntry.duration),
      date: newTimeEntry.date,
      notes: newTimeEntry.notes.trim() || undefined,
      task_state: newTimeEntry.task_state,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const updatedEntries = [...timeEntries, entry]
    onUpdateTimeEntries?.(updatedEntries)

    // Reset form
    setNewTimeEntry({
      duration: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      task_state: 'in_progress'
    })
    setIsAddingTime(false)
  }, [newTimeEntry, timeEntries, task.id, onUpdateTimeEntries])

  // Delete time entry
  const handleDeleteEntry = useCallback((entryId: string) => {
    const updatedEntries = timeEntries.filter(entry => entry.id !== entryId)
    onUpdateTimeEntries?.(updatedEntries)
  }, [timeEntries, onUpdateTimeEntries])

  // Format duration for display
  const formatDuration = (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`
    }
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Time Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: 'var(--space-3)' 
      }}>
        <div style={{
          padding: 'var(--space-3)',
          backgroundColor: 'var(--bg-surface-2)',
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--border-line)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
            Time Logged
          </div>
          <div style={{ fontSize: 'var(--text-h2)', fontWeight: 600, color: 'var(--accent-blue)' }}>
            {formatDuration(totalLoggedTime)}
          </div>
        </div>
        
        <div style={{
          padding: 'var(--space-3)',
          backgroundColor: 'var(--bg-surface-2)',
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--border-line)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
            Estimated
          </div>
          <div style={{ fontSize: 'var(--text-h2)', fontWeight: 600, color: 'var(--text-primary)' }}>
            {formatDuration(estimatedTime)}
          </div>
        </div>
        
        <div style={{
          padding: 'var(--space-3)',
          backgroundColor: 'var(--bg-surface-2)',
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--border-line)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
            Remaining
          </div>
          <div style={{ 
            fontSize: 'var(--text-h2)', 
            fontWeight: 600, 
            color: remainingTime > 0 ? 'var(--semantic-success)' : 'var(--semantic-warning)' 
          }}>
            {formatDuration(remainingTime)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'var(--space-2)' 
        }}>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            Progress
          </span>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--bg-surface-2)',
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: '100%',
            backgroundColor: progressPercentage > 100 ? 'var(--semantic-warning)' : 'var(--accent-blue)',
            transition: 'width 200ms ease-out'
          }} />
        </div>
      </div>

      {/* Add Time Entry Section */}
      <div style={{
        padding: 'var(--space-3)',
        backgroundColor: 'var(--bg-surface-2)',
        borderRadius: 'var(--radius-input)',
        border: '1px solid var(--border-line)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: isAddingTime ? 'var(--space-3)' : 0 
        }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: 'var(--text-body)', 
            fontWeight: 600, 
            color: 'var(--text-primary)' 
          }}>
            Log Time
          </h4>
          {!isAddingTime && (
            <button
              onClick={() => setIsAddingTime(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                padding: 'var(--space-2) var(--space-3)',
                border: 'none',
                borderRadius: 'var(--radius-input)',
                backgroundColor: 'var(--accent-blue)',
                color: 'white',
                fontSize: 'var(--text-caption)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 150ms ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-lilac)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-blue)'
              }}
            >
              <Plus size={14} />
              Add Time
            </button>
          )}
        </div>

        {/* Add Time Form */}
        {isAddingTime && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: 'var(--text-caption)', 
                  color: 'var(--text-secondary)', 
                  marginBottom: 'var(--space-1)' 
                }}>
                  Duration (hours)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  max="24"
                  value={newTimeEntry.duration}
                  onChange={(e) => setNewTimeEntry(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 2.5"
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
                <label style={{ 
                  display: 'block', 
                  fontSize: 'var(--text-caption)', 
                  color: 'var(--text-secondary)', 
                  marginBottom: 'var(--space-1)' 
                }}>
                  Date
                </label>
                <input
                  type="date"
                  value={newTimeEntry.date}
                  onChange={(e) => setNewTimeEntry(prev => ({ ...prev, date: e.target.value }))}
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

            {/* Task State */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)'
              }}>
                Task State (optional)
              </label>
              <select
                value={newTimeEntry.task_state}
                onChange={(e) => setNewTimeEntry(prev => ({ ...prev, task_state: e.target.value }))}
                style={{
                  width: '100%',
                  padding: 'var(--space-2)',
                  border: '1px solid var(--border-line)',
                  borderRadius: 'var(--radius-input)',
                  backgroundColor: 'var(--bg-surface-1)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-body)',
                  cursor: 'pointer'
                }}
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="approved">Approved</option>
                <option value="final">Final</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)'
              }}>
                Notes (optional)
              </label>
              <textarea
                value={newTimeEntry.notes}
                onChange={(e) => setNewTimeEntry(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="What did you work on?"
                rows={2}
                style={{
                  width: '100%',
                  padding: 'var(--space-2)',
                  border: '1px solid var(--border-line)',
                  borderRadius: 'var(--radius-input)',
                  backgroundColor: 'var(--bg-surface-1)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-body)',
                  resize: 'vertical',
                  minHeight: '60px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setIsAddingTime(false)
                  setNewTimeEntry({
                    duration: '',
                    date: new Date().toISOString().split('T')[0],
                    notes: '',
                    task_state: 'in_progress'
                  })
                }}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  border: '1px solid var(--border-line)',
                  borderRadius: 'var(--radius-input)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-caption)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease-out'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTimeEntry}
                disabled={!newTimeEntry.duration || parseFloat(newTimeEntry.duration) <= 0}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  border: 'none',
                  borderRadius: 'var(--radius-input)',
                  backgroundColor: 'var(--accent-blue)',
                  color: 'white',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  opacity: (!newTimeEntry.duration || parseFloat(newTimeEntry.duration) <= 0) ? 0.5 : 1,
                  transition: 'all 150ms ease-out'
                }}
              >
                Add Time
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Time Entries List */}
      {timeEntries.length > 0 && (
        <div>
          <h4 style={{ 
            margin: 0, 
            marginBottom: 'var(--space-3)', 
            fontSize: 'var(--text-body)', 
            fontWeight: 600, 
            color: 'var(--text-primary)' 
          }}>
            Time Entries ({timeEntries.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {timeEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--bg-surface-2)',
                    borderRadius: 'var(--radius-input)',
                    border: '1px solid var(--border-line)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-3)', 
                      marginBottom: 'var(--space-1)' 
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-1)' 
                      }}>
                        <Clock size={14} style={{ color: 'var(--accent-blue)' }} />
                        <span style={{ 
                          fontSize: 'var(--text-body)', 
                          fontWeight: 600, 
                          color: 'var(--text-primary)' 
                        }}>
                          {formatDuration(entry.duration_hours)}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-1)' 
                      }}>
                        <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ 
                          fontSize: 'var(--text-caption)', 
                          color: 'var(--text-secondary)' 
                        }}>
                          {formatDate(entry.date)}
                        </span>
                      </div>
                      {/* Task State Badge */}
                      {entry.task_state && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: getTaskStateColor(entry.task_state).bg,
                            border: `1px solid ${getTaskStateColor(entry.task_state).color}`,
                            fontSize: '10px',
                            fontWeight: 500,
                            color: getTaskStateColor(entry.task_state).color,
                            textTransform: 'capitalize'
                          }}
                        >
                          {entry.task_state.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                    {entry.notes && (
                      <p style={{ 
                        margin: 0, 
                        fontSize: 'var(--text-caption)', 
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4
                      }}>
                        {entry.notes}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    style={{
                      padding: 'var(--space-1)',
                      border: 'none',
                      borderRadius: 'var(--radius-input)',
                      backgroundColor: 'transparent',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--semantic-danger)'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                    title="Delete time entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {timeEntries.length === 0 && !isAddingTime && (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-6)', 
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-body)'
        }}>
          <Clock size={32} style={{ marginBottom: 'var(--space-2)' }} />
          <div>No time entries logged</div>
          <div style={{ fontSize: 'var(--text-caption)', marginTop: 'var(--space-1)' }}>
            Click "Add Time" to start tracking your work
          </div>
        </div>
      )}
    </div>
  )
}
