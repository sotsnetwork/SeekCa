'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MapPin, Clock, DollarSign, Search, Filter } from 'lucide-react'
import Link from 'next/link'

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
  const [skillFilter, setSkillFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('')
  const [rateFilter, setRateFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const fetchProfessionals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('professional_profiles')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            location,
            avatar_url,
            bio
          )
        `)
        .order('rating', { ascending: false })

      if (error) throw error
      setProfessionals(data || [])
    } catch (error) {
      console.error('Error fetching professionals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = !searchTerm || 
      professional.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesSkill = skillFilter === 'all' || 
      professional.skills?.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))

    const matchesLocation = !locationFilter || 
      professional.profiles?.location?.toLowerCase().includes(locationFilter.toLowerCase())

    const matchesRate = rateFilter === 'all' || (() => {
      const rate = professional.hourly_rate || 0
      switch (rateFilter) {
        case 'under-50': return rate < 50
        case '50-100': return rate >= 50 && rate <= 100
        case '100-200': return rate > 100 && rate <= 200
        case 'over-200': return rate > 200
        default: return true
      }
    })()

    const matchesAvailability = availabilityFilter === 'all' || 
      professional.availability_status === availabilityFilter

    return matchesSearch && matchesSkill && matchesLocation && matchesRate && matchesAvailability
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
                    <div className="flex gap-2">
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
              Browse Professionals
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover talented professionals ready to bring your projects to life. 
              Filter by skills, location, and availability to find the perfect match.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by name, title, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="lg:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  <SelectItem value="electrical">Electrician</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="carpentry">Carpentry</SelectItem>
                  <SelectItem value="masonry">Masonry</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="tiling">Tiling</SelectItem>
                  <SelectItem value="roofing">Roofing</SelectItem>
                  <SelectItem value="welding">Welding & Fabrication</SelectItem>
                  <SelectItem value="metal-fabrication">Metal Fabrication</SelectItem>
                  <SelectItem value="structural-welding">Structural Welding</SelectItem>
                  <SelectItem value="pipe-welding">Pipe Welding</SelectItem>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="surveying">Surveying</SelectItem>
                  <SelectItem value="interior-design">Interior Design</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />

              <Select value={rateFilter} onValueChange={setRateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Hourly rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rate</SelectItem>
                  <SelectItem value="under-50">Under $50/hr</SelectItem>
                  <SelectItem value="50-100">$50-100/hr</SelectItem>
                  <SelectItem value="100-200">$100-200/hr</SelectItem>
                  <SelectItem value="over-200">Over $200/hr</SelectItem>
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Availability</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filteredProfessionals.length} Professional{filteredProfessionals.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {filteredProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button onClick={() => {
              setSearchTerm('')
              setSkillFilter('all')
              setLocationFilter('')
              setRateFilter('all')
              setAvailabilityFilter('all')
            }}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <Card key={professional.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16 ring-2 ring-blue-100">
                      <AvatarImage src={professional.profiles?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                        {professional.profiles?.first_name?.[0]}{professional.profiles?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                        {professional.profiles?.first_name} {professional.profiles?.last_name}
                      </CardTitle>
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        {professional.title || 'Professional'}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {professional.profiles?.location || 'Location not specified'}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {professional.profiles?.bio || 'No bio available'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {professional.rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({professional.total_reviews || 0} reviews)
                      </span>
                    </div>
                    <Badge 
                      variant={professional.availability_status === 'available' ? 'default' : 'secondary'}
                      className={professional.availability_status === 'available' ? 'bg-green-100 text-green-800' : ''}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {professional.availability_status || 'Unknown'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span className="font-medium">
                        ${professional.hourly_rate || 0}/hr
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {professional.experience_years || 0} years exp.
                    </span>
                  </div>

                  {professional.skills && professional.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {professional.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {professional.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{professional.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="pt-2">
                    <Link href={`/professionals/${professional.user_id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}