// Theme types
export type Theme = 'light' | 'dark'

// Project types
export interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'on-hold' | 'completed'
  owner: string
  updatedAt: Date
  createdAt: Date
  theme?: ProjectTheme
}

export interface ProjectTheme {
  accent: string
  emptyIllustration?: string
}

// Task types
export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: string
  dueDate?: Date
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Template system types
export interface TemplateConfig {
  templateId: string
  theme: {
    default: Theme
    accent: string
    whiteChrome: boolean
  }
  nav: NavItem[]
  try: NavItem[]
  pages: Record<string, PageConfig>
  projectTheme: {
    allowAccentOverride: boolean
    swatches: string[]
  }
}

export interface NavItem {
  id: string
  label: string
  icon: string
  href?: string
}

export interface PageConfig {
  tabs: string[]
  filters?: {
    enabled: boolean
    chips: string[]
  }
  emptyState?: {
    title: string
    body: string
    primary: { label: string; action?: string }
    secondary: { label: string; href?: string }
  }
}

// DCC Integration types
export interface DCCConfig {
  application: string
  environment: 'rez' | 'conda'
  environmentPath?: string
  script?: string
  scriptArgs?: string
  projectContext?: {
    project?: string
    episode?: string
    sequence?: string
    shot?: string
  }
}

// CSV Import types
export interface CSVImportConfig {
  file: File
  mapping: Record<string, string>
  skipErrors: boolean
}

// Build system types
export interface BuildChannel {
  name: 'stable' | 'beta' | 'nightly'
  current: boolean
}

export interface BuildInfo {
  version: string
  channel: BuildChannel['name']
  date: Date
  changelog?: string
}

// Re-export design system types
export * from './designSystem'
