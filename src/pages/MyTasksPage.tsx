import React from 'react'
import { Container, Stack, Grid } from '@/components/layout'
import { Card, Badge, Button } from '@/components/ui'
import { Calendar, Clock, Flag } from 'lucide-react'

const MyTasksPage: React.FC = () => {
  const tasks = [
    {
      id: '1',
      title: 'Character Facial Rigging',
      project: 'Animation Pipeline',
      priority: 'high',
      status: 'in-progress',
      dueDate: 'Tomorrow',
      description: 'Complete the facial rig setup for the main character'
    },
    {
      id: '2',
      title: 'Environment Texturing',
      project: 'Environment Art',
      priority: 'medium',
      status: 'todo',
      dueDate: 'Next week',
      description: 'Apply textures to the forest environment assets'
    },
    {
      id: '3',
      title: 'Lighting Review',
      project: 'VFX Development',
      priority: 'low',
      status: 'review',
      dueDate: 'No due date',
      description: 'Review and approve the lighting setup for scene 3'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'info'
      case 'todo': return 'default'
      case 'review': return 'warning'
      case 'done': return 'success'
      default: return 'default'
    }
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
                    <h3 className="text-h2">{task.title}</h3>
                    <Badge 
                      variant={getStatusColor(task.status) as any} 
                      size="sm"
                    >
                      {task.status.replace('-', ' ')}
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
                  {task.description}
                </p>

                <Stack direction="horizontal" gap="md" align="center">
                  <Stack direction="horizontal" gap="xs" align="center">
                    <Calendar size={12} />
                    <span className="text-caption text-secondary">
                      {task.project}
                    </span>
                  </Stack>
                  
                  <Stack direction="horizontal" gap="xs" align="center">
                    <Clock size={12} />
                    <span className="text-caption text-secondary">
                      {task.dueDate}
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
