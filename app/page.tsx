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

             {/* Company Logos Section */}
              <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-8">
                          <p className="text-sm md:text-base text-gray-600">Trusted by leading companies and professionals worldwide</p>
           </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 opacity-70">
            {/* Bolt.new logo */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <span className="text-base md:text-xl font-bold text-gray-600">bolt.new</span>
            </div>
            
            {/* Supabase logo */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z"/>
                </svg>
              </div>
              <span className="text-base md:text-xl font-bold text-gray-600">Supabase</span>
            </div>
            
            {/* Vercel logo */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-black rounded-xl flex items-center justify-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 19.777h20L12 2z"/>
                </svg>
              </div>
              <span className="text-base md:text-xl font-bold text-gray-600">Vercel</span>
            </div>
            
            {/* Next.js logo */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-black rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747C19.777 4.249 16.569.346 12.153.033a19.555 19.555 0 0 0-.364-.033C11.741.001 11.607 0 11.572 0z"/>
                </svg>
              </div>
              <span className="text-base md:text-xl font-bold text-gray-600">Next.js</span>
            </div>
            
            {/* Tailwind CSS logo */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2,1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
                </svg>
              </div>
              <span className="text-base md:text-xl font-bold text-gray-600">Tailwind CSS</span>
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
                                   <CardTitle className="text-lg md:text-xl text-gray-900">1. Search & Browse</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base text-gray-600">
                    Browse through our curated list of verified professionals or post your project requirements
                  </CardDescription>
               </CardContent>
             </Card>

             <Card className="text-center border-0 shadow-lg">
               <CardHeader>
                                   <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <UserCheck className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                                   <CardTitle className="text-lg md:text-xl text-gray-900">2. Connect & Hire</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base text-gray-600">
                    Review profiles, portfolios, and ratings. Connect with professionals that match your needs
                  </CardDescription>
               </CardContent>
             </Card>

             <Card className="text-center border-0 shadow-lg">
               <CardHeader>
                                   <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                                   <CardTitle className="text-lg md:text-xl text-gray-900">3. Get Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base text-gray-600">
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
                                                           <h3 className="text-lg font-semibold mb-2 text-gray-900">Verified Professionals</h3>
                <p className="text-gray-600">All professionals go through our comprehensive verification process</p>
            </div>

            <div className="text-center">
                             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                 <Star className="w-6 h-6 text-blue-600" />
               </div>
                                                           <h3 className="text-lg font-semibold mb-2 text-gray-900">Quality Ratings</h3>
                <p className="text-gray-600">Transparent review system to help you make informed decisions</p>
            </div>

            <div className="text-center">
                             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                 <Users className="w-6 h-6 text-blue-600" />
               </div>
                                                           <h3 className="text-lg font-semibold mb-2 text-gray-900">Team Formation</h3>
                <p className="text-gray-600">Build teams of professionals for larger, complex projects</p>
            </div>

            <div className="text-center">
                             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                 <TrendingUp className="w-6 h-6 text-blue-600" />
               </div>
                                                           <h3 className="text-lg font-semibold mb-2 text-gray-900">Growth Tracking</h3>
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
                    <div className="text-xs text-gray-600">{category.count}</div>
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
              <Button size="lg" variant="outline" className="text-base md:text-lg px-6 py-2 md:px-8 md:py-3 text-white border-2 border-white hover:bg-white hover:text-blue-600 hover:border-white font-semibold w-full">
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