'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Calendar,
  Award,
  CheckCircle
} from 'lucide-react'
import { reviewService } from '@/lib/reviews'

interface ReviewCardProps {
  review: any
  currentUserId?: string
  showActions?: boolean
  className?: string
}

export function ReviewCard({ 
  review, 
  currentUserId, 
  showActions = true, 
  className = '' 
}: ReviewCardProps) {
  const [userVote, setUserVote] = useState<boolean | null>(null)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0)
  const [showResponse, setShowResponse] = useState(false)

  const handleVote = async (isHelpful: boolean) => {
    if (!currentUserId) return

    try {
      await reviewService.voteHelpful(review.review_id, currentUserId, isHelpful)
      
      // Update local state
      if (userVote === null) {
        setHelpfulCount(prev => isHelpful ? prev + 1 : prev)
      } else if (userVote !== isHelpful) {
        setHelpfulCount(prev => isHelpful ? prev + 1 : prev - 1)
      }
      
      setUserVote(isHelpful)
    } catch (error) {
      console.error('Error voting on review:', error)
    }
  }

  const renderStars = (rating: number, size = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.reviewer_avatar} alt={review.reviewer_name} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {getInitials(review.reviewer_name || 'Anonymous')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">
                    {review.reviewer_name || 'Anonymous'}
                  </h4>
                  {review.reviewer_company && (
                    <Badge variant="outline" className="text-xs">
                      {review.reviewer_company}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(review.rating)}
                  <span className="text-sm font-medium text-gray-900">
                    {review.rating}.0
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(review.created_at)}
                  </span>
                </div>
              </div>
            </div>
            
            {review.would_recommend && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Recommends
              </Badge>
            )}
          </div>

          {/* Job Context */}
          {review.job_title && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <Award className="h-4 w-4 inline mr-1" />
                Project: <span className="font-medium">{review.job_title}</span>
              </p>
            </div>
          )}

          {/* Review Title */}
          {review.title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {review.title}
            </h3>
          )}

          {/* Review Content */}
          {review.comment && (
            <p className="text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          )}

          {/* Category Ratings */}
          {(review.skills_rating || review.communication_rating || 
            review.timeliness_rating || review.professionalism_rating) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-100">
              {review.skills_rating && (
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 mb-1">Skills</div>
                  {renderStars(review.skills_rating, 'xs')}
                  <div className="text-xs text-gray-600 mt-1">{review.skills_rating}.0</div>
                </div>
              )}
              {review.communication_rating && (
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 mb-1">Communication</div>
                  {renderStars(review.communication_rating, 'xs')}
                  <div className="text-xs text-gray-600 mt-1">{review.communication_rating}.0</div>
                </div>
              )}
              {review.timeliness_rating && (
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 mb-1">Timeliness</div>
                  {renderStars(review.timeliness_rating, 'xs')}
                  <div className="text-xs text-gray-600 mt-1">{review.timeliness_rating}.0</div>
                </div>
              )}
              {review.professionalism_rating && (
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 mb-1">Professionalism</div>
                  {renderStars(review.professionalism_rating, 'xs')}
                  <div className="text-xs text-gray-600 mt-1">{review.professionalism_rating}.0</div>
                </div>
              )}
            </div>
          )}

          {/* Professional Response */}
          {review.response_text && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Response from Professional</span>
                <span className="text-xs text-blue-600">
                  {formatDate(review.response_created_at)}
                </span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                {review.response_text}
              </p>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                {currentUserId && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={userVote === true ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleVote(true)}
                      className="flex items-center"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful
                    </Button>
                    <Button
                      variant={userVote === false ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleVote(false)}
                      className="flex items-center"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Not helpful
                    </Button>
                  </div>
                )}
              </div>
              
              {helpfulCount > 0 && (
                <span className="text-sm text-gray-600">
                  {helpfulCount} {helpfulCount === 1 ? 'person found' : 'people found'} this helpful
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}