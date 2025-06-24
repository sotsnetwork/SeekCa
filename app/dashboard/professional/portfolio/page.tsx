'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Plus, 
  Image as ImageIcon, 
  Upload, 
  Edit, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { portfolioService, PortfolioItem } from '@/lib/reviews'
import { PortfolioCard } from '@/components/ui/portfolio-card'
import Link from 'next/link'

export default function ProfessionalPortfolioPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState('')
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)
        
        // Get portfolio items
        const portfolioData = await portfolioService.getProfessionalPortfolio(user.id)
        setPortfolioItems(portfolioData)
        
        // Get portfolio stats
        const statsData = await portfolioService.getPortfolioStats(user.id)
        setStats(statsData)
      } catch (error) {
        console.error('Error:', error)
        setError('Failed to load portfolio data')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])
  
  const filteredItems = portfolioItems.filter(item => {
    if (activeTab === 'all') return true
    if (activeTab === 'featured') return item.is_featured
    if (activeTab === 'public') return item.is_public
    if (activeTab === 'private') return !item.is_public
    return true
  })
  
  const handleViewDetails = (itemId: string) => {
    router.push(`/dashboard/professional/portfolio/${itemId}`)
  }
  
  const handleAddNew = () => {
    router.push('/dashboard/professional/portfolio/new')
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">My Portfolio</h1>
            <p className="text-sm md:text-base text-gray-600">
              Showcase your work and attract more clients
            </p>
          </div>
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Add Portfolio Item
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">{stats?.total_items || 0}</div>
              <div className="text-xs md:text-sm text-gray-600">Total Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">{stats?.featured_items || 0}</div>
              <div className="text-xs md:text-sm text-gray-600">Featured Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">{stats?.project_types?.length || 0}</div>
              <div className="text-xs md:text-sm text-gray-600">Project Types</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">${stats?.total_value?.toLocaleString() || 0}</div>
              <div className="text-xs md:text-sm text-gray-600">Total Value</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 md:mb-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="all" className="flex items-center">
              <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="text-xs md:text-sm">All ({portfolioItems.length})</span>
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center">
              <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="text-xs md:text-sm">Featured ({portfolioItems.filter(i => i.is_featured).length})</span>
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center col-span-2 md:col-span-1">
              <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="text-xs md:text-sm">Public ({portfolioItems.filter(i => i.is_public).length})</span>
            </TabsTrigger>
            <TabsTrigger value="private" className="hidden md:flex items-center">
              <EyeOff className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="text-xs md:text-sm">Private ({portfolioItems.filter(i => !i.is_public).length})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Portfolio Items */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
              <FileText className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 md:mb-2">No Portfolio Items</h3>
              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                {activeTab === 'all' 
                  ? "You haven't added any portfolio items yet."
                  : activeTab === 'featured'
                  ? "You don't have any featured portfolio items."
                  : activeTab === 'public'
                  ? "You don't have any public portfolio items."
                  : "You don't have any private portfolio items."
                }
              </p>
              <Button onClick={handleAddNew} size="sm" className="text-sm">
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Add Your First Portfolio Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative group">
                <PortfolioCard 
                  item={item} 
                  onViewDetails={() => handleViewDetails(item.id)} 
                />
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-white" asChild>
                    <Link href={`/dashboard/professional/portfolio/${item.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {!item.is_public && (
                  <Badge variant="secondary" className="absolute top-2 left-2 bg-gray-800 text-white">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Private
                  </Badge>
                )}
                {item.is_featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Portfolio Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Portfolio Tips</CardTitle>
            <CardDescription>
              Maximize the impact of your portfolio with these tips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Quality Over Quantity</h3>
                <p className="text-sm text-gray-600">
                  Showcase your best 5-10 projects rather than everything you've done. Focus on quality and relevance.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Tell a Story</h3>
                <p className="text-sm text-gray-600">
                  Explain the challenges you faced and how you overcame them. Clients want to understand your problem-solving process.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Use High-Quality Images</h3>
                <p className="text-sm text-gray-600">
                  Clear, professional photos of your work make a huge difference. Include before/after shots when possible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}