// Widget Registry - Reusable UI Components for Templates

export { default as CardWidget } from './CardWidget'
export { default as ListWidget } from './ListWidget'
export { default as TableWidget } from './TableWidget'
export { default as ChartWidget } from './ChartWidget'
export { default as FormWidget } from './FormWidget'
export { default as MediaWidget } from './MediaWidget'

// Design System Widgets
export { default as DropdownWidget } from './DropdownWidget'
export { default as TabsWidget } from './TabsWidget'
export { default as AvatarWidget } from './AvatarWidget'
export { default as ProgressWidget } from './ProgressWidget'
export { default as IconWidget } from './IconWidget'

// Advanced Widgets (simplified for debugging)
export { default as KanbanWidget } from './KanbanWidget'
export { default as TimelineWidget } from './TimelineWidget'
export { default as WikiWidget } from './WikiWidget'

// Widget type definitions
export interface BaseWidgetProps {
  id: string
  title?: string
  description?: string
  className?: string
  style?: React.CSSProperties
}

export interface CardWidgetProps extends BaseWidgetProps {
  showTaskCount?: boolean
  showMemberCount?: boolean
  showProgress?: boolean
  data?: any
}

export interface ListWidgetProps extends BaseWidgetProps {
  items: any[]
  showStatus?: boolean
  showAssignee?: boolean
  showDueDate?: boolean
  onItemClick?: (item: any) => void
}

export interface TableWidgetProps extends BaseWidgetProps {
  columns: Array<{
    key: string
    title: string
    width?: number
    sortable?: boolean
    render?: (value: any, record: any) => React.ReactNode
  }>
  data: any[]
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
}

export interface ChartWidgetProps extends BaseWidgetProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut'
  data: any
  options?: any
}

export interface FormWidgetProps extends BaseWidgetProps {
  fields: Array<{
    name: string
    type: string
    label: string
    required?: boolean
    options?: any[]
  }>
  onSubmit?: (data: any) => void
  initialValues?: any
}

export interface MediaWidgetProps extends BaseWidgetProps {
  src: string
  type: 'image' | 'video'
  controls?: boolean
  autoplay?: boolean
}

export interface TimelineWidgetProps extends BaseWidgetProps {
  events: Array<{
    id: string
    title: string
    date: string
    description?: string
    type?: 'milestone' | 'task' | 'event'
  }>
  showDates?: boolean
  orientation?: 'horizontal' | 'vertical'
}
