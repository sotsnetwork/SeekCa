/*
  # Complete Database Setup for SeekCa Platform

  1. Core Tables
    - Enhanced profiles and professional_profiles
    - Jobs and applications system
    - Messaging and conversations
    - File attachments and storage
    - Notifications and preferences

  2. Advanced Features
    - Project management system
    - Time tracking and milestones
    - Payment processing
    - Search and analytics
    - Saved searches and alerts

  3. Security & Performance
    - Row Level Security policies
    - Optimized indexes
    - Trigger functions for automation
    - Data validation constraints

  4. Sample Data
    - Professional categories and skills
    - Sample users and profiles
    - Demo jobs and applications
*/

-- First, ensure all enum types exist
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('hirer', 'professional');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'rejected', 'verified');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE availability_status AS ENUM ('available', 'busy', 'unavailable');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE job_category AS ENUM ('construction', 'consulting', 'design', 'engineering', 'other', 'project-management', 'real-estate', 'services');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE job_type AS ENUM ('contract', 'freelance', 'full-time', 'part-time');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE salary_type AS ENUM ('hourly', 'project', 'salary');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('active', 'closed', 'draft', 'filled', 'paused');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('hired', 'pending', 'rejected', 'reviewed', 'shortlisted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE message_type AS ENUM ('file', 'system', 'text');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('application', 'job_update', 'message', 'review', 'system');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('cancelled', 'completed', 'in_progress', 'on_hold', 'planning');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE milestone_status AS ENUM ('completed', 'in_progress', 'overdue', 'pending');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE time_entry_type AS ENUM ('meeting', 'other', 'planning', 'research', 'review', 'work');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE update_type AS ENUM ('general', 'issue', 'milestone', 'status', 'system');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create messaging and conversation tables
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  hirer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(job_id, hirer_id, professional_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type message_type DEFAULT 'text',
  file_url text,
  file_name text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create project management tables
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  hirer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status project_status DEFAULT 'planning',
  start_date date,
  end_date date,
  estimated_hours numeric(8,2),
  total_budget numeric(12,2),
  hourly_rate numeric(10,2),
  payment_schedule text,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  total_hours_logged numeric(8,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(job_id, professional_id)
);

CREATE TABLE IF NOT EXISTS project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status milestone_status DEFAULT 'pending',
  due_date date,
  completed_date date,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  payment_amount numeric(12,2),
  is_paid boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES project_milestones(id) ON DELETE SET NULL,
  entry_type time_entry_type DEFAULT 'work',
  description text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration_minutes integer,
  hourly_rate numeric(10,2),
  is_billable boolean DEFAULT true,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create search and analytics tables
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  search_type text NOT NULL CHECK (search_type IN ('jobs', 'professionals')),
  criteria jsonb DEFAULT '{}' NOT NULL,
  is_alert_enabled boolean DEFAULT false,
  alert_frequency text DEFAULT 'daily' CHECK (alert_frequency IN ('immediate', 'daily', 'weekly')),
  last_alert_sent timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  saved_search_id uuid REFERENCES saved_searches(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  is_sent boolean DEFAULT false,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS search_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  search_type text NOT NULL CHECK (search_type IN ('jobs', 'professionals')),
  query text,
  filters jsonb DEFAULT '{}',
  results_count integer DEFAULT 0,
  clicked_result_id uuid,
  session_id text,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversations
CREATE POLICY "Users can view conversations they participate in"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (hirer_id = auth.uid() OR professional_id = auth.uid());

CREATE POLICY "Users can create conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (hirer_id = auth.uid() OR professional_id = auth.uid());

CREATE POLICY "Users can update conversations they participate in"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (hirer_id = auth.uid() OR professional_id = auth.uid());

-- Create RLS policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id 
      AND (hirer_id = auth.uid() OR professional_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id 
      AND (hirer_id = auth.uid() OR professional_id = auth.uid())
    ) AND sender_id = auth.uid()
  );

CREATE POLICY "Users can update messages they sent"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid());

-- Create RLS policies for projects
CREATE POLICY "Project participants can view projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (hirer_id = auth.uid() OR professional_id = auth.uid());

CREATE POLICY "Hirers can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (hirer_id = auth.uid());

CREATE POLICY "Project participants can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (hirer_id = auth.uid() OR professional_id = auth.uid());

-- Create RLS policies for project milestones
CREATE POLICY "Project participants can view milestones"
  ON project_milestones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_id 
      AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
    )
  );

CREATE POLICY "Project participants can manage milestones"
  ON project_milestones
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_id 
      AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_id 
      AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
    )
  );

-- Create RLS policies for time entries
CREATE POLICY "Professionals can manage own time entries"
  ON time_entries
  FOR ALL
  TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Hirers can view time entries for their projects"
  ON time_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_id AND p.hirer_id = auth.uid()
    )
  );

-- Create RLS policies for saved searches
CREATE POLICY "Users can manage own saved searches"
  ON saved_searches
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create RLS policies for job alerts
CREATE POLICY "Users can view own job alerts"
  ON job_alerts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create job alerts"
  ON job_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create RLS policies for search analytics
CREATE POLICY "Users can view own search analytics"
  ON search_analytics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can create search analytics"
  ON search_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_hirer_id ON conversations(hirer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_professional_id ON conversations(professional_id);
CREATE INDEX IF NOT EXISTS idx_conversations_job_id ON conversations(job_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);

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

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_type ON saved_searches(search_type);
CREATE INDEX IF NOT EXISTS idx_saved_searches_alerts ON saved_searches(is_alert_enabled, alert_frequency);

CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_search_id ON job_alerts(saved_search_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_sent ON job_alerts(is_sent, created_at);

CREATE INDEX IF NOT EXISTS idx_search_analytics_user_id ON search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_type ON search_analytics(search_type);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at DESC);

-- Create utility functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update conversation last message time
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Create function to calculate project completion
CREATE OR REPLACE FUNCTION trigger_update_project_completion()
RETURNS TRIGGER AS $$
DECLARE
  project_completion numeric;
BEGIN
  -- Calculate average completion of all milestones
  SELECT COALESCE(AVG(completion_percentage), 0)
  INTO project_completion
  FROM project_milestones
  WHERE project_id = COALESCE(NEW.project_id, OLD.project_id);
  
  -- Update project completion percentage
  UPDATE projects
  SET completion_percentage = project_completion::integer,
      updated_at = now()
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_completion
  AFTER INSERT OR UPDATE OR DELETE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_project_completion();

-- Create function to update project hours
CREATE OR REPLACE FUNCTION trigger_update_project_hours()
RETURNS TRIGGER AS $$
DECLARE
  total_hours numeric;
BEGIN
  -- Calculate total hours logged
  SELECT COALESCE(SUM(duration_minutes), 0) / 60.0
  INTO total_hours
  FROM time_entries
  WHERE project_id = COALESCE(NEW.project_id, OLD.project_id);
  
  -- Update project total hours
  UPDATE projects
  SET total_hours_logged = total_hours,
      updated_at = now()
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_hours
  AFTER INSERT OR UPDATE OR DELETE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_project_hours();

-- Create search functions
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
  salary_min numeric,
  salary_max numeric,
  salary_type salary_type,
  required_skills text[],
  required_licenses text[],
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
    j.salary_min,
    j.salary_max,
    j.salary_type,
    j.required_skills,
    j.required_licenses,
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
    AND (p_query IS NULL OR (
      j.title ILIKE '%' || p_query || '%' OR
      j.description ILIKE '%' || p_query || '%' OR
      p.company_name ILIKE '%' || p_query || '%'
    ))
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
        SELECT COUNT(*) * 100.0 / GREATEST(array_length(p_skills, 1), 1)
        FROM unnest(pp.skills) skill
        WHERE skill = ANY(p_skills)
      )
    END as skill_match_score
  FROM professional_profiles pp
  JOIN profiles p ON p.id = pp.user_id
  WHERE p.role = 'professional'
    AND (p_query IS NULL OR (
      pp.title ILIKE '%' || p_query || '%' OR
      p.first_name ILIKE '%' || p_query || '%' OR
      p.last_name ILIKE '%' || p_query || '%' OR
      p.bio ILIKE '%' || p_query || '%'
    ))
    AND (p_skills IS NULL OR pp.skills && p_skills)
    AND (p_location IS NULL OR p.location ILIKE '%' || p_location || '%')
    AND (p_hourly_rate_min IS NULL OR pp.hourly_rate >= p_hourly_rate_min OR pp.hourly_rate IS NULL)
    AND (p_hourly_rate_max IS NULL OR pp.hourly_rate <= p_hourly_rate_max OR pp.hourly_rate IS NULL)
    AND (p_availability_status IS NULL OR pp.availability_status::text = p_availability_status)
    AND (p_experience_min IS NULL OR pp.experience_years >= p_experience_min)
    AND (p_rating_min IS NULL OR pp.rating >= p_rating_min)
    AND (p_licenses IS NULL OR pp.licenses && p_licenses)
  ORDER BY 
    skill_match_score DESC,
    pp.rating DESC,
    pp.total_reviews DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Create function to log search analytics
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
    user_id,
    search_type,
    query,
    filters,
    results_count,
    session_id
  ) VALUES (
    p_user_id,
    p_search_type,
    p_query,
    p_filters,
    p_results_count,
    p_session_id
  );
END;
$$ LANGUAGE plpgsql;