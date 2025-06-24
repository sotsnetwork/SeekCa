'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  Star, 
  Award,
  Clock,
  User,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { PortfolioItem } from '@/lib/reviews'

interface PortfolioCardProps {
  item: PortfolioItem
  showActions?: boolean
  onEdit?: (item: PortfolioItem) => void
  onDelete?: (itemId: string) => void
  className?: string
}

export function PortfolioCard({ 
  item, 
  showActions = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: PortfolioCardProps) {
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return null
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getDuration = () => {
    if (item.duration_months) {
      return `${item.duration_months} month${item.duration_months !== 1 ? 's' : ''}`
    }
    if (item.start_date && item.end_date) {
      const start = new Date(item.start_date)
      const end = new Date(item.end_date)
      const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
      return `${months} month${months !== 1 ? 's' : ''}`
    }
    return null
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-0">
        {/* Featured Image */}
        {item.featured_image_url && !imageError && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={item.featured_image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
            {item.is_featured && (
              <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
            {showActions && (
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {item.title}
              </h3>
              {item.project_value && (
                <Badge variant="outline" className="ml-2 text-green-700 border-green-200">
                  {formatCurrency(item.project_value)}
                </Badge>
              )}
            </div>
            
            {item.project_type && (
              <Badge variant="secondary" className="mb-2">
                {item.project_type}
              </Badge>
            )}
          </div>

          {/* Project Details */}
          <div className="space-y-2 mb-4 text-sm text-gray-600">
            {(item.start_date || item.end_date) && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {formatDate(item.start_date)} - {formatDate(item.end_date)}
                  {getDuration() && (
                    <span className="ml-2 text-gray-500">({getDuration()})</span>
                  )}
                </span>
              </div>
            )}
            
            {item.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{item.location}</span>
              </div>
            )}
            
            {item.client_name && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{item.client_name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
            {item.description}
          </p>

          {/* Skills Used */}
          {item.skills_used && item.skills_used.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {item.skills_used.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {item.skills_used.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.skills_used.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Results/Testimonial */}
          {item.results_achieved && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-1 flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Results Achieved
              </h4>
              <p className="text-sm text-green-800 line-clamp-2">
                {item.results_achieved}
              </p>
            </div>
          )}

          {item.client_testimonial && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-blue-800 italic line-clamp-2">
                "{item.client_testimonial}"
              </p>
            </div>
          )}

          {/* Additional Images */}
          {item.image_urls && item.image_urls.length > 0 && (
            <div className="mb-4">
              <div className="flex space-x-2 overflow-x-auto">
                {item.image_urls.slice(0, 3).map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${item.title} - Image ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ))}
                {item.image_urls.length > 3 && (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-600">
                      +{item.image_urls.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-100">
            <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200">
              <Eye className="h-4 w-4 mr-2" />
              View Details
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}