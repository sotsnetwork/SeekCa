'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Bell, 
  BellOff, 
  Trash, 
  Clock, 
  Calendar, 
  Play,
  Edit
} from 'lucide-react'
import { searchService, SavedSearch } from '@/lib/search'

interface SavedSearchesProps {
  userId: string
  onSearchExecute: (filters: any, searchType: 'jobs' | 'professionals') => void
}

export function SavedSearches({ userId, onSearchExecute }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSavedSearches = async () => {
      try {
        const searches = await searchService.getSavedSearches(userId)
        setSavedSearches(searches)
      } catch (error) {
        console.error('Error fetching saved searches:', error)
        setError('Failed to load saved searches')
      } finally {
        setLoading(false)
      }
    }

    fetchSavedSearches()
  }, [userId])

  const handleToggleAlert = async (searchId: string, enableAlert: boolean) => {
    try {
      const updatedSearch = await searchService.updateSavedSearch(searchId, {
        is_alert_enabled: enableAlert
      })
      
      setSavedSearches(prev => 
        prev.map(search => 
          search.id === searchId ? updatedSearch : search
        )
      )
    } catch (error) {
      console.error('Error updating saved search:', error)
    }
  }

  const handleDeleteSearch = async (searchId: string) => {
    try {
      await searchService.deleteSavedSearch(searchId)
      setSavedSearches(prev => prev.filter(search => search.id !== searchId))
    } catch (error) {
      console.error('Error deleting saved search:', error)
    }
  }

  const formatAlertFrequency = (frequency: string) => {
    switch (frequency) {
      case 'immediate': return 'Real-time'
      case 'daily': return 'Daily'
      case 'weekly': return 'Weekly'
      default: return frequency
    }
  }

  const formatSearchCriteria = (criteria: any, searchType: string) => {
    const parts = []
    
    if (searchType === 'jobs') {
      if (criteria.query) parts.push(`"${criteria.query}"`)
      if (criteria.category) parts.push(criteria.category)
      if (criteria.jobType) parts.push(criteria.jobType.replace('-', ' '))
      if (criteria.location) parts.push(criteria.location)
      if (criteria.remoteAllowed) parts.push('Remote')
      if (criteria.salaryMin) parts.push(`$${criteria.salaryMin}+`)
      if (criteria.requiredSkills?.length) parts.push(`${criteria.requiredSkills.length} skills`)
    } else {
      if (criteria.query) parts.push(`"${criteria.query}"`)
      if (criteria.skills?.length) parts.push(`${criteria.skills.length} skills`)
      if (criteria.location) parts.push(criteria.location)
      if (criteria.hourlyRateMin) parts.push(`$${criteria.hourlyRateMin}+/hr`)
      if (criteria.availabilityStatus) parts.push(criteria.availabilityStatus)
      if (criteria.experienceMin) parts.push(`${criteria.experienceMin}+ years`)
      if (criteria.ratingMin) parts.push(`${criteria.ratingMin}+ stars`)
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'No filters'
  }

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading saved searches...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (savedSearches.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved searches</h3>
          <p className="text-gray-600 mb-4">
            Save your searches to quickly access them later or set up alerts for new matches
          </p>
          <p className="text-sm text-gray-500">
            Use the search tab to create and save your first search
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Job Searches */}
      {savedSearches.filter(s => s.search_type === 'jobs').length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Job Searches</h3>
          <div className="space-y-4">
            {savedSearches
              .filter(search => search.search_type === 'jobs')
              .map((search) => (
                <Card key={search.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{search.name}</h4>
                          {search.is_alert_enabled && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                              <Bell className="h-3 w-3 mr-1" />
                              {formatAlertFrequency(search.alert_frequency)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {formatSearchCriteria(search.criteria, 'jobs')}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            Last updated: {new Date(search.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleAlert(search.id, !search.is_alert_enabled)}
                        >
                          {search.is_alert_enabled ? (
                            <BellOff className="h-4 w-4" />
                          ) : (
                            <Bell className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onSearchExecute(search.criteria, 'jobs')}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteSearch(search.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Professional Searches */}
      {savedSearches.filter(s => s.search_type === 'professionals').length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Professional Searches</h3>
          <div className="space-y-4">
            {savedSearches
              .filter(search => search.search_type === 'professionals')
              .map((search) => (
                <Card key={search.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{search.name}</h4>
                          {search.is_alert_enabled && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                              <Bell className="h-3 w-3 mr-1" />
                              {formatAlertFrequency(search.alert_frequency)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {formatSearchCriteria(search.criteria, 'professionals')}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            Created: {new Date(search.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleAlert(search.id, !search.is_alert_enabled)}
                        >
                          {search.is_alert_enabled ? (
                            <BellOff className="h-4 w-4" />
                          ) : (
                            <Bell className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onSearchExecute(search.criteria, 'professionals')}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteSearch(search.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}