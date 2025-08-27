import React, { useState } from 'react'
import { Plus, Search, Settings, Download, Heart, Calendar, Users, Filter, MoreHorizontal, TrendingUp, Clock, Mail, Bell } from 'lucide-react'
import { Button, Input, Card, Badge } from '@/components/ui'
import { PageWrapper, Grid, Stack, ScrollToTop } from '@/components/layout'

const DesignSystemDemo: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<string>('')
  const [dropdownValue, setDropdownValue] = useState<string>('option1')
  const [inputValue, setInputValue] = useState<string>('')

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
                    <li className="text-body">✅ "The dropdown looks wrong" → "Update the filter-select styling"</li>
                    <li className="text-body">✅ "The card needs more spacing" → "Change Card padding from 'md' to 'lg'"</li>
                    <li className="text-body">✅ "The badge color is incorrect" → "Change Badge variant from 'default' to 'success'"</li>
                  </ul>
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
