import React, { useState, useEffect } from 'react'
import { Button, Input, Card } from '@/components/ui'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { WikiPage } from '@/types/wiki'
import { Stack } from '@/components/layout'
import { Eye, Edit, Save, X } from 'lucide-react'

export interface WikiPageEditorProps {
  page?: WikiPage
  projectId: string
  hierarchy?: WikiPage['hierarchy']
  onSave: (page: Omit<WikiPage, '_id'>) => Promise<void>
  onCancel: () => void
}

const WikiPageEditor: React.FC<WikiPageEditorProps> = ({
  page,
  projectId,
  hierarchy,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(page?.title || '')
  const [content, setContent] = useState(page?.content || '')
  const [tags, setTags] = useState(page?.tags?.join(', ') || '')
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const currentHierarchy = page?.hierarchy || hierarchy || {
    department: '',
    episode: '',
    topic: ''
  }

  useEffect(() => {
    if (page) {
      setTitle(page.title)
      setContent(page.content)
      setTags(page.tags.join(', '))
    }
  }, [page])

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    setIsSaving(true)
    try {
      const pageData: Omit<WikiPage, '_id'> = {
        project: projectId,
        title: title.trim(),
        hierarchy: currentHierarchy,
        content: content.trim(),
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        created_at: page?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: page?.created_by || 'current-user',
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }

      await onSave(pageData)
    } catch (error) {
      console.error('Failed to save wiki page:', error)
      alert('Failed to save page. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const sampleContent = `# ${title || 'Wiki Page Title'}

## User Stories

As a ${currentHierarchy.department} team member, I want clear documentation so that I can understand the requirements and implementation approach.

As a technical director, I want implementation suggestions so that I can guide the team effectively.

## Technical Implementation Suggestions

### Overview
Brief description of the technical approach and considerations.

### Requirements
- List key requirements
- Include dependencies
- Note any constraints

### Implementation Steps
1. First step with detailed explanation
2. Second step with code examples if needed
3. Final step with testing approach

### Best Practices
- Follow existing patterns
- Maintain consistency with design system
- Ensure no breaking changes

## Notes
Additional notes, references, or considerations for this ${currentHierarchy.topic} topic.`

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        padding: 'var(--space-4)',
        borderBottom: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-surface)'
      }}>
        <Stack direction="horizontal" gap="md" align="center" justify="between">
          <div>
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-1)' }}>
              {page ? 'Edit Wiki Page' : 'Create Wiki Page'}
            </h2>
            <p className="text-caption text-secondary">
              {currentHierarchy.department} → {currentHierarchy.episode} → {currentHierarchy.topic}
            </p>
          </div>
          <Stack direction="horizontal" gap="sm">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? <Edit size={14} /> : <Eye size={14} />}
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save size={14} />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              <X size={14} />
              Cancel
            </Button>
          </Stack>
        </Stack>
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1, 
        padding: 'var(--space-4)',
        overflow: 'auto'
      }}>
        {!isPreview ? (
          <Stack direction="vertical" gap="lg">
            <div>
              <label className="text-body font-medium" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>
                Page Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter page title..."
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label className="text-body font-medium" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>
                Tags (comma-separated)
              </label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="workflow, documentation, guidelines..."
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <label className="text-body font-medium">
                  Content (Markdown)
                </label>
                {!content && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setContent(sampleContent)}
                  >
                    Use Template
                  </Button>
                )}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your content in markdown format..."
                style={{
                  width: '100%',
                  minHeight: '400px',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-input)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
            </div>
          </Stack>
        ) : (
          <Card variant="outlined" padding="lg">
            <MarkdownRenderer content={content || sampleContent} />
          </Card>
        )}
      </div>
    </div>
  )
}

export default WikiPageEditor
