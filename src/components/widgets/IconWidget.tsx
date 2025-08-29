import React from 'react'
import { Icon } from '@/components/ui'

interface IconWidgetProps {
  title?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  color?: string
  variant?: 'outline' | 'filled' | 'duotone'
  clickable?: boolean
  style?: React.CSSProperties
  onClick?: () => void
}

const IconWidget: React.FC<IconWidgetProps> = ({
  title,
  name,
  size = 'md',
  color,
  variant = 'outline',
  clickable = false,
  style,
  onClick
}) => {
  return (
    <div style={style}>
      {title && (
        <div style={{ marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            {title}
          </h3>
        </div>
      )}
      <Icon
        name={name}
        size={size}
        color={color}
        variant={variant}
        onClick={clickable ? onClick : undefined}
      />
    </div>
  )
}

export default IconWidget
