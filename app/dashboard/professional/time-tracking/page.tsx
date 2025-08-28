'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Calendar, Play, Pause, Store as Stop, Save, X, BarChart, DollarSign, Filter, ArrowRight, ArrowLeft, CheckCircle, Briefcase } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { projectService, Project, TimeEntry } from '@/lib/project-management'
import Link from 'next/link'

export default function TimeTrackingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tracker')
  
  // Time tracking states
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [selectedMilestone, setSelectedMilestone] = useState<string>('')
  const [trackingDescription, setTrackingDescription] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isBillable, setIsBillable] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Manual time entry states
  const [manualProject, setManualProject] = useState<string>('')
  const [manualMilestone, setManualMilestone] = useState<string>('')
  const [manualDescription, setManualDescription] = useState('')
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0])
  const [manualStartTime, setManualStartTime] = useState('09:00')
  const [manualEndTime, setManualEndTime] = useState('17:00')
  const [manualBillable, setManualBillable] = useState(true)
  const [submittingManual, setSubmittingManual] = useState(false)
  
  // Filter states
  const [dateFilter, setDateFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [billableFilter, setBillableFilter] = useState('all')

  useEffect(() => {
    const getData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)

        // Get user's projects
        const projectsData = await projectService.getUserProjects(user.id)
        setProjects(projectsData)

        // Get time entries
        const timeEntriesData = await projectService.getProfessionalTimeEntries(user.id)
        setTimeEntries(timeEntriesData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    getData()

    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [router])

  // Time tracking functions
  const startTimeTracking = () => {
    if (!selectedProject || !trackingDescription) return
    
    const now = new Date()
    setTrackingStartTime(now)
    setIsTracking(true)
    setElapsedTime(0)
    
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
  }

  const pauseTimeTracking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    // We don't reset the elapsed time or tracking state
    // Just pause the timer
  }

  const resumeTimeTracking = () => {
    if (!isTracking || !trackingStartTime) return
    
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
  }

  const stopTimeTracking = async () => {
    if (!trackingStartTime || !selectedProject || !trackingDescription) return
    
    setIsTracking(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    try {
      const endTime = new Date()
      const durationMinutes = Math.round((endTime.getTime() - trackingStartTime.getTime()) / (1000 * 60))
      
      const selectedProjectObj = projects.find(p => p.id === selectedProject)
      
      const timeEntryData = {
        project_id: selectedProject,
        professional_id: user.id,
        milestone_id: selectedMilestone || undefined,
        entry_type: 'work' as const,
        description: trackingDescription,
        start_time: trackingStartTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: durationMinutes,
        hourly_rate: selectedProjectObj?.hourly_rate,
        is_billable: isBillable
      }
      
      const newTimeEntry = await projectService.createTimeEntry(timeEntryData)
      setTimeEntries(prev => [newTimeEntry, ...prev])
      
      // Reset form
      setTrackingDescription('')
      setSelectedMilestone('')
      setTrackingStartTime(null)
      setElapsedTime(0)
    } catch (error) {
      console.error('Error saving time entry:', error)
    }
  }

  const cancelTimeTracking = () => {
    setIsTracking(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setTrackingStartTime(null)
    setElapsedTime(0)
  }

  const submitManualTimeEntry = async () => {
    if (!manualProject || !manualDescription || !manualDate || !manualStartTime || !manualEndTime) return
    
    setSubmittingManual(true)
    try {
      const startDateTime = new Date(`${manualDate}T${manualStartTime}:00`)
      const endDateTime = new Date(`${manualDate}T${manualEndTime}:00`)
      
      // Calculate duration in minutes
      const durationMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60)
      
      if (durationMinutes <= 0) {
        alert('End time must be after start time')
        setSubmittingManual(false)
        return
      }
      
      const selectedProjectObj = projects.find(p => p.id === manualProject)
      
      const timeEntryData = {
        project_id: manualProject,
        professional_id: user.id,
        milestone_id: manualMilestone || undefined,
        entry_type: 'work' as const,
        description: manualDescription,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        duration_minutes: durationMinutes,
        hourly_rate: selectedProjectObj?.hourly_rate,
        is_billable: manualBillable
      }
      
      const newTimeEntry = await projectService.createTimeEntry(timeEntryData)
      setTimeEntries(prev => [newTimeEntry, ...prev])
      
      // Reset form
      setManualDescription('')
      setManualMilestone('')
      setManualDate(new Date().toISOString().split('T')[0])
      setManualStartTime('09:00')
      setManualEndTime('17:00')
    } catch (error) {
      console.error('Error saving manual time entry:', error)
    } finally {
      setSubmittingManual(false)
    }
  }

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getFilteredTimeEntries = () => {
    return timeEntries.filter(entry => {
      // Date filter
      const entryDate = new Date(entry.start_time)
      const now = new Date()
      
      const dateMatches = 
        dateFilter === 'all' ||
        (dateFilter === 'today' && 
          entryDate.getDate() === now.getDate() &&
          entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear()) ||
        (dateFilter === 'week' && 
          entryDate >= new Date(now.setDate(now.getDate() - now.getDay()))) ||
        (dateFilter === 'month' && 
          entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear())
      
      // Project filter
      const projectMatches = 
        projectFilter === 'all' ||
        entry.project_id === projectFilter
      
      // Billable filter
      const billableMatches = 
        billableFilter === 'all' ||
        (billableFilter === 'billable' && entry.is_billable) ||
        (billableFilter === 'non-billable' && !entry.is_billable)
      
      return dateMatches && projectMatches && billableMatches
    })
  }

  const filteredEntries = getFilteredTimeEntries()

  const getTotalHours = (entries: TimeEntry[]) => {
    return entries.reduce((total, entry) => total + (entry.duration_minutes || 0), 0) / 60
  }

  const getTotalBillableAmount = (entries: TimeEntry[]) => {
    return entries
      .filter(entry => entry.is_billable)
      .reduce((total, entry) => {
        const hours = (entry.duration_minutes || 0) / 60
        return total + (hours * (entry.hourly_rate || 0))
      }, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading time tracking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Tracking</h1>
          <p className="text-gray-600">
            Track your working hours and manage your time entries
          </p>
        </div>

        {/* Time Tracking Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracker" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Time Tracker
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <BarChart className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Time Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Track Time</CardTitle>
                <CardDescription>
                  Track your working hours in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project">Project *</Label>
                      <select
                        id="project"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        disabled={isTracking}
                      >
                        <option value="">Select a project</option>
                        {projects
                          .filter(p => ['planning', 'in_progress'].includes(p.status))
                          .map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.title}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="milestone">Milestone (optional)</Label>
                      <select
                        id="milestone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedMilestone}
                        onChange={(e) => setSelectedMilestone(e.target.value)}
                        disabled={!selectedProject || isTracking}
                      >
                        <option value="">Select a milestone</option>
                        {projects
                          .find(p => p.id === selectedProject)
                          ?.milestones?.map((milestone) => (
                            <option key={milestone.id} value={milestone.id}>
                              {milestone.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      placeholder="What are you working on?"
                      value={trackingDescription}
                      onChange={(e) => setTrackingDescription(e.target.value)}
                      disabled={isTracking}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="billable"
                      checked={isBillable}
                      onChange={(e) => setIsBillable(e.target.checked)}
                      disabled={isTracking}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="billable">Billable time</Label>
                  </div>
                  
                  {isTracking ? (
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {formatElapsedTime(elapsedTime)}
                        </div>
                        <p className="text-gray-600">{trackingDescription}</p>
                        {selectedProject && (
                          <p className="text-sm text-gray-500 mt-1">
                            {projects.find(p => p.id === selectedProject)?.title}
                            {selectedMilestone && ` - ${projects.find(p => p.id === selectedProject)?.milestones?.find(m => m.id === selectedMilestone)?.title}`}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex justify-center space-x-3">
                        <Button 
                          variant="outline"
                          onClick={cancelTimeTracking}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Discard
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={timerRef.current ? pauseTimeTracking : resumeTimeTracking}
                        >
                          {timerRef.current ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={stopTimeTracking}
                        >
                          <Stop className="w-4 h-4 mr-2" />
                          Stop & Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={startTimeTracking}
                      disabled={!selectedProject || !trackingDescription}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Tracking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Time Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {timeEntries.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">No time entries recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">{entry.description}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                {entry.project?.title || 'Project'}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(entry.start_time).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(entry.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {' - '}
                                {entry.end_time ? new Date(entry.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In progress'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {projectService.formatDuration(entry.duration_minutes || 0)}
                            </div>
                            {entry.hourly_rate && entry.is_billable && (
                              <div className="text-sm text-gray-600">
                                ${((entry.duration_minutes || 0) / 60 * entry.hourly_rate).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <Badge variant={entry.is_billable ? 'default' : 'outline'} className="text-xs">
                            {entry.is_billable ? 'Billable' : 'Non-billable'}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {timeEntries.length > 5 && (
                      <div className="text-center mt-4">
                        <Button variant="outline" onClick={() => setActiveTab('reports')}>
                          View All Time Entries
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Time Entry</CardTitle>
                <CardDescription>
                  Add time entries for work you've already completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="manualProject">Project *</Label>
                      <select
                        id="manualProject"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={manualProject}
                        onChange={(e) => setManualProject(e.target.value)}
                      >
                        <option value="">Select a project</option>
                        {projects
                          .filter(p => ['planning', 'in_progress'].includes(p.status))
                          .map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.title}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manualMilestone">Milestone (optional)</Label>
                      <select
                        id="manualMilestone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={manualMilestone}
                        onChange={(e) => setManualMilestone(e.target.value)}
                        disabled={!manualProject}
                      >
                        <option value="">Select a milestone</option>
                        {projects
                          .find(p => p.id === manualProject)
                          ?.milestones?.map((milestone) => (
                            <option key={milestone.id} value={milestone.id}>
                              {milestone.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manualDescription">Description *</Label>
                    <Input
                      id="manualDescription"
                      placeholder="What did you work on?"
                      value={manualDescription}
                      onChange={(e) => setManualDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="manualDate">Date *</Label>
                      <Input
                        id="manualDate"
                        type="date"
                        value={manualDate}
                        onChange={(e) => setManualDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manualStartTime">Start Time *</Label>
                      <Input
                        id="manualStartTime"
                        type="time"
                        value={manualStartTime}
                        onChange={(e) => setManualStartTime(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manualEndTime">End Time *</Label>
                      <Input
                        id="manualEndTime"
                        type="time"
                        value={manualEndTime}
                        onChange={(e) => setManualEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="manualBillable"
                      checked={manualBillable}
                      onChange={(e) => setManualBillable(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="manualBillable">Billable time</Label>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={submitManualTimeEntry}
                      disabled={!manualProject || !manualDescription || !manualDate || !manualStartTime || !manualEndTime || submittingManual}
                    >
                      {submittingManual ? 'Saving...' : 'Save Time Entry'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Time Entry Reports</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dateFilter" className="text-sm">Date Range</Label>
                      <select
                        id="dateFilter"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="projectFilter" className="text-sm">Project</Label>
                      <select
                        id="projectFilter"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={projectFilter}
                        onChange={(e) => setProjectFilter(e.target.value)}
                      >
                        <option value="all">All Projects</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="billableFilter" className="text-sm">Billable Status</Label>
                      <select
                        id="billableFilter"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={billableFilter}
                        onChange={(e) => setBillableFilter(e.target.value)}
                      >
                        <option value="all">All Entries</option>
                        <option value="billable">Billable Only</option>
                        <option value="non-billable">Non-billable Only</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Total Hours</h3>
                      <p className="text-2xl font-bold text-blue-600">{getTotalHours(filteredEntries).toFixed(1)}</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Billable Amount</h3>
                      <p className="text-2xl font-bold text-green-600">
                        ${getTotalBillableAmount(filteredEntries).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Billable Hours</h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {getTotalHours(filteredEntries.filter(e => e.is_billable)).toFixed(1)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Time Entries Table */}
                  {filteredEntries.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-600">No time entries match your filters</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEntries.map((entry) => (
                        <div key={entry.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900">{entry.description}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center">
                                  <Briefcase className="h-4 w-4 mr-1" />
                                  {entry.project?.title || 'Project'}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(entry.start_time).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {new Date(entry.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {' - '}
                                  {entry.end_time ? new Date(entry.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In progress'}
                                </div>
                                {entry.milestone && (
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    {entry.milestone.title}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                {projectService.formatDuration(entry.duration_minutes || 0)}
                              </div>
                              {entry.hourly_rate && entry.is_billable && (
                                <div className="text-sm text-gray-600">
                                  ${((entry.duration_minutes || 0) / 60 * entry.hourly_rate).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Badge variant={entry.is_billable ? 'default' : 'outline'} className="text-xs">
                                {entry.is_billable ? 'Billable' : 'Non-billable'}
                              </Badge>
                              <Badge variant={entry.is_approved ? 'default' : 'outline'} className={`text-xs ${entry.is_approved ? 'bg-green-100 text-green-800' : ''}`}>
                                {entry.is_approved ? 'Approved' : 'Pending Approval'}
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}