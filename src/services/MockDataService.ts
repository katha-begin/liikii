// Mock Data Service - Simulates API calls with JSON database data
import { UIProject, UITask, Notification, TaskComment } from '@/types/database'
import { DataResponse, QueryOptions } from './DataService'

// Mock data based on our JSON database
const mockProjects: UIProject[] = [
  {
    id: 'SWA',
    name: 'Sky Wars Anthology',
    description: 'VFX project for Sky Wars Anthology series with comprehensive pipeline',
    color: '#CBB7E8',
    status: 'active',
    memberCount: 8,
    taskCount: 156,
    updatedAt: '2025-08-17T14:13:05.705798',
    // Full database schema fields
    drive_mapping: {
      working_files: 'V:',
      render_outputs: 'W:',
      media_files: 'E:',
      cache_files: 'E:',
      backup_files: 'E:'
    },
    path_segments: {
      middle_path: 'all/scene',
      version_dir: 'version',
      work_dir: 'work',
      publish_dir: 'publish',
      cache_dir: 'cache'
    },
    templates: {
      working_file: '{drive_working}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/{filename}',
      render_output: '{drive_render}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/',
      media_file: '{drive_media}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/media/',
      cache_file: '{drive_cache}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/cache/',
      submission: '{drive_render}/{project}/deliveries/{client}/{episode}/{sequence_clean}/{shot_clean}/{task}/v{client_version}/'
    },
    filename_patterns: {
      maya_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.ma',
      nuke_script: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.nk',
      houdini_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.hip',
      blender_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.blend',
      render_sequence: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}.{frame}.{ext}',
      playblast: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}_playblast.mov',
      thumbnail: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}_thumb.jpg'
    },
    name_cleaning_rules: {
      sequence_pattern: '^SWA_Ep[0-9]+_(.+)$',
      sequence_replacement: '\\1',
      shot_pattern: '^SWA_Ep[0-9]+_(.+)$',
      shot_replacement: '\\1',
      episode_pattern: '^(Ep[0-9]+)$',
      episode_replacement: '\\1'
    },
    version_settings: {
      padding: 3,
      start_version: 1,
      increment: 1,
      format: 'v{version:03d}'
    },
    task_settings: {
      default_file_extensions: {
        lighting: '.ma',
        comp: '.nk',
        modeling: '.ma',
        rigging: '.ma',
        animation: '.ma',
        fx: '.hip',
        lookdev: '.ma',
        layout: '.ma'
      },
      render_formats: {
        lighting: ['exr', 'jpg'],
        comp: ['exr', 'mov', 'jpg'],
        fx: ['exr', 'mov'],
        lookdev: ['exr', 'jpg']
      }
    },
    milestones: ['not_started', 'single_frame', 'low_quality', 'final_render', 'final_comp', 'approved'],
    task_types: ['modeling', 'rigging', 'animation', 'layout', 'lighting', 'comp', 'fx', 'lookdev'],
    priority_levels: ['low', 'medium', 'high', 'urgent'],
    client_settings: {
      version_reset: true,
      default_client: 'SWA_Client',
      delivery_formats: ['mov', 'mp4'],
      approval_required: true
    },
    platform_settings: {
      windows: {
        working_root: 'V:/SWA',
        render_root: 'W:/SWA',
        media_root: 'J:/SWA'
      },
      linux: {
        working_root: '/mnt/projects/SWA',
        render_root: '/mnt/renders/SWA',
        media_root: '/mnt/media/SWA'
      }
    },
    frame_settings: {
      padding: 4,
      default_start: 1001,
      default_fps: 24
    },
    _created_at: '2025-08-03T16:45:00.000000',
    _updated_at: '2025-08-03T16:45:00.000000'
  },
  {
    id: 'RGD',
    name: 'Relic the Guardian of Dream',
    description: 'Animation project for Relic the Guardian of Dream feature film',
    color: '#B7D3F2',
    status: 'active',
    memberCount: 5,
    taskCount: 42,
    updatedAt: '2025-08-06T23:32:03.180796',
    // Abbreviated for brevity - same structure as above
    drive_mapping: {
      working_files: 'V:',
      render_outputs: 'W:',
      media_files: 'E:',
      cache_files: 'E:',
      backup_files: 'E:'
    },
    path_segments: {
      middle_path: 'all/scene',
      version_dir: 'version',
      work_dir: 'work',
      publish_dir: 'publish',
      cache_dir: 'cache'
    },
    templates: {
      working_file: '{drive_working}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/{filename}',
      render_output: '{drive_render}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/',
      media_file: '{drive_media}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/media/',
      cache_file: '{drive_cache}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/cache/',
      submission: '{drive_render}/{project}/deliveries/{client}/{episode}/{sequence_clean}/{shot_clean}/{task}/v{client_version}/'
    },
    filename_patterns: {
      maya_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.ma',
      nuke_script: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.nk',
      houdini_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.hip',
      blender_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.blend',
      render_sequence: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}.{frame}.{ext}',
      playblast: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}_playblast.mov',
      thumbnail: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}_thumb.jpg'
    },
    name_cleaning_rules: {
      sequence_pattern: '^RGD_Ep[0-9]+_(.+)$',
      sequence_replacement: '\\1',
      shot_pattern: '^RGD_Ep[0-9]+_(.+)$',
      shot_replacement: '\\1',
      episode_pattern: '^(Ep[0-9]+)$',
      episode_replacement: '\\1'
    },
    version_settings: {
      padding: 3,
      start_version: 1,
      increment: 1,
      format: 'v{version:03d}'
    },
    task_settings: {
      default_file_extensions: {
        animation: '.ma',
        comp: '.nk',
        fx: '.hip',
        layout: '.ma',
        lighting: '.ma',
        lookdev: '.ma',
        modeling: '.ma',
        rigging: '.ma'
      },
      render_formats: {
        animation: ['mov', 'jpg'],
        comp: ['exr', 'mov', 'jpg'],
        fx: ['exr', 'mov'],
        layout: ['mov', 'jpg'],
        lighting: ['exr', 'jpg'],
        lookdev: ['exr', 'jpg'],
        modeling: ['jpg', 'png'],
        rigging: ['jpg', 'png']
      }
    },
    milestones: ['not_started', 'single_frame', 'low_quality', 'final_render', 'final_comp', 'approved'],
    task_types: ['modeling', 'rigging', 'animation', 'layout', 'lighting', 'comp', 'fx', 'lookdev'],
    priority_levels: ['low', 'medium', 'high', 'urgent'],
    client_settings: {
      version_reset: true,
      default_client: 'RGD_Client',
      delivery_formats: ['mov', 'mp4'],
      approval_required: true
    },
    platform_settings: {
      windows: {
        working_root: 'V:/RGD',
        render_root: 'W:/RGD',
        media_root: 'E:/RGD'
      },
      linux: {
        working_root: '/mnt/projects/RGD',
        render_root: '/mnt/renders/RGD',
        media_root: '/mnt/media/RGD'
      }
    },
    frame_settings: {
      padding: 4,
      default_start: 1001,
      default_fps: 24
    },
    project_budget: {
      allocated_mandays: 0,
      remaining_mandays: 100.0,
      total_mandays: 100.0
    },
    project_timeline: {
      start_date: '2025-08-06',
      end_date: '2026-02-06'
    },
    _created_at: '2025-08-06T09:25:38.807298',
    _updated_at: '2025-08-06T23:32:03.180796'
  },
  {
    id: 'DEMO',
    name: 'Demo Project',
    description: 'Demonstration project for testing and development',
    color: '#F4C6D7',
    status: 'inactive',
    memberCount: 2,
    taskCount: 8,
    updatedAt: '2025-08-01T10:00:00.000Z',
    // Minimal required fields for demo
    drive_mapping: {
      working_files: 'V:',
      render_outputs: 'W:',
      media_files: 'E:',
      cache_files: 'E:',
      backup_files: 'E:'
    },
    path_segments: {
      middle_path: 'all/scene',
      version_dir: 'version',
      work_dir: 'work',
      publish_dir: 'publish',
      cache_dir: 'cache'
    },
    templates: {
      working_file: '{drive_working}/{project}/{task}/{filename}',
      render_output: '{drive_render}/{project}/{task}/v{version}/',
      media_file: '{drive_media}/{project}/{task}/v{version}/media/',
      cache_file: '{drive_cache}/{project}/{task}/cache/',
      submission: '{drive_render}/{project}/deliveries/{task}/v{version}/'
    },
    filename_patterns: {
      maya_scene: '{task}_v{version}.ma',
      nuke_script: '{task}_v{version}.nk',
      houdini_scene: '{task}_v{version}.hip',
      blender_scene: '{task}_v{version}.blend',
      render_sequence: '{task}_v{version}.{frame}.{ext}',
      playblast: '{task}_v{version}_playblast.mov',
      thumbnail: '{task}_v{version}_thumb.jpg'
    },
    name_cleaning_rules: {
      sequence_pattern: '^(.+)$',
      sequence_replacement: '\\1',
      shot_pattern: '^(.+)$',
      shot_replacement: '\\1',
      episode_pattern: '^(.+)$',
      episode_replacement: '\\1'
    },
    version_settings: {
      padding: 3,
      start_version: 1,
      increment: 1,
      format: 'v{version:03d}'
    },
    task_settings: {
      default_file_extensions: {
        modeling: '.ma',
        animation: '.ma'
      },
      render_formats: {
        modeling: ['jpg'],
        animation: ['mov']
      }
    },
    milestones: ['not_started', 'approved'],
    task_types: ['modeling', 'animation'],
    priority_levels: ['low', 'medium', 'high'],
    client_settings: {
      version_reset: false,
      default_client: 'Demo_Client',
      delivery_formats: ['mov'],
      approval_required: false
    },
    platform_settings: {
      windows: {
        working_root: 'V:/DEMO',
        render_root: 'W:/DEMO',
        media_root: 'E:/DEMO'
      },
      linux: {
        working_root: '/mnt/projects/DEMO',
        render_root: '/mnt/renders/DEMO',
        media_root: '/mnt/media/DEMO'
      }
    },
    frame_settings: {
      padding: 4,
      default_start: 1001,
      default_fps: 24
    },
    _created_at: '2025-08-01T10:00:00.000000',
    _updated_at: '2025-08-01T10:00:00.000000'
  }
]

const mockTasks: UITask[] = [
  {
    id: 'ep00_sq0010_sh0020_lighting',
    title: 'Lighting - Ep00 SQ0010 SH0020',
    project: 'SWA',
    projectName: 'Sky Wars Anthology',
    type: 'shot',
    episode: 'Ep00',
    sequence: 'sq0010',
    shot: 'SH0020',
    task: 'lighting',
    artist: 'current_user',
    assignee: 'current_user',
    status: 'in_progress',
    milestone: 'scene_building',
    milestone_note: 'Working on lighting setup for space battle scene',
    frame_range: { start: 1001, end: 1153 },
    priority: 'medium',
    start_time: '2025-08-15T09:00:00.000Z',
    deadline: '2025-08-20T17:00:00.000Z',
    dueDate: '2025-08-20T17:00:00.000Z',
    actual_time_logged: 8.5,
    estimated_duration_hours: 24.0,
    versions: ['v001', 'v002', 'v003'],
    client_submission_history: [],
    current_version: 'v003',
    published_version: 'v002',
    file_extension: '.ma',
    master_file: true,
    working_file_path: 'V:/SWA/all/scene/Ep00/sq0010/SH0020/lighting/version/',
    render_output_path: 'W:/SWA/all/scene/Ep00/sq0010/SH0020/lighting/version/v003/',
    media_file_path: 'E:/SWA/all/scene/Ep00/sq0010/SH0020/lighting/version/v003/media/',
    cache_file_path: 'E:/SWA/all/scene/Ep00/sq0010/SH0020/lighting/cache/',
    filename: 'Ep00_sq0010_SH0020_lighting_master_v003.ma',
    sequence_clean: 'sq0010',
    shot_clean: 'SH0020',
    episode_clean: 'Ep00',
    _created_at: '2025-08-04T11:48:47.186584',
    _updated_at: '2025-08-17T14:13:05.705798',
    updated_at: '2025-08-17T14:13:05.705798'
  },
  {
    id: 'ep00_sq0010_sh0020_comp',
    title: 'Compositing - Ep00 SQ0010 SH0020',
    project: 'SWA',
    projectName: 'Sky Wars Anthology',
    type: 'shot',
    episode: 'Ep00',
    sequence: 'sq0010',
    shot: 'SH0020',
    task: 'comp',
    artist: 'current_user',
    assignee: 'current_user',
    status: 'not_started',
    milestone: 'not_started',
    milestone_note: 'Waiting for lighting completion',
    frame_range: { start: 1001, end: 1153 },
    priority: 'high',
    start_time: null,
    deadline: '2025-08-25T17:00:00.000Z',
    dueDate: '2025-08-25T17:00:00.000Z',
    actual_time_logged: 0.0,
    estimated_duration_hours: 16.0,
    versions: [],
    client_submission_history: [],
    current_version: 'v001',
    published_version: 'v000',
    file_extension: '.nk',
    master_file: true,
    working_file_path: 'V:/SWA/all/scene/Ep00/sq0010/SH0020/comp/version/',
    render_output_path: 'W:/SWA/all/scene/Ep00/sq0010/SH0020/comp/version/v001/',
    media_file_path: 'E:/SWA/all/scene/Ep00/sq0010/SH0020/comp/version/v001/media/',
    cache_file_path: 'E:/SWA/all/scene/Ep00/sq0010/SH0020/comp/cache/',
    filename: 'Ep00_sq0010_SH0020_comp_master_v001.nk',
    sequence_clean: 'sq0010',
    shot_clean: 'SH0020',
    episode_clean: 'Ep00',
    _created_at: '2025-08-04T11:48:47.186584',
    _updated_at: '2025-08-15T23:39:32.464518',
    updated_at: '2025-08-15T23:39:32.464518'
  },
  {
    id: 'rgd_ep01_sq0001_sh0010_animation',
    title: 'Animation - Ep01 SQ0001 SH0010',
    project: 'RGD',
    projectName: 'Relic the Guardian of Dream',
    type: 'shot',
    episode: 'Ep01',
    sequence: 'sq0001',
    shot: 'SH0010',
    task: 'animation',
    artist: 'current_user',
    assignee: 'current_user',
    status: 'review',
    milestone: 'low_quality',
    milestone_note: 'First pass animation complete, ready for review',
    frame_range: { start: 1001, end: 1240 },
    priority: 'low',
    start_time: '2025-08-10T09:00:00.000Z',
    deadline: null,
    dueDate: undefined,
    actual_time_logged: 12.0,
    estimated_duration_hours: 20.0,
    versions: ['v001', 'v002'],
    client_submission_history: [],
    current_version: 'v002',
    published_version: 'v001',
    file_extension: '.ma',
    master_file: true,
    working_file_path: 'V:/RGD/all/scene/Ep01/sq0001/SH0010/animation/version/',
    render_output_path: 'W:/RGD/all/scene/Ep01/sq0001/SH0010/animation/version/v002/',
    media_file_path: 'E:/RGD/all/scene/Ep01/sq0001/SH0010/animation/version/v002/media/',
    cache_file_path: 'E:/RGD/all/scene/Ep01/sq0001/SH0010/animation/cache/',
    filename: 'Ep01_sq0001_SH0010_animation_master_v002.ma',
    sequence_clean: 'sq0001',
    shot_clean: 'SH0010',
    episode_clean: 'Ep01',
    _created_at: '2025-08-10T08:30:00.000000',
    _updated_at: '2025-08-16T15:22:10.000000',
    updated_at: '2025-08-16T15:22:10.000000'
  }
]

const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'assignment',
    title: 'New task assigned: "ep00_sq0010_sh0020_lighting"',
    description: 'You have been assigned to work on lighting for SWA Ep00 SQ0010 SH0020',
    userId: 'current_user',
    relatedId: 'ep00_sq0010_sh0020_lighting',
    relatedType: 'task',
    isRead: false,
    createdAt: '2025-08-17T14:10:00.000Z',
    metadata: {
      project: 'SWA',
      episode: 'Ep00',
      sequence: 'sq0010',
      shot: 'SH0020',
      task: 'lighting',
      priority: 'medium'
    }
  },
  {
    id: 'notif_002',
    type: 'version',
    title: 'New version published: "ep00_sq0010_sh0020_lighting_v005"',
    description: 'Version v005 has been published for lighting task',
    userId: 'current_user',
    relatedId: 'ep00_sq0010_sh0020_lighting_v005',
    relatedType: 'version',
    isRead: false,
    createdAt: '2025-08-17T13:45:00.000Z',
    metadata: {
      project: 'SWA',
      version: 'v005',
      author: 'test_publisher',
      status: 'published'
    }
  },
  {
    id: 'notif_003',
    type: 'update',
    title: 'Project "SWA" configuration updated',
    description: 'Drive mappings and templates have been updated for Sky Wars Anthology',
    userId: 'current_user',
    relatedId: 'SWA',
    relatedType: 'project',
    isRead: false,
    createdAt: '2025-08-17T12:30:00.000Z',
    metadata: {
      project: 'SWA',
      updatedFields: ['drive_mapping', 'templates'],
      updatedBy: 'admin_user'
    }
  },
  {
    id: 'notif_004',
    type: 'mention',
    title: 'You were mentioned in task comments',
    description: 'Sarah mentioned you in comments for RGD animation task',
    userId: 'current_user',
    relatedId: 'rgd_ep01_sq0001_sh0010_animation',
    relatedType: 'task',
    isRead: true,
    createdAt: '2025-08-17T11:15:00.000Z',
    metadata: {
      project: 'RGD',
      mentionedBy: 'sarah_animator',
      commentId: 'comment_123'
    }
  }
]

// Mock task comments data
const mockTaskComments: TaskComment[] = [
  {
    id: 'comment-1',
    taskId: 'SWA-001',
    userId: 'user-1',
    userName: 'Alex Chen',
    userAvatar: '/avatars/alex-chen.jpg',
    content: 'Started working on the initial concept. The client wants a more dramatic lighting setup for this sequence.',
    timestamp: '2025-08-26T10:30:00Z',
    createdAt: '2025-08-26T10:30:00Z'
  },
  {
    id: 'comment-2',
    taskId: 'SWA-001',
    userId: 'user-2',
    userName: 'Sarah Kim',
    userAvatar: '/avatars/sarah-kim.jpg',
    content: 'Reviewed the concept art. Looks great! Can we add more atmospheric haze to enhance the mood?',
    timestamp: '2025-08-26T14:15:00Z',
    createdAt: '2025-08-26T14:15:00Z'
  },
  {
    id: 'comment-3',
    taskId: 'SWA-002',
    userId: 'user-3',
    userName: 'Mike Rodriguez',
    userAvatar: '/avatars/mike-rodriguez.jpg',
    content: 'Animation blocking is complete. Ready for review. The timing feels good but we might need to adjust the camera movement in shot 030.',
    timestamp: '2025-08-26T16:45:00Z',
    createdAt: '2025-08-26T16:45:00Z'
  },
  {
    id: 'comment-4',
    taskId: 'SWA-003',
    userId: 'user-1',
    userName: 'Alex Chen',
    userAvatar: '/avatars/alex-chen.jpg',
    content: 'Lighting setup is 80% complete. Working on the final touches for the hero shots. ETA: end of day.',
    timestamp: '2025-08-27T09:20:00Z',
    createdAt: '2025-08-27T09:20:00Z'
  },
  {
    id: 'comment-5',
    taskId: 'SWA-004',
    userId: 'user-4',
    userName: 'Emma Thompson',
    userAvatar: '/avatars/emma-thompson.jpg',
    content: 'Compositing notes from client review: Need to reduce the blue tint in the background and increase contrast on the main character.',
    timestamp: '2025-08-27T11:30:00Z',
    createdAt: '2025-08-27T11:30:00Z'
  },
  {
    id: 'comment-6',
    taskId: 'SWA-005',
    userId: 'user-2',
    userName: 'Sarah Kim',
    userAvatar: '/avatars/sarah-kim.jpg',
    content: 'Rendering is taking longer than expected due to the complex particle systems. Might need to optimize the setup.',
    timestamp: '2025-08-27T13:45:00Z',
    createdAt: '2025-08-27T13:45:00Z'
  }
]

// Mock service implementation
export class MockDataService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private paginate<T>(items: T[], limit: number = 10, offset: number = 0): DataResponse<T> {
    const start = offset
    const end = start + limit
    const paginatedItems = items.slice(start, end)

    return {
      data: paginatedItems,
      total: items.length,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      hasMore: end < items.length
    }
  }

  private filterItems<T extends { [key: string]: any }>(
    items: T[],
    filters: Record<string, any>
  ): T[] {
    return items.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null) return true

        const itemValue = item[key]
        if (typeof value === 'string') {
          return itemValue?.toString().toLowerCase().includes(value.toLowerCase())
        }
        return itemValue === value
      })
    })
  }

  private sortItems<T extends { [key: string]: any }>(
    items: T[],
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): T[] {
    if (!sortBy) return items

    return [...items].sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (aValue === bValue) return 0

      let comparison = 0
      if (aValue > bValue) comparison = 1
      if (aValue < bValue) comparison = -1

      return sortOrder === 'desc' ? -comparison : comparison
    })
  }

  // Projects API
  async getProjects(options: QueryOptions = {}): Promise<DataResponse<UIProject>> {
    await this.delay()

    let filteredProjects = mockProjects

    if (options.filters) {
      filteredProjects = this.filterItems(mockProjects, options.filters)
    }

    if (options.sortBy) {
      filteredProjects = this.sortItems(filteredProjects, options.sortBy, options.sortOrder)
    }

    return this.paginate(filteredProjects, options.limit, options.offset)
  }

  async getProject(projectId: string): Promise<UIProject> {
    await this.delay(200)

    const project = mockProjects.find(p => p.id === projectId)
    if (!project) {
      throw new Error(`Project ${projectId} not found`)
    }

    return project
  }

  async createProject(project: Partial<UIProject>): Promise<UIProject> {
    await this.delay(800)

    const projectId = `PROJ_${Date.now()}`
    const newProject: UIProject = {
      id: projectId,
      name: project.name || 'New Project',
      description: project.description || '',
      color: project.color || '#CBB7E8',
      status: project.status || 'active',
      memberCount: project.memberCount || 1,
      taskCount: project.taskCount || 0,
      updatedAt: new Date().toISOString(),
      // Default configuration
      drive_mapping: {
        working_files: 'V:',
        render_outputs: 'W:',
        media_files: 'E:',
        cache_files: 'E:',
        backup_files: 'E:'
      },
      path_segments: {
        middle_path: 'all/scene',
        version_dir: 'version',
        work_dir: 'work',
        publish_dir: 'publish',
        cache_dir: 'cache'
      },
      templates: {
        working_file: '{drive_working}/{project}/{task}/{filename}',
        render_output: '{drive_render}/{project}/{task}/v{version}/',
        media_file: '{drive_media}/{project}/{task}/v{version}/media/',
        cache_file: '{drive_cache}/{project}/{task}/cache/',
        submission: '{drive_render}/{project}/deliveries/{task}/v{version}/'
      },
      filename_patterns: {
        maya_scene: '{task}_v{version}.ma',
        nuke_script: '{task}_v{version}.nk',
        houdini_scene: '{task}_v{version}.hip',
        blender_scene: '{task}_v{version}.blend',
        render_sequence: '{task}_v{version}.{frame}.{ext}',
        playblast: '{task}_v{version}_playblast.mov',
        thumbnail: '{task}_v{version}_thumb.jpg'
      },
      name_cleaning_rules: {
        sequence_pattern: '^(.+)$',
        sequence_replacement: '\\1',
        shot_pattern: '^(.+)$',
        shot_replacement: '\\1',
        episode_pattern: '^(.+)$',
        episode_replacement: '\\1'
      },
      version_settings: {
        padding: 3,
        start_version: 1,
        increment: 1,
        format: 'v{version:03d}'
      },
      task_settings: {
        default_file_extensions: {
          modeling: '.ma',
          animation: '.ma'
        },
        render_formats: {
          modeling: ['jpg'],
          animation: ['mov']
        }
      },
      milestones: ['not_started', 'approved'],
      task_types: ['modeling', 'animation'],
      priority_levels: ['low', 'medium', 'high'],
      client_settings: {
        version_reset: false,
        default_client: 'Default_Client',
        delivery_formats: ['mov'],
        approval_required: false
      },
      platform_settings: {
        windows: {
          working_root: `V:/${projectId}`,
          render_root: `W:/${projectId}`,
          media_root: `E:/${projectId}`
        },
        linux: {
          working_root: `/mnt/projects/${projectId}`,
          render_root: `/mnt/renders/${projectId}`,
          media_root: `/mnt/media/${projectId}`
        }
      },
      frame_settings: {
        padding: 4,
        default_start: 1001,
        default_fps: 24
      },
      _created_at: new Date().toISOString(),
      _updated_at: new Date().toISOString(),
      ...project
    }

    mockProjects.unshift(newProject)
    return newProject
  }

  async updateProject(projectId: string, updates: Partial<UIProject>): Promise<UIProject> {
    await this.delay(600)

    const projectIndex = mockProjects.findIndex(p => p.id === projectId)
    if (projectIndex === -1) {
      throw new Error(`Project ${projectId} not found`)
    }

    const updatedProject = {
      ...mockProjects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      _updated_at: new Date().toISOString()
    }

    mockProjects[projectIndex] = updatedProject
    return updatedProject
  }

  // Tasks API
  async getTasks(options: QueryOptions = {}): Promise<DataResponse<UITask>> {
    await this.delay()

    let filteredTasks = mockTasks

    if (options.filters) {
      filteredTasks = this.filterItems(mockTasks, options.filters)
    }

    if (options.sortBy) {
      filteredTasks = this.sortItems(filteredTasks, options.sortBy, options.sortOrder)
    }

    return this.paginate(filteredTasks, options.limit, options.offset)
  }

  async getTask(taskId: string): Promise<UITask> {
    await this.delay(200)

    const task = mockTasks.find(t => t.id === taskId)
    if (!task) {
      throw new Error(`Task ${taskId} not found`)
    }

    return task
  }

  async updateTask(taskId: string, updates: Partial<UITask>): Promise<UITask> {
    await this.delay(600)

    const taskIndex = mockTasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) {
      throw new Error(`Task ${taskId} not found`)
    }

    const updatedTask = {
      ...mockTasks[taskIndex],
      ...updates,
      updated_at: new Date().toISOString(),
      _updated_at: new Date().toISOString()
    }

    mockTasks[taskIndex] = updatedTask
    return updatedTask
  }

  // Notifications API
  async getNotifications(userId: string, options: QueryOptions = {}): Promise<DataResponse<Notification>> {
    await this.delay(300)

    let userNotifications = mockNotifications.filter(n => n.userId === userId)

    if (options.filters?.isRead !== undefined) {
      userNotifications = userNotifications.filter(n => n.isRead === options.filters!.isRead)
    }

    // Sort by creation date, newest first
    userNotifications = this.sortItems(userNotifications, 'createdAt', 'desc')

    return this.paginate(userNotifications, options.limit, options.offset)
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await this.delay(200)

    const notification = mockNotifications.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  }

  // Search API
  async search(query: string, type?: 'projects' | 'tasks' | 'all'): Promise<{
    projects: UIProject[]
    tasks: UITask[]
  }> {
    await this.delay(400)

    const lowerQuery = query.toLowerCase()

    let projects: UIProject[] = []
    let tasks: UITask[] = []

    if (type === 'projects' || type === 'all' || !type) {
      projects = mockProjects.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.id.toLowerCase().includes(lowerQuery)
      )
    }

    if (type === 'tasks' || type === 'all' || !type) {
      tasks = mockTasks.filter(t =>
        t.title.toLowerCase().includes(lowerQuery) ||
        t.task.toLowerCase().includes(lowerQuery) ||
        t.episode.toLowerCase().includes(lowerQuery) ||
        t.sequence.toLowerCase().includes(lowerQuery) ||
        t.shot.toLowerCase().includes(lowerQuery) ||
        t.milestone_note.toLowerCase().includes(lowerQuery)
      )
    }

    return { projects, tasks }
  }

  // Task Comments methods
  async getTaskComments(taskId: string): Promise<TaskComment[]> {
    await this.delay(200)
    return mockTaskComments
      .filter(comment => comment.taskId === taskId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  async addTaskComment(taskId: string, content: string, userId: string = 'user-1', userName: string = 'Current User'): Promise<TaskComment> {
    await this.delay(300)

    const newComment: TaskComment = {
      id: `comment-${Date.now()}`,
      taskId,
      userId,
      userName,
      userAvatar: `/avatars/${userName.toLowerCase().replace(' ', '-')}.jpg`,
      content,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    mockTaskComments.push(newComment)
    return newComment
  }

  async updateTaskStatus(taskId: string, status: string): Promise<UITask | null> {
    await this.delay(200)

    const task = mockTasks.find(t => t.id === taskId)
    if (task) {
      // Map status to valid UITask status values
      const validStatus = status.toLowerCase().replace(' ', '_') as UITask['status']
      task.status = validStatus
      task.updated_at = new Date().toISOString()
      return task
    }
    return null
  }
}

// Export singleton instance
export const mockDataService = new MockDataService()
