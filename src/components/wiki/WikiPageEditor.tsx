import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, Card } from '@/components/ui'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import TableInsertModal from './TableInsertModal'
import TableEditor from './TableEditor'
import { WikiPage } from '@/types/wiki'
import { Stack } from '@/components/layout'
import { Eye, Edit, Save, X, Table, MoreVertical } from 'lucide-react'
import { parseMarkdownTable } from '@/utils/tableEditor'

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
  const [showTableModal, setShowTableModal] = useState(false)
  const [editingTable, setEditingTable] = useState<any>(null)
  const [contextMenu, setContextMenu] = useState<{ show: boolean; x: number; y: number }>({ show: false, x: 0, y: 0 })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.show) {
        setContextMenu({ show: false, x: 0, y: 0 })
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [contextMenu.show])

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

  const handleTextareaRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleInsertTable = (markdown: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.substring(0, start) + '\n\n' + markdown + '\n\n' + content.substring(end)
      setContent(newContent)

      // Focus back to textarea
      setTimeout(() => {
        textarea.focus()
        const newPosition = start + markdown.length + 4
        textarea.setSelectionRange(newPosition, newPosition)
      }, 0)
    }
  }

  const handleEditTable = (tableMarkdown: string) => {
    const table = parseMarkdownTable(tableMarkdown)
    if (table) {
      setEditingTable({ table, originalMarkdown: tableMarkdown })
    }
  }

  const handleTableSave = (newMarkdown: string) => {
    if (editingTable) {
      const updatedContent = content.replace(editingTable.originalMarkdown, newMarkdown)
      setContent(updatedContent)
      setEditingTable(null)
    }
  }

  const handleTableCancel = () => {
    setEditingTable(null)
  }

  // Detect tables in content for editing
  const detectTableAtCursor = () => {
    if (!textareaRef.current) return null

    const textarea = textareaRef.current
    const cursorPos = textarea.selectionStart
    const lines = content.split('\n')

    let currentLine = 0
    let charCount = 0

    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= cursorPos) {
        currentLine = i
        break
      }
      charCount += lines[i].length + 1 // +1 for newline
    }

    // Check if current line or nearby lines contain table syntax
    const tablePattern = /^\s*\|.*\|\s*$/
    const separatorPattern = /^\s*\|[\s\-\|]*\|\s*$/

    let tableStart = -1
    let tableEnd = -1

    // Find table boundaries
    for (let i = currentLine; i >= 0; i--) {
      if (tablePattern.test(lines[i]) || separatorPattern.test(lines[i])) {
        tableStart = i
      } else if (tableStart !== -1) {
        break
      }
    }

    if (tableStart !== -1) {
      for (let i = tableStart; i < lines.length; i++) {
        if (tablePattern.test(lines[i]) || separatorPattern.test(lines[i])) {
          tableEnd = i
        } else {
          break
        }
      }
    }

    if (tableStart !== -1 && tableEnd !== -1) {
      const tableLines = lines.slice(tableStart, tableEnd + 1)
      return tableLines.join('\n')
    }

    return null
  }

  const handleEditTableAtCursor = () => {
    const tableMarkdown = detectTableAtCursor()
    if (tableMarkdown) {
      handleEditTable(tableMarkdown)
    } else {
      alert('No table found at cursor position. Place your cursor inside a table to edit it.')
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

## Related Links

For more information, see:
- [[wiki:other-page-id|Related Wiki Page]]
- [[task:task-123|Related Task]]
- [[shot:ep00_sq0010_sh0020|Reference Shot]]
- [[sequence:ep00_sq0010|Sequence Overview]]
- [[episode:ep00|Episode Information]]

## Reference Table

| Component | Status | Owner | Notes |
|-----------|--------|-------|-------|
| Asset A | Complete | Artist 1 | Ready for animation |
| Asset B | In Progress | Artist 2 | Needs texture work |
| Asset C | Not Started | TBD | Waiting for approval |

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
            {!isPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTableModal(true)}
                title="Insert Table"
              >
                <Table size={14} />
                Table
              </Button>
            )}
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
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onContextMenu={handleTextareaRightClick}
                placeholder="Enter your content in markdown format... (Right-click for table options)"
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
            <MarkdownRenderer
              content={content || sampleContent}
              projectId={projectId}
              context={{
                wikiPages: [], // TODO: Pass actual wiki pages for link resolution
                tasks: [] // TODO: Pass actual tasks for link resolution
              }}
            />
          </Card>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: '160px'
          }}
        >
          <button
            onClick={() => {
              setShowTableModal(true)
              setContextMenu({ show: false, x: 0, y: 0 })
            }}
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              textAlign: 'left',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Table size={14} style={{ marginRight: 'var(--space-2)' }} />
            Insert Table
          </button>
          <button
            onClick={() => {
              handleEditTableAtCursor()
              setContextMenu({ show: false, x: 0, y: 0 })
            }}
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              textAlign: 'left',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Edit size={14} style={{ marginRight: 'var(--space-2)' }} />
            Edit Table
          </button>
        </div>
      )}

      {/* Table Insert Modal */}
      <TableInsertModal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        onInsert={handleInsertTable}
      />

      {/* Table Editor */}
      {editingTable && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <TableEditor
              table={editingTable.table}
              onSave={handleTableSave}
              onCancel={handleTableCancel}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default WikiPageEditor
