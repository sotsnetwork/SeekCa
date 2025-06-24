'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  Briefcase, 
  Award, 
  FileText, 
  Camera, 
  Plus, 
  X,
  Save,
  Upload,
  Globe,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Clock
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { professionalQueries } from '@/lib/database'

export default function EditProfile() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSection = searchParams.get('section') || 'basic'
  
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [professionalProfile, setProfessionalProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Form states
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  
  // Professional fields
  const [title, setTitle] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [skills, setSkills] = useState<string[]>([''])
  const [licenses, setLicenses] = useState<string[]>([''])
  const [certifications, setCertifications] = useState<string[]>([''])
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [availabilityStatus, setAvailabilityStatus] = useState('available')
  const [responseTimeHours, setResponseTimeHours] = useState('24')

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)

        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
          populateBasicFields(profileData)

          // If professional, get professional profile
          if (profileData.role === 'professional') {
            const { data: profData } = await supabase
              .from('professional_profiles')
              .select('*')
              .eq('user_id', user.id)
              .single()

            if (profData) {
              setProfessionalProfile(profData)
              populateProfessionalFields(profData)
            }
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  const populateBasicFields = (profileData: any) => {
    setFirstName(profileData.first_name || '')
    setLastName(profileData.last_name || '')
    setCompanyName(profileData.company_name || '')
    setEmail(profileData.email || '')
    setPhone(profileData.phone || '')
    setLocation(profileData.location || '')
    setBio(profileData.bio || '')
    setWebsite(profileData.website || '')
    setLinkedinUrl(profileData.linkedin_url || '')
  }

  const populateProfessionalFields = (profData: any) => {
    setTitle(profData.title || '')
    setHourlyRate(profData.hourly_rate?.toString() || '')
    setExperienceYears(profData.experience_years?.toString() || '')
    setSkills(profData.skills?.length > 0 ? profData.skills : [''])
    setLicenses(profData.licenses?.length > 0 ? profData.licenses : [''])
    setCertifications(profData.certifications?.length > 0 ? profData.certifications : [''])
    setPortfolioUrl(profData.portfolio_url || '')
    setAvailabilityStatus(profData.availability_status || 'available')
    setResponseTimeHours(profData.response_time_hours?.toString() || '24')
  }

  const addField = (setter: any, fields: string[]) => {
    setter([...fields, ''])
  }

  const removeField = (setter: any, fields: string[], index: number) => {
    setter(fields.filter((_, i) => i !== index))
  }

  const updateField = (setter: any, fields: string[], index: number, value: string) => {
    const updated = [...fields]
    updated[index] = value
    setter(updated)
  }

  const saveBasicInfo = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updates: any = {
        phone,
        location,
        bio,
        website,
        linkedin_url: linkedinUrl
      }

      if (profile.role === 'professional') {
        updates.first_name = firstName
        updates.last_name = lastName
      } else {
        updates.company_name = companyName
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      setSuccess('Basic information updated successfully!')
      
      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (updatedProfile) {
        setProfile(updatedProfile)
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const saveProfessionalInfo = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const filteredSkills = skills.filter(skill => skill.trim() !== '')
      const filteredLicenses = licenses.filter(license => license.trim() !== '')
      const filteredCertifications = certifications.filter(cert => cert.trim() !== '')

      const professionalData = {
        user_id: user.id,
        title,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        experience_years: experienceYears ? parseInt(experienceYears) : 0,
        skills: filteredSkills,
        licenses: filteredLicenses,
        certifications: filteredCertifications,
        portfolio_url: portfolioUrl,
        availability_status: availabilityStatus,
        response_time_hours: parseInt(responseTimeHours)
      }

      if (professionalProfile) {
        // Update existing
        await professionalQueries.updateProfessionalProfile(user.id, professionalData)
      } else {
        // Create new
        await professionalQueries.createProfessionalProfile(professionalData)
      }

      setSuccess('Professional information updated successfully!')
      
      // Refresh professional profile data
      const updatedProfData = await professionalQueries.getProfessionalProfile(user.id)
      setProfessionalProfile(updatedProfData)
    } catch (error: any) {
      setError(error.message || 'Failed to update professional profile')
    } finally {
      setSaving(false)
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">
            Keep your profile up to date to {profile?.role === 'professional' ? 'attract better opportunities' : 'find the best talent'}
          </p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="basic" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Basic
            </TabsTrigger>
            {profile?.role === 'professional' && (
              <>
                <TabsTrigger value="professional" className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Professional
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Portfolio
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="photo" className="flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Photo
            </TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-600" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Your basic contact and location information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile?.role === 'professional' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Corporation"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={profile?.role === 'professional' 
                      ? "Tell potential clients about yourself, your experience, and what makes you unique..."
                      : "Describe your company, mission, and what you're looking for in professionals..."
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveBasicInfo} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                    <Save className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information */}
          {profile?.role === 'professional' && (
            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                    Professional Details
                  </CardTitle>
                  <CardDescription>
                    Your professional title, rates, and availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Licensed Electrical Engineer, Senior Project Manager"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          placeholder="75"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experienceYears">Years of Experience</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="availabilityStatus">Availability Status</Label>
                      <select
                        id="availabilityStatus"
                        value={availabilityStatus}
                        onChange={(e) => setAvailabilityStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responseTimeHours">Response Time (hours)</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="responseTimeHours"
                          type="number"
                          value={responseTimeHours}
                          onChange={(e) => setResponseTimeHours(e.target.value)}
                          placeholder="24"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={saveProfessionalInfo} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                      <Save className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Skills & Licenses */}
          {profile?.role === 'professional' && (
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-blue-600" />
                    Skills & Licenses
                  </CardTitle>
                  <CardDescription>
                    List your professional skills, licenses, and certifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Skills */}
                  <div className="space-y-3">
                    <Label>Professional Skills</Label>
                    <div className="space-y-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder="e.g., Electrical Wiring, HVAC Installation, Plumbing Systems"
                            value={skill}
                            onChange={(e) => updateField(setSkills, skills, index, e.target.value)}
                          />
                          {skills.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeField(setSkills, skills, index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addField(setSkills, skills)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </div>
                  </div>

                  {/* Licenses */}
                  <div className="space-y-3">
                    <Label>Professional Licenses</Label>
                    <div className="space-y-2">
                      {licenses.map((license, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder="e.g., PE License, Master Plumber License, Electrical License"
                            value={license}
                            onChange={(e) => updateField(setLicenses, licenses, index, e.target.value)}
                          />
                          {licenses.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeField(setLicenses, licenses, index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addField(setLicenses, licenses)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add License
                      </Button>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-3">
                    <Label>Certifications</Label>
                    <div className="space-y-2">
                      {certifications.map((cert, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder="e.g., OSHA Certification, Welding Certification, HVAC Certification"
                            value={cert}
                            onChange={(e) => updateField(setCertifications, certifications, index, e.target.value)}
                          />
                          {certifications.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeField(setCertifications, certifications, index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addField(setCertifications, certifications)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={saveProfessionalInfo} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                      <Save className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Portfolio */}
          {profile?.role === 'professional' && (
            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Portfolio & Work Samples
                  </CardTitle>
                  <CardDescription>
                    Showcase your best work and projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio Website</Label>
                    <Input
                      id="portfolioUrl"
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://yourportfolio.com"
                    />
                    <p className="text-sm text-gray-500">
                      Link to your portfolio website, Behance, or other work showcase
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Portfolio Tips</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Include 3-5 of your best projects</li>
                      <li>• Show before/after photos when applicable</li>
                      <li>• Describe your role and the challenges solved</li>
                      <li>• Include client testimonials if available</li>
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={saveProfessionalInfo} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                      <Save className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Photo Upload */}
          <TabsContent value="photo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5 text-blue-600" />
                  {profile?.role === 'professional' ? 'Profile Photo' : 'Company Logo'}
                </CardTitle>
                <CardDescription>
                  {profile?.role === 'professional' 
                    ? 'Upload a professional headshot to build trust with clients'
                    : 'Upload your company logo to build brand recognition'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload {profile?.role === 'professional' ? 'Photo' : 'Logo'}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, PNG or GIF. Max size 5MB. Recommended: 400x400px
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900 mb-2">Photo Guidelines</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {profile?.role === 'professional' ? (
                      <>
                        <li>• Use a clear, professional headshot</li>
                        <li>• Face should be clearly visible</li>
                        <li>• Professional attire recommended</li>
                        <li>• Good lighting and neutral background</li>
                      </>
                    ) : (
                      <>
                        <li>• Use your official company logo</li>
                        <li>• High resolution and clear quality</li>
                        <li>• Transparent background preferred</li>
                        <li>• Consistent with your brand identity</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button asChild>
            <a href="/onboarding">
              View Progress
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}