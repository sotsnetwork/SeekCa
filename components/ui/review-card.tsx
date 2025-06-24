import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, ThumbsUp, Calendar } from 'lucide-react'
import { ReviewWithDetails } from '@/lib/reviews'

interface ReviewCardProps {
  review: ReviewWithDetails
  onVoteHelpful: (reviewId: string, isHelpful: boolean) => void
  canVote: boolean
}

export function ReviewCard({ review, onVoteHelpful, canVote }: ReviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {review.title || `${review.rating}-Star Review`}
              </h3>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
              {review.job_title && (
                <>
                  <span className="mx-2">•</span>
                  <span className="truncate">Project: {review.job_title}</span>
                </>
              )}
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
            
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex items-center mb-2 md:mb-0">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={review.reviewer_avatar} alt={review.reviewer_name || ''} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                    {review.reviewer_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-gray-900">
                  {review.reviewer_name || 'Anonymous'}
                </span>
                {review.reviewer_company && (
                  <span className="text-xs text-gray-500 ml-1 hidden sm:inline">
                    from {review.reviewer_company}
                  </span>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onVoteHelpful(review.id, true)}
                disabled={!canVote}
                className="text-xs"
              >
                <ThumbsUp className="w-3 h-3 mr-1" />
                Helpful ({review.helpful_count})
              </Button>
            </div>
            
            {/* Response to review */}
            {review.response_text && (
              <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium text-gray-900">Response from Professional</span>
                </div>
                <p className="text-xs text-gray-700">{review.response_text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {review.response_created_at && new Date(review.response_created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}