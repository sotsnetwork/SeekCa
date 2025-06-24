import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  FileText, 
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react'
import { PortfolioItem } from '@/lib/reviews'

interface PortfolioCardProps {
  item: PortfolioItem
  onViewDetails: (itemId: string) => void
}

export function PortfolioCard({ item, onViewDetails }: PortfolioCardProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {item.featured_image_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={item.featured_image_url} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
        
        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
          {item.project_type && (
            <div className="flex items-center mr-4 mb-2">
              <FileText className="w-4 h-4 mr-1" />
              {item.project_type}
            </div>
          )}
          {(item.start_date || item.end_date) && (
            <div className="flex items-center mr-4 mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(item.start_date)} - {formatDate(item.end_date)}
            </div>
          )}
          {item.location && (
            <div className="flex items-center mr-4 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {item.location}
            </div>
          )}
          {item.project_value && (
            <div className="flex items-center mb-2">
              <DollarSign className="w-4 h-4 mr-1" />
              ${item.project_value.toLocaleString()}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 mb-4 flex-1">{item.description}</p>
        
        {item.skills_used && item.skills_used.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Used</h4>
            <div className="flex flex-wrap gap-2">
              {item.skills_used.slice(0, 5).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {skill}
                </span>
              ))}
              {item.skills_used.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  +{item.skills_used.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {item.image_urls && item.image_urls.length > 0 && (
            <Button variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              {item.image_urls.length} Images
            </Button>
          )}
          {item.document_urls && item.document_urls.length > 0 && (
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              {item.document_urls.length} Documents
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(item.id)}
            className="ml-auto"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}