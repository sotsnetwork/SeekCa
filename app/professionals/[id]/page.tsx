'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase,
  Award,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  Globe,
  Linkedin,
  CheckCircle,
  Calendar,
  ThumbsUp
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { professionalQueries } from '@/lib/database'
import { reviewService, ReviewWithDetails, ReviewStatistics } from '@/lib/reviews'
import { ReviewCard } from '@/components/ui/review-card'
import { ReviewSummary } from '@/components/ui/review-summary'
import Link from 'next/link'

export default function ProfessionalProfile() {
  const { id } = useParams()
  const router = useRouter()
  const [professional, setProfessional] = useState<any>(null)
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        setLoading(true)
        
        // Get professional profile
        const profData = await professionalQueries.getProfessionalProfile(id as string)
        setProfessional(profData)
        
        // Get reviews
        const reviewsData = await reviewService.getProfessionalReviews(id as string, 3)
        setReviews(reviewsData)
        
        // Get review statistics
        const stats = await reviewService.getReviewStatistics(id as string)
        setReviewStats(stats)
      } catch (error) {
        console.error('Error fetching professional:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchProfessional()
    }
  }, [id])
  
  const handleVoteHelpful = async (reviewId: string, isHelpful: boolean) => {
    if (!user) return
    
    try {
      await reviewService.voteHelpful(reviewId, user.id, isHelpful)
      
      // Update the UI optimistically
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpful_count: review.helpful_count + (isHelpful ? 1 : 0) }
            : review
        )
      )
    } catch (error) {
      console.error('Error voting on review:', error)
    }
  }
  
  const getFullName = () => {
    if (!professional?.profiles) return 'Professional'
    return `${professional.profiles.first_name || ''} ${professional.profiles.last_name || ''}`.trim()
  }
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
          <CardContent className="relative pt-0">
            <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-6">
              <Avatar className="h-32 w-32 border-4 border-white bg-white">
                <AvatarImage src={professional.profiles?.avatar_url} alt={getFullName()} />
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-700">
                  {getInitials(getFullName())}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 md:mt-0 md:ml-6 md:pb-4">
                <div className="flex items-center flex-wrap">
                  <h1 className="text-3xl font-bold text-gray-900 mr-3">{getFullName()}</h1>
                  {professional.profiles?.is_verified && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge 
                    variant={professional.availability_status === 'available' ? 'default' : 'secondary'}
                    className={`ml-2 ${professional.availability_status === 'available' ? 'bg-green-100 text-green-800' : ''}`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {professional.availability_status === 'available' ? 'Available' : 
                     professional.availability_status === 'busy' ? 'Busy' : 'Unavailable'}
                  </Badge>
                </div>
                <div className="flex items-center mt-1">
                  <Briefcase className="w-4 h-4 text-gray-500 mr-1" />
                  <p className="text-lg text-gray-700">{professional.title || 'Professional'}</p>
                </div>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                  <p className="text-gray-600">{professional.profiles?.location || 'Location not specified'}</p>
                </div>
              </div>
              <div className="flex-1"></div>
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-semibold">{professional.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <span className="text-gray-600">({professional.total_reviews || 0} reviews)</span>
                </div>
                <div className="flex space-x-3">
                  {user && user.id !== id && (
                    <Button>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  )}
                  {user && user.id === id && (
                    <Link href="/profile/edit">
                      <Button variant="outline">
                        Edit Profile
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="col-span-2">
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {professional.profiles?.bio || 'No bio provided.'}
                </p>
              </div>
              <div>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Professional Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hourly Rate:</span>
                        <span className="font-medium">${professional.hourly_rate || 0}/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{professional.experience_years || 0} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-medium">~{professional.response_time_hours || 24} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed Projects:</span>
                        <span className="font-medium">{professional.completed_projects || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="font-medium">
                          {professional.profiles?.created_at 
                            ? new Date(professional.profiles.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short' 
                              }) 
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Reviews ({professional.total_reviews || 0})
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* Skills Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-blue-600" />
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {professional.skills?.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {(!professional.skills || professional.skills.length === 0) && (
                        <p className="text-gray-500">No skills listed</p>
                      )}
                    </div>
                    
                    <h3 className="font-semibold mb-3">Licenses & Certifications</h3>
                    <div className="space-y-2">
                      {professional.licenses?.map((license: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span>{license}</span>
                        </div>
                      ))}
                      {professional.certifications?.map((cert: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <Award className="w-4 h-4 text-blue-600 mr-2" />
                          <span>{cert}</span>
                        </div>
                      ))}
                      {(!professional.licenses || professional.licenses.length === 0) && 
                       (!professional.certifications || professional.certifications.length === 0) && (
                        <p className="text-gray-500">No licenses or certifications listed</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Reviews Preview */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Star className="mr-2 h-5 w-5 text-yellow-500" />
                        Client Reviews
                      </CardTitle>
                      <CardDescription>
                        What clients are saying
                      </CardDescription>
                    </div>
                    <Link href={`/professionals/${id}/reviews`}>
                      <Button variant="outline" size="sm">
                        View All Reviews
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.slice(0, 3).map(review => (
                          <ReviewCard 
                            key={review.id} 
                            review={review} 
                            onVoteHelpful={handleVoteHelpful}
                            canVote={!!user}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Reviews Yet</h3>
                        <p className="text-gray-600">This professional hasn't received any reviews yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-8">
                {/* Review Summary */}
                {reviewStats && (
                  <ReviewSummary statistics={reviewStats} />
                )}
                
                {/* Contact Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="mr-2 h-5 w-5 text-green-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {professional.profiles?.phone && (
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-500 mr-3" />
                        <span>{professional.profiles.phone}</span>
                      </div>
                    )}
                    {professional.profiles?.email && (
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-500 mr-3" />
                        <span>{professional.profiles.email}</span>
                      </div>
                    )}
                    {professional.profiles?.website && (
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 text-gray-500 mr-3" />
                        <a 
                          href={professional.profiles.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {professional.profiles.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    {professional.profiles?.linkedin_url && (
                      <div className="flex items-center">
                        <Linkedin className="w-5 h-5 text-gray-500 mr-3" />
                        <a 
                          href={professional.profiles.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    
                    {user && user.id !== id && (
                      <Button className="w-full mt-2">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    )}
                  </CardContent>
                </Card>
                
                {/* Availability Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                      Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Current Status:</span>
                        <Badge 
                          variant={professional.availability_status === 'available' ? 'default' : 'secondary'}
                          className={professional.availability_status === 'available' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {professional.availability_status === 'available' ? 'Available' : 
                           professional.availability_status === 'busy' ? 'Busy' : 'Unavailable'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-medium">Within {professional.response_time_hours || 24} hours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Typical Engagement:</span>
                        <span className="font-medium">
                          {professional.hourly_rate ? `$${professional.hourly_rate}/hour` : 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <ReviewCard 
                        key={review.id} 
                        review={review} 
                        onVoteHelpful={handleVoteHelpful}
                        canVote={!!user}
                      />
                    ))}
                    
                    <div className="text-center">
                      <Link href={`/professionals/${id}/reviews`}>
                        <Button variant="outline">
                          View All Reviews
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                      <p className="text-gray-600 mb-4">
                        This professional hasn't received any reviews yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div>
                {reviewStats && (
                  <ReviewSummary statistics={reviewStats} />
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Portfolio Coming Soon</h3>
                <p className="text-gray-600 mb-4">
                  This professional's portfolio is being updated.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Contact Tab */}
          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {professional.profiles?.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-500 mr-3" />
                      <span>{professional.profiles.phone}</span>
                    </div>
                  )}
                  {professional.profiles?.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-500 mr-3" />
                      <span>{professional.profiles.email}</span>
                    </div>
                  )}
                  {professional.profiles?.website && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-gray-500 mr-3" />
                      <a 
                        href={professional.profiles.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {professional.profiles.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {professional.profiles?.linkedin_url && (
                    <div className="flex items-center">
                      <Linkedin className="w-5 h-5 text-gray-500 mr-3" />
                      <a 
                        href={professional.profiles.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  
                  {user && user.id !== id && (
                    <Button className="w-full mt-4">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        {professional.profiles?.location || 'Location not specified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}