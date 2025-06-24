'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  MapPin, 
  DollarSign, 
  FileText, 
  Link as LinkIcon,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { professionalQueries } from '@/lib/database'
import { portfolioService, PortfolioItem } from '@/lib/reviews'
import Link from 'next/link'

export default function ProfessionalPortfolioPage() {
  const { id } = useParams()
  const router = useRouter()
  const [professional, setProfessional] = useState<any>(null)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Get professional profile
        const profData = await professionalQueries.getProfessionalProfile(id as string)
        setProfessional(profData)
        
        // Get portfolio items
        const portfolioData = await portfolioService.getProfessionalPortfolio(id as string)
        setPortfolioItems(portfolioData)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchData()
    }
  }, [id])
  
  const getFullName = () => {
    if (!professional?.profiles) return 'Professional'
    return `${professional.profiles.first_name || ''} ${professional.profiles.last_name || ''}`.trim()
  }
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }
  
  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Not Found</h3>
            <p className="text-gray-600 mb-4">The professional you're looking for doesn't exist or has been removed.</p>
            <Link href="/browse">
              <Button>Browse Professionals</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/professionals/${id}`}>
            <Button variant="ghost" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>
        
        {/* Professional Header */}
        <div className="flex items-center mb-8">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src={professional.profiles?.avatar_url} alt={getFullName()} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-medium">
              {getInitials(getFullName())}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getFullName()}</h1>
            <p className="text-gray-600">{professional.title || 'Professional'}</p>
          </div>
        </div>
        
        {/* Portfolio Header */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
              Portfolio
            </CardTitle>
            <CardDescription>
              Showcasing past projects and work samples
            </CardDescription>
          </CardHeader>
        </Card>
        
        {/* Portfolio Items */}
        {portfolioItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Portfolio Items Yet</h3>
              <p className="text-gray-600 mb-4">
                This professional hasn't added any portfolio items yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.featured_image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.featured_image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  
                  <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                    {item.project_type && (
                      <div className="flex items-center mr-4 mb-2">
                        <Briefcase className="w-4 h-4 mr-1" />
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
                  
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  
                  {item.skills_used && item.skills_used.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.skills_used.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.client_testimonial && (
                    <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 text-sm italic">"{item.client_testimonial}"</p>
                      {item.client_name && (
                        <p className="text-gray-600 text-xs mt-2">— {item.client_name}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-4">
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
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}