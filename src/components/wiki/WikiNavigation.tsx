import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui'
import { WikiHierarchy, WikiPage } from '@/types/wiki'
import { clsx } from 'clsx'

export interface WikiNavigationProps {
  projectId: string
  hierarchy: WikiHierarchy[]
  currentPageId?: string
  onPageSelect: (pageId: string) => void
  onCreatePage: (hierarchy: WikiPage['hierarchy']) => void
}

const WikiNavigation: React.FC<WikiNavigationProps> = ({
  hierarchy,
  currentPageId,
  onPageSelect,
  onCreatePage
}) => {
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set())
  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<string>>(new Set())

  const toggleDepartment = (department: string) => {
    const newExpanded = new Set(expandedDepartments)
    if (newExpanded.has(department)) {
      newExpanded.delete(department)
    } else {
      newExpanded.add(department)
    }
    setExpandedDepartments(newExpanded)
  }

  const toggleEpisode = (key: string) => {
    const newExpanded = new Set(expandedEpisodes)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedEpisodes(newExpanded)
  }

  const handleCreatePage = (department: string, episode: string) => {
    const topic = prompt('Enter topic name:')
    if (topic) {
      onCreatePage({ department, episode, topic })
    }
  }

  return (
    <div className="wiki-navigation" style={{ 
      padding: 'var(--space-3)',
      borderRight: '1px solid var(--border-primary)',
      height: '100%',
      overflow: 'auto'
    }}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h3 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>
          Wiki Pages
        </h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const department = prompt('Enter department name:')
            if (department) {
              const episode = prompt('Enter episode name:')
              if (episode) {
                handleCreatePage(department, episode)
              }
            }
          }}
        >
          <Plus size={14} />
          New Page
        </Button>
      </div>

      {hierarchy.map((dept) => (
        <div key={dept.department} style={{ marginBottom: 'var(--space-2)' }}>
          <div
            className={clsx(
              'wiki-nav-item',
              'wiki-nav-department'
            )}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 'var(--space-2)',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            onClick={() => toggleDepartment(dept.department)}
          >
            {expandedDepartments.has(dept.department) ? (
              <ChevronDown size={14} style={{ marginRight: 'var(--space-1)' }} />
            ) : (
              <ChevronRight size={14} style={{ marginRight: 'var(--space-1)' }} />
            )}
            {dept.department}
          </div>

          {expandedDepartments.has(dept.department) && (
            <div style={{ marginLeft: 'var(--space-4)' }}>
              {dept.episodes.map((ep) => {
                const episodeKey = `${dept.department}-${ep.episode}`
                return (
                  <div key={episodeKey} style={{ marginBottom: 'var(--space-1)' }}>
                    <div
                      className="wiki-nav-item wiki-nav-episode"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 'var(--space-1) var(--space-2)',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem'
                      }}
                      onClick={() => toggleEpisode(episodeKey)}
                    >
                      {expandedEpisodes.has(episodeKey) ? (
                        <ChevronDown size={12} style={{ marginRight: 'var(--space-1)' }} />
                      ) : (
                        <ChevronRight size={12} style={{ marginRight: 'var(--space-1)' }} />
                      )}
                      {ep.episode}
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ marginLeft: 'auto', padding: '2px' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCreatePage(dept.department, ep.episode)
                        }}
                      >
                        <Plus size={10} />
                      </Button>
                    </div>

                    {expandedEpisodes.has(episodeKey) && (
                      <div style={{ marginLeft: 'var(--space-3)' }}>
                        {ep.topics.map((topic) => (
                          <div
                            key={topic.pageId}
                            className={clsx(
                              'wiki-nav-item',
                              'wiki-nav-topic',
                              currentPageId === topic.pageId && 'active'
                            )}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: 'var(--space-1) var(--space-2)',
                              cursor: 'pointer',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              backgroundColor: currentPageId === topic.pageId ? 'var(--bg-accent)' : 'transparent'
                            }}
                            onClick={() => onPageSelect(topic.pageId)}
                          >
                            <FileText size={10} style={{ marginRight: 'var(--space-1)' }} />
                            {topic.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}

      {hierarchy.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-4)',
          color: 'var(--text-secondary)'
        }}>
          <FileText size={24} style={{ marginBottom: 'var(--space-2)' }} />
          <p className="text-body">No wiki pages yet</p>
          <p className="text-caption">Click "New Page" to get started</p>
        </div>
      )}
    </div>
  )
}

export default WikiNavigation
