import React from 'react'
import { Card } from '@/components/ui'
import { Stack } from '@/components/layout'
import { Users, Calendar, TrendingUp } from 'lucide-react'
import { CardWidgetProps } from './index'

const CardWidget: React.FC<CardWidgetProps> = ({
  title = 'Card Widget',
  description,
  showTaskCount = true,
  showMemberCount = true,
  showProgress = true,
  data = {},
  className,
  style
}) => {
  const {
    taskCount = 0,
    memberCount = 0,
    completedTasks = 0,
    totalTasks = 0
  } = data

  return (
    <Card 
      variant="outlined" 
      padding="md" 
      className={`card-widget ${className || ''}`}
      style={style}
    >
      <Stack direction="vertical" gap="md">
        {title && (
          <div>
            <h3 className="text-h2">{title}</h3>
            {description && (
              <p className="text-body text-secondary">{description}</p>
            )}
          </div>
        )}

        <Stack direction="horizontal" gap="lg" wrap>
          {showTaskCount && (
            <div className="stat-item">
              <Stack direction="horizontal" gap="sm" align="center">
                <Calendar size={16} className="text-secondary" />
                <div>
                  <div className="text-h2">{taskCount}</div>
                  <div className="text-caption text-secondary">Tasks</div>
                </div>
              </Stack>
            </div>
          )}

          {showMemberCount && (
            <div className="stat-item">
              <Stack direction="horizontal" gap="sm" align="center">
                <Users size={16} className="text-secondary" />
                <div>
                  <div className="text-h2">{memberCount}</div>
                  <div className="text-caption text-secondary">Members</div>
                </div>
              </Stack>
            </div>
          )}

          {showProgress && totalTasks > 0 && (
            <div className="stat-item">
              <Stack direction="horizontal" gap="sm" align="center">
                <TrendingUp size={16} className="text-secondary" />
                <div>
                  <div className="text-h2">{Math.round((completedTasks / totalTasks) * 100)}%</div>
                  <div className="text-caption text-secondary">Complete</div>
                </div>
              </Stack>
            </div>
          )}
        </Stack>

        {showProgress && totalTasks > 0 && (
          <div className="progress-bar">
            <div className="progress-track">
              <div 
                className="progress-fill"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
            <div className="text-caption text-secondary">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          </div>
        )}
      </Stack>
    </Card>
  )
}

export default CardWidget
