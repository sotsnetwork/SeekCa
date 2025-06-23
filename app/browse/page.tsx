'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AdvancedSearch } from '@/components/ui/advanced-search'
import { SavedSearches } from '@/components/ui/saved-searches'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  Star, 
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Award,
  Eye,
  Heart,
  MessageSquare,
  Wrench,
  Zap,
  Home,
  Building,
  Truck
} from 'lucide-react'
import { searchService, ProfessionalSearchFilters } from '@/lib/search'
import { supabase } from '@/lib/supabase'

export default function BrowseProfessionals() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedExperience, setSelectedExperience] = useState('all')
  const [professionals, setProfessionals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [user, setUser] = useState<any>(null)

  const categories = [
    { id: 'all', name: 'All Categories', icon: Briefcase },
    { id: 'engineering', name: 'Engineering', icon: Zap },
    { id: 'construction', name: 'Construction & Trades', icon: Wrench },
    { id: 'real-estate', name: 'Real Estate', icon: Building },
    { id: 'project-management', name: 'Project Management', icon: Users },
    { id: 'design', name: 'Design & Architecture', icon: Home },
    { id: 'services', name: 'Personal Services', icon: Truck },
    { id: 'consulting', name: 'Professional Consulting', icon: Briefcase }
  ]

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'local', name: 'Local Area' },
    { id: 'us', name: 'United States' },
    { id: 'canada', name: 'Canada' },
    { id: 'uk', name: 'United Kingdom' },
    { id: 'europe', name: 'Europe' },
    { id: 'asia', name: 'Asia' }
  ]

  const experienceLevels = [
    { id: 'all', name: 'All Experience' },
    { id: 'entry', name: 'Entry Level (0-3 years)' },
    { id: 'mid', name: 'Mid Level (4-7 years)' },
    { id: 'senior', name: 'Senior Level (8-15 years)' },
    { id: 'expert', name: 'Expert Level (15+ years)' }
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Load initial filters from URL
    const initialFilters = searchService.buildProfessionalFiltersFromUrl(new URLSearchParams(searchParams))
    handleSearch(initialFilters)
  }, [searchParams])

  const handleSearch = async (filters: ProfessionalSearchFilters, page = 0) => {
    try {
      setLoading(true)
      setCurrentPage(page)
      
      const searchFilters = {
        ...filters,
        limit: 20,
        offset: page * 20
      }
      
      const result = await searchService.searchProfessionals(searchFilters)
      
      if (page === 0) {
        setProfessionals(result.data)
      } else {
        setProfessionals(prev => [...prev, ...result.data])
      }
      
      setTotalResults(result.total)
      setHasMore(result.hasMore)
      
      // Log search analytics
      if (user) {
        await searchService.logSearch(user.id, 'professionals', filters.query || '', filters, result.data.length)
      }
    } catch (error) {
      console.error('Error searching professionals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSearch = async (name: string, filters: ProfessionalSearchFilters, enableAlert: boolean) => {
    if (!user) return
    
    try {
      await searchService.createSavedSearch(user.id, name, 'professionals', filters, enableAlert)
      alert('Search saved successfully!')
    } catch (error) {
      console.error('Error saving search:', error)
      alert('Failed to save search')
    }
  }

  const handleLoadMore = () => {
    const currentFilters = searchService.buildProfessionalFiltersFromUrl(new URLSearchParams(searchParams))
    handleSearch(currentFilters, currentPage + 1)
  }

  const handleExecuteSavedSearch = (filters: ProfessionalSearchFilters) => {
    // Update URL with new filters
    const params = searchService.filtersToUrlParams(filters)
    router.push(`/browse?${params.toString()}`)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }

  const getFullName = (professional: any) => {
    const firstName = professional.profiles?.first_name || ''
    const lastName = professional.profiles?.last_name || ''
    return `${firstName} ${lastName}`.trim() || 'Professional'
  }

  const currentFilters = searchService.buildProfessionalFiltersFromUrl(new URLSearchParams(searchParams))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Technical Professionals
          </h1>
          <p className="text-gray-600">
            Find licensed engineers, skilled tradespeople, and certified professionals for your projects
          </p>
        </div>

        {/* Search Interface */}
        <Tabs defaultValue="search" className="mb-8">
          <TabsList>
            <TabsTrigger value="search">Search Professionals</TabsTrigger>
            {user && <TabsTrigger value="saved">Saved Searches</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="search">
            <AdvancedSearch
              searchType="professionals"
              initialFilters={currentFilters}
              onSearch={(filters) => handleSearch(filters, 0)}
              onSaveSearch={user ? handleSaveSearch : undefined}
            />
          </TabsContent>
          
          {user && (
            <TabsContent value="saved">
              <SavedSearches
                userId={user.id}
                onSearchExecute={handleExecuteSavedSearch}
              />
            </TabsContent>
          )}
        </Tabs>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {categories.map(category => {
            const IconComponent = category.icon
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCategory === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs font-medium text-gray-900">{category.name}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Licensed Professionals</span>
                    <span className="font-medium">8,247</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Available Now</span>
                    <span className="font-medium text-green-600">2,891</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg Response Time</span>
                    <span className="font-medium">1.8 hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium text-blue-600">99.1%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Specializations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      'Electrical Systems',
                      'HVAC Design', 
                      'Plumbing',
                      'Project Management',
                      'Interior Design',
                      'Structural Engineering',
                      'Real Estate Development',
                      'Personal Services'
                    ].map(spec => (
                      <div key={spec} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{spec}</span>
                        <Badge variant="secondary" className="text-xs">
                          {Math.floor(Math.random() * 500) + 100}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Verification Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Standards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span>License Verification</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="h-4 w-4 text-green-600" />
                    <span>Background Checks</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span>Insurance Verified</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="h-4 w-4 text-orange-600" />
                    <span>Skill Assessments</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `Showing ${professionals.length} professionals${totalResults > professionals.length ? ` of ${totalResults}` : ''}`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Relevance</option>
                  <option>Rating</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Reviews</option>
                  <option>Response Time</option>
                </select>
              </div>
            </div>

            {/* Professional Cards */}
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
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
            ) : (
              <div className="space-y-6">
                {professionals.map((professional) => (
                  <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={professional.profiles?.avatar_url} alt={getFullName(professional)} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-medium">
                            {getInitials(getFullName(professional))}
                          </AvatarFallback>
                        </Avatar>

                        {/* Main Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            {/* Skill Match Score */}
                            {professional.skill_match_score > 0 && (
                              <Badge variant="default" className="mb-2 bg-green-100 text-green-800">
                                {Math.round(professional.skill_match_score)}% skill match
                              </Badge>
                            )}
                            
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {getFullName(professional)}
                                </h3>
                                {professional.profiles?.is_verified && (
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
                                  {professional.profiles?.location || 'Location not specified'}
                                </div>
                                {professional.hourly_rate && (
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    ${professional.hourly_rate}/hr
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Responds in {professional.response_time_hours || 24} hours
                                </div>
                              </div>
                              
                              {/* Licenses & Certifications */}
                              {professional.licenses && professional.licenses.length > 0 && (
                                <div className="flex items-center space-x-2 mb-3">
                                  {professional.licenses.slice(0, 3).map((license: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                      {license}
                                    </Badge>
                                  ))}
                                  {professional.licenses.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{professional.licenses.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                              
                              {/* Certifications */}
                              {professional.certifications && professional.certifications.length > 0 && (
                                <div className="flex items-center space-x-2 mb-3">
                                  {professional.certifications.slice(0, 2).map((cert: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {cert}
                                    </Badge>
                                  ))}
                                  {professional.certifications.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{professional.certifications.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Rating and Stats */}
                            <div className="text-right">
                              <div className="flex items-center space-x-1 mb-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{professional.rating || '0.0'}</span>
                                <span className="text-gray-600 text-sm">({professional.total_reviews || 0})</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {professional.completed_projects || 0} projects completed
                              </p>
                              <p className="text-sm text-gray-600">
                                {professional.experience_years || 0} years experience
                              </p>
                            </div>
                          </div>

                          {/* Bio */}
                          {professional.profiles?.bio && (
                            <p className="text-gray-700 mb-4">
                              {professional.profiles.bio}
                            </p>
                          )}

                          {/* Skills */}
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

                          {/* Actions */}
                          <div className="flex items-center justify-between">
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
                                  <Button variant="ghost" size="sm">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Save
                                  </Button>
                                </>
                              ) : (
                                <Button size="sm" onClick={() => window.location.href = '/auth/login'}>
                                  Sign in to Contact
                                </Button>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              Member since {new Date(professional.created_at).getFullYear()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && professionals.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or browse all available professionals.
                  </p>
                  <Button onClick={() => {
                    handleSearch({})
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Load More */}
            {!loading && hasMore && (
              <div className="mt-8 text-center">
                <Button variant="outline" size="lg" onClick={handleLoadMore}>
                  Load More Professionals
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}