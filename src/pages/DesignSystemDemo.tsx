import React from 'react'
import { Plus, Search, Settings, Download, Heart } from 'lucide-react'
import { Button, Input, Card, Badge } from '@/components/ui'

const DesignSystemDemo: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
      <h1 className="text-h1" style={{ marginBottom: '32px' }}>Design System Components</h1>
      
      {/* Buttons */}
      <Card padding="lg" style={{ marginBottom: '24px' }}>
        <h2 className="text-h2" style={{ marginBottom: '16px' }}>Buttons</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Button variant="primary" leftIcon={<Plus size={16} />}>Primary</Button>
          <Button variant="secondary" leftIcon={<Download size={16} />}>Secondary</Button>
          <Button variant="tertiary" leftIcon={<Settings size={16} />}>Tertiary</Button>
          <Button variant="ghost" leftIcon={<Heart size={16} />}>Ghost</Button>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" loading>Loading</Button>
        </div>
      </Card>

      {/* Inputs */}
      <Card padding="lg" style={{ marginBottom: '24px' }}>
        <h2 className="text-h2" style={{ marginBottom: '16px' }}>Inputs</h2>
        <div style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
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
        </div>
      </Card>

      {/* Badges */}
      <Card padding="lg" style={{ marginBottom: '24px' }}>
        <h2 className="text-h2" style={{ marginBottom: '16px' }}>Badges</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge variant="primary" removable onRemove={() => alert('Removed!')}>
            Removable
          </Badge>
        </div>
      </Card>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <Card variant="default" padding="md">
          <h3 className="text-h2">Default Card</h3>
          <p className="text-body" style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
            Basic card with default styling
          </p>
        </Card>
        
        <Card variant="elevated" padding="md">
          <h3 className="text-h2">Elevated Card</h3>
          <p className="text-body" style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
            Card with shadow elevation
          </p>
        </Card>
        
        <Card variant="outlined" padding="md">
          <h3 className="text-h2">Outlined Card</h3>
          <p className="text-body" style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
            Card with border outline
          </p>
        </Card>
      </div>
    </div>
  )
}

export default DesignSystemDemo
