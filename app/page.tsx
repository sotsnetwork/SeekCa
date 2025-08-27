import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  UserCheck, 
  Shield, 
  Star,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle
} from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Find Top <span className="text-blue-600">Professionals</span><br />
              For Your Projects
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto">
              Connect with verified professionals across various industries. 
              From consultants to creatives, find the perfect talent for your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-base md:text-lg px-6 py-2 md:px-8 md:py-3 w-full sm:w-auto">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" size="lg" className="text-base md:text-lg px-6 py-2 md:px-8 md:py-3 w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Browse Professionals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              How SeekCa Works
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to connect with the right professionals for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Search className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">1. Search & Browse</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  Browse through our curated list of verified professionals or post your project requirements
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <UserCheck className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">2. Connect & Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  Review profiles, portfolios, and ratings. Connect with professionals that match your needs
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">3. Get Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  Work with your chosen professional, track progress, and leave reviews upon completion
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SeekCa?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the tools and security you need for successful professional partnerships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Professionals</h3>
              <p className="text-gray-600">All professionals go through our comprehensive verification process</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Ratings</h3>
              <p className="text-gray-600">Transparent review system to help you make informed decisions</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Formation</h3>
              <p className="text-gray-600">Build teams of professionals for larger, complex projects</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Growth Tracking</h3>
              <p className="text-gray-600">Monitor your project progress and professional development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find professionals across various industries and specializations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Consulting', count: '2.5k+' },
              { name: 'Design', count: '1.8k+' },
              { name: 'Development', count: '3.2k+' },
              { name: 'Marketing', count: '1.5k+' },
              { name: 'Writing', count: '900+' },
              { name: 'Legal', count: '600+' },
              { name: 'Finance', count: '800+' },
              { name: 'Healthcare', count: '500+' },
              { name: 'Education', count: '700+' },
              { name: 'Engineering', count: '1.1k+' },
              { name: 'Sales', count: '950+' },
              { name: 'Others', count: '2k+' }
            ].map((category, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">{category.name}</div>
                  <div className="text-xs text-gray-500">{category.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and hirers who trust SeekCa for their project needs
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="text-base md:text-lg px-6 py-2 md:px-8 md:py-3 w-full">
                <Briefcase className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Join as Professional
              </Button>
            </Link>
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="text-base md:text-lg px-6 py-2 md:px-8 md:py-3 text-white border-white hover:bg-white hover:text-blue-600 w-full">
                <Users className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Hire Professionals
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}