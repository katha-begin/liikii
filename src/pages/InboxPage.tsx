import React from 'react'
import { PageWrapper, Stack } from '@/components/layout'
import { Card, Badge } from '@/components/ui'
import { Mail, Clock, User, FileText, GitBranch } from 'lucide-react'
import { Notification } from '@/types/database'

const InboxPage: React.FC = () => {
  // Mock notifications based on actual database schema
  const inboxItems: Notification[] = [
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
      isRead: true,
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <User size={16} />
      case 'version': return <GitBranch size={16} />
      case 'update': return <FileText size={16} />
      case 'mention': return <Mail size={16} />
      default: return <Clock size={16} />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.ceil(diffTime / (1000 * 60))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <PageWrapper maxWidth="lg" padding>
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
                  {getNotificationIcon(item.type)}
                </div>

                <Stack direction="vertical" gap="sm" style={{ flex: 1 }}>
                  <Stack direction="horizontal" gap="sm" align="center">
                    <h3 className="text-h2">{item.title}</h3>
                    {!item.isRead && (
                      <Badge variant="primary" size="sm">New</Badge>
                    )}
                    {item.metadata?.priority && (
                      <Badge
                        variant={item.metadata.priority === 'high' ? 'danger' : 'default'}
                        size="sm"
                      >
                        {item.metadata.priority}
                      </Badge>
                    )}
                  </Stack>

                  <p className="text-body text-secondary">
                    {item.description}
                  </p>

                  <Stack direction="horizontal" gap="md" align="center">
                    <span className="text-caption text-secondary">
                      {formatTime(item.createdAt)}
                    </span>
                    {item.metadata?.project && (
                      <Badge variant="default" size="sm">
                        {item.metadata.project}
                      </Badge>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </PageWrapper>
  )
}

export default InboxPage
