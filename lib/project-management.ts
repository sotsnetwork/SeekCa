'use client'

import { supabase } from './supabase'

export interface Project {
  id: string
  job_id: string
  application_id: string
  hirer_id: string
  professional_id: string
  title: string
  description?: string
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
  start_date?: string
  end_date?: string
  estimated_hours?: number
  total_budget?: number
  hourly_rate?: number
  payment_schedule?: string
  completion_percentage: number
  total_hours_logged: number
  created_at: string
  updated_at: string
  hirer?: {
    id: string
    first_name?: string
    last_name?: string
    company_name?: string
    avatar_url?: string
  }
  professional?: {
    id: string
    first_name?: string
    last_name?: string
    avatar_url?: string
  }
  job?: {
    title: string
    description: string
  }
  milestones?: ProjectMilestone[]
}

export interface ProjectMilestone {
  id: string
  project_id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  due_date?: string
  completed_date?: string
  completion_percentage: number
  payment_amount?: number
  is_paid: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface TimeEntry {
  id: string
  project_id: string
  professional_id: string
  milestone_id?: string
  entry_type: 'work' | 'meeting' | 'research' | 'planning' | 'review' | 'other'
  description: string
  start_time: string
  end_time?: string
  duration_minutes?: number
  hourly_rate?: number
  is_billable: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
  project?: {
    title: string
  }
  milestone?: {
    title: string
  }
}

export interface ProjectUpdate {
  id: string
  project_id: string
  author_id: string
  milestone_id?: string
  update_type: 'status' | 'milestone' | 'issue' | 'general' | 'system'
  title?: string
  content: string
  is_public: boolean
  is_important: boolean
  created_at: string
  updated_at: string
  author?: {
    id: string
    first_name?: string
    last_name?: string
    company_name?: string
    avatar_url?: string
  }
  milestone?: {
    title: string
  }
}

export interface ProjectFile {
  id: string
  project_id: string
  uploader_id: string
  milestone_id?: string
  file_name: string
  file_size: number
  file_type: string
  file_url: string
  storage_path: string
  category?: string
  description?: string
  is_public: boolean
  download_count: number
  created_at: string
  updated_at: string
  uploader?: {
    id: string
    first_name?: string
    last_name?: string
    company_name?: string
  }
  milestone?: {
    title: string
  }
}

interface MilestonePayment {
  id: string
  project_id: string
  milestone_id: string
  amount: number
  currency: string
  is_requested: boolean
  requested_at?: string
  is_approved: boolean
  approved_at?: string
  is_paid: boolean
  paid_at?: string
  payment_method?: string
  payment_reference?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface ProjectDashboard {
  project_id: string
  project_title: string
  project_status: string
  completion_percentage: number
  total_hours_logged: number
  overdue_milestones: number
  pending_payments: number
  other_party_name: string
  other_party_avatar?: string
  last_update: string
}

export const projectService = {
  // Project CRUD operations
  async createProject(projectData: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProject(projectId: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        job:jobs(title, description),
        hirer:profiles!projects_hirer_id_fkey(first_name, last_name, company_name, avatar_url),
        professional:profiles!projects_professional_id_fkey(first_name, last_name, avatar_url)
      `)
      .eq('id', projectId)
      .single()

    if (error) throw error
    return data
  },

  async getUserProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        job:jobs(title),
        hirer:profiles!projects_hirer_id_fkey(first_name, last_name, company_name, avatar_url),
        professional:profiles!projects_professional_id_fkey(first_name, last_name, avatar_url)
      `)
      .or(`hirer_id.eq.${userId},professional_id.eq.${userId}`)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getProjectDashboard(userId: string): Promise<ProjectDashboard[]> {
    const { data, error } = await supabase.rpc('get_project_dashboard', {
      p_user_id: userId
    })

    if (error) throw error
    return data || []
  },

  // Milestone operations
  async createMilestone(milestoneData: Partial<ProjectMilestone>): Promise<ProjectMilestone> {
    const { data, error } = await supabase
      .from('project_milestones')
      .insert(milestoneData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateMilestone(milestoneId: string, updates: Partial<ProjectMilestone>): Promise<ProjectMilestone> {
    const { data, error } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', milestoneId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProjectMilestones(projectId: string): Promise<ProjectMilestone[]> {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  },

  async deleteMilestone(milestoneId: string): Promise<void> {
    const { error } = await supabase
      .from('project_milestones')
      .delete()
      .eq('id', milestoneId)

    if (error) throw error
  },

  // Time tracking operations
  async createTimeEntry(timeData: Partial<TimeEntry>): Promise<TimeEntry> {
    const { data, error } = await supabase
      .from('time_entries')
      .insert(timeData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTimeEntry(entryId: string, updates: Partial<TimeEntry>): Promise<TimeEntry> {
    const { data, error } = await supabase
      .from('time_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProjectTimeEntries(projectId: string, limit = 50): Promise<TimeEntry[]> {
    const { data, error } = await supabase
      .from('time_entries')
      .select(`
        *,
        milestone:project_milestones(title)
      `)
      .eq('project_id', projectId)
      .order('start_time', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  async getProfessionalTimeEntries(professionalId: string, projectId?: string): Promise<TimeEntry[]> {
    let query = supabase
      .from('time_entries')
      .select(`
        *,
        project:projects(title),
        milestone:project_milestones(title)
      `)
      .eq('professional_id', professionalId)

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query
      .order('start_time', { ascending: false })
      .limit(100)

    if (error) throw error
    return data || []
  },

  async deleteTimeEntry(entryId: string): Promise<void> {
    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', entryId)

    if (error) throw error
  },

  // Project updates operations
  async createProjectUpdate(updateData: Partial<ProjectUpdate>): Promise<ProjectUpdate> {
    const { data, error } = await supabase
      .from('project_updates')
      .insert(updateData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProjectUpdates(projectId: string, limit = 50): Promise<ProjectUpdate[]> {
    const { data, error } = await supabase
      .from('project_updates')
      .select(`
        *,
        author:profiles(first_name, last_name, company_name, avatar_url),
        milestone:project_milestones(title)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  async updateProjectUpdate(updateId: string, updates: Partial<ProjectUpdate>): Promise<ProjectUpdate> {
    const { data, error } = await supabase
      .from('project_updates')
      .update(updates)
      .eq('id', updateId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // File operations
  async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    const { data, error } = await supabase
      .from('project_files')
      .select(`
        *,
        uploader:profiles(first_name, last_name, company_name),
        milestone:project_milestones(title)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createProjectFile(fileData: Partial<ProjectFile>): Promise<ProjectFile> {
    const { data, error } = await supabase
      .from('project_files')
      .insert(fileData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProjectFile(fileId: string): Promise<void> {
    const { error } = await supabase
      .from('project_files')
      .delete()
      .eq('id', fileId)

    if (error) throw error
  },

  // Payment operations
  async createMilestonePayment(paymentData: Partial<MilestonePayment>): Promise<MilestonePayment> {
    const { data, error } = await supabase
      .from('milestone_payments')
      .insert(paymentData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateMilestonePayment(paymentId: string, updates: Partial<MilestonePayment>): Promise<MilestonePayment> {
    const { data, error } = await supabase
      .from('milestone_payments')
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProjectPayments(projectId: string): Promise<MilestonePayment[]> {
    const { data, error } = await supabase
      .from('milestone_payments')
      .select(`
        *,
        milestone:project_milestones(title, due_date)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Utility functions
  async calculateProjectCompletion(projectId: string): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_project_completion', {
      p_project_id: projectId
    })

    if (error) throw error
    return data || 0
  },

  async calculateProjectHours(projectId: string): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_project_hours', {
      p_project_id: projectId
    })

    if (error) throw error
    return data || 0
  },

  async updateMilestoneStatuses(): Promise<void> {
    const { error } = await supabase.rpc('update_milestone_statuses')
    if (error) throw error
  },

  // Helper functions
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours === 0) {
      return `${mins}m`
    } else if (mins === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${mins}m`
    }
  },

  calculateTimeEntryDuration(startTime: string, endTime?: string): number {
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()
    
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
  },

  getProjectStatusColor(status: string): string {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-green-100 text-green-800'
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  },

  getMilestoneStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
}