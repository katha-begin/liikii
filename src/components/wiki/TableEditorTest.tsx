import React, { useState } from 'react'
import { Button } from '@/components/ui'
import TableEditor from './TableEditor'
import { createEmptyTable, tableToMarkdown } from '@/utils/tableEditor'

const TableEditorTest: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false)
  const [result, setResult] = useState('')

  const testTable = createEmptyTable(3, 3)

  const handleSave = (markdown: string) => {
    setResult(markdown)
    setShowEditor(false)
    console.log('Table saved:', markdown)
  }

  const handleCancel = () => {
    setShowEditor(false)
  }

  return (
    <div style={{ padding: 'var(--space-4)' }}>
      <h2>Table Editor Test</h2>
      
      <Button onClick={() => setShowEditor(true)}>
        Open Table Editor
      </Button>

      {result && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <h3>Result:</h3>
          <pre style={{ 
            backgroundColor: 'var(--bg-surface-2)', 
            padding: 'var(--space-3)', 
            borderRadius: 'var(--radius-input)',
            overflow: 'auto'
          }}>
            {result}
          </pre>
        </div>
      )}

      {showEditor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-1)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <TableEditor
              table={testTable}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TableEditorTest
