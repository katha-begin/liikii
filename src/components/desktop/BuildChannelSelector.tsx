import React, { useState } from 'react'
import { ChevronDown, Download, AlertTriangle, Zap } from 'lucide-react'
import { Badge } from '@/components/ui'
import { useDesktop } from '@/hooks/useDesktop'
import { useNotificationHelpers } from './NotificationSystem'

interface BuildChannelSelectorProps {
  className?: string
  showLabel?: boolean
}

const BUILD_CHANNELS = {
  stable: {
    name: 'Stable',
    description: 'Stable releases with full testing',
    icon: <Download size={16} />,
    color: 'success' as const,
    updateFrequency: 'Monthly'
  },
  beta: {
    name: 'Beta',
    description: 'Pre-release builds with new features',
    icon: <AlertTriangle size={16} />,
    color: 'warning' as const,
    updateFrequency: 'Weekly'
  },
  nightly: {
    name: 'Nightly',
    description: 'Latest development builds',
    icon: <Zap size={16} />,
    color: 'danger' as const,
    updateFrequency: 'Daily'
  }
}

const BuildChannelSelector: React.FC<BuildChannelSelectorProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { isElectron, buildChannel, setBuildChannel } = useDesktop()
  const { showSuccess, showWarning } = useNotificationHelpers()
  const [isOpen, setIsOpen] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  // Don't render on web
  if (!isElectron) {
    return null
  }

  const currentChannel = BUILD_CHANNELS[buildChannel as keyof typeof BUILD_CHANNELS] || BUILD_CHANNELS.stable

  const handleChannelChange = async (newChannel: string) => {
    if (newChannel === buildChannel) {
      setIsOpen(false)
      return
    }

    setIsChanging(true)
    
    try {
      await setBuildChannel(newChannel)
      
      const channelInfo = BUILD_CHANNELS[newChannel as keyof typeof BUILD_CHANNELS]
      
      if (newChannel === 'nightly') {
        showWarning(
          'Switched to Nightly Channel',
          'You are now using development builds. These may contain bugs and incomplete features.',
          {
            actions: [
              {
                label: 'Switch Back to Stable',
                action: () => setBuildChannel('stable'),
                variant: 'primary'
              }
            ]
          }
        )
      } else {
        showSuccess(
          'Build Channel Changed',
          `Switched to ${channelInfo.name} channel. Updates will be checked ${channelInfo.updateFrequency.toLowerCase()}.`
        )
      }
    } catch (error) {
      console.error('Failed to change build channel:', error)
    } finally {
      setIsChanging(false)
      setIsOpen(false)
    }
  }

  return (
    <div className={`build-channel-selector ${className}`}>
      {showLabel && (
        <span className="build-channel-label">Build Channel:</span>
      )}
      
      <div className="build-channel-dropdown">
        <button
          className="build-channel-trigger"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isChanging}
        >
          <div className="build-channel-current">
            <div className="build-channel-icon">
              {currentChannel.icon}
            </div>
            <span className="build-channel-name">
              {currentChannel.name}
            </span>
            <Badge variant={currentChannel.color} size="sm">
              {buildChannel}
            </Badge>
          </div>
          <ChevronDown 
            size={16} 
            className={`build-channel-chevron ${isOpen ? 'open' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="build-channel-menu">
            {Object.entries(BUILD_CHANNELS).map(([key, channel]) => (
              <button
                key={key}
                className={`build-channel-option ${key === buildChannel ? 'active' : ''}`}
                onClick={() => handleChannelChange(key)}
                disabled={isChanging}
              >
                <div className="build-channel-option-content">
                  <div className="build-channel-option-header">
                    <div className="build-channel-option-icon">
                      {channel.icon}
                    </div>
                    <span className="build-channel-option-name">
                      {channel.name}
                    </span>
                    <Badge variant={channel.color} size="sm">
                      {channel.updateFrequency}
                    </Badge>
                  </div>
                  <p className="build-channel-option-description">
                    {channel.description}
                  </p>
                </div>
                {key === buildChannel && (
                  <div className="build-channel-option-check">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="build-channel-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default BuildChannelSelector
