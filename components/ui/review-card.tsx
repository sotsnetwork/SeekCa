import { useState } from 'react'
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
  const [hasVoted, setHasVoted] = useState(false)
  
  const handleVote = () => {
    if (canVote && !hasVoted) {
      onVoteHelpful(review.id, true)
      setHasVoted(true)
    }
  }
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {review.title || `${review.rating}-Star Review`}
              </h3>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {review.job_title && (
                <>
                  <span className="mx-2">•</span>
                  <span>Project: {review.job_title}</span>
                </>
              )}
            </div>
            
            <p className="text-gray-700 mb-4">{review.comment}</p>
            
            {/* Category Ratings */}
            {(review.skills_rating || review.communication_rating || 
              review.timeliness_rating || review.professionalism_rating) && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {review.skills_rating && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Skills:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
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
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Communication:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
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
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Timeliness:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
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
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Professionalism:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={review.reviewer_avatar} alt={review.reviewer_name || ''} />
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    {review.reviewer_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-900">
                  {review.reviewer_name || 'Anonymous'}
                </span>
                {review.reviewer_company && (
                  <span className="text-gray-500 ml-2">
                    from {review.reviewer_company}
                  </span>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleVote}
                disabled={!canVote || hasVoted}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Helpful ({review.helpful_count})
              </Button>
            </div>
            
            {/* Response to review */}
            {review.response_text && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="font-medium text-gray-900">Response from Professional</span>
                </div>
                <p className="text-gray-700 text-sm">{review.response_text}</p>
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