import React, { useState, useRef, useCallback, useMemo } from 'react'
import { clsx } from 'clsx'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Calendar, Target } from 'lucide-react'
import { TimelineProps, TimelineViewConfig } from '@/types/designSystem'
import TimelineEvent from './TimelineEvent'
import TimelineMilestone from './TimelineMilestone'
import Button from './Button'
import Tooltip from './Tooltip'
import { Stack } from '@/components/layout'

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (props, ref) => {
    const {
      events = [],
      milestones = [],
      startDate,
      endDate,
      onEventClick,
      onMilestoneClick,
      onDateRangeChange,
      viewMode = 'weeks',
      showToday = true,
      showWeekends = true,
      height = '400px',
      className,
      style,
      loading = false,
      zoomable = true,
      interactive = true,
      ...restProps
    } = props
    const [viewConfig, setViewConfig] = useState<TimelineViewConfig>({
      viewMode,
      startDate,
      endDate,
      zoomLevel: 1,
      showWeekends,
      showToday
    })
    
    const timelineRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    // Format time marker labels
    const formatTimeMarker = useCallback((date: Date, mode: string) => {
      switch (mode) {
        case 'days':
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        case 'weeks':
          return `Week ${getWeekNumber(date)}`
        case 'months':
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        case 'quarters':
          return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`
        default:
          return date.toLocaleDateString()
      }
    }, [])

    // Get week number
    const getWeekNumber = useCallback((date: Date) => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
    }, [])

    // Calculate timeline dimensions and scale
    const timelineData = useMemo(() => {
      const start = new Date(viewConfig.startDate)
      const end = new Date(viewConfig.endDate)
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      
      let unitWidth = 40 // Base width per unit
      let unitsPerDay = 1
      
      switch (viewConfig.viewMode) {
        case 'days':
          unitWidth = 60 * viewConfig.zoomLevel
          unitsPerDay = 1
          break
        case 'weeks':
          unitWidth = 100 * viewConfig.zoomLevel
          unitsPerDay = 1/7
          break
        case 'months':
          unitWidth = 120 * viewConfig.zoomLevel
          unitsPerDay = 1/30
          break
        case 'quarters':
          unitWidth = 150 * viewConfig.zoomLevel
          unitsPerDay = 1/90
          break
      }
      
      const totalWidth = totalDays * unitsPerDay * unitWidth
      
      return {
        start,
        end,
        totalDays,
        unitWidth,
        unitsPerDay,
        totalWidth
      }
    }, [viewConfig])

    // Generate time scale markers
    const timeMarkers = useMemo(() => {
      const markers = []
      const { start, end, unitWidth, unitsPerDay } = timelineData
      
      let current = new Date(start)
      let position = 0
      
      while (current <= end) {
        const isWeekend = current.getDay() === 0 || current.getDay() === 6
        
        if (viewConfig.showWeekends || !isWeekend) {
          markers.push({
            date: new Date(current),
            position,
            isWeekend,
            label: formatTimeMarker(current, viewConfig.viewMode)
          })
        }
        
        // Increment based on view mode
        switch (viewConfig.viewMode) {
          case 'days':
            current.setDate(current.getDate() + 1)
            position += unitWidth
            break
          case 'weeks':
            current.setDate(current.getDate() + 7)
            position += unitWidth
            break
          case 'months':
            current.setMonth(current.getMonth() + 1)
            position += unitWidth
            break
          case 'quarters':
            current.setMonth(current.getMonth() + 3)
            position += unitWidth
            break
        }
      }
      
      return markers
    }, [timelineData, viewConfig, formatTimeMarker, getWeekNumber])

    // Calculate position for a date
    const getDatePosition = useCallback((date: string) => {
      const targetDate = new Date(date)
      const { start, unitsPerDay, unitWidth } = timelineData
      const daysDiff = (targetDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff * unitsPerDay * unitWidth
    }, [timelineData])

    // Handle zoom
    const handleZoom = useCallback((direction: 'in' | 'out') => {
      if (!zoomable) return
      
      setViewConfig(prev => ({
        ...prev,
        zoomLevel: direction === 'in' 
          ? Math.min(prev.zoomLevel * 1.5, 3)
          : Math.max(prev.zoomLevel / 1.5, 0.5)
      }))
    }, [zoomable])

    // Handle view mode change
    const handleViewModeChange = useCallback((mode: TimelineViewConfig['viewMode']) => {
      setViewConfig(prev => ({ ...prev, viewMode: mode }))
    }, [])

    // Handle navigation
    const handleNavigate = useCallback((direction: 'prev' | 'next') => {
      const { start, end } = timelineData
      const duration = end.getTime() - start.getTime()
      const shift = direction === 'next' ? duration * 0.5 : -duration * 0.5
      
      const newStart = new Date(start.getTime() + shift)
      const newEnd = new Date(end.getTime() + shift)
      
      const newConfig = {
        ...viewConfig,
        startDate: newStart.toISOString(),
        endDate: newEnd.toISOString()
      }
      
      setViewConfig(newConfig)
      onDateRangeChange?.(newConfig.startDate, newConfig.endDate)
    }, [timelineData, viewConfig, onDateRangeChange])

    // Get today position
    const todayPosition = useMemo(() => {
      if (!showToday) return null
      const today = new Date().toISOString()
      return getDatePosition(today)
    }, [showToday, getDatePosition])

    if (loading) {
      return (
        <div 
          ref={ref}
          className={clsx('timeline', 'timeline--loading', className)}
          style={{ ...style, height }}
          {...restProps}
        >
          <div className="timeline__loading">
            <div className="loading-spinner" />
            <span>Loading timeline...</span>
          </div>
        </div>
      )
    }

    return (
      <div 
        ref={ref}
        className={clsx('timeline', className)}
        style={{ ...style, height }}
        {...restProps}
      >
        {/* Timeline Header */}
        <div className="timeline__header">
          <Stack direction="horizontal" justify="between" align="center">
            {/* View Mode Controls */}
            <div className="timeline__view-controls">
              <Stack direction="horizontal" gap="xs">
                {(['days', 'weeks', 'months', 'quarters'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewConfig.viewMode === mode ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewModeChange(mode)}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </Stack>
            </div>

            {/* Navigation and Zoom Controls */}
            <Stack direction="horizontal" gap="xs">
              {/* Navigation */}
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ChevronLeft size={16} />}
                onClick={() => handleNavigate('prev')}
              >
                Previous
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ChevronRight size={16} />}
                onClick={() => handleNavigate('next')}
              >
                Next
              </Button>

              {/* Zoom Controls */}
              {zoomable && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleZoom('out')}
                    disabled={viewConfig.zoomLevel <= 0.5}
                  >
                    <ZoomOut size={16} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleZoom('in')}
                    disabled={viewConfig.zoomLevel >= 3}
                  >
                    <ZoomIn size={16} />
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </div>

        {/* Timeline Content */}
        <div 
          ref={timelineRef}
          className="timeline__container"
        >
          <div 
            ref={contentRef}
            className="timeline__content"
            style={{ width: timelineData.totalWidth }}
          >
            {/* Time Scale */}
            <div className="timeline__scale">
              {timeMarkers.map((marker, index) => (
                <div
                  key={index}
                  className={clsx('timeline__marker', {
                    'timeline__marker--weekend': marker.isWeekend
                  })}
                  style={{ left: marker.position }}
                >
                  <span className="timeline__marker-label">
                    {marker.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Today Line */}
            {todayPosition !== null && todayPosition >= 0 && todayPosition <= timelineData.totalWidth && (
              <div 
                className="timeline__today-line"
                style={{ left: todayPosition }}
              >
                <Tooltip content="Today">
                  <div className="timeline__today-marker">
                    <Calendar size={12} />
                  </div>
                </Tooltip>
              </div>
            )}

            {/* Events */}
            <div className="timeline__events">
              {events.map((event) => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  viewConfig={viewConfig}
                  onClick={interactive ? onEventClick : undefined}
                  style={{ left: getDatePosition(event.startDate) }}
                />
              ))}
            </div>

            {/* Milestones */}
            <div className="timeline__milestones">
              {milestones.map((milestone) => (
                <TimelineMilestone
                  key={milestone.id}
                  milestone={milestone}
                  viewConfig={viewConfig}
                  onClick={interactive ? onMilestoneClick : undefined}
                  style={{ left: getDatePosition(milestone.date) }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

Timeline.displayName = 'Timeline'

export default Timeline
