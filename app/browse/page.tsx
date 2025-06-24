'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MapPin, Clock, Filter, Search, Heart, Briefcase } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Professional {
  id: string
  user_id: string
  title: string
  hourly_rate: number
  experience_years: number
  skills: string[]
  availability_status: string
  rating: number
  total_reviews: number
  completed_projects: number
  profiles: {
    first_name: string
    last_name: string
    location: string
    avatar_url: string
    bio: string
  }
}

export default function BrowsePage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            location,
            avatar_url,
            bio
          )
        `)
        .eq('availability_status', 'available')

      if (error) throw error
      setProfessionals(data || [])
    } catch (error) {
      console.error('Error fetching professionals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = searchTerm === '' || 
      professional.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      `${professional.profiles?.first_name} ${professional.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation = selectedLocation === 'all' || 
      professional.profiles?.location?.toLowerCase().includes(selectedLocation.toLowerCase())

    return matchesSearch && matchesLocation
  })

  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'experience':
        return (b.experience_years || 0) - (a.experience_years || 0)
      case 'rate_low':
        return (a.hourly_rate || 0) - (b.hourly_rate || 0)
      case 'rate_high':
        return (b.hourly_rate || 0) - (a.hourly_rate || 0)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Top Professionals
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with verified experts across construction, engineering, design, and more
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, skills, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="toronto">Toronto</SelectItem>
                  <SelectItem value="vancouver">Vancouver</SelectItem>
                  <SelectItem value="montreal">Montreal</SelectItem>
                  <SelectItem value="calgary">Calgary</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experience</SelectItem>
                  <SelectItem value="rate_low">Lowest Rate</SelectItem>
                  <SelectItem value="rate_high">Highest Rate</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Filter className="w-5 h-5 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {sortedProfessionals.length} Professionals Found
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProfessionals.map((professional) => (
            <Card key={professional.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16 ring-4 ring-blue-100">
                      <AvatarImage src={professional.profiles?.avatar_url} />
                      <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                        {professional.profiles?.first_name?.[0]}{professional.profiles?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {professional.profiles?.first_name} {professional.profiles?.last_name}
                      </h3>
                      <p className="text-blue-600 font-medium">{professional.title}</p>
                      <div className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{professional.profiles?.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {professional.profiles?.bio || 'Experienced professional ready to help with your project.'}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {professional.rating?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({professional.total_reviews} reviews)
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Available
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {professional.skills?.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {professional.skills?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{professional.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${professional.hourly_rate}
                    </span>
                    <span className="text-gray-600">/hr</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {professional.completed_projects} projects
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    View Profile
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedProfessionals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedLocation('all')
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}