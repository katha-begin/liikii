// Media Section Component - Following FR specifications
import React, { useState } from 'react'
import { clsx } from 'clsx'
import { 
  Play, 
  ExternalLink, 
  Download, 
  Image, 
  Video, 
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { UITask, MediaRecord } from '@/types/database'

interface MediaSectionProps {
  task: UITask
  selectedVersion?: string
}

export const MediaSection: React.FC<MediaSectionProps> = ({ task, selectedVersion }) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)

  // Filter media by version if specified
  const mediaRecords = selectedVersion 
    ? task.media_records?.filter(media => media.linked_version === selectedVersion) || []
    : task.media_records || []

  // Group media by status
  const publishedMedia = mediaRecords.filter(media => media.approval_status === 'approved')
  const reviewMedia = mediaRecords.filter(media => media.approval_status === 'under_review')
  const pendingMedia = mediaRecords.filter(media => media.approval_status === 'pending')

  // Get media type icon
  const getMediaIcon = (mediaType: string, size: number = 16) => {
    switch (mediaType) {
      case 'image': return <Image size={size} />
      case 'video': return <Video size={size} />
      default: return <FileText size={size} />
    }
  }

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return { color: 'var(--semantic-success)', icon: <CheckCircle size={12} />, label: 'Published' }
      case 'under_review':
        return { color: 'var(--semantic-warning)', icon: <Eye size={12} />, label: 'Review' }
      case 'pending':
        return { color: 'var(--text-secondary)', icon: <Clock size={12} />, label: 'Draft' }
      default:
        return { color: 'var(--text-secondary)', icon: <AlertTriangle size={12} />, label: 'Unknown' }
    }
  }

  // Handle media actions
  const handlePlayWithRV = (media: MediaRecord) => {
    console.log('Playing with RV:', media.storage_url)
    // TODO: Implement RV integration
    // Example: window.electron?.openRV(media.storage_url)
  }

  const handleOpenSource = (media: MediaRecord) => {
    console.log('Opening source file for:', media.file_name)
    // TODO: Implement source file opening
    // Example: window.electron?.openFile(media.source_file_path)
  }

  const handleDownload = (media: MediaRecord) => {
    console.log('Downloading:', media.file_name)
    // TODO: Implement download functionality
    window.open(media.storage_url, '_blank')
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Render media card
  const renderMediaCard = (media: MediaRecord) => {
    const statusInfo = getStatusInfo(media.approval_status)
    const isSelected = selectedMedia === media._id

    return (
      <div
        key={media._id}
        className={clsx('media-card', { 'selected': isSelected })}
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-surface-2)',
          borderRadius: 'var(--radius-input)',
          border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-line)'}`,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 150ms ease-out'
        }}
        onClick={() => setSelectedMedia(isSelected ? null : media._id)}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = 'var(--text-secondary)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = 'var(--border-line)'
          }
        }}
      >
        {/* Media Thumbnail/Preview */}
        <div
          style={{
            height: '120px',
            backgroundColor: 'var(--bg-surface-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {media.thumbnail_key ? (
            <img
              src={media.thumbnail_key}
              alt={media.file_name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>
              {getMediaIcon(media.media_type, 32)}
            </div>
          )}
          
          {/* Status Badge */}
          <div
            style={{
              position: 'absolute',
              top: 'var(--space-2)',
              right: 'var(--space-2)',
              padding: 'var(--space-1) var(--space-2)',
              backgroundColor: statusInfo.color,
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--text-caption)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)'
            }}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </div>
        </div>

        {/* Media Info */}
        <div style={{ padding: 'var(--space-3)' }}>
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: 'var(--text-body)', 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-1)'
            }}>
              {media.file_name.length > 25 ? `${media.file_name.substring(0, 25)}...` : media.file_name}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                {media.author}
              </span>
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                {formatFileSize(media.metadata.file_size)}
              </span>
            </div>
          </div>

          {/* Media Metadata */}
          {media.metadata.width && media.metadata.height && (
            <div style={{ 
              fontSize: 'var(--text-caption)', 
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2)'
            }}>
              {media.metadata.width} × {media.metadata.height}
              {media.metadata.duration && ` • ${Math.round(media.metadata.duration)}s`}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePlayWithRV(media)
              }}
              style={{
                flex: 1,
                padding: 'var(--space-2)',
                border: 'none',
                borderRadius: 'var(--radius-input)',
                backgroundColor: 'var(--accent-blue)',
                color: 'white',
                fontSize: 'var(--text-caption)',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-1)',
                transition: 'background-color 150ms ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-lilac)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-blue)'
              }}
              title="Play with RV"
            >
              <Play size={12} />
              RV
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleOpenSource(media)
              }}
              style={{
                padding: 'var(--space-2)',
                border: '1px solid var(--border-line)',
                borderRadius: 'var(--radius-input)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 150ms ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              title="Open Source File"
            >
              <ExternalLink size={12} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDownload(media)
              }}
              style={{
                padding: 'var(--space-2)',
                border: '1px solid var(--border-line)',
                borderRadius: 'var(--radius-input)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 150ms ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              title="Download"
            >
              <Download size={12} />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isSelected && (
          <div style={{ 
            padding: 'var(--space-3)', 
            paddingTop: 0, 
            borderTop: '1px solid var(--border-line)',
            marginTop: 'var(--space-2)'
          }}>
            <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              <div>Created: {new Date(media.metadata.creation_date).toLocaleString()}</div>
              <div>Version: {media.linked_version}</div>
              {media.metadata.color_space && <div>Color Space: {media.metadata.color_space}</div>}
              {media.description && <div>Description: {media.description}</div>}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Media Status Summary */}
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <div style={{ 
          padding: 'var(--space-2) var(--space-3)', 
          backgroundColor: 'var(--bg-surface-2)', 
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--border-line)',
          fontSize: 'var(--text-caption)',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ color: 'var(--semantic-success)', fontWeight: 600 }}>{publishedMedia.length}</span> Published
        </div>
        <div style={{ 
          padding: 'var(--space-2) var(--space-3)', 
          backgroundColor: 'var(--bg-surface-2)', 
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--border-line)',
          fontSize: 'var(--text-caption)',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ color: 'var(--semantic-warning)', fontWeight: 600 }}>{reviewMedia.length}</span> In Review
        </div>
        <div style={{ 
          padding: 'var(--space-2) var(--space-3)', 
          backgroundColor: 'var(--bg-surface-2)', 
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--border-line)',
          fontSize: 'var(--text-caption)',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{pendingMedia.length}</span> Draft
        </div>
      </div>

      {/* Media Grid */}
      {mediaRecords.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 'var(--space-3)' 
        }}>
          {mediaRecords.map(renderMediaCard)}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-6)', 
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-body)'
        }}>
          {selectedVersion ? `No media for version ${selectedVersion}` : 'No media available'}
        </div>
      )}
    </div>
  )
}
