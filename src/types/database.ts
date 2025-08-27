// Database Types - Matching JSON Database Schema

export interface FrameRange {
  start: number
  end: number
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
  priority: 'low' | 'medium' | 'high' | 'urgent'
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
  assignee?: string // Alias for artist
  dueDate?: string // Alias for deadline
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
