import React from 'react'
import ReactMarkdown from 'react-markdown'
import { clsx } from 'clsx'

export interface MarkdownRendererProps {
  content: string
  className?: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className 
}) => {
  return (
    <div className={clsx('markdown-content', className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-h1" style={{ marginBottom: 'var(--space-4)' }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-3)' }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-body" style={{ marginBottom: 'var(--space-3)' }}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul style={{ 
              marginBottom: 'var(--space-3)', 
              paddingLeft: 'var(--space-4)',
              listStyle: 'disc'
            }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ 
              marginBottom: 'var(--space-3)', 
              paddingLeft: 'var(--space-4)',
              listStyle: 'decimal'
            }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-body" style={{ marginBottom: 'var(--space-1)' }}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '4px solid var(--border-primary)',
              paddingLeft: 'var(--space-3)',
              marginLeft: '0',
              marginBottom: 'var(--space-3)',
              fontStyle: 'italic',
              color: 'var(--text-secondary)'
            }}>
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code style={{
                  backgroundColor: 'var(--bg-surface-2)',
                  padding: '2px 4px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875em',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {children}
                </code>
              )
            }
            return (
              <pre style={{
                backgroundColor: 'var(--bg-surface-2)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-input)',
                overflow: 'auto',
                marginBottom: 'var(--space-3)'
              }}>
                <code className="text-mono">{children}</code>
              </pre>
            )
          },
          a: ({ children, href }) => (
            <a 
              href={href}
              style={{ 
                color: 'var(--text-accent)',
                textDecoration: 'underline'
              }}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: '600' }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ fontStyle: 'italic' }}>{children}</em>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
