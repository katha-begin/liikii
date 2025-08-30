// Internal Link Resolution Utilities

export interface InternalLink {
  type: 'wiki' | 'task' | 'shot' | 'sequence' | 'episode'
  id: string
  display?: string
  project?: string
}

export interface ResolvedLink {
  href: string
  title: string
  type: InternalLink['type']
  exists: boolean
}

/**
 * Parse internal link syntax from markdown
 * Supported formats:
 * - [[wiki:page-id]] or [[wiki:page-id|Display Text]]
 * - [[task:task-id]] or [[task:task-id|Display Text]]
 * - [[shot:episode_sequence_shot]] or [[shot:episode_sequence_shot|Display Text]]
 * - [[sequence:episode_sequence]] or [[sequence:episode_sequence|Display Text]]
 * - [[episode:episode-id]] or [[episode:episode-id|Display Text]]
 */
export function parseInternalLink(linkText: string): InternalLink | null {
  // Remove the [[ ]] brackets
  const content = linkText.replace(/^\[\[|\]\]$/g, '').trim()
  
  // Split by | to separate ID from display text
  const [idPart, displayPart] = content.split('|').map(s => s.trim())
  
  // Split by : to separate type from ID
  const [type, id] = idPart.split(':').map(s => s.trim())
  
  if (!type || !id) {
    return null
  }
  
  const validTypes = ['wiki', 'task', 'shot', 'sequence', 'episode']
  if (!validTypes.includes(type)) {
    return null
  }
  
  return {
    type: type as InternalLink['type'],
    id,
    display: displayPart || null
  }
}

/**
 * Resolve internal link to actual navigation target
 */
export function resolveInternalLink(
  link: InternalLink, 
  projectId: string,
  context?: {
    wikiPages?: any[]
    tasks?: any[]
  }
): ResolvedLink {
  const { type, id, display } = link
  
  switch (type) {
    case 'wiki':
      const wikiPage = context?.wikiPages?.find(page => page._id === id || page.slug === id)
      return {
        href: `/projects/${projectId}/wiki/${id}`,
        title: display || wikiPage?.title || `Wiki: ${id}`,
        type: 'wiki',
        exists: !!wikiPage
      }
      
    case 'task':
      const task = context?.tasks?.find(t => t.id === id || t._id === id)
      return {
        href: `/projects/${projectId}/tasks/${id}`,
        title: display || task?.title || `Task: ${id}`,
        type: 'task',
        exists: !!task
      }
      
    case 'shot':
      // Shot format: episode_sequence_shot (e.g., ep00_sq0010_sh0020)
      const shotParts = id.toLowerCase().split('_')
      if (shotParts.length >= 3) {
        const [episode, sequence, shot] = shotParts
        return {
          href: `/projects/${projectId}/shots/${episode}/${sequence}/${shot}`,
          title: display || `${episode.toUpperCase()} ${sequence.toUpperCase()} ${shot.toUpperCase()}`,
          type: 'shot',
          exists: true // Assume shots exist if properly formatted
        }
      }
      return {
        href: `/projects/${projectId}/shots/${id}`,
        title: display || `Shot: ${id}`,
        type: 'shot',
        exists: false
      }
      
    case 'sequence':
      // Sequence format: episode_sequence (e.g., ep00_sq0010)
      const seqParts = id.toLowerCase().split('_')
      if (seqParts.length >= 2) {
        const [episode, sequence] = seqParts
        return {
          href: `/projects/${projectId}/sequences/${episode}/${sequence}`,
          title: display || `${episode.toUpperCase()} ${sequence.toUpperCase()}`,
          type: 'sequence',
          exists: true // Assume sequences exist if properly formatted
        }
      }
      return {
        href: `/projects/${projectId}/sequences/${id}`,
        title: display || `Sequence: ${id}`,
        type: 'sequence',
        exists: false
      }
      
    case 'episode':
      return {
        href: `/projects/${projectId}/episodes/${id}`,
        title: display || `Episode: ${id.toUpperCase()}`,
        type: 'episode',
        exists: true // Assume episodes exist
      }
      
    default:
      return {
        href: '#',
        title: display || id,
        type,
        exists: false
      }
  }
}

/**
 * Replace internal links in markdown content with proper link syntax
 */
export function processInternalLinks(
  content: string, 
  projectId: string,
  context?: {
    wikiPages?: any[]
    tasks?: any[]
  }
): string {
  // Find all [[...]] patterns
  const linkPattern = /\[\[([^\]]+)\]\]/g
  
  return content.replace(linkPattern, (match, linkContent) => {
    const internalLink = parseInternalLink(match)
    if (!internalLink) {
      return match // Return original if parsing fails
    }
    
    const resolved = resolveInternalLink(internalLink, projectId, context)
    
    // Convert to markdown link format
    return `[${resolved.title}](${resolved.href})`
  })
}

/**
 * Extract all internal links from content for validation
 */
export function extractInternalLinks(content: string): InternalLink[] {
  const linkPattern = /\[\[([^\]]+)\]\]/g
  const links: InternalLink[] = []
  let match
  
  while ((match = linkPattern.exec(content)) !== null) {
    const internalLink = parseInternalLink(match[0])
    if (internalLink) {
      links.push(internalLink)
    }
  }
  
  return links
}
