import React from 'react'
import { Card } from '@/components/ui'
import { Stack } from '@/components/layout'
import { ChartWidgetProps } from './index'

const ChartWidget: React.FC<ChartWidgetProps> = ({
  title = 'Chart Widget',
  description,
  type = 'bar',
  className,
  style
}) => {
  return (
    <Card 
      variant="outlined" 
      padding="md" 
      className={`chart-widget ${className || ''}`}
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

        <div className="chart-placeholder">
          <div className="chart-mock">
            <p className="text-body text-secondary">
              {type.charAt(0).toUpperCase() + type.slice(1)} Chart
            </p>
            <p className="text-caption text-secondary">
              Chart visualization will be implemented with a charting library
            </p>
          </div>
        </div>
      </Stack>
    </Card>
  )
}

export default ChartWidget
