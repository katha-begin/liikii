// Linear-style Task Properties Panel
import React from 'react'
import { UITask } from '@/types/database'
import { InlinePropertyEditor, TaskTypeIndicator, LinearDatePicker, LinearDateRangePicker } from '@/components/task-properties'
import { TaskLabels } from '@/components/task-properties/TaskLabels'
import { useTaskProperties } from '@/contexts/TaskPropertiesContext'
import { TaskPropertiesSection, CollaborationSection } from '@/components/ui/CollapsibleSection'

interface LinearTaskPropertiesPanelProps {
  task: UITask
}

export const LinearTaskPropertiesPanel: React.FC<LinearTaskPropertiesPanelProps> = ({ task }) => {
  const { updateTaskDateRange, updateTaskDates } = useTaskProperties()

  // Generate content previews for collapsed sections
  const getPropertiesPreview = () => {
    const items = []
    if (task.status) items.push(task.status.replace('_', ' '))
    if (task.priority && task.priority !== 'none') items.push(task.priority)
    if (task.assignees?.length) items.push(`${task.assignees.length} assignee${task.assignees.length !== 1 ? 's' : ''}`)
    return items.length > 0 ? items.join(' • ') : 'No properties set'
  }

  const getCollaborationPreview = () => {
    const items = []
    if (task.assignees?.length) items.push(`${task.assignees.length} member${task.assignees.length !== 1 ? 's' : ''}`)
    if (task.labels?.length) items.push(`${task.labels.length} label${task.labels.length !== 1 ? 's' : ''}`)
    if (task.linked_task_ids?.length) items.push(`${task.linked_task_ids.length} linked`)
    return items.length > 0 ? items.join(' • ') : 'No collaboration'
  }

  return (
    <div
      className="linear-task-properties-panel"
      style={{
        backgroundColor: 'var(--bg-surface-1)'
      }}
    >
      {/* Task Header - Always Visible */}
      <div
        style={{
          padding: 'var(--space-4)',
          borderBottom: '1px solid var(--border-line)'
        }}
      >
        {/* Task Type and Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-3)'
          }}
        >
          <TaskTypeIndicator task={task} size="sm" />
          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 'var(--text-h1)',
                lineHeight: 'var(--text-h1-lh)',
                color: 'var(--text-primary)',
                fontWeight: 600
              }}
            >
              {task.title}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-caption)',
                lineHeight: 'var(--text-caption-lh)',
                color: 'var(--text-secondary)',
                marginTop: 'var(--space-1)'
              }}
            >
              {task.projectName} • {task.episode} • {task.sequence} • {task.shot}
            </p>
          </div>
        </div>
      </div>

      {/* Properties Section - Collapsible */}
      <TaskPropertiesSection
        title="Properties"
        contentPreview={getPropertiesPreview()}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
            padding: 'var(--space-3)',
            backgroundColor: 'var(--bg-surface-2)',
            borderRadius: 'var(--radius-input)',
            border: '1px solid var(--border-line)'
          }}
        >
          {/* Status */}
          <div className="property-item">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              Status
            </label>
            <InlinePropertyEditor
              task={task}
              property="status"
            />
          </div>

          {/* Priority */}
          <div className="property-item">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              Priority
            </label>
            <InlinePropertyEditor
              task={task}
              property="priority"
            />
          </div>

          {/* Assignee */}
          <div className="property-item">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              Assignee
            </label>
            <InlinePropertyEditor
              task={task}
              property="assignees"
            />
          </div>



          {/* Project */}
          <div className="property-item">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              Project
            </label>
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
          <div className="property-item">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              Type
            </label>
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
            <div className="property-item">
              <label
                style={{
                  display: 'block',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-1)',
                  fontWeight: 500
                }}
              >
                Episode
              </label>
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
            <div className="property-item">
              <label
                style={{
                  display: 'block',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-1)',
                  fontWeight: 500
                }}
              >
                Sequence
              </label>
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
            <div className="property-item">
              <label
                style={{
                  display: 'block',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-1)',
                  fontWeight: 500
                }}
              >
                Shot
              </label>
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
            <div className="property-item">
              <label
                style={{
                  display: 'block',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-1)',
                  fontWeight: 500
                }}
              >
                Asset Category
              </label>
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
            <div className="property-item">
              <label
                style={{
                  display: 'block',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-1)',
                  fontWeight: 500
                }}
              >
                Asset Name
              </label>
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
          <div className="property-item">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              Task Type
            </label>
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

          {/* Labels */}
          <div className="property-item" style={{ gridColumn: '1 / -1' }}>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              Labels
            </label>
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

          {/* Date Range */}
          <div className="property-item" style={{ gridColumn: '1 / -1' }}>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              Date Range
            </label>
            <LinearDateRangePicker
              startDate={task.start_date}
              endDate={task.deadline}
              onChange={(range) => updateTaskDateRange(task.id, range)}
              placeholder="Set date range"
            />
          </div>

          {/* Start Date */}
          <div className="property-item">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              Start Date
            </label>
            <LinearDatePicker
              value={task.start_date}
              onChange={(date) => updateTaskDates(task.id, date, undefined)}
              placeholder="Set start date"
            />
          </div>

          {/* End Date */}
          <div className="property-item">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              End Date
            </label>
            <LinearDatePicker
              value={task.deadline}
              onChange={(date) => updateTaskDates(task.id, undefined, date)}
              placeholder="Set end date"
            />
          </div>

          {/* Labels */}
          <div className="property-item">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
                fontWeight: 500
              }}
            >
              Labels
            </label>
            <InlinePropertyEditor
              task={task}
              property="labels"
            />
          </div>
        </div>
      </TaskPropertiesSection>

      {/* Collaboration Section - Collapsible */}
      <CollaborationSection
        title="Collaboration"
        contentPreview={getCollaborationPreview()}
      >

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)'
          }}
        >
          {/* Members */}
          <div className="collaboration-item">
            <label
              style={{
                display: 'inline-block',
                fontSize: 'var(--text-body)',
                color: 'var(--text-primary)',
                marginRight: 'var(--space-3)',
                minWidth: '80px',
                fontWeight: 500
              }}
            >
              Members:
            </label>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {/* TODO: Render assignee avatars */}
              <span
                style={{
                  fontSize: 'var(--text-body)',
                  color: 'var(--text-secondary)'
                }}
              >
                {task.assignees?.length ? `${task.assignees.length} assignee${task.assignees.length !== 1 ? 's' : ''}` : 'Unassigned'}
              </span>
              <button
                style={{
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
                + Add
              </button>
            </div>
          </div>

          {/* Labels */}
          <div className="collaboration-item">
            <label
              style={{
                display: 'inline-block',
                fontSize: 'var(--text-body)',
                color: 'var(--text-primary)',
                marginRight: 'var(--space-3)',
                minWidth: '80px',
                fontWeight: 500
              }}
            >
              Labels:
            </label>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {/* TODO: Render label badges */}
              <span
                style={{
                  fontSize: 'var(--text-body)',
                  color: 'var(--text-secondary)'
                }}
              >
                {task.labels?.length ? `${task.labels.length} label${task.labels.length !== 1 ? 's' : ''}` : 'No labels'}
              </span>
              <button
                style={{
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
                + Add
              </button>
            </div>
          </div>

          {/* Linked Tasks */}
          <div className="collaboration-item">
            <label
              style={{
                display: 'inline-block',
                fontSize: 'var(--text-body)',
                color: 'var(--text-primary)',
                marginRight: 'var(--space-3)',
                minWidth: '80px',
                fontWeight: 500
              }}
            >
              Linked:
            </label>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {/* TODO: Render linked task chips */}
              <span
                style={{
                  fontSize: 'var(--text-body)',
                  color: 'var(--text-secondary)'
                }}
              >
                {task.linked_task_ids?.length ? `${task.linked_task_ids.length} linked task${task.linked_task_ids.length !== 1 ? 's' : ''}` : 'No linked tasks'}
              </span>
              <button
                style={{
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
                + Link
              </button>
            </div>
          </div>
        </div>
      </CollaborationSection>
    </div>
  )
}
