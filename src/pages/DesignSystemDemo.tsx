import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Settings, Download, Heart, Calendar, Users, Filter, MoreHorizontal, TrendingUp, Clock, Mail, Bell, ChevronDown, Home } from 'lucide-react'
import {
  Button,
  Input,
  Card,
  Badge,
  Dropdown,
  Tabs,
  Breadcrumbs,
  Avatar,
  Progress,
  Tooltip,
  Icon
} from '@/components/ui'
import { PageWrapper, Grid, Stack, ScrollToTop } from '@/components/layout'
import { KanbanWidget, TimelineWidget } from '@/components/widgets'
import { IconLibrary } from '@/systems/IconLibrary'

const DesignSystemDemo: React.FC = () => {
  const navigate = useNavigate()
  const [selectedButton, setSelectedButton] = useState<string>('')
  const [dropdownValue, setDropdownValue] = useState<string>('option1')
  const [inputValue, setInputValue] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [progressValue, setProgressValue] = useState<number>(65)
  const iconLibrary = IconLibrary.getInstance()

  return (
    <>
      <PageWrapper maxWidth="lg" padding scrollable>
        <Stack direction="vertical" gap="xl">
          <div>
            <h1 className="text-h1">Design System Documentation</h1>
            <p className="text-body text-secondary">
              Comprehensive component library with proper naming conventions for precise feedback and development reference.
              Use these exact component names and variant names when providing feedback.
            </p>
          </div>

          {/* Button Components */}
          <Card padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Button Component</h2>
                <p className="text-body text-secondary">
                  Reference: <code>&lt;Button variant="primary|secondary|tertiary|ghost" size="sm|md|lg" /&gt;</code>
                </p>
              </div>

              <div>
                <h3 className="text-h3">Button Variants</h3>
                <Stack direction="horizontal" gap="sm" wrap>
                  <Button variant="primary" leftIcon={<Plus size={16} />}>Primary Button</Button>
                  <Button variant="secondary" leftIcon={<Download size={16} />}>Secondary Button</Button>
                  <Button variant="tertiary" leftIcon={<Settings size={16} />}>Tertiary Button</Button>
                  <Button variant="ghost" leftIcon={<Heart size={16} />}>Ghost Button</Button>
                </Stack>
              </div>

              <div>
                <h3 className="text-h3">Button Sizes</h3>
                <Stack direction="horizontal" gap="sm" wrap align="center">
                  <Button variant="primary" size="sm">Small Button</Button>
                  <Button variant="primary" size="md">Medium Button</Button>
                  <Button variant="primary" size="lg">Large Button</Button>
                </Stack>
              </div>

              <div>
                <h3 className="text-h3">Button States</h3>
                <Stack direction="horizontal" gap="sm" wrap>
                  <Button variant="primary" loading>Loading Button</Button>
                  <Button variant="secondary" disabled>Disabled Button</Button>
                  <Button
                    variant={selectedButton === 'interactive' ? 'primary' : 'secondary'}
                    onClick={() => setSelectedButton(selectedButton === 'interactive' ? '' : 'interactive')}
                  >
                    Interactive Button
                  </Button>
                </Stack>
              </div>
            </Stack>
          </Card>

          {/* Input Components */}
          <Card padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Input Component</h2>
                <p className="text-body text-secondary">
                  Reference: <code>&lt;Input variant="default|search" leftIcon={'{icon}'} placeholder="text" /&gt;</code>
                </p>
              </div>

              <div style={{ maxWidth: '400px' }}>
                <Stack direction="vertical" gap="md">
                  <div>
                    <h3 className="text-h3">Input Variants</h3>
                    <Stack direction="vertical" gap="sm">
                      <Input
                        placeholder="Default Input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <Input
                        placeholder="Input with Left Icon"
                        leftIcon={<Search size={16} />}
                      />
                      <Input
                        variant="search"
                        placeholder="Search Input Variant"
                        leftIcon={<Search size={16} />}
                      />
                    </Stack>
                  </div>
                </Stack>
              </div>
            </Stack>
          </Card>

          {/* Badge Components */}
          <Card padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Badge Component</h2>
                <p className="text-body text-secondary">
                  Reference: <code>&lt;Badge variant="default|primary|secondary|success|warning|danger" size="sm|md" /&gt;</code>
                </p>
              </div>

              <div>
                <h3 className="text-h3">Badge Variants</h3>
                <Stack direction="horizontal" gap="sm" wrap align="center">
                  <Badge variant="default">Default Badge</Badge>
                  <Badge variant="primary">Primary Badge</Badge>
                  <Badge variant="success">Success Badge</Badge>
                  <Badge variant="warning">Warning Badge</Badge>
                  <Badge variant="danger">Danger Badge</Badge>
                </Stack>
              </div>

              <div>
                <h3 className="text-h3">Badge Sizes</h3>
                <Stack direction="horizontal" gap="sm" wrap align="center">
                  <Badge variant="primary" size="sm">Small Badge</Badge>
                  <Badge variant="primary" size="md">Medium Badge</Badge>
                </Stack>
              </div>
            </Stack>
          </Card>

          {/* Dropdown/Select Components */}
          <Card padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Dropdown/Select Component</h2>
                <p className="text-body text-secondary">
                  Reference: <code>&lt;select className="filter-select" /&gt;</code>
                </p>
              </div>

              <div style={{ maxWidth: '300px' }}>
                <Stack direction="vertical" gap="md">
                  <div>
                    <h3 className="text-h3">Filter Select</h3>
                    <select
                      className="filter-select"
                      value={dropdownValue}
                      onChange={(e) => setDropdownValue(e.target.value)}
                    >
                      <option value="option1">Filter Option 1</option>
                      <option value="option2">Filter Option 2</option>
                      <option value="option3">Filter Option 3</option>
                    </select>
                  </div>
                </Stack>
              </div>
            </Stack>
          </Card>

          {/* Icon Components */}
          <Card padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Icon Components</h2>
                <p className="text-body text-secondary">
                  Reference: Icons from Lucide React - <code>import {'{IconName}'} from 'lucide-react'</code>
                </p>
              </div>

              <div>
                <h3 className="text-h3">Common Icons</h3>
                <Grid cols={4} gap="md">
                  <div className="icon-demo">
                    <Plus size={20} />
                    <span>Plus</span>
                  </div>
                  <div className="icon-demo">
                    <Search size={20} />
                    <span>Search</span>
                  </div>
                  <div className="icon-demo">
                    <Settings size={20} />
                    <span>Settings</span>
                  </div>
                  <div className="icon-demo">
                    <Download size={20} />
                    <span>Download</span>
                  </div>
                  <div className="icon-demo">
                    <Calendar size={20} />
                    <span>Calendar</span>
                  </div>
                  <div className="icon-demo">
                    <Users size={20} />
                    <span>Users</span>
                  </div>
                  <div className="icon-demo">
                    <Filter size={20} />
                    <span>Filter</span>
                  </div>
                  <div className="icon-demo">
                    <MoreHorizontal size={20} />
                    <span>MoreHorizontal</span>
                  </div>
                  <div className="icon-demo">
                    <TrendingUp size={20} />
                    <span>TrendingUp</span>
                  </div>
                  <div className="icon-demo">
                    <Clock size={20} />
                    <span>Clock</span>
                  </div>
                  <div className="icon-demo">
                    <Mail size={20} />
                    <span>Mail</span>
                  </div>
                  <div className="icon-demo">
                    <Bell size={20} />
                    <span>Bell</span>
                  </div>
                </Grid>
              </div>
            </Stack>
          </Card>

          {/* Typography */}
          <Card padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Typography</h2>
                <p className="text-body text-secondary">
                  Reference: <code>className="text-h1|text-h2|text-h3|text-body|text-caption"</code>
                </p>
              </div>

              <Stack direction="vertical" gap="md">
                <h1 className="text-h1">Heading 1 (text-h1)</h1>
                <h2 className="text-h2">Heading 2 (text-h2)</h2>
                <h3 className="text-h3">Heading 3 (text-h3)</h3>
                <p className="text-body">Body text (text-body) - This is the standard body text used throughout the application.</p>
                <p className="text-body text-secondary">Secondary body text (text-body text-secondary)</p>
                <p className="text-caption">Caption text (text-caption) - Used for smaller, less prominent text</p>
                <p className="text-caption text-secondary">Secondary caption (text-caption text-secondary)</p>
              </Stack>
            </Stack>
          </Card>

          {/* Navigation Components */}
          <Card padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Navigation Components</h2>
                <p className="text-body text-secondary">
                  Components for navigation and user interaction flows.
                </p>
              </div>

              <div>
                <h3 className="text-h3">Dropdown Component</h3>
                <p className="text-body text-secondary">
                  Reference: <code>&lt;Dropdown variant="default|menu|select" size="sm|md|lg" /&gt;</code>
                </p>
                <Stack direction="horizontal" gap="md" wrap>
                  <Dropdown
                    trigger="Default Dropdown"
                    items={[
                      { id: '1', label: 'Option 1', icon: <Settings size={16} /> },
                      { id: '2', label: 'Option 2', icon: <Users size={16} /> },
                      { id: 'sep', label: '', separator: true },
                      { id: '3', label: 'Option 3', icon: <Download size={16} /> }
                    ]}
                  />
                  <Dropdown
                    variant="select"
                    trigger="Select Option"
                    items={[
                      { id: 'opt1', label: 'First Option' },
                      { id: 'opt2', label: 'Second Option' },
                      { id: 'opt3', label: 'Third Option' }
                    ]}
                  />
                </Stack>
              </div>

              <div>
                <h3 className="text-h3">Tabs Component</h3>
                <p className="text-body text-secondary">
                  Reference: <code>&lt;Tabs variant="default|pills|underline" size="sm|md|lg" /&gt;</code>
                </p>
                <Tabs
                  items={[
                    {
                      id: 'overview',
                      label: 'Overview',
                      icon: <Home size={16} />,
                      content: <div className="text-body">Overview content goes here...</div>
                    },
                    {
                      id: 'details',
                      label: 'Details',
                      badge: '3',
                      content: <div className="text-body">Details content with badge indicator...</div>
                    },
                    {
                      id: 'settings',
                      label: 'Settings',
                      icon: <Settings size={16} />,
                      content: <div className="text-body">Settings configuration panel...</div>
                    }
                  ]}
                  value={activeTab}
                  onChange={setActiveTab}
                />
              </div>

              <div>
                <h3 className="text-h3">Breadcrumbs Component</h3>
                <p className="text-body text-secondary">
                  Reference: <code>&lt;Breadcrumbs maxItems={5} size="sm|md|lg" /&gt;</code>
                </p>
                <Breadcrumbs
                  items={[
                    { id: 'home', label: 'Home', href: '/' },
                    { id: 'projects', label: 'Projects', href: '/projects' },
                    { id: 'project', label: 'Sky Wars Anthology', href: '/projects/swa' },
                    { id: 'current', label: 'Design System', current: true }
                  ]}
                />
              </div>
            </Stack>
          </Card>

          {/* Data Display Components */}
          <Card padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Data Display Components</h2>
                <p className="text-body text-secondary">
                  Components for displaying data and user information.
                </p>
              </div>

              <div>
                <h3 className="text-h3">Avatar Component</h3>
                <p className="text-body text-secondary">
                  Reference: <code>&lt;Avatar size="xs|sm|md|lg|xl" variant="circle|square" status="online|offline|away|busy" /&gt;</code>
                </p>
                <Stack direction="horizontal" gap="md" wrap align="center">
                  <Avatar size="xs" fallback="XS" />
                  <Avatar size="sm" fallback="SM" showStatus status="online" />
                  <Avatar size="md" fallback="MD" showStatus status="away" />
                  <Avatar size="lg" fallback="LG" showStatus status="busy" />
                  <Avatar size="xl" fallback="XL" variant="square" />
                </Stack>
              </div>

              <div>
                <h3 className="text-h3">Progress Component</h3>
                <p className="text-body text-secondary">
                  Reference: <code>&lt;Progress variant="default|success|warning|danger" size="sm|md|lg" /&gt;</code>
                </p>
                <Stack direction="vertical" gap="md">
                  <Progress value={progressValue} showLabel label="Project Progress" />
                  <Progress value={85} variant="success" showLabel label="Completed Tasks" />
                  <Progress value={45} variant="warning" showLabel label="In Progress" />
                  <Progress value={15} variant="danger" showLabel label="Blocked Tasks" />
                  <Stack direction="horizontal" gap="sm">
                    <Button size="sm" onClick={() => setProgressValue(Math.max(0, progressValue - 10))}>-10%</Button>
                    <Button size="sm" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>+10%</Button>
                  </Stack>
                </Stack>
              </div>

              <div>
                <h3 className="text-h3">Tooltip Component</h3>
                <p className="text-body text-secondary">
                  Reference: <code>&lt;Tooltip placement="top|bottom|left|right" variant="default|dark|light" /&gt;</code>
                </p>
                <Stack direction="horizontal" gap="md" wrap>
                  <Tooltip content="This is a helpful tooltip" placement="top">
                    <Button variant="secondary">Hover for tooltip</Button>
                  </Tooltip>
                  <Tooltip content="Dark variant tooltip" variant="dark" placement="bottom">
                    <Button variant="secondary">Dark tooltip</Button>
                  </Tooltip>
                  <Tooltip content="Light variant tooltip" variant="light" placement="right">
                    <Button variant="secondary">Light tooltip</Button>
                  </Tooltip>
                </Stack>
              </div>
            </Stack>
          </Card>

          {/* Icon Library */}
          <Card padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Icon Library</h2>
                <p className="text-body text-secondary">
                  Systematic icon organization with DCC integration support.
                  Reference: <code>&lt;Icon name="IconName" size="xs|sm|md|lg|xl" variant="outline|filled|duotone" /&gt;</code>
                </p>
              </div>

              <div>
                <h3 className="text-h3">Icon Sizes</h3>
                <Stack direction="horizontal" gap="md" wrap align="center">
                  <Icon name="Settings" size="xs" />
                  <Icon name="Settings" size="sm" />
                  <Icon name="Settings" size="md" />
                  <Icon name="Settings" size="lg" />
                  <Icon name="Settings" size="xl" />
                </Stack>
              </div>

              <div>
                <h3 className="text-h3">Icon Categories</h3>
                <Stack direction="vertical" gap="md">
                  {iconLibrary.getIconsByCategory('navigation').slice(0, 8).map(iconName => (
                    <Stack key={iconName} direction="horizontal" gap="sm" align="center">
                      <Icon name={iconName} size="md" />
                      <span className="text-body">{iconName}</span>
                    </Stack>
                  ))}
                </Stack>
              </div>

              <div>
                <h3 className="text-h3">DCC Integration Examples</h3>
                <p className="text-body text-secondary">
                  Icons mapped to common DCC application actions.
                </p>
                <Stack direction="horizontal" gap="md" wrap>
                  <Tooltip content="Maya: Create Polygon">
                    <Icon name={iconLibrary.getDCCIcon('maya', 'create_polygon') || 'Box'} size="lg" />
                  </Tooltip>
                  <Tooltip content="Blender: Add Mesh">
                    <Icon name={iconLibrary.getDCCIcon('blender', 'add_mesh') || 'Plus'} size="lg" />
                  </Tooltip>
                  <Tooltip content="Houdini: Geometry Node">
                    <Icon name={iconLibrary.getDCCIcon('houdini', 'geometry') || 'Box'} size="lg" />
                  </Tooltip>
                  <Tooltip content="Nuke: Merge Node">
                    <Icon name={iconLibrary.getDCCIcon('nuke', 'merge') || 'GitMerge'} size="lg" />
                  </Tooltip>
                </Stack>
              </div>
            </Stack>
          </Card>

          {/* Component Usage Guidelines */}
          <Card padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Component Usage Guidelines</h2>
                <p className="text-body text-secondary">
                  When providing feedback, please reference these exact component and variant names for precise communication.
                </p>
              </div>

              <Stack direction="vertical" gap="md">
                <div>
                  <h3 className="text-h3">Feedback Examples</h3>
                  <ul style={{ paddingLeft: 'var(--space-4)', margin: 0 }}>
                    <li className="text-body">✅ "The Primary Button should be larger" → "Change Button variant='primary' to size='lg'"</li>
                    <li className="text-body">✅ "The dropdown looks wrong" → "Update Dropdown variant from 'default' to 'select'"</li>
                    <li className="text-body">✅ "The tabs need pills style" → "Change Tabs variant from 'default' to 'pills'"</li>
                    <li className="text-body">✅ "The avatar should show status" → "Add Avatar showStatus={true} status='online'"</li>
                    <li className="text-body">✅ "The progress bar color is wrong" → "Change Progress variant from 'default' to 'success'"</li>
                    <li className="text-body">✅ "The tooltip placement is off" → "Change Tooltip placement from 'top' to 'bottom'"</li>
                    <li className="text-body">✅ "The icon is too small" → "Change Icon size from 'md' to 'lg'"</li>
                    <li className="text-body">✅ "The card needs more spacing" → "Change Card padding from 'md' to 'lg'"</li>
                    <li className="text-body">✅ "The badge color is incorrect" → "Change Badge variant from 'default' to 'success'"</li>
                  </ul>
                </div>
              </Stack>
            </Stack>
          </Card>

          {/* Advanced Widgets */}
          <Card variant="outlined" padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Advanced Widgets</h2>
                <p className="text-body text-secondary">
                  Complex widgets for VFX production management workflows.
                </p>
              </div>

              <Stack direction="vertical" gap="xl">
                {/* Kanban Board */}
                <div>
                  <h3 className="text-h3">Kanban Board</h3>
                  <p className="text-body text-secondary">
                    Visual task management with drag-and-drop functionality. Organize tasks by status columns.
                  </p>
                  <div style={{ marginTop: 'var(--space-4)' }}>
                    <KanbanWidget
                      title="Project Tasks"
                      showAddColumn={true}
                      showColumnActions={true}
                      maxHeight="500px"
                    />
                  </div>
                  <div style={{ marginTop: 'var(--space-3)' }}>
                    <h4 className="text-h4">Features:</h4>
                    <ul style={{ marginLeft: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                      <li>Drag-and-drop task movement between columns</li>
                      <li>Customizable status columns with WIP limits</li>
                      <li>Task cards with priority, assignee, and due dates</li>
                      <li>Real-time collaboration support</li>
                      <li>Responsive design for all screen sizes</li>
                    </ul>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <h3 className="text-h3">Timeline</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/design-system/timeline')}
                    >
                      View Full Timeline Demo
                    </Button>
                  </div>
                  <p className="text-body text-secondary">
                    Project scheduling and milestone tracking with interactive timeline visualization.
                    Click "View Full Timeline Demo" to see the Linear.com-inspired full-page implementation.
                  </p>
                  <div style={{ marginTop: 'var(--space-4)' }}>
                    <TimelineWidget
                      title="Animation Production Timeline - Gantt View"
                      viewMode="weeks"
                      showToday={true}
                      showWeekends={true}
                      height="500px"
                      zoomable={true}
                      interactive={true}
                      groupByDepartment={true}
                      showPropertiesPanel={true}
                      showFilters={true}
                      tasks={[
                        {
                          id: 'demo-task-1',
                          title: 'Character Animation - Hero Walk Cycle',
                          description: 'Create walk cycle animation for main character',
                          status: 'in_progress',
                          priority: 'high',
                          assignee: { id: 'user-1', name: 'John Doe', avatar: undefined },
                          labels: [
                            { id: 'label-1', name: 'Animation', color: '#3B82F6' },
                            { id: 'label-2', name: 'Character', color: '#10B981' }
                          ],
                          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          estimatedHours: 32,
                          comments: 2,
                          attachments: 1
                        },
                        {
                          id: 'demo-task-2',
                          title: 'Environment Modeling - Forest Scene',
                          description: 'Model detailed forest environment for Act 2',
                          status: 'not_started',
                          priority: 'medium',
                          assignee: { id: 'user-2', name: 'Jane Smith', avatar: undefined },
                          labels: [
                            { id: 'label-3', name: 'Modeling', color: '#F59E0B' },
                            { id: 'label-4', name: 'Environment', color: '#8B5CF6' }
                          ],
                          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
                          createdAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                          updatedAt: new Date().toISOString(),
                          estimatedHours: 40,
                          comments: 0,
                          attachments: 0
                        },
                        {
                          id: 'demo-task-3',
                          title: 'Lighting Setup - Interior Scenes',
                          description: 'Set up lighting for all interior scenes',
                          status: 'review',
                          priority: 'urgent',
                          assignee: { id: 'user-1', name: 'John Doe', avatar: undefined },
                          labels: [
                            { id: 'label-5', name: 'Lighting', color: '#EF4444' },
                            { id: 'label-6', name: 'Interior', color: '#06B6D4' }
                          ],
                          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                          updatedAt: new Date().toISOString(),
                          estimatedHours: 24,
                          comments: 8,
                          attachments: 2
                        },
                        {
                          id: 'demo-task-4',
                          title: 'Character Rigging - Hero Setup',
                          description: 'Create advanced rig for hero character',
                          status: 'in_progress',
                          priority: 'high',
                          assignee: { id: 'user-3', name: 'Mike Johnson', avatar: undefined },
                          labels: [
                            { id: 'label-7', name: 'Rigging', color: '#06B6D4' },
                            { id: 'label-8', name: 'Character', color: '#10B981' }
                          ],
                          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                          updatedAt: new Date().toISOString(),
                          estimatedHours: 28,
                          comments: 3,
                          attachments: 1
                        },
                        {
                          id: 'demo-task-5',
                          title: 'FX Simulation - Water Effects',
                          description: 'Create realistic water simulation for river scene',
                          status: 'not_started',
                          priority: 'medium',
                          assignee: { id: 'user-4', name: 'Sarah Wilson', avatar: undefined },
                          labels: [
                            { id: 'label-9', name: 'FX', color: '#8B5CF6' },
                            { id: 'label-10', name: 'Simulation', color: '#F59E0B' }
                          ],
                          dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
                          createdAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                          updatedAt: new Date().toISOString(),
                          estimatedHours: 36,
                          comments: 0,
                          attachments: 0
                        },
                        {
                          id: 'demo-task-6',
                          title: 'Compositing - Final Assembly',
                          description: 'Composite all elements for final shots',
                          status: 'not_started',
                          priority: 'low',
                          assignee: { id: 'user-5', name: 'Alex Chen', avatar: undefined },
                          labels: [
                            { id: 'label-11', name: 'Compositing', color: '#10B981' },
                            { id: 'label-12', name: 'Final', color: '#EF4444' }
                          ],
                          dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
                          createdAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                          updatedAt: new Date().toISOString(),
                          estimatedHours: 20,
                          comments: 0,
                          attachments: 0
                        }
                      ]}
                    />
                  </div>
                  <div style={{ marginTop: 'var(--space-3)' }}>
                    <h4 className="text-h4">Linear-Inspired Gantt Timeline Features:</h4>
                    <ul style={{ marginLeft: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                      <li><strong>Department Row Layout:</strong> Clean department rows (Animation, Modeling, Lighting, FX, Rigging, Compositing) with unified timeline header</li>
                      <li><strong>Advanced Filtering:</strong> Real-time search by task name, filter by department, user, or sequence with Linear-style controls</li>
                      <li><strong>Interactive Task Details:</strong> Click any task bar to view comprehensive information in 320px right sidebar panel</li>
                      <li><strong>Visual Department Grouping:</strong> Color-coded department rows with task counts and visual indicators</li>
                      <li><strong>Professional Design:</strong> Linear.com-inspired dark theme with clean typography and smooth interactions</li>
                      <li><strong>Task Progress Tracking:</strong> Visual progress bars, status badges, and priority indicators with hover effects</li>
                      <li><strong>Team Management:</strong> Assignee avatars, time estimates, and department-based organization</li>
                      <li><strong>Responsive Timeline:</strong> Maintains professional aesthetic with proper accessibility and keyboard navigation</li>
                    </ul>
                  </div>
                </div>
              </Stack>
            </Stack>
          </Card>

          {/* Template System Integration */}
          <Card variant="outlined" padding="lg">
            <Stack direction="vertical" gap="lg">
              <div>
                <h2 className="text-h2">Template System Integration</h2>
                <p className="text-body text-secondary">
                  All components are integrated with the template system for JSON-based configuration.
                </p>
              </div>

              <Stack direction="vertical" gap="md">
                <div>
                  <h3 className="text-h3">Widget Registry</h3>
                  <p className="text-body text-secondary">
                    Components are registered in the widget system and can be used in templates:
                  </p>
                  <pre className="text-mono" style={{
                    backgroundColor: 'var(--bg-surface-2)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-input)',
                    overflow: 'auto'
                  }}>
{`// Available widget types:
- dropdown, tabs, breadcrumbs
- avatar, progress, tooltip
- alert, modal, select
- checkbox, radio, switch, icon
- kanban, timeline-advanced`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-h3">Template System Integration</h3>
                  <p className="text-body text-secondary">
                    All components are integrated with the template system and can be used in JSON configurations:
                  </p>
                  <pre className="text-mono" style={{
                    backgroundColor: 'var(--bg-surface-2)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-input)',
                    overflow: 'auto'
                  }}>
{`// Basic Component
{
  "type": "dropdown",
  "componentProps": {
    "variant": "select",
    "size": "md"
  },
  "props": {
    "items": [...]
  }
}

// Kanban Widget
{
  "type": "kanban",
  "title": "Project Tasks",
  "props": {
    "showAddColumn": true,
    "showColumnActions": true,
    "maxHeight": "600px"
  }
}

// Timeline Widget
{
  "type": "timeline-advanced",
  "title": "Project Schedule",
  "props": {
    "viewMode": "weeks",
    "showToday": true,
    "zoomable": true,
    "height": "400px"
  }
}`}
                  </pre>
                </div>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </PageWrapper>
      <ScrollToTop />
    </>
  )
}

export default DesignSystemDemo
