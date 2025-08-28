// Task Detail Panel - Linear-style slide-out panel for comprehensive task information
import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { useTaskDetail } from '@/contexts/TaskDetailContext'
import { TaskPropertiesProvider } from '@/contexts/TaskPropertiesContext'
import { TaskDetailView } from './TaskDetailView'
import { TaskStatusSelector } from './TaskStatusSelector'
import { TaskComments } from './TaskComments'
import { ConsolidatedDescriptionSection } from './ConsolidatedDescriptionSection'
import { EnhancedVersionHistory } from './EnhancedVersionHistory'
import { MediaSection } from './MediaSection'
import { SubTaskStatesManager } from './SubTaskStatesManager'
import { EnhancedTimeLogging } from './EnhancedTimeLogging'
import { DescriptionSection, CommentsSection, VersionHistorySection, TimeLogsSection, CollapsibleSection } from '@/components/ui/CollapsibleSection'
import './TaskDetailPanel.css'

export const TaskDetailPanel: React.FC = () => {
  const { isOpen, selectedTask, closeTaskDetail } = useTaskDetail()

  // Generate content previews for collapsed sections
  const getDescriptionPreview = (task: any) => {
    if (task.milestone_note) {
      return task.milestone_note.length > 50
        ? `${task.milestone_note.substring(0, 50)}...`
        : task.milestone_note
    }
    return 'No description'
  }

  const getCommentsPreview = () => {
    // TODO: Get actual comment count from task data
    return '0 comments'
  }

  const getVersionHistoryPreview = (task: any) => {
    const versionCount = task.versions?.length || 0
    return `${versionCount} version${versionCount !== 1 ? 's' : ''} • Current: ${task.current_version || 'None'}`
  }

  const getTimeLogsPreview = (task: any) => {
    return `${task.actual_time_logged || 0}h logged • ${task.estimated_duration_hours || 0}h estimated`
  }

  const getMediaPreview = (task: any) => {
    const mediaCount = task.media_records?.length || 0
    const publishedCount = task.media_records?.filter((m: any) => m.approval_status === 'approved').length || 0
    return `${mediaCount} media • ${publishedCount} published`
  }

  const getSubTaskStatesPreview = (task: any) => {
    const statesCount = task.sub_task_states?.length || 0
    const completedCount = task.sub_task_states?.filter((s: any) => s.status === 'completed').length || 0
    return statesCount > 0 ? `${completedCount}/${statesCount} states completed` : 'No states defined'
  }

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeTaskDetail()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeTaskDetail])

  if (!isOpen || !selectedTask) {
    return null
  }

  return (
    <TaskPropertiesProvider>
      {/* Backdrop overlay */}
      <div
        className="task-detail-backdrop"
        onClick={closeTaskDetail}
      />

      {/* Panel */}
      <div className={`task-detail-panel ${isOpen ? 'open' : ''}`}>
        {/* Panel Header - Linear Style */}
        <div className="task-detail-header">
          <div className="task-detail-header-content">
            <h2 className="task-detail-title">Task Details</h2>
            <button
              className="task-detail-close-btn"
              onClick={closeTaskDetail}
              aria-label="Close task details"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Panel Content - Linear Layout */}
        <div className="task-detail-content">
          {/* Consolidated Description Section with Properties - Collapsible */}
          <DescriptionSection
            title="Task Details"
            contentPreview={getDescriptionPreview(selectedTask)}
            defaultExpanded={true}
          >
            <ConsolidatedDescriptionSection task={selectedTask} />
          </DescriptionSection>

          {/* Comments Section - Collapsible */}
          <CommentsSection
            title="Comments"
            contentPreview={getCommentsPreview()}
          >
            <TaskComments taskId={selectedTask.id} />
          </CommentsSection>

          {/* Enhanced Version History Section - Collapsible */}
          <VersionHistorySection
            title="Version History"
            contentPreview={getVersionHistoryPreview(selectedTask)}
          >
            <EnhancedVersionHistory task={selectedTask} />
          </VersionHistorySection>

          {/* Media Section - Collapsible */}
          <CollapsibleSection
            id="media"
            title="Media"
            contentPreview={getMediaPreview(selectedTask)}
            defaultExpanded={false}
          >
            <MediaSection task={selectedTask} />
          </CollapsibleSection>

          {/* Sub-Task States Section - Collapsible */}
          <CollapsibleSection
            id="sub-task-states"
            title="Task States"
            contentPreview={getSubTaskStatesPreview(selectedTask)}
            defaultExpanded={false}
          >
            <SubTaskStatesManager
              task={selectedTask}
              onUpdateStates={(states) => {
                // TODO: Update task with new states
                console.log('Updated states:', states)
              }}
            />
          </CollapsibleSection>

          {/* Enhanced Time Tracking Section - Collapsible */}
          <TimeLogsSection
            title="Time Tracking"
            contentPreview={getTimeLogsPreview(selectedTask)}
          >
            <EnhancedTimeLogging
              task={selectedTask}
              onUpdateTimeEntries={(entries) => {
                // TODO: Update task with new time entries
                console.log('Updated time entries:', entries)
              }}
            />
          </TimeLogsSection>
        </div>
      </div>
    </TaskPropertiesProvider>
  )
}
