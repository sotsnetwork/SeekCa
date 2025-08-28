'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdvancedSearch } from '@/components/ui/advanced-search'
import { SavedSearches } from '@/components/ui/saved-searches'
import { 
  Search,
  Briefcase, 
  Users, 
  MapPin, 
  Star, 
  Clock,
  DollarSign,
  Building,
  Award,
  Eye,
  MessageSquare,
  Heart,
  TrendingUp
} from 'lucide-react'
import { searchService, JobSearchFilters, ProfessionalSearchFilters } from '@/lib/search'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('jobs')
  const [user, setUser] = useState<any>(null)
  const [jobResults, setJobResults] = useState<any[]>([])
  const [professionalResults, setProfessionalResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [jobsTotal, setJobsTotal] = useState(0)
  const [professionalsTotal, setProfessionalsTotal] = useState(0)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const searchType = searchParams.get('type') || 'jobs'
    setActiveTab(searchType)
    
    if (searchType === 'jobs') {
      const filters = searchService.buildJobFiltersFromUrl(new URLSearchParams(Object.fromEntries(searchParams)))
      handleJobSearch(filters)
    } else {
      const filters = searchService.buildProfessionalFiltersFromUrl(new URLSearchParams(Object.fromEntries(searchParams)))
      handleProfessionalSearch(filters)
    }
  }, [searchParams])

  const handleJobSearch = async (filters: JobSearchFilters) => {
    try {
      setLoading(true)
      const result = await searchService.searchJobs({ ...filters, limit: 20 })
      setJobResults(result.data)
      setJobsTotal(result.total)
      
      if (user) {
        await searchService.logSearch(user.id, 'jobs', filters.query || '', filters, result.data.length)
      }
    } catch (error) {
      console.error('Error searching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfessionalSearch = async (filters: ProfessionalSearchFilters) => {
    try {
      setLoading(true)
      const result = await searchService.searchProfessionals({ ...filters, limit: 20 })
      setProfessionalResults(result.data)
      setProfessionalsTotal(result.total)
      
      if (user) {
        await searchService.logSearch(user.id, 'professionals', filters.query || '', filters, result.data.length)
      }
    } catch (error) {
      console.error('Error searching professionals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveJobSearch = async (name: string, filters: JobSearchFilters, enableAlert: boolean) => {
    if (!user) return
    
    try {
      await searchService.createSavedSearch(user.id, name, 'jobs', filters, enableAlert)
      alert('Search saved successfully!')
    } catch (error) {
      console.error('Error saving search:', error)
      alert('Failed to save search')
    }
  }

  const handleSaveProfessionalSearch = async (name: string, filters: ProfessionalSearchFilters, enableAlert: boolean) => {
    if (!user) return
    
    try {
      await searchService.createSavedSearch(user.id, name, 'professionals', filters, enableAlert)
      alert('Search saved successfully!')
    } catch (error) {
      console.error('Error saving search:', error)
      alert('Failed to save search')
    }
  }

  const handleExecuteSavedSearch = (filters: any, searchType: 'jobs' | 'professionals') => {
    const params = searchService.filtersToUrlParams(filters)
    params.set('type', searchType)
    router.push(`/search?${params.toString()}`)
  }

  const formatSalary = (job: any) => {
    const min = job.salary_min ? `$${job.salary_min.toLocaleString()}` : ''
    const max = job.salary_max ? `$${job.salary_max.toLocaleString()}` : ''
    const type = job.salary_type === 'hourly' ? '/hr' : job.salary_type === 'salary' ? '/year' : ''
    
    if (min && max) {
      return `${min} - ${max}${type}`
    } else if (min) {
      return `${min}+${type}`
    } else if (max) {
      return `Up to ${max}${type}`
    }
    return 'Salary not specified'
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just posted'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks} weeks ago`
  }

  const getFullName = (professional: any) => {
    const firstName = professional.first_name || ''
    const lastName = professional.last_name || ''
    return `${firstName} ${lastName}`.trim() || 'Professional'
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }

  const currentJobFilters = searchService.buildJobFiltersFromUrl(new URLSearchParams(Object.fromEntries(searchParams)))
  const currentProfessionalFilters = searchService.buildProfessionalFiltersFromUrl(new URLSearchParams(Object.fromEntries(searchParams)))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Search className="inline-block w-8 h-8 mr-3 text-blue-600" />
            Advanced Search
          </h1>
          <p className="text-gray-600">
            Find exactly what you're looking for with powerful search and filtering tools
          </p>
        </div>

        {/* Search Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              Jobs ({jobsTotal})
            </TabsTrigger>
            <TabsTrigger value="professionals" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Professionals ({professionalsTotal})
            </TabsTrigger>
            {user && (
              <TabsTrigger value="saved" className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Saved Searches
              </TabsTrigger>
            )}
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <AdvancedSearch
              searchType="jobs"
              initialFilters={currentJobFilters}
              onSearch={(filters) => {
                const params = searchService.filtersToUrlParams(filters)
                params.set('type', 'jobs')
                router.push(`/search?${params.toString()}`)
              }}
              onSaveSearch={user ? handleSaveJobSearch : undefined}
            />

            {/* Job Results */}
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="flex space-x-2">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : jobResults.length > 0 ? (
                jobResults.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Link href={`/jobs/${job.id}`}>
                              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                                {job.title}
                              </h3>
                            </Link>
                            <Badge variant="outline" className="capitalize">
                              {job.job_type.replace('-', ' ')}
                            </Badge>
                            {job.is_urgent && (
                              <Badge variant="destructive" className="bg-red-100 text-red-800">
                                Urgent
                              </Badge>
                            )}
                            {job.company_verified && (
                              <Award className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              {job.company_name || 'Company'}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location || 'Remote'}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {getTimeAgo(job.created_at)}
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                          {job.required_skills && job.required_skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.required_skills.slice(0, 6).map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {job.required_skills.length > 6 && (
                                <Badge variant="outline" className="text-xs">
                                  +{job.required_skills.length - 6} more
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {job.view_count} views
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {job.application_count} applicants
                            </div>
                          </div>
                        </div>

                        <div className="ml-6 text-right">
                          <p className="text-lg font-semibold text-green-600 mb-2">
                            {formatSalary(job)}
                          </p>
                          <div className="space-y-2">
                            <Link href={`/jobs/${job.id}`}>
                              <Button size="sm" className="w-full">
                                View Details
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="w-full">
                              <Heart className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or browse all available jobs.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Professionals Tab */}
          <TabsContent value="professionals" className="space-y-6">
            <AdvancedSearch
              searchType="professionals"
              initialFilters={currentProfessionalFilters}
              onSearch={(filters) => {
                const params = searchService.filtersToUrlParams(filters)
                params.set('type', 'professionals')
                router.push(`/search?${params.toString()}`)
              }}
              onSaveSearch={user ? handleSaveProfessionalSearch : undefined}
            />

            {/* Professional Results */}
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                            <div className="flex space-x-2">
                              <div className="h-6 bg-gray-200 rounded w-16"></div>
                              <div className="h-6 bg-gray-200 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : professionalResults.length > 0 ? (
                professionalResults.map((professional) => (
                  <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={professional.avatar_url} alt={getFullName(professional)} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-medium">
                            {getInitials(getFullName(professional))}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              {professional.skill_match_score > 0 && (
                                <Badge variant="default" className="mb-2 bg-green-100 text-green-800">
                                  {Math.round(professional.skill_match_score)}% skill match
                                </Badge>
                              )}
                              
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {getFullName(professional)}
                                </h3>
                                {professional.is_verified && (
                                  <Award className="h-5 w-5 text-blue-600" />
                                )}
                                <Badge 
                                  variant={professional.availability_status === 'available' ? 'default' : 'secondary'}
                                  className={professional.availability_status === 'available' ? 'bg-green-100 text-green-800' : ''}
                                >
                                  {professional.availability_status === 'available' ? 'Available' : 
                                   professional.availability_status === 'busy' ? 'Busy' : 'Unavailable'}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-2 mb-2">
                                <Briefcase className="h-4 w-4 text-gray-600" />
                                <p className="text-lg text-gray-700">{professional.title || 'Professional'}</p>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {professional.location || 'Location not specified'}
                                </div>
                                {professional.hourly_rate && (
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    ${professional.hourly_rate}/hr
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {professional.experience_years || 0} years exp
                                </div>
                              </div>

                              {professional.skills && professional.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {professional.skills.slice(0, 8).map((skill: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {professional.skills.length > 8 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{professional.skills.length - 8} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="flex items-center space-x-1 mb-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{professional.rating || '0.0'}</span>
                                <span className="text-gray-600 text-sm">({professional.total_reviews || 0})</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {professional.completed_projects || 0} projects
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-4">
                              {user ? (
                                <>
                                  <Button size="sm">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Contact
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Profile
                                  </Button>
                                </>
                              ) : (
                                <Link href="/auth/login">
                                  <Button size="sm">Sign in to Contact</Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or browse all available professionals.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Saved Searches Tab */}
          {user && (
            <TabsContent value="saved">
              <SavedSearches
                userId={user.id}
                onSearchExecute={handleExecuteSavedSearch}
              />
            </TabsContent>
          )}
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{jobsTotal}</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{professionalsTotal}</div>
              <div className="text-sm text-gray-600">Professionals</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Match Success</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">2.4h</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}