'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Briefcase, 
  Clock, 
  Calendar,
  CheckCircle,
  FileText,
  BarChart,
  DollarSign,
  Plus,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Users,
  MessageSquare,
  Upload,
  Play,
  Pause,
  Timer,
  Save,
  X
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { projectService, Project, ProjectMilestone, TimeEntry, ProjectUpdate, ProjectFile } from '@/lib/project-management'
import { fileUpload, UploadedFile } from '@/lib/file-upload'
import Link from 'next/link'

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Time tracking states
  const [isTracking, setIsTracking] = useState(false)
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [trackingDescription, setTrackingDescription] = useState('')
  const [selectedMilestone, setSelectedMilestone] = useState<string>('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // New update states
  const [newUpdateTitle, setNewUpdateTitle] = useState('')
  const [newUpdateContent, setNewUpdateContent] = useState('')
  const [submittingUpdate, setSubmittingUpdate] = useState(false)
  
  // File upload states
  const [uploadingFile, setUploadingFile] = useState(false)
  const [fileCategory, setFileCategory] = useState('')
  const [fileDescription, setFileDescription] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  useEffect(() => {
    const getProjectDetails = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)

        // Get project details
        const projectData = await projectService.getProject(params.id)
        setProject(projectData)

        // Get project milestones
        const milestonesData = await projectService.getProjectMilestones(params.id)
        setMilestones(milestonesData)

        // Get time entries
        const timeEntriesData = await projectService.getProjectTimeEntries(params.id)
        setTimeEntries(timeEntriesData)

        // Get project updates
        const updatesData = await projectService.getProjectUpdates(params.id)
        setUpdates(updatesData)

        // Get project files
        const filesData = await projectService.getProjectFiles(params.id)
        setFiles(filesData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    getProjectDetails()

    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [params.id, router])

  // Time tracking functions
  const startTimeTracking = () => {
    const now = new Date()
    setTrackingStartTime(now)
    setIsTracking(true)
    setElapsedTime(0)
    
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
  }

  const stopTimeTracking = async () => {
    if (!trackingStartTime || !trackingDescription) return
    
    setIsTracking(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    try {
      const endTime = new Date()
      const durationMinutes = Math.round((endTime.getTime() - trackingStartTime.getTime()) / (1000 * 60))
      
      const timeEntryData = {
        project_id: params.id,
        professional_id: user.id,
        milestone_id: selectedMilestone || undefined,
        entry_type: 'work',
        description: trackingDescription,
        start_time: trackingStartTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: durationMinutes,
        hourly_rate: project?.hourly_rate,
        is_billable: true
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

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Submit project update
  const submitUpdate = async () => {
    if (!newUpdateContent) return
    
    setSubmittingUpdate(true)
    try {
      const updateData = {
        project_id: params.id,
        author_id: user.id,
        milestone_id: selectedMilestone || undefined,
        update_type: 'general',
        title: newUpdateTitle || undefined,
        content: newUpdateContent,
        is_public: true,
        is_important: false
      }
      
      const newUpdate = await projectService.createProjectUpdate(updateData)
      setUpdates(prev => [newUpdate, ...prev])
      
      // Reset form
      setNewUpdateTitle('')
      setNewUpdateContent('')
      setSelectedMilestone('')
    } catch (error) {
      console.error('Error creating update:', error)
    } finally {
      setSubmittingUpdate(false)
    }
  }

  // File upload handler
  const handleFileUploaded = async (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file])
  }

  const submitFileUpload = async () => {
    if (uploadedFiles.length === 0) return
    
    setUploadingFile(true)
    try {
      for (const file of uploadedFiles) {
        const fileData = {
          project_id: params.id,
          uploader_id: user.id,
          milestone_id: selectedMilestone || undefined,
          file_name: file.file_name,
          file_size: file.file_size,
          file_type: file.file_type,
          file_url: file.file_url,
          storage_path: file.storage_path,
          category: fileCategory || undefined,
          description: fileDescription || undefined,
          is_public: true
        }
        
        const newFile = await projectService.createProjectFile(fileData)
        setFiles(prev => [newFile, ...prev])
      }
      
      // Reset form
      setFileCategory('')
      setFileDescription('')
      setSelectedMilestone('')
      setUploadedFiles([])
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploadingFile(false)
    }
  }

  const getStatusColor = (status: string) => {
    return projectService.getProjectStatusColor(status)
  }

  const getMilestoneStatusColor = (status: string) => {
    return projectService.getMilestoneStatusColor(status)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '$0'
    return `$${amount.toLocaleString()}`
  }

  const formatFileSize = (bytes: number) => {
    return fileUpload.formatFileSize(bytes)
  }

  const getFileIcon = (fileType: string) => {
    return fileUpload.getFileIcon(fileType)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Project Not Found</h3>
            <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
            <Link href="/dashboard/professional/projects">
              <Button>Back to Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        {/* Project Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.replace('_', ' ').slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(project.start_date)} - {formatDate(project.end_date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {project.total_hours_logged.toFixed(1)} hrs logged
                  </div>
                  {project.hourly_rate && (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${project.hourly_rate}/hr
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{project.completion_percentage}%</span>
                  </div>
                  <Progress value={project.completion_percentage} className="h-2" />
                </div>

                {project.description && (
                  <p className="text-gray-700 mb-4">{project.description}</p>
                )}
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={project.hirer?.avatar_url} alt={project.hirer?.company_name || ''} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {project.hirer?.company_name?.[0] || project.hirer?.first_name?.[0] || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-medium">
                      {project.hirer?.company_name || 
                       (project.hirer?.first_name && project.hirer?.last_name ? 
                        `${project.hirer.first_name} ${project.hirer.last_name}` : 
                        'Client')}
                    </p>
                  </div>
                </div>
                
                {project.total_budget && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(project.total_budget)}
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Client
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="time">Time Tracking</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Stats */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-medium">{formatDate(project.start_date)}</p>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-medium">{formatDate(project.end_date)}</p>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Hours Logged</p>
                        <p className="font-medium">{project.total_hours_logged.toFixed(1)} hrs</p>
                      </div>
                      
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Completion</p>
                        <p className="font-medium">{project.completion_percentage}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Updates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {updates.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-600">No updates yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {updates.slice(0, 3).map((update) => (
                          <div key={update.id} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={update.author?.avatar_url} alt={update.author?.first_name || ''} />
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                  {update.author?.first_name?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium">
                                    {update.author?.first_name} {update.author?.last_name}
                                  </p>
                                  <span className="text-xs text-gray-500">
                                    {new Date(update.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                {update.title && (
                                  <p className="font-medium text-gray-900 mt-1">{update.title}</p>
                                )}
                                <p className="text-gray-700 mt-1">{update.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {updates.length > 3 && (
                          <div className="text-center mt-4">
                            <Button variant="outline" size="sm" onClick={() => setActiveTab('updates')}>
                              View All Updates
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Milestones */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {milestones.filter(m => m.status !== 'completed').length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-600">No upcoming milestones</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {milestones
                          .filter(m => m.status !== 'completed')
                          .sort((a, b) => new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime())
                          .slice(0, 3)
                          .map((milestone) => (
                            <div key={milestone.id} className="border-b pb-3 last:border-0 last:pb-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-gray-900">{milestone.title}</p>
                                <Badge className={getMilestoneStatusColor(milestone.status)}>
                                  {milestone.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  {formatDate(milestone.due_date)}
                                </div>
                                <span>{milestone.completion_percentage}% complete</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('milestones')}>
                        View All Milestones
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Time Entry */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Time Entry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isTracking ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {formatElapsedTime(elapsedTime)}
                          </div>
                          <p className="text-sm text-gray-600">Time tracking in progress</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={cancelTimeTracking}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={stopTimeTracking}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="trackingDescription">What are you working on?</Label>
                          <Input
                            id="trackingDescription"
                            placeholder="e.g., Implementing project features"
                            value={trackingDescription}
                            onChange={(e) => setTrackingDescription(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="trackingMilestone">Milestone (optional)</Label>
                          <select
                            id="trackingMilestone"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedMilestone}
                            onChange={(e) => setSelectedMilestone(e.target.value)}
                          >
                            <option value="">Select a milestone</option>
                            {milestones.map((milestone) => (
                              <option key={milestone.id} value={milestone.id}>
                                {milestone.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <Button 
                          className="w-full"
                          onClick={startTimeTracking}
                          disabled={!trackingDescription}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Tracking
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Project Milestones</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
                <CardDescription>
                  Track project progress through key milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                {milestones.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">No milestones defined yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {milestones
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((milestone) => (
                        <div key={milestone.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                                <Badge className={getMilestoneStatusColor(milestone.status)}>
                                  {milestone.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Due: {formatDate(milestone.due_date)}
                                </div>
                                {milestone.completed_date && (
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Completed: {formatDate(milestone.completed_date)}
                                  </div>
                                )}
                                {milestone.payment_amount && (
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    {formatCurrency(milestone.payment_amount)}
                                  </div>
                                )}
                              </div>
                              
                              {milestone.description && (
                                <p className="text-gray-700 mb-3">{milestone.description}</p>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Log Time
                                </Button>
                                {milestone.status !== 'completed' && (
                                  <Button size="sm">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Completion</span>
                              <span className="text-sm text-gray-600">{milestone.completion_percentage}%</span>
                            </div>
                            <Progress value={milestone.completion_percentage} className="h-2" />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Tracking Tab */}
          <TabsContent value="time" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Time Entries</CardTitle>
                  <Button size="sm" onClick={() => startTimeTracking()}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Time Entry
                  </Button>
                </div>
                <CardDescription>
                  Track your working hours for accurate billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isTracking && (
                  <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Time Tracking in Progress</h3>
                        <p className="text-sm text-gray-600 mb-2">{trackingDescription}</p>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatElapsedTime(elapsedTime)}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={cancelTimeTracking}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button 
                          onClick={stopTimeTracking}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Entry
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {timeEntries.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">No time entries recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeEntries.map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">{entry.description}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
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
                            {entry.hourly_rate && (
                              <div className="text-sm text-gray-600">
                                ${entry.hourly_rate}/hr
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
              </CardContent>
            </Card>

            {/* Time Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Time Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total Hours</h3>
                    <p className="text-2xl font-bold text-blue-600">{project.total_hours_logged.toFixed(1)}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Billable Amount</h3>
                    <p className="text-2xl font-bold text-green-600">
                      ${(project.total_hours_logged * (project.hourly_rate || 0)).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">This Week</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {timeEntries
                        .filter(entry => {
                          const entryDate = new Date(entry.start_time)
                          const now = new Date()
                          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
                          startOfWeek.setHours(0, 0, 0, 0)
                          return entryDate >= startOfWeek
                        })
                        .reduce((total, entry) => total + (entry.duration_minutes || 0), 0) / 60
                      }h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Update</CardTitle>
                <CardDescription>
                  Share progress updates with your client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="updateTitle">Title (optional)</Label>
                    <Input
                      id="updateTitle"
                      placeholder="e.g., Weekly Progress Update"
                      value={newUpdateTitle}
                      onChange={(e) => setNewUpdateTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="updateContent">Update Content</Label>
                    <textarea
                      id="updateContent"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your progress, challenges, or questions..."
                      value={newUpdateContent}
                      onChange={(e) => setNewUpdateContent(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="updateMilestone">Related Milestone (optional)</Label>
                    <select
                      id="updateMilestone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedMilestone}
                      onChange={(e) => setSelectedMilestone(e.target.value)}
                    >
                      <option value="">Select a milestone</option>
                      {milestones.map((milestone) => (
                        <option key={milestone.id} value={milestone.id}>
                          {milestone.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={submitUpdate}
                      disabled={!newUpdateContent || submittingUpdate}
                    >
                      {submittingUpdate ? 'Posting...' : 'Post Update'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Updates</CardTitle>
              </CardHeader>
              <CardContent>
                {updates.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">No updates posted yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {updates.map((update) => (
                      <div key={update.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={update.author?.avatar_url} alt={update.author?.first_name || ''} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {update.author?.first_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium">
                                  {update.author?.first_name} {update.author?.last_name}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {new Date(update.created_at).toLocaleString()}
                                </span>
                              </div>
                              {update.is_important && (
                                <Badge variant="outline" className="bg-red-50 text-red-700">
                                  Important
                                </Badge>
                              )}
                            </div>
                            
                            {update.title && (
                              <p className="font-medium text-gray-900 mt-2">{update.title}</p>
                            )}
                            
                            <p className="text-gray-700 mt-2 whitespace-pre-line">{update.content}</p>
                            
                            {update.milestone && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {update.milestone.title}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Share documents, images, and other files with your client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fileCategory">Category (optional)</Label>
                      <Input
                        id="fileCategory"
                        placeholder="e.g., Designs, Documents, Images"
                        value={fileCategory}
                        onChange={(e) => setFileCategory(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fileMilestone">Related Milestone (optional)</Label>
                      <select
                        id="fileMilestone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedMilestone}
                        onChange={(e) => setSelectedMilestone(e.target.value)}
                      >
                        <option value="">Select a milestone</option>
                        {milestones.map((milestone) => (
                          <option key={milestone.id} value={milestone.id}>
                            {milestone.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fileDescription">Description (optional)</Label>
                    <Input
                      id="fileDescription"
                      placeholder="Brief description of the file"
                      value={fileDescription}
                      onChange={(e) => setFileDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      PDF, Word, Excel, JPG, PNG up to 10MB
                    </p>
                    <Button variant="outline">
                      Choose Files
                    </Button>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Selected Files</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{getFileIcon(file.file_type)}</span>
                              <div>
                                <p className="text-sm font-medium">{file.file_name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.file_size)}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={submitFileUpload}
                      disabled={uploadedFiles.length === 0 || uploadingFile}
                    >
                      {uploadingFile ? 'Uploading...' : 'Upload Files'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Project Files</CardTitle>
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                    defaultValue="all"
                  >
                    <option value="all">All Files</option>
                    <option value="documents">Documents</option>
                    <option value="images">Images</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">No files uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {files.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">
                            {getFileIcon(file.file_type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900 mb-1">{file.file_name}</p>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <span>{formatFileSize(file.file_size)}</span>
                                  <span>{new Date(file.created_at).toLocaleDateString()}</span>
                                  <span>
                                    Uploaded by {file.uploader?.first_name || 'User'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {file.description && (
                              <p className="text-sm text-gray-600 mt-2">{file.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2">
                                {file.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {file.category}
                                  </Badge>
                                )}
                                {file.milestone && (
                                  <Badge variant="outline" className="text-xs">
                                    {file.milestone.title}
                                  </Badge>
                                )}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(file.file_url, '_blank')}
                              >
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}