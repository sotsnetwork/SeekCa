'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock,
  Plus,
  X,
  Zap,
  Wrench,
  Building,
  Users,
  Home,
  Truck,
  Award,
  CheckCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { jobQueries } from '@/lib/database'

export default function PostJob() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('full-time')
  const [salaryType, setSalaryType] = useState('hourly')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState([''])
  const [skills, setSkills] = useState([''])
  const [licenses, setLicenses] = useState([''])
  const [isUrgent, setIsUrgent] = useState(false)
  const [remoteAllowed, setRemoteAllowed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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

        // Get user profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
        } else {
          setProfile(profileData)
          if (profileData.role !== 'hirer') {
            router.push('/dashboard/professional')
          }
        }
      } catch (error) {
        console.error('Error:', error)
        router.push('/auth/login')
      }
    }

    getUser()
  }, [router])

  const categories = [
    { id: 'engineering', name: 'Engineering', icon: Zap },
    { id: 'construction', name: 'Construction & Trades', icon: Wrench },
    { id: 'real-estate', name: 'Real Estate', icon: Building },
    { id: 'project-management', name: 'Project Management', icon: Users },
    { id: 'design', name: 'Design & Architecture', icon: Home },
    { id: 'services', name: 'Personal Services', icon: Truck }
  ]

  const commonLicenses = [
    'PE License (Professional Engineer)',
    'Master Plumber License',
    'Electrical License',
    'HVAC License',
    'General Contractor License',
    'Architecture License',
    'Surveyor License',
    'Welding Certification',
    'Roofing License',
    'Masonry License',
    'Carpentry Certification',
    'Interior Design License',
    'Tiling Certification',
    'Painting Contractor License',
    'Real Estate License',
    'OSHA Certification',
    'NCIDQ Certification'
  ]

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate required fields
      if (!jobTitle || !description || !category || !jobType || !salaryType) {
        setError('Please fill in all required fields')
        setIsLoading(false)
        return
      }

      // Filter out empty values
      const filteredRequirements = requirements.filter(req => req.trim() !== '')
      const filteredSkills = skills.filter(skill => skill.trim() !== '')
      const filteredLicenses = licenses.filter(license => license.trim() !== '')

      const jobData = {
        hirer_id: user.id,
        title: jobTitle,
        description,
        category,
        job_type: jobType,
        location: location || null,
        remote_allowed: remoteAllowed,
        salary_type: salaryType,
        salary_min: salaryMin ? parseFloat(salaryMin) : null,
        salary_max: salaryMax ? parseFloat(salaryMax) : null,
        required_skills: filteredSkills,
        required_licenses: filteredLicenses,
        requirements: filteredRequirements,
        is_urgent: isUrgent,
        status: 'active' // Automatically publish the job
      }

      await jobQueries.createJob(jobData)
      setSuccess(true)
    } catch (error: any) {
      console.error('Error creating job:', error)
      setError(error.message || 'Failed to create job posting')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Job Posted Successfully!</CardTitle>
            <CardDescription>
              Your job posting is now live and visible to qualified professionals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Professionals will start applying within hours</li>
                  <li>• You'll receive email notifications for new applications</li>
                  <li>• Review profiles and portfolios in your dashboard</li>
                </ul>
              </div>
              <div className="flex space-x-3">
                <Button className="flex-1" onClick={() => window.location.href = '/dashboard/hirer'}>
                  View Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Post Another Job
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Job</h1>
          <p className="text-gray-600">
            Find qualified technical professionals and skilled tradespeople for your project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide the essential details about your job posting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Licensed Electrical Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Los Angeles, CA (leave blank for remote)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Job Type *</Label>
                  <RadioGroup value={jobType} onValueChange={setJobType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full-time" id="full-time" />
                      <Label htmlFor="full-time">Full-time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="part-time" id="part-time" />
                      <Label htmlFor="part-time">Part-time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="contract" id="contract" />
                      <Label htmlFor="contract">Contract</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="freelance" id="freelance" />
                      <Label htmlFor="freelance">Freelance</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-3">
                <Label>Professional Category *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map(cat => {
                    const IconComponent = cat.icon
                    return (
                      <div key={cat.id}>
                        <input
                          type="radio"
                          id={cat.id}
                          name="category"
                          value={cat.id}
                          checked={category === cat.id}
                          onChange={(e) => setCategory(e.target.value)}
                          className="sr-only peer"
                        />
                        <Label
                          htmlFor={cat.id}
                          className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50"
                        >
                          <IconComponent className="h-6 w-6 mb-2 text-gray-600 peer-checked:text-blue-600" />
                          <span className="text-sm font-medium text-center">{cat.name}</span>
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Remote Work Option */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remote"
                  checked={remoteAllowed}
                  onChange={(e) => setRemoteAllowed(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="remote">Remote work allowed</Label>
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                Compensation
              </CardTitle>
              <CardDescription>
                Set the salary or hourly rate for this position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Compensation Type *</Label>
                <RadioGroup value={salaryType} onValueChange={setSalaryType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hourly" id="hourly" />
                    <Label htmlFor="hourly">Hourly Rate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="salary" id="salary" />
                    <Label htmlFor="salary">Annual Salary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="project" id="project" />
                    <Label htmlFor="project">Project-based</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">
                    Minimum {salaryType === 'hourly' ? '($/hour)' : salaryType === 'salary' ? '($/year)' : '($)'}
                  </Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    placeholder={salaryType === 'hourly' ? '75' : salaryType === 'salary' ? '80000' : '5000'}
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">
                    Maximum {salaryType === 'hourly' ? '($/hour)' : salaryType === 'salary' ? '($/year)' : '($)'}
                  </Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    placeholder={salaryType === 'hourly' ? '120' : salaryType === 'salary' ? '120000' : '15000'}
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Provide a detailed description of the role and responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the job responsibilities, project scope, and what you're looking for in a candidate..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements & Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-purple-600" />
                Requirements & Qualifications
              </CardTitle>
              <CardDescription>
                Specify the required licenses, certifications, and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Required Licenses */}
              <div className="space-y-3">
                <Label>Required Licenses/Certifications</Label>
                <div className="space-y-2">
                  {licenses.map((license, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select
                        value={license}
                        onChange={(e) => updateField(setLicenses, licenses, index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a license/certification</option>
                        {commonLicenses.map(lic => (
                          <option key={lic} value={lic}>{lic}</option>
                        ))}
                        <option value="other">Other (specify in requirements)</option>
                      </select>
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
                    Add License/Certification
                  </Button>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <Label>Job Requirements</Label>
                <div className="space-y-2">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="e.g., 5+ years of experience in commercial electrical work"
                        value={req}
                        onChange={(e) => updateField(setRequirements, requirements, index, e.target.value)}
                      />
                      {requirements.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeField(setRequirements, requirements, index)}
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
                    onClick={() => addField(setRequirements, requirements)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label>Required Skills</Label>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="e.g., AutoCAD, Power Systems Design, NEC Code"
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
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="urgent" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-red-500" />
                  Mark as urgent hiring (appears at top of search results)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" disabled={isLoading}>
              Save as Draft
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? 'Publishing...' : 'Publish Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}