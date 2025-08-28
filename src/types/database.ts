// Database Types - Matching JSON Database Schema

export interface FrameRange {
  start: number
  end: number
}

// Linear-compatible status history tracking
export interface StatusHistoryEntry {
  status: 'not_started' | 'in_progress' | 'review' | 'approved' | 'final'
  changed_at: string
  changed_by: string
  note?: string
}

// Enhanced version control following FR specifications
export interface VersionHistoryEntry {
  version: string
  owner: string
  created_at: string
  is_published: boolean
  published_at?: string
  published_by?: string
  media_ids: string[]
  farm_status?: 'pending' | 'in_progress' | 'completed' | 'failed'
  issues: string[]
  notes?: string
  file_path?: string
  file_size?: number
}

// Media record structure from media_records.json
export interface MediaRecord {
  _id: string
  linked_task_id: string
  linked_version: string
  author: string
  file_name: string
  media_type: 'image' | 'video' | 'sequence'
  file_extension: string
  storage_key: string
  storage_url: string
  thumbnail_key?: string
  description?: string
  tags: string[]
  metadata: {
    file_size: number
    mime_type: string
    duration?: number
    width?: number
    height?: number
    frame_rate?: number
    codec?: string
    bit_rate?: number
    color_space?: string
    creation_date: string
    modification_date: string
    checksum: string
  }
  upload_time: string
  status: 'active' | 'archived' | 'deleted'
  review_selected: boolean
  approval_status: 'pending' | 'under_review' | 'approved' | 'rejected'
  reviewer?: string
  review_notes?: string
  review_date?: string
  _created_at: string
  _updated_at: string
}

// Sub-task state management
export interface SubTaskState {
  id: string
  name: string
  order: number
  allocated_hours: number
  actual_hours: number
  status: 'not_started' | 'in_progress' | 'review' | 'completed'
  start_date?: string
  completion_date?: string
  assignee?: string
  notes?: string
}

// Task state template
export interface TaskStateTemplate {
  template_id: string
  template_name: string
  task_type: string // e.g., 'animation', 'modeling', 'lighting'
  states: {
    name: string
    percentage: number
    description?: string
  }[]
}

// Time entry for additive time logging
export interface TimeEntry {
  id: string
  task_id: string
  user_id: string
  duration_hours: number
  date: string // ISO date string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Task {
  _id: string
  project: string
  type: 'shot' | 'asset' | 'sequence'
  episode: string
  sequence: string
  shot: string
  task: string
  artist: string
  status: 'not_started' | 'in_progress' | 'review' | 'approved' | 'final'
  milestone: 'not_started' | 'single_frame' | 'low_quality' | 'final_render' | 'final_comp' | 'approved' | 'scene_building'
  milestone_note: string
  frame_range: FrameRange
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none' // Linear's priority levels
  start_time: string | null
  deadline: string | null
  actual_time_logged: number
  estimated_duration_hours: number
  versions: string[]
  client_submission_history: any[]
  current_version: string
  published_version: string
  file_extension: string
  master_file: boolean
  working_file_path: string
  render_output_path: string

  // Linear-compatible extensions
  task_type: 'shot' | 'asset' // Clear distinction for VFX workflows
  asset_category?: 'character' | 'prop' | 'set' | 'environment' // For asset tasks
  assignees: string[] // Linear's "assignees" terminology (replaces single artist)
  labels: string[] // Linear's "labels" instead of "tags"
  linked_task_ids: string[] // Linear's linked issues concept
  start_date: string | null // Separate from start_time for Linear-style date handling
  status_history: StatusHistoryEntry[] // Track status changes

  // Enhanced version control (FR specifications) - Optional for backward compatibility
  version_history?: VersionHistoryEntry[] // Detailed version tracking
  media_records?: MediaRecord[] // Associated media files

  // Sub-task state management (FR specifications) - Optional for backward compatibility
  sub_task_states?: SubTaskState[] // Task breakdown states
  task_state_template?: TaskStateTemplate // Applied template

  // Time logging system - Optional for backward compatibility
  time_entries?: TimeEntry[] // Individual time log entries
}
  media_file_path: string
  cache_file_path: string
  filename: string
  sequence_clean: string
  shot_clean: string
  episode_clean: string
  _created_at: string
  _updated_at: string
  updated_at: string
}

export interface DriveMapping {
  working_files: string
  render_outputs: string
  media_files: string
  cache_files: string
  backup_files: string
}

export interface PathSegments {
  middle_path: string
  version_dir: string
  work_dir: string
  publish_dir: string
  cache_dir: string
}

export interface Templates {
  working_file: string
  render_output: string
  media_file: string
  cache_file: string
  submission: string
}

export interface FilenamePatterns {
  maya_scene: string
  nuke_script: string
  houdini_scene: string
  blender_scene: string
  render_sequence: string
  playblast: string
  thumbnail: string
}

export interface NameCleaningRules {
  sequence_pattern: string
  sequence_replacement: string
  shot_pattern: string
  shot_replacement: string
  episode_pattern: string
  episode_replacement: string
}

export interface VersionSettings {
  padding: number
  start_version: number
  increment: number
  format: string
}

export interface TaskSettings {
  default_file_extensions: Record<string, string>
  render_formats: Record<string, string[]>
}

export interface ClientSettings {
  version_reset: boolean
  default_client: string
  delivery_formats: string[]
  approval_required: boolean
}

export interface PlatformSettings {
  windows: {
    working_root: string
    render_root: string
    media_root: string
  }
  linux: {
    working_root: string
    render_root: string
    media_root: string
  }
}

export interface FrameSettings {
  padding: number
  default_start: number
  default_fps: number
}

export interface ProjectBudget {
  allocated_mandays: number
  remaining_mandays: number
  total_mandays: number
}

export interface ProjectTimeline {
  start_date: string
  end_date: string
}

export interface MediaConfiguration {
  daily_review_formats: string[]
  daily_review_resolution: {
    width: number
    height: number
    name: string
  }
  default_frame_rate: number
  final_delivery_formats: string[]
  final_delivery_resolution: {
    width: number
    height: number
    name: string
  }
}

export interface ColorPipeline {
  display_colorspace: string
  ocio_config_path: string
  working_colorspace: string
}

export interface ProjectConfig {
  _id: string
  name: string
  description: string
  drive_mapping: DriveMapping
  path_segments: PathSegments
  templates: Templates
  filename_patterns: FilenamePatterns
  name_cleaning_rules: NameCleaningRules
  version_settings: VersionSettings
  task_settings: TaskSettings
  milestones: string[]
  task_types: string[]
  priority_levels: string[]
  client_settings: ClientSettings
  platform_settings: PlatformSettings
  frame_settings: FrameSettings
  project_budget?: ProjectBudget
  project_timeline?: ProjectTimeline
  media_configuration?: MediaConfiguration
  color_pipeline?: ColorPipeline
  _created_at: string
  _updated_at: string
}

export interface Version {
  _id: string
  task_id: string
  version: string
  version_number: number
  status: 'draft' | 'published' | 'archived'
  author: string
  created_date: string
  modified_date: string
  description: string
  file_path: string
  file_size: number
  is_locked: boolean
  parent_version: string | null
  metadata: Record<string, any>
  _created_at: string
  _updated_at: string
}

// UI-specific interfaces that extend database types
export interface UIProject extends Omit<ProjectConfig, '_id'> {
  id: string
  color: string // UI color for avatars
  status: 'active' | 'inactive' | 'archived'
  memberCount: number
  taskCount: number
  updatedAt: string
}

export interface UITask extends Omit<Task, '_id'> {
  id: string
  title: string // Computed from task details
  projectName: string // Resolved from project ID
  assignee?: string // Alias for artist (backward compatibility)
  dueDate?: string // Alias for deadline (backward compatibility)

  // Linear-compatible UI enhancements
  displayAssignees: string[] // Resolved assignee names for UI display
  displayLabels: { id: string; name: string; color: string }[] // Resolved labels with colors
  linkedTasks: { id: string; title: string; status: string }[] // Resolved linked task info

  // Enhanced features (optional for backward compatibility)
  version_history?: VersionHistoryEntry[] // Detailed version tracking
  media_records?: MediaRecord[] // Associated media files
  sub_task_states?: SubTaskState[] // Task breakdown states
  task_state_template?: TaskStateTemplate // Applied template
}

// Notification types for Inbox
export interface Notification {
  id: string
  type: 'mention' | 'assignment' | 'update' | 'comment' | 'version'
  title: string
  description: string
  userId: string
  relatedId: string // task_id, project_id, version_id, etc.
  relatedType: 'task' | 'project' | 'version' | 'comment'
  isRead: boolean
  createdAt: string
  metadata?: Record<string, any>
}

// Enhanced notification with project context and messaging capabilities
export interface EnhancedNotification extends Notification {
  priority: 'low' | 'medium' | 'high' | 'urgent'
  projectId: string
  projectName: string
  projectColor: string
  canReply: boolean
  hasReplies: boolean
  replyCount?: number
  lastReplyAt?: string
  actionUrl?: string // Deep link to related item
}

// Message system for direct communication
export interface Message {
  id: string
  type: 'direct' | 'reply' | 'cc' | 'system'
  subject: string
  content: string
  fromUserId: string
  fromUserName: string
  toUserIds: string[]
  toUserNames: string[]
  ccUserIds?: string[]
  ccUserNames?: string[]
  relatedTaskId?: string
  relatedProjectId?: string
  relatedProjectName?: string
  isRead: boolean
  createdAt: string
  updatedAt?: string
  parentMessageId?: string // for replies
  threadId?: string // for conversation grouping
  attachments?: MessageAttachment[]
  metadata?: Record<string, any>
}

// Message attachment structure
export interface MessageAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  thumbnailUrl?: string
}

// Inbox filter state
export interface InboxFilters {
  projectId: string | null
  type: string | null
  priority: string | null
  readStatus: 'all' | 'unread' | 'read'
  sortBy: 'date' | 'project' | 'priority' | 'type'
  sortOrder: 'asc' | 'desc'
  searchQuery: string
}

// Bulk operation types
export type BulkOperation = 'markAsRead' | 'markAsUnread' | 'delete' | 'archive'

// Inbox statistics
export interface InboxStats {
  total: number
  unread: number
  byProject: Record<string, { total: number; unread: number }>
  byType: Record<string, { total: number; unread: number }>
  byPriority: Record<string, { total: number; unread: number }>
}

// Task Comments for Task Detail Panel
export interface TaskComment {
  id: string
  taskId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: string
  createdAt: string
  updatedAt?: string
}
