import React from 'react'
import { Card } from '@/components/ui'
import { TimelineWidgetProps } from './index'

const TimelineWidget: React.FC<TimelineWidgetProps> = ({ title, className, style }) => {
  return (
    <Card variant="outlined" padding="md" className={className} style={style}>
      <h3 className="text-h2">{title || 'Timeline Widget'}</h3>
      <p className="text-body text-secondary">Timeline widget placeholder</p>
    </Card>
  )
}

export default TimelineWidget
