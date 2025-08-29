import { IconLibraryConfig, IconCategory, DCCIconMapping, CustomIcon } from '@/types/designSystem'

// Icon categories for systematic organization
export const ICON_CATEGORIES: IconCategory[] = [
  {
    id: 'navigation',
    name: 'Navigation',
    description: 'Icons for navigation and wayfinding',
    icons: [
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronDown',
      'Home', 'Menu', 'X', 'MoreHorizontal', 'MoreVertical',
      'ExternalLink', 'Link', 'Unlink'
    ]
  },
  {
    id: 'actions',
    name: 'Actions',
    description: 'Icons for user actions and interactions',
    icons: [
      'Plus', 'Minus', 'Edit', 'Trash2', 'Copy', 'Clipboard',
      'Save', 'Download', 'Upload', 'Share', 'Send',
      'Play', 'Pause', 'Stop', 'SkipForward', 'SkipBack',
      'RefreshCw', 'RotateCcw', 'RotateCw', 'Maximize', 'Minimize'
    ]
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Icons for messaging and communication',
    icons: [
      'Mail', 'MessageCircle', 'MessageSquare', 'Phone', 'PhoneCall',
      'Video', 'Mic', 'MicOff', 'Bell', 'BellOff',
      'Users', 'User', 'UserPlus', 'UserMinus', 'UserCheck'
    ]
  },
  {
    id: 'files',
    name: 'Files & Documents',
    description: 'Icons for file management and documents',
    icons: [
      'File', 'FileText', 'Folder', 'FolderOpen', 'FolderPlus',
      'Image', 'Video', 'Music', 'Archive', 'Database',
      'HardDrive', 'Cloud', 'CloudDownload', 'CloudUpload'
    ]
  },
  {
    id: 'status',
    name: 'Status & Feedback',
    description: 'Icons for status indicators and feedback',
    icons: [
      'Check', 'CheckCircle', 'X', 'XCircle', 'AlertCircle',
      'AlertTriangle', 'Info', 'HelpCircle', 'Clock',
      'Loader', 'Zap', 'Star', 'Heart', 'ThumbsUp', 'ThumbsDown'
    ]
  },
  {
    id: 'settings',
    name: 'Settings & Configuration',
    description: 'Icons for settings and configuration',
    icons: [
      'Settings', 'Sliders', 'Filter', 'Search', 'Eye', 'EyeOff',
      'Lock', 'Unlock', 'Key', 'Shield', 'ShieldCheck',
      'Tool', 'Wrench', 'Cog', 'Palette', 'Monitor'
    ]
  },
  {
    id: 'dcc',
    name: 'DCC Applications',
    description: 'Icons specific to Digital Content Creation applications',
    icons: [
      'Box', 'Layers', 'Grid3x3', 'Move3d', 'RotateCcw',
      'Zap', 'Aperture', 'Camera', 'Film', 'Scissors',
      'Paintbrush', 'Pen', 'Brush', 'Pipette', 'Ruler'
    ]
  }
]

// DCC application icon mappings
export const DCC_ICON_MAPPINGS: DCCIconMapping[] = [
  {
    application: 'maya',
    icons: {
      'create_polygon': 'Box',
      'create_nurbs': 'Circle',
      'create_curve': 'Pen',
      'select': 'MousePointer',
      'move': 'Move',
      'rotate': 'RotateCcw',
      'scale': 'Maximize2',
      'extrude': 'ArrowUp',
      'bevel': 'Layers',
      'smooth': 'Waves',
      'render': 'Camera',
      'playblast': 'Video',
      'timeline': 'Clock',
      'outliner': 'List',
      'attribute_editor': 'Settings',
      'channel_box': 'Sliders',
      'hypergraph': 'GitBranch',
      'script_editor': 'Code',
      'shelf': 'Bookmark'
    }
  },
  {
    application: 'blender',
    icons: {
      'add_mesh': 'Plus',
      'add_curve': 'Pen',
      'add_surface': 'Layers',
      'select_box': 'Square',
      'select_circle': 'Circle',
      'select_lasso': 'Lasso',
      'grab': 'Move',
      'rotate': 'RotateCcw',
      'scale': 'Maximize2',
      'extrude': 'ArrowUp',
      'inset': 'Minus',
      'bevel': 'Layers',
      'knife': 'Scissors',
      'loop_cut': 'Slice',
      'render': 'Camera',
      'animation': 'Play',
      'compositor': 'Layers',
      'shader_editor': 'Palette',
      'outliner': 'List'
    }
  },
  {
    application: 'houdini',
    icons: {
      'geometry': 'Box',
      'sop': 'Layers',
      'dop': 'Zap',
      'vop': 'GitBranch',
      'cop': 'Image',
      'rop': 'Camera',
      'transform': 'Move',
      'subdivide': 'Grid3x3',
      'scatter': 'Sparkles',
      'copy': 'Copy',
      'merge': 'GitMerge',
      'switch': 'ToggleLeft',
      'null': 'Circle',
      'output': 'ArrowRight',
      'network_view': 'GitBranch',
      'parameter_pane': 'Sliders',
      'scene_view': 'Eye',
      'render_view': 'Camera'
    }
  },
  {
    application: 'nuke',
    icons: {
      'read': 'FileText',
      'write': 'Save',
      'viewer': 'Eye',
      'merge': 'GitMerge',
      'transform': 'Move',
      'blur': 'Waves',
      'grade': 'Sliders',
      'colorCorrect': 'Palette',
      'roto': 'Pen',
      'rotoPaint': 'Paintbrush',
      'tracker': 'Target',
      'cornerPin': 'Move3d',
      'timeOffset': 'Clock',
      'frameHold': 'Pause',
      'switch': 'ToggleLeft',
      'dot': 'Circle',
      'backdrop': 'Square',
      'sticky_note': 'StickyNote'
    }
  },
  {
    application: 'substance_painter',
    icons: {
      'paint': 'Paintbrush',
      'erase': 'Eraser',
      'fill': 'PaintBucket',
      'clone': 'Copy',
      'smudge': 'Waves',
      'projection': 'Camera',
      'material': 'Layers',
      'mask': 'Eye',
      'layer': 'Layers',
      'folder': 'Folder',
      'bake': 'Zap',
      'export': 'Download',
      'viewport': 'Monitor',
      'shelf': 'Grid3x3'
    }
  }
]

// Custom icons for specific VFX workflows
export const CUSTOM_ICONS: CustomIcon[] = [
  {
    name: 'RenderQueue',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/><circle cx="7" cy="6" r="1" fill="currentColor"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="7" cy="18" r="1" fill="currentColor"/></svg>',
    category: 'dcc',
    keywords: ['render', 'queue', 'batch', 'processing']
  },
  {
    name: 'VersionControl',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/><path d="m15.5 3.5-3 3 3 3"/><path d="m8.5 20.5 3-3-3-3"/></svg>',
    category: 'files',
    keywords: ['version', 'control', 'git', 'history']
  },
  {
    name: 'Dailies',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
    category: 'communication',
    keywords: ['dailies', 'review', 'screening', 'playback']
  }
]

// Icon library configuration
export const ICON_LIBRARY_CONFIG: IconLibraryConfig = {
  categories: ICON_CATEGORIES,
  dccIntegrations: DCC_ICON_MAPPINGS,
  customIcons: CUSTOM_ICONS
}

// Utility functions for icon management
export class IconLibrary {
  private static instance: IconLibrary
  private config: IconLibraryConfig

  private constructor() {
    this.config = ICON_LIBRARY_CONFIG
  }

  static getInstance(): IconLibrary {
    if (!IconLibrary.instance) {
      IconLibrary.instance = new IconLibrary()
    }
    return IconLibrary.instance
  }

  // Get all icons in a category
  getIconsByCategory(categoryId: string): string[] {
    const category = this.config.categories.find(cat => cat.id === categoryId)
    return category?.icons || []
  }

  // Get DCC-specific icon mapping
  getDCCIcon(application: string, action: string): string | undefined {
    const mapping = this.config.dccIntegrations.find(dcc => dcc.application === application)
    return mapping?.icons[action]
  }

  // Search icons by keyword
  searchIcons(query: string): string[] {
    const results: string[] = []
    
    // Search in category icons
    this.config.categories.forEach(category => {
      category.icons.forEach(icon => {
        if (icon.toLowerCase().includes(query.toLowerCase())) {
          results.push(icon)
        }
      })
    })

    // Search in custom icons
    this.config.customIcons.forEach(customIcon => {
      if (customIcon.keywords.some(keyword => 
        keyword.toLowerCase().includes(query.toLowerCase())
      )) {
        results.push(customIcon.name)
      }
    })

    return [...new Set(results)] // Remove duplicates
  }

  // Get all available icons
  getAllIcons(): string[] {
    const allIcons: string[] = []
    
    this.config.categories.forEach(category => {
      allIcons.push(...category.icons)
    })
    
    this.config.customIcons.forEach(customIcon => {
      allIcons.push(customIcon.name)
    })

    return [...new Set(allIcons)]
  }
}

export default IconLibrary
