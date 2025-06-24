'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'
import { ReviewWithDetails } from '@/lib/reviews'
import { cn } from '@/lib/utils'

interface ReviewCardProps {
  review: ReviewWithDetails
  currentUserId?: string
  onVoteHelpful?: (reviewId: string, isHelpful: boolean) => void
  onRespond?: (reviewId: string) => void
  className?: string
}

export function ReviewCard({
  review,
  currentUserId,
  onVoteHelpful,
  onRespond,
  className
}: ReviewCardProps) {
  const [userVote, setUserVote] = useState<boolean | null>(null)

  const renderStars = (rating: number, size = 'sm') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300',
              size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
            )}
          />
        ))}
      </div>
    )
  }

  const handleVote = (isHelpful: boolean) => {
    if (!currentUserId || !onVoteHelpful) return
    
    const newVote = userVote === isHelpful ? null : isHelpful
    setUserVote(newVote)
    onVoteHelpful(review.review_id, isHelpful)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={review.reviewer_avatar} alt={review.reviewer_name} />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {review.reviewer_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-900">
                  {review.reviewer_name || 'Anonymous'}
                </h4>
                {review.reviewer_company && (
                  <Badge variant="outline" className="text-xs">
                    {review.reviewer_company}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                {renderStars(review.rating)}
                <span className="text-sm font-medium text-gray-900">
                  {review.rating}.0
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {formatDate(review.created_at)}
              </p>
            </div>
          </div>
          
          {review.would_recommend && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Recommends
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Review Title */}
        {review.title && (
          <h5 className="font-medium text-gray-900">{review.title}</h5>
        )}

        {/* Review Comment */}
        {review.comment && (
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        )}

        {/* Category Ratings */}
        {(review.skills_rating || review.communication_rating || 
          review.timeliness_rating || review.professionalism_rating) && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            {review.skills_rating && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Skills</span>
                {renderStars(review.skills_rating)}
              </div>
            )}
            {review.communication_rating && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Communication</span>
                {renderStars(review.communication_rating)}
              </div>
            )}
            {review.timeliness_rating && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Timeliness</span>
                {renderStars(review.timeliness_rating)}
              </div>
            )}
            {review.professionalism_rating && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Professionalism</span>
                {renderStars(review.professionalism_rating)}
              </div>
            )}
          </div>
        )}

        {/* Job Context */}
        {review.job_title && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Project:</span> {review.job_title}
          </div>
        )}

        {/* Professional Response */}
        {review.response_text && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Professional Response
              </span>
              {review.response_created_at && (
                <span className="text-xs text-blue-700">
                  {formatDate(review.response_created_at)}
                </span>
              )}
            </div>
            <p className="text-sm text-blue-800">{review.response_text}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            {/* Helpful Votes */}
            {currentUserId && onVoteHelpful && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Helpful?</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(true)}
                  className={cn(
                    "h-8 px-2",
                    userVote === true && "bg-green-100 text-green-700"
                  )}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(false)}
                  className={cn(
                    "h-8 px-2",
                    userVote === false && "bg-red-100 text-red-700"
                  )}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {review.helpful_count > 0 && (
              <span className="text-sm text-gray-600">
                {review.helpful_count} found this helpful
              </span>
            )}
          </div>

          {/* Response Button */}
          {currentUserId && onRespond && !review.response_text && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRespond(review.review_id)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Respond
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}