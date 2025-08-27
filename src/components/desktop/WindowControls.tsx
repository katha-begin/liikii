import React from 'react'
import { Minus, Square, X } from 'lucide-react'
import { useDesktop } from '@/hooks/useDesktop'

interface WindowControlsProps {
  className?: string
  showTitle?: boolean
  title?: string
}

const WindowControls: React.FC<WindowControlsProps> = ({ 
  className = '', 
  showTitle = false, 
  title = 'Liikii Desktop' 
}) => {
  const { isElectron, minimizeWindow, maximizeWindow, closeWindow } = useDesktop()

  // Don't render on web or if not needed
  if (!isElectron) {
    return null
  }

  return (
    <div className={`window-controls ${className}`}>
      {showTitle && (
        <div className="window-title">
          {title}
        </div>
      )}
      
      <div className="window-control-buttons">
        <button
          className="window-control-button minimize"
          onClick={minimizeWindow}
          title="Minimize"
          aria-label="Minimize window"
        >
          <Minus size={14} />
        </button>
        
        <button
          className="window-control-button maximize"
          onClick={maximizeWindow}
          title="Maximize"
          aria-label="Maximize window"
        >
          <Square size={14} />
        </button>
        
        <button
          className="window-control-button close"
          onClick={closeWindow}
          title="Close"
          aria-label="Close window"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export default WindowControls
