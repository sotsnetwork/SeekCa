'use client'

import { supabase } from './supabase'

export interface JobSearchFilters {
  query?: string
  category?: string
  jobType?: string
  location?: string
  remoteAllowed?: boolean
  salaryMin?: number
  salaryMax?: number
  salaryType?: string
  requiredSkills?: string[]
  requiredLicenses?: string[]
  isUrgent?: boolean
  postedWithinDays?: number
  limit?: number
  offset?: number
}

export interface ProfessionalSearchFilters {
  query?: string
  skills?: string[]
  location?: string
  hourlyRateMin?: number
  hourlyRateMax?: number
  availabilityStatus?: string
  experienceMin?: number
  ratingMin?: number
  licenses?: string[]
  limit?: number
  offset?: number
}

export interface SavedSearch {
  id: string
  user_id: string
  name: string
  search_type: 'jobs' | 'professionals'
  criteria: any
  is_alert_enabled: boolean
  alert_frequency: 'immediate' | 'daily' | 'weekly'
  last_alert_sent?: string
  created_at: string
  updated_at: string
}

export interface JobAlert {
  id: string
  user_id: string
  saved_search_id: string
  job_id: string
  is_sent: boolean
  sent_at?: string
  created_at: string
}

export interface SearchResult<T> {
  data: T[]
  total: number
  hasMore: boolean
}

export const searchService = {
  // Job search functions
  async searchJobs(filters: JobSearchFilters): Promise<SearchResult<any>> {
    const { data, error } = await supabase.rpc('search_jobs', {
      p_search_type: 'jobs',
      p_query: filters.query || null,
      p_category: filters.category || null,
      p_job_type: filters.jobType || null,
      p_location: filters.location || null,
      p_remote_allowed: filters.remoteAllowed || null,
      p_salary_min: filters.salaryMin || null,
      p_salary_max: filters.salaryMax || null,
      p_salary_type: filters.salaryType || null,
      p_required_skills: filters.requiredSkills || null,
      p_required_licenses: filters.requiredLicenses || null,
      p_is_urgent: filters.isUrgent || null,
      p_posted_within_days: filters.postedWithinDays || null,
      p_limit: filters.limit || 50,
      p_offset: filters.offset || 0
    })

    if (error) throw error

    return {
      data: data || [],
      total: data?.length || 0,
      hasMore: (data?.length || 0) === (filters.limit || 50)
    }
  },

  // Professional search functions
  async searchProfessionals(filters: ProfessionalSearchFilters): Promise<SearchResult<any>> {
    const { data, error } = await supabase.rpc('search_professionals', {
      p_search_type: 'professionals',
      p_query: filters.query || null,
      p_skills: filters.skills || null,
      p_location: filters.location || null,
      p_hourly_rate_min: filters.hourlyRateMin || null,
      p_hourly_rate_max: filters.hourlyRateMax || null,
      p_availability_status: filters.availabilityStatus || null,
      p_experience_min: filters.experienceMin || null,
      p_rating_min: filters.ratingMin || null,
      p_licenses: filters.licenses || null,
      p_limit: filters.limit || 50,
      p_offset: filters.offset || 0
    })

    if (error) throw error

    return {
      data: data || [],
      total: data?.length || 0,
      hasMore: (data?.length || 0) === (filters.limit || 50)
    }
  },

  // Saved search functions
  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createSavedSearch(
    userId: string,
    name: string,
    searchType: 'jobs' | 'professionals',
    criteria: any,
    enableAlert = false,
    alertFrequency: 'immediate' | 'daily' | 'weekly' = 'daily'
  ): Promise<SavedSearch> {
    const { data, error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: userId,
        name,
        search_type: searchType,
        criteria,
        is_alert_enabled: enableAlert,
        alert_frequency: alertFrequency
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateSavedSearch(
    searchId: string,
    updates: Partial<SavedSearch>
  ): Promise<SavedSearch> {
    const { data, error } = await supabase
      .from('saved_searches')
      .update(updates)
      .eq('id', searchId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteSavedSearch(searchId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId)

    if (error) throw error
  },

  // Job alert functions
  async getJobAlerts(userId: string): Promise<JobAlert[]> {
    const { data, error } = await supabase
      .from('job_alerts')
      .select(`
        *,
        saved_searches (name, criteria),
        jobs (title, company_name:profiles!jobs_hirer_id_fkey(company_name))
      `)
      .eq('user_id', userId)
      .eq('is_sent', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async markJobAlertAsSent(alertId: string): Promise<void> {
    const { error } = await supabase
      .from('job_alerts')
      .update({ is_sent: true, sent_at: new Date().toISOString() })
      .eq('id', alertId)

    if (error) throw error
  },

  // Analytics functions
  async logSearch(
    userId: string,
    searchType: 'jobs' | 'professionals',
    query: string,
    filters: any,
    resultsCount: number,
    sessionId?: string
  ): Promise<void> {
    const { error } = await supabase.rpc('log_search_analytics', {
      p_user_id: userId,
      p_search_type: searchType,
      p_query: query,
      p_filters: filters,
      p_results_count: resultsCount,
      p_session_id: sessionId
    })

    if (error) console.error('Failed to log search analytics:', error)
  },

  async getPopularSearches(searchType: 'jobs' | 'professionals', limit = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('query, count(*)')
      .eq('search_type', searchType)
      .not('query', 'is', null)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('count', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Suggestion functions
  async getSkillSuggestions(query: string, limit = 10): Promise<string[]> {
    // Professional handwork and engineering skills
    const professionalSkills = [
      'Electrician',
      'Electrical Wiring',
      'Electrical Troubleshooting',
      'Circuit Installation',
      'Motor Control',
      'PLC Programming',
      'Plumbing Installation',
      'Pipe Fitting',
      'Water Systems',
      'Drainage Systems',
      'Gas Lines',
      'HVAC Installation',
      'Air Conditioning',
      'Heating Systems',
      'Ventilation',
      'Refrigeration',
      'Carpentry',
      'Framing',
      'Finish Carpentry',
      'Cabinet Making',
      'Flooring',
      'Masonry',
      'Brickwork',
      'Concrete Work',
      'Stone Work',
      'Arc Welding',
      'MIG Welding',
      'TIG Welding',
      'Welding',
      'Metal Fabrication',
      'Structural Welding',
      'Pipe Welding',
      'Fabrication',
      'Painting',
      'Interior Painting',
      'Exterior Painting',
      'Surface Preparation',
      'Tiling',
      'Ceramic Tiling',
      'Stone Tiling',
      'Roofing',
      'Shingle Installation',
      'Metal Roofing',
      'Roof Repair',
      'Architecture',
      'Building Design',
      'CAD Design',
      'Structural Design',
      'Surveying',
      'Land Surveying',
      'Construction Surveying',
      'Interior Design',
      'Space Planning',
      'Project Management',
      'Construction Management',
      'Quality Control',
      'Safety Management',
      'Blueprint Reading',
      'Code Compliance',
      'Permit Processing'
    ]

    return professionalSkills
      .filter(skill => skill.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit)
  },

  async getLocationSuggestions(query: string, limit = 10): Promise<string[]> {
    const { data: jobLocations, error: jobError } = await supabase
      .from('jobs')
      .select('location')
      .not('location', 'is', null)
      .ilike('location', `%${query}%`)
      .limit(limit)

    const { data: profLocations, error: profError } = await supabase
      .from('profiles')
      .select('location')
      .not('location', 'is', null)
      .ilike('location', `%${query}%`)
      .limit(limit)

    if (jobError || profError) return []

    // Combine and deduplicate locations
    const allLocations = new Set<string>()
    
    jobLocations?.forEach(job => {
      if (job.location) allLocations.add(job.location)
    })
    
    profLocations?.forEach(prof => {
      if (prof.location) allLocations.add(prof.location)
    })

    return Array.from(allLocations).slice(0, limit)
  },

  // Filter utilities
  buildJobFiltersFromUrl(searchParams: URLSearchParams): JobSearchFilters {
    return {
      query: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      jobType: searchParams.get('type') || undefined,
      location: searchParams.get('location') || undefined,
      remoteAllowed: searchParams.get('remote') === 'true' || undefined,
      salaryMin: searchParams.get('salary_min') ? Number(searchParams.get('salary_min')) : undefined,
      salaryMax: searchParams.get('salary_max') ? Number(searchParams.get('salary_max')) : undefined,
      salaryType: searchParams.get('salary_type') || undefined,
      requiredSkills: searchParams.get('skills')?.split(',') || undefined,
      isUrgent: searchParams.get('urgent') === 'true' || undefined,
      postedWithinDays: searchParams.get('posted_within') ? Number(searchParams.get('posted_within')) : undefined
    }
  },

  buildProfessionalFiltersFromUrl(searchParams: URLSearchParams): ProfessionalSearchFilters {
    return {
      query: searchParams.get('q') || undefined,
      skills: searchParams.get('skills')?.split(',') || undefined,
      location: searchParams.get('location') || undefined,
      hourlyRateMin: searchParams.get('rate_min') ? Number(searchParams.get('rate_min')) : undefined,
      hourlyRateMax: searchParams.get('rate_max') ? Number(searchParams.get('rate_max')) : undefined,
      availabilityStatus: searchParams.get('availability') || undefined,
      experienceMin: searchParams.get('experience_min') ? Number(searchParams.get('experience_min')) : undefined,
      ratingMin: searchParams.get('rating_min') ? Number(searchParams.get('rating_min')) : undefined,
      licenses: searchParams.get('licenses')?.split(',') || undefined
    }
  },

  filtersToUrlParams(filters: JobSearchFilters | ProfessionalSearchFilters): URLSearchParams {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.set(key, value.join(','))
        } else {
          params.set(key, String(value))
        }
      }
    })
    
    return params
  }
}