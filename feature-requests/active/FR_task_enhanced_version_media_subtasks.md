# Feature Request: Enhanced Task Management - Version Control, Media Integration & Sub-Task States

## 🎯 Purpose & Goals
**Primary Goal**: Enhance the task management system with comprehensive version control, media integration, and sub-task state management to support detailed VFX production workflows with Linear.com-inspired interface patterns.

**User Value**: Provides artists, supervisors, and producers with granular control over task progression, version management, and media review processes, enabling precise tracking of work states and deliverables throughout the VFX pipeline.

**Business Impact**: Streamlines VFX production workflows by providing detailed version tracking, media management, and task breakdown capabilities that reduce review time by 70%, improve version control accuracy by 90%, and enable precise task state monitoring.

**Success Metrics**:
- Reduce version confusion and media location time by 80%
- Enable granular task state tracking with 95% accuracy
- Improve media review workflow efficiency by 70%
- Provide clear version history and publishing status for all stakeholders

## 👤 User Stories

**Primary User Story**:
As a VFX Supervisor, I want to see detailed version history with publishing status and media attachments so that I can quickly identify which versions are published, review associated media, and track task progression through defined states.

**Version Management Story**:
As a Pipeline TD, I want to manage version publishing with detailed metadata (owner, media links, publish status) so that I can control which versions are available for downstream tasks and maintain clear version lineage.

**Media Integration Story**:
As a Review Coordinator, I want to see all media associated with task versions and perform actions (play in RV, open source files) so that I can efficiently review work and provide feedback without switching between multiple tools.

**Sub-Task State Story**:
As an Animation Supervisor, I want to break down animation tasks into states (blocking, spline, polish) with individual time allocations and status tracking so that I can monitor detailed progress and ensure proper workflow progression.

**Template Management Story**:
As a Department Lead, I want to create task state templates for different task types so that artists can consistently apply standardized workflows while maintaining flexibility for custom breakdowns.

### Acceptance Criteria
- [ ] Given I'm viewing a task, when I access version history, then I see separate published and unpublished versions with detailed metadata
- [ ] Given I'm viewing a version, when I see associated media, then I can play media in RV, open source files, and see media status
- [ ] Given I'm creating a task, when I apply a template, then sub-task states are automatically created with appropriate time allocations
- [ ] Given I'm managing sub-task states, when I update durations, then the total never exceeds the main task duration
- [ ] Given I'm viewing media, when I see media status, then I can identify which media version is published and approved

## 🔄 User Workflow

### Happy Path - Version Management
1. **Entry Point**: User opens task detail panel
2. **Version History**: User sees separate sections for "Published Versions" and "Work Versions"
3. **Version Details**: Each version shows owner, creation date, media count, publish status
4. **Version Actions**: User can publish version, send to farm, mark issues, or revert
5. **Success State**: Clear version lineage with actionable controls

### Happy Path - Media Integration
1. **Entry Point**: User selects a version in version history
2. **Media Display**: System shows all media associated with that version
3. **Media Actions**: User can play in RV, open source file, or download
4. **Media Status**: User sees which media is published, under review, or approved
5. **Success State**: Seamless media access and status visibility

### Happy Path - Sub-Task States
1. **Entry Point**: User creates or edits a task
2. **Template Selection**: User chooses from predefined templates (Animation: blocking/spline/polish)
3. **State Configuration**: System creates sub-task states with time allocations
4. **Progress Tracking**: User updates individual state status and time spent
5. **Success State**: Detailed task progression with accurate time tracking

## 🎨 Design Requirements

### Linear.com Design System Alignment
- **Typography**: Maintains Linear's compact sizing with `--text-h1` (18px) for section headers, `--text-body` (13px) for content, `--text-caption` (11px) for metadata
- **Spacing**: Strict adherence to 4px grid system using `--space-1` through `--space-8` for consistent density
- **Colors**: Uses established design tokens with semantic colors for version status (`--semantic-success` for published, `--semantic-warning` for pending)
- **Component Extensions**: Extends existing components with version-specific variants and media integration patterns
- **New Components**: VersionHistoryPanel, MediaViewer, SubTaskStateManager, TaskStateTemplate

### Version Control Visual Design
- **Published Versions**: Distinct section with `--semantic-success` accent and checkmark icons
- **Work Versions**: Separate section with `--text-secondary` styling and work-in-progress indicators
- **Version Cards**: Linear-style cards with owner avatar, metadata, and action buttons
- **Status Indicators**: Clear visual distinction between published, pending, and draft states

### Media Integration Design
- **Media Grid**: Thumbnail grid with Linear's card styling and hover states
- **Media Status**: Color-coded status badges (published: green, review: yellow, draft: gray)
- **Action Buttons**: Linear-style button group for RV playback, source file access, download
- **Media Metadata**: Compact display of resolution, format, file size, and creation date

### Sub-Task State Design
- **State Timeline**: Horizontal progress bar showing state progression
- **State Cards**: Individual cards for each state with time allocation and status
- **Template Selector**: Dropdown with predefined templates and custom option
- **Time Allocation**: Visual representation of time distribution across states

## 🔧 Technical Requirements

### Enhanced Data Schema
```json
{
  "version_history": [
    {
      "version": "v003",
      "owner": "user_id",
      "created_at": "2025-08-20T10:00:00.000Z",
      "is_published": true,
      "published_at": "2025-08-20T14:00:00.000Z",
      "published_by": "supervisor_id",
      "media_ids": ["media_id_1", "media_id_2"],
      "farm_status": "completed",
      "issues": [],
      "notes": "Final approved version"
    }
  ],
  "sub_task_states": [
    {
      "id": "state_1",
      "name": "Blocking",
      "order": 1,
      "allocated_hours": 8.0,
      "actual_hours": 6.5,
      "status": "completed",
      "start_date": "2025-08-15T09:00:00.000Z",
      "completion_date": "2025-08-16T17:00:00.000Z",
      "assignee": "user_id",
      "notes": "Initial blocking pass complete"
    }
  ],
  "task_state_template": {
    "template_id": "animation_standard",
    "template_name": "Animation Standard",
    "states": [
      {"name": "Blocking", "percentage": 30},
      {"name": "Spline", "percentage": 40},
      {"name": "Polish", "percentage": 30}
    ]
  }
}
```

### Media Integration Schema
```json
{
  "media_records": [
    {
      "_id": "media_id",
      "linked_task_id": "task_id",
      "linked_version": "v003",
      "author": "user_name",
      "file_name": "task_render_v003.exr",
      "media_type": "image",
      "storage_url": "/path/to/file",
      "thumbnail_key": "/path/to/thumb",
      "media_status": "published",
      "approval_status": "approved",
      "playback_actions": {
        "rv_command": "rv /path/to/file",
        "source_file_path": "/path/to/source.ma"
      }
    }
  ]
}
```

### Performance Requirements
- **Version Loading**: Version history loads within 300ms with lazy loading for media
- **Media Thumbnails**: Thumbnail grid loads progressively with 200ms per batch
- **Sub-Task Updates**: State changes reflect immediately with optimistic updates
- **Template Application**: Template-based state creation completes within 500ms

## 📱 Platform Considerations

### Desktop Integration
- **RV Integration**: Native RV playback commands with proper path handling
- **File System Access**: Direct source file opening with system default applications
- **Keyboard Shortcuts**: Linear-style shortcuts for version navigation and media actions

### Media Handling
- **Thumbnail Generation**: Automatic thumbnail creation for supported media types
- **Format Support**: EXR, JPG, PNG, MOV, MP4 with appropriate viewers
- **Large File Handling**: Progressive loading and streaming for large media files

## 🔗 Integration Context

### Affected Components
- **TaskDetailPanel**: Major expansion with version history and media sections
- **VersionHistoryPanel**: New component for version management
- **MediaViewer**: New component for media display and actions
- **SubTaskStateManager**: New component for state breakdown management
- **TaskStateTemplateSelector**: New component for template selection

### Data Flow Changes
- **VersionService**: New service for version management operations
- **MediaService**: New service for media operations and RV integration
- **SubTaskService**: New service for sub-task state management
- **TemplateService**: New service for task state template management

## 📋 Implementation Priority

### Must Have (MVP)
- Separate version history display (published vs work versions)
- Basic media integration with thumbnail display
- Sub-task state creation and management
- Template-based state generation
- Time allocation validation (never exceed main task duration)

### Should Have
- RV integration for media playback
- Source file opening functionality
- Advanced version actions (publish, farm submission)
- Media status management and approval workflow
- Custom template creation

### Could Have
- Advanced media metadata display
- Batch media operations
- Version comparison tools
- Automated state progression rules
- Integration with external render farm systems

## 🚨 Constraints & Considerations

### Technical Constraints
- Must maintain backward compatibility with existing task and media data
- RV integration requires proper path handling for different operating systems
- Media file access must respect file system permissions and network paths
- Sub-task time allocations must never exceed parent task duration

### Business Constraints
- Must align with existing VFX pipeline workflows and terminology
- Should integrate seamlessly with current review and approval processes
- Must support both template-based and custom task state creation
- Should maintain data integrity during version publishing operations

### User Constraints
- Interface must remain intuitive despite increased complexity
- Media actions must work reliably across different file formats and locations
- Sub-task state management should be flexible while maintaining structure
- Template system should be powerful yet simple to use

## ✅ Definition of Done

### Functional Requirements
- [ ] Version history displays separately for published and work versions with complete metadata
- [ ] Media integration shows thumbnails, status, and provides RV/source file access
- [ ] Sub-task states can be created from templates or individually with time validation
- [ ] All interactions maintain Linear's 200ms response time and visual feedback standards
- [ ] Media status accurately reflects published/review/approved states

### Technical Requirements
- [ ] TypeScript compilation passes with proper typing for all new interfaces
- [ ] All new components follow Linear's design system specifications
- [ ] Performance requirements met for version loading and media display
- [ ] Integration with existing task management system maintains backward compatibility
- [ ] RV and file system integration works across supported platforms

### Integration Requirements
- [ ] Seamlessly integrates with existing Linear-inspired design system
- [ ] Maintains consistency with current task management patterns
- [ ] All new features use established CSS custom properties and spacing
- [ ] No breaking changes to existing task functionality
- [ ] Media integration respects existing file path conventions

## 💡 Additional Recommendations

### Enhanced Features
1. **Version Diffing**: Visual comparison between versions showing changes
2. **Automated State Progression**: Rules-based automatic state advancement
3. **Media Annotation**: Frame-accurate notes and markup on media
4. **Batch Operations**: Multi-version publishing and media management
5. **Integration APIs**: Webhooks for external tool integration

### Workflow Improvements
1. **Smart Templates**: AI-suggested state breakdowns based on task history
2. **Dependency Tracking**: Visual representation of state dependencies
3. **Resource Planning**: Capacity planning based on state time allocations
4. **Quality Gates**: Automated checks before state progression

### Technical Enhancements
1. **Caching Strategy**: Intelligent caching for media thumbnails and metadata
2. **Offline Support**: Local caching for critical version and media data
3. **Real-time Updates**: WebSocket integration for live collaboration
4. **Audit Trail**: Complete history of all version and state changes

This enhanced task management system will provide comprehensive control over VFX production workflows while maintaining the clean, efficient interface patterns established by Linear.com.
