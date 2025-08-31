// Wiki System Types - Project-scoped documentation

export interface WikiPage {
  _id: string
  project: string // Links to project_configs._id
  title: string
  hierarchy: {
    department: string
    episode: string
    topic: string
  }
  content: string // Markdown content
  slug: string
  created_at: string
  updated_at: string
  created_by: string
  tags: string[]
}

export interface WikiHierarchy {
  department: string
  episodes: {
    episode: string
    topics: {
      topic: string
      pageId: string
      title: string
    }[]
  }[]
}

export interface WikiNavigation {
  projectId: string
  hierarchy: WikiHierarchy[]
}

// Widget props for wiki components
export interface WikiWidgetProps {
  id: string
  title?: string
  projectId: string
  className?: string
  style?: React.CSSProperties
}

export interface WikiPageEditorProps {
  page?: WikiPage
  projectId: string
  onSave: (page: Omit<WikiPage, '_id'>) => Promise<void>
  onCancel: () => void
}

export interface WikiNavigationProps {
  projectId: string
  currentPageId?: string
  onPageSelect: (pageId: string) => void
  onCreatePage: (hierarchy: WikiPage['hierarchy']) => void
}

export interface MarkdownRendererProps {
  content: string
  className?: string
}
