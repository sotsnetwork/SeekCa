'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowLeft
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { reviewService, ReviewWithDetails, ReviewStatistics } from '@/lib/reviews'
import Link from 'next/link'

export default function ProfessionalReviewsPage() {
  const { id } = useParams()
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([])
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [filter, setFilter] = useState<number | null>(null)
  const [professional, setProfessional] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  
  const pageSize = 5

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Get professional profile
        const { data: profData } = await supabase
          .from('professional_profiles')
          .select(`
            *,
            profiles (
              id,
              first_name,
              last_name,
              location,
              avatar_url,
              bio,
              is_verified
            )
          `)
          .eq('user_id', id)
          .single()
        
        setProfessional(profData)
        
        // Get review statistics
        const stats = await reviewService.getReviewStatistics(id as string)
        setStatistics(stats)
        
        // Get reviews
        await fetchReviews(0)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchData()
    }
  }, [id])
  
  const fetchReviews = async (pageNum: number) => {
    try {
      const reviewsData = await reviewService.getProfessionalReviews(
        id as string, 
        pageSize, 
        pageNum * pageSize
      )
      
      if (pageNum === 0) {
        setReviews(reviewsData)
      } else {
        setReviews(prev => [...prev, ...reviewsData])
      }
      
      setHasMore(reviewsData.length === pageSize)
      setPage(pageNum)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }
  
  const handleLoadMore = () => {
    fetchReviews(page + 1)
  }
  
  const handleFilterChange = (rating: number | null) => {
    setFilter(rating)
    setPage(0)
    // In a real implementation, we would filter on the server
    // For now, we'll just reset to page 0
    fetchReviews(0)
  }
  
  const handleVoteHelpful = async (reviewId: string, isHelpful: boolean) => {
    if (!user) return
    
    try {
      await reviewService.voteHelpful(reviewId, user.id, isHelpful)
      
      // Update the UI optimistically
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpful_count: review.helpful_count + (isHelpful ? 1 : 0) }
            : review
        )
      )
    } catch (error) {
      console.error('Error voting on review:', error)
    }
  }
  
  const getFullName = () => {
    if (!professional?.profiles) return 'Professional'
    return `${professional.profiles.first_name || ''} ${professional.profiles.last_name || ''}`.trim()
  }
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    )
  }
  
  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Not Found</h3>
            <p className="text-gray-600 mb-4">The professional you're looking for doesn't exist or has been removed.</p>
            <Link href="/browse">
              <Button>Browse Professionals</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/professionals/${id}`} className="inline-block">
            <Button variant="ghost" size="sm" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>
        
        {/* Professional Header */}
        <div className="flex items-center mb-6 md:mb-8">
          <Avatar className="h-12 w-12 md:h-16 md:w-16 mr-3 md:mr-4">
            <AvatarImage src={professional.profiles?.avatar_url} alt={getFullName()} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-medium">
              {getInitials(getFullName())}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
              {getFullName()}
              {professional.profiles?.is_verified && (
                <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs h-5">Verified</Badge>
              )}
            </h1>
            <p className="text-sm md:text-base text-gray-600">{professional.title || 'Professional'}</p>
          </div>
        </div>
        
        {/* Reviews Stats */}
        <Card className="mb-6 md:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
              Review Summary
            </CardTitle>
            <CardDescription>
              Based on {statistics?.total_reviews || 0} reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {statistics?.average_rating?.toFixed(1) || '0.0'}
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(statistics?.average_rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {statistics?.total_reviews || 0} total reviews
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  {statistics?.recommendation_percentage || 0}% would recommend
                </p>
              </div>
              
              {/* Rating Distribution */}
              <div className="mt-4 md:mt-0">
                <h3 className="text-xs md:text-sm font-medium text-gray-900 mb-2 md:mb-3">Rating Distribution</h3>
                <div className="space-y-1 md:space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = statistics?.rating_distribution?.[rating.toString() as keyof typeof statistics.rating_distribution] || 0
                    const percentage = statistics?.total_reviews 
                      ? (count / statistics.total_reviews) * 100 
                      : 0
                    
                    return (
                      <div key={rating} className="flex items-center">
                        <div className="w-6 md:w-8 text-xs md:text-sm font-medium text-gray-900">{rating}</div>
                        <div className="w-full mx-2">
                          <Progress value={percentage} className="h-2" />
                        </div>
                        <div className="w-6 md:w-8 text-xs md:text-sm text-gray-600 text-right">{count}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Category Ratings */}
              <div className="mt-4 md:mt-0">
                <h3 className="text-xs md:text-sm font-medium text-gray-900 mb-2 md:mb-3">Category Ratings</h3>
                <div className="space-y-1 md:space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Skills</span>
                    <div className="flex items-center">
                      <span className="text-xs md:text-sm font-medium mr-1 md:mr-2">
                        {statistics?.category_averages?.skills?.toFixed(1) || '0.0'}
                      </span>
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Communication</span>
                    <div className="flex items-center">
                      <span className="text-xs md:text-sm font-medium mr-1 md:mr-2">
                        {statistics?.category_averages?.communication?.toFixed(1) || '0.0'}
                      </span>
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Timeliness</span>
                    <div className="flex items-center">
                      <span className="text-xs md:text-sm font-medium mr-1 md:mr-2">
                        {statistics?.category_averages?.timeliness?.toFixed(1) || '0.0'}
                      </span>
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Professionalism</span>
                    <div className="flex items-center">
                      <span className="text-xs md:text-sm font-medium mr-1 md:mr-2">
                        {statistics?.category_averages?.professionalism?.toFixed(1) || '0.0'}
                      </span>
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 space-y-3 md:space-y-0">
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant={filter === null ? "default" : "outline"} 
              size="sm"
              onClick={() => handleFilterChange(null)}
              className="text-xs h-7 px-2"
            >
              All
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filter === rating ? "default" : "outline"}
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => handleFilterChange(rating)}
              >
                {rating} <Star className="w-2 h-2 md:w-3 md:h-3 ml-1" />
              </Button>
            ))}
          </div>
          <div className="w-full md:w-auto">
            <Button variant="outline" size="sm" className="text-xs h-7 w-full md:w-auto">
              <Filter className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Sort by: Most Recent
            </Button>
          </div>
        </div>
        
        {/* Reviews List */}
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
              <MessageSquare className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 md:mb-2">No Reviews Yet</h3>
              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                This professional hasn't received any reviews yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1 md:mb-2">
                        <div className="flex mr-1 md:mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 md:w-5 md:h-5 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {review.title || `${review.rating}-Star Review`}
                        </h3>
                      </div>
                      
                      <div className="flex items-center text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {review.job_title && (
                          <>
                            <span className="mx-1 md:mx-2">•</span>
                            <span className="truncate">Project: {review.job_title}</span>
                          </>
                        )}
                      </div>
                      
                      <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">{review.comment}</p>
                      
                      {/* Category Ratings */}
                      {(review.skills_rating || review.communication_rating || 
                        review.timeliness_rating || review.professionalism_rating) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2 mb-3 md:mb-4">
                          {review.skills_rating && (
                            <div className="flex items-center text-xs md:text-sm">
                              <span className="text-gray-600 mr-1 md:mr-2">Skills:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 md:w-4 md:h-4 ${
                                      star <= review.skills_rating!
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {review.communication_rating && (
                            <div className="flex items-center text-xs md:text-sm">
                              <span className="text-gray-600 mr-1 md:mr-2">Communication:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 md:w-4 md:h-4 ${
                                      star <= review.communication_rating!
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {review.timeliness_rating && (
                            <div className="flex items-center text-xs md:text-sm">
                              <span className="text-gray-600 mr-1 md:mr-2">Timeliness:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 md:w-4 md:h-4 ${
                                      star <= review.timeliness_rating!
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {review.professionalism_rating && (
                            <div className="flex items-center text-xs md:text-sm">
                              <span className="text-gray-600 mr-1 md:mr-2">Professionalism:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 md:w-4 md:h-4 ${
                                      star <= review.professionalism_rating!
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="flex items-center text-xs md:text-sm">
                          <Avatar className="h-6 w-6 md:h-8 md:w-8 mr-2">
                            <AvatarImage src={review.reviewer_avatar} alt={review.reviewer_name || ''} />
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {review.reviewer_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900 mr-1">
                            {review.reviewer_name || 'Anonymous'}
                          </span>
                          {review.reviewer_company && (
                            <span className="text-gray-500 text-xs">
                              from {review.reviewer_company}
                            </span>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 px-2"
                          onClick={() => handleVoteHelpful(review.id, true)}
                          disabled={!user}
                        >
                          <ThumbsUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          Helpful ({review.helpful_count})
                        </Button>
                      </div>
                      
                      {/* Response to review */}
                      {review.response_text && (
                        <div className="mt-3 md:mt-4 bg-gray-50 p-3 md:p-4 rounded-lg">
                          <div className="flex items-center mb-1 md:mb-2">
                            <Avatar className="h-5 w-5 md:h-6 md:w-6 mr-1 md:mr-2">
                              <AvatarImage src={professional.profiles?.avatar_url} alt={getFullName()} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {getInitials(getFullName())}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs md:text-sm font-medium text-gray-900">Response from {getFullName()}</span>
                          </div>
                          <p className="text-gray-700 text-xs md:text-sm">{review.response_text}</p>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {review.response_created_at && new Date(review.response_created_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Pagination */}
            {hasMore && (
              <div className="flex justify-center mt-4 md:mt-6">
                <Button variant="outline" size="sm" onClick={handleLoadMore} className="text-sm">
                  Load More Reviews
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}