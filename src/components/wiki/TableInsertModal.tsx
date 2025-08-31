import React, { useState } from 'react'
import { Button, Input, Modal } from '@/components/ui'
import { Stack } from '@/components/layout'
import { createEmptyTable, tableToMarkdown } from '@/utils/tableEditor'
import { Grid, Plus, X } from 'lucide-react'

export interface TableInsertModalProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (markdown: string) => void
}

const TableInsertModal: React.FC<TableInsertModalProps> = ({
  isOpen,
  onClose,
  onInsert
}) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)

  const handleInsert = () => {
    if (rows < 1 || cols < 1) {
      alert('Table must have at least 1 row and 1 column')
      return
    }

    if (rows > 20 || cols > 10) {
      alert('Table size is too large. Maximum 20 rows and 10 columns.')
      return
    }

    const table = createEmptyTable(rows, cols)
    const markdown = tableToMarkdown(table)
    onInsert(markdown)
    onClose()
    
    // Reset to defaults
    setRows(3)
    setCols(3)
  }

  const handleCancel = () => {
    onClose()
    // Reset to defaults
    setRows(3)
    setCols(3)
  }

  // Generate preview grid
  const previewGrid = Array.from({ length: Math.min(rows, 8) }, (_, rowIndex) =>
    Array.from({ length: Math.min(cols, 8) }, (_, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      isHeader: rowIndex === 0
    }))
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Insert Table"
      size="md"
    >
      <Stack direction="vertical" gap="lg">
        {/* Size Controls */}
        <Stack direction="horizontal" gap="lg" align="center">
          <div style={{ flex: 1 }}>
            <label className="text-body font-medium" style={{ marginBottom: 'var(--space-1)', display: 'block' }}>
              Rows
            </label>
            <Input
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => setRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <label className="text-body font-medium" style={{ marginBottom: 'var(--space-1)', display: 'block' }}>
              Columns
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              value={cols}
              onChange={(e) => setCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              style={{ width: '100%' }}
            />
          </div>
        </Stack>

        {/* Preview */}
        <div>
          <label className="text-body font-medium" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>
            Preview
          </label>
          <div style={{
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-input)',
            padding: 'var(--space-3)',
            backgroundColor: 'var(--bg-surface)',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(cols, 8)}, 1fr)`,
              gap: '1px',
              backgroundColor: 'var(--border-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              minWidth: 'fit-content'
            }}>
              {previewGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      backgroundColor: cell.isHeader ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                      padding: 'var(--space-1) var(--space-2)',
                      minHeight: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      fontWeight: cell.isHeader ? '600' : '400'
                    }}
                  >
                    {cell.isHeader ? `Header ${colIndex + 1}` : `Cell ${rowIndex},${colIndex + 1}`}
                  </div>
                ))
              )}
            </div>
            
            {(rows > 8 || cols > 8) && (
              <p className="text-caption text-secondary" style={{ marginTop: 'var(--space-2)' }}>
                Preview shows first {Math.min(rows, 8)} rows and {Math.min(cols, 8)} columns
              </p>
            )}
          </div>
        </div>

        {/* Quick Size Buttons */}
        <div>
          <label className="text-body font-medium" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>
            Quick Sizes
          </label>
          <Stack direction="horizontal" gap="sm" wrap>
            {[
              { rows: 2, cols: 2, label: '2×2' },
              { rows: 3, cols: 3, label: '3×3' },
              { rows: 4, cols: 3, label: '4×3' },
              { rows: 5, cols: 4, label: '5×4' },
              { rows: 3, cols: 5, label: '3×5' }
            ].map(({ rows: r, cols: c, label }) => (
              <Button
                key={label}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRows(r)
                  setCols(c)
                }}
                style={{
                  backgroundColor: rows === r && cols === c ? 'var(--bg-accent)' : 'transparent'
                }}
              >
                <Grid size={12} />
                {label}
              </Button>
            ))}
          </Stack>
        </div>

        {/* Actions */}
        <Stack direction="horizontal" gap="sm" justify="end">
          <Button
            variant="ghost"
            onClick={handleCancel}
          >
            <X size={14} />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleInsert}
          >
            <Plus size={14} />
            Insert Table
          </Button>
        </Stack>
      </Stack>
    </Modal>
  )
}

export default TableInsertModal
