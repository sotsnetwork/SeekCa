'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Star } from 'lucide-react'
import { ReviewStatistics } from '@/lib/reviews'

interface ReviewSummaryProps {
  statistics: ReviewStatistics
  compact?: boolean
}

export function ReviewSummary({ statistics, compact = false }: ReviewSummaryProps) {
  return (
    <Card className={compact ? 'border-0 shadow-none' : ''}>
      <CardHeader className={compact ? 'p-3 pb-0' : ''}>
        <CardTitle className="flex items-center">
          <Star className="mr-2 h-5 w-5 text-yellow-500" />
          Review Summary
        </CardTitle>
        {!compact && (
          <CardDescription>
            Based on {statistics?.total_reviews || 0} reviews
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={compact ? 'p-3 pt-2' : ''}>
        <div className={`grid grid-cols-1 ${compact ? 'gap-4' : 'md:grid-cols-3 gap-8'}`}>
          {/* Overall Rating */}
          <div className="text-center">
            <div className={`${compact ? 'text-3xl' : 'text-5xl'} font-bold text-gray-900 mb-2`}>
              {statistics?.average_rating?.toFixed(1) || '0.0'}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} ${
                    star <= Math.round(statistics?.average_rating || 0)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
              {statistics?.total_reviews || 0} total reviews
            </p>
            {!compact && (
              <p className="text-sm text-gray-600">
                {statistics?.recommendation_percentage || 0}% would recommend
              </p>
            )}
          </div>
          
          {!compact && (
            <>
              {/* Rating Distribution */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Rating Distribution</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = statistics?.rating_distribution?.[rating as keyof typeof statistics.rating_distribution] || 0
                    const percentage = statistics?.total_reviews 
                      ? (count / statistics.total_reviews) * 100 
                      : 0
                    
                    return (
                      <div key={rating} className="flex items-center">
                        <div className="w-8 text-sm font-medium text-gray-900">{rating}</div>
                        <div className="w-full mx-2">
                          <Progress value={percentage} className="h-2" />
                        </div>
                        <div className="w-8 text-sm text-gray-600 text-right">{count}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Category Ratings */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Category Ratings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Skills</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">
                        {statistics?.category_averages?.skills?.toFixed(1) || '0.0'}
                      </span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Communication</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">
                        {statistics?.category_averages?.communication?.toFixed(1) || '0.0'}
                      </span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Timeliness</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">
                        {statistics?.category_averages?.timeliness?.toFixed(1) || '0.0'}
                      </span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Professionalism</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">
                        {statistics?.category_averages?.professionalism?.toFixed(1) || '0.0'}
                      </span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}