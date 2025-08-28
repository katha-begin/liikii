import React from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Stack } from '@/components/layout'
import { Button, Badge, Input } from '@/components/ui'
import { InboxFilters, InboxStats } from '@/types/database'
import './InboxFilterPanel.css'

interface InboxFilterPanelProps {
  filters: InboxFilters
  stats: InboxStats | null
  projects: Array<{ id: string; name: string; color: string }>
  onFiltersChange: (filters: Partial<InboxFilters>) => void
  onClearFilters: () => void
  className?: string
}

const InboxFilterPanel: React.FC<InboxFilterPanelProps> = ({
  filters,
  stats,
  projects,
  onFiltersChange,
  onClearFilters,
  className
}) => {
  const hasActiveFilters = filters.projectId || filters.type || filters.priority || filters.readStatus !== 'all' || filters.searchQuery

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ searchQuery: e.target.value })
  }

  const handleProjectFilter = (projectId: string | null) => {
    onFiltersChange({ projectId })
  }

  const handleTypeFilter = (type: string | null) => {
    onFiltersChange({ type })
  }

  const handlePriorityFilter = (priority: string | null) => {
    onFiltersChange({ priority })
  }

  const handleReadStatusFilter = (readStatus: 'all' | 'unread' | 'read') => {
    onFiltersChange({ readStatus })
  }

  const handleSortChange = (sortBy: InboxFilters['sortBy'], sortOrder: InboxFilters['sortOrder']) => {
    onFiltersChange({ sortBy, sortOrder })
  }

  const notificationTypes = [
    { value: 'assignment', label: 'Assignments', icon: '👤' },
    { value: 'mention', label: 'Mentions', icon: '@' },
    { value: 'comment', label: 'Comments', icon: '💬' },
    { value: 'version', label: 'Versions', icon: '📦' },
    { value: 'update', label: 'Updates', icon: '🔄' }
  ]

  const priorityLevels = [
    { value: 'urgent', label: 'Urgent', color: '#FF4444' },
    { value: 'high', label: 'High', color: '#FF8800' },
    { value: 'medium', label: 'Medium', color: '#0088FF' },
    { value: 'low', label: 'Low', color: '#888888' }
  ]

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'project', label: 'Project' },
    { value: 'priority', label: 'Priority' },
    { value: 'type', label: 'Type' }
  ]

  return (
    <div className={`inbox-filter-panel ${className || ''}`}>
      {/* Search */}
      <div className="filter-section">
        <Input
          variant="search"
          placeholder="Search notifications..."
          leftIcon={<Search size={16} />}
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="filter-search"
        />
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="filter-section">
          <h3 className="filter-section-title">Overview</h3>
          <div className="filter-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.unread}</span>
              <span className="stat-label">Unread</span>
            </div>
          </div>
        </div>
      )}

      {/* Read Status Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">Status</h3>
        <div className="filter-chips">
          {[
            { value: 'all', label: 'All' },
            { value: 'unread', label: 'Unread' },
            { value: 'read', label: 'Read' }
          ].map((status) => (
            <Badge
              key={status.value}
              variant={filters.readStatus === status.value ? 'primary' : 'default'}
              size="sm"
              className="filter-chip"
              onClick={() => handleReadStatusFilter(status.value as any)}
            >
              {status.label}
              {stats && status.value === 'unread' && stats.unread > 0 && (
                <span className="chip-count">{stats.unread}</span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Project Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">Projects</h3>
        <div className="filter-chips">
          <Badge
            variant={!filters.projectId ? 'primary' : 'default'}
            size="sm"
            className="filter-chip"
            onClick={() => handleProjectFilter(null)}
          >
            All Projects
          </Badge>
          {projects.map((project) => (
            <Badge
              key={project.id}
              variant={filters.projectId === project.id ? 'primary' : 'default'}
              size="sm"
              className="filter-chip project-chip"
              onClick={() => handleProjectFilter(project.id)}
              style={{ '--project-color': project.color } as React.CSSProperties}
            >
              <span className="project-color-dot" />
              {project.name}
              {stats?.byProject[project.id] && (
                <span className="chip-count">{stats.byProject[project.id].unread}</span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">Type</h3>
        <div className="filter-chips">
          <Badge
            variant={!filters.type ? 'primary' : 'default'}
            size="sm"
            className="filter-chip"
            onClick={() => handleTypeFilter(null)}
          >
            All Types
          </Badge>
          {notificationTypes.map((type) => (
            <Badge
              key={type.value}
              variant={filters.type === type.value ? 'primary' : 'default'}
              size="sm"
              className="filter-chip"
              onClick={() => handleTypeFilter(type.value)}
            >
              <span className="type-icon">{type.icon}</span>
              {type.label}
              {stats?.byType[type.value] && (
                <span className="chip-count">{stats.byType[type.value].unread}</span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="filter-section">
        <h3 className="filter-section-title">Priority</h3>
        <div className="filter-chips">
          <Badge
            variant={!filters.priority ? 'primary' : 'default'}
            size="sm"
            className="filter-chip"
            onClick={() => handlePriorityFilter(null)}
          >
            All Priorities
          </Badge>
          {priorityLevels.map((priority) => (
            <Badge
              key={priority.value}
              variant={filters.priority === priority.value ? 'primary' : 'default'}
              size="sm"
              className="filter-chip priority-chip"
              onClick={() => handlePriorityFilter(priority.value)}
              style={{ '--priority-color': priority.color } as React.CSSProperties}
            >
              <span className="priority-dot" />
              {priority.label}
              {stats?.byPriority[priority.value] && (
                <span className="chip-count">{stats.byPriority[priority.value].unread}</span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="filter-section">
        <h3 className="filter-section-title">Sort</h3>
        <div className="sort-controls">
          <select
            className="sort-select"
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as any, filters.sortOrder)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSortChange(filters.sortBy, filters.sortOrder === 'desc' ? 'asc' : 'desc')}
            className="sort-order-btn"
          >
            {filters.sortOrder === 'desc' ? '↓' : '↑'}
          </Button>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="filter-section">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<X size={14} />}
            onClick={onClearFilters}
            className="clear-filters-btn"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default InboxFilterPanel
