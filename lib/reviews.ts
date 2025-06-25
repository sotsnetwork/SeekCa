'use client'

import { supabase } from './supabase'

export interface Review {
  id: string
  job_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  title?: string
  comment?: string
  skills_rating?: number
  communication_rating?: number
  timeliness_rating?: number
  professionalism_rating?: number
  would_recommend: boolean
  is_public: boolean
  helpful_count: number
  created_at: string
  updated_at: string
}

export interface ReviewWithDetails extends Review {
  job_title?: string
  reviewer_name?: string
  reviewer_avatar?: string
  reviewer_company?: string
  response_text?: string
  response_created_at?: string
}

export interface ReviewStatistics {
  total_reviews: number
  average_rating: number
  rating_distribution: {
    '5': number
    '4': number
    '3': number
    '2': number
    '1': number
  }
  category_averages: {
    skills: number
    communication: number
    timeliness: number
    professionalism: number
  }
  recommendation_percentage: number
}

export interface PortfolioItem {
  id: string
  professional_id: string
  title: string
  description: string
  project_type?: string
  start_date?: string
  end_date?: string
  duration_months?: number
  client_name?: string
  project_value?: number
  location?: string
  skills_used: string[]
  tools_used: string[]
  certifications_applied: string[]
  featured_image_url?: string
  image_urls: string[]
  document_urls: string[]
  challenges_overcome?: string
  results_achieved?: string
  client_testimonial?: string
  is_featured: boolean
  is_public: boolean
  display_order: number
  created_at: string
  updated_at: string
}

interface ReviewResponse {
  id: string
  review_id: string
  responder_id: string
  response_text: string
  created_at: string
  updated_at: string
}

export const reviewService = {
  // Review CRUD operations
  async createReview(reviewData: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateReview(reviewId: string, updates: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (error) throw error
  },

  async getReview(reviewId: string): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single()

    if (error) throw error
    return data
  },

  // Get reviews for a professional with detailed information
  async getProfessionalReviews(
    professionalId: string, 
    limit = 10, 
    offset = 0
  ): Promise<ReviewWithDetails[]> {
    const { data, error } = await supabase.rpc('get_professional_reviews', {
      p_professional_id: professionalId,
      p_limit: limit,
      p_offset: offset
    })

    if (error) throw error
    return data || []
  },

  // Get review statistics for a professional
  async getReviewStatistics(professionalId: string): Promise<ReviewStatistics> {
    const { data, error } = await supabase.rpc('get_review_statistics', {
      p_professional_id: professionalId
    })

    if (error) throw error
    return data?.[0] || {
      total_reviews: 0,
      average_rating: 0,
      rating_distribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
      category_averages: { skills: 0, communication: 0, timeliness: 0, professionalism: 0 },
      recommendation_percentage: 0
    }
  },

  // Get reviews by job
  async getJobReviews(jobId: string): Promise<ReviewWithDetails[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        jobs!inner(title),
        reviewer:profiles!reviews_reviewer_id_fkey(
          first_name,
          last_name,
          company_name,
          avatar_url
        ),
        review_responses(
          response_text,
          created_at
        )
      `)
      .eq('job_id', jobId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Check if user can review (must be part of completed job)
  async canUserReview(userId: string, jobId: string, revieweeId: string): Promise<boolean> {
    // Check if user was involved in the job (either as hirer or professional)
    const { data: job } = await supabase
      .from('jobs')
      .select('hirer_id')
      .eq('id', jobId)
      .single()

    if (!job) return false

    // Check if there's a completed application
    const { data: application } = await supabase
      .from('applications')
      .select('professional_id, status')
      .eq('job_id', jobId)
      .eq('status', 'hired')
      .single()

    if (!application) return false

    // User can review if they were the hirer or the hired professional
    const canReview = (
      (userId === job.hirer_id && revieweeId === application.professional_id) ||
      (userId === application.professional_id && revieweeId === job.hirer_id)
    )

    if (!canReview) return false

    // Check if review already exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('job_id', jobId)
      .eq('reviewer_id', userId)
      .eq('reviewee_id', revieweeId)
      .single()

    return !existingReview
  },

  // Review responses
  async createReviewResponse(
    reviewId: string, 
    responderId: string, 
    responseText: string
  ): Promise<ReviewResponse> {
    const { data, error } = await supabase
      .from('review_responses')
      .insert({
        review_id: reviewId,
        responder_id: responderId,
        response_text: responseText
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateReviewResponse(
    responseId: string, 
    responseText: string
  ): Promise<ReviewResponse> {
    const { data, error } = await supabase
      .from('review_responses')
      .update({ response_text: responseText })
      .eq('id', responseId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Helpful votes
  async voteHelpful(reviewId: string, voterId: string, isHelpful: boolean): Promise<void> {
    const { error } = await supabase
      .from('review_helpful_votes')
      .upsert({
        review_id: reviewId,
        voter_id: voterId,
        is_helpful: isHelpful
      })

    if (error) throw error
  },

  async getUserVote(reviewId: string, voterId: string): Promise<boolean | null> {
    const { data, error } = await supabase
      .from('review_helpful_votes')
      .select('is_helpful')
      .eq('review_id', reviewId)
      .eq('voter_id', voterId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data?.is_helpful || null
  }
}

export const portfolioService = {
  // Portfolio CRUD operations
  async createPortfolioItem(itemData: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert(itemData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePortfolioItem(
    itemId: string, 
    updates: Partial<PortfolioItem>
  ): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deletePortfolioItem(itemId: string): Promise<void> {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', itemId)

    if (error) throw error
  },

  async getPortfolioItem(itemId: string): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('id', itemId)
      .single()

    if (error) throw error
    return data
  },

  // Get professional's portfolio
  async getProfessionalPortfolio(
    professionalId: string, 
    limit = 10, 
    offset = 0
  ): Promise<PortfolioItem[]> {
    const { data, error } = await supabase.rpc('get_professional_portfolio', {
      p_professional_id: professionalId,
      p_limit: limit,
      p_offset: offset
    })

    if (error) throw error
    return data || []
  },

  // Get featured portfolio items
  async getFeaturedPortfolio(professionalId: string): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('is_public', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(6)

    if (error) throw error
    return data || []
  },

  // Update portfolio item order
  async updatePortfolioOrder(items: { id: string; display_order: number }[]): Promise<void> {
    const updates = items.map(item => 
      supabase
        .from('portfolio_items')
        .update({ display_order: item.display_order })
        .eq('id', item.id)
    )

    const results = await Promise.all(updates)
    const errors = results.filter(result => result.error)
    
    if (errors.length > 0) {
      throw new Error('Failed to update portfolio order')
    }
  },

  // Portfolio statistics
  async getPortfolioStats(professionalId: string): Promise<{
    total_items: number
    featured_items: number
    project_types: string[]
    total_value: number
  }> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('project_type, project_value, is_featured')
      .eq('professional_id', professionalId)
      .eq('is_public', true)

    if (error) throw error

    const items = data || []
    const projectTypes = [...new Set(items.map(item => item.project_type).filter(Boolean))]
    const totalValue = items.reduce((sum, item) => sum + (item.project_value || 0), 0)
    const featuredCount = items.filter(item => item.is_featured).length

    return {
      total_items: items.length,
      featured_items: featuredCount,
      project_types: projectTypes,
      total_value: totalValue
    }
  }
}