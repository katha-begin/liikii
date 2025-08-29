# Montu Manager REST API Specification v2.1

**Complete API Specification for Frontend Application Development**
**Updated**: August 30, 2025
**Status**: ✅ **IMPLEMENTED** - Firebase Backend Active

---

## 📋 **Overview**

This specification defines the complete REST API for Montu Manager, enabling React/Electron frontend applications to fully replace the existing Qt-based applications (Project Launcher, Ra Task Creator, DCC Integration Suite, and Review Application) with 100% feature parity and enhanced collaboration capabilities.

**Base URL**: `http://localhost:8080/api/v1`
**Database**: Firebase Firestore (migrated from MongoDB)
**Authentication**: ⚠️ **PLANNED** - Bearer JWT tokens with Firebase Auth integration
**Content-Type**: `application/json` (except file uploads: `multipart/form-data`)

## 🚀 **Current Implementation Status**

### ✅ **IMPLEMENTED & WORKING:**
- **Core API Server**: FastAPI with Firebase Firestore backend
- **Database**: 93 documents migrated to Firebase (65 tasks, 2 projects, 15 media records)
- **Basic CRUD Operations**: Tasks, Projects, Media records
- **Health Check & Stats**: System monitoring endpoints
- **Interactive Documentation**: Swagger UI at `/docs`
- **Bulk Operations**: Bulk task updates and field additions
- **Data Validation**: Pydantic models with Firebase data compatibility

### ⚠️ **PLANNED/NOT IMPLEMENTED:**
- **Authentication System**: JWT tokens, user management
- **File Upload/Download**: Media file handling
- **WebSocket Real-time**: Live collaboration features
- **Annotations System**: Review and markup functionality
- **Path Builder Integration**: File path generation
- **CSV Import**: Task import from CSV files

---

## 🧪 **Quick Start - Test Current API**

### **Interactive Documentation**
- **Swagger UI**: http://localhost:8080/docs
- **ReDoc**: http://localhost:8080/redoc

### **Working Endpoints to Test**
```bash
# Health check
curl http://localhost:8080/health

# Get database stats
curl http://localhost:8080/api/v1/stats

# List all projects (2 projects)
curl http://localhost:8080/api/v1/projects

# List all tasks (65 tasks)
curl http://localhost:8080/api/v1/tasks

# List all media records (15 records)
curl http://localhost:8080/api/v1/media

# Get specific task
curl http://localhost:8080/api/v1/tasks/ep00_sq0010_sh0020_comp

# Get specific project
curl http://localhost:8080/api/v1/projects/SWA
```

### **Current Data Structure**
Your Firebase database contains:
- **Projects**: 2 documents (SWA, etc.)
- **Tasks**: 65 documents (migrated from CSV)
- **Media Records**: 15 documents
- **Annotations**: 1 document
- **Directory Operations**: 6 documents
- **Versions**: 4 documents

---

## 🔐 **Authentication & Authorization** ⚠️ **PLANNED**

> **Status**: Not yet implemented. Currently API runs without authentication for development.

### Authentication Endpoints (Planned)

#### POST `/auth/login` ⚠️ **PLANNED**
**Purpose**: Authenticate user and obtain access token

**Request Body**:
```json
{
  "email": "john@studio.com",
  "password": "secure_password",
  "project_id": "SWA"
}
```

**Response** (200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user_id": "user_123",
  "project_id": "SWA",
  "permissions": ["read", "write", "admin"],
  "refresh_token": "refresh_token_here"
}
```

#### POST `/auth/refresh` ⚠️ **PLANNED**
**Purpose**: Refresh expired access token

#### GET `/auth/me` ⚠️ **PLANNED**
**Purpose**: Get current user information

#### POST `/auth/logout` ⚠️ **PLANNED**
**Purpose**: Invalidate current session

---

## 🏗️ **Project Management API** ✅ **IMPLEMENTED**

### Project Endpoints

#### GET `/projects` ✅ **WORKING**
**Purpose**: List all accessible projects with pagination

**Current Implementation**: Returns all projects from Firebase Firestore

**Query Parameters**:
- ⚠️ `page` (int, default: 1): Page number - **PLANNED**
- ⚠️ `page_size` (int, default: 50, max: 100): Items per page - **PLANNED**
- ⚠️ `search` (string): Search in project name/description - **PLANNED**
- ⚠️ `status` (string): Filter by status (active, archived, completed) - **PLANNED**

**Current Response** (200) - **Actual Firebase Data**:
```json
[
  {
    "id": "SWA",
    "name": "Sky Wars Anthology",
    "description": "VFX project for Sky Wars Anthology series",
    "status": "active",
      "drive_mapping": {
        "working_files": "V:",
        "render_outputs": "W:",
        "media_files": "E:",
        "cache_files": "E:",
        "backup_files": "E:"
      },
      "path_segments": {
        "middle_path": "all/scene",
        "version_dir": "version",
        "work_dir": "work",
        "publish_dir": "publish",
        "cache_dir": "cache"
      },
      "templates": {
        "working_file": "{drive_working}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/{filename}",
        "render_output": "{drive_render}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/",
        "media_file": "{drive_media}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/media/"
      },
      "filename_patterns": {
        "maya_scene": "{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.ma",
        "nuke_script": "{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.nk",
        "render_sequence": "{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}.{frame}.{ext}"
      },
      "task_types": ["modeling", "rigging", "animation", "layout", "lighting", "comp", "fx", "lookdev"],
      "milestones": ["not_started", "single_frame", "low_quality", "final_render", "final_comp", "approved"],
      "priority_levels": ["low", "medium", "high", "urgent"],
      "created_at": "2025-08-29T10:00:00Z",
      "updated_at": "2025-08-29T10:00:00Z"
    }
  ]
]
```

**Note**: Current implementation returns a simple array. Pagination wrapper will be added later.
```

#### GET `/projects/{project_id}` ✅ **WORKING**
**Purpose**: Get detailed project configuration

#### POST `/projects` ✅ **WORKING**
**Purpose**: Create new project

**Request Body**:
```json
{
  "id": "NEW_PROJECT",
  "name": "New VFX Project",
  "description": "Description of the new project",
  "drive_mapping": {
    "working_files": "V:",
    "render_outputs": "W:",
    "media_files": "E:",
    "cache_files": "E:",
    "backup_files": "E:"
  },
  "path_segments": {
    "middle_path": "all/scene",
    "version_dir": "version",
    "work_dir": "work",
    "publish_dir": "publish",
    "cache_dir": "cache"
  },
  "templates": {
    "working_file": "{drive_working}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/{filename}"
  },
  "filename_patterns": {
    "maya_scene": "{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.ma"
  },
  "task_types": ["modeling", "rigging", "animation", "lighting", "comp"],
  "milestones": ["not_started", "in_progress", "completed"],
  "priority_levels": ["low", "medium", "high", "urgent"]
}
```

#### PATCH `/projects/{project_id}` ✅ **WORKING**
**Purpose**: Update project configuration

#### DELETE `/projects/{project_id}` ✅ **WORKING**
**Purpose**: Archive project (soft delete)

#### GET `/projects/{project_id}/stats` ⚠️ **PLANNED**
**Purpose**: Get project statistics

**Response** (200):
```json
{
  "project_id": "SWA",
  "total_tasks": 1250,
  "tasks_by_status": {
    "not_started": 150,
    "in_progress": 800,
    "completed": 300
  },
  "tasks_by_type": {
    "lighting": 400,
    "animation": 350,
    "comp": 300,
    "modeling": 200
  },
  "total_media_files": 5000,
  "total_storage_size": "2.5TB",
  "active_artists": 25,
  "completion_percentage": 76.5
}
```

---

## 📋 **Task Management API** ✅ **IMPLEMENTED**

### Task Endpoints

#### GET `/tasks` ✅ **WORKING**
**Purpose**: List tasks with comprehensive filtering and pagination

**Current Implementation**: Returns all tasks from Firebase with basic filtering

**Query Parameters**:
- ✅ `page` (int): Page number - **WORKING**
- ✅ `page_size` (int): Items per page - **WORKING**
- ⚠️ `project_id` (string): Filter by project - **PLANNED**
- ⚠️ `episode` (string): Filter by episode - **PLANNED**
- ⚠️ `sequence` (string): Filter by sequence - **PLANNED**
- ⚠️ `shot` (string): Filter by shot - **PLANNED**
- ⚠️ `task_type` (string): Filter by task type - **PLANNED**
- ⚠️ `artist` (string): Filter by assigned artist - **PLANNED**
- ⚠️ `status` (string): Filter by status - **PLANNED**
- ⚠️ `priority` (string): Filter by priority - **PLANNED**
- ⚠️ `search` (string): Search in task names/descriptions - **PLANNED**
- ⚠️ `sort` (string): Sort field (created_at, updated_at, priority, deadline) - **PLANNED**
- ⚠️ `order` (string): Sort order (asc, desc) - **PLANNED**

**Current Response** (200) - **Actual Firebase Data**:
```json
[
  {
    "id": "ep00_sq0010_sh0020_comp",
    "project": "SWA",
    "project_id": "SWA",
    "type": "shot",
    "episode": "Ep00",
    "sequence": "sq0010",
    "shot": "SH0020",
    "task": "comp",
    "artist": "Unassigned",
    "status": "not_started",
    "priority": "medium",
    "milestone": "not_started",
    "milestone_note": "Imported from CSV",
    "frame_range": {
      "start": 1001,
      "end": 1153
    },
    "start_time": null,
    "deadline": null,
    "estimated_duration_hours": 24.0,
    "actual_time_logged": 0.0,
    "versions": [],
    "current_version": "v001",
    "published_version": "v000",
    "file_extension": ".nk",
    "master_file": true,
    "working_file_path": "",
    "render_output_path": "",
    "media_file_path": "",
    "cache_file_path": "",
    "filename": "",
    "sequence_clean": "",
    "shot_clean": "",
    "episode_clean": "",
    "client_submission_history": [],
    "_created_at": "2025-08-04T11:48:47.211160",
    "_updated_at": "2025-08-04T15:02:10.234821",
    "migrated_at": "2025-08-29T16:50:33.314000+00:00",
    "migration_version": "1.0.0",
    "created_at": "2025-08-29T16:50:33.314000+00:00",
    "updated_at": "2025-08-29T16:50:33.314000+00:00"
  }
]
```

**Note**: Current implementation returns a simple array. Pagination wrapper and filtering will be added later.
```

#### GET `/tasks/{task_id}` ✅ **WORKING**
**Purpose**: Get detailed task information

#### POST `/tasks` ✅ **WORKING**
**Purpose**: Create new task

#### PATCH `/tasks/{task_id}` ✅ **WORKING**
**Purpose**: Update task

#### DELETE `/tasks/{task_id}` ✅ **WORKING**
**Purpose**: Archive task

#### PATCH `/tasks/bulk-update` ✅ **NEW - IMPLEMENTED**
**Purpose**: Perform bulk operations on multiple tasks

**Request Body**:
```json
[
  {
    "task_id": "ep00_sq0010_sh0020_comp",
    "updates": {
      "status": "in_progress",
      "artist": "john_doe",
      "custom_field": "new_value"
    }
  },
  {
    "task_id": "ep00_sq0010_sh0020_lighting",
    "updates": {
      "priority": "high",
      "milestone": "final_render"
    }
  }
]
```

**Response** (200):
```json
{
  "message": "Successfully updated 2 tasks",
  "updated_count": 2
}
```

#### POST `/tasks/{task_id}/add-field` ✅ **NEW - IMPLEMENTED**
**Purpose**: Add new fields to a specific task

**Request Body**:
```json
{
  "frontend_metadata": {
    "ui_color": "#ff6b6b",
    "priority_weight": 5
  },
  "custom_notes": "Updated from frontend",
  "workflow_status": "pending_review"
}
```

#### POST `/tasks/bulk` ⚠️ **PLANNED - LEGACY FORMAT**
**Purpose**: Perform bulk operations on multiple tasks (original format)

**Request Body**:
```json
{
  "task_ids": ["task1", "task2", "task3"],
  "operation": "update_status",
  "data": {
    "status": "in_progress",
    "artist": "new_artist"
  }
}
```

**Response** (200):
```json
{
  "successful": 2,
  "failed": 1,
  "errors": [
    {
      "task_id": "task3",
      "error": "Task not found"
    }
  ],
  "updated_tasks": ["task1", "task2"]
}
```

#### POST `/tasks/import-csv` ⚠️ **PLANNED**
**Purpose**: Import tasks from CSV file

**Request**: `multipart/form-data`
- `file`: CSV file
- `project_id`: Target project ID
- `naming_pattern`: Naming pattern to use
- `validate_only`: Boolean, if true only validate without creating

**Response** (200):
```json
{
  "total_rows": 500,
  "valid_tasks": 485,
  "invalid_tasks": 15,
  "created_tasks": 485,
  "errors": [
    {
      "row": 12,
      "error": "Invalid episode format"
    }
  ],
  "preview": [
    {
      "id": "ep01_sq010_sh020_animation",
      "episode": "Ep01",
      "sequence": "sq010",
      "shot": "sh020",
      "task": "animation"
    }
  ]
}
```

---

## 🎬 **Media Management API** ✅ **PARTIALLY IMPLEMENTED**

### Media Endpoints

#### GET `/media` ✅ **WORKING**
**Purpose**: List media files with filtering

**Current Implementation**: Returns media records from Firebase with basic filtering

**Query Parameters**:
- ✅ `page`, `page_size`: Pagination - **WORKING**
- ✅ `task_id`: Filter by linked task - **WORKING**
- ✅ `file_type`: Filter by file type - **WORKING**
- ⚠️ `media_type`: Filter by type (image, video, audio) - **PLANNED**
- ⚠️ `author`: Filter by author - **PLANNED**
- ⚠️ `approval_status`: Filter by approval status - **PLANNED**
- ⚠️ `tags`: Filter by tags (comma-separated) - **PLANNED**
- ⚠️ `version`: Filter by version - **PLANNED**

#### GET `/media/{media_id}` ⚠️ **PLANNED**
**Purpose**: Get media details and metadata

#### POST `/media` ⚠️ **PLANNED**
**Purpose**: Upload new media file

**Request**: `multipart/form-data`
- `file`: Media file
- `task_id`: Linked task ID
- `version`: Version (default: v001)
- `description`: Description
- `tags`: Tags (comma-separated)

**Response** (201):
```json
{
  "id": "media_123",
  "linked_task_id": "ep00_sq0010_sh0020_lighting",
  "linked_version": "v001",
  "author": "john_doe",
  "file_name": "lighting_beauty_v001.exr",
  "media_type": "image",
  "file_extension": ".exr",
  "storage_key": "media/ep00_sq0010_sh0020_lighting/v001/lighting_beauty_v001.exr",
  "storage_url": "/media_storage/media/ep00_sq0010_sh0020_lighting/v001/lighting_beauty_v001.exr",
  "thumbnail_key": "thumbnails/ep00_sq0010_sh0020_lighting/v001/lighting_beauty_v001_thumb.jpg",
  "description": "Beauty pass render - v001",
  "tags": ["lighting", "beauty", "v001"],
  "metadata": {
    "file_size": 52428800,
    "width": 1920,
    "height": 1080,
    "color_space": "ACES",
    "creation_date": "2025-08-29T10:00:00Z",
    "checksum": "abc123def456"
  },
  "approval_status": "pending",
  "created_at": "2025-08-29T10:00:00Z"
}
```

#### PUT `/media/{media_id}`
**Purpose**: Update media metadata

#### DELETE `/media/{media_id}`
**Purpose**: Remove media record

#### GET `/media/{media_id}/download`
**Purpose**: Download media file

**Response**: File stream with appropriate headers

#### GET `/media/{media_id}/thumbnail`
**Purpose**: Get media thumbnail

**Response**: Image file stream

#### POST `/media/{media_id}/approve`
**Purpose**: Approve/reject media file

**Request Body**:
```json
{
  "approval_status": "approved",
  "reviewer": "supervisor_user",
  "review_notes": "Looks good, approved for final comp"
}
```

---

## 💬 **Annotations & Review API**

### Annotation Endpoints

#### GET `/annotations`
**Purpose**: List annotations with filtering

**Query Parameters**:
- `media_id`: Filter by media file
- `author`: Filter by author
- `annotation_type`: Filter by type (note, markup, approval)
- `status`: Filter by status (active, resolved, archived)

#### POST `/annotations`
**Purpose**: Create new annotation

**Request Body**:
```json
{
  "media_id": "media_123",
  "annotation_type": "note",
  "content": "Color balance looks good, but shadows need adjustment",
  "position": {
    "x": 100,
    "y": 200,
    "width": 50,
    "height": 30
  },
  "timestamp": 1.5,
  "frame_number": 1025
}
```

#### PUT `/annotations/{annotation_id}`
**Purpose**: Update annotation

#### DELETE `/annotations/{annotation_id}`
**Purpose**: Remove annotation

---

## 🛠️ **Path Builder Integration API**

### Path Generation Endpoints

#### POST `/paths/generate`
**Purpose**: Generate file paths using project templates

**Request Body**:
```json
{
  "project_id": "SWA",
  "template_type": "working_file",
  "task_data": {
    "episode": "ep01",
    "sequence": "sq010",
    "shot": "sh020",
    "task": "lighting",
    "version": "v003",
    "artist": "john_doe"
  },
  "filename_pattern": "maya_scene"
}
```

**Response** (200):
```json
{
  "generated_path": "V:/SWA/all/scene/ep01/sq010/sh020/lighting/version/ep01_sq010_sh020_lighting_master_v003.ma",
  "components": {
    "drive": "V:",
    "project": "SWA",
    "episode": "ep01",
    "sequence_clean": "sq010",
    "shot_clean": "sh020",
    "task": "lighting",
    "version": "v003",
    "filename": "ep01_sq010_sh020_lighting_master_v003.ma"
  },
  "template_used": "working_file",
  "pattern_used": "maya_scene"
}
```

#### GET `/paths/validate`
**Purpose**: Validate path format

**Query Parameters**:
- `path`: Path to validate
- `project_id`: Project context

---

## 🔄 **Real-Time Synchronization API**

### WebSocket Endpoints

#### WS `/ws/tasks/{project_id}`
**Purpose**: Real-time task updates

**Connection**: WebSocket with JWT token in query parameter
**URL**: `ws://localhost:8080/ws/tasks/SWA?token=jwt_token_here`

**Message Types**:
```json
// Task created
{
  "type": "task_created",
  "data": {
    "task": { /* task object */ },
    "user": "john_doe",
    "timestamp": "2025-08-29T10:00:00Z"
  }
}

// Task updated
{
  "type": "task_updated", 
  "data": {
    "task_id": "ep00_sq0010_sh0020_lighting",
    "changes": {
      "status": "completed",
      "artist": "new_artist"
    },
    "user": "supervisor",
    "timestamp": "2025-08-29T10:00:00Z"
  }
}

// Bulk operation
{
  "type": "tasks_bulk_updated",
  "data": {
    "task_ids": ["task1", "task2"],
    "operation": "update_status",
    "changes": { "status": "in_progress" },
    "user": "supervisor",
    "timestamp": "2025-08-29T10:00:00Z"
  }
}
```

#### WS `/ws/media/{project_id}`
**Purpose**: Real-time media updates

#### WS `/ws/annotations/{media_id}`
**Purpose**: Real-time annotation updates

---

## 📊 **System & Monitoring API** ✅ **IMPLEMENTED**

### System Endpoints

#### GET `/health` ✅ **WORKING**
**Purpose**: Health check

**Current Response** (200):
```json
{
  "status": "healthy",
  "timestamp": "2025-08-30T10:00:00Z"
}
```

#### GET `/api/v1/stats` ✅ **WORKING**
**Purpose**: System statistics

**Current Response** (200):
```json
{
  "database": {
    "total_documents": 93,
    "collections": {
      "projects": 2,
      "tasks": 65,
      "media_records": 15,
      "annotations": 1,
      "directory_operations": 6,
      "system_logs": 0,
      "user_sessions": 0,
      "versions": 4
    }
  }
}
```

**Note**: System metrics (memory, CPU, API stats) will be added later.
```

---

## 🚨 **Error Handling**

### Standard Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2025-08-29T10:00:00Z",
    "request_id": "req_123456"
  }
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **422**: Unprocessable Entity (business logic error)
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

---

## 📱 **Frontend Integration Examples**

### JavaScript/TypeScript API Client

```typescript
class MontuAPIClient {
  private baseURL = 'http://localhost:8080/api/v1';
  private token: string | null = null;

  async login(email: string, password: string, projectId: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, project_id: projectId })
    });
    
    const data = await response.json();
    this.token = data.access_token;
    return data;
  }

  async getTasks(filters: TaskFilters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/tasks?${params}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }

  async uploadMedia(file: File, taskId: string, version: string = 'v001') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('task_id', taskId);
    formData.append('version', version);

    const response = await fetch(`${this.baseURL}/media`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });
    return response.json();
  }

  // WebSocket connection for real-time updates
  connectToTaskUpdates(projectId: string) {
    const ws = new WebSocket(`ws://localhost:8080/ws/tasks/${projectId}?token=${this.token}`);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleRealtimeUpdate(message);
    };
    
    return ws;
  }
}
```

### React Hook for API Integration

```typescript
import { useState, useEffect } from 'react';

export function useTasks(projectId: string, filters: TaskFilters = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getTasks({ project_id: projectId, ...filters });
        setTasks(response.tasks);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, filters]);

  // Real-time updates
  useEffect(() => {
    const ws = apiClient.connectToTaskUpdates(projectId);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'task_updated') {
        setTasks(prev => prev.map(task => 
          task.id === message.data.task_id 
            ? { ...task, ...message.data.changes }
            : task
        ));
      }
    };

    return () => ws.close();
  }, [projectId]);

  return { tasks, loading, error };
}
```

---

## 🔧 **Configuration & Deployment**

### Environment Variables

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=montu-manager-prod
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account.json
FIREBASE_AUTH_ENABLED=true

# API Configuration
API_HOST=0.0.0.0
API_PORT=8080
API_DEBUG=false

# File Upload Configuration
MAX_FILE_SIZE=2147483648  # 2GB
UPLOAD_PATH=/app/uploads
ALLOWED_FILE_TYPES=.jpg,.png,.exr,.mov,.mp4,.ma,.nk

# Security Configuration
JWT_SECRET_KEY=your-secret-key-here
JWT_EXPIRATION_HOURS=24
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Performance Configuration
MAX_CONCURRENT_REQUESTS=100
REQUEST_TIMEOUT_SECONDS=30
CACHE_TTL_SECONDS=300
```

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ ./src/
COPY config/ ./config/

EXPOSE 8080
CMD ["uvicorn", "src.montu.api.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

## 🔄 **Offline Capabilities & Caching**

### Offline-First Architecture

The API supports offline-first development patterns for desktop applications:

#### Local Storage Strategy
```typescript
class OfflineAPIClient extends MontuAPIClient {
  private cache = new Map();
  private syncQueue: Array<PendingOperation> = [];

  async getTasks(filters: TaskFilters = {}, useCache = true) {
    const cacheKey = `tasks_${JSON.stringify(filters)}`;

    // Try cache first
    if (useCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Fetch from API
      const data = await super.getTasks(filters);
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      // Return cached data if available
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      throw error;
    }
  }

  async updateTask(taskId: string, updates: TaskUpdate) {
    // Queue operation for sync
    this.syncQueue.push({
      type: 'update_task',
      taskId,
      updates,
      timestamp: Date.now()
    });

    // Update local cache immediately
    this.updateLocalCache('tasks', taskId, updates);

    // Try to sync immediately
    try {
      await this.syncPendingOperations();
    } catch (error) {
      // Will sync later when connection is restored
      console.log('Queued for later sync:', error.message);
    }
  }

  async syncPendingOperations() {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue[0];

      try {
        await this.executeOperation(operation);
        this.syncQueue.shift(); // Remove successful operation
      } catch (error) {
        throw error; // Stop syncing on first failure
      }
    }
  }
}
```

#### Conflict Resolution
```typescript
interface ConflictResolution {
  strategy: 'client_wins' | 'server_wins' | 'merge' | 'manual';
  field_strategies?: Record<string, 'client' | 'server' | 'latest'>;
}

// Example conflict resolution for task updates
const conflictResolution: ConflictResolution = {
  strategy: 'merge',
  field_strategies: {
    'status': 'server',      // Server status always wins
    'artist': 'client',      // Client assignment wins
    'notes': 'latest',       // Latest timestamp wins
    'priority': 'server'     // Server priority wins
  }
};
```

---

## 🎯 **Complete Workflow Examples**

### 1. Project Creation Workflow

```typescript
// Complete project setup workflow
async function createNewProject() {
  // Step 1: Create project
  const projectData = {
    id: "NEW_PROJ",
    name: "New VFX Project",
    description: "Latest VFX project",
    drive_mapping: {
      working_files: "V:",
      render_outputs: "W:",
      media_files: "E:",
      cache_files: "E:",
      backup_files: "E:"
    },
    path_segments: {
      middle_path: "all/scene",
      version_dir: "version",
      work_dir: "work",
      publish_dir: "publish",
      cache_dir: "cache"
    },
    templates: {
      working_file: "{drive_working}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/{filename}",
      render_output: "{drive_render}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/",
      media_file: "{drive_media}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/media/"
    },
    filename_patterns: {
      maya_scene: "{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.ma",
      nuke_script: "{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.nk"
    },
    task_types: ["modeling", "rigging", "animation", "lighting", "comp"],
    milestones: ["not_started", "in_progress", "completed"],
    priority_levels: ["low", "medium", "high", "urgent"]
  };

  const project = await apiClient.createProject(projectData);

  // Step 2: Set up user permissions
  await apiClient.addProjectUsers(project.id, [
    { user_id: "artist1", permissions: ["read", "write"] },
    { user_id: "supervisor1", permissions: ["read", "write", "admin"] }
  ]);

  // Step 3: Create initial directory structure
  await apiClient.createDirectoryStructure(project.id, {
    episodes: ["ep01", "ep02"],
    sequences: ["sq010", "sq020", "sq030"],
    task_types: project.task_types
  });

  return project;
}
```

### 2. CSV Task Import Workflow

```typescript
// Complete CSV import with validation and error handling
async function importTasksFromCSV(file: File, projectId: string) {
  // Step 1: Validate CSV format
  const validationResult = await apiClient.validateCSV(file, projectId);

  if (validationResult.errors.length > 0) {
    // Show validation errors to user
    showValidationErrors(validationResult.errors);
    return;
  }

  // Step 2: Preview import
  const preview = await apiClient.previewCSVImport(file, projectId);
  const userConfirmed = await showImportPreview(preview);

  if (!userConfirmed) return;

  // Step 3: Import with progress tracking
  const importJob = await apiClient.importCSV(file, projectId);

  // Track progress
  const progressInterval = setInterval(async () => {
    const status = await apiClient.getImportStatus(importJob.id);
    updateProgressBar(status.progress_percent);

    if (status.status === 'completed') {
      clearInterval(progressInterval);
      showImportResults(status.results);
    } else if (status.status === 'failed') {
      clearInterval(progressInterval);
      showImportError(status.error);
    }
  }, 1000);

  return importJob;
}

// CSV Import API endpoints
interface CSVImportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress_percent: number;
  total_rows: number;
  processed_rows: number;
  created_tasks: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

// POST /tasks/import-csv-async
// Returns: { job_id: string }

// GET /tasks/import-status/{job_id}
// Returns: CSVImportJob
```

### 3. Media Review Workflow

```typescript
// Complete media review and approval workflow
async function reviewMediaWorkflow(mediaId: string) {
  // Step 1: Load media with metadata
  const media = await apiClient.getMedia(mediaId);
  const task = await apiClient.getTask(media.linked_task_id);

  // Step 2: Load existing annotations
  const annotations = await apiClient.getAnnotations({ media_id: mediaId });

  // Step 3: Display media player with annotations
  const mediaPlayer = new MediaPlayer({
    src: media.storage_url,
    thumbnail: media.thumbnail_key,
    annotations: annotations
  });

  // Step 4: Handle new annotations
  mediaPlayer.onAnnotationCreated = async (annotation) => {
    const newAnnotation = await apiClient.createAnnotation({
      media_id: mediaId,
      annotation_type: annotation.type,
      content: annotation.content,
      position: annotation.position,
      timestamp: annotation.timestamp
    });

    // Broadcast to other reviewers via WebSocket
    broadcastAnnotation(newAnnotation);
  };

  // Step 5: Handle approval/rejection
  const approvalForm = new ApprovalForm({
    onApprove: async (notes) => {
      await apiClient.approveMedia(mediaId, {
        approval_status: 'approved',
        reviewer: currentUser.id,
        review_notes: notes
      });

      // Update task status if needed
      if (task.status === 'pending_review') {
        await apiClient.updateTask(task.id, { status: 'approved' });
      }
    },

    onReject: async (notes) => {
      await apiClient.approveMedia(mediaId, {
        approval_status: 'rejected',
        reviewer: currentUser.id,
        review_notes: notes
      });

      // Update task status
      await apiClient.updateTask(task.id, { status: 'needs_revision' });
    }
  });
}
```

### 4. Real-Time Collaboration

```typescript
// Real-time collaboration setup
class CollaborationManager {
  private wsConnections: Map<string, WebSocket> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();

  async initializeCollaboration(projectId: string) {
    // Connect to different WebSocket channels
    const channels = ['tasks', 'media', 'annotations'];

    for (const channel of channels) {
      const ws = new WebSocket(`ws://localhost:8080/ws/${channel}/${projectId}?token=${this.token}`);

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleRealtimeMessage(channel, message);
      };

      this.wsConnections.set(channel, ws);
    }
  }

  private handleRealtimeMessage(channel: string, message: any) {
    const handlers = this.eventHandlers.get(`${channel}_${message.type}`) || [];
    handlers.forEach(handler => handler(message.data));
  }

  // Subscribe to specific events
  onTaskUpdated(callback: (data: any) => void) {
    this.addEventListener('tasks_task_updated', callback);
  }

  onMediaUploaded(callback: (data: any) => void) {
    this.addEventListener('media_media_uploaded', callback);
  }

  onAnnotationCreated(callback: (data: any) => void) {
    this.addEventListener('annotations_annotation_created', callback);
  }

  private addEventListener(event: string, callback: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(callback);
  }
}

// Usage in React component
function TaskList({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState([]);
  const collaboration = useCollaboration();

  useEffect(() => {
    // Subscribe to real-time task updates
    collaboration.onTaskUpdated((data) => {
      setTasks(prev => prev.map(task =>
        task.id === data.task_id
          ? { ...task, ...data.changes }
          : task
      ));
    });

    // Show notification for updates by other users
    collaboration.onTaskUpdated((data) => {
      if (data.user !== currentUser.id) {
        showNotification(`Task ${data.task_id} updated by ${data.user}`);
      }
    });
  }, [projectId]);

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

---

## 📊 **Performance Optimization**

### Pagination & Virtual Scrolling

```typescript
// Efficient pagination for large datasets
interface PaginationConfig {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

class VirtualizedTaskList {
  private cache: Map<number, Task[]> = new Map();
  private loadingPages: Set<number> = new Set();

  async loadPage(page: number, filters: TaskFilters = {}): Promise<Task[]> {
    // Return cached data if available
    if (this.cache.has(page)) {
      return this.cache.get(page)!;
    }

    // Prevent duplicate requests
    if (this.loadingPages.has(page)) {
      return [];
    }

    this.loadingPages.add(page);

    try {
      const response = await apiClient.getTasks({
        ...filters,
        page,
        page_size: 50
      });

      this.cache.set(page, response.tasks);
      return response.tasks;
    } finally {
      this.loadingPages.delete(page);
    }
  }

  // Preload adjacent pages for smooth scrolling
  async preloadAdjacentPages(currentPage: number) {
    const pagesToPreload = [currentPage - 1, currentPage + 1];

    for (const page of pagesToPreload) {
      if (page > 0 && !this.cache.has(page)) {
        this.loadPage(page).catch(() => {}); // Silent preload
      }
    }
  }
}
```

### Optimistic Updates

```typescript
// Optimistic updates for better UX
class OptimisticTaskManager {
  private pendingUpdates: Map<string, TaskUpdate> = new Map();

  async updateTask(taskId: string, updates: TaskUpdate) {
    // Apply update immediately to UI
    this.applyOptimisticUpdate(taskId, updates);
    this.pendingUpdates.set(taskId, updates);

    try {
      // Send to server
      const result = await apiClient.updateTask(taskId, updates);

      // Remove from pending and apply server response
      this.pendingUpdates.delete(taskId);
      this.applyServerUpdate(taskId, result);

    } catch (error) {
      // Revert optimistic update on failure
      this.revertOptimisticUpdate(taskId);
      this.pendingUpdates.delete(taskId);
      throw error;
    }
  }

  private applyOptimisticUpdate(taskId: string, updates: TaskUpdate) {
    // Update local state immediately
    this.updateLocalTask(taskId, { ...updates, _optimistic: true });
  }

  private revertOptimisticUpdate(taskId: string) {
    // Revert to last known server state
    this.reloadTaskFromServer(taskId);
  }
}
```

---

## 🔐 **Security Best Practices**

### Token Management

```typescript
class SecureTokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  async getValidToken(): Promise<string> {
    // Check if current token is still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Try to refresh token
    if (this.refreshToken) {
      try {
        await this.refreshAccessToken();
        return this.accessToken!;
      } catch (error) {
        // Refresh failed, need to re-authenticate
        this.clearTokens();
        throw new Error('Authentication required');
      }
    }

    throw new Error('No valid token available');
  }

  private async refreshAccessToken() {
    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    this.setTokens(data.access_token, data.refresh_token, data.expires_in);
  }

  private setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + (expiresIn * 1000) - 60000; // 1 minute buffer

    // Store securely (encrypted in production)
    localStorage.setItem('montu_tokens', JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: this.tokenExpiry
    }));
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('montu_tokens');
  }
}
```

### Request Validation

```typescript
// Client-side validation before API calls
class APIValidator {
  static validateTaskCreate(data: TaskCreate): ValidationResult {
    const errors: string[] = [];

    if (!data.project || data.project.length === 0) {
      errors.push('Project ID is required');
    }

    if (!data.task || data.task.length === 0) {
      errors.push('Task name is required');
    }

    if (data.type && !['shot', 'asset'].includes(data.type)) {
      errors.push('Task type must be "shot" or "asset"');
    }

    if (data.frame_range) {
      if (data.frame_range.start >= data.frame_range.end) {
        errors.push('Frame range start must be less than end');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateMediaUpload(file: File): ValidationResult {
    const errors: string[] = [];
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    const allowedTypes = ['.jpg', '.png', '.exr', '.mov', '.mp4', '.ma', '.nk'];

    if (file.size > maxSize) {
      errors.push('File size exceeds 2GB limit');
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(extension)) {
      errors.push(`File type ${extension} not allowed`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
```

---

## 📊 **Implementation Status Summary**

### ✅ **FULLY IMPLEMENTED & WORKING**
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/health` | GET | ✅ Working | Basic health check |
| `/api/v1/stats` | GET | ✅ Working | Database statistics |
| `/api/v1/projects` | GET | ✅ Working | List all projects |
| `/api/v1/projects/{id}` | GET | ✅ Working | Get specific project |
| `/api/v1/projects` | POST | ✅ Working | Create project |
| `/api/v1/projects/{id}` | PATCH | ✅ Working | Update project |
| `/api/v1/projects/{id}` | DELETE | ✅ Working | Delete project |
| `/api/v1/tasks` | GET | ✅ Working | List all tasks |
| `/api/v1/tasks/{id}` | GET | ✅ Working | Get specific task |
| `/api/v1/tasks` | POST | ✅ Working | Create task |
| `/api/v1/tasks/{id}` | PATCH | ✅ Working | Update task |
| `/api/v1/tasks/{id}` | DELETE | ✅ Working | Delete task |
| `/api/v1/tasks/bulk-update` | PATCH | ✅ Working | **NEW** - Bulk updates |
| `/api/v1/tasks/{id}/add-field` | POST | ✅ Working | **NEW** - Add fields |
| `/api/v1/media` | GET | ✅ Working | List media records |

### ⚠️ **PLANNED - NOT YET IMPLEMENTED**
- **Authentication**: JWT tokens, user management, permissions
- **File Upload/Download**: Media file handling, thumbnails
- **Advanced Filtering**: Search, sorting, complex filters
- **WebSocket Real-time**: Live collaboration, notifications
- **Annotations**: Review system, markup tools
- **Path Builder**: File path generation
- **CSV Import**: Task import from CSV files
- **Pagination**: Proper pagination wrappers
- **Project Stats**: Detailed project statistics

### 🔄 **KEY DIFFERENCES FROM SPECIFICATION**

#### **Response Format Changes**
- **Current**: Simple arrays `[{...}, {...}]`
- **Planned**: Paginated objects `{"items": [...], "total": 100, "page": 1}`

#### **New Endpoints Added**
- `PATCH /api/v1/tasks/bulk-update` - Bulk task updates
- `POST /api/v1/tasks/{id}/add-field` - Dynamic field addition

#### **Database Migration Changes**
- **Backend**: MongoDB → Firebase Firestore
- **Field Mapping**: Some fields renamed during migration (e.g., `project` → `project_id`)
- **Data Types**: Datetime objects converted to ISO strings
- **Extra Fields**: Migration added `migrated_at`, `migration_version` fields

#### **Authentication Status**
- **Current**: No authentication (development mode)
- **Planned**: Firebase Auth with JWT tokens

### 🎯 **Next Implementation Priorities**
1. **Authentication System** - Firebase Auth integration
2. **File Upload/Download** - Media file handling
3. **Advanced Filtering** - Search and filter capabilities
4. **Pagination Wrappers** - Proper API response format
5. **CSV Import** - Task import functionality
6. **WebSocket Real-time** - Live collaboration features

---

This specification reflects the current implementation status as of August 30, 2025. The API provides a solid foundation for frontend development with core CRUD operations working reliably on Firebase Firestore backend.
