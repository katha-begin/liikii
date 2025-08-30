import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import WikiPage from '../WikiPage'

// Mock the MarkdownRenderer since it uses react-markdown
jest.mock('@/components/ui/MarkdownRenderer', () => {
  return function MockMarkdownRenderer({ content }: { content: string }) {
    return <div data-testid="markdown-content">{content}</div>
  }
})

describe('WikiPage', () => {
  it('renders without crashing', () => {
    render(<WikiPage projectId="SWA" />)
    
    // Should show the wiki navigation
    expect(screen.getByText('Wiki Pages')).toBeInTheDocument()
    
    // Should show the new page button
    expect(screen.getByText('New Page')).toBeInTheDocument()
  })

  it('shows empty state when no pages exist', () => {
    render(<WikiPage projectId="EMPTY_PROJECT" />)
    
    expect(screen.getByText('No Wiki Pages Yet')).toBeInTheDocument()
    expect(screen.getByText('Create First Page')).toBeInTheDocument()
  })

  it('displays sample wiki pages for SWA project', () => {
    render(<WikiPage projectId="SWA" />)
    
    // Should show the sample pages in navigation
    expect(screen.getByText('Animation')).toBeInTheDocument()
    expect(screen.getByText('Lighting')).toBeInTheDocument()
  })
})
