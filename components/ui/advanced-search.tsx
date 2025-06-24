'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  X, 
  Save, 
  Bell, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Star, 
  Clock, 
  Award
} from 'lucide-react'
import { searchService, JobSearchFilters, ProfessionalSearchFilters } from '@/lib/search'
import { cn } from '@/lib/utils'

interface AdvancedSearchProps {
  searchType: 'jobs' | 'professionals'
  initialFilters?: JobSearchFilters | ProfessionalSearchFilters
  onSearch: (filters: any) => void
  onSaveSearch?: (name: string, filters: any, enableAlert: boolean) => void
}

export function AdvancedSearch({
  searchType,
  initialFilters = {},
  onSearch,
  onSaveSearch
}: AdvancedSearchProps) {
  // Common filters
  const [query, setQuery] = useState(initialFilters.query || '')
  const [location, setLocation] = useState(initialFilters.location || '')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [enableAlert, setEnableAlert] = useState(false)

  // Job-specific filters
  const [category, setCategory] = useState((initialFilters as JobSearchFilters).category || '')
  const [jobType, setJobType] = useState((initialFilters as JobSearchFilters).jobType || '')
  const [remoteAllowed, setRemoteAllowed] = useState((initialFilters as JobSearchFilters).remoteAllowed || false)
  const [salaryMin, setSalaryMin] = useState((initialFilters as JobSearchFilters).salaryMin?.toString() || '')
  const [salaryMax, setSalaryMax] = useState((initialFilters as JobSearchFilters).salaryMax?.toString() || '')
  const [salaryType, setSalaryType] = useState((initialFilters as JobSearchFilters).salaryType || 'hourly')
  const [requiredSkills, setRequiredSkills] = useState<string[]>((initialFilters as JobSearchFilters).requiredSkills || [])
  const [requiredLicenses, setRequiredLicenses] = useState<string[]>((initialFilters as JobSearchFilters).requiredLicenses || [])
  const [isUrgent, setIsUrgent] = useState((initialFilters as JobSearchFilters).isUrgent || false)
  const [postedWithinDays, setPostedWithinDays] = useState((initialFilters as JobSearchFilters).postedWithinDays?.toString() || '')

  // Professional-specific filters
  const [skills, setSkills] = useState<string[]>((initialFilters as ProfessionalSearchFilters).skills || [])
  const [hourlyRateMin, setHourlyRateMin] = useState((initialFilters as ProfessionalSearchFilters).hourlyRateMin?.toString() || '')
  const [hourlyRateMax, setHourlyRateMax] = useState((initialFilters as ProfessionalSearchFilters).hourlyRateMax?.toString() || '')
  const [availabilityStatus, setAvailabilityStatus] = useState((initialFilters as ProfessionalSearchFilters).availabilityStatus || '')
  const [experienceMin, setExperienceMin] = useState((initialFilters as ProfessionalSearchFilters).experienceMin?.toString() || '')
  const [ratingMin, setRatingMin] = useState((initialFilters as ProfessionalSearchFilters).ratingMin?.toString() || '')
  const [licenses, setLicenses] = useState<string[]>((initialFilters as ProfessionalSearchFilters).licenses || [])

  // New skill/license input
  const [newSkill, setNewSkill] = useState('')
  const [newLicense, setNewLicense] = useState('')

  useEffect(() => {
    // Load suggestions when typing location
    if (location.length > 2) {
      searchService.getLocationSuggestions(location)
        .then(suggestions => setLocationSuggestions(suggestions))
        .catch(error => console.error('Error fetching location suggestions:', error))
    } else {
      setLocationSuggestions([])
    }
  }, [location])

  useEffect(() => {
    // Load skill suggestions when typing new skill
    if (newSkill.length > 2) {
      searchService.getSkillSuggestions(newSkill)
        .then(suggestions => setSkillSuggestions(suggestions))
        .catch(error => console.error('Error fetching skill suggestions:', error))
    } else {
      setSkillSuggestions([])
    }
  }, [newSkill])

  const handleSearch = () => {
    if (searchType === 'jobs') {
      const filters: JobSearchFilters = {
        query: query || undefined,
        category: category || undefined,
        jobType: jobType || undefined,
        location: location || undefined,
        remoteAllowed: remoteAllowed || undefined,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        salaryType: salaryType || undefined,
        requiredSkills: requiredSkills.length > 0 ? requiredSkills : undefined,
        requiredLicenses: requiredLicenses.length > 0 ? requiredLicenses : undefined,
        isUrgent: isUrgent || undefined,
        postedWithinDays: postedWithinDays ? Number(postedWithinDays) : undefined
      }
      onSearch(filters)
    } else {
      const filters: ProfessionalSearchFilters = {
        query: query || undefined,
        skills: skills.length > 0 ? skills : undefined,
        location: location || undefined,
        hourlyRateMin: hourlyRateMin ? Number(hourlyRateMin) : undefined,
        hourlyRateMax: hourlyRateMax ? Number(hourlyRateMax) : undefined,
        availabilityStatus: availabilityStatus || undefined,
        experienceMin: experienceMin ? Number(experienceMin) : undefined,
        ratingMin: ratingMin ? Number(ratingMin) : undefined,
        licenses: licenses.length > 0 ? licenses : undefined
      }
      onSearch(filters)
    }
  }

  const handleSaveSearch = () => {
    if (!onSaveSearch) return
    
    if (!searchName) {
      alert('Please enter a name for your saved search')
      return
    }
    
    if (searchType === 'jobs') {
      const filters: JobSearchFilters = {
        query: query || undefined,
        category: category || undefined,
        jobType: jobType || undefined,
        location: location || undefined,
        remoteAllowed: remoteAllowed || undefined,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        salaryType: salaryType || undefined,
        requiredSkills: requiredSkills.length > 0 ? requiredSkills : undefined,
        requiredLicenses: requiredLicenses.length > 0 ? requiredLicenses : undefined,
        isUrgent: isUrgent || undefined,
        postedWithinDays: postedWithinDays ? Number(postedWithinDays) : undefined
      }
      onSaveSearch(searchName, filters, enableAlert)
    } else {
      const filters: ProfessionalSearchFilters = {
        query: query || undefined,
        skills: skills.length > 0 ? skills : undefined,
        location: location || undefined,
        hourlyRateMin: hourlyRateMin ? Number(hourlyRateMin) : undefined,
        hourlyRateMax: hourlyRateMax ? Number(hourlyRateMax) : undefined,
        availabilityStatus: availabilityStatus || undefined,
        experienceMin: experienceMin ? Number(experienceMin) : undefined,
        ratingMin: ratingMin ? Number(ratingMin) : undefined,
        licenses: licenses.length > 0 ? licenses : undefined
      }
      onSaveSearch(searchName, filters, enableAlert)
    }
    
    setSaveDialogOpen(false)
    setSearchName('')
    setEnableAlert(false)
  }

  const handleAddSkill = () => {
    if (!newSkill) return
    
    if (searchType === 'jobs') {
      if (!requiredSkills.includes(newSkill)) {
        setRequiredSkills([...requiredSkills, newSkill])
      }
    } else {
      if (!skills.includes(newSkill)) {
        setSkills([...skills, newSkill])
      }
    }
    
    setNewSkill('')
    setSkillSuggestions([])
  }

  const handleAddLicense = () => {
    if (!newLicense) return
    
    if (searchType === 'jobs') {
      if (!requiredLicenses.includes(newLicense)) {
        setRequiredLicenses([...requiredLicenses, newLicense])
      }
    } else {
      if (!licenses.includes(newLicense)) {
        setLicenses([...licenses, newLicense])
      }
    }
    
    setNewLicense('')
  }

  const handleRemoveSkill = (skill: string) => {
    if (searchType === 'jobs') {
      setRequiredSkills(requiredSkills.filter(s => s !== skill))
    } else {
      setSkills(skills.filter(s => s !== skill))
    }
  }

  const handleRemoveLicense = (license: string) => {
    if (searchType === 'jobs') {
      setRequiredLicenses(requiredLicenses.filter(l => l !== license))
    } else {
      setLicenses(licenses.filter(l => l !== license))
    }
  }

  const handleClearFilters = () => {
    setQuery('')
    setLocation('')
    setCategory('')
    setJobType('')
    setRemoteAllowed(false)
    setSalaryMin('')
    setSalaryMax('')
    setSalaryType('hourly')
    setRequiredSkills([])
    setRequiredLicenses([])
    setIsUrgent(false)
    setPostedWithinDays('')
    setSkills([])
    setHourlyRateMin('')
    setHourlyRateMax('')
    setAvailabilityStatus('')
    setExperienceMin('')
    setRatingMin('')
    setLicenses([])
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Basic Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={`Search ${searchType === 'jobs' ? 'jobs' : 'professionals'}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
              {locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setLocation(suggestion)
                        setLocationSuggestions([])
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleSearch} className="flex-shrink-0">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex-shrink-0"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide Filters' : 'Filters'}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 mt-6 pt-6 border-t">
            {/* Job-specific filters */}
            {searchType === 'jobs' && (
              <>
                {/* Category & Job Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                      <option value="engineering">Engineering</option>
                      <option value="construction">Construction & Trades</option>
                      <option value="design">Design & Architecture</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="project-management">Project Management</option>
                      <option value="consulting">Technical Consulting</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type</Label>
                    <select
                      id="jobType"
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Min"
                        type="number"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={salaryType}
                      onChange={(e) => setSalaryType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hourly">Per Hour</option>
                      <option value="salary">Per Year</option>
                      <option value="project">Per Project</option>
                    </select>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remoteAllowed"
                        checked={remoteAllowed}
                        onChange={(e) => setRemoteAllowed(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="remoteAllowed" className="text-sm">Remote OK</Label>
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="space-y-2">
                  <Label>Required Skills</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Add a skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddSkill()
                          }
                        }}
                      />
                      {skillSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {skillSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setNewSkill(suggestion)
                                setSkillSuggestions([])
                              }}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button type="button" onClick={handleAddSkill}>
                      Add
                    </Button>
                  </div>
                  {requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{skill}</span>
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Required Licenses */}
                <div className="space-y-2">
                  <Label>Required Licenses</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a license or certification"
                      value={newLicense}
                      onChange={(e) => setNewLicense(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddLicense()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddLicense}>
                      Add
                    </Button>
                  </div>
                  {requiredLicenses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {requiredLicenses.map((license, index) => (
                        <Badge key={index} variant="outline" className="flex items-center space-x-1 bg-green-50 text-green-700">
                          <Award className="h-3 w-3" />
                          <span>{license}</span>
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveLicense(license)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="postedWithinDays">Posted Within (days)</Label>
                    <Input
                      id="postedWithinDays"
                      type="number"
                      value={postedWithinDays}
                      onChange={(e) => setPostedWithinDays(e.target.value)}
                      placeholder="e.g., 30"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isUrgent"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="isUrgent">Urgent Hiring Only</Label>
                  </div>
                </div>
              </>
            )}

            {/* Professional-specific filters */}
            {searchType === 'professionals' && (
              <>
                {/* Skills */}
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Add a skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddSkill()
                          }
                        }}
                      />
                      {skillSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {skillSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setNewSkill(suggestion)
                                setSkillSuggestions([])
                              }}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button type="button" onClick={handleAddSkill}>
                      Add
                    </Button>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{skill}</span>
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hourly Rate Range */}
                <div className="space-y-2">
                  <Label>Hourly Rate Range (USD)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Min"
                        type="number"
                        value={hourlyRateMin}
                        onChange={(e) => setHourlyRateMin(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={hourlyRateMax}
                        onChange={(e) => setHourlyRateMax(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="availabilityStatus">Availability</Label>
                    <select
                      id="availabilityStatus"
                      value={availabilityStatus}
                      onChange={(e) => setAvailabilityStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Availability</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceMin">Minimum Experience (years)</Label>
                    <Input
                      id="experienceMin"
                      type="number"
                      value={experienceMin}
                      onChange={(e) => setExperienceMin(e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>

                {/* Rating & Licenses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ratingMin">Minimum Rating</Label>
                    <select
                      id="ratingMin"
                      value={ratingMin}
                      onChange={(e) => setRatingMin(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Rating</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Licenses & Certifications</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a license"
                        value={newLicense}
                        onChange={(e) => setNewLicense(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddLicense()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddLicense}>
                        Add
                      </Button>
                    </div>
                    {licenses.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {licenses.map((license, index) => (
                          <Badge key={index} variant="outline" className="flex items-center space-x-1 bg-green-50 text-green-700">
                            <Award className="h-3 w-3" />
                            <span>{license}</span>
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleRemoveLicense(license)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              <div className="flex space-x-2">
                {onSaveSearch && (
                  <Button variant="outline" onClick={() => setSaveDialogOpen(true)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Search
                  </Button>
                )}
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Save Search Dialog */}
        {saveDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Save Search</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="searchName">Search Name</Label>
                  <Input
                    id="searchName"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="e.g., Electrical Engineers in New York"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableAlert"
                    checked={enableAlert}
                    onChange={(e) => setEnableAlert(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="enableAlert" className="flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-blue-600" />
                    Enable alerts for new matches
                  </Label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSearch}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}