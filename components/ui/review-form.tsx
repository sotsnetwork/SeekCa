'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Star, 
  Send, 
  Award, 
  MessageSquare, 
  Clock, 
  Users, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { reviewService, Review } from '@/lib/reviews'

interface ReviewFormProps {
  jobId: string
  revieweeId: string
  reviewerId: string
  revieweeName: string
  jobTitle: string
  onSubmit: (review: Review) => void
  onCancel: () => void
}

export function ReviewForm({
  jobId,
  revieweeId,
  reviewerId,
  revieweeName,
  jobTitle,
  onSubmit,
  onCancel
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [skillsRating, setSkillsRating] = useState(0)
  const [communicationRating, setCommunicationRating] = useState(0)
  const [timelinessRating, setTimelinessRating] = useState(0)
  const [professionalismRating, setProfessionalismRating] = useState(0)
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [isPublic, setIsPublic] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleStarClick = (starRating: number, setter: (rating: number) => void) => {
    setter(starRating)
  }

  const renderStarRating = (
    currentRating: number,
    onRatingChange: (rating: number) => void,
    label: string,
    required = false
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star, onRatingChange)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= currentRating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {currentRating > 0 ? `${currentRating} star${currentRating !== 1 ? 's' : ''}` : 'Click to rate'}
        </span>
      </div>
    </div>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Please provide an overall rating')
      return
    }

    if (!comment.trim()) {
      setError('Please write a review comment')
      return
    }

    setSubmitting(true)

    try {
      const reviewData = {
        job_id: jobId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        skills_rating: skillsRating || undefined,
        communication_rating: communicationRating || undefined,
        timeliness_rating: timelinessRating || undefined,
        professionalism_rating: professionalismRating || undefined,
        would_recommend: wouldRecommend,
        is_public: isPublic
      }

      const review = await reviewService.createReview(reviewData)
      onSubmit(review)
    } catch (error: any) {
      setError(error.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="mr-2 h-5 w-5 text-yellow-500" />
          Write a Review
        </CardTitle>
        <CardDescription>
          Share your experience working with {revieweeName} on "{jobTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Overall Rating */}
          <div className="space-y-4">
            {renderStarRating(rating, setRating, 'Overall Rating', true)}
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title (Optional)</Label>
            <Input
              id="title"
              placeholder="Summarize your experience in a few words"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Review Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">
              Your Review <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="comment"
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your experience working with this professional. What did they do well? How was the communication and quality of work?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <div className="text-xs text-gray-500 text-right">
              {comment.length}/1000 characters
            </div>
          </div>

          {/* Category Ratings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Award className="mr-2 h-5 w-5 text-blue-600" />
              Detailed Ratings (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderStarRating(
                skillsRating,
                setSkillsRating,
                'Technical Skills & Quality'
              )}
              {renderStarRating(
                communicationRating,
                setCommunicationRating,
                'Communication'
              )}
              {renderStarRating(
                timelinessRating,
                setTimelinessRating,
                'Timeliness & Reliability'
              )}
              {renderStarRating(
                professionalismRating,
                setProfessionalismRating,
                'Professionalism'
              )}
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommend"
                checked={wouldRecommend}
                onCheckedChange={setWouldRecommend}
              />
              <Label htmlFor="recommend" className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                I would recommend this professional to others
              </Label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Privacy Settings</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public" className="text-sm">
                Make this review public (visible on the professional's profile)
              </Label>
            </div>
            <p className="text-xs text-gray-600">
              Public reviews help other clients make informed decisions. Your name will be displayed with public reviews.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || rating === 0 || !comment.trim()}>
              {submitting ? 'Submitting...' : 'Submit Review'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}