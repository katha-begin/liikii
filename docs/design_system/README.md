# Design System Documentation

## Overview

This is the comprehensive documentation for the Linear-inspired design system used throughout the application. The design system provides a consistent, accessible, and maintainable component library that integrates seamlessly with the template system and supports both light and dark themes.

## Design Principles

- **Consistency**: Unified visual language across all components
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA support
- **Performance**: Optimized components with minimal bundle impact
- **Flexibility**: Template system integration with JSON configuration
- **Maintainability**: Clear naming conventions and documentation

## Component Categories

### Navigation Components
- [Button](#button-component)
- [Breadcrumbs](#breadcrumbs-component)
- [Tabs](#tabs-component)

### Data Display
- [Card](#card-component)
- [Badge](#badge-component)
- [Avatar](#avatar-component)
- [Progress](#progress-component)
- [Icon](#icon-component)

### Form Components
- [Input](#input-component)
- [Dropdown](#dropdown-component)

### Feedback Components
- [Tooltip](#tooltip-component)

### Layout Components
- [Stack](#stack-component)
- [Grid](#grid-component)
- [PageWrapper](#pagewrapper-component)

### Advanced Components
- [KanbanWidget](#kanbanwidget-component)
- [TimelineWidget](#timelinewidget-component)
- [Modal](#modal-component)
- [TableEditor](#tableeditor-component)

---

## Button Component

### Description
Primary interactive element for user actions with multiple variants and sizes.

### Import
```typescript
import { Button } from '@/components/ui'
```

### Variants
- `primary` - Main call-to-action button
- `secondary` - Secondary actions with border
- `tertiary` - Subtle actions with background
- `ghost` - Minimal styling for less prominent actions

### Sizes
- `sm` - Small (28px height)
- `md` - Medium (32px height) - Default
- `lg` - Large (40px height)

### Props
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
}
```

### Usage Examples
```tsx
// Primary button with icon
<Button variant="primary" leftIcon={<Plus size={16} />}>
  Create Project
</Button>

// Secondary button
<Button variant="secondary" size="sm">
  Cancel
</Button>

// Ghost button with right icon
<Button variant="ghost" rightIcon={<ChevronDown size={14} />}>
  Options
</Button>
```

### Template System Integration
```json
{
  "type": "button",
  "componentProps": {
    "variant": "primary",
    "size": "md"
  },
  "props": {
    "children": "Click Me",
    "leftIcon": "Plus"
  }
}
```

---

## Card Component

### Description
Container component for grouping related content with consistent spacing and styling.

### Import
```typescript
import { Card } from '@/components/ui'
```

### Variants
- `default` - Standard card with background
- `elevated` - Card with shadow elevation
- `outlined` - Card with border outline

### Padding Options
- `none` - No padding
- `sm` - Small padding (12px)
- `md` - Medium padding (16px) - Default
- `lg` - Large padding (24px)
- `xl` - Extra large padding (32px)

### Props
```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  className?: string
}
```

### Usage Examples
```tsx
// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</Card>

// Elevated card with large padding
<Card variant="elevated" padding="lg">
  <Stack direction="vertical" gap="md">
    <h2>Feature Card</h2>
    <p>Enhanced card with shadow and spacing.</p>
  </Stack>
</Card>
```

---

## Input Component

### Description
Text input field with various states and configurations.

### Import
```typescript
import { Input } from '@/components/ui'
```

### Variants
- `default` - Standard input field
- `search` - Search-specific styling

### States
- `default` - Normal state
- `focus` - Focused state with accent border
- `error` - Error state with red border
- `disabled` - Disabled state

### Props
```typescript
interface InputProps {
  variant?: 'default' | 'search'
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

### Usage Examples
```tsx
// Basic input
<Input placeholder="Enter your name" />

// Search input with icon
<Input 
  variant="search" 
  placeholder="Search..." 
  leftIcon={<Search size={16} />} 
/>

// Input with error state
<Input 
  placeholder="Email address" 
  error={true}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

## Badge Component

### Description
Small status indicator for displaying categories, statuses, or counts.

### Import
```typescript
import { Badge } from '@/components/ui'
```

### Variants
- `default` - Neutral gray badge
- `primary` - Primary color badge
- `success` - Green success badge
- `warning` - Yellow warning badge
- `danger` - Red danger badge

### Sizes
- `sm` - Small badge
- `md` - Medium badge (default)
- `lg` - Large badge

### Props
```typescript
interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

### Usage Examples
```tsx
// Status badges
<Badge variant="success">Completed</Badge>
<Badge variant="warning">In Progress</Badge>
<Badge variant="danger">Blocked</Badge>

// Count badge
<Badge variant="primary" size="sm">3</Badge>
```

---

## Dropdown Component

### Description
Select dropdown with customizable options and styling.

### Import
```typescript
import { Dropdown } from '@/components/ui'
```

### Variants
- `select` - Standard select dropdown
- `menu` - Menu-style dropdown

### Props
```typescript
interface DropdownProps {
  variant?: 'select' | 'menu'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  options: DropdownOption[]
  disabled?: boolean
}

interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}
```

### Usage Examples
```tsx
// Basic dropdown
<Dropdown
  placeholder="Select option"
  value={selectedValue}
  onChange={setSelectedValue}
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]}
/>
```

---

## Tabs Component

### Description
Navigation component for switching between different views or sections.

### Import
```typescript
import { Tabs } from '@/components/ui'
```

### Variants
- `default` - Standard tabs with underline
- `pills` - Pill-style tabs with background

### Props
```typescript
interface TabsProps {
  variant?: 'default' | 'pills'
  value: string
  onChange: (value: string) => void
  tabs: TabItem[]
}

interface TabItem {
  value: string
  label: string
  disabled?: boolean
}
```

### Usage Examples
```tsx
// Standard tabs
<Tabs
  value={activeTab}
  onChange={setActiveTab}
  tabs={[
    { value: 'overview', label: 'Overview' },
    { value: 'details', label: 'Details' },
    { value: 'settings', label: 'Settings' }
  ]}
/>

// Pill tabs
<Tabs
  variant="pills"
  value={activeTab}
  onChange={setActiveTab}
  tabs={tabItems}
/>
```

---

## Avatar Component

### Description
User profile image or initials display with various sizes and shapes.

### Import
```typescript
import { Avatar } from '@/components/ui'
```

### Shapes
- `circle` - Circular avatar (default)
- `square` - Square avatar with rounded corners

### Sizes
- `xs` - 20px
- `sm` - 24px
- `md` - 32px (default)
- `lg` - 40px
- `xl` - 48px

### Props
```typescript
interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
}
```

### Usage Examples
```tsx
// Avatar with image
<Avatar src="/user-avatar.jpg" alt="John Doe" />

// Avatar with initials
<Avatar initials="JD" size="lg" />

// Square avatar
<Avatar src="/avatar.jpg" shape="square" size="md" />
```

---

## Progress Component

### Description
Progress indicator for showing completion status or loading states.

### Import
```typescript
import { Progress } from '@/components/ui'
```

### Variants
- `default` - Standard progress bar
- `success` - Green progress bar
- `warning` - Yellow progress bar
- `danger` - Red progress bar

### Props
```typescript
interface ProgressProps {
  value: number // 0-100
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}
```

### Usage Examples
```tsx
// Basic progress bar
<Progress value={65} />

// Progress with label and variant
<Progress 
  value={85} 
  variant="success" 
  showLabel={true} 
/>
```

---

## Stack Component

### Description
Layout component for arranging children with consistent spacing.

### Import
```typescript
import { Stack } from '@/components/layout'
```

### Direction
- `horizontal` - Horizontal layout (default)
- `vertical` - Vertical layout

### Gap Sizes
- `xs` - 4px
- `sm` - 8px
- `md` - 16px (default)
- `lg` - 24px
- `xl` - 32px

### Props
```typescript
interface StackProps {
  direction?: 'horizontal' | 'vertical'
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
  children: React.ReactNode
}
```

### Usage Examples
```tsx
// Horizontal stack with medium gap
<Stack direction="horizontal" gap="md">
  <Button>Cancel</Button>
  <Button variant="primary">Save</Button>
</Stack>

// Vertical stack with center alignment
<Stack direction="vertical" gap="lg" align="center">
  <h2>Title</h2>
  <p>Description</p>
  <Button>Action</Button>
</Stack>
```

---

## Modal Component

### Description
Overlay dialog for displaying content above the main interface.

### Import
```typescript
import { Modal } from '@/components/ui'
```

### Sizes
- `sm` - Small modal (400px max width)
- `md` - Medium modal (600px max width) - Default
- `lg` - Large modal (800px max width)
- `xl` - Extra large modal (1200px max width)
- `full` - Full width modal (95vw max width)

### Props
```typescript
interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}
```

### Usage Examples
```tsx
// Basic modal
<Modal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Confirm Action"
>
  <p>Are you sure you want to continue?</p>
  <Stack direction="horizontal" gap="sm" justify="end">
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </Stack>
</Modal>
```

---

## TableEditor Component

### Description
Interactive table editor for creating and editing markdown tables with visual interface.

### Import
```typescript
import { TableEditor, TableInsertModal } from '@/components/wiki'
```

### Features
- Visual table creation with size presets
- Click-to-edit cells with keyboard navigation
- Row/column manipulation via context menus
- Automatic markdown conversion
- Table detection in existing content

### Props
```typescript
interface TableEditorProps {
  table: TableData
  onSave: (markdown: string) => void
  onCancel: () => void
}

interface TableInsertModalProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (markdown: string) => void
}
```

### Usage Examples
```tsx
// Table insert modal
<TableInsertModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onInsert={(markdown) => {
    insertTableIntoContent(markdown)
    setShowModal(false)
  }}
/>

// Table editor
<TableEditor
  table={tableData}
  onSave={(markdown) => updateContent(markdown)}
  onCancel={() => setEditingTable(null)}
/>
```

---

## KanbanWidget Component

### Description
Kanban board widget for task management with drag-and-drop functionality.

### Import
```typescript
import { KanbanWidget } from '@/components/widgets'
```

### Features
- Drag-and-drop task management
- Customizable columns and statuses
- Task filtering and search
- Column actions (add, edit, delete)
- Responsive design

### Props
```typescript
interface KanbanWidgetProps {
  title?: string
  showAddColumn?: boolean
  showColumnActions?: boolean
  maxHeight?: string
  data?: KanbanData
  onTaskMove?: (taskId: string, newStatus: string) => void
}
```

### Usage Examples
```tsx
// Basic Kanban widget
<KanbanWidget
  title="Project Tasks"
  showAddColumn={true}
  showColumnActions={true}
  maxHeight="600px"
/>
```

---

## TimelineWidget Component

### Description
Timeline/Gantt chart widget for project scheduling and task visualization.

### Import
```typescript
import { TimelineWidget } from '@/components/widgets'
```

### Features
- Timeline view with date ranges
- Department-based task grouping
- Task filtering by user/department
- Responsive timeline scaling
- Today indicator line

### Props
```typescript
interface TimelineWidgetProps {
  title?: string
  showFilters?: boolean
  showDepartments?: boolean
  viewMode?: 'day' | 'week' | 'month'
  data?: TimelineData
}
```

### Usage Examples
```tsx
// Timeline widget with filters
<TimelineWidget
  title="Project Timeline"
  showFilters={true}
  showDepartments={true}
  viewMode="week"
/>
```

---

## Design Tokens

### Color System
```css
/* Dark Theme (Default) */
--bg-base: #0B0D12;
--bg-surface-1: #0F141A;
--bg-surface-2: #141A21;
--border-line: #1E2630;
--text-primary: #E6EAF2;
--text-secondary: #A8B0BE;

/* Light Theme */
--bg-base: #F7F8FA;
--bg-surface-1: #FFFFFF;
--bg-surface-2: #F2F4F7;
--border-line: #E6EAF2;
--text-primary: #0F141A;
--text-secondary: #475569;

/* Accent Colors */
--accent-blue: #3B82F6;
--accent-lilac: #A855F7;
--accent-green: #10B981;
--accent-yellow: #F59E0B;
--accent-red: #EF4444;
```

### Typography Scale
```css
--text-h1-size: 2rem;      /* 32px */
--text-h2-size: 1.5rem;    /* 24px */
--text-h3-size: 1.25rem;   /* 20px */
--text-body-size: 0.875rem; /* 14px */
--text-caption-size: 0.75rem; /* 12px */
```

### Spacing Scale
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
```

### Border Radius
```css
--radius-sm: 4px;
--radius-input: 6px;
--radius-card: 8px;
--radius-lg: 12px;
--radius-pill: 9999px;
```

---

## Template System Integration

All components are integrated with the template system for JSON-based configuration:

### Widget Registry
Components are registered and can be used in templates:
```json
{
  "type": "button",
  "componentProps": {
    "variant": "primary",
    "size": "md"
  },
  "props": {
    "children": "Click Me"
  }
}
```

### Available Widget Types
- `button`, `input`, `dropdown`, `tabs`
- `card`, `badge`, `avatar`, `progress`
- `tooltip`, `modal`, `breadcrumbs`
- `kanban`, `timeline-advanced`
- `stack`, `grid`

---

## Implementation Guidelines

### Naming Conventions
- Use exact component names and variant names for feedback
- Follow TypeScript interfaces for prop definitions
- Maintain consistent naming across all components

### Accessibility
- All components include proper ARIA labels
- Keyboard navigation support where applicable
- Focus management and screen reader compatibility
- Color contrast ratios meet WCAG 2.1 AA standards

### Performance
- Components are tree-shakeable
- Minimal bundle impact with lazy loading
- Optimized re-renders with React.memo where appropriate

### Theme Support
- All components support light and dark themes
- CSS custom properties for consistent theming
- Automatic theme switching capability

---

## Development Workflow

### Adding New Components
1. Create component in `/src/components/ui/`
2. Add TypeScript interfaces in `/src/types/designSystem.ts`
3. Export from `/src/components/ui/index.ts`
4. Register in widget system if applicable
5. Add documentation to this README
6. Add examples to DesignSystemDemo page

### Testing Components
- Use the `/design-system` demo page for visual testing
- Test all variants, sizes, and states
- Verify accessibility with screen readers
- Test keyboard navigation
- Validate responsive behavior

This design system provides a comprehensive foundation for building consistent, accessible, and maintainable user interfaces throughout the application.

