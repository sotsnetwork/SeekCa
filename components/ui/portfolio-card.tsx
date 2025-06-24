import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Briefcase,
  ExternalLink
} from 'lucide-react'
import { PortfolioItem } from '@/lib/reviews'

interface PortfolioCardProps {
  item: PortfolioItem
  onViewDetails: () => void
}

export function PortfolioCard({ item, onViewDetails }: PortfolioCardProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      {item.featured_image_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={item.featured_image_url} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
        
        <div className="flex flex-wrap items-center text-xs text-gray-600 mb-3">
          {item.project_type && (
            <div className="flex items-center mr-3 mb-1">
              <Briefcase className="w-3 h-3 mr-1" />
              {item.project_type}
            </div>
          )}
          {(item.start_date || item.end_date) && (
            <div className="flex items-center mr-3 mb-1">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(item.start_date)} {item.end_date && `- ${formatDate(item.end_date)}`}
            </div>
          )}
          {item.location && (
            <div className="flex items-center mb-1">
              <MapPin className="w-3 h-3 mr-1" />
              {item.location}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">{item.description}</p>
        
        {item.skills_used && item.skills_used.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {item.skills_used.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {item.skills_used.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{item.skills_used.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          {item.project_value ? (
            <div className="text-sm font-medium text-green-600">
              ${item.project_value.toLocaleString()}
            </div>
          ) : (
            <div></div>
          )}
          <Button size="sm" variant="outline" onClick={onViewDetails}>
            <ExternalLink className="w-3 h-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}