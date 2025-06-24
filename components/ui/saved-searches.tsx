'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Heart, 
  Search, 
  Bell, 
  Trash2, 
  Edit, 
  Play,
  Clock,
  MapPin,
  DollarSign,
  Star
} from 'lucide-react'
import { searchService } from '@/lib/search'

interface SavedSearchesProps {
  userId: string
  onSearchExecute: (filters: any, searchType: 'jobs' | 'professionals') => void
}

export function SavedSearches({ userId, onSearchExecute }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSavedSearches()
  }, [userId])

  const loadSavedSearches = async () => {
    try {
      setLoading(true)
      const searches = await searchService.getSavedSearches(userId)
      setSavedSearches(searches)
    } catch (error) {
      console.error('Error loading saved searches:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAlert = async (searchId: string, enabled: boolean) => {
    try {
      await searchService.updateSavedSearch(searchId, { is_alert_enabled: enabled })
      setSavedSearches(prev => 
        prev.map(search => 
          search.id === searchId 
            ? { ...search, is_alert_enabled: enabled }
            : search
        )
      )
    } catch (error) {
      console.error('Error updating search alert:', error)
    }
  }

  const deleteSearch = async (searchId: string) => {
    try {
      await searchService.deleteSavedSearch(searchId)
      setSavedSearches(prev => prev.filter(search => search.id !== searchId))
    } catch (error) {
      console.error('Error deleting search:', error)
    }
  }

  const executeSearch = (search: any) => {
    onSearchExecute(search.criteria, search.search_type)
  }

  const formatSearchCriteria = (criteria: any, searchType: string) => {
    const parts = []
    
    if (criteria.query) {
      parts.push(`"${criteria.query}"`)
    }
    
    if (criteria.location) {
      parts.push(`📍 ${criteria.location}`)
    }
    
    if (criteria.skills && criteria.skills.length > 0) {
      parts.push(`🔧 ${criteria.skills.slice(0, 2).join(', ')}${criteria.skills.length > 2 ? '...' : ''}`)
    }
    
    if (searchType === 'jobs') {
      if (criteria.category) {
        parts.push(`📂 ${criteria.category}`)
      }
      if (criteria.salaryMin || criteria.salaryMax) {
        const min = criteria.salaryMin || 0
        const max = criteria.salaryMax || '∞'
        parts.push(`💰 $${min}-${max}${criteria.salaryType === 'hourly' ? '/hr' : '/yr'}`)
      }
      if (criteria.remoteAllowed) {
        parts.push(`🏠 Remote`)
      }
      if (criteria.isUrgent) {
        parts.push(`⚡ Urgent`)
      }
    } else {
      if (criteria.hourlyRateMin || criteria.hourlyRateMax) {
        const min = criteria.hourlyRateMin || 0
        const max = criteria.hourlyRateMax || '∞'
        parts.push(`💰 $${min}-${max}/hr`)
      }
      if (criteria.experienceMin) {
        parts.push(`📅 ${criteria.experienceMin}+ years`)
      }
      if (criteria.ratingMin) {
        parts.push(`⭐ ${criteria.ratingMin}+ stars`)
      }
      if (criteria.availabilityStatus) {
        parts.push(`🟢 ${criteria.availabilityStatus}`)
      }
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'No specific criteria'
  }

  const getSearchTypeIcon = (searchType: string) => {
    return searchType === 'jobs' ? '💼' : '👥'
  }

  const getSearchTypeColor = (searchType: string) => {
    return searchType === 'jobs' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-red-500" />
            Saved Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5 text-red-500" />
          Saved Searches
        </CardTitle>
        <CardDescription>
          Quickly access your saved searches and manage alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {savedSearches.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved searches</h3>
            <p className="text-gray-600">
              Save your searches to quickly access them later and get alerts for new matches
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{search.name}</h3>
                      <Badge className={getSearchTypeColor(search.search_type)}>
                        {getSearchTypeIcon(search.search_type)} {search.search_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatSearchCriteria(search.criteria, search.search_type)}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Created {new Date(search.created_at).toLocaleDateString()}
                      </span>
                      {search.last_alert_sent && (
                        <span className="flex items-center">
                          <Bell className="h-3 w-3 mr-1" />
                          Last alert {new Date(search.last_alert_sent).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => executeSearch(search)}
                      className="flex items-center"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSearch(search.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Alert Settings */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Email alerts</span>
                    <Badge variant="outline" className="text-xs">
                      {search.alert_frequency}
                    </Badge>
                  </div>
                  <Switch
                    checked={search.is_alert_enabled}
                    onCheckedChange={(enabled) => toggleAlert(search.id, enabled)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}