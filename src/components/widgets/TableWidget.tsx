import React from 'react'
import { Card } from '@/components/ui'
import { Stack } from '@/components/layout'
import { TableWidgetProps } from './index'

const TableWidget: React.FC<TableWidgetProps> = ({
  title = 'Table Widget',
  description,
  columns = [],
  data = [],
  className,
  style
}) => {
  return (
    <Card 
      variant="outlined" 
      padding="md" 
      className={`table-widget ${className || ''}`}
      style={style}
    >
      <Stack direction="vertical" gap="md">
        {title && (
          <div>
            <h3 className="text-h2">{title}</h3>
            {description && (
              <p className="text-body text-secondary">{description}</p>
            )}
          </div>
        )}

        <div className="table-container">
          <table className="widget-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} style={{ width: column.width }}>
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.id || index}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Stack>
    </Card>
  )
}

export default TableWidget
