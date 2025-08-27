// Create Project Modal - Form for creating new projects based on project_configs.json schema
import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui'
import './CreateProjectModal.css'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (projectData: ProjectConfigData) => void
}

interface ProjectConfigData {
  _id: string
  name: string
  description: string
  drive_mapping: {
    working_files: string
    render_outputs: string
    media_files: string
    cache_files: string
    backup_files: string
  }
  path_segments: {
    middle_path: string
    version_dir: string
    work_dir: string
    publish_dir: string
    cache_dir: string
  }
  templates: {
    working_file: string
    render_output: string
    media_file: string
    cache_file: string
    submission: string
  }
  filename_patterns: {
    maya_scene: string
    nuke_script: string
    houdini_scene: string
    blender_scene: string
    render_sequence: string
    playblast: string
    thumbnail: string
  }
  name_cleaning_rules: {
    sequence_pattern: string
    sequence_replacement: string
    shot_pattern: string
    shot_replacement: string
    episode_pattern: string
    episode_replacement: string
  }
  version_settings: {
    padding: number
    start_version: number
    increment: number
    format: string
  }
  task_settings: {
    default_file_extensions: Record<string, string>
    render_formats: Record<string, string[]>
  }
  milestones: string[]
  task_types: string[]
  priority_levels: string[]
  client_settings: {
    version_reset: boolean
    default_client: string
    delivery_formats: string[]
    approval_required: boolean
  }
  platform_settings: {
    windows: {
      working_root: string
      render_root: string
      media_root: string
    }
    linux: {
      working_root: string
      render_root: string
      media_root: string
    }
  }
  frame_settings: {
    padding: number
    default_start: number
    default_fps: number
  }
}

const defaultProjectConfig: ProjectConfigData = {
  _id: '',
  name: '',
  description: '',
  drive_mapping: {
    working_files: 'V:',
    render_outputs: 'W:',
    media_files: 'E:',
    cache_files: 'E:',
    backup_files: 'E:'
  },
  path_segments: {
    middle_path: 'all/scene',
    version_dir: 'version',
    work_dir: 'work',
    publish_dir: 'publish',
    cache_dir: 'cache'
  },
  templates: {
    working_file: '{drive_working}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/{filename}',
    render_output: '{drive_render}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/',
    media_file: '{drive_media}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/{version_dir}/v{version}/media/',
    cache_file: '{drive_cache}/{project}/{middle_path}/{episode}/{sequence_clean}/{shot_clean}/{task}/cache/',
    submission: '{drive_render}/{project}/deliveries/{client}/{episode}/{sequence_clean}/{shot_clean}/{task}/v{client_version}/'
  },
  filename_patterns: {
    maya_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.ma',
    nuke_script: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.nk',
    houdini_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.hip',
    blender_scene: '{episode}_{sequence_clean}_{shot_clean}_{task}_master_v{version}.blend',
    render_sequence: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}.{frame}.{ext}',
    playblast: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}_playblast.mov',
    thumbnail: '{episode}_{sequence_clean}_{shot_clean}_{task}_v{version}_thumb.jpg'
  },
  name_cleaning_rules: {
    sequence_pattern: '^[A-Z]+_Ep[0-9]+_(.+)$',
    sequence_replacement: '\\1',
    shot_pattern: '^[A-Z]+_Ep[0-9]+_(.+)$',
    shot_replacement: '\\1',
    episode_pattern: '^(Ep[0-9]+)$',
    episode_replacement: '\\1'
  },
  version_settings: {
    padding: 3,
    start_version: 1,
    increment: 1,
    format: 'v{version:03d}'
  },
  task_settings: {
    default_file_extensions: {
      lighting: '.ma',
      comp: '.nk',
      modeling: '.ma',
      rigging: '.ma',
      animation: '.ma',
      fx: '.hip',
      lookdev: '.ma',
      layout: '.ma'
    },
    render_formats: {
      lighting: ['exr', 'jpg'],
      comp: ['exr', 'mov', 'jpg'],
      fx: ['exr', 'mov'],
      lookdev: ['exr', 'jpg']
    }
  },
  milestones: ['not_started', 'single_frame', 'low_quality', 'final_render', 'final_comp', 'approved'],
  task_types: ['modeling', 'rigging', 'animation', 'layout', 'lighting', 'comp', 'fx', 'lookdev'],
  priority_levels: ['low', 'medium', 'high', 'urgent'],
  client_settings: {
    version_reset: true,
    default_client: '',
    delivery_formats: ['mov', 'mp4'],
    approval_required: true
  },
  platform_settings: {
    windows: {
      working_root: '',
      render_root: '',
      media_root: ''
    },
    linux: {
      working_root: '',
      render_root: '',
      media_root: ''
    }
  },
  frame_settings: {
    padding: 4,
    default_start: 1001,
    default_fps: 24
  }
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<ProjectConfigData>(defaultProjectConfig)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    'Basic Information',
    'Drive Mapping',
    'Path Configuration',
    'Templates & Patterns',
    'Task Settings',
    'Client & Platform Settings'
  ]

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.')
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  return (
    <>
      <div className="create-project-backdrop" onClick={onClose} />
      <div className="create-project-modal">
        <div className="create-project-header">
          <h2>Create New Project</h2>
          <button className="create-project-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="create-project-steps">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-label">{step}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="create-project-form">
          <div className="form-content">
            {/* Step content will be rendered here based on currentStep */}
            {/* This is a simplified version - full implementation would include all steps */}
            {currentStep === 0 && (
              <div className="form-section">
                <h3>Basic Project Information</h3>
                <div className="form-group">
                  <label>Project ID</label>
                  <input
                    type="text"
                    value={formData._id}
                    onChange={(e) => updateFormData('_id', e.target.value)}
                    placeholder="e.g., SWA, RGD"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="e.g., Sky Wars Anthology"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Brief description of the project"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </Button>
            <Button type="submit" variant="primary">
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
