import React, { useState } from 'react'
import { Container, Stack } from '@/components/layout'
import { Button, Badge, Card, Input } from '@/components/ui'
import { Search, Plus, Eye, Download } from 'lucide-react'
import { LayoutTemplate, templateEngine } from '@/systems/TemplateSystem'

interface TemplateSelectorProps {
  category?: LayoutTemplate['category']
  onSelect?: (template: LayoutTemplate) => void
  onCreateNew?: () => void
  selectedTemplateId?: string
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  category,
  onSelect,
  onCreateNew,
  selectedTemplateId
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<LayoutTemplate['category'] | 'all'>(category || 'all')

  const allTemplates = templateEngine.getAllTemplates()
  const categories: Array<LayoutTemplate['category'] | 'all'> = ['all', 'project', 'task', 'dashboard', 'report']

  const filteredTemplates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (cat: LayoutTemplate['category']) => {
    switch (cat) {
      case 'project': return 'primary'
      case 'task': return 'info'
      case 'dashboard': return 'success'
      case 'report': return 'warning'
      default: return 'default'
    }
  }

  return (
    <Container size="xl" padding>
      <Stack direction="vertical" gap="lg">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center">
          <div>
            <h1 className="text-h1">Template Library</h1>
            <p className="text-body text-secondary">
              Choose a template to customize your project layout
            </p>
          </div>
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={onCreateNew}>
            Create Template
          </Button>
        </Stack>

        {/* Filters */}
        <Stack direction="horizontal" gap="md" align="center">
          <Input
            variant="search"
            placeholder="Search templates..."
            leftIcon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          
          <div className="category-filters">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'default'}
                size="sm"
                className="filter-chip"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Badge>
            ))}
          </div>
        </Stack>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Card variant="outlined" padding="lg" className="empty-state">
            <Stack direction="vertical" gap="md" align="center">
              <h3 className="text-h2">No templates found</h3>
              <p className="text-body text-secondary">
                {searchQuery 
                  ? 'Try adjusting your search or filters'
                  : 'No templates available for this category'
                }
              </p>
              {onCreateNew && (
                <Button variant="primary" leftIcon={<Plus size={16} />} onClick={onCreateNew}>
                  Create First Template
                </Button>
              )}
            </Stack>
          </Card>
        ) : (
          <div className="template-grid">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                variant={selectedTemplateId === template.id ? 'outlined' : 'default'}
                padding="md"
                className={`template-card ${selectedTemplateId === template.id ? 'selected' : ''}`}
                onClick={() => onSelect?.(template)}
              >
                <Stack direction="vertical" gap="md">
                  {/* Template Preview */}
                  <div className="template-preview">
                    <div className="preview-content">
                      <div className="preview-widgets">
                        {template.widgets.slice(0, 3).map((widget, index) => (
                          <div
                            key={widget.id}
                            className="preview-widget"
                            style={{
                              width: `${Math.max(20, widget.layout.width * 2)}%`,
                              height: `${Math.max(15, widget.layout.height * 8)}px`,
                              backgroundColor: index === 0 ? 'var(--accent-lilac)' : 
                                             index === 1 ? 'var(--accent-blue)' : 
                                             'var(--accent-mint)'
                            }}
                          />
                        ))}
                        {template.widgets.length > 3 && (
                          <div className="preview-more">
                            +{template.widgets.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <Stack direction="vertical" gap="sm">
                    <Stack direction="horizontal" justify="between" align="start">
                      <h3 className="text-h2">{template.name}</h3>
                      <Badge 
                        variant={getCategoryColor(template.category) as any} 
                        size="sm"
                      >
                        {template.category}
                      </Badge>
                    </Stack>
                    
                    <p className="text-body text-secondary line-clamp-2">
                      {template.description}
                    </p>
                  </Stack>

                  {/* Template Meta */}
                  <div className="template-meta">
                    <Stack direction="horizontal" gap="sm" align="center">
                      <span className="template-author">
                        by {template.author}
                      </span>
                      <span className="template-version">
                        {template.version}
                      </span>
                    </Stack>
                    
                    <Stack direction="horizontal" gap="xs">
                      <Button variant="ghost" size="sm" leftIcon={<Eye size={14} />}>
                        Preview
                      </Button>
                      <Button variant="ghost" size="sm" leftIcon={<Download size={14} />}>
                        Use
                      </Button>
                    </Stack>
                  </div>

                  {/* Widget Count */}
                  <div className="template-stats">
                    <span className="text-caption text-secondary">
                      {template.widgets.length} widgets • {template.variables.length} variables
                    </span>
                  </div>
                </Stack>
              </Card>
            ))}
          </div>
        )}
      </Stack>
    </Container>
  )
}

export default TemplateSelector
