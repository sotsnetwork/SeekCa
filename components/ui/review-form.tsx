'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Star, CheckCircle, AlertTriangle } from 'lucide-react'
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
  const [rating, setRating] = useState(0)
  const [skillsRating, setSkillsRating] = useState(0)
  const [communicationRating, setCommunicationRating] = useState(0)
  const [timelinessRating, setTimelinessRating] = useState(0)
  const [professionalismRating, setProfessionalismRating] = useState(0)
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (rating === 0) {
      setError('Please provide an overall rating')
      return
    }
    
    if (!comment.trim()) {
      setError('Please provide a review comment')
      return
    }
    
    try {
      setIsSubmitting(true)
      
      const reviewData: Partial<Review> = {
        job_id: jobId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating,
        title: title.trim() || undefined,
        comment,
        skills_rating: skillsRating || undefined,
        communication_rating: communicationRating || undefined,
        timeliness_rating: timelinessRating || undefined,
        professionalism_rating: professionalismRating || undefined,
        would_recommend: wouldRecommend,
        is_public: isPublic
      }
      
      const newReview = await reviewService.createReview(reviewData)
      onSubmit(newReview)
    } catch (error: any) {
      setError(error.message || 'Failed to submit review')
      setIsSubmitting(false)
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
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                star <= value
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
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
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <div className="flex items-center">
              <StarRating value={rating} onChange={setRating} />
              <span className="ml-2 text-gray-600">
                {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
              </span>
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
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Category Ratings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          {/* Would Recommend */}
          <div className="space-y-2">
            <Label>Would you recommend this professional?</Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={wouldRecommend === true}
                  onChange={() => setWouldRecommend(true)}
                  className="rounded-full text-blue-600 focus:ring-blue-500"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={wouldRecommend === false}
                  onChange={() => setWouldRecommend(false)}
                  className="rounded-full text-blue-600 focus:ring-blue-500"
                />
                <span>No</span>
              </label>
            </div>
          </div>
          
          {/* Review Visibility */}
          <div className="space-y-2">
            <Label>Review Visibility</Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isPublic === true}
                  onChange={() => setIsPublic(true)}
                  className="rounded-full text-blue-600 focus:ring-blue-500"
                />
                <span>Public</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isPublic === false}
                  onChange={() => setIsPublic(false)}
                  className="rounded-full text-blue-600 focus:ring-blue-500"
                />
                <span>Private (only visible to you and the professional)</span>
              </label>
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}