// Wiki Components - Project-scoped documentation system

export { default as WikiPage } from './WikiPage'
export { default as WikiNavigation } from './WikiNavigation'
export { default as WikiPageEditor } from './WikiPageEditor'
export { default as TableEditor } from './TableEditor'
export { default as TableInsertModal } from './TableInsertModal'

// Re-export types for convenience
export type { WikiPage as WikiPageType, WikiHierarchy, WikiNavigation as WikiNavigationType } from '@/types/wiki'
