import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, Stack, ScrollToTop } from '@/components/layout'
import { Button, Card } from '@/components/ui'
import { WikiWidget } from '@/components/widgets'
import { ArrowLeft, FileText, Edit, Eye } from 'lucide-react'

const WikiDemo: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <PageWrapper maxWidth="full" padding scrollable>
        <Stack direction="vertical" gap="xl">
          {/* Header */}
          <div>
            <Stack direction="horizontal" gap="md" align="center" style={{ marginBottom: 'var(--space-2)' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/design-system')}
              >
                <ArrowLeft size={16} />
                Back to Design System
              </Button>
            </Stack>
            <h1 className="text-h1">Wiki System Demo</h1>
            <p className="text-body text-secondary">
              Project-scoped documentation system with hierarchical organization and markdown support.
              This demo shows the wiki functionality integrated with the existing design system.
            </p>
          </div>

          {/* Features Overview */}
          <Card variant="outlined" padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Wiki System Features</h2>
                <p className="text-body text-secondary">
                  A simple, project-scoped wiki system that integrates seamlessly with the existing Linear-inspired interface.
                </p>
              </div>

              <Stack direction="horizontal" gap="lg" wrap>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <Stack direction="horizontal" gap="sm" align="center" style={{ marginBottom: 'var(--space-2)' }}>
                    <FileText size={20} />
                    <h3 className="text-h3">Hierarchical Organization</h3>
                  </Stack>
                  <p className="text-body text-secondary">
                    Pages are organized by Department → Episode → Topic structure for easy navigation and logical grouping.
                  </p>
                </div>

                <div style={{ flex: 1, minWidth: '250px' }}>
                  <Stack direction="horizontal" gap="sm" align="center" style={{ marginBottom: 'var(--space-2)' }}>
                    <Edit size={20} />
                    <h3 className="text-h3">Markdown Editing</h3>
                  </Stack>
                  <p className="text-body text-secondary">
                    Simple markdown editor with live preview, supporting headers, lists, links, and code blocks.
                  </p>
                </div>

                <div style={{ flex: 1, minWidth: '250px' }}>
                  <Stack direction="horizontal" gap="sm" align="center" style={{ marginBottom: 'var(--space-2)' }}>
                    <Eye size={20} />
                    <h3 className="text-h3">Clean Rendering</h3>
                  </Stack>
                  <p className="text-body text-secondary">
                    Notion-style content rendering with proper typography and spacing following the design system.
                  </p>
                </div>
              </Stack>
            </Stack>
          </Card>

          {/* Implementation Notes */}
          <Card variant="outlined" padding="lg">
            <Stack direction="vertical" gap="md">
              <h2 className="text-h2">Implementation Details</h2>
              
              <div>
                <h3 className="text-h3">Components Created</h3>
                <ul style={{ 
                  marginTop: 'var(--space-2)',
                  paddingLeft: 'var(--space-4)',
                  listStyle: 'disc'
                }}>
                  <li className="text-body">WikiPage - Main wiki container component</li>
                  <li className="text-body">WikiNavigation - Hierarchical navigation tree</li>
                  <li className="text-body">WikiPageEditor - Markdown editor with preview</li>
                  <li className="text-body">MarkdownRenderer - Clean markdown rendering</li>
                  <li className="text-body">WikiWidget - Template system integration</li>
                </ul>
              </div>

              <div>
                <h3 className="text-h3">Design System Integration</h3>
                <ul style={{ 
                  marginTop: 'var(--space-2)',
                  paddingLeft: 'var(--space-4)',
                  listStyle: 'disc'
                }}>
                  <li className="text-body">Uses existing Button, Input, Card, and layout components</li>
                  <li className="text-body">Follows Linear-inspired design patterns and spacing</li>
                  <li className="text-body">Maintains consistent typography and color scheme</li>
                  <li className="text-body">Responsive behavior matches existing patterns</li>
                </ul>
              </div>

              <div>
                <h3 className="text-h3">Data Structure</h3>
                <p className="text-body text-secondary">
                  Wiki pages follow the template-first JSON configuration approach with project scoping.
                  Each page includes hierarchy information, markdown content, and metadata.
                </p>
              </div>
            </Stack>
          </Card>

          {/* Live Demo */}
          <Card variant="outlined" padding="lg">
            <Stack direction="vertical" gap="md">
              <div>
                <h2 className="text-h2">Live Demo</h2>
                <p className="text-body text-secondary">
                  Interactive wiki system demonstration with sample content for the Sky Wars Anthology project.
                  Try navigating between pages, editing content, and creating new pages.
                </p>
              </div>

              <div style={{ 
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden'
              }}>
                <WikiWidget
                  id="wiki-demo"
                  title="Sky Wars Anthology - Project Wiki"
                  projectId="SWA"
                  height="700px"
                />
              </div>
            </Stack>
          </Card>

          {/* Usage Instructions */}
          <Card variant="outlined" padding="lg">
            <Stack direction="vertical" gap="md">
              <h2 className="text-h2">How to Use</h2>
              
              <div>
                <h3 className="text-h3">Navigation</h3>
                <ul style={{ 
                  marginTop: 'var(--space-2)',
                  paddingLeft: 'var(--space-4)',
                  listStyle: 'disc'
                }}>
                  <li className="text-body">Click department names to expand/collapse episodes</li>
                  <li className="text-body">Click episode names to expand/collapse topics</li>
                  <li className="text-body">Click topic names to view wiki pages</li>
                  <li className="text-body">Use the "New Page" button to create pages</li>
                </ul>
              </div>

              <div>
                <h3 className="text-h3">Editing</h3>
                <ul style={{ 
                  marginTop: 'var(--space-2)',
                  paddingLeft: 'var(--space-4)',
                  listStyle: 'disc'
                }}>
                  <li className="text-body">Click "Edit" button to modify existing pages</li>
                  <li className="text-body">Use "Preview" toggle to see rendered content</li>
                  <li className="text-body">Click "Use Template" for structured content</li>
                  <li className="text-body">Add tags for better organization</li>
                </ul>
              </div>

              <div>
                <h3 className="text-h3">Content Structure</h3>
                <p className="text-body text-secondary">
                  Pages are designed to include user stories and technical implementation suggestions,
                  following the requirements for comprehensive project documentation.
                </p>
              </div>
            </Stack>
          </Card>
        </Stack>
      </PageWrapper>
      <ScrollToTop />
    </>
  )
}

export default WikiDemo
