'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  UserCheck, 
  Shield, 
  Star,
  CheckCircle,
  Users,
  Briefcase,
  MessageSquare,
  FileText,
  CreditCard,
  Award,
  Clock,
  Building,
  Wrench
} from 'lucide-react'

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              How <span className="text-blue-600">SeekCa</span> Works
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with verified technical professionals and skilled tradespeople. 
              From engineers to contractors, find the expertise you need for your projects.
            </p>
          </div>
        </div>
      </section>

      {/* For Hirers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Companies & Project Owners
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find qualified professionals for your technical projects and construction needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">1. Post Your Project</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Describe your project requirements, timeline, and budget. Specify required licenses and certifications.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">2. Review Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Browse qualified professionals, check their licenses, certifications, and past project portfolios.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">3. Hire & Collaborate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Select your professional, manage contracts, track progress, and complete secure payments.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                <Building className="mr-2 h-5 w-5" />
                Start Hiring Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Professionals Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Technical Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Showcase your expertise and connect with clients who value professional skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">1. Create Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Upload your licenses, certifications, portfolio, and professional credentials for verification.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">2. Find Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Browse projects that match your expertise, apply to opportunities, and showcase your qualifications.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">3. Get Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Complete projects, receive secure payments, and build your reputation with client reviews.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                <Wrench className="mr-2 h-5 w-5" />
                Join as Professional
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We connect you with licensed and certified professionals across various industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Electrical Engineers', icon: '⚡', count: '500+' },
              { name: 'Mechanical Engineers', icon: '⚙️', count: '400+' },
              { name: 'Civil Engineers', icon: '🏗️', count: '350+' },
              { name: 'Structural Engineers', icon: '🏢', count: '150+' },
              { name: 'Project Managers', icon: '📋', count: '600+' },
              { name: 'Real Estate Developers', icon: '🏢', count: '200+' },
              { name: 'Licensed Plumbers', icon: '🔧', count: '300+' },
              { name: 'Master Electricians', icon: '⚡', count: '280+' },
              { name: 'HVAC Technicians', icon: '🌡️', count: '220+' },
              { name: 'Welders & Fabricators', icon: '🔥', count: '190+' },
              { name: 'Carpenters', icon: '🪚', count: '320+' },
              { name: 'Masons', icon: '🧱', count: '180+' },
              { name: 'Roofers', icon: '🏠', count: '160+' },
              { name: 'Painters', icon: '🎨', count: '250+' },
              { name: 'Tilers', icon: '⬜', count: '140+' },
              { name: 'Interior Designers', icon: '🎨', count: '250+' },
              { name: 'Architects', icon: '📐', count: '180+' },
              { name: 'Surveyors', icon: '📏', count: '120+' },
              { name: 'Construction Supervisors', icon: '👷', count: '350+' },
              { name: 'Property Managers', icon: '🏠', count: '280+' },
              { name: 'Landscape Architects', icon: '🌳', count: '110+' }
            ].map((category, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{category.name}</div>
                  <div className="text-xs text-gray-500">{category.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SeekCa?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade platform built for technical expertise and skilled trades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">License Verification</h3>
              <p className="text-gray-600">All professionals undergo thorough license and certification verification</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Standards</h3>
              <p className="text-gray-600">Maintain industry standards with certified professionals and quality assurance</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Project Communication</h3>
              <p className="text-gray-600">Built-in messaging and project management tools for seamless collaboration</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Escrow-protected payments with milestone-based releases for project security</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support for urgent project needs and emergencies</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Ratings</h3>
              <p className="text-gray-600">Transparent review system based on project completion and professional standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the platform that connects technical professionals with quality projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                <Wrench className="mr-2 h-5 w-5" />
                Join as Professional
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                <Building className="mr-2 h-5 w-5" />
                Post a Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}