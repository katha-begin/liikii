import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'
import { processInternalLinks } from '@/utils/linkResolver'

export interface MarkdownRendererProps {
  content: string
  className?: string
  projectId?: string
  context?: {
    wikiPages?: any[]
    tasks?: any[]
  }
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
  projectId,
  context
}) => {
  const navigate = useNavigate()

  // Process internal links if projectId is provided
  const processedContent = projectId
    ? processInternalLinks(content, projectId, context)
    : content
  return (
    <div className={clsx('markdown-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
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
          a: ({ children, href }) => {
            const isExternal = href?.startsWith('http')
            const isInternal = href?.startsWith('/projects/')

            return (
              <a
                href={href}
                style={{
                  color: isInternal ? 'var(--text-accent)' : 'var(--text-accent)',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (isInternal && navigate) {
                    e.preventDefault()
                    navigate(href)
                  }
                }}
              >
                {children}
              </a>
            )
          },
          strong: ({ children }) => (
            <strong style={{ fontWeight: '600' }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ fontStyle: 'italic' }}>{children}</em>
          ),
          table: ({ children }) => (
            <div style={{
              overflowX: 'auto',
              marginBottom: 'var(--space-3)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-input)'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{
              backgroundColor: 'var(--bg-surface-2)'
            }}>
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody>{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr style={{
              borderBottom: '1px solid var(--border-primary)'
            }}>
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th style={{
              padding: 'var(--space-2) var(--space-3)',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--text-primary)',
              borderRight: '1px solid var(--border-primary)'
            }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{
              padding: 'var(--space-2) var(--space-3)',
              borderRight: '1px solid var(--border-primary)',
              color: 'var(--text-primary)'
            }}>
              {children}
            </td>
          )
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
