import React from 'react'
import { Container, Stack, Grid } from '@/components/layout'
import { Card, Badge, Button } from '@/components/ui'
import { Calendar, Clock, Flag, Play, Film } from 'lucide-react'
import { UITask } from '@/types/database'

const MyTasksPage: React.FC = () => {
  // Mock tasks based on actual database schema
  const tasks: UITask[] = [
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
      milestone_note: 'Working on lighting setup',
      frame_range: {
        start: 1001,
        end: 1153
      },
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
      frame_range: {
        start: 1001,
        end: 1153
      },
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
      milestone_note: 'First pass animation complete',
      frame_range: {
        start: 1001,
        end: 1240
      },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'default'
      case 'in_progress': return 'info'
      case 'review': return 'warning'
      case 'approved': return 'success'
      case 'final': return 'success'
      default: return 'default'
    }
  }

  const getMilestoneColor = (milestone: string) => {
    switch (milestone?.toLowerCase()) {
      case 'not_started': return 'default'
      case 'single_frame': return 'info'
      case 'low_quality': return 'warning'
      case 'final_render': return 'success'
      case 'final_comp': return 'success'
      case 'approved': return 'success'
      case 'scene_building': return 'info'
      default: return 'default'
    }
  }

  const getTaskIcon = (taskType: string) => {
    switch (taskType?.toLowerCase()) {
      case 'animation': return <Play size={16} />
      case 'lighting': return <Calendar size={16} />
      case 'comp': return <Film size={16} />
      default: return <Calendar size={16} />
    }
  }

  const formatDueDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    if (diffDays < 7) return `Due in ${diffDays} days`
    return date.toLocaleDateString()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  return (
    <Container size="lg" padding>
      <Stack direction="vertical" gap="lg">
        <div>
          <h1 className="text-h1">My Tasks</h1>
          <p className="text-body text-secondary">
            Tasks assigned to you across all projects
          </p>
        </div>

        <Grid cols={1} gap="md">
          {tasks.map((task) => (
            <Card key={task.id} variant="outlined" padding="md">
              <Stack direction="vertical" gap="md">
                <Stack direction="horizontal" gap="sm" align="center" justify="between">
                  <Stack direction="horizontal" gap="sm" align="center">
                    {getTaskIcon(task.task)}
                    <h3 className="text-h2">{task.title}</h3>
                    <Badge
                      variant={getStatusColor(task.status) as any}
                      size="sm"
                    >
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge
                      variant={getMilestoneColor(task.milestone) as any}
                      size="sm"
                    >
                      {task.milestone.replace('_', ' ')}
                    </Badge>
                    <Badge
                      variant={getPriorityColor(task.priority) as any}
                      size="sm"
                    >
                      <Flag size={10} />
                      {task.priority}
                    </Badge>
                  </Stack>

                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Stack>

                <p className="text-body text-secondary">
                  {task.milestone_note || `${task.episode} ${task.sequence} ${task.shot} - ${task.task}`}
                </p>

                <Stack direction="horizontal" gap="md" align="center">
                  <Stack direction="horizontal" gap="xs" align="center">
                    <Calendar size={12} />
                    <span className="text-caption text-secondary">
                      {task.projectName}
                    </span>
                  </Stack>

                  <Stack direction="horizontal" gap="xs" align="center">
                    <Clock size={12} />
                    <span className="text-caption text-secondary">
                      {formatDueDate(task.dueDate)}
                    </span>
                  </Stack>

                  <Stack direction="horizontal" gap="xs" align="center">
                    <span className="text-caption text-secondary">
                      Frames: {task.frame_range.start}-{task.frame_range.end}
                    </span>
                  </Stack>

                  <Stack direction="horizontal" gap="xs" align="center">
                    <span className="text-caption text-secondary">
                      {task.actual_time_logged}h / {task.estimated_duration_hours}h
                    </span>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Container>
  )
}

export default MyTasksPage
