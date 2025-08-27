import React from 'react'
import { Plus, Search, Settings, Download, Heart } from 'lucide-react'
import { Button, Input, Card, Badge } from '@/components/ui'
import { Container, Grid, Stack } from '@/components/layout'

const DesignSystemDemo: React.FC = () => {
  return (
    <Container size="lg" padding>
      <Stack direction="vertical" gap="xl">
        <h1 className="text-h1">Design System Components</h1>
      
        {/* Buttons */}
        <Card padding="lg">
          <Stack direction="vertical" gap="md">
            <h2 className="text-h2">Buttons</h2>
            <Stack direction="horizontal" gap="sm" wrap>
              <Button variant="primary" leftIcon={<Plus size={16} />}>Primary</Button>
              <Button variant="secondary" leftIcon={<Download size={16} />}>Secondary</Button>
              <Button variant="tertiary" leftIcon={<Settings size={16} />}>Tertiary</Button>
              <Button variant="ghost" leftIcon={<Heart size={16} />}>Ghost</Button>
            </Stack>
            <Stack direction="horizontal" gap="sm" wrap>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" loading>Loading</Button>
            </Stack>
          </Stack>
        </Card>

        {/* Inputs */}
        <Card padding="lg">
          <Stack direction="vertical" gap="md">
            <h2 className="text-h2">Inputs</h2>
            <div style={{ maxWidth: '400px' }}>
              <Stack direction="vertical" gap="md">
                <Input label="Default Input" placeholder="Enter text..." />
                <Input
                  label="With Icon"
                  placeholder="Search..."
                  leftIcon={<Search size={16} />}
                />
                <Input
                  variant="search"
                  placeholder="Search variant..."
                  leftIcon={<Search size={16} />}
                />
                <Input
                  label="Error State"
                  placeholder="Invalid input"
                  error="This field is required"
                />
              </Stack>
            </div>
          </Stack>
        </Card>

        {/* Badges */}
        <Card padding="lg">
          <Stack direction="vertical" gap="md">
            <h2 className="text-h2">Badges</h2>
            <Stack direction="horizontal" gap="xs" wrap>
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </Stack>
            <Stack direction="horizontal" gap="xs" wrap>
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge variant="primary" removable onRemove={() => alert('Removed!')}>
                Removable
              </Badge>
            </Stack>
          </Stack>
        </Card>

        {/* Cards & Layout */}
        <Stack direction="vertical" gap="md">
          <h2 className="text-h2">Cards & Layout Components</h2>
          <Grid cols={3} gap="md" responsive>
            <Card variant="default" padding="md">
              <Stack direction="vertical" gap="sm">
                <h3 className="text-h2">Default Card</h3>
                <p className="text-body text-secondary">
                  Basic card with default styling
                </p>
              </Stack>
            </Card>

            <Card variant="elevated" padding="md">
              <Stack direction="vertical" gap="sm">
                <h3 className="text-h2">Elevated Card</h3>
                <p className="text-body text-secondary">
                  Card with shadow elevation
                </p>
              </Stack>
            </Card>

            <Card variant="outlined" padding="md">
              <Stack direction="vertical" gap="sm">
                <h3 className="text-h2">Outlined Card</h3>
                <p className="text-body text-secondary">
                  Card with border outline
                </p>
              </Stack>
            </Card>
          </Grid>
        </Stack>
      </Stack>
    </Container>
  )
}

export default DesignSystemDemo
