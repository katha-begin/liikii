import React, { useState } from 'react'
import { Container, Stack, Grid } from '@/components/layout'
import { Button, Card } from '@/components/ui'
import { Settings, Download } from 'lucide-react'
import TemplateSelector from '@/components/templates/TemplateSelector'
import { CardWidget, ListWidget, TableWidget } from '@/components/widgets'
import { LayoutTemplate } from '@/systems/TemplateSystem'

const TemplateSystemDemo: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate | null>(null)
  const [showSelector, setShowSelector] = useState(true)

  // Sample data for widgets
  const sampleProjectData = {
    taskCount: 156,
    memberCount: 8,
    progress: 65,
    completedTasks: 101,
    totalTasks: 156
  }

  const sampleTasks = [
    {
      id: 'ep00_sq0010_sh0020_lighting',
      title: 'Lighting - Ep00 SQ0010 SH0020',
      status: 'in_progress',
      artist: 'current_user',
      deadline: '2025-08-20T17:00:00.000Z',
      description: 'Working on lighting setup for space battle scene'
    },
    {
      id: 'ep00_sq0010_sh0020_comp',
      title: 'Compositing - Ep00 SQ0010 SH0020',
      status: 'not_started',
      artist: 'current_user',
      deadline: '2025-08-25T17:00:00.000Z',
      description: 'Composite final elements for space battle'
    },
    {
      id: 'rgd_ep01_sq0001_sh0010_animation',
      title: 'Animation - Ep01 SQ0001 SH0010',
      status: 'review',
      artist: 'current_user',
      deadline: null,
      description: 'Character animation for dream sequence'
    }
  ]

  const sampleTableData = [
    { id: 1, task: 'Lighting', status: 'In Progress', progress: '75%', due: '2 days' },
    { id: 2, task: 'Compositing', status: 'Not Started', progress: '0%', due: '1 week' },
    { id: 3, task: 'Animation', status: 'Review', progress: '100%', due: 'No due date' }
  ]

  const tableColumns = [
    { key: 'task', title: 'Task' },
    { key: 'status', title: 'Status' },
    { key: 'progress', title: 'Progress' },
    { key: 'due', title: 'Due' }
  ]

  const handleTemplateSelect = (template: LayoutTemplate) => {
    setSelectedTemplate(template)
    setShowSelector(false)
  }

  const handleBackToSelector = () => {
    setShowSelector(true)
    setSelectedTemplate(null)
  }

  const renderTemplatePreview = () => {
    if (!selectedTemplate) return null

    return (
      <Container size="xl" padding>
        <Stack direction="vertical" gap="lg">
          {/* Template Header */}
          <Stack direction="horizontal" justify="between" align="center">
            <div>
              <h1 className="text-h1">{selectedTemplate.name}</h1>
              <p className="text-body text-secondary">
                {selectedTemplate.description}
              </p>
            </div>
            <Stack direction="horizontal" gap="sm">
              <Button variant="secondary" onClick={handleBackToSelector}>
                Back to Templates
              </Button>
              <Button variant="ghost" leftIcon={<Settings size={16} />}>
                Customize
              </Button>
              <Button variant="primary" leftIcon={<Download size={16} />}>
                Use Template
              </Button>
            </Stack>
          </Stack>

          {/* Template Preview */}
          <div className="template-preview-container">
            <Grid cols={12} gap="md">
              {selectedTemplate.widgets.map((widget) => {
                const widgetProps = {
                  id: widget.id,
                  title: widget.title,
                  description: widget.description,
                  style: {
                    gridColumn: `span ${widget.layout.width}`,
                    minHeight: `${widget.layout.height * 60}px`,
                    ...widget.styling
                  }
                }

                switch (widget.type) {
                  case 'card':
                    return (
                      <CardWidget
                        key={widget.id}
                        {...widgetProps}
                        {...widget.props}
                        data={sampleProjectData}
                      />
                    )
                  case 'list':
                    return (
                      <ListWidget
                        key={widget.id}
                        {...widgetProps}
                        {...widget.props}
                        items={sampleTasks}
                      />
                    )
                  case 'table':
                    return (
                      <TableWidget
                        key={widget.id}
                        {...widgetProps}
                        columns={tableColumns}
                        data={sampleTableData}
                      />
                    )
                  default:
                    return (
                      <Card
                        key={widget.id}
                        variant="outlined"
                        padding="md"
                        style={widgetProps.style}
                      >
                        <h3 className="text-h2">{widget.title}</h3>
                        <p className="text-body text-secondary">
                          {widget.type} widget placeholder
                        </p>
                      </Card>
                    )
                }
              })}
            </Grid>
          </div>

          {/* Template Info */}
          <Card variant="outlined" padding="md">
            <Stack direction="vertical" gap="md">
              <h3 className="text-h2">Template Information</h3>
              <Grid cols={3} gap="md">
                <div>
                  <h4 className="text-body font-medium">Category</h4>
                  <p className="text-body text-secondary">{selectedTemplate.category}</p>
                </div>
                <div>
                  <h4 className="text-body font-medium">Version</h4>
                  <p className="text-body text-secondary">{selectedTemplate.version}</p>
                </div>
                <div>
                  <h4 className="text-body font-medium">Author</h4>
                  <p className="text-body text-secondary">{selectedTemplate.author}</p>
                </div>
                <div>
                  <h4 className="text-body font-medium">Widgets</h4>
                  <p className="text-body text-secondary">{selectedTemplate.widgets.length} components</p>
                </div>
                <div>
                  <h4 className="text-body font-medium">Variables</h4>
                  <p className="text-body text-secondary">{selectedTemplate.variables.length} customizable</p>
                </div>
                <div>
                  <h4 className="text-body font-medium">Layout</h4>
                  <p className="text-body text-secondary">{selectedTemplate.layout.type} layout</p>
                </div>
              </Grid>
            </Stack>
          </Card>
        </Stack>
      </Container>
    )
  }

  if (showSelector) {
    return (
      <TemplateSelector
        onSelect={handleTemplateSelect}
        onCreateNew={() => alert('Template creation coming soon!')}
      />
    )
  }

  return renderTemplatePreview()
}

export default TemplateSystemDemo
