// UI Component Library
export { default as Button } from './Button'
export type { ButtonProps } from './Button'

export { default as Input } from './Input'
export type { InputProps } from './Input'

export { default as Card } from './Card'
export type { CardProps } from './Card'

export { default as Badge } from './Badge'
export type { BadgeProps } from './Badge'

// Navigation Components
export { default as Dropdown } from './Dropdown'
export type { DropdownProps } from '@/types/designSystem'

export { default as Tabs } from './Tabs'
export type { TabsProps } from '@/types/designSystem'

export { default as Breadcrumbs } from './Breadcrumbs'
export type { BreadcrumbsProps } from '@/types/designSystem'

// Data Display Components
export { default as Avatar } from './Avatar'
export type { AvatarProps } from '@/types/designSystem'

export { default as Progress } from './Progress'
export type { ProgressProps } from '@/types/designSystem'

export { default as Tooltip } from './Tooltip'
export type { TooltipProps } from '@/types/designSystem'

// Icon Library
export { default as Icon } from './Icon'
export type { IconProps } from '@/types/designSystem'

// Advanced Components (temporarily disabled for debugging)
// export { default as KanbanBoard } from './KanbanBoard'
// export { default as KanbanColumn } from './KanbanColumn'
// export { default as KanbanCard } from './KanbanCard'
// export { default as Timeline } from './Timeline'
// export { default as TimelineEvent } from './TimelineEvent'
// export { default as TimelineMilestone } from './TimelineMilestone'
// export type {
//   KanbanBoardProps,
//   KanbanColumnProps,
//   KanbanCardProps,
//   TimelineProps,
//   TimelineEventProps,
//   TimelineMilestoneProps
// } from '@/types/designSystem'

export {
  CollapsibleSection,
  TaskPropertiesSection,
  CollaborationSection,
  DescriptionSection,
  CommentsSection,
  VersionHistorySection,
  TimeLogsSection,
  useCollapsibleSections
} from './CollapsibleSection'
