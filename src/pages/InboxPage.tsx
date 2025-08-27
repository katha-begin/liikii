import React from 'react'
import { Container, Stack } from '@/components/layout'
import { Card, Badge } from '@/components/ui'
import { Mail, Clock, User } from 'lucide-react'

const InboxPage: React.FC = () => {
  const inboxItems = [
    {
      id: '1',
      type: 'mention',
      title: 'You were mentioned in "Character Rigging"',
      description: 'Sarah mentioned you in a comment about the facial rig setup',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: '2', 
      type: 'assignment',
      title: 'New task assigned: "Environment Lighting"',
      description: 'You have been assigned to work on the forest scene lighting',
      time: '1 hour ago',
      unread: true
    },
    {
      id: '3',
      type: 'update',
      title: 'Project "Animation Pipeline" updated',
      description: 'The project timeline has been updated with new milestones',
      time: '3 hours ago',
      unread: false
    }
  ]

  return (
    <Container size="lg" padding>
      <Stack direction="vertical" gap="lg">
        <div>
          <h1 className="text-h1">Inbox</h1>
          <p className="text-body text-secondary">
            Stay up to date with mentions, assignments, and project updates
          </p>
        </div>

        <Stack direction="vertical" gap="md">
          {inboxItems.map((item) => (
            <Card key={item.id} variant="outlined" padding="md">
              <Stack direction="horizontal" gap="md" align="start">
                <div className="inbox-icon">
                  {item.type === 'mention' && <User size={16} />}
                  {item.type === 'assignment' && <Mail size={16} />}
                  {item.type === 'update' && <Clock size={16} />}
                </div>
                
                <Stack direction="vertical" gap="sm" style={{ flex: 1 }}>
                  <Stack direction="horizontal" gap="sm" align="center">
                    <h3 className="text-h2">{item.title}</h3>
                    {item.unread && (
                      <Badge variant="primary" size="sm">New</Badge>
                    )}
                  </Stack>
                  
                  <p className="text-body text-secondary">
                    {item.description}
                  </p>
                  
                  <span className="text-caption text-secondary">
                    {item.time}
                  </span>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}

export default InboxPage
