'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Star, AlertTriangle } from 'lucide-react'
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
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [skillsRating, setSkillsRating] = useState(5)
  const [communicationRating, setCommunicationRating] = useState(5)
  const [timelinessRating, setTimelinessRating] = useState(5)
  const [professionalismRating, setProfessionalismRating] = useState(5)
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [isPublic, setIsPublic] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (!comment) {
        throw new Error('Please provide a review comment')
      }

      const reviewData: Partial<Review> = {
        job_id: jobId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating,
        title: title || undefined,
        comment,
        skills_rating: skillsRating,
        communication_rating: communicationRating,
        timeliness_rating: timelinessRating,
        professionalism_rating: professionalismRating,
        would_recommend: wouldRecommend,
        is_public: isPublic
      }

      const review = await reviewService.createReview(reviewData)
      onSubmit(review)
    } catch (error: any) {
      setError(error.message || 'Failed to submit review')
      setSubmitting(false)
    }
  }

  const StarRating = ({ 
    value, 
    onChange 
  }: { 
    value: number, 
    onChange: (value: number) => void 
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>
          Share your experience working with {revieweeName} on {jobTitle}
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
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <div className="flex items-center space-x-4">
              <StarRating value={rating} onChange={setRating} />
              <span className="text-lg font-medium">{rating}.0</span>
            </div>
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
            />
          </div>

          {/* Review Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Review Comment *</Label>
            <textarea
              id="comment"
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details of your experience working with this professional..."
              required
            />
          </div>

          {/* Category Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Skills & Expertise</Label>
              <StarRating value={skillsRating} onChange={setSkillsRating} />
            </div>
            <div className="space-y-2">
              <Label>Communication</Label>
              <StarRating value={communicationRating} onChange={setCommunicationRating} />
            </div>
            <div className="space-y-2">
              <Label>Timeliness</Label>
              <StarRating value={timelinessRating} onChange={setTimelinessRating} />
            </div>
            <div className="space-y-2">
              <Label>Professionalism</Label>
              <StarRating value={professionalismRating} onChange={setProfessionalismRating} />
            </div>
          </div>

          {/* Would Recommend */}
          <div className="space-y-2">
            <Label>Would you recommend this professional?</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="recommend-yes"
                  checked={wouldRecommend}
                  onChange={() => setWouldRecommend(true)}
                  className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="recommend-yes" className="text-sm">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="recommend-no"
                  checked={!wouldRecommend}
                  onChange={() => setWouldRecommend(false)}
                  className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="recommend-no" className="text-sm">No</Label>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Review Visibility</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="is-public" className="text-sm">
                Make this review public (visible to all users)
              </Label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}