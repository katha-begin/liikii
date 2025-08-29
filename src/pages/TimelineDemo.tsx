import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, Stack } from '@/components/layout'
import { Button, Input, Badge, Avatar, Dropdown } from '@/components/ui'
import { useTaskDetail } from '@/contexts/TaskDetailContext'
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  Building2,
  Settings
} from 'lucide-react'
import { KanbanTask } from '@/types/designSystem'
import { UITask } from '@/types/database'

const TimelineDemo: React.FC = () => {
  const navigate = useNavigate()
  const { openTaskDetail } = useTaskDetail()
  const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('weeks')
  const [groupBy, setGroupBy] = useState<'department' | 'user'>('department')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const filterMenuRef = useRef<HTMLDivElement>(null)
  const dateHeaderRef = useRef<HTMLDivElement>(null)
  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false)
      }
    }

    if (filterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [filterMenuOpen])



  // Scroll synchronization handlers
  const handleScrollbarScroll = useCallback((scrollLeft: number) => {
    // Sync all horizontal scrolling from the dedicated scrollbar
    if (dateHeaderRef.current) {
      dateHeaderRef.current.scrollLeft = scrollLeft
    }
    if (rightPanelRef.current) {
      rightPanelRef.current.scrollLeft = scrollLeft
    }
  }, [])

  const handleRightPanelScroll = useCallback(() => {
    if (rightPanelRef.current && leftPanelRef.current) {
      // Only sync vertical scroll with left panel (horizontal is controlled by dedicated scrollbar)
      leftPanelRef.current.scrollTop = rightPanelRef.current.scrollTop
    }
  }, [])

  const handleLeftPanelScroll = useCallback(() => {
    if (leftPanelRef.current && rightPanelRef.current) {
      // Sync vertical scroll with right panel
      rightPanelRef.current.scrollTop = leftPanelRef.current.scrollTop
    }
  }, [])

  // Mock data - same as design system demo
  const mockTasks: KanbanTask[] = [
    {
      id: 'demo-task-1',
      title: 'Character Animation - Hero Walk Cycle',
      description: 'Create walk cycle animation for main character',
      status: 'in_progress',
      priority: 'high',
      assignee: { id: 'user-1', name: 'John Doe', avatar: undefined },
      labels: [{ id: 'anim', name: 'Animation', color: 'var(--accent-blue)' }],
      createdAt: '2025-08-15T10:00:00Z',
      updatedAt: '2025-08-20T14:30:00Z',
      dueDate: '2025-09-12T23:59:59Z',
      estimatedHours: 32
    },
    {
      id: 'demo-task-2',
      title: 'Environment Modeling - Forest Scene',
      description: 'Model detailed forest environment with trees and foliage',
      status: 'todo',
      priority: 'medium',
      assignee: { id: 'user-2', name: 'Jane Smith', avatar: undefined },
      labels: [{ id: 'model', name: 'Modeling', color: '#f59e0b' }],
      createdAt: '2025-08-10T09:00:00Z',
      updatedAt: '2025-08-18T16:45:00Z',
      dueDate: '2025-09-25T23:59:59Z',
      estimatedHours: 48
    },
    {
      id: 'demo-task-3',
      title: 'Lighting - Hero Character Setup',
      description: 'Set up three-point lighting for hero character scenes',
      status: 'in_progress',
      priority: 'high',
      assignee: { id: 'user-3', name: 'Mike Johnson', avatar: undefined },
      labels: [{ id: 'light', name: 'Lighting', color: 'var(--accent-pink)' }],
      createdAt: '2025-08-20T11:00:00Z',
      updatedAt: '2025-08-25T13:20:00Z',
      dueDate: '2025-09-18T23:59:59Z',
      estimatedHours: 24
    },
    {
      id: 'demo-task-4',
      title: 'Compositing - Final Assembly',
      description: 'Composite all elements for final render output',
      status: 'todo',
      priority: 'low',
      assignee: { id: 'user-4', name: 'Sarah Wilson', avatar: undefined },
      labels: [{ id: 'comp', name: 'Compositing', color: '#10b981' }],
      createdAt: '2025-08-12T14:00:00Z',
      updatedAt: '2025-08-22T10:15:00Z',
      dueDate: '2025-10-05T23:59:59Z',
      estimatedHours: 40
    },
    {
      id: 'demo-task-5',
      title: 'FX Simulation - Water Effects',
      description: 'Create realistic water simulation for river scene',
      status: 'in_progress',
      priority: 'medium',
      assignee: { id: 'user-5', name: 'Alex Chen', avatar: undefined },
      labels: [{ id: 'fx', name: 'FX', color: 'var(--accent-lilac)' }],
      createdAt: '2025-08-18T08:30:00Z',
      updatedAt: '2025-08-28T15:45:00Z',
      dueDate: '2025-09-30T23:59:59Z',
      estimatedHours: 36
    },
    {
      id: 'demo-task-6',
      title: 'Character Rigging - Main Character',
      description: 'Create advanced rig for main character with facial controls',
      status: 'done',
      priority: 'high',
      assignee: { id: 'user-6', name: 'Emma Davis', avatar: undefined },
      labels: [{ id: 'rig', name: 'Rigging', color: 'var(--semantic-info)' }],
      createdAt: '2025-07-15T09:00:00Z',
      updatedAt: '2025-08-10T17:30:00Z',
      dueDate: '2025-08-15T23:59:59Z',
      estimatedHours: 56
    }
  ]

  // Department configuration with design system pastel colors
  const departments = useMemo(() => [
    { id: 'animation', name: 'Animation', color: 'var(--accent-blue)', tasks: [] as KanbanTask[] },
    { id: 'modeling', name: 'Modeling', color: 'var(--accent-butter)', tasks: [] as KanbanTask[] },
    { id: 'lighting', name: 'Lighting', color: 'var(--accent-pink)', tasks: [] as KanbanTask[] },
    { id: 'compositing', name: 'Compositing', color: 'var(--accent-mint)', tasks: [] as KanbanTask[] },
    { id: 'fx', name: 'FX', color: 'var(--accent-lilac)', tasks: [] as KanbanTask[] },
    { id: 'rigging', name: 'Rigging', color: 'var(--semantic-info)', tasks: [] as KanbanTask[] },
    { id: 'general', name: 'General', color: 'var(--text-secondary)', tasks: [] as KanbanTask[] }
  ], [])

  // Users for grouping
  const users = useMemo(() => {
    const uniqueUsers = Array.from(
      new Set(mockTasks.map(task => task.assignee).filter(Boolean))
    )
    return uniqueUsers.map(user => ({
      ...user!,
      tasks: [] as KanbanTask[]
    }))
  }, [mockTasks])

  // Get department from task labels
  const getTaskDepartment = useCallback((task: KanbanTask): string => {
    const departmentLabel = task.labels?.find(label =>
      departments.some(dept => dept.name.toLowerCase() === label.name.toLowerCase())
    )
    if (departmentLabel) {
      // Find the matching department ID
      const matchingDept = departments.find(dept =>
        dept.name.toLowerCase() === departmentLabel.name.toLowerCase()
      )
      return matchingDept?.id || 'general'
    }
    return 'general'
  }, [departments])

  // Group tasks by department or user
  const groupedData = useMemo(() => {
    if (groupBy === 'department') {
      return departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        color: dept.color,
        tasks: mockTasks.filter(task => getTaskDepartment(task) === dept.id)
      })).filter(group => group.tasks.length > 0)
    } else {
      return users.map(user => ({
        id: user.id,
        name: user.name,
        color: '#6b7280', // Default gray for users
        avatar: user.avatar,
        tasks: mockTasks.filter(task => task.assignee?.id === user.id)
      })).filter(group => group.tasks.length > 0)
    }
  }, [groupBy, departments, users, mockTasks, getTaskDepartment])

  // Generate time periods for header - Linear.com style
  const timelineData = useMemo(() => {
    const startDate = new Date('2025-01-01')
    const endDate = new Date('2025-12-31')
    const today = new Date()

    // Generate months for top row
    const months = []
    let currentMonth = new Date(startDate)
    while (currentMonth <= endDate) {
      months.push({
        date: new Date(currentMonth),
        label: currentMonth.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        year: currentMonth.getFullYear(),
        daysInMonth: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
      })
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }

    // Generate periods for bottom row based on view mode
    const periods = []
    let current = new Date(startDate)

    if (viewMode === 'days') {
      while (current <= endDate) {
        periods.push({
          date: new Date(current),
          label: current.getDate().toString(),
          type: 'day',
          isToday: current.toDateString() === today.toDateString(),
          month: current.getMonth(),
          width: 40
        })
        current.setDate(current.getDate() + 1)
      }
    } else if (viewMode === 'weeks') {
      while (current <= endDate) {
        const weekStart = new Date(current)
        const weekEnd = new Date(current)
        weekEnd.setDate(weekEnd.getDate() + 6)

        periods.push({
          date: new Date(current),
          label: weekStart.getDate().toString(),
          type: 'week',
          isToday: today >= weekStart && today <= weekEnd,
          month: current.getMonth(),
          width: 120
        })
        current.setDate(current.getDate() + 7)
      }
    } else {
      while (current <= endDate) {
        periods.push({
          date: new Date(current),
          label: current.toLocaleDateString('en-US', { month: 'short' }),
          type: 'month',
          isToday: current.getMonth() === today.getMonth() && current.getFullYear() === today.getFullYear(),
          month: current.getMonth(),
          width: 160
        })
        current.setMonth(current.getMonth() + 1)
      }
    }

    // Calculate today position
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    const todayDays = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    const totalWidth = periods.reduce((sum, period) => sum + period.width, 0)
    const todayPosition = (todayDays / totalDays) * totalWidth

    return { months, periods, todayPosition, totalWidth, startDate, endDate }
  }, [viewMode])

  // Focus on today functionality - defined after timelineData
  const focusOnToday = useCallback(() => {
    try {
      if (scrollbarRef.current && timelineData) {
        // Calculate scroll position to center today
        const todayPosition = timelineData.todayPosition || 0
        const containerWidth = scrollbarRef.current.clientWidth || 800
        const scrollPosition = Math.max(0, todayPosition - containerWidth / 2)

        // Scroll the dedicated scrollbar, which will sync all other panels
        scrollbarRef.current.scrollLeft = scrollPosition
      }
    } catch (error) {
      console.warn('Error focusing on today:', error)
    }
  }, [timelineData])

  // Auto-focus on today when view mode changes
  useEffect(() => {
    if (timelineData && timelineData.todayPosition !== undefined) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        focusOnToday()
      }, 150)

      return () => clearTimeout(timer)
    }
  }, [viewMode, focusOnToday, timelineData])

  return (
    <PageWrapper maxWidth="full" padding={true} scrollable={true}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-base)',
        minHeight: '100vh'
      }}>
        
        {/* Header */}
        <div style={{
          height: '60px',
          borderBottom: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          justifyContent: 'space-between'
        }}>
          <Stack direction="horizontal" align="center" gap="md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/design-system')}
            >
              <ArrowLeft size={16} />
            </Button>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                🎯 NEW Timeline Demo - Linear.com Style
              </h1>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                This is the NEW dedicated timeline page (different from the widget)
              </p>
            </div>
          </Stack>

          <Stack direction="horizontal" align="center" gap="sm">


            <Button variant="ghost" size="sm">
              <Settings size={16} />
            </Button>
          </Stack>
        </div>

        {/* Filters Bar */}
        <div style={{
          height: '48px',
          borderBottom: '1px solid var(--border-secondary)',
          backgroundColor: 'var(--bg-surface-2)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: '16px'
        }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }} />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '32px' }}
            />
          </div>
          
          {/* Filter Dropdown - Next to Search */}
          <div ref={filterMenuRef} style={{ position: 'relative' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Filter size={16} />
              Filter
              <ChevronDown size={14} />
            </Button>

            {filterMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                width: '240px',
                backgroundColor: 'var(--bg-surface-1)', // Fixed: solid background
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                boxShadow: '0 8px 20px rgba(0,0,0,.15)',
                zIndex: 1000,
                padding: '12px'
              }}>
                {/* Group By Section */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Group By
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                      onClick={() => {
                        setGroupBy('department')
                        setFilterMenuOpen(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: groupBy === 'department' ? 'var(--accent-blue)' : 'var(--bg-surface-2)',
                        color: groupBy === 'department' ? 'white' : 'var(--text-primary)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Building2 size={16} />
                      Departments
                    </button>
                    <button
                      onClick={() => {
                        setGroupBy('user')
                        setFilterMenuOpen(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: groupBy === 'user' ? 'var(--accent-blue)' : 'var(--bg-surface-2)',
                        color: groupBy === 'user' ? 'white' : 'var(--text-primary)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Users size={16} />
                      Team Members
                    </button>
                  </div>
                </div>

                {/* Future filter options */}
                <div style={{
                  borderTop: '1px solid var(--border-secondary)',
                  paddingTop: '8px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  textAlign: 'center'
                }}>
                  More filters coming soon...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Widget Container - Fixed Height */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '600px', // Fixed widget height
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px',
          overflow: 'hidden',
          margin: '24px'
        }}>

          {/* Fixed Header - Day/Month/Quarter Controls */}
          <div style={{
            height: '48px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            flexShrink: 0
          }}>

            {/* Group Type Label */}
            <div style={{
              width: '280px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {groupBy === 'department' ? 'Departments' : 'Team Members'}
              </span>
            </div>

            {/* View Mode Controls - Fixed */}
            <div style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
              marginLeft: 'auto'
            }}>
              {['Days', 'Weeks', 'Months'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode.toLowerCase() as 'days' | 'weeks' | 'months')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: viewMode === mode.toLowerCase() ? 'var(--accent-blue)' : 'transparent',
                    color: viewMode === mode.toLowerCase() ? 'white' : 'var(--text-secondary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: viewMode === mode.toLowerCase() ? 600 : 400,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Navigation Controls */}
            <div style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
              marginLeft: '16px'
            }}>
              <Button variant="ghost" size="xs">
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={focusOnToday}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--accent-blue)',
                  padding: '4px 8px'
                }}
              >
                Today
              </Button>
              <Button variant="ghost" size="xs">
                <ChevronRight size={14} />
              </Button>
            </div>

          </div>



          {/* Horizontal Scrollbar Area */}
          {timelineData && (
            <div style={{
              height: '16px',
              backgroundColor: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-line)',
              display: 'flex',
              flexShrink: 0
            }}>
              {/* Left Panel Spacer */}
              <div style={{
                width: '280px',
                borderRight: '1px solid var(--border-line)',
                backgroundColor: 'var(--bg-surface-2)'
              }} />

              {/* Horizontal Scroll Control */}
              <div
                ref={scrollbarRef}
                onScroll={(e) => {
                  const scrollLeft = e.currentTarget.scrollLeft
                  handleScrollbarScroll(scrollLeft)
                }}
                style={{
                  flex: 1,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  height: '16px'
                }}
              >
                <div style={{
                  width: `${timelineData.totalWidth || 0}px`,
                  height: '1px'
                }} />
              </div>
            </div>
          )}

          {/* Scrollable Date Header */}
          <div style={{
            height: '40px',
            backgroundColor: 'var(--bg-surface-1)',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            flexShrink: 0
          }}>
            {/* Left Panel Spacer */}
            <div style={{
              width: '280px',
              borderRight: '1px solid var(--border-line)',
              backgroundColor: 'var(--bg-surface-2)'
            }} />

            {/* Scrollable Date Area */}
            <div
              ref={dateHeaderRef}
              style={{
                flex: 1,
                overflowX: 'hidden', // Hide scrollbar, controlled by dedicated scrollbar above
                overflowY: 'hidden'
              }}
            >
              <div style={{
                width: `${timelineData.totalWidth}px`,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}>
                {timelineData.periods.map((period, index) => (
                  <div
                    key={index}
                    style={{
                      width: `${period.width}px`,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column', // Changed to column for stacking
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: index < timelineData.periods.length - 1 ? '1px solid var(--border-line)' : 'none',
                      fontSize: '12px',
                      color: period.isToday ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      fontWeight: period.isToday ? 600 : 400,
                      backgroundColor: period.isToday ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                    }}
                  >
                    {/* Month label - on 1st of month (days) or first week of month (weeks) */}
                    {((viewMode === 'days' && period.date.getDate() === 1) ||
                      (viewMode === 'weeks' && period.date.getDate() <= 7)) && (
                      <div style={{
                        fontSize: '9px',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        opacity: 0.6, // Very subtle
                        marginBottom: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
                      }}>
                        {period.date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    )}

                    {/* Day number */}
                    <div>
                      {period.label}
                    </div>
                  </div>
                ))}

                {/* Today vertical line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${timelineData.todayPosition}px`,
                  width: '2px',
                  backgroundColor: 'var(--accent-blue)',
                  zIndex: 5
                }} />
              </div>
            </div>
          </div>

          {/* Main Content Area - Vertical Scroll Container */}
          <div style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            height: 'calc(600px - 48px - 40px)' // Exact height: 512px
          }}>

            {/* Left Panel - Departments/Users (Vertical Scroll) */}
            <div
              ref={leftPanelRef}
              onScroll={handleLeftPanelScroll}
              style={{
                width: '280px',
                height: '100%', // Match container height exactly
                borderRight: '1px solid var(--border-line)',
                backgroundColor: 'var(--bg-surface-2)',
                overflowY: 'auto',
                overflowX: 'hidden'
              }}
            >
              {groupedData.map((group, index) => (
                <div
                  key={group.id}
                  style={{
                    height: '60px', // Match TimelineWidget exactly
                    borderBottom: index < groupedData.length - 1 ? '1px solid var(--border-line)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    backgroundColor: `color-mix(in srgb, ${group.color} 8%, transparent)`,
                    borderLeft: `3px solid ${group.color}`,
                    boxSizing: 'border-box' // Ensure padding doesn't affect height
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: 1
                  }}>
                    {groupBy === 'user' && group.avatar ? (
                      <Avatar
                        src={group.avatar}
                        fallback={group.name}
                        size="sm"
                      />
                    ) : (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: group.color,
                        flexShrink: 0
                      }} />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {group.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)'
                      }}>
                        {group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Panel - Timeline Grid (Vertical Scroll Only) */}
            <div
              ref={rightPanelRef}
              onScroll={handleRightPanelScroll}
              style={{
                flex: 1,
                height: '100%', // Match container height exactly
                overflowX: 'hidden', // Hide horizontal scrollbar, controlled by dedicated scrollbar above
                overflowY: 'auto',
                position: 'relative'
              }}
            >
              {/* Scrollable Content Container */}
              <div
                className="timeline__content"
                style={{
                  width: `${timelineData.totalWidth}px`,
                  minWidth: `${timelineData.totalWidth}px`,
                  position: 'relative',
                  minHeight: '100%',
                  margin: 0,
                  padding: 0
                }}
              >
                {/* Grid Background */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex'
                }}>
                  {timelineData.periods.map((period, index) => (
                    <div
                      key={index}
                      style={{
                        width: `${period.width}px`,
                        borderRight: index < timelineData.periods.length - 1 ? '1px solid var(--border-line)' : 'none',
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--bg-surface-1)'
                      }}
                    />
                  ))}
                </div>

                {/* Today vertical line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${timelineData.todayPosition}px`,
                  width: '2px',
                  backgroundColor: 'var(--accent-blue)',
                  zIndex: 10,
                  opacity: 0.8
                }} />

                {/* Timeline Rows - Match TimelineWidget */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1
                }}>
                  {groupedData.map((group, groupIndex) => (
                    <div
                      key={group.id}
                      style={{
                        height: '60px', // Match TimelineWidget exactly
                        borderBottom: groupIndex < groupedData.length - 1 ? '1px solid var(--border-line)' : 'none',
                        position: 'relative',
                        backgroundColor: `color-mix(in srgb, ${group.color} 4%, var(--bg-surface-1))`,
                        boxSizing: 'border-box', // Ensure consistent box model
                        display: 'flex',
                        alignItems: 'center', // Match left panel alignment
                        margin: 0,
                        padding: 0
                      }}
                    >
                    {/* Task bars positioned absolutely within this row */}
                    {group.tasks.map(task => {
                      // Calculate task position based on dates
                      const taskStart = new Date(task.createdAt || '2025-08-15')
                      const taskEnd = new Date(task.dueDate || '2025-09-15')

                      const totalDays = (timelineData.endDate.getTime() - timelineData.startDate.getTime()) / (1000 * 60 * 60 * 24)
                      const taskStartDays = (taskStart.getTime() - timelineData.startDate.getTime()) / (1000 * 60 * 60 * 24)
                      const taskDurationDays = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)

                      const left = (taskStartDays / totalDays) * timelineData.totalWidth
                      const width = Math.max((taskDurationDays / totalDays) * timelineData.totalWidth, 60) // Minimum width

                      // Get department color for this task
                      const taskDepartment = getTaskDepartment(task)
                      const departmentInfo = departments.find(dept => dept.id === taskDepartment)
                      const departmentColor = departmentInfo?.color || group.color

                      // Convert KanbanTask to UITask for task detail panel
                      const handleTaskClick = () => {
                        // Create a minimal working UITask
                        const uiTask: UITask = {
                          id: task.id,
                          title: task.title,
                          project: 'DEMO',
                          projectName: 'Animation Demo Project',
                          type: 'shot',
                          episode: 'EP01',
                          sequence: 'SEQ01',
                          shot: 'SH01',
                          task: task.labels?.[0]?.name.toLowerCase() || 'general',
                          artist: task.assignee?.name || 'Demo Artist',
                          assignee: task.assignee?.name,
                          status: task.status === 'done' ? 'approved' :
                                 task.status === 'in_progress' ? 'in_progress' : 'not_started',
                          milestone: 'scene_building',
                          milestone_note: task.description || 'Demo task for timeline visualization',
                          frame_range: { start: 1001, end: 1100 },
                          priority: task.priority || 'medium',
                          start_time: task.createdAt || new Date().toISOString(),
                          deadline: task.dueDate,
                          dueDate: task.dueDate,
                          actual_time_logged: task.actualHours || 0,
                          estimated_duration_hours: task.estimatedHours || 8,
                          versions: ['v001', 'v002'],
                          client_submission_history: [],
                          current_version: 'v002',
                          published_version: 'v001',
                          file_extension: '.ma',
                          master_file: true,
                          working_file_path: '',
                          render_output_path: '',
                          media_file_path: '',
                          cache_file_path: '',
                          filename: '',
                          sequence_clean: 'SEQ01',
                          shot_clean: 'SH01',
                          episode_clean: 'EP01',
                          _created_at: task.createdAt || new Date().toISOString(),
                          _updated_at: task.updatedAt || new Date().toISOString(),
                          // UI-specific fields
                          displayAssignees: task.assignee ? [task.assignee.name] : ['Demo Artist'],
                          displayLabels: task.labels?.map(l => ({
                            id: l.id,
                            name: l.name,
                            color: l.color
                          })) || [],
                          linkedTasks: []
                        }

                        openTaskDetail(uiTask)
                      }

                      return (
                        <div
                          key={task.id}
                          onClick={handleTaskClick}
                          style={{
                            position: 'absolute',
                            left: `${left}px`,
                            width: `${width}px`,
                            height: '28px',
                            top: '14px',
                            backgroundColor: task.status === 'done' ? 'var(--semantic-success)' :
                                           task.status === 'in_progress' ? departmentColor :
                                           departmentColor,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 8px',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: 'white',
                            overflow: 'hidden',
                            transition: 'all 0.15s ease',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)'
                          }}
                        >
                          <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1
                          }}>
                            {task.title}
                          </span>

                          {task.assignee && width > 100 && (
                            <Avatar
                              src={task.assignee.avatar}
                              fallback={task.assignee.name}
                              size="xs"
                              style={{ marginLeft: '6px' }}
                            />
                          )}
                        </div>
                      )
                    })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default TimelineDemo
