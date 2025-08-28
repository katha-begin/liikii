// Consolidated Description Section with Integrated Properties
import React, { useState } from 'react'
import { clsx } from 'clsx'
import {
  Edit3,
  Save,
  X,
  Calendar,
  User,
  Tag,
  Link,
  Clock,
  Target,
  AlertCircle,
  Camera
} from 'lucide-react'
import { UITask } from '@/types/database'
import { TaskTypeIndicator, LinearDatePicker, LinearDateRangePicker } from '@/components/task-properties'
import { TaskLabels } from '@/components/task-properties/TaskLabels'
import { useTaskProperties } from '@/contexts/TaskPropertiesContext'

interface ConsolidatedDescriptionSectionProps {
  task: UITask
}

export const ConsolidatedDescriptionSection: React.FC<ConsolidatedDescriptionSectionProps> = ({ task }) => {
  const { updateTaskDateRange, updateTaskDates } = useTaskProperties()
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState(task.milestone_note || '')

  // Handle description save
  const handleSaveDescription = () => {
    // TODO: Update task description
    console.log('Saving description:', editedDescription)
    setIsEditingDescription(false)
  }

  // Handle description cancel
  const handleCancelDescription = () => {
    setEditedDescription(task.milestone_note || '')
    setIsEditingDescription(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Task Header with Type and Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <TaskTypeIndicator task={task} size="md" />
        <div style={{ flex: 1 }}>
          <h1 style={{
            margin: 0,
            fontSize: 'var(--text-h1)',
            lineHeight: 'var(--text-h1-lh)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            marginBottom: 'var(--space-1)'
          }}>
            {task.title}
          </h1>
          <p style={{
            margin: 0,
            fontSize: 'var(--text-caption)',
            lineHeight: 'var(--text-caption-lh)',
            color: 'var(--text-secondary)',
            marginTop: 'var(--space-1)'
          }}>
            {task.project} • {task.episode} • {task.sequence} • {task.shot}
          </p>
        </div>
      </div>

      {/* Key Properties Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-3)',
        padding: 'var(--space-3)',
        backgroundColor: 'var(--bg-surface-2)',
        borderRadius: 'var(--radius-input)',
        border: '1px solid var(--border-line)'
      }}>
        {/* Status */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-1)', 
            marginBottom: 'var(--space-2)' 
          }}>
            <Target size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Status
            </span>
          </div>
          <select
            value={task.status || 'not_started'}
            onChange={(e) => console.log('Status changed:', e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              backgroundColor: 'var(--bg-surface-1)',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--border-line)',
              fontSize: 'var(--text-body)',
              color: 'var(--text-primary)',
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

        {/* Priority */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-1)', 
            marginBottom: 'var(--space-2)' 
          }}>
            <AlertCircle size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Priority
            </span>
          </div>
          <select
            value={task.priority || 'none'}
            onChange={(e) => console.log('Priority changed:', e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              backgroundColor: 'var(--bg-surface-1)',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--border-line)',
              fontSize: 'var(--text-body)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Labels */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)'
          }}>
            <Tag size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Labels
            </span>
          </div>
          <TaskLabels
            labels={task.labels || []}
            availableLabels={[
              { id: '1', name: 'High Priority', color: 'var(--semantic-danger)' },
              { id: '2', name: 'Bug Fix', color: 'var(--accent-orange)' },
              { id: '3', name: 'Feature', color: 'var(--accent-blue)' },
              { id: '4', name: 'Enhancement', color: 'var(--accent-mint)' },
              { id: '5', name: 'Documentation', color: 'var(--accent-purple)' }
            ]}
            onChange={(labels) => console.log('Labels changed:', labels)}
          />
        </div>



        {/* Project */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)'
          }}>
            <Target size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Project
            </span>
          </div>
          <div
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              backgroundColor: 'var(--bg-surface-1)',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--border-line)',
              fontSize: 'var(--text-body)',
              color: 'var(--text-primary)',
              minHeight: '28px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {task.project || 'No project assigned'}
          </div>
        </div>

        {/* Type */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)'
          }}>
            <Tag size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Type
            </span>
          </div>
          <div
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              backgroundColor: 'var(--bg-surface-1)',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--border-line)',
              fontSize: 'var(--text-body)',
              color: 'var(--text-primary)',
              minHeight: '28px',
              display: 'flex',
              alignItems: 'center',
              textTransform: 'capitalize'
            }}
          >
            {task.type || 'shot'}
          </div>
        </div>

        {/* Episode (for shot tasks) */}
        {task.type === 'shot' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              marginBottom: 'var(--space-2)'
            }}>
              <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                Episode
              </span>
            </div>
            <div
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-1)',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--border-line)',
                fontSize: 'var(--text-body)',
                color: 'var(--text-primary)',
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {task.episode || 'No episode assigned'}
            </div>
          </div>
        )}

        {/* Sequence (for shot tasks) */}
        {task.type === 'shot' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              marginBottom: 'var(--space-2)'
            }}>
              <Link size={14} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                Sequence
              </span>
            </div>
            <div
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-1)',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--border-line)',
                fontSize: 'var(--text-body)',
                color: 'var(--text-primary)',
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {task.sequence || 'No sequence assigned'}
            </div>
          </div>
        )}

        {/* Shot (for shot tasks) */}
        {task.type === 'shot' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              marginBottom: 'var(--space-2)'
            }}>
              <Camera size={14} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                Shot
              </span>
            </div>
            <div
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-1)',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--border-line)',
                fontSize: 'var(--text-body)',
                color: 'var(--text-primary)',
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {task.shot || 'No shot assigned'}
            </div>
          </div>
        )}

        {/* Asset Category (for asset tasks) */}
        {task.type === 'asset' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              marginBottom: 'var(--space-2)'
            }}>
              <Tag size={14} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                Asset Category
              </span>
            </div>
            <select
              value={task.asset_category || 'character'}
              onChange={(e) => console.log('Asset Category changed:', e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-1)',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--border-line)',
                fontSize: 'var(--text-body)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="character">Character</option>
              <option value="prop">Prop</option>
              <option value="set">Set</option>
              <option value="environment">Environment</option>
            </select>
          </div>
        )}

        {/* Asset Name (for asset tasks) */}
        {task.type === 'asset' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              marginBottom: 'var(--space-2)'
            }}>
              <User size={14} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                Asset Name
              </span>
            </div>
            <input
              type="text"
              value={task.asset_name || ''}
              onChange={(e) => console.log('Asset Name changed:', e.target.value)}
              placeholder="Asset name"
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-1)',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--border-line)',
                fontSize: 'var(--text-body)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        )}

        {/* Task Type */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)'
          }}>
            <AlertCircle size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Task Type
            </span>
          </div>
          {task.type === 'asset' ? (
            <select
              value={task.task || 'modeling'}
              onChange={(e) => console.log('Task Type changed:', e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-1)',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--border-line)',
                fontSize: 'var(--text-body)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="modeling">Modeling</option>
              <option value="texturing">Texturing</option>
              <option value="rigging">Rigging</option>
            </select>
          ) : (
            <input
              type="text"
              value={task.task || ''}
              onChange={(e) => console.log('Task Type changed:', e.target.value)}
              placeholder="Task type (e.g., lighting)"
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-1)',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--border-line)',
                fontSize: 'var(--text-body)',
                color: 'var(--text-primary)'
              }}
            />
          )}
        </div>

        {/* Date Range */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)'
          }}>
            <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Date Range
            </span>
          </div>
          <LinearDateRangePicker
            startDate={task.start_date}
            endDate={task.deadline}
            onChange={(range) => updateTaskDateRange(task.id, range)}
            placeholder="Set date range"
          />
        </div>

        {/* Start Date */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)'
          }}>
            <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Start Date
            </span>
          </div>
          <LinearDatePicker
            value={task.start_date}
            onChange={(date) => updateTaskDates(task.id, date, undefined)}
            placeholder="Set start date"
          />
        </div>

        {/* End Date */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)'
          }}>
            <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              End Date
            </span>
          </div>
          <LinearDatePicker
            value={task.deadline}
            onChange={(date) => updateTaskDates(task.id, undefined, date)}
            placeholder="Set end date"
          />
        </div>

        {/* Estimated Duration */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)'
          }}>
            <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Estimated Hours
            </span>
            <span style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              marginLeft: 'auto'
            }}>
              Auto-calculated from date range
            </span>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 12px',
              backgroundColor: task.estimated_duration_hours ? 'var(--accent-blue)' : 'var(--bg-surface-2)',
              borderRadius: '6px',
              border: `1px solid ${task.estimated_duration_hours ? 'var(--accent-blue)' : 'var(--border-line)'}`,
              fontSize: '14px',
              fontWeight: 500,
              color: task.estimated_duration_hours ? 'white' : 'var(--text-secondary)',
              minHeight: '32px'
            }}
          >
            <Clock size={14} style={{ marginRight: '6px' }} />
            {task.estimated_duration_hours ? `${task.estimated_duration_hours} hours` : 'Set date range to calculate'}
          </div>
        </div>

        {/* Assignees */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-1)', 
            marginBottom: 'var(--space-2)' 
          }}>
            <User size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Assignees
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
            {task.displayAssignees.length > 0 ? (
              task.displayAssignees.map((assignee, index) => (
                <span
                  key={index}
                  style={{
                    padding: 'var(--space-1) var(--space-2)',
                    backgroundColor: 'var(--bg-surface-1)',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 'var(--text-caption)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-line)'
                  }}
                >
                  {assignee}
                </span>
              ))
            ) : (
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                Unassigned
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Labels */}
      {task.displayLabels.length > 0 && (
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-1)', 
            marginBottom: 'var(--space-2)' 
          }}>
            <Tag size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Labels
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {task.displayLabels.map((label) => (
              <span
                key={label.id}
                style={{
                  padding: 'var(--space-1) var(--space-2)',
                  backgroundColor: label.color,
                  color: 'white',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 500
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Linked Tasks */}
      {task.linkedTasks.length > 0 && (
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-1)', 
            marginBottom: 'var(--space-2)' 
          }}>
            <Link size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Linked Tasks
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {task.linkedTasks.map((linkedTask) => (
              <div
                key={linkedTask.id}
                style={{
                  padding: 'var(--space-2)',
                  backgroundColor: 'var(--bg-surface-2)',
                  borderRadius: 'var(--radius-input)',
                  border: '1px solid var(--border-line)',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)'
                }}
              >
                {linkedTask.title}
                <span style={{ 
                  marginLeft: 'var(--space-2)', 
                  color: 'var(--text-secondary)' 
                }}>
                  ({linkedTask.status.replace('_', ' ')})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description Content */}
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: 'var(--space-3)' 
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: 'var(--text-body)', 
            fontWeight: 600, 
            color: 'var(--text-primary)' 
          }}>
            Description
          </h3>
          {!isEditingDescription && (
            <button
              onClick={() => setIsEditingDescription(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                padding: 'var(--space-1) var(--space-2)',
                border: '1px solid var(--border-line)',
                borderRadius: 'var(--radius-input)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-caption)',
                cursor: 'pointer',
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
              <Edit3 size={12} />
              Edit
            </button>
          )}
        </div>

        {isEditingDescription ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Add a description for this task..."
              rows={6}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--border-line)',
                borderRadius: 'var(--radius-input)',
                backgroundColor: 'var(--bg-surface-1)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-body)',
                lineHeight: 1.5,
                resize: 'vertical',
                minHeight: '120px'
              }}
            />
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelDescription}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
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
                <X size={12} />
                Cancel
              </button>
              <button
                onClick={handleSaveDescription}
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
                <Save size={12} />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            padding: task.milestone_note ? 'var(--space-3)' : 'var(--space-6)',
            backgroundColor: 'var(--bg-surface-2)',
            borderRadius: 'var(--radius-input)',
            border: '1px solid var(--border-line)',
            fontSize: 'var(--text-body)',
            lineHeight: 1.5,
            color: task.milestone_note ? 'var(--text-primary)' : 'var(--text-secondary)',
            textAlign: task.milestone_note ? 'left' : 'center'
          }}>
            {task.milestone_note || 'No description provided. Click "Edit" to add one.'}
          </div>
        )}
      </div>
    </div>
  )
}
