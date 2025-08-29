# Feature Request: Wiki System with Markdown and Media Support

## 🎯 Purpose & Goals
**Primary Goal**: Create a comprehensive wiki system that enables teams to create, organize, and collaborate on documentation with rich markdown editing, media attachments, and seamless integration with the existing VFX production workflow.

**User Value**: Provides a centralized knowledge base for project documentation, technical notes, meeting minutes, and process documentation with Notion-style editing experience and automatic media management.

**Business Impact**: Reduces time spent searching for project information by 70%, improves knowledge retention across teams, and creates a searchable repository of production knowledge that scales with project complexity.

**Success Metrics**:
- 90% of team members actively use wiki for project documentation within 30 days
- Average time to find project information reduced from 15 minutes to 2 minutes
- 80% reduction in duplicate documentation across different tools
- Zero data loss incidents with automatic S3 backup and versioning

## 👤 User Stories

**Primary User Story**:
As a VFX Supervisor, I want to create and maintain project documentation with rich markdown formatting and embedded images so that my team has a single source of truth for project requirements, references, and technical specifications.

**Secondary User Story**:
As a Technical Director, I want to document complex workflows with code blocks, diagrams, and step-by-step instructions so that junior artists can follow established procedures without constant supervision.

**Tertiary User Story**:
As a Producer, I want to create meeting notes with action items and embedded reference images so that all stakeholders have access to decisions and can track project evolution over time.

**Edge Case Story**:
As a Remote Artist, I want to access and contribute to project documentation offline so that connectivity issues don't prevent me from documenting important discoveries or accessing critical information.

### Acceptance Criteria
- [ ] Given I'm on any project page, when I click "Create Wiki Page", then I can start writing with a rich markdown editor
- [ ] Given I'm editing a wiki page, when I drag and drop an image, then it uploads to S3 and embeds automatically with proper CDN delivery
- [ ] Given I'm viewing a wiki page, when I switch to preview mode, then I see Notion-style rendered content with proper formatting and media
- [ ] Given I'm searching for information, when I use the wiki search, then I get relevant results from page content, titles, and tags
- [ ] Given I'm working offline, when I create or edit wiki content, then changes are saved locally and sync when connection is restored

## 🔄 User Workflow

### Happy Path
1. **Entry Point**: User navigates to project and clicks "Wiki" tab or uses global "Create Wiki Page" button
2. **Page Creation**: User selects from templates (Documentation, Meeting Notes, Technical Guide) or starts blank
3. **Content Creation**: User writes in markdown editor with live preview, uses toolbar for formatting shortcuts
4. **Media Addition**: User drags images directly into editor, system automatically uploads to S3 and inserts markdown links
5. **Organization**: User adds tags, sets category, and links to related pages or tasks
6. **Publishing**: User saves page, system generates searchable index and notifies relevant team members
7. **Success State**: Page is accessible via navigation, search, and direct links with proper permissions

### Error Scenarios
- **Upload failure**: Show retry dialog with "Image upload failed. Save as draft and retry?" option
- **Network interruption**: Auto-save to local storage with "Working offline - changes will sync when connected" indicator
- **Permission denied**: Show clear message "You don't have permission to edit this page" with request access option
- **Concurrent editing**: Show conflict resolution with "Another user is editing. View their changes or continue editing?" dialog

### Edge Cases
- **Large media files**: Show progress indicator and compress images over 5MB automatically
- **Broken links**: Highlight broken internal links with "Page not found - create it?" option
- **Version conflicts**: Provide side-by-side diff view for resolving conflicting edits
- **Template customization**: Allow users to save custom page templates for team-specific workflows

## 🎨 Design Requirements

### Visual Style
- **Design System**: Follows Linear-inspired clean interface with focus on content readability
- **Component Reuse**: Uses existing Button, Input, Card, Modal, Tabs components
- **New Components**: WikiEditor, WikiRenderer, WikiSidebar, MediaUploader, PageTemplateSelector
- **Color Scheme**: Neutral content focus with accent colors for interactive elements and syntax highlighting

### Layout & Placement
- **Primary Location**: New "Wiki" section in main navigation, accessible from all project contexts
- **Secondary Locations**: Wiki pages can be linked from tasks, embedded in project details, and accessed via global search
- **Navigation**: Hierarchical page tree in sidebar, breadcrumb navigation, and contextual page linking

### Responsive Behavior
- **Desktop**: Split-pane editor with live preview, collapsible sidebar navigation
- **Mobile**: Stacked editor with toggle between edit/preview modes, slide-out navigation
- **Tablet**: Adaptive layout with resizable panes and touch-optimized editing controls

### Accessibility
- **Keyboard Navigation**: Full keyboard support for editing, navigation, and media management
- **Screen Reader**: Proper ARIA labels for editor controls, content structure, and navigation
- **Color Contrast**: High contrast mode support, semantic color usage for syntax highlighting

## 🔧 Technical Requirements

### Data Integration
- **Data Sources**: Wiki pages stored in database with metadata, content in markdown format, media files in S3
- **Data Format**: WikiPage interface with title, content, metadata, tags, permissions, and version history
- **Data Volume**: Handle up to 10,000 pages per project with full-text search and media indexing
- **Real-time Updates**: WebSocket integration for collaborative editing indicators and live updates

### Performance Requirements
- **Response Time**: Page loading under 500ms, search results under 200ms, media upload progress indicators
- **Concurrent Users**: Support 50+ simultaneous editors with conflict resolution and auto-save
- **Data Loading**: Lazy loading for large pages, progressive image loading, and content pagination

### Integration Points
- **Existing Components**:
  - AppShell: Add wiki routes and navigation integration
  - ProjectDetailsPage: Add wiki tab and quick access to project documentation
  - TaskDetailPanel: Add wiki page linking and embedded documentation
  - DataContext: Extend with wiki data management and search capabilities

### State Management
- **New Context**: WikiContext for page management, editing state, and search functionality
- **Existing Context**: Extends DataContext with wiki-specific hooks and data fetching
- **Persistence**: Auto-save drafts to localStorage, sync to database, version history tracking

## 📱 Platform Considerations

### Desktop-Specific
- **Electron Features**: Native file system integration for bulk media import, system notifications for page updates
- **System Integration**: Drag-and-drop from file explorer, native context menus, keyboard shortcuts
- **Keyboard Shortcuts**: Ctrl+K for quick search, Ctrl+N for new page, Ctrl+S for save

### Cross-Platform
- **Windows**: Native file dialogs for media upload, Windows-specific keyboard shortcuts
- **macOS**: Cmd key support, native drag-and-drop behavior, macOS notification integration
- **Linux**: GTK file dialogs, Linux-specific keyboard shortcuts and system integration

### Offline Capability
- **Offline Mode**: Full offline editing with local storage, automatic sync when online
- **Data Sync**: Conflict resolution for offline changes, background sync with progress indicators

## 🔗 Integration Context

### Affected Components
- **AppShell**: Add wiki routing, navigation menu integration, and global search
- **ProjectDetailsPage**: Add wiki tab, quick documentation access, and page embedding
- **TemplateSystem**: Extend with wiki page templates and layout configurations
- **DesignSystemDemo**: Add wiki components to component library showcase

### Data Flow Changes
- **MockDataService**: Add wiki page CRUD operations, search functionality, and media management
- **API Endpoints**: Design RESTful endpoints for pages, media, search, and collaboration features
- **Database Schema**: New tables for wiki_pages, wiki_media, wiki_versions, and wiki_tags

### Design System Impact
- **New Design Tokens**: Editor-specific colors, syntax highlighting palette, content typography
- **Component Extensions**: Rich text editor components, media upload widgets, search interfaces
- **New Patterns**: Split-pane editing, collaborative indicators, version comparison views

## 📋 Implementation Priority

### Must Have (MVP)
- Basic wiki page creation and editing with markdown support
- Notion-style preview rendering with proper formatting
- Image drag-and-drop upload with S3 integration
- Page organization with folders and basic search
- Template system integration for reusable page layouts

### Should Have
- Real-time collaborative editing indicators
- Advanced search with full-text indexing and filters
- Version history with diff viewing and rollback
- Page linking and backlink discovery
- Offline editing with automatic sync

### Could Have
- Advanced media management with thumbnails and galleries
- Custom page templates and workflow automation
- Integration with external documentation tools
- Advanced collaboration features like comments and reviews
- Analytics and usage tracking for documentation effectiveness

## 🎯 Media Management Specifications

### Image Attachment Feature
- **Drag-and-Drop Upload**: Direct drag from file system into markdown editor with instant preview
- **Paste Support**: Clipboard image pasting with automatic upload and embedding
- **Multiple Formats**: Support for PNG, JPG, GIF, WebP, and SVG with format conversion
- **Upload Progress**: Real-time progress indicators with cancel option and retry functionality

### S3 Storage Integration
- **Automatic Upload**: Background upload to AWS S3 with configurable bucket and region
- **Folder Structure**: Organized by project/wiki-media/YYYY/MM/DD/filename for easy management
- **CDN Integration**: CloudFront distribution for fast global media delivery
- **Security**: Signed URLs for private content, public URLs for shared documentation

### Image Handling
- **Compression**: Automatic compression for images over 1MB with quality settings
- **Thumbnail Generation**: Multiple sizes (150px, 300px, 600px) for responsive display
- **Lazy Loading**: Progressive loading for pages with multiple images
- **Alt Text**: Automatic alt text generation with manual override options

### Media Organization
- **Naming Convention**: project-id_page-slug_timestamp_original-name.ext
- **Metadata Storage**: Image dimensions, file size, upload date, and usage tracking
- **Cleanup**: Automatic removal of unused media with 30-day grace period
- **Backup**: Cross-region replication for disaster recovery and data protection

## 🏗️ Component Architecture

### File Structure
```
src/
├── components/
│   └── wiki/
│       ├── WikiPage.tsx           # Main wiki page container
│       ├── WikiEditor.tsx         # Markdown editor with toolbar
│       ├── WikiRenderer.tsx       # Notion-style content renderer
│       ├── WikiSidebar.tsx        # Navigation and page tree
│       ├── WikiSearch.tsx         # Search interface and results
│       ├── MediaUploader.tsx      # Drag-and-drop media upload
│       ├── PageTemplates.tsx      # Template selector and manager
│       └── CollaborationBar.tsx   # Real-time editing indicators
├── hooks/
│   ├── useWikiPages.ts           # Wiki data management
│   ├── useWikiSearch.ts          # Search functionality
│   └── useMediaUpload.ts         # S3 upload management
└── types/
    └── wiki.ts                   # Wiki-specific TypeScript interfaces
```

### Database Schema
```sql
-- Wiki Pages
CREATE TABLE wiki_pages (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  metadata JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false
);

-- Wiki Media
CREATE TABLE wiki_media (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES wiki_pages(id),
  filename VARCHAR(255) NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  dimensions JSONB,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Wiki Tags
CREATE TABLE wiki_tags (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES wiki_pages(id),
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
```typescript
// Wiki Pages CRUD
GET    /api/v1/wiki/pages              # List all pages with pagination
POST   /api/v1/wiki/pages              # Create new page
GET    /api/v1/wiki/pages/:id          # Get specific page
PUT    /api/v1/wiki/pages/:id          # Update page content
DELETE /api/v1/wiki/pages/:id          # Delete page

// Media Management
POST   /api/v1/wiki/media/upload       # Upload media to S3
GET    /api/v1/wiki/media/:id          # Get media metadata
DELETE /api/v1/wiki/media/:id          # Delete media file

// Search and Discovery
GET    /api/v1/wiki/search?q=query     # Full-text search
GET    /api/v1/wiki/tags               # Get all available tags
GET    /api/v1/wiki/backlinks/:id      # Get pages linking to this page
```

### Security Considerations
- **File Upload Security**: Virus scanning, file type validation, size limits (10MB max)
- **S3 Access Control**: IAM roles with minimal permissions, signed URLs for private content
- **Content Sanitization**: XSS prevention in markdown rendering, HTML sanitization
- **Permission System**: Role-based access control for page creation, editing, and viewing
- **Audit Trail**: Complete logging of all page changes, media uploads, and access patterns

## 📚 References & Examples

### Visual References
- **Notion**: Block-based editing, clean typography, seamless media integration
- **GitBook**: Technical documentation layout, search functionality, navigation patterns
- **Linear**: Clean interface design, consistent component usage, keyboard shortcuts
- **Confluence**: Page organization, collaborative editing, template system

### Technical References
- **React Markdown**: react-markdown library for rendering with custom components
- **AWS S3 SDK**: @aws-sdk/client-s3 for direct browser uploads with presigned URLs
- **Monaco Editor**: VS Code editor component for advanced markdown editing
- **Fuse.js**: Lightweight fuzzy search for client-side page discovery

## 🚨 Constraints & Considerations

### Technical Constraints
- **Bundle Size**: Keep wiki components under 500KB to maintain app performance
- **Browser Compatibility**: Support modern browsers with ES2020+ features
- **S3 Costs**: Implement intelligent media cleanup to control storage costs
- **Search Performance**: Index optimization for fast search across large page collections

### Business Constraints
- **Migration Path**: Provide import tools for existing documentation from other platforms
- **Training Requirements**: Intuitive interface requiring minimal user training
- **Data Ownership**: Ensure all content remains under user control with export capabilities

### User Constraints
- **Learning Curve**: Familiar markdown syntax with visual editing aids for non-technical users
- **Collaboration Conflicts**: Clear conflict resolution without data loss
- **Mobile Editing**: Functional mobile editing for urgent documentation updates

## ✅ Definition of Done

### Functional Requirements
- [ ] Users can create, edit, and delete wiki pages with rich markdown formatting
- [ ] Drag-and-drop image upload works seamlessly with S3 integration and CDN delivery
- [ ] Search functionality returns relevant results from page content, titles, and tags
- [ ] Page templates integrate with existing template system and support customization
- [ ] Offline editing saves locally and syncs automatically when connection is restored
- [ ] Real-time collaboration indicators show when multiple users are editing

### Technical Requirements
- [ ] TypeScript compilation passes with comprehensive type definitions for all wiki components
- [ ] All existing functionality continues to work without performance degradation
- [ ] Wiki components have 90%+ test coverage including upload and search functionality
- [ ] Performance benchmarks met: page load <500ms, search <200ms, upload progress indicators
- [ ] Accessibility requirements satisfied with full keyboard navigation and screen reader support
- [ ] Security audit passed for file uploads, content sanitization, and access controls

### Integration Requirements
- [ ] Seamlessly integrates with existing project structure and navigation
- [ ] Follows established Linear-inspired design patterns and component usage
- [ ] Template system extended without breaking existing template functionality
- [ ] No breaking changes to existing data contexts or state management
- [ ] S3 integration configured with proper IAM roles and cost optimization

### Documentation Requirements
- [ ] Component API documentation with usage examples and props reference
- [ ] User guide with screenshots covering all major workflows and features
- [ ] Technical documentation for S3 setup, security configuration, and deployment
- [ ] Migration guide for importing existing documentation from other platforms

---

## Notes for Implementation
This wiki system should feel like a natural extension of the existing project management workflow. Start with core editing and media upload functionality, then add collaborative features and advanced search. The system should be modular enough to work as standalone documentation or integrated project knowledge base. Consider implementing a plugin architecture for future extensions like diagram support, code execution, or integration with external tools.

The S3 integration should be configurable to work with different cloud providers in the future, and the markdown rendering should support custom extensions for VFX-specific content like frame ranges, color spaces, and technical specifications.
