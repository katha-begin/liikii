import React, { useState, useRef } from 'react'
import { X, Send, UserPlus, Paperclip, Link } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { Stack } from '@/components/layout'
import { Message, EnhancedNotification } from '@/types/database'
import './MessageComposer.css'

interface MessageComposerProps {
  isOpen: boolean
  onClose: () => void
  onSend: (message: Omit<Message, 'id' | 'createdAt'>) => Promise<void>
  replyTo?: EnhancedNotification
  relatedTaskId?: string
  relatedProjectId?: string
  className?: string
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  isOpen,
  onClose,
  onSend,
  replyTo,
  relatedTaskId,
  relatedProjectId,
  className
}) => {
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.title}` : '')
  const [content, setContent] = useState('')
  const [toUsers, setToUsers] = useState<string[]>([])
  const [ccUsers, setCcUsers] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [showCc, setShowCc] = useState(false)
  
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    if (!subject.trim() || !content.trim() || toUsers.length === 0) {
      return
    }

    setIsSending(true)
    try {
      const message: Omit<Message, 'id' | 'createdAt'> = {
        type: replyTo ? 'reply' : 'direct',
        subject: subject.trim(),
        content: content.trim(),
        fromUserId: 'current_user',
        fromUserName: 'Current User',
        toUserIds: toUsers,
        toUserNames: toUsers, // In real app, resolve user names
        ccUserIds: ccUsers.length > 0 ? ccUsers : undefined,
        ccUserNames: ccUsers.length > 0 ? ccUsers : undefined, // In real app, resolve user names
        relatedTaskId,
        relatedProjectId,
        isRead: false,
        parentMessageId: replyTo?.id,
        threadId: replyTo?.id || undefined,
        metadata: {
          priority: 'medium',
          category: replyTo ? 'reply' : 'direct'
        }
      }

      await onSend(message)
      handleClose()
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    setSubject(replyTo ? `Re: ${replyTo.title}` : '')
    setContent('')
    setToUsers([])
    setCcUsers([])
    setShowCc(false)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend()
    }
  }

  const addToUser = (userId: string) => {
    if (!toUsers.includes(userId)) {
      setToUsers([...toUsers, userId])
    }
  }

  const removeToUser = (userId: string) => {
    setToUsers(toUsers.filter(id => id !== userId))
  }

  const addCcUser = (userId: string) => {
    if (!ccUsers.includes(userId)) {
      setCcUsers([...ccUsers, userId])
    }
  }

  const removeCcUser = (userId: string) => {
    setCcUsers(ccUsers.filter(id => id !== userId))
  }

  if (!isOpen) return null

  return (
    <>
      <div className="message-composer-backdrop" onClick={handleClose} />
      <div className={`message-composer-modal ${className || ''}`} onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="composer-header">
          <h2 className="composer-title">
            {replyTo ? 'Reply to Message' : 'Compose Message'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<X size={16} />}
            onClick={handleClose}
            className="composer-close"
          />
        </div>

        {/* Form */}
        <div className="composer-form">
          {/* To Field */}
          <div className="composer-field">
            <label className="field-label">To:</label>
            <div className="recipient-input">
              <Input
                placeholder="Enter usernames or email addresses..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    addToUser(e.currentTarget.value.trim())
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<UserPlus size={14} />}
                onClick={() => setShowCc(!showCc)}
                className="add-cc-btn"
                title="Add CC"
              />
            </div>
            {toUsers.length > 0 && (
              <div className="recipient-chips">
                {toUsers.map((userId) => (
                  <div key={userId} className="recipient-chip">
                    {userId}
                    <button onClick={() => removeToUser(userId)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CC Field */}
          {showCc && (
            <div className="composer-field">
              <label className="field-label">CC:</label>
              <Input
                placeholder="Add CC recipients..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    addCcUser(e.currentTarget.value.trim())
                    e.currentTarget.value = ''
                  }
                }}
              />
              {ccUsers.length > 0 && (
                <div className="recipient-chips">
                  {ccUsers.map((userId) => (
                    <div key={userId} className="recipient-chip">
                      {userId}
                      <button onClick={() => removeCcUser(userId)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subject Field */}
          <div className="composer-field">
            <label className="field-label">Subject:</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
            />
          </div>

          {/* Content Field */}
          <div className="composer-field">
            <label className="field-label">Message:</label>
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              className="composer-textarea"
              rows={8}
            />
          </div>

          {/* Context Info */}
          {(relatedTaskId || relatedProjectId || replyTo) && (
            <div className="composer-context">
              {replyTo && (
                <div className="context-item">
                  <span className="context-label">Replying to:</span>
                  <span className="context-value">{replyTo.title}</span>
                </div>
              )}
              {relatedTaskId && (
                <div className="context-item">
                  <span className="context-label">Related to task:</span>
                  <span className="context-value">{relatedTaskId}</span>
                </div>
              )}
              {relatedProjectId && (
                <div className="context-item">
                  <span className="context-label">Project:</span>
                  <span className="context-value">{relatedProjectId}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="composer-footer">
          <Stack direction="horizontal" justify="between" align="center">
            <div className="composer-tools">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Paperclip size={14} />}
                className="tool-btn"
                title="Attach file"
              >
                Attach
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Link size={14} />}
                className="tool-btn"
                title="Add link"
              >
                Link
              </Button>
            </div>

            <Stack direction="horizontal" gap="sm">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Send size={16} />}
                onClick={handleSend}
                disabled={!subject.trim() || !content.trim() || toUsers.length === 0 || isSending}
                loading={isSending}
              >
                {replyTo ? 'Reply' : 'Send'}
              </Button>
            </Stack>
          </Stack>
        </div>
      </div>
    </>
  )
}

export default MessageComposer
