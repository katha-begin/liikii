import React from 'react'

// ============================================================================
// DESIGN SYSTEM CORE TYPES
// ============================================================================

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'loading' | 'focus'
export type ComponentCategory = 'navigation' | 'data-display' | 'feedback' | 'form' | 'layout' | 'media'

// ============================================================================
// COMPONENT DOCUMENTATION INTERFACES
// ============================================================================

export interface ComponentDocumentation {
  name: string
  category: ComponentCategory
  description: string
  variants: ComponentVariant[]
  props: ComponentProp[]
  examples: CodeExample[]
  accessibility: AccessibilityGuidelines
  designTokens: string[]
  integration: {
    templateSystem: boolean
    widgetRegistry: boolean
    themeSupport: boolean
  }
}

export interface ComponentProp {
  name: string
  type: string
  required: boolean
  defaultValue?: any
  description: string
  options?: string[]
}

export interface CodeExample {
  title: string
  description: string
  code: string
  preview?: boolean
}

export interface AccessibilityGuidelines {
  keyboardNavigation: string[]
  screenReader: string[]
  colorContrast: string
  focusManagement: string[]
}

// ============================================================================
// NAVIGATION COMPONENT INTERFACES
// ============================================================================

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  variant?: 'default' | 'menu' | 'select'
  size?: ComponentSize
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface DropdownItem {
  id: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  separator?: boolean
  onClick?: () => void
  href?: string
}

export interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: ComponentSize
  orientation?: 'horizontal' | 'vertical'
}

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  badge?: string | number
  icon?: React.ReactNode
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  maxItems?: number
  size?: ComponentSize
}

export interface BreadcrumbItem {
  id: string
  label: string
  href?: string
  onClick?: () => void
  current?: boolean
}

// ============================================================================
// DATA DISPLAY COMPONENT INTERFACES
// ============================================================================

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: ComponentSize
  variant?: 'circle' | 'square'
  status?: 'online' | 'offline' | 'away' | 'busy'
  showStatus?: boolean
  onClick?: () => void
}

export interface ProgressProps {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: ComponentSize
  showLabel?: boolean
  label?: string
  animated?: boolean
}

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
  variant?: 'default' | 'dark' | 'light'
}

// ============================================================================
// FORM COMPONENT INTERFACES
// ============================================================================

export interface SelectProps {
  options: SelectOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
  disabled?: boolean
  size?: ComponentSize
  variant?: 'default' | 'filled' | 'outlined'
  error?: string
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
  icon?: React.ReactNode
}

export interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: ComponentSize
  variant?: 'default' | 'card'
  label?: string
  description?: string
  error?: string
}

export interface RadioProps {
  value: string
  checked?: boolean
  onChange?: (value: string) => void
  disabled?: boolean
  size?: ComponentSize
  label?: string
  description?: string
  name?: string
}

export interface SwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: ComponentSize
  label?: string
  description?: string
}

// ============================================================================
// FEEDBACK COMPONENT INTERFACES
// ============================================================================

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  children: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
}

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export interface ToastProps {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// ============================================================================
// ICON LIBRARY INTERFACES
// ============================================================================

export interface IconProps {
  name: string
  size?: ComponentSize | number
  color?: string
  variant?: 'outline' | 'filled' | 'duotone'
  className?: string
  onClick?: () => void
}

export interface IconLibraryConfig {
  categories: IconCategory[]
  dccIntegrations: DCCIconMapping[]
  customIcons: CustomIcon[]
}

export interface IconCategory {
  id: string
  name: string
  description: string
  icons: string[]
}

export interface DCCIconMapping {
  application: string
  icons: {
    [key: string]: string // DCC action -> icon name mapping
  }
}

export interface CustomIcon {
  name: string
  svg: string
  category: string
  keywords: string[]
}

// ============================================================================
// LAYOUT PLANNING INTERFACES
// ============================================================================

export interface LayoutPlanningTemplate {
  id: string
  name: string
  category: 'page-layout' | 'component-pattern' | 'responsive-template'
  description: string
  structure: EnhancedLayoutStructure
  presets: LayoutPreset[]
  validation: ValidationRule[]
}

export interface EnhancedLayoutStructure {
  pageMetadata: {
    title: string
    description: string
    userTypes: string[]
    primaryGoals: string[]
    businessGoals: string[]
  }
  layoutPlanning: {
    wireframe: {
      regions: LayoutRegion[]
      hierarchy: string[]
      contentFlow: string[]
    }
    responsive: {
      breakpoints: ResponsiveBreakpoint[]
      adaptations: ResponsiveAdaptation[]
    }
    components: {
      required: ComponentRequirement[]
      optional: ComponentRequirement[]
      custom: CustomComponentSpec[]
    }
  }
  designSystem: {
    colorScheme: string[]
    typography: TypographySpec[]
    spacing: SpacingSpec[]
    patterns: InteractionPattern[]
  }
}

export interface LayoutRegion {
  name: string
  purpose: string
  priority: 'primary' | 'secondary' | 'tertiary'
  components: string[]
  constraints: string[]
}

export interface ComponentRequirement {
  component: string
  variant?: string
  props?: Record<string, any>
  purpose: string
  alternatives?: string[]
}

export interface CustomComponentSpec {
  name: string
  purpose: string
  baseComponent?: string
  customizations: string[]
  designTokens: string[]
}

export interface LayoutPreset {
  name: string
  description: string
  components: ComponentConfiguration[]
  responsive: ResponsiveConfiguration
}

export interface ComponentConfiguration {
  component: string
  props: Record<string, any>
  layout: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface ResponsiveConfiguration {
  mobile: Partial<ComponentConfiguration>[]
  tablet: Partial<ComponentConfiguration>[]
  desktop: Partial<ComponentConfiguration>[]
}

export interface ResponsiveBreakpoint {
  name: string
  minWidth: number
  maxWidth?: number
  adaptations: string[]
}

export interface ResponsiveAdaptation {
  breakpoint: string
  changes: AdaptationChange[]
}

export interface AdaptationChange {
  component: string
  property: string
  value: any
}

export interface ValidationRule {
  id: string
  description: string
  validator: (structure: EnhancedLayoutStructure) => boolean
  errorMessage: string
}

export interface TypographySpec {
  element: string
  fontSize: string
  lineHeight: string
  fontWeight: string
  usage: string[]
}

export interface SpacingSpec {
  name: string
  value: string
  usage: string[]
}

export interface InteractionPattern {
  name: string
  description: string
  components: string[]
  states: ComponentState[]
  transitions: string[]
}

// ============================================================================
// KANBAN BOARD INTERFACES
// ============================================================================

export interface KanbanBoardProps {
  columns: KanbanColumn[]
  tasks: KanbanTask[]
  onTaskMove?: (taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void
  onTaskClick?: (task: KanbanTask) => void
  onColumnAdd?: (column: Omit<KanbanColumn, 'id'>) => void
  onColumnEdit?: (columnId: string, updates: Partial<KanbanColumn>) => void
  onColumnDelete?: (columnId: string) => void
  className?: string
  style?: React.CSSProperties
  loading?: boolean
  maxHeight?: string | number
  showAddColumn?: boolean
  showColumnActions?: boolean
}

export interface KanbanColumn {
  id: string
  title: string
  color?: string
  wipLimit?: number
  taskIds: string[]
  order: number
  collapsed?: boolean
}

export interface KanbanTask {
  id: string
  title: string
  description?: string
  status: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  labels?: KanbanLabel[]
  dueDate?: string
  createdAt: string
  updatedAt: string
  estimatedHours?: number
  actualHours?: number
  projectId?: string
  dependencies?: string[]
  attachments?: number
  comments?: number
}

export interface KanbanLabel {
  id: string
  name: string
  color: string
}

export interface KanbanCardProps {
  task: KanbanTask
  isDragging?: boolean
  onClick?: (task: KanbanTask) => void
  showDetails?: boolean
  compact?: boolean
}

export interface KanbanColumnProps {
  column: KanbanColumn
  tasks: KanbanTask[]
  onTaskMove?: (taskId: string, newIndex: number) => void
  onTaskClick?: (task: KanbanTask) => void
  onColumnEdit?: (updates: Partial<KanbanColumn>) => void
  onColumnDelete?: () => void
  showActions?: boolean
  maxHeight?: string | number
}

// ============================================================================
// TIMELINE INTERFACES
// ============================================================================

export interface TimelineProps {
  events: TimelineEvent[]
  milestones?: TimelineMilestone[]
  startDate: string
  endDate: string
  onEventClick?: (event: TimelineEvent) => void
  onMilestoneClick?: (milestone: TimelineMilestone) => void
  onDateRangeChange?: (startDate: string, endDate: string) => void
  viewMode?: 'days' | 'weeks' | 'months' | 'quarters'
  showToday?: boolean
  showWeekends?: boolean
  height?: string | number
  className?: string
  style?: React.CSSProperties
  loading?: boolean
  zoomable?: boolean
  interactive?: boolean
}

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  type: 'task' | 'milestone' | 'deadline' | 'meeting' | 'review'
  status?: 'not_started' | 'in_progress' | 'completed' | 'overdue'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  color?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  projectId?: string
  dependencies?: string[]
  progress?: number
  tags?: string[]
}

export interface TimelineMilestone {
  id: string
  title: string
  description?: string
  date: string
  type: 'project_start' | 'project_end' | 'delivery' | 'review' | 'approval' | 'custom'
  status: 'upcoming' | 'current' | 'completed' | 'missed'
  color?: string
  icon?: React.ReactNode
  projectId?: string
}

export interface TimelineViewConfig {
  viewMode: 'days' | 'weeks' | 'months' | 'quarters'
  startDate: string
  endDate: string
  zoomLevel: number
  showWeekends: boolean
  showToday: boolean
}

export interface TimelineEventProps {
  event: TimelineEvent
  viewConfig: TimelineViewConfig
  onClick?: (event: TimelineEvent) => void
  style?: React.CSSProperties
  className?: string
}

export interface TimelineMilestoneProps {
  milestone: TimelineMilestone
  viewConfig: TimelineViewConfig
  onClick?: (milestone: TimelineMilestone) => void
  style?: React.CSSProperties
  className?: string
}
