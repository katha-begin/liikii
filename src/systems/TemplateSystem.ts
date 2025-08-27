// Template System - JSON Configuration Support
import { ProjectConfig, Templates } from '@/types/database'

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
  type: 'card' | 'list' | 'table' | 'chart' | 'form' | 'media' | 'timeline'
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
  }
}

// Global template engine instance
export const templateEngine = new TemplateEngine()
