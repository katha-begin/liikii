import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import { Stack } from '@/components/layout'
import { 
  TableData, 
  TablePosition, 
  updateCell, 
  insertRow, 
  insertColumn, 
  deleteRow, 
  deleteColumn,
  tableToMarkdown 
} from '@/utils/tableEditor'
import { 
  Plus, 
  Minus, 
  ChevronDown, 
  MoreVertical, 
  MoreHorizontal,
  Save,
  X
} from 'lucide-react'

export interface TableEditorProps {
  table: TableData
  onSave: (markdown: string) => void
  onCancel: () => void
}

interface ContextMenu {
  show: boolean
  x: number
  y: number
  type: 'row' | 'column'
  index: number
}

const TableEditor: React.FC<TableEditorProps> = ({
  table,
  onSave,
  onCancel
}) => {
  const [currentTable, setCurrentTable] = useState<TableData>(table)
  const [editingCell, setEditingCell] = useState<TablePosition | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ show: false, x: 0, y: 0, type: 'row', index: 0 })
  const [cellValues, setCellValues] = useState<Record<string, string>>({})
  
  const tableRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize cell values from table data
  useEffect(() => {
    const values: Record<string, string> = {}
    currentTable.rows.forEach((row, rowIndex) => {
      row.cells.forEach((cell, colIndex) => {
        values[`${rowIndex}-${colIndex}`] = cell.content
      })
    })
    setCellValues(values)
  }, [currentTable])

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu.show) {
        setContextMenu(prev => ({ ...prev, show: false }))
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [contextMenu.show])

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setEditingCell({ rowIndex, colIndex })
  }

  const handleCellChange = (value: string) => {
    if (!editingCell) return
    
    const key = `${editingCell.rowIndex}-${editingCell.colIndex}`
    setCellValues(prev => ({ ...prev, [key]: value }))
  }

  const handleCellBlur = () => {
    if (!editingCell) return
    
    const key = `${editingCell.rowIndex}-${editingCell.colIndex}`
    const value = cellValues[key] || ''
    
    const updatedTable = updateCell(currentTable, editingCell.rowIndex, editingCell.colIndex, value)
    setCurrentTable(updatedTable)
    setEditingCell(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      handleCellBlur()
      
      if (editingCell) {
        // Move to next cell
        const { rowIndex, colIndex } = editingCell
        const maxCols = currentTable.rows[0]?.cells.length || 0
        const maxRows = currentTable.rows.length
        
        let nextRow = rowIndex
        let nextCol = colIndex + 1
        
        if (nextCol >= maxCols) {
          nextCol = 0
          nextRow = rowIndex + 1
        }
        
        if (nextRow < maxRows) {
          setTimeout(() => setEditingCell({ rowIndex: nextRow, colIndex: nextCol }), 0)
        }
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null)
    }
  }

  const handleRowContextMenu = (e: React.MouseEvent, rowIndex: number) => {
    e.preventDefault()
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      type: 'row',
      index: rowIndex
    })
  }

  const handleColumnContextMenu = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault()
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      type: 'column',
      index: colIndex
    })
  }

  const handleContextMenuAction = (action: string) => {
    const { type, index } = contextMenu
    let updatedTable = currentTable

    switch (action) {
      case 'insert-above':
        if (type === 'row') {
          updatedTable = insertRow(currentTable, index, true)
        }
        break
      case 'insert-below':
        if (type === 'row') {
          updatedTable = insertRow(currentTable, index, false)
        }
        break
      case 'insert-left':
        if (type === 'column') {
          updatedTable = insertColumn(currentTable, index, true)
        }
        break
      case 'insert-right':
        if (type === 'column') {
          updatedTable = insertColumn(currentTable, index, false)
        }
        break
      case 'delete':
        if (type === 'row') {
          updatedTable = deleteRow(currentTable, index)
        } else {
          updatedTable = deleteColumn(currentTable, index)
        }
        break
    }

    setCurrentTable(updatedTable)
    setContextMenu(prev => ({ ...prev, show: false }))
  }

  const handleSave = () => {
    const markdown = tableToMarkdown(currentTable)
    onSave(markdown)
  }

  const getCellValue = (rowIndex: number, colIndex: number): string => {
    const key = `${rowIndex}-${colIndex}`
    return cellValues[key] ?? currentTable.rows[rowIndex]?.cells[colIndex]?.content ?? ''
  }

  return (
    <div style={{
      border: '1px solid var(--border-line)',
      borderRadius: 'var(--radius-input)',
      backgroundColor: 'var(--bg-surface-1)',
      padding: 'var(--space-3)'
    }}>
      {/* Header */}
      <Stack direction="horizontal" gap="md" align="center" justify="between" style={{ marginBottom: 'var(--space-3)' }}>
        <h3 className="text-h3">Table Editor</h3>
        <Stack direction="horizontal" gap="sm">
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save size={14} />
            Save Table
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={14} />
            Cancel
          </Button>
        </Stack>
      </Stack>

      {/* Table Container */}
      <div style={{
        overflowX: 'auto',
        border: '1px solid var(--border-line)',
        borderRadius: 'var(--radius-sm)'
      }}>
        <div ref={tableRef} style={{ minWidth: 'fit-content' }}>
          {/* Column Headers */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: `40px repeat(${currentTable.rows[0]?.cells.length || 0}, minmax(120px, 1fr))`,
            backgroundColor: 'var(--bg-surface-2)',
            borderBottom: '1px solid var(--border-line)'
          }}>
            <div style={{ padding: 'var(--space-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MoreVertical size={12} style={{ color: 'var(--text-secondary)' }} />
            </div>
            {currentTable.rows[0]?.cells.map((_, colIndex) => (
              <div
                key={colIndex}
                style={{
                  padding: 'var(--space-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: '1px solid var(--border-line)',
                  cursor: 'context-menu',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)'
                }}
                onContextMenu={(e) => handleColumnContextMenu(e, colIndex)}
              >
                {String.fromCharCode(65 + colIndex)}
                <MoreHorizontal size={10} style={{ marginLeft: 'var(--space-1)' }} />
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {currentTable.rows.map((row, rowIndex) => (
            <div
              key={row.id}
              style={{
                display: 'grid',
                gridTemplateColumns: `40px repeat(${row.cells.length}, minmax(120px, 1fr))`,
                borderBottom: rowIndex < currentTable.rows.length - 1 ? '1px solid var(--border-line)' : 'none'
              }}
            >
              {/* Row Header */}
              <div
                style={{
                  padding: 'var(--space-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-surface-2)',
                  borderRight: '1px solid var(--border-line)',
                  cursor: 'context-menu',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)'
                }}
                onContextMenu={(e) => handleRowContextMenu(e, rowIndex)}
              >
                {rowIndex + 1}
                <ChevronDown size={10} style={{ marginLeft: 'var(--space-1)' }} />
              </div>

              {/* Table Cells */}
              {row.cells.map((cell, colIndex) => {
                const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex
                const isHeader = rowIndex === 0
                const cellValue = getCellValue(rowIndex, colIndex)

                return (
                  <div
                    key={cell.id}
                    style={{
                      borderLeft: '1px solid var(--border-line)',
                      backgroundColor: isHeader ? 'var(--bg-surface-2)' : 'var(--bg-surface-1)',
                      position: 'relative'
                    }}
                  >
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={cellValue}
                        onChange={(e) => handleCellChange(e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleKeyDown}
                        style={{
                          width: '100%',
                          padding: 'var(--space-2)',
                          border: '2px solid var(--accent-blue)',
                          borderRadius: '0',
                          backgroundColor: 'var(--bg-surface-1)',
                          fontSize: '0.875rem',
                          fontWeight: isHeader ? '600' : '400'
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          padding: 'var(--space-2)',
                          minHeight: '36px',
                          cursor: 'text',
                          fontSize: '0.875rem',
                          fontWeight: isHeader ? '600' : '400',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {cellValue || (
                          <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            Click to edit
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'var(--bg-surface-1)',
            border: '1px solid var(--border-line)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: '160px'
          }}
        >
          {contextMenu.type === 'row' ? (
            <>
              <button
                className="context-menu-item"
                onClick={() => handleContextMenuAction('insert-above')}
                style={{
                  width: '100%',
                  padding: 'var(--space-2) var(--space-3)',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <Plus size={14} style={{ marginRight: 'var(--space-2)' }} />
                Insert Row Above
              </button>
              <button
                className="context-menu-item"
                onClick={() => handleContextMenuAction('insert-below')}
                style={{
                  width: '100%',
                  padding: 'var(--space-2) var(--space-3)',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <Plus size={14} style={{ marginRight: 'var(--space-2)' }} />
                Insert Row Below
              </button>
              {currentTable.rows.length > 1 && (
                <button
                  className="context-menu-item"
                  onClick={() => handleContextMenuAction('delete')}
                  style={{
                    width: '100%',
                    padding: 'var(--space-2) var(--space-3)',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'var(--text-danger)'
                  }}
                >
                  <Minus size={14} style={{ marginRight: 'var(--space-2)' }} />
                  Delete Row
                </button>
              )}
            </>
          ) : (
            <>
              <button
                className="context-menu-item"
                onClick={() => handleContextMenuAction('insert-left')}
                style={{
                  width: '100%',
                  padding: 'var(--space-2) var(--space-3)',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <Plus size={14} style={{ marginRight: 'var(--space-2)' }} />
                Insert Column Left
              </button>
              <button
                className="context-menu-item"
                onClick={() => handleContextMenuAction('insert-right')}
                style={{
                  width: '100%',
                  padding: 'var(--space-2) var(--space-3)',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <Plus size={14} style={{ marginRight: 'var(--space-2)' }} />
                Insert Column Right
              </button>
              {currentTable.rows[0]?.cells.length > 1 && (
                <button
                  className="context-menu-item"
                  onClick={() => handleContextMenuAction('delete')}
                  style={{
                    width: '100%',
                    padding: 'var(--space-2) var(--space-3)',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'var(--text-danger)'
                  }}
                >
                  <Minus size={14} style={{ marginRight: 'var(--space-2)' }} />
                  Delete Column
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default TableEditor
