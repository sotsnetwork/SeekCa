/*
  # Complete Database Setup for SeekCa Platform

  1. Project Management Tables
    - `projects` - Project tracking and management
    - `project_milestones` - Project milestone tracking
    - `time_entries` - Time tracking for professionals
    - `project_updates` - Project status updates
    - `project_files` - Project file management
    - `milestone_payments` - Payment tracking

  2. Enhanced Search & Analytics
    - `saved_searches` - User saved search queries
    - `job_alerts` - Automated job matching alerts
    - `search_analytics` - Search behavior tracking

  3. Advanced Functions
    - Search functions for jobs and professionals
    - Analytics and reporting functions
    - Automated triggers for data consistency

  4. Security & Performance
    - Row Level Security policies
    - Performance indexes
    - Data validation constraints
*/

-- Create enum types for project management
CREATE TYPE IF NOT EXISTS project_status AS ENUM ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled');
CREATE TYPE IF NOT EXISTS milestone_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
CREATE TYPE IF NOT EXISTS time_entry_type AS ENUM ('work', 'meeting', 'research', 'planning', 'review', 'other');
CREATE TYPE IF NOT EXISTS update_type AS ENUM ('status', 'milestone', 'issue', 'general', 'system');

-- Projects table for tracking work between hirers and professionals
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  hirer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Project details
  title text NOT NULL,
  description text,
  status project_status DEFAULT 'planning',
  
  -- Timeline
  start_date date,
  end_date date,
  estimated_hours numeric(8,2),
  
  -- Budget and payment
  total_budget numeric(12,2),
  hourly_rate numeric(10,2),
  payment_schedule text,
  
  -- Progress tracking
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  total_hours_logged numeric(8,2) DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one project per job-professional pair
  UNIQUE(job_id, professional_id)
);

-- Project milestones for tracking progress
CREATE TABLE IF NOT EXISTS project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  
  title text NOT NULL,
  description text,
  status milestone_status DEFAULT 'pending',
  
  -- Timeline
  due_date date,
  completed_date date,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  -- Payment
  payment_amount numeric(12,2),
  is_paid boolean DEFAULT false,
  
  -- Display
  display_order integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Time tracking for professionals
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES project_milestones(id) ON DELETE SET NULL,
  
  entry_type time_entry_type DEFAULT 'work',
  description text NOT NULL,
  
  -- Time tracking
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration_minutes integer,
  
  -- Billing
  hourly_rate numeric(10,2),
  is_billable boolean DEFAULT true,
  is_approved boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project updates and communication
CREATE TABLE IF NOT EXISTS project_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES project_milestones(id) ON DELETE SET NULL,
  
  update_type update_type DEFAULT 'general',
  title text,
  content text NOT NULL,
  
  is_public boolean DEFAULT true,
  is_important boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project file management
CREATE TABLE IF NOT EXISTS project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  uploader_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES project_milestones(id) ON DELETE SET NULL,
  
  -- File details
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  storage_path text NOT NULL,
  
  -- Metadata
  category text,
  description text,
  is_public boolean DEFAULT true,
  download_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Milestone payments tracking
CREATE TABLE IF NOT EXISTS milestone_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES project_milestones(id) ON DELETE CASCADE,
  
  amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  
  -- Payment workflow
  is_requested boolean DEFAULT false,
  requested_at timestamptz,
  is_approved boolean DEFAULT false,
  approved_at timestamptz,
  is_paid boolean DEFAULT false,
  paid_at timestamptz,
  
  -- Payment details
  payment_method text,
  payment_reference text,
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Saved searches for users
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  
  name text NOT NULL,
  search_type text NOT NULL CHECK (search_type IN ('jobs', 'professionals')),
  criteria jsonb NOT NULL DEFAULT '{}',
  
  -- Alerts
  is_alert_enabled boolean DEFAULT false,
  alert_frequency text DEFAULT 'daily' CHECK (alert_frequency IN ('immediate', 'daily', 'weekly')),
  last_alert_sent timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job alerts for matching saved searches
CREATE TABLE IF NOT EXISTS job_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  saved_search_id uuid REFERENCES saved_searches(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  
  is_sent boolean DEFAULT false,
  sent_at timestamptz,
  
  created_at timestamptz DEFAULT now()
);

-- Search analytics for tracking user behavior
CREATE TABLE IF NOT EXISTS search_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  
  search_type text NOT NULL CHECK (search_type IN ('jobs', 'professionals')),
  query text,
  filters jsonb DEFAULT '{}',
  results_count integer DEFAULT 0,
  clicked_result_id uuid,
  
  -- Session tracking
  session_id text,
  ip_address text,
  user_agent text,
  
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Project participants can view projects"
  ON projects FOR SELECT TO authenticated
  USING (hirer_id = auth.uid() OR professional_id = auth.uid());

CREATE POLICY "Hirers can create projects"
  ON projects FOR INSERT TO authenticated
  WITH CHECK (hirer_id = auth.uid());

CREATE POLICY "Project participants can update projects"
  ON projects FOR UPDATE TO authenticated
  USING (hirer_id = auth.uid() OR professional_id = auth.uid());

-- Create RLS policies for project milestones
CREATE POLICY "Project participants can view milestones"
  ON project_milestones FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_id AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

CREATE POLICY "Project participants can manage milestones"
  ON project_milestones FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_id AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_id AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

-- Create RLS policies for time entries
CREATE POLICY "Professionals can manage own time entries"
  ON time_entries FOR ALL TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Hirers can view time entries for their projects"
  ON time_entries FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_id AND p.hirer_id = auth.uid()
  ));

-- Create RLS policies for project updates
CREATE POLICY "Project participants can view updates"
  ON project_updates FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_id AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

CREATE POLICY "Project participants can create updates"
  ON project_updates FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_id AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
    )
  );

CREATE POLICY "Authors can update own updates"
  ON project_updates FOR UPDATE TO authenticated
  USING (author_id = auth.uid());

-- Create RLS policies for project files
CREATE POLICY "Project participants can view files"
  ON project_files FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_id AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

CREATE POLICY "Project participants can upload files"
  ON project_files FOR INSERT TO authenticated
  WITH CHECK (
    uploader_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_id AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
    )
  );

-- Create RLS policies for milestone payments
CREATE POLICY "Project participants can view payments"
  ON milestone_payments FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_id AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

CREATE POLICY "Professionals can request payments"
  ON milestone_payments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_id AND p.professional_id = auth.uid()
  ));

CREATE POLICY "Hirers can approve payments"
  ON milestone_payments FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_id AND p.hirer_id = auth.uid()
  ));

-- Create RLS policies for saved searches
CREATE POLICY "Users can manage own saved searches"
  ON saved_searches FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create RLS policies for job alerts
CREATE POLICY "Users can view own job alerts"
  ON job_alerts FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create job alerts"
  ON job_alerts FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create RLS policies for search analytics
CREATE POLICY "Users can view own search analytics"
  ON search_analytics FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can create search analytics"
  ON search_analytics FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_projects_hirer_id ON projects(hirer_id);
CREATE INDEX IF NOT EXISTS idx_projects_professional_id ON projects(professional_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON project_milestones(status);
CREATE INDEX IF NOT EXISTS idx_project_milestones_due_date ON project_milestones(due_date);
CREATE INDEX IF NOT EXISTS idx_project_milestones_display_order ON project_milestones(display_order);

CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_professional_id ON time_entries(professional_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_start_time ON time_entries(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_time_entries_is_billable ON time_entries(is_billable);

CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_author_id ON project_updates(author_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_created_at ON project_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_updates_type ON project_updates(update_type);

CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_uploader_id ON project_files(uploader_id);
CREATE INDEX IF NOT EXISTS idx_project_files_category ON project_files(category);

CREATE INDEX IF NOT EXISTS idx_milestone_payments_project_id ON milestone_payments(project_id);
CREATE INDEX IF NOT EXISTS idx_milestone_payments_milestone_id ON milestone_payments(milestone_id);
CREATE INDEX IF NOT EXISTS idx_milestone_payments_status ON milestone_payments(is_paid, is_approved);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_type ON saved_searches(search_type);
CREATE INDEX IF NOT EXISTS idx_saved_searches_alerts ON saved_searches(is_alert_enabled, alert_frequency);

CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_search_id ON job_alerts(saved_search_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_sent ON job_alerts(is_sent, created_at);

CREATE INDEX IF NOT EXISTS idx_search_analytics_user_id ON search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_type ON search_analytics(search_type);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at DESC);

-- Create trigger functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_project_milestones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_time_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_project_updates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_project_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_milestone_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_saved_searches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_project_milestones_updated_at();

CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_time_entries_updated_at();

CREATE TRIGGER update_project_updates_updated_at
  BEFORE UPDATE ON project_updates
  FOR EACH ROW
  EXECUTE FUNCTION update_project_updates_updated_at();

CREATE TRIGGER update_project_files_updated_at
  BEFORE UPDATE ON project_files
  FOR EACH ROW
  EXECUTE FUNCTION update_project_files_updated_at();

CREATE TRIGGER update_milestone_payments_updated_at
  BEFORE UPDATE ON milestone_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_payments_updated_at();

CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_searches_updated_at();

-- Business logic functions
CREATE OR REPLACE FUNCTION trigger_update_project_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_milestones integer;
  completed_milestones integer;
  completion_pct integer;
BEGIN
  -- Calculate project completion based on milestones
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed')
  INTO total_milestones, completed_milestones
  FROM project_milestones 
  WHERE project_id = COALESCE(NEW.project_id, OLD.project_id);
  
  IF total_milestones > 0 THEN
    completion_pct := (completed_milestones * 100) / total_milestones;
    
    UPDATE projects 
    SET completion_percentage = completion_pct
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_update_project_hours()
RETURNS TRIGGER AS $$
DECLARE
  total_hours numeric;
BEGIN
  -- Calculate total hours logged for project
  SELECT COALESCE(SUM(duration_minutes), 0) / 60.0
  INTO total_hours
  FROM time_entries 
  WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
    AND is_billable = true;
  
  UPDATE projects 
  SET total_hours_logged = total_hours
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create business logic triggers
CREATE TRIGGER trigger_update_project_completion
  AFTER INSERT OR UPDATE OR DELETE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_project_completion();

CREATE TRIGGER trigger_update_project_hours
  AFTER INSERT OR UPDATE OR DELETE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_project_hours();

-- Advanced search functions
CREATE OR REPLACE FUNCTION search_jobs(
  p_search_type text DEFAULT 'jobs',
  p_query text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_job_type text DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_remote_allowed boolean DEFAULT NULL,
  p_salary_min numeric DEFAULT NULL,
  p_salary_max numeric DEFAULT NULL,
  p_salary_type text DEFAULT NULL,
  p_required_skills text[] DEFAULT NULL,
  p_required_licenses text[] DEFAULT NULL,
  p_is_urgent boolean DEFAULT NULL,
  p_posted_within_days integer DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  category job_category,
  job_type job_type,
  location text,
  remote_allowed boolean,
  salary_type salary_type,
  salary_min numeric,
  salary_max numeric,
  required_skills text[],
  required_licenses text[],
  requirements text[],
  is_urgent boolean,
  status job_status,
  view_count integer,
  application_count integer,
  created_at timestamptz,
  company_name text,
  company_verified boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id,
    j.title,
    j.description,
    j.category,
    j.job_type,
    j.location,
    j.remote_allowed,
    j.salary_type,
    j.salary_min,
    j.salary_max,
    j.required_skills,
    j.required_licenses,
    j.requirements,
    j.is_urgent,
    j.status,
    j.view_count,
    j.application_count,
    j.created_at,
    p.company_name,
    p.is_verified as company_verified
  FROM jobs j
  LEFT JOIN profiles p ON p.id = j.hirer_id
  WHERE j.status = 'active'
    AND (p_query IS NULL OR j.search_text ILIKE '%' || p_query || '%')
    AND (p_category IS NULL OR j.category::text = p_category)
    AND (p_job_type IS NULL OR j.job_type::text = p_job_type)
    AND (p_location IS NULL OR j.location ILIKE '%' || p_location || '%')
    AND (p_remote_allowed IS NULL OR j.remote_allowed = p_remote_allowed)
    AND (p_salary_min IS NULL OR j.salary_max >= p_salary_min OR j.salary_max IS NULL)
    AND (p_salary_max IS NULL OR j.salary_min <= p_salary_max OR j.salary_min IS NULL)
    AND (p_salary_type IS NULL OR j.salary_type::text = p_salary_type)
    AND (p_required_skills IS NULL OR j.required_skills && p_required_skills)
    AND (p_required_licenses IS NULL OR j.required_licenses && p_required_licenses)
    AND (p_is_urgent IS NULL OR j.is_urgent = p_is_urgent)
    AND (p_posted_within_days IS NULL OR j.created_at >= now() - (p_posted_within_days || ' days')::interval)
  ORDER BY 
    j.is_urgent DESC,
    j.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_professionals(
  p_search_type text DEFAULT 'professionals',
  p_query text DEFAULT NULL,
  p_skills text[] DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_hourly_rate_min numeric DEFAULT NULL,
  p_hourly_rate_max numeric DEFAULT NULL,
  p_availability_status text DEFAULT NULL,
  p_experience_min integer DEFAULT NULL,
  p_rating_min numeric DEFAULT NULL,
  p_licenses text[] DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  hourly_rate numeric,
  experience_years integer,
  skills text[],
  licenses text[],
  availability_status availability_status,
  rating numeric,
  total_reviews integer,
  completed_projects integer,
  first_name text,
  last_name text,
  location text,
  avatar_url text,
  bio text,
  is_verified boolean,
  skill_match_score numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pp.id,
    pp.user_id,
    pp.title,
    pp.hourly_rate,
    pp.experience_years,
    pp.skills,
    pp.licenses,
    pp.availability_status,
    pp.rating,
    pp.total_reviews,
    pp.completed_projects,
    p.first_name,
    p.last_name,
    p.location,
    p.avatar_url,
    p.bio,
    p.is_verified,
    CASE 
      WHEN p_skills IS NULL THEN 0
      ELSE (
        SELECT COUNT(*) * 100.0 / array_length(p_skills, 1)
        FROM unnest(p_skills) AS skill
        WHERE skill = ANY(pp.skills)
      )
    END as skill_match_score
  FROM professional_profiles pp
  JOIN profiles p ON p.id = pp.user_id
  WHERE p.role = 'professional'
    AND (p_query IS NULL OR pp.search_text ILIKE '%' || p_query || '%')
    AND (p_skills IS NULL OR pp.skills && p_skills)
    AND (p_location IS NULL OR p.location ILIKE '%' || p_location || '%')
    AND (p_hourly_rate_min IS NULL OR pp.hourly_rate >= p_hourly_rate_min)
    AND (p_hourly_rate_max IS NULL OR pp.hourly_rate <= p_hourly_rate_max)
    AND (p_availability_status IS NULL OR pp.availability_status::text = p_availability_status)
    AND (p_experience_min IS NULL OR pp.experience_years >= p_experience_min)
    AND (p_rating_min IS NULL OR pp.rating >= p_rating_min)
    AND (p_licenses IS NULL OR pp.licenses && p_licenses)
  ORDER BY 
    pp.rating DESC,
    pp.total_reviews DESC,
    pp.completed_projects DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Analytics functions
CREATE OR REPLACE FUNCTION log_search_analytics(
  p_user_id uuid,
  p_search_type text,
  p_query text,
  p_filters jsonb,
  p_results_count integer,
  p_session_id text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO search_analytics (
    user_id, search_type, query, filters, results_count, session_id
  ) VALUES (
    p_user_id, p_search_type, p_query, p_filters, p_results_count, p_session_id
  );
END;
$$ LANGUAGE plpgsql;

-- Project dashboard function
CREATE OR REPLACE FUNCTION get_project_dashboard(p_user_id uuid)
RETURNS TABLE (
  project_id uuid,
  project_title text,
  project_status text,
  completion_percentage integer,
  total_hours_logged numeric,
  overdue_milestones integer,
  pending_payments integer,
  other_party_name text,
  other_party_avatar text,
  last_update timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as project_id,
    p.title as project_title,
    p.status::text as project_status,
    p.completion_percentage,
    p.total_hours_logged,
    (
      SELECT COUNT(*)::integer 
      FROM project_milestones pm 
      WHERE pm.project_id = p.id 
        AND pm.status != 'completed' 
        AND pm.due_date < CURRENT_DATE
    ) as overdue_milestones,
    (
      SELECT COUNT(*)::integer 
      FROM milestone_payments mp 
      WHERE mp.project_id = p.id 
        AND mp.is_requested = true 
        AND mp.is_approved = false
    ) as pending_payments,
    CASE 
      WHEN p.hirer_id = p_user_id THEN 
        COALESCE(prof.first_name || ' ' || prof.last_name, 'Professional')
      ELSE 
        COALESCE(hirer.company_name, hirer.first_name || ' ' || hirer.last_name, 'Client')
    END as other_party_name,
    CASE 
      WHEN p.hirer_id = p_user_id THEN prof.avatar_url
      ELSE hirer.avatar_url
    END as other_party_avatar,
    p.updated_at as last_update
  FROM projects p
  LEFT JOIN profiles hirer ON hirer.id = p.hirer_id
  LEFT JOIN profiles prof ON prof.id = p.professional_id
  WHERE p.hirer_id = p_user_id OR p.professional_id = p_user_id
  ORDER BY p.updated_at DESC;
END;
$$ LANGUAGE plpgsql;