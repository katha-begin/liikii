import React from 'react'
import { Avatar } from '@/components/ui'

interface AvatarWidgetProps {
  title?: string
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'circle' | 'square'
  status?: 'online' | 'offline' | 'away' | 'busy'
  showStatus?: boolean
  clickable?: boolean
  style?: React.CSSProperties
  onClick?: () => void
}

const AvatarWidget: React.FC<AvatarWidgetProps> = ({
  title,
  src,
  alt,
  fallback,
  size = 'md',
  variant = 'circle',
  status,
  showStatus = false,
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
      <Avatar
        src={src}
        alt={alt}
        fallback={fallback}
        size={size}
        variant={variant}
        status={status}
        showStatus={showStatus}
        onClick={clickable ? onClick : undefined}
      />
    </div>
  )
}

export default AvatarWidget
