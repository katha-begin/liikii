import React from 'react'
import { Card } from '@/components/ui'
import { MediaWidgetProps } from './index'

const MediaWidget: React.FC<MediaWidgetProps> = ({ title, className, style }) => {
  return (
    <Card variant="outlined" padding="md" className={className} style={style}>
      <h3 className="text-h2">{title || 'Media Widget'}</h3>
      <p className="text-body text-secondary">Media widget placeholder</p>
    </Card>
  )
}

export default MediaWidget
