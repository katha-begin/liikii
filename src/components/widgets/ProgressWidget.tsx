import React from 'react'
import { Progress } from '@/components/ui'

interface ProgressWidgetProps {
  title?: string
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showLabel?: boolean
  label?: string
  animated?: boolean
  style?: React.CSSProperties
}

const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  title,
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = true,
  label,
  animated = false,
  style
}) => {
  return (
    <div style={style}>
      {title && (
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            {title}
          </h3>
        </div>
      )}
      <Progress
        value={value}
        max={max}
        variant={variant}
        size={size}
        showLabel={showLabel}
        label={label}
        animated={animated}
      />
    </div>
  )
}

export default ProgressWidget
