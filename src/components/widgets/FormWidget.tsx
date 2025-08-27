import React from 'react'
import { Card } from '@/components/ui'
import { FormWidgetProps } from './index'

const FormWidget: React.FC<FormWidgetProps> = ({ title, className, style }) => {
  return (
    <Card variant="outlined" padding="md" className={className} style={style}>
      <h3 className="text-h2">{title || 'Form Widget'}</h3>
      <p className="text-body text-secondary">Form widget placeholder</p>
    </Card>
  )
}

export default FormWidget
