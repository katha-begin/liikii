# Montu Manager REST API Specification v2.0

**Complete API Specification for Frontend Application Development**

---

## 📋 **Overview**

This specification defines the complete REST API for Montu Manager, enabling React/Electron frontend applications to fully replace the existing Qt-based applications (Project Launcher, Ra Task Creator, DCC Integration Suite, and Review Application) with 100% feature parity and enhanced collaboration capabilities.

**Base URL**: `http://localhost:8080/api/v1`  
**Authentication**: Bearer JWT tokens with Firebase Auth integration  
**Content-Type**: `application/json` (except file uploads: `multipart/form-data`)

---

## 🔐 **Authentication & Authorization**

### Authentication Endpoints

#### POST `/auth/login`
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

#### POST `/auth/refresh`
**Purpose**: Refresh expired access token

**Request Body**:
```json
{
  "refresh_token": "refresh_token_here"
}
```

#### GET `/auth/me`
**Purpose**: Get current user information

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "user_id": "user_123",
  "email": "john@studio.com",
  "display_name": "John Doe",
  "project_id": "SWA",
  "permissions": ["read", "write"],
  "profile": {
    "department": "Lighting",
    "role": "Senior Artist",
    "avatar_url": "https://..."
  },
  "last_login": "2025-08-29T10:30:00Z"
}
```

#### POST `/auth/logout`
**Purpose**: Invalidate current session

---

## 🏗️ **Project Management API**

### Project Endpoints

#### GET `/projects`
**Purpose**: List all accessible projects with pagination

**Query Parameters**:
- `page` (int, default: 1): Page number
- `page_size` (int, default: 50, max: 100): Items per page
- `search` (string): Search in project name/description
- `status` (string): Filter by status (active, archived, completed)

**Response** (200):
```json
{
  "projects": [
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
  ],
  "total": 5,
  "page": 1,
  "page_size": 50,
  "total_pages": 1
}
```

#### GET `/projects/{project_id}`
**Purpose**: Get detailed project configuration

#### POST `/projects`
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

#### PUT `/projects/{project_id}`
**Purpose**: Update project configuration

#### DELETE `/projects/{project_id}`
**Purpose**: Archive project (soft delete)

#### GET `/projects/{project_id}/stats`
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

## 📋 **Task Management API**

### Task Endpoints

#### GET `/tasks`
**Purpose**: List tasks with comprehensive filtering and pagination

**Query Parameters**:
- `page` (int): Page number
- `page_size` (int): Items per page
- `project_id` (string): Filter by project
- `episode` (string): Filter by episode
- `sequence` (string): Filter by sequence
- `shot` (string): Filter by shot
- `task_type` (string): Filter by task type
- `artist` (string): Filter by assigned artist
- `status` (string): Filter by status
- `priority` (string): Filter by priority
- `search` (string): Search in task names/descriptions
- `sort` (string): Sort field (created_at, updated_at, priority, deadline)
- `order` (string): Sort order (asc, desc)

**Response** (200):
```json
{
  "tasks": [
    {
      "id": "ep00_sq0010_sh0020_lighting",
      "project_id": "SWA",
      "type": "shot",
      "episode": "Ep00",
      "sequence": "sq0010",
      "shot": "SH0020",
      "task": "lighting",
      "artist": "john_doe",
      "status": "in_progress",
      "priority": "medium",
      "milestone": "scene_building",
      "milestone_note": "Setting up lighting rig",
      "frame_range": {
        "start": 1001,
        "end": 1153
      },
      "start_time": "2025-08-25T09:00:00Z",
      "deadline": "2025-09-01T17:00:00Z",
      "estimated_duration_hours": 40.0,
      "file_extension": ".ma",
      "master_file": true,
      "created_at": "2025-08-29T10:00:00Z",
      "updated_at": "2025-08-29T14:30:00Z"
    }
  ],
  "total": 1250,
  "page": 1,
  "page_size": 50,
  "total_pages": 25,
  "filters_applied": {
    "project_id": "SWA",
    "status": "in_progress"
  }
}
```

#### GET `/tasks/{task_id}`
**Purpose**: Get detailed task information

#### POST `/tasks`
**Purpose**: Create new task

#### PUT `/tasks/{task_id}`
**Purpose**: Update task

#### DELETE `/tasks/{task_id}`
**Purpose**: Archive task

#### POST `/tasks/bulk`
**Purpose**: Perform bulk operations on multiple tasks

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

#### POST `/tasks/import-csv`
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

## 🎬 **Media Management API**

### Media Endpoints

#### GET `/media`
**Purpose**: List media files with filtering

**Query Parameters**:
- `page`, `page_size`: Pagination
- `task_id`: Filter by linked task
- `media_type`: Filter by type (image, video, audio)
- `author`: Filter by author
- `approval_status`: Filter by approval status
- `tags`: Filter by tags (comma-separated)
- `version`: Filter by version

#### GET `/media/{media_id}`
**Purpose**: Get media details and metadata

#### POST `/media`
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

## 📊 **System & Monitoring API**

### System Endpoints

#### GET `/health`
**Purpose**: Health check

**Response** (200):
```json
{
  "status": "healthy",
  "timestamp": "2025-08-29T10:00:00Z",
  "database": {
    "status": "connected",
    "type": "firestore",
    "response_time_ms": 45
  },
  "version": "2.0.0",
  "uptime_seconds": 86400
}
```

#### GET `/stats`
**Purpose**: System statistics

**Response** (200):
```json
{
  "database": {
    "total_documents": 15000,
    "collections": {
      "projects": 5,
      "tasks": 12500,
      "media_records": 2000,
      "annotations": 500
    }
  },
  "system": {
    "memory_usage_mb": 512,
    "cpu_usage_percent": 25.5,
    "disk_usage_gb": 1024.5
  },
  "api": {
    "requests_per_minute": 150,
    "average_response_time_ms": 85,
    "error_rate_percent": 0.1
  }
}
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

This comprehensive specification provides complete API coverage for replacing all Qt-based Montu Manager applications with modern React/Electron frontends while maintaining full feature parity and adding enhanced collaboration capabilities, offline support, and production-ready security features.
