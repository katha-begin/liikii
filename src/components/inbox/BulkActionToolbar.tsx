import React, { useState } from 'react'
import { Check, Trash2, Archive, Mail, MailOpen, X, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui'
import { Stack } from '@/components/layout'
import { BulkOperation } from '@/types/database'
import './BulkActionToolbar.css'

interface BulkActionToolbarProps {
  selectedCount: number
  totalCount: number
  isOperationInProgress: boolean
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkOperation: (operation: BulkOperation) => void
  className?: string
}

const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
  selectedCount,
  totalCount,
  isOperationInProgress,
  onSelectAll,
  onClearSelection,
  onBulkOperation,
  className
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false)

  if (selectedCount === 0) {
    return null
  }

  const isAllSelected = selectedCount === totalCount

  const handleOperation = (operation: BulkOperation) => {
    onBulkOperation(operation)
    setShowMoreActions(false)
  }

  const primaryActions = [
    {
      id: 'markAsRead',
      label: 'Mark as read',
      icon: <MailOpen size={16} />,
      operation: 'markAsRead' as BulkOperation
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 size={16} />,
      operation: 'delete' as BulkOperation,
      variant: 'danger' as const
    }
  ]

  const secondaryActions = [
    {
      id: 'markAsUnread',
      label: 'Mark as unread',
      icon: <Mail size={16} />,
      operation: 'markAsUnread' as BulkOperation
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: <Archive size={16} />,
      operation: 'archive' as BulkOperation
    }
  ]

  return (
    <div className={`bulk-action-toolbar ${className || ''}`}>
      <div className="bulk-toolbar-content">
        {/* Selection Info */}
        <div className="selection-info">
          <span className="selection-count">
            {selectedCount} of {totalCount} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={isAllSelected ? onClearSelection : onSelectAll}
            className="select-all-btn"
          >
            {isAllSelected ? 'Deselect all' : 'Select all'}
          </Button>
        </div>

        {/* Actions */}
        <Stack direction="horizontal" gap="sm" align="center">
          {/* Primary Actions */}
          {primaryActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'secondary'}
              size="sm"
              leftIcon={action.icon}
              onClick={() => handleOperation(action.operation)}
              disabled={isOperationInProgress}
              className="bulk-action-btn"
            >
              {action.label}
            </Button>
          ))}

          {/* More Actions Dropdown */}
          <div className="more-actions-container">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<MoreHorizontal size={16} />}
              onClick={() => setShowMoreActions(!showMoreActions)}
              disabled={isOperationInProgress}
              className="more-actions-btn"
            >
              More
            </Button>

            {showMoreActions && (
              <>
                <div 
                  className="more-actions-backdrop"
                  onClick={() => setShowMoreActions(false)}
                />
                <div className="more-actions-dropdown">
                  {secondaryActions.map((action) => (
                    <button
                      key={action.id}
                      className="more-action-item"
                      onClick={() => handleOperation(action.operation)}
                      disabled={isOperationInProgress}
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<X size={16} />}
            onClick={onClearSelection}
            className="close-selection-btn"
            title="Clear selection"
          />
        </Stack>
      </div>

      {/* Loading Overlay */}
      {isOperationInProgress && (
        <div className="bulk-operation-loading">
          <div className="loading-spinner" />
          <span>Processing...</span>
        </div>
      )}
    </div>
  )
}

export default BulkActionToolbar
