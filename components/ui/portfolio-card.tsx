'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  Edit, 
  Trash, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react'
import { PortfolioItem } from '@/lib/reviews'
import { cn } from '@/lib/utils'

interface PortfolioCardProps {
  item: PortfolioItem
  showActions?: boolean
  onEdit?: (item: PortfolioItem) => void
  onDelete?: (itemId: string) => void
  className?: string
}

export function PortfolioCard({
  item,
  showActions = true,
  onEdit,
  onDelete,
  className
}: PortfolioCardProps) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className={cn("overflow-hidden transition-all duration-200", className)}>
      {/* Featured Image */}
      {item.featured_image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.featured_image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          {item.is_featured && (
            <Badge className="absolute top-2 right-2 bg-blue-600">
              Featured
            </Badge>
          )}
        </div>
      )}

      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {item.title}
        </h3>

        {/* Project Type & Duration */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
          {item.project_type && (
            <Badge variant="outline" className="font-normal">
              {item.project_type}
            </Badge>
          )}
          
          {(item.start_date || item.end_date) && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {formatDate(item.start_date)}
                {item.end_date && ` - ${formatDate(item.end_date)}`}
              </span>
            </div>
          )}
          
          {item.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{item.location}</span>
            </div>
          )}
          
          {item.project_value && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{formatCurrency(item.project_value)}</span>
            </div>
          )}
        </div>

        {/* Description - Truncated */}
        <p className={cn(
          "text-gray-700 text-sm leading-relaxed",
          !expanded && "line-clamp-3"
        )}>
          {item.description}
        </p>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 space-y-4">
            {/* Skills Used */}
            {item.skills_used && item.skills_used.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Used</h4>
                <div className="flex flex-wrap gap-2">
                  {item.skills_used.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges & Results */}
            {(item.challenges_overcome || item.results_achieved) && (
              <div className="space-y-3">
                {item.challenges_overcome && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Challenges Overcome</h4>
                    <p className="text-sm text-gray-700">{item.challenges_overcome}</p>
                  </div>
                )}
                
                {item.results_achieved && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Results Achieved</h4>
                    <p className="text-sm text-gray-700">{item.results_achieved}</p>
                  </div>
                )}
              </div>
            )}

            {/* Client Testimonial */}
            {item.client_testimonial && (
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-800 italic">"{item.client_testimonial}"</p>
                {item.client_name && (
                  <p className="text-xs text-blue-600 mt-2">— {item.client_name}</p>
                )}
              </div>
            )}

            {/* Additional Images */}
            {item.image_urls && item.image_urls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {item.image_urls.slice(0, 4).map((url, index) => (
                  <div key={index} className="h-24 rounded-md overflow-hidden">
                    <img
                      src={url}
                      alt={`${item.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-blue-600 hover:text-blue-800 p-0 h-auto"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <span className="flex items-center">
              Show less <ChevronUp className="ml-1 h-4 w-4" />
            </span>
          ) : (
            <span className="flex items-center">
              Show more <ChevronDown className="ml-1 h-4 w-4" />
            </span>
          )}
        </Button>
      </CardContent>

      {/* Card Footer with Actions */}
      {showActions && (
        <CardFooter className="px-5 py-3 bg-gray-50 flex justify-between">
          {item.project_type && (
            <Badge variant="outline" className="text-xs">
              {item.project_type}
            </Badge>
          )}
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700"
                onClick={() => onDelete(item.id)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}