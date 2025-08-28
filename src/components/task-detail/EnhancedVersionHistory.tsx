// Enhanced Version History Component - Following FR specifications
import React, { useState } from 'react'
import { clsx } from 'clsx'
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Upload, 
  Play, 
  ExternalLink, 
  MoreHorizontal,
  User,
  Calendar,
  Image,
  Video,
  FileText
} from 'lucide-react'
import { UITask, VersionHistoryEntry, MediaRecord } from '@/types/database'

interface EnhancedVersionHistoryProps {
  task: UITask
}

export const EnhancedVersionHistory: React.FC<EnhancedVersionHistoryProps> = ({ task }) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  // Separate published and work versions
  const publishedVersions = task.version_history?.filter(v => v.is_published) || []
  const workVersions = task.version_history?.filter(v => !v.is_published) || []

  // Get media for a specific version
  const getVersionMedia = (version: string): MediaRecord[] => {
    return task.media_records?.filter(media => media.linked_version === version) || []
  }

  // Get version status color
  const getVersionStatusColor = (version: VersionHistoryEntry) => {
    if (version.is_published) return 'var(--semantic-success)'
    if (version.farm_status === 'in_progress') return 'var(--accent-blue)'
    if (version.farm_status === 'failed' || version.issues.length > 0) return 'var(--semantic-danger)'
    return 'var(--text-secondary)'
  }

  // Helper function to get task state colors
  const getTaskStateColor = (state: string) => {
    switch (state) {
      case 'not_started':
        return { color: 'var(--text-secondary)', bg: 'var(--bg-surface-2)' }
      case 'in_progress':
        return { color: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.1)' }
      case 'review':
        return { color: 'var(--accent-orange)', bg: 'rgba(251, 146, 60, 0.1)' }
      case 'approved':
        return { color: 'var(--semantic-success)', bg: 'rgba(34, 197, 94, 0.1)' }
      case 'final':
        return { color: 'var(--accent-purple)', bg: 'rgba(147, 51, 234, 0.1)' }
      default:
        return { color: 'var(--text-secondary)', bg: 'var(--bg-surface-2)' }
    }
  }

  // Get media type icon
  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image': return <Image size={14} />
      case 'video': return <Video size={14} />
      default: return <FileText size={14} />
    }
  }

  // Handle version actions
  const handlePublishVersion = (version: string) => {
    console.log('Publishing version:', version)
    // TODO: Implement publish functionality
  }

  const handleSendToFarm = (version: string) => {
    console.log('Sending to farm:', version)
    // TODO: Implement farm submission
  }

  const handleMarkIssue = (version: string) => {
    console.log('Marking issue for version:', version)
    // TODO: Implement issue marking
  }

  const renderVersionCard = (version: VersionHistoryEntry, isPublished: boolean) => (
    <div
      key={version.version}
      className={clsx('version-card', { 'selected': selectedVersion === version.version })}
      style={{
        padding: 'var(--space-3)',
        backgroundColor: 'var(--bg-surface-2)',
        borderRadius: 'var(--radius-input)',
        border: `1px solid ${selectedVersion === version.version ? 'var(--accent-blue)' : 'var(--border-line)'}`,
        marginBottom: 'var(--space-2)',
        cursor: 'pointer',
        transition: 'all 150ms ease-out'
      }}
      onClick={() => setSelectedVersion(selectedVersion === version.version ? null : version.version)}
    >
      {/* Version Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getVersionStatusColor(version),
              flexShrink: 0
            }}
          />
          <span style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--text-primary)' }}>
            {version.version}
          </span>
          {/* Task State Badge */}
          {version.task_state && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: getTaskStateColor(version.task_state).bg,
                border: `1px solid ${getTaskStateColor(version.task_state).color}`,
                fontSize: '10px',
                fontWeight: 500,
                color: getTaskStateColor(version.task_state).color,
                textTransform: 'capitalize'
              }}
            >
              {version.task_state.replace('_', ' ')}
            </div>
          )}
          {isPublished && (
            <CheckCircle size={14} style={{ color: 'var(--semantic-success)' }} />
          )}
          {version.farm_status === 'in_progress' && (
            <Clock size={14} style={{ color: 'var(--accent-blue)' }} />
          )}
          {version.issues.length > 0 && (
            <AlertTriangle size={14} style={{ color: 'var(--semantic-danger)' }} />
          )}
        </div>
        
        <button
          style={{
            padding: 'var(--space-1)',
            border: 'none',
            borderRadius: 'var(--radius-input)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'background-color 150ms ease-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Version Metadata */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <User size={12} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            {version.owner}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <Calendar size={12} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            {new Date(version.created_at).toLocaleDateString()}
          </span>
        </div>
        {version.media_ids.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            <Image size={12} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              {version.media_ids.length} media
            </span>
          </div>
        )}
      </div>

      {/* Working File Path */}
      {version.working_file_path && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-2)',
          padding: 'var(--space-2)',
          backgroundColor: 'var(--bg-surface-1)',
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--border-line)'
        }}>
          <FileText size={12} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-secondary)',
              marginBottom: '2px',
              textTransform: 'uppercase',
              fontWeight: 500
            }}>
              Working File Path
            </div>
            <code
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace)',
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
                padding: 0,
                wordBreak: 'break-all',
                lineHeight: 1.4
              }}
              title={version.working_file_path}
            >
              {version.working_file_path.length > 60
                ? `...${version.working_file_path.slice(-57)}`
                : version.working_file_path
              }
            </code>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(version.working_file_path)
              // TODO: Show toast notification
              console.log('Copied to clipboard:', version.working_file_path)
            }}
            style={{
              padding: '4px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 150ms ease-out',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
            title="Copy file path"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      )}

      {/* Version Notes */}
      {version.notes && (
        <p style={{ 
          margin: 0, 
          fontSize: 'var(--text-caption)', 
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-2)'
        }}>
          {version.notes}
        </p>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {!isPublished && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePublishVersion(version.version)
            }}
            style={{
              padding: 'var(--space-1) var(--space-2)',
              border: '1px solid var(--semantic-success)',
              borderRadius: 'var(--radius-input)',
              backgroundColor: 'transparent',
              color: 'var(--semantic-success)',
              fontSize: 'var(--text-caption)',
              cursor: 'pointer',
              transition: 'all 150ms ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--semantic-success)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--semantic-success)'
            }}
          >
            <CheckCircle size={12} style={{ marginRight: 'var(--space-1)' }} />
            Publish
          </button>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleSendToFarm(version.version)
          }}
          style={{
            padding: 'var(--space-1) var(--space-2)',
            border: '1px solid var(--accent-blue)',
            borderRadius: 'var(--radius-input)',
            backgroundColor: 'transparent',
            color: 'var(--accent-blue)',
            fontSize: 'var(--text-caption)',
            cursor: 'pointer',
            transition: 'all 150ms ease-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-blue)'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--accent-blue)'
          }}
        >
          <Upload size={12} style={{ marginRight: 'var(--space-1)' }} />
          Send to Farm
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleMarkIssue(version.version)
          }}
          style={{
            padding: 'var(--space-1) var(--space-2)',
            border: '1px solid var(--semantic-warning)',
            borderRadius: 'var(--radius-input)',
            backgroundColor: 'transparent',
            color: 'var(--semantic-warning)',
            fontSize: 'var(--text-caption)',
            cursor: 'pointer',
            transition: 'all 150ms ease-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--semantic-warning)'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--semantic-warning)'
          }}
        >
          <AlertTriangle size={12} style={{ marginRight: 'var(--space-1)' }} />
          Mark Issue
        </button>
      </div>

      {/* Expanded Media Section */}
      {selectedVersion === version.version && version.media_ids.length > 0 && (
        <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-line)' }}>
          <h4 style={{ margin: 0, marginBottom: 'var(--space-2)', fontSize: 'var(--text-caption)', fontWeight: 600, color: 'var(--text-primary)' }}>
            Media ({version.media_ids.length})
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-2)' }}>
            {getVersionMedia(version.version).map((media) => (
              <div
                key={media._id}
                style={{
                  padding: 'var(--space-2)',
                  backgroundColor: 'var(--bg-surface-1)',
                  borderRadius: 'var(--radius-input)',
                  border: '1px solid var(--border-line)',
                  textAlign: 'center'
                }}
              >
                <div style={{ marginBottom: 'var(--space-1)' }}>
                  {getMediaIcon(media.media_type)}
                </div>
                <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                  {media.file_name.split('.')[0].substring(0, 15)}...
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'center' }}>
                  <button
                    style={{
                      padding: 'var(--space-1)',
                      border: 'none',
                      borderRadius: 'var(--radius-input)',
                      backgroundColor: 'var(--accent-blue)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 'var(--text-caption)'
                    }}
                    title="Play with RV"
                  >
                    <Play size={10} />
                  </button>
                  <button
                    style={{
                      padding: 'var(--space-1)',
                      border: 'none',
                      borderRadius: 'var(--radius-input)',
                      backgroundColor: 'var(--text-secondary)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 'var(--text-caption)'
                    }}
                    title="Open Source"
                  >
                    <ExternalLink size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Published Versions Section */}
      {publishedVersions.length > 0 && (
        <div>
          <h3 style={{ 
            margin: 0, 
            marginBottom: 'var(--space-3)', 
            fontSize: 'var(--text-body)', 
            fontWeight: 600, 
            color: 'var(--semantic-success)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <CheckCircle size={16} />
            Published Versions ({publishedVersions.length})
          </h3>
          {publishedVersions.map(version => renderVersionCard(version, true))}
        </div>
      )}

      {/* Work Versions Section */}
      {workVersions.length > 0 && (
        <div>
          <h3 style={{ 
            margin: 0, 
            marginBottom: 'var(--space-3)', 
            fontSize: 'var(--text-body)', 
            fontWeight: 600, 
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <Clock size={16} />
            Work Versions ({workVersions.length})
          </h3>
          {workVersions.map(version => renderVersionCard(version, false))}
        </div>
      )}

      {/* Empty State */}
      {(!task.version_history || task.version_history.length === 0) && (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-6)', 
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-body)'
        }}>
          No versions available
        </div>
      )}
    </div>
  )
}
