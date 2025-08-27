// Task Comments - Comments system for task detail panel
import React, { useState, useEffect } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import { TaskComment } from '@/types/database'
import { mockDataService } from '@/services/MockDataService'
import './TaskComments.css'

interface TaskCommentsProps {
  taskId: string
}

export const TaskComments: React.FC<TaskCommentsProps> = ({ taskId }) => {
  const [comments, setComments] = useState<TaskComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load comments on mount and when taskId changes
  useEffect(() => {
    loadComments()
  }, [taskId])

  const loadComments = async () => {
    setIsLoading(true)
    try {
      const taskComments = await mockDataService.getTaskComments(taskId)
      setComments(taskComments)
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const comment = await mockDataService.addTaskComment(
        taskId,
        newComment.trim(),
        'user-current',
        'Current User'
      )
      setComments(prev => [...prev, comment])
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    } catch {
      return timestamp
    }
  }

  if (isLoading) {
    return (
      <div className="task-comments-loading">
        <div className="task-comments-spinner" />
        <span>Loading comments...</span>
      </div>
    )
  }

  return (
    <div className="task-comments">
      {/* Comments list */}
      <div className="task-comments-list">
        {comments.length === 0 ? (
          <div className="task-comments-empty">
            <MessageCircle size={24} />
            <p>No comments yet</p>
            <span>Be the first to add a comment</span>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="task-comment">
              <div className="task-comment-avatar">
                {comment.userAvatar ? (
                  <img src={comment.userAvatar} alt={comment.userName} />
                ) : (
                  <div className="task-comment-avatar-placeholder">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="task-comment-content">
                <div className="task-comment-header">
                  <span className="task-comment-author">{comment.userName}</span>
                  <span className="task-comment-timestamp">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                </div>
                <div className="task-comment-text">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add comment form */}
      <form className="task-comments-form" onSubmit={handleSubmitComment}>
        <div className="task-comments-input-container">
          <textarea
            className="task-comments-input"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="task-comments-submit"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <div className="task-comments-submit-spinner" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
