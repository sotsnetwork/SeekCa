'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star, 
  Filter,
  X,
  Plus,
  Save,
  Zap,
  Wrench,
  Building,
  Users,
  Home,
  Truck
} from 'lucide-react'
import { searchService } from '@/lib/search'

interface AdvancedSearchProps {
  searchType: 'jobs' | 'professionals'
  initialFilters?: any
  onSearch: (filters: any) => void
  onSaveSearch?: (name: string, filters: any, enableAlert: boolean) => void
}

export function AdvancedSearch({ 
  searchType, 
  initialFilters = {}, 
  onSearch, 
  onSaveSearch 
}: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialFilters.query || '')
  const [location, setLocation] = useState(initialFilters.location || '')
  const [skills, setSkills] = useState<string[]>(initialFilters.skills || [])
  const [newSkill, setNewSkill] = useState('')
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([])
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [enableAlert, setEnableAlert] = useState(false)

  // Job-specific filters
  const [category, setCategory] = useState(initialFilters.category || '')
  const [jobType, setJobType] = useState(initialFilters.jobType || '')
  const [salaryRange, setSalaryRange] = useState([
    initialFilters.salaryMin || 0,
    initialFilters.salaryMax || 200
  ])
  const [salaryType, setSalaryType] = useState(initialFilters.salaryType || 'hourly')
  const [remoteAllowed, setRemoteAllowed] = useState(initialFilters.remoteAllowed || false)
  const [isUrgent, setIsUrgent] = useState(initialFilters.isUrgent || false)
  const [postedWithin, setPostedWithin] = useState(initialFilters.postedWithinDays || '')

  // Professional-specific filters
  const [rateRange, setRateRange] = useState([
    initialFilters.hourlyRateMin || 0,
    initialFilters.hourlyRateMax || 300
  ])
  const [experienceMin, setExperienceMin] = useState(initialFilters.experienceMin || 0)
  const [ratingMin, setRatingMin] = useState(initialFilters.ratingMin || 0)
  const [availabilityStatus, setAvailabilityStatus] = useState(initialFilters.availabilityStatus || '')

  const categories = [
    { id: 'engineering', name: 'Engineering', icon: Zap },
    { id: 'construction', name: 'Construction & Trades', icon: Wrench },
    { id: 'real-estate', name: 'Real Estate', icon: Building },
    { id: 'project-management', name: 'Project Management', icon: Users },
    { id: 'design', name: 'Design & Architecture', icon: Home },
    { id: 'consulting', name: 'Technical Consulting', icon: Truck }
  ]

  const professionalSkills = [
    'Electrical Wiring', 'Electrical Design', 'Power Systems', 'Circuit Design',
    'Plumbing Installation', 'Pipe Fitting', 'Water Systems', 'Gas Lines',
    'HVAC Installation', 'Air Conditioning', 'Heating Systems', 'Refrigeration',
    'Carpentry', 'Framing', 'Finish Carpentry', 'Cabinet Making',
    'Masonry', 'Brickwork', 'Concrete Work', 'Stone Work',
    'Welding', 'Arc Welding', 'MIG Welding', 'TIG Welding',
    'Painting', 'Interior Painting', 'Exterior Painting',
    'Tiling', 'Ceramic Tiling', 'Stone Tiling',
    'Roofing', 'Shingle Installation', 'Metal Roofing',
    'Architecture', 'Building Design', 'CAD Design',
    'Surveying', 'Land Surveying', 'Construction Surveying',
    'Interior Design', 'Space Planning',
    'Project Management', 'Construction Management', 'Quality Control'
  ]

  useEffect(() => {
    if (newSkill.length > 1) {
      const suggestions = professionalSkills
        .filter(skill => skill.toLowerCase().includes(newSkill.toLowerCase()))
        .filter(skill => !skills.includes(skill))
        .slice(0, 5)
      setSkillSuggestions(suggestions)
    } else {
      setSkillSuggestions([])
    }
  }, [newSkill, skills])

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill])
      setNewSkill('')
      setSkillSuggestions([])
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSearch = () => {
    const filters: any = {
      query: query || undefined,
      location: location || undefined,
      skills: skills.length > 0 ? skills : undefined
    }

    if (searchType === 'jobs') {
      filters.category = category || undefined
      filters.jobType = jobType || undefined
      filters.salaryMin = salaryRange[0] > 0 ? salaryRange[0] : undefined
      filters.salaryMax = salaryRange[1] < 200 ? salaryRange[1] : undefined
      filters.salaryType = salaryType !== 'hourly' ? salaryType : undefined
      filters.remoteAllowed = remoteAllowed || undefined
      filters.isUrgent = isUrgent || undefined
      filters.postedWithinDays = postedWithin ? Number(postedWithin) : undefined
    } else {
      filters.hourlyRateMin = rateRange[0] > 0 ? rateRange[0] : undefined
      filters.hourlyRateMax = rateRange[1] < 300 ? rateRange[1] : undefined
      filters.experienceMin = experienceMin > 0 ? experienceMin : undefined
      filters.ratingMin = ratingMin > 0 ? ratingMin : undefined
      filters.availabilityStatus = availabilityStatus || undefined
    }

    onSearch(filters)
  }

  const handleSaveSearch = () => {
    if (!onSaveSearch || !searchName.trim()) return

    const filters: any = {
      query,
      location,
      skills
    }

    if (searchType === 'jobs') {
      Object.assign(filters, {
        category,
        jobType,
        salaryMin: salaryRange[0],
        salaryMax: salaryRange[1],
        salaryType,
        remoteAllowed,
        isUrgent,
        postedWithinDays: postedWithin ? Number(postedWithin) : undefined
      })
    } else {
      Object.assign(filters, {
        hourlyRateMin: rateRange[0],
        hourlyRateMax: rateRange[1],
        experienceMin,
        ratingMin,
        availabilityStatus
      })
    }

    onSaveSearch(searchName, filters, enableAlert)
    setShowSaveDialog(false)
    setSearchName('')
    setEnableAlert(false)
  }

  const clearFilters = () => {
    setQuery('')
    setLocation('')
    setSkills([])
    setCategory('')
    setJobType('')
    setSalaryRange([0, 200])
    setSalaryType('hourly')
    setRemoteAllowed(false)
    setIsUrgent(false)
    setPostedWithin('')
    setRateRange([0, 300])
    setExperienceMin(0)
    setRatingMin(0)
    setAvailabilityStatus('')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-2 h-5 w-5 text-blue-600" />
          Advanced {searchType === 'jobs' ? 'Job' : 'Professional'} Search
        </CardTitle>
        <CardDescription>
          Use detailed filters to find exactly what you're looking for
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="query">Search Keywords</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="query"
                placeholder={searchType === 'jobs' ? 'Job title, company, description...' : 'Name, title, skills...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="location"
                placeholder="City, state, or remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <Label>Required Skills</Label>
          <div className="space-y-2">
            <div className="relative">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSkill(newSkill)
                  }
                }}
              />
              {newSkill && (
                <Button
                  type="button"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
                  onClick={() => addSkill(newSkill)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {skillSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skillSuggestions.map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addSkill(skill)}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            )}
            
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="pr-1">
                    {skill}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job-specific filters */}
        {searchType === 'jobs' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Posted Within</Label>
                <Select value={postedWithin} onValueChange={setPostedWithin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any time</SelectItem>
                    <SelectItem value="1">Last 24 hours</SelectItem>
                    <SelectItem value="7">Last week</SelectItem>
                    <SelectItem value="30">Last month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Salary Range ({salaryType})</Label>
                <div className="px-3">
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    max={200}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>${salaryRange[0]}{salaryType === 'hourly' ? '/hr' : 'k'}</span>
                    <span>${salaryRange[1]}{salaryType === 'hourly' ? '/hr' : 'k'}</span>
                  </div>
                </div>
                <Select value={salaryType} onValueChange={setSalaryType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="salary">Annual</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote"
                    checked={remoteAllowed}
                    onCheckedChange={setRemoteAllowed}
                  />
                  <Label htmlFor="remote">Remote work allowed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="urgent"
                    checked={isUrgent}
                    onCheckedChange={setIsUrgent}
                  />
                  <Label htmlFor="urgent">Urgent hiring only</Label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Professional-specific filters */}
        {searchType === 'professionals' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Availability</Label>
                <Select value={availabilityStatus} onValueChange={setAvailabilityStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any availability</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Minimum Experience</Label>
                <Select value={experienceMin.toString()} onValueChange={(value) => setExperienceMin(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any experience</SelectItem>
                    <SelectItem value="1">1+ years</SelectItem>
                    <SelectItem value="3">3+ years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Hourly Rate Range</Label>
              <div className="px-3">
                <Slider
                  value={rateRange}
                  onValueChange={setRateRange}
                  max={300}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>${rateRange[0]}/hr</span>
                  <span>${rateRange[1]}/hr</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Minimum Rating</Label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={ratingMin >= rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRatingMin(rating)}
                    className="flex items-center"
                  >
                    <Star className={`h-4 w-4 ${ratingMin >= rating ? 'fill-current' : ''}`} />
                    <span className="ml-1">{rating}+</span>
                  </Button>
                ))}
                {ratingMin > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRatingMin(0)}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
            {onSaveSearch && (
              <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
                <Save className="h-4 w-4 mr-2" />
                Save Search
              </Button>
            )}
          </div>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Save Search Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Save Search</CardTitle>
                <CardDescription>
                  Save this search to quickly access it later
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="searchName">Search Name</Label>
                  <Input
                    id="searchName"
                    placeholder="e.g., Senior Electricians in NYC"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableAlert"
                    checked={enableAlert}
                    onCheckedChange={setEnableAlert}
                  />
                  <Label htmlFor="enableAlert">
                    Email me when new {searchType} match this search
                  </Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSearch} disabled={!searchName.trim()}>
                    Save Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}