// Table Editor Utilities for Interactive Table Editing

export interface TableCell {
  content: string
  id: string
}

export interface TableRow {
  id: string
  cells: TableCell[]
}

export interface TableData {
  id: string
  rows: TableRow[]
  headers: string[]
}

export interface TablePosition {
  rowIndex: number
  colIndex: number
}

/**
 * Generate unique ID for table elements
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Create a new empty table with specified dimensions
 */
export function createEmptyTable(rows: number, cols: number): TableData {
  const headers = Array.from({ length: cols }, (_, i) => `Header ${i + 1}`)
  
  const tableRows: TableRow[] = []
  
  // Create header row
  const headerRow: TableRow = {
    id: generateId(),
    cells: headers.map(header => ({
      id: generateId(),
      content: header
    }))
  }
  tableRows.push(headerRow)
  
  // Create data rows
  for (let i = 0; i < rows - 1; i++) {
    const row: TableRow = {
      id: generateId(),
      cells: Array.from({ length: cols }, () => ({
        id: generateId(),
        content: ''
      }))
    }
    tableRows.push(row)
  }
  
  return {
    id: generateId(),
    rows: tableRows,
    headers
  }
}

/**
 * Parse markdown table into TableData structure
 */
export function parseMarkdownTable(markdown: string): TableData | null {
  const lines = markdown.trim().split('\n')
  if (lines.length < 2) return null
  
  // Parse header row
  const headerLine = lines[0].trim()
  if (!headerLine.startsWith('|') || !headerLine.endsWith('|')) return null
  
  const headers = headerLine
    .slice(1, -1)
    .split('|')
    .map(cell => cell.trim())
  
  // Skip separator line (line 1)
  const dataLines = lines.slice(2)
  
  const rows: TableRow[] = []
  
  // Add header row
  const headerRow: TableRow = {
    id: generateId(),
    cells: headers.map(header => ({
      id: generateId(),
      content: header
    }))
  }
  rows.push(headerRow)
  
  // Parse data rows
  dataLines.forEach(line => {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      const cells = trimmedLine
        .slice(1, -1)
        .split('|')
        .map(cell => ({
          id: generateId(),
          content: cell.trim()
        }))
      
      rows.push({
        id: generateId(),
        cells
      })
    }
  })
  
  return {
    id: generateId(),
    rows,
    headers
  }
}

/**
 * Convert TableData back to markdown format
 */
export function tableToMarkdown(table: TableData): string {
  if (table.rows.length === 0) return ''
  
  const lines: string[] = []
  
  // Header row
  const headerRow = table.rows[0]
  const headerLine = '| ' + headerRow.cells.map(cell => cell.content).join(' | ') + ' |'
  lines.push(headerLine)
  
  // Separator line
  const separatorLine = '|' + headerRow.cells.map(() => '----------|').join('')
  lines.push(separatorLine)
  
  // Data rows
  table.rows.slice(1).forEach(row => {
    const rowLine = '| ' + row.cells.map(cell => cell.content).join(' | ') + ' |'
    lines.push(rowLine)
  })
  
  return lines.join('\n')
}

/**
 * Insert row at specified position
 */
export function insertRow(table: TableData, position: number, above: boolean = false): TableData {
  const insertIndex = above ? position : position + 1
  const colCount = table.rows[0]?.cells.length || 0
  
  const newRow: TableRow = {
    id: generateId(),
    cells: Array.from({ length: colCount }, () => ({
      id: generateId(),
      content: ''
    }))
  }
  
  const newRows = [...table.rows]
  newRows.splice(insertIndex, 0, newRow)
  
  return {
    ...table,
    rows: newRows
  }
}

/**
 * Insert column at specified position
 */
export function insertColumn(table: TableData, position: number, left: boolean = false): TableData {
  const insertIndex = left ? position : position + 1
  
  const newRows = table.rows.map(row => {
    const newCells = [...row.cells]
    newCells.splice(insertIndex, 0, {
      id: generateId(),
      content: ''
    })
    return {
      ...row,
      cells: newCells
    }
  })
  
  return {
    ...table,
    rows: newRows
  }
}

/**
 * Delete row at specified position
 */
export function deleteRow(table: TableData, position: number): TableData {
  if (table.rows.length <= 1) return table // Don't delete if only header remains
  
  const newRows = table.rows.filter((_, index) => index !== position)
  
  return {
    ...table,
    rows: newRows
  }
}

/**
 * Delete column at specified position
 */
export function deleteColumn(table: TableData, position: number): TableData {
  if (table.rows[0]?.cells.length <= 1) return table // Don't delete if only one column
  
  const newRows = table.rows.map(row => ({
    ...row,
    cells: row.cells.filter((_, index) => index !== position)
  }))
  
  return {
    ...table,
    rows: newRows
  }
}

/**
 * Update cell content
 */
export function updateCell(table: TableData, rowIndex: number, colIndex: number, content: string): TableData {
  const newRows = table.rows.map((row, rIndex) => {
    if (rIndex === rowIndex) {
      return {
        ...row,
        cells: row.cells.map((cell, cIndex) => {
          if (cIndex === colIndex) {
            return { ...cell, content }
          }
          return cell
        })
      }
    }
    return row
  })
  
  return {
    ...table,
    rows: newRows
  }
}
