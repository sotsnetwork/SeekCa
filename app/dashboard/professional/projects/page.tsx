'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  AlertCircle,
  Users
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { projectService, Project, ProjectMilestone, TimeEntry } from '@/lib/project-management'
import Link from 'next/link'

export default function ProfessionalProjectsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    const getProjects = async () => {
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
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    getProjects()
  }, [router])

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'active') {
      return ['planning', 'in_progress'].includes(project.status)
    } else if (activeTab === 'completed') {
      return project.status === 'completed'
    } else {
      return ['cancelled', 'on_hold'].includes(project.status)
    }
  })

  const getStatusColor = (status: string) => {
    return projectService.getProjectStatusColor(status)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">
            Manage your ongoing projects, track time, and collaborate with clients
          </p>
        </div>

        {/* Project Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              Active Projects
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              On Hold/Cancelled
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab} projects
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'active' 
                  ? "You don't have any active projects at the moment"
                  : activeTab === 'completed'
                  ? "You haven't completed any projects yet"
                  : "You don't have any on-hold or cancelled projects"
                }
              </p>
              {activeTab === 'active' && (
                <Link href="/jobs">
                  <Button>Browse Jobs</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Link href={`/dashboard/professional/projects/${project.id}`}>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                            {project.title}
                          </h3>
                        </Link>
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

                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          <span>3 Milestones</span>
                        </div>
                        <div className="flex items-center text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          <span>1 Completed</span>
                        </div>
                        <div className="flex items-center text-sm bg-yellow-50 text-yellow-800 px-2 py-1 rounded">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          <span>1 Due Soon</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Client</p>
                        <p className="font-medium">
                          {project.hirer?.company_name || 
                           (project.hirer?.first_name && project.hirer?.last_name ? 
                            `${project.hirer.first_name} ${project.hirer.last_name}` : 
                            'Client')}
                        </p>
                      </div>
                      
                      {project.total_budget && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Budget</p>
                          <p className="font-medium text-green-600">
                            ${project.total_budget.toLocaleString()}
                          </p>
                        </div>
                      )}
                      
                      <Link href={`/dashboard/professional/projects/${project.id}`}>
                        <Button className="w-full">
                          Manage Project
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Track Time</h3>
              <p className="text-sm text-gray-600 mb-4">
                Log your working hours for accurate billing
              </p>
              <Link href="/dashboard/professional/time-tracking">
                <Button variant="outline" className="w-full">
                  Time Tracker
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <BarChart className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Project Reports</h3>
              <p className="text-sm text-gray-600 mb-4">
                View detailed reports on your project progress
              </p>
              <Link href="/dashboard/professional/reports">
                <Button variant="outline" className="w-full">
                  View Reports
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Client Communication</h3>
              <p className="text-sm text-gray-600 mb-4">
                Message clients and share project updates
              </p>
              <Link href="/messages">
                <Button variant="outline" className="w-full">
                  Messages
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}