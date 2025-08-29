// Template System - JSON Configuration Support
import { ProjectConfig, Templates } from '@/types/database'
import {
  ComponentSize,
  ComponentVariant,
  AccessibilityGuidelines,
  LayoutPlanningTemplate,
  EnhancedLayoutStructure
} from '@/types/designSystem'

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'date'
  label: string
  description?: string
  required: boolean
  defaultValue?: any
  options?: string[] // For select type
  validation?: {
    pattern?: string
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
  }
}

export interface WidgetConfig {
  id: string
  type: 'card' | 'list' | 'table' | 'chart' | 'form' | 'media' | 'timeline' |
        'dropdown' | 'tabs' | 'breadcrumbs' | 'avatar' | 'progress' | 'tooltip' |
        'alert' | 'modal' | 'select' | 'checkbox' | 'radio' | 'switch' | 'icon' |
        'kanban' | 'timeline-advanced'
  title: string
  description?: string
  props: Record<string, any>
  layout: {
    x: number
    y: number
    width: number
    height: number
  }
  dataSource?: {
    type: 'tasks' | 'projects' | 'versions' | 'static'
    query?: Record<string, any>
    transform?: string // JavaScript function as string
  }
  styling?: {
    backgroundColor?: string
    borderColor?: string
    textColor?: string
    borderRadius?: number
    padding?: number
    margin?: number
  }
  visibility?: {
    roles?: string[]
    conditions?: Record<string, any>
  }
  // Enhanced component properties for design system integration
  componentProps?: {
    variant?: ComponentVariant | string
    size?: ComponentSize
    state?: string
    accessibility?: AccessibilityGuidelines
  }
  documentation?: {
    usage: string
    examples: string[]
    designTokens: string[]
  }
}

export interface LayoutTemplate {
  id: string
  name: string
  description: string
  category: 'project' | 'task' | 'dashboard' | 'report'
  version: string
  author: string
  createdAt: string
  updatedAt: string
  variables: TemplateVariable[]
  widgets: WidgetConfig[]
  layout: {
    type: 'grid' | 'flex' | 'absolute'
    columns?: number
    gap?: number
    padding?: number
    responsive?: {
      mobile: Partial<LayoutTemplate['layout']>
      tablet: Partial<LayoutTemplate['layout']>
      desktop: Partial<LayoutTemplate['layout']>
    }
  }
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    backgroundColor?: string
    textColor?: string
    fontFamily?: string
    borderRadius?: number
  }
  metadata?: Record<string, any>
}

export interface ProjectTemplate extends LayoutTemplate {
  projectDefaults: {
    task_types: string[]
    milestones: string[]
    priority_levels: string[]
    file_extensions: Record<string, string>
    drive_mapping: Partial<ProjectConfig['drive_mapping']>
    templates: Partial<Templates>
  }
}

export class TemplateEngine {
  private templates: Map<string, LayoutTemplate> = new Map()
  private widgets: Map<string, any> = new Map()

  constructor() {
    this.initializeDefaultTemplates()
    this.registerDefaultWidgets()
  }

  // Template Management
  registerTemplate(template: LayoutTemplate): void {
    this.templates.set(template.id, template)
  }

  getTemplate(id: string): LayoutTemplate | undefined {
    return this.templates.get(id)
  }

  getAllTemplates(): LayoutTemplate[] {
    return Array.from(this.templates.values())
  }

  getTemplatesByCategory(category: LayoutTemplate['category']): LayoutTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.category === category)
  }

  // Widget Registry
  registerWidget(type: string, component: any): void {
    this.widgets.set(type, component)
  }

  getWidget(type: string): any {
    return this.widgets.get(type)
  }

  getAllWidgets(): Map<string, any> {
    return new Map(this.widgets)
  }

  // Template Processing
  processTemplate(template: LayoutTemplate, variables: Record<string, any>): LayoutTemplate {
    const processed = JSON.parse(JSON.stringify(template))
    
    // Process variables in widget props
    processed.widgets = processed.widgets.map((widget: WidgetConfig) => ({
      ...widget,
      props: this.processVariables(widget.props, variables),
      title: this.processString(widget.title, variables),
      description: widget.description ? this.processString(widget.description, variables) : undefined
    }))

    return processed
  }

  private processVariables(obj: any, variables: Record<string, any>): any {
    if (typeof obj === 'string') {
      return this.processString(obj, variables)
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.processVariables(item, variables))
    }
    
    if (obj && typeof obj === 'object') {
      const processed: any = {}
      for (const [key, value] of Object.entries(obj)) {
        processed[key] = this.processVariables(value, variables)
      }
      return processed
    }
    
    return obj
  }

  private processString(str: string, variables: Record<string, any>): string {
    return str.replace(/\{(\w+)\}/g, (match, varName) => {
      return variables[varName] !== undefined ? String(variables[varName]) : match
    })
  }

  // Theme Processing
  applyThemeOverrides(template: LayoutTemplate, overrides: Partial<LayoutTemplate['theme']>): LayoutTemplate {
    return {
      ...template,
      theme: {
        ...template.theme,
        ...overrides
      }
    }
  }

  // Validation
  validateTemplate(template: LayoutTemplate): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!template.id) errors.push('Template ID is required')
    if (!template.name) errors.push('Template name is required')
    if (!template.category) errors.push('Template category is required')
    if (!template.widgets || template.widgets.length === 0) {
      errors.push('Template must have at least one widget')
    }

    // Validate widgets
    template.widgets.forEach((widget, index) => {
      if (!widget.id) errors.push(`Widget ${index} is missing ID`)
      if (!widget.type) errors.push(`Widget ${index} is missing type`)
      if (!this.widgets.has(widget.type)) {
        errors.push(`Widget ${index} has unknown type: ${widget.type}`)
      }
    })

    // Validate variables
    template.variables.forEach((variable, index) => {
      if (!variable.name) errors.push(`Variable ${index} is missing name`)
      if (!variable.type) errors.push(`Variable ${index} is missing type`)
      if (!variable.label) errors.push(`Variable ${index} is missing label`)
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }

  private initializeDefaultTemplates(): void {
    // Default project dashboard template
    const projectDashboard: LayoutTemplate = {
      id: 'project-dashboard-default',
      name: 'Project Dashboard',
      description: 'Default project overview dashboard',
      category: 'project',
      version: '1.0.0',
      author: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variables: [
        {
          name: 'projectId',
          type: 'string',
          label: 'Project ID',
          required: true
        },
        {
          name: 'showCompleted',
          type: 'boolean',
          label: 'Show Completed Tasks',
          defaultValue: false,
          required: false
        }
      ],
      widgets: [
        {
          id: 'project-stats',
          type: 'card',
          title: 'Project Statistics',
          layout: { x: 0, y: 0, width: 4, height: 2 },
          props: {
            showTaskCount: true,
            showMemberCount: true,
            showProgress: true
          }
        },
        {
          id: 'recent-tasks',
          type: 'list',
          title: 'Recent Tasks',
          layout: { x: 4, y: 0, width: 8, height: 4 },
          dataSource: {
            type: 'tasks',
            query: { project: '{projectId}', limit: 10 }
          },
          props: {
            showStatus: true,
            showAssignee: true,
            showDueDate: true
          }
        }
      ],
      layout: {
        type: 'grid',
        columns: 12,
        gap: 16,
        padding: 24
      }
    }

    this.registerTemplate(projectDashboard)

    // Kanban Project Template
    const kanbanProjectTemplate: LayoutTemplate = {
      id: 'kanban-project-template',
      name: 'Kanban Project Board',
      description: 'Visual task management with drag-and-drop Kanban board',
      category: 'project',
      version: '1.0.0',
      author: 'System',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variables: [
        { name: 'projectId', type: 'string', defaultValue: '', description: 'Project ID' },
        { name: 'showAddColumn', type: 'boolean', defaultValue: true, description: 'Show add column button' },
        { name: 'showColumnActions', type: 'boolean', defaultValue: true, description: 'Show column action menus' }
      ],
      widgets: [
        {
          id: 'project-kanban',
          type: 'kanban',
          title: 'Project Tasks',
          layout: { x: 0, y: 0, width: 12, height: 8 },
          dataSource: {
            type: 'tasks',
            query: { project: '{projectId}' }
          },
          props: {
            showAddColumn: '{showAddColumn}',
            showColumnActions: '{showColumnActions}',
            maxHeight: '600px'
          }
        }
      ],
      layout: {
        type: 'grid',
        columns: 12,
        gap: 16,
        padding: 24
      }
    }

    this.registerTemplate(kanbanProjectTemplate)

    // Timeline Project Template
    const timelineProjectTemplate: LayoutTemplate = {
      id: 'timeline-project-template',
      name: 'Project Timeline',
      description: 'Project scheduling and milestone tracking with interactive timeline',
      category: 'project',
      version: '1.0.0',
      author: 'System',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variables: [
        { name: 'projectId', type: 'string', defaultValue: '', description: 'Project ID' },
        { name: 'viewMode', type: 'string', defaultValue: 'weeks', description: 'Timeline view mode' },
        { name: 'showWeekends', type: 'boolean', defaultValue: true, description: 'Show weekends' }
      ],
      widgets: [
        {
          id: 'project-timeline',
          type: 'timeline-advanced',
          title: 'Project Schedule',
          layout: { x: 0, y: 0, width: 12, height: 6 },
          dataSource: {
            type: 'tasks',
            query: { project: '{projectId}' }
          },
          props: {
            viewMode: '{viewMode}',
            showWeekends: '{showWeekends}',
            height: '400px',
            zoomable: true,
            interactive: true
          }
        },
        {
          id: 'project-stats',
          type: 'card',
          title: 'Project Statistics',
          layout: { x: 0, y: 6, width: 6, height: 2 },
          props: {
            showTaskCount: true,
            showMemberCount: true,
            showProgress: true
          }
        },
        {
          id: 'upcoming-milestones',
          type: 'list',
          title: 'Upcoming Milestones',
          layout: { x: 6, y: 6, width: 6, height: 2 },
          dataSource: {
            type: 'tasks',
            query: { project: '{projectId}', type: 'milestone', status: 'upcoming' }
          },
          props: {
            showStatus: true,
            showDueDate: true,
            compact: true
          }
        }
      ],
      layout: {
        type: 'grid',
        columns: 12,
        gap: 16,
        padding: 24
      }
    }

    this.registerTemplate(timelineProjectTemplate)
  }

  private registerDefaultWidgets(): void {
    // Widget registry will be populated by actual React components
    // This is just the type registration
    this.widgets.set('card', 'CardWidget')
    this.widgets.set('list', 'ListWidget')
    this.widgets.set('table', 'TableWidget')
    this.widgets.set('chart', 'ChartWidget')
    this.widgets.set('form', 'FormWidget')
    this.widgets.set('media', 'MediaWidget')
    this.widgets.set('timeline', 'TimelineWidget')

    // New design system components
    this.widgets.set('dropdown', 'DropdownWidget')
    this.widgets.set('tabs', 'TabsWidget')
    this.widgets.set('breadcrumbs', 'BreadcrumbsWidget')
    this.widgets.set('avatar', 'AvatarWidget')
    this.widgets.set('progress', 'ProgressWidget')
    this.widgets.set('tooltip', 'TooltipWidget')
    this.widgets.set('alert', 'AlertWidget')
    this.widgets.set('modal', 'ModalWidget')
    this.widgets.set('select', 'SelectWidget')
    this.widgets.set('checkbox', 'CheckboxWidget')
    this.widgets.set('radio', 'RadioWidget')
    this.widgets.set('switch', 'SwitchWidget')
    this.widgets.set('icon', 'IconWidget')

    // Advanced widgets
    this.widgets.set('kanban', 'KanbanWidget')
    this.widgets.set('timeline-advanced', 'TimelineWidget')
  }

  // Layout Planning Template Methods
  registerLayoutTemplate(template: LayoutPlanningTemplate): void {
    // Implementation for registering layout planning templates
    console.log('Registering layout template:', template.name)
  }

  getLayoutTemplate(_id: string): LayoutPlanningTemplate | undefined {
    // Implementation for retrieving layout templates
    return undefined
  }

  validateLayoutStructure(_structure: EnhancedLayoutStructure): boolean {
    // Implementation for validating layout structures
    return true
  }
}

// Global template engine instance
export const templateEngine = new TemplateEngine()
