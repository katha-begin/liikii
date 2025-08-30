# API Integration Improvements - Technical Clarifications & Responses

## 🎯 Purpose
This document provides detailed technical clarifications and architectural decisions for the Backend API Integration Improvements feature request. It addresses specific questions about data transformation, task state management, messaging systems, and API endpoint design with **multi-tenant architecture** considerations.

## 🏢 Multi-Tenant Architecture Impact

The introduction of **tenant-based architecture** fundamentally changes the API design and data isolation strategy:

### **Tenant Hierarchy Structure**
```
Tenant (Studio): pixelstorm
├── Client: pixelstormClientSwa
│   └── Project: pixelstormSwaP001
│       ├── Episode: pixelstormSwaP001Ep00
│       ├── Sequence: pixelstormSwaP001Ep00Sq0010
│       └── Shot: pixelstormSwaP001Ep00Sq0010Sh0020
└── Users: userEvaMartinez, userJohnDoe, etc.
```

### **Key Architectural Changes**
1. **Data Isolation**: All data scoped by `tenantId` for complete studio separation
2. **Hierarchical IDs**: Composite IDs that include tenant context (`pixelstormSwaP001Ep00Sq0010Sh0020`)
3. **API Versioning**: Multi-tenant endpoints use `/api/v2/tenants/{tenantId}/` pattern
4. **Security**: Tenant-level authentication and authorization boundaries
5. **Database Design**: Tenant-aware schemas with proper indexing strategies

## 📋 Question Responses

### 1. CamelCase vs snake_case Conversion (Multi-Tenant Context)

**Decision**: ✅ **YES** - API should automatically convert between camelCase (frontend) and snake_case (database) in both directions, with **tenant-aware field handling**.

**Multi-Tenant Implementation Strategy**:
```json
// Frontend sends (camelCase) - Tenant context in URL
POST /api/v2/tenants/pixelstorm/tasks
{
  "projectId": "pixelstormSwaP001",
  "frameRange": {"start": 1001, "end": 1153},
  "currentVersion": "v007",
  "estimatedDurationHours": 24.0,
  "actualTimeLogged": 8.5
}

// Database stores (snake_case with tenant fields)
{
  "tenant_id": "pixelstorm",
  "client_id": "pixelstormClientSwa",
  "project_id": "pixelstormSwaP001",
  "ep_id": "pixelstormSwaP001Ep00",
  "seq_id": "pixelstormSwaP001Ep00Sq0010",
  "shot_id": "pixelstormSwaP001Ep00Sq0010Sh0020",
  "frame_range": {"start": 1001, "end": 1153},
  "current_version": "v007",
  "estimated_duration_hours": 24.0,
  "actual_time_logged": 8.5
}

// API returns (camelCase with tenant context)
{
  "id": "ep00_sq0010_sh0020_lighting",
  "tenantId": "pixelstorm",
  "clientId": "pixelstormClientSwa",
  "projectId": "pixelstormSwaP001",
  "epId": "pixelstormSwaP001Ep00",
  "seqId": "pixelstormSwaP001Ep00Sq0010",
  "shotId": "pixelstormSwaP001Ep00Sq0010Sh0020",
  "frameRange": {"start": 1001, "end": 1153},
  "currentVersion": "v007",
  "estimatedDurationHours": 24.0,
  "actualTimeLogged": 8.5,
  "createdAt": "2025-08-29T10:00:00Z",
  "updatedAt": "2025-08-29T15:30:00Z"
}
```

**Multi-Tenant Fields with Special Handling**:
- `_id` → `id` (remove underscore prefix)
- `tenant_id` → `tenantId` (tenant context field)
- `client_id` → `clientId` (client hierarchy field)
- `project_id` → `projectId` (project hierarchy field)
- `ep_id` → `epId` (episode hierarchy field)
- `seq_id` → `seqId` (sequence hierarchy field)
- `shot_id` → `shotId` (shot hierarchy field)
- `_created_at` → `createdAt` (convert timestamp fields)
- `_updated_at` → `updatedAt` (convert timestamp fields)
- MongoDB internal fields starting with `_` should be converted or excluded

**Multi-Tenant Conversion Rules**:
- **Request Processing**: Convert camelCase → snake_case, inject tenant context from URL path
- **Response Processing**: Convert snake_case → camelCase, include tenant hierarchy fields
- **Nested Objects**: Apply conversion recursively, maintain tenant context in sub-objects
- **Arrays**: Apply conversion to objects within arrays, preserve tenant scoping
- **Security**: Always validate tenant access before any data operations

### 2. Task States (Sub-tasks) Architecture (Multi-Tenant)

**Decision**: Task states are **sub-tasks/phases OF a main task** with individual time tracking that rolls up to parent, **scoped by tenant**.

**Multi-Tenant Relationship Structure**:
```json
{
  "id": "ep00_sq0010_sh0020_lighting",
  "tenantId": "pixelstorm",
  "clientId": "pixelstormClientSwa",
  "projectId": "pixelstormSwaP001",
  "shotId": "pixelstormSwaP001Ep00Sq0010Sh0020",
  "title": "Lighting - Ep00 SQ0010 SH0020",
  "status": "inProgress",
  "actualTimeLogged": 20.5,
  "estimatedDurationHours": 30.0,
  "subTaskStates": [
    {
      "id": "stateLightingSetup",
      "name": "Scene setup",
      "description": "Import assets and setup scene structure",
      "status": "completed",
      "percentage": 20,
      "timeLogged": 3.5,
      "estimatedHours": 4.0,
      "startDate": "2025-08-04T11:48:47Z",
      "completedDate": "2025-08-04T15:30:00Z",
      "assignedTo": "Eva Martinez",
      "notes": "Scene imported successfully, all assets linked"
    },
    {
      "id": "stateRoughPass",
      "name": "Rough lighting pass",
      "description": "Basic lighting setup and key placement",
      "status": "completed",
      "percentage": 30,
      "timeLogged": 8.0,
      "estimatedHours": 8.0,
      "startDate": "2025-08-05T09:00:00Z",
      "completedDate": "2025-08-05T17:00:00Z",
      "assignedTo": "Eva Martinez",
      "notes": "Basic lighting established, good foundation"
    },
    {
      "id": "stateHeroLighting",
      "name": "Hero lighting",
      "description": "Detailed character and hero object lighting",
      "status": "inProgress",
      "percentage": 30,
      "timeLogged": 9.0,
      "estimatedHours": 12.0,
      "startDate": "2025-08-06T09:00:00Z",
      "completedDate": null,
      "assignedTo": "Eva Martinez",
      "notes": "Working on character rim lighting"
    }
  ]
}
```

**Multi-Tenant Architecture Decisions**:
- **Time Tracking**: Individual task states have separate time logs that aggregate to parent `actualTimeLogged`
- **Status Logic**: Parent task can be "inProgress" while some states are "completed" and others "notStarted"
- **Progress Calculation**: Parent progress = weighted average of state progress based on percentage allocation
- **API Structure**: Embedded in task document for performance, with tenant-scoped detailed endpoints
- **State Transitions**: Task states follow their own lifecycle independent of parent task status
- **Tenant Isolation**: All task states inherit tenant context from parent task
- **User Assignment**: Task states can be assigned to different users within the same tenant
- **Hierarchical IDs**: Task state IDs follow tenant naming conventions for consistency

### 3. Task State Templates

**Decision**: Predefined template system for different task types with project-level customization.

**Template Structure**:
```json
{
  "templateId": "lighting_standard_v1",
  "templateName": "Standard Lighting Workflow",
  "taskType": "lighting",
  "version": "1.0",
  "isActive": true,
  "scope": "studio", // "studio" | "project" | "client"
  "states": [
    {
      "name": "Scene setup",
      "percentage": 20,
      "estimatedHours": 4,
      "description": "Import assets and setup scene structure",
      "dependencies": [],
      "milestones": ["scene_building"]
    },
    {
      "name": "Rough lighting pass", 
      "percentage": 30,
      "estimatedHours": 8,
      "description": "Basic lighting setup and mood establishment",
      "dependencies": ["Scene setup"],
      "milestones": ["low_quality"]
    },
    {
      "name": "Hero lighting",
      "percentage": 30, 
      "estimatedHours": 12,
      "description": "Detailed character and key object lighting",
      "dependencies": ["Rough lighting pass"],
      "milestones": ["final_render"]
    },
    {
      "name": "Final polish",
      "percentage": 15,
      "estimatedHours": 4,
      "description": "Final adjustments and optimization",
      "dependencies": ["Hero lighting"],
      "milestones": ["final_comp"]
    },
    {
      "name": "Render tests",
      "percentage": 5,
      "estimatedHours": 2, 
      "description": "Test renders and technical validation",
      "dependencies": ["Final polish"],
      "milestones": ["approved"]
    }
  ],
  "createdAt": "2025-08-29T10:00:00Z",
  "updatedAt": "2025-08-29T10:00:00Z"
}
```

**Template Application Logic**:
- **Automatic Creation**: When creating a new task, automatically apply template based on task type
- **Customization Hierarchy**: Project templates override studio defaults, client templates override project
- **Template Versioning**: Support template versions for workflow evolution
- **Manual Override**: Users can modify generated states after template application

### 4. Inbox Messages vs Task Comments vs Review Annotations

**System Separation & Integration**:

**Inbox Messages** (Studio-wide communication):
```json
{
  "id": "msg_123456",
  "type": "direct",
  "subject": "Lighting Review Required",
  "content": "Please review the latest lighting pass for SH0020",
  "fromUserId": "user_supervisor",
  "fromUserName": "VFX Supervisor",
  "toUserIds": ["user_artist"],
  "toUserNames": ["Lighting Artist"],
  "relatedTaskId": "ep00_sq0010_sh0020_lighting",
  "relatedProjectId": "SWA",
  "isRead": false,
  "priority": "high",
  "createdAt": "2025-08-29T10:00:00Z",
  "threadId": "thread_lighting_review"
}
```

**Task Comments** (Task-specific discussions):
```json
{
  "id": "comment_789012",
  "taskId": "ep00_sq0010_sh0020_lighting", 
  "userId": "user_artist",
  "userName": "Lighting Artist",
  "content": "Updated key light intensity based on feedback. Ready for review.",
  "type": "progress_update",
  "mentions": ["user_supervisor"],
  "attachments": [
    {
      "id": "att_001",
      "name": "lighting_test_v003.jpg",
      "type": "image",
      "url": "/uploads/lighting_test_v003.jpg"
    }
  ],
  "createdAt": "2025-08-29T14:30:00Z",
  "editedAt": null
}
```

**Review Annotations** (Visual feedback system):
```json
{
  "id": "annotation_345678",
  "taskId": "ep00_sq0010_sh0020_lighting",
  "versionId": "v003", 
  "mediaFileId": "render_v003_001.exr",
  "frameNumber": 1025,
  "annotationType": "visual_note",
  "coordinates": {"x": 450, "y": 320},
  "content": "Shadow too harsh on character face",
  "severity": "medium",
  "status": "open",
  "authorId": "user_supervisor",
  "authorName": "VFX Supervisor",
  "createdAt": "2025-08-29T16:00:00Z"
}
```

**Integration Logic**:
- Task comments can trigger inbox message notifications
- Review annotations can generate task comments automatically
- Inbox messages can reference specific task comments or annotations
- All three systems maintain separate but linked data structures

### 5. Multi-Tenant API Endpoint Structure

**Multi-Tenant Task States Management**:
```
GET    /api/v2/tenants/{tenantId}/tasks/{taskId}/states           # List all task states
POST   /api/v2/tenants/{tenantId}/tasks/{taskId}/states           # Create new task state
PUT    /api/v2/tenants/{tenantId}/tasks/{taskId}/states/{stateId} # Update specific task state
DELETE /api/v2/tenants/{tenantId}/tasks/{taskId}/states/{stateId} # Delete task state
PATCH  /api/v2/tenants/{tenantId}/tasks/{taskId}/states/bulk      # Bulk update multiple states
GET    /api/v2/tenants/{tenantId}/tasks/{taskId}/states/progress  # Get aggregated progress data

# Enhanced endpoints with query parameters
GET    /api/v2/tenants/{tenantId}/tasks/{taskId}?include=states,comments,media
GET    /api/v2/tenants/{tenantId}/projects/{projectId}/tasks?include=states&status=inProgress
```

**Multi-Tenant Task State Templates**:
```
GET    /api/v2/tenants/{tenantId}/templates/task-states                    # List tenant templates
GET    /api/v2/tenants/{tenantId}/templates/task-states/{taskType}         # Get templates by task type
GET    /api/v2/tenants/{tenantId}/templates/task-states/{templateId}       # Get specific template
POST   /api/v2/tenants/{tenantId}/templates/task-states                    # Create new template
PUT    /api/v2/tenants/{tenantId}/templates/task-states/{templateId}       # Update template
DELETE /api/v2/tenants/{tenantId}/templates/task-states/{templateId}       # Delete template
POST   /api/v2/tenants/{tenantId}/tasks/{taskId}/apply-template            # Apply template to task

# Project-level template overrides
GET    /api/v2/tenants/{tenantId}/projects/{projectId}/templates/task-states
POST   /api/v2/tenants/{tenantId}/projects/{projectId}/templates/task-states
```

**Multi-Tenant Messages & Communication**:
```
GET    /api/v2/tenants/{tenantId}/messages                        # List user messages (inbox)
POST   /api/v2/tenants/{tenantId}/messages                        # Send new message
GET    /api/v2/tenants/{tenantId}/messages/{messageId}            # Get specific message
PUT    /api/v2/tenants/{tenantId}/messages/{messageId}            # Update message (mark read/unread)
DELETE /api/v2/tenants/{tenantId}/messages/{messageId}            # Delete message
GET    /api/v2/tenants/{tenantId}/messages/threads/{threadId}     # Get message thread
POST   /api/v2/tenants/{tenantId}/messages/{messageId}/reply      # Reply to message

GET    /api/v2/tenants/{tenantId}/tasks/{taskId}/comments         # List task comments
POST   /api/v2/tenants/{tenantId}/tasks/{taskId}/comments         # Add task comment
PUT    /api/v2/tenants/{tenantId}/tasks/{taskId}/comments/{commentId}  # Update comment
DELETE /api/v2/tenants/{tenantId}/tasks/{taskId}/comments/{commentId}  # Delete comment

GET    /api/v2/tenants/{tenantId}/tasks/{taskId}/annotations      # List review annotations
POST   /api/v2/tenants/{tenantId}/tasks/{taskId}/annotations      # Create annotation
PUT    /api/v2/tenants/{tenantId}/tasks/{taskId}/annotations/{annotationId}  # Update annotation
DELETE /api/v2/tenants/{tenantId}/tasks/{taskId}/annotations/{annotationId}  # Delete annotation

# Media management with tenant isolation
GET    /api/v2/tenants/{tenantId}/tasks/{taskId}/media            # List task media
POST   /api/v2/tenants/{tenantId}/tasks/{taskId}/media            # Upload media
GET    /api/v2/tenants/{tenantId}/media/{mediaId}                 # Get specific media
```

### 6. Data Relationships & Business Logic

**Time Aggregation Rules**:
```typescript
// Parent task time = sum of all sub-task state times
parentTask.actualTimeLogged = subTaskStates.reduce((total, state) =>
  total + state.timeLogged, 0
)

// Progress calculation based on weighted percentages
parentTask.progress = subTaskStates.reduce((total, state) =>
  total + (state.progress * state.percentage / 100), 0
)
```

**Status Inheritance Logic**:
- Parent task status remains independent of sub-task states
- Parent can be "in_progress" while states are mixed (completed/in_progress/not_started)
- Parent status changes trigger notifications but don't automatically change state statuses
- State completion can trigger parent status suggestions but requires manual confirmation

**Template Inheritance Hierarchy**:
1. **Studio Default Templates**: Base templates for all task types
2. **Project Templates**: Override studio defaults for specific project needs
3. **Client Templates**: Override project templates for client-specific workflows
4. **Manual Overrides**: Individual task modifications after template application

**Notification Triggers**:
```typescript
// Task comment → Inbox message notification
taskComment.mentions.forEach(userId => {
  createInboxMessage({
    type: 'mention',
    fromUserId: taskComment.userId,
    toUserId: userId,
    relatedTaskId: taskComment.taskId,
    content: `You were mentioned in a comment on ${task.title}`
  })
})

// Review annotation → Task comment (optional auto-generation)
if (annotation.severity === 'high') {
  createTaskComment({
    taskId: annotation.taskId,
    content: `High priority review note: ${annotation.content}`,
    type: 'system_generated',
    userId: 'system'
  })
}
```

### 7. Real Data Examples from Current System

**Complete Task with Sub-States** (Based on existing mock data):
```json
{
  "id": "ep00_sq0010_sh0020_lighting",
  "title": "Lighting - Ep00 SQ0010 SH0020",
  "project": "SWA",
  "projectName": "Sky Wars Anthology",
  "type": "shot",
  "episode": "Ep00",
  "sequence": "sq0010",
  "shot": "SH0020",
  "task": "lighting",
  "artist": "current_user",
  "assignee": "current_user",
  "status": "in_progress",
  "milestone": "scene_building",
  "milestoneNote": "Working on lighting setup for space battle scene",
  "frameRange": {"start": 1001, "end": 1153},
  "priority": "medium",
  "startTime": "2025-08-15T09:00:00.000Z",
  "deadline": "2025-08-20T17:00:00.000Z",
  "actualTimeLogged": 20.5,
  "estimatedDurationHours": 30.0,
  "currentVersion": "v003",
  "publishedVersion": "v002",
  "subTaskStates": [
    {
      "id": "lighting_setup_001",
      "name": "Scene setup",
      "status": "completed",
      "percentage": 20,
      "timeLogged": 4.0,
      "estimatedHours": 4.0,
      "startedAt": "2025-08-15T09:00:00Z",
      "completedAt": "2025-08-15T17:00:00Z",
      "notes": "Imported all assets, setup basic scene structure"
    },
    {
      "id": "lighting_rough_002",
      "name": "Rough lighting pass",
      "status": "completed",
      "percentage": 30,
      "timeLogged": 8.5,
      "estimatedHours": 8.0,
      "startedAt": "2025-08-16T09:00:00Z",
      "completedAt": "2025-08-17T15:30:00Z",
      "notes": "Basic lighting mood established"
    },
    {
      "id": "lighting_hero_003",
      "name": "Hero character lighting",
      "status": "in_progress",
      "percentage": 30,
      "timeLogged": 8.0,
      "estimatedHours": 12.0,
      "startedAt": "2025-08-17T16:00:00Z",
      "notes": "Working on main character lighting details"
    },
    {
      "id": "lighting_polish_004",
      "name": "Final polish",
      "status": "not_started",
      "percentage": 15,
      "timeLogged": 0.0,
      "estimatedHours": 4.0,
      "notes": "Awaiting hero lighting completion"
    },
    {
      "id": "lighting_render_005",
      "name": "Render tests",
      "status": "not_started",
      "percentage": 5,
      "timeLogged": 0.0,
      "estimatedHours": 2.0,
      "notes": "Final validation renders"
    }
  ],
  "taskStateTemplate": {
    "templateId": "lighting_standard_v1",
    "templateName": "Standard Lighting Workflow",
    "appliedAt": "2025-08-15T08:30:00Z"
  },
  "createdAt": "2025-08-15T08:30:00Z",
  "updatedAt": "2025-08-29T14:30:00Z"
}
```

**Task State Template Example**:
```json
{
  "templateId": "animation_standard_v2",
  "templateName": "Standard Animation Workflow",
  "taskType": "animation",
  "version": "2.0",
  "isActive": true,
  "scope": "studio",
  "description": "Standard animation pipeline for character and creature work",
  "states": [
    {
      "name": "Blocking",
      "percentage": 25,
      "estimatedHours": 8,
      "description": "Initial pose and timing blocking",
      "milestones": ["blocking"],
      "deliverables": ["blocking_playblast.mov"]
    },
    {
      "name": "Spline",
      "percentage": 35,
      "estimatedHours": 12,
      "description": "Spline animation and refinement",
      "dependencies": ["Blocking"],
      "milestones": ["spline"],
      "deliverables": ["spline_playblast.mov"]
    },
    {
      "name": "Polish",
      "percentage": 30,
      "estimatedHours": 10,
      "description": "Final animation polish and cleanup",
      "dependencies": ["Spline"],
      "milestones": ["polish"],
      "deliverables": ["final_playblast.mov", "animation_curves.ma"]
    },
    {
      "name": "Final",
      "percentage": 10,
      "estimatedHours": 3,
      "description": "Technical validation and delivery prep",
      "dependencies": ["Polish"],
      "milestones": ["final"],
      "deliverables": ["final_animation.ma", "technical_notes.txt"]
    }
  ],
  "totalEstimatedHours": 33,
  "createdBy": "pipeline_supervisor",
  "createdAt": "2025-08-01T10:00:00Z",
  "updatedAt": "2025-08-15T14:30:00Z"
}
```

**Inbox Message Thread Example**:
```json
{
  "threadId": "thread_lighting_review_sh0020",
  "subject": "Lighting Review - SH0020",
  "participants": [
    {"userId": "user_supervisor", "userName": "VFX Supervisor"},
    {"userId": "user_artist", "userName": "Lighting Artist"},
    {"userId": "user_director", "userName": "Director"}
  ],
  "messages": [
    {
      "id": "msg_001",
      "fromUserId": "user_supervisor",
      "content": "Please review the latest lighting pass. The mood looks good but we need to adjust the rim lighting on the main character.",
      "createdAt": "2025-08-29T10:00:00Z",
      "relatedTaskId": "ep00_sq0010_sh0020_lighting"
    },
    {
      "id": "msg_002",
      "fromUserId": "user_artist",
      "content": "Thanks for the feedback. I'll adjust the rim light intensity and send a new version by EOD.",
      "createdAt": "2025-08-29T10:15:00Z",
      "parentMessageId": "msg_001"
    },
    {
      "id": "msg_003",
      "fromUserId": "user_director",
      "content": "Also, can we make the background slightly warmer? It feels too cold for this scene.",
      "createdAt": "2025-08-29T11:30:00Z",
      "parentMessageId": "msg_001"
    }
  ],
  "isRead": false,
  "lastActivity": "2025-08-29T11:30:00Z"
}
```

**Task Comment with Mentions**:
```json
{
  "id": "comment_lighting_update_001",
  "taskId": "ep00_sq0010_sh0020_lighting",
  "userId": "user_artist",
  "userName": "Lighting Artist",
  "userAvatar": "/avatars/lighting-artist.jpg",
  "content": "Updated the rim lighting as requested by @VFX_Supervisor. Also addressed @Director's note about background warmth. New version v004 is ready for review.",
  "type": "progress_update",
  "mentions": [
    {"userId": "user_supervisor", "userName": "VFX Supervisor"},
    {"userId": "user_director", "userName": "Director"}
  ],
  "attachments": [
    {
      "id": "att_v004_preview",
      "name": "lighting_v004_preview.jpg",
      "type": "image",
      "size": 2048576,
      "url": "/uploads/lighting_v004_preview.jpg",
      "thumbnailUrl": "/uploads/thumbs/lighting_v004_preview_thumb.jpg"
    }
  ],
  "relatedVersion": "v004",
  "createdAt": "2025-08-29T16:45:00Z",
  "editedAt": null
}
```

## 🏢 Multi-Tenant Implementation Impact Analysis

### **Critical Architectural Changes Required**

**1. Database Schema Modifications**
```sql
-- All tables require tenant_id for data isolation
ALTER TABLE tasks ADD COLUMN tenant_id VARCHAR(50) NOT NULL;
ALTER TABLE task_states ADD COLUMN tenant_id VARCHAR(50) NOT NULL;
ALTER TABLE messages ADD COLUMN tenant_id VARCHAR(50) NOT NULL;
ALTER TABLE comments ADD COLUMN tenant_id VARCHAR(50) NOT NULL;

-- Composite indexes for tenant-aware queries
CREATE INDEX idx_tasks_tenant_project ON tasks(tenant_id, project_id);
CREATE INDEX idx_task_states_tenant_task ON task_states(tenant_id, task_id);
CREATE INDEX idx_messages_tenant_user ON messages(tenant_id, user_id);
```

**2. API Security & Authorization**
- **Tenant Context Validation**: Every request must validate tenant access
- **Cross-Tenant Data Isolation**: Prevent data leakage between tenants
- **Hierarchical Permissions**: Tenant → Client → Project → Task level access
- **JWT Token Enhancement**: Include tenant context in authentication tokens

**3. Data Migration Strategy**
- **Existing Data**: Assign default tenant to current data
- **ID Migration**: Convert simple IDs to hierarchical tenant-aware IDs
- **Relationship Updates**: Update all foreign key relationships with tenant context

**4. Frontend Integration Changes**
- **URL Structure**: Update all API calls to include tenant context
- **State Management**: Handle tenant-scoped data in frontend stores
- **User Experience**: Tenant-aware navigation and data filtering

## 🔧 Multi-Tenant Implementation Recommendations

### Phase 1: Multi-Tenant Foundation (Week 1-3)
1. **Implement tenant-aware database schema and migrations**
2. **Create tenant context middleware for all API requests**
3. **Update authentication system to include tenant validation**
4. **Implement camelCase/snake_case conversion with tenant fields**
5. **Add comprehensive tenant isolation security measures**

### Phase 2: Task State System with Multi-Tenancy (Week 4-5)
1. **Implement tenant-scoped task state data models**
2. **Create tenant-aware task state template system**
3. **Build multi-tenant task state management endpoints**
4. **Integrate time tracking aggregation with tenant isolation**

### Phase 3: Multi-Tenant Communication Systems (Week 6-7)
1. **Implement tenant-scoped inbox messages, task comments, and annotations**
2. **Create tenant-aware notification trigger system**
3. **Add WebSocket support with tenant channel isolation**
4. **Build comprehensive multi-tenant messaging endpoints**

### Phase 4: Integration, Testing & Migration (Week 8-10)
1. **End-to-end multi-tenant integration testing**
2. **Data migration from single-tenant to multi-tenant structure**
3. **Performance optimization with tenant-aware caching**
4. **Security audit focusing on tenant isolation**
5. **Update documentation and API client libraries**

## ✅ Multi-Tenant Success Criteria Validation

**Multi-Tenant Data Consistency**:
- [ ] All API responses use consistent camelCase naming with tenant context
- [ ] Database operations maintain snake_case internally with tenant isolation
- [ ] No data loss during transformation processes across tenant boundaries
- [ ] Nested objects and arrays properly converted with tenant fields preserved
- [ ] Hierarchical IDs (tenantId, clientId, projectId, etc.) correctly generated and maintained

**Multi-Tenant Task State Management**:
- [ ] Task states properly aggregate time and progress to parent tasks within tenant scope
- [ ] Template system creates consistent task state structures per tenant
- [ ] State transitions follow business logic rules with tenant-aware validation
- [ ] Time tracking accuracy maintained across all levels within tenant boundaries
- [ ] Cross-tenant data isolation prevents unauthorized access to task states

**Multi-Tenant Communication Systems**:
- [ ] Clear separation between messages, comments, and annotations within tenant scope
- [ ] Proper notification triggers and delivery with tenant channel isolation
- [ ] Thread management and conversation continuity within tenant boundaries
- [ ] Real-time updates via WebSocket connections with tenant-specific channels
- [ ] Media management properly scoped to tenant with secure storage isolation

**Multi-Tenant Security & Performance**:
- [ ] Response times under 200ms for 95% of requests across all tenants
- [ ] Efficient database queries with tenant-aware indexing strategies
- [ ] Caching strategies reduce database load while maintaining tenant isolation
- [ ] System handles 50+ concurrent users per tenant without cross-tenant interference
- [ ] Complete data isolation between tenants verified through security testing
- [ ] Tenant context validation prevents unauthorized cross-tenant access
- [ ] JWT tokens properly include and validate tenant context

---

## 📚 References

- **Original Feature Request**: `FR_BE_api_integration_improvements.md`
- **Current Database Schema**: `src/types/database.ts`
- **Mock Data Examples**: `src/services/MockDataService.ts`
- **Existing Task Models**: `data/json_db/tasks.json`

## 📝 Notes

This technical specification provides the foundation for implementing the Backend API Integration Improvements. All decisions are based on existing codebase analysis and align with the Linear-inspired interface design patterns already established in the system.

The implementation should maintain backward compatibility during the transition period and include comprehensive testing at each phase to ensure system stability and data integrity.

