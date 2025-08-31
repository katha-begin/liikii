import React, { useState, useEffect } from 'react'
import { Button, Card } from '@/components/ui'
import { Stack } from '@/components/layout'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import WikiNavigation from './WikiNavigation'
import WikiPageEditor from './WikiPageEditor'
import { WikiPage as WikiPageType, WikiHierarchy } from '@/types/wiki'
import { Edit, Plus, FileText } from 'lucide-react'

export interface WikiPageProps {
  projectId: string
  className?: string
}

// Mock data for demonstration
const mockWikiPages: WikiPageType[] = [
  {
    _id: 'wiki-1',
    project: 'SWA',
    title: 'Character Rigging Guidelines',
    hierarchy: {
      department: 'Animation',
      episode: 'Ep00',
      topic: 'Character Rigging'
    },
    content: `# Character Rigging Guidelines

## User Stories

As an animator, I want standardized rigging procedures so that character animation is consistent across all shots.

As a technical director, I want clear rigging documentation so that I can troubleshoot issues quickly.

## Technical Implementation Suggestions

### Overview
This document outlines the standard rigging workflow for character assets in the Sky Wars Anthology project.

### Requirements
- Maya 2024 or later
- Custom rigging tools from pipeline
- Consistent naming conventions
- Quality control checklist

### Implementation Steps
1. **Setup Phase**: Import character model and verify topology
2. **Joint Creation**: Create joint hierarchy following naming conventions
3. **Control Setup**: Build animation controls with proper constraints
4. **Testing**: Validate rig functionality across all required poses

### Best Practices
- Follow existing naming patterns from previous episodes
- Maintain consistency with design system colors for control shapes
- Ensure no breaking changes to existing animation workflows
- Document any custom attributes or special procedures

## Notes
This rigging approach has been tested on Episode 00 characters and should be applied consistently across all future episodes.

## Related Links

For more information, see:
- [[wiki:lighting-standards|Lighting Standards]] for complementary setup
- [[task:ep00_sq0010_sh0020_lighting|SH0020 Lighting Task]] for practical application
- [[shot:ep00_sq0010_sh0020|Episode 00 Sequence 10 Shot 20]] for reference footage
- [[sequence:ep00_sq0010|Episode 00 Sequence 10]] for sequence overview

## Data Tables

| Rig Component | Control Color | Constraint Type | Notes |
|---------------|---------------|-----------------|-------|
| Main Body | Blue | Parent | Primary control hierarchy |
| IK Arms | Red | IK Handle | Arm animation controls |
| FK Arms | Yellow | Orient | Detailed arm positioning |
| Spine | Green | Spline IK | Flexible spine movement |
| Face | Purple | Custom | Facial expression controls |`,
    slug: 'character-rigging-guidelines',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z',
    created_by: 'user123',
    tags: ['rigging', 'animation', 'workflow', 'guidelines']
  },
  {
    _id: 'wiki-2',
    project: 'SWA',
    title: 'Lighting Standards',
    hierarchy: {
      department: 'Lighting',
      episode: 'Ep00',
      topic: 'Scene Setup'
    },
    content: `# Lighting Standards

## User Stories

As a lighting artist, I want consistent lighting setups so that all shots maintain visual continuity.

## Technical Implementation Suggestions

### Standard Light Rig
- Key light: 45-degree angle, warm temperature
- Fill light: Opposite side, cooler temperature
- Rim light: Behind subject for separation

### Color Temperature Guidelines
- Interior scenes: 3200K base
- Exterior day: 5600K base
- Exterior night: 2800K base

## Notes
These standards ensure consistency across all Sky Wars Anthology episodes.

## Related Information

See also:
- [[wiki:character-rigging-guidelines|Character Rigging Guidelines]] for asset preparation
- [[episode:ep00|Episode 00 Overview]] for project context
- [[task:ep00_sq0020_sh0100_lighting|SH0100 Lighting Task]] for implementation example

## Lighting Setup Reference

| Scene Type | Key Light | Fill Light | Rim Light | Color Temp |
|------------|-----------|------------|-----------|------------|
| Interior Day | 3200K | 3200K | 5600K | Warm |
| Interior Night | 2800K | 2800K | 3200K | Very Warm |
| Exterior Day | 5600K | 5600K | 5600K | Cool |
| Exterior Night | 2800K | 2800K | 4000K | Mixed |`,
    slug: 'lighting-standards',
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-16T09:00:00Z',
    created_by: 'user456',
    tags: ['lighting', 'standards', 'workflow']
  }
]

const WikiPage: React.FC<WikiPageProps> = ({ projectId, className }) => {
  const [pages, setPages] = useState<WikiPageType[]>([])
  const [currentPageId, setCurrentPageId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newPageHierarchy, setNewPageHierarchy] = useState<WikiPageType['hierarchy'] | null>(null)

  // Load mock data for the current project
  useEffect(() => {
    const projectPages = mockWikiPages.filter(page => page.project === projectId)
    setPages(projectPages)
    if (projectPages.length > 0 && !currentPageId) {
      setCurrentPageId(projectPages[0]._id)
    }
  }, [projectId, currentPageId])

  // Build hierarchy for navigation
  const buildHierarchy = (pages: WikiPageType[]): WikiHierarchy[] => {
    const hierarchyMap = new Map<string, WikiHierarchy>()

    pages.forEach(page => {
      const { department, episode, topic } = page.hierarchy
      
      if (!hierarchyMap.has(department)) {
        hierarchyMap.set(department, {
          department,
          episodes: []
        })
      }

      const dept = hierarchyMap.get(department)!
      let ep = dept.episodes.find(e => e.episode === episode)
      
      if (!ep) {
        ep = { episode, topics: [] }
        dept.episodes.push(ep)
      }

      ep.topics.push({
        topic,
        pageId: page._id,
        title: page.title
      })
    })

    return Array.from(hierarchyMap.values())
  }

  const currentPage = pages.find(page => page._id === currentPageId)
  const hierarchy = buildHierarchy(pages)

  const handlePageSelect = (pageId: string) => {
    setCurrentPageId(pageId)
    setIsEditing(false)
    setIsCreating(false)
  }

  const handleCreatePage = (pageHierarchy: WikiPageType['hierarchy']) => {
    setNewPageHierarchy(pageHierarchy)
    setIsCreating(true)
    setIsEditing(false)
  }

  const handleSavePage = async (pageData: Omit<WikiPageType, '_id'>) => {
    // In a real implementation, this would call the data service
    const newPage: WikiPageType = {
      ...pageData,
      _id: `wiki-${Date.now()}`
    }

    if (isCreating) {
      setPages(prev => [...prev, newPage])
      setCurrentPageId(newPage._id)
      setIsCreating(false)
      setNewPageHierarchy(null)
    } else {
      setPages(prev => prev.map(page => 
        page._id === currentPageId ? { ...newPage, _id: currentPageId } : page
      ))
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setNewPageHierarchy(null)
  }

  if (isCreating || isEditing) {
    return (
      <div className={className} style={{ height: '100%' }}>
        <WikiPageEditor
          page={isEditing ? currentPage : undefined}
          projectId={projectId}
          hierarchy={newPageHierarchy || undefined}
          onSave={handleSavePage}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  return (
    <div className={className} style={{ 
      height: '100%', 
      display: 'flex',
      backgroundColor: 'var(--bg-surface)'
    }}>
      {/* Navigation Sidebar */}
      <div style={{ width: '240px', flexShrink: 0 }}>
        <WikiNavigation
          projectId={projectId}
          hierarchy={hierarchy}
          currentPageId={currentPageId || undefined}
          onPageSelect={handlePageSelect}
          onCreatePage={handleCreatePage}
        />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentPage ? (
          <>
            {/* Page Header */}
            <div style={{ 
              padding: 'var(--space-4)',
              borderBottom: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-surface)'
            }}>
              <Stack direction="horizontal" gap="md" align="center" justify="between">
                <div>
                  <h1 className="text-h1" style={{ marginBottom: 'var(--space-1)' }}>
                    {currentPage.title}
                  </h1>
                  <p className="text-caption text-secondary">
                    {currentPage.hierarchy.department} → {currentPage.hierarchy.episode} → {currentPage.hierarchy.topic}
                  </p>
                  {currentPage.tags.length > 0 && (
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      {currentPage.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            marginRight: 'var(--space-1)',
                            backgroundColor: 'var(--bg-surface-2)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={14} />
                  Edit
                </Button>
              </Stack>
            </div>

            {/* Page Content */}
            <div style={{ 
              flex: 1, 
              padding: 'var(--space-4)',
              overflow: 'auto'
            }}>
              <Card variant="outlined" padding="lg">
                <MarkdownRenderer
                  content={currentPage.content}
                  projectId={projectId}
                  context={{
                    wikiPages: pages,
                    tasks: [] // TODO: Load actual tasks from data service
                  }}
                />
              </Card>
            </div>
          </>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            padding: 'var(--space-4)'
          }}>
            <FileText size={48} style={{ 
              marginBottom: 'var(--space-4)',
              color: 'var(--text-secondary)'
            }} />
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-2)' }}>
              No Wiki Pages Yet
            </h2>
            <p className="text-body text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
              Create your first wiki page to start documenting project knowledge.
            </p>
            <Button
              variant="primary"
              onClick={() => handleCreatePage({ department: 'General', episode: 'Overview', topic: 'Getting Started' })}
            >
              <Plus size={16} />
              Create First Page
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WikiPage
