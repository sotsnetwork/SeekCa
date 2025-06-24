-- Projects table for tracking client-professional engagements
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
  
  -- Budget and payment
  estimated_hours numeric(8,2),
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
  
  due_date date,
  completed_date date,
  
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  payment_amount numeric(12,2),
  is_paid boolean DEFAULT false,
  
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
  
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration_minutes integer,
  
  hourly_rate numeric(10,2),
  is_billable boolean DEFAULT true,
  is_approved boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project updates for communication
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

-- Project files for collaboration
CREATE TABLE IF NOT EXISTS project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  uploader_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES project_milestones(id) ON DELETE SET NULL,
  
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  storage_path text NOT NULL,
  
  category text,
  description text,
  
  is_public boolean DEFAULT true,
  download_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Milestone payments
CREATE TABLE IF NOT EXISTS milestone_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES project_milestones(id) ON DELETE CASCADE,
  
  amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  
  is_requested boolean DEFAULT false,
  requested_at timestamptz,
  
  is_approved boolean DEFAULT false,
  approved_at timestamptz,
  
  is_paid boolean DEFAULT false,
  paid_at timestamptz,
  
  payment_method text,
  payment_reference text,
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_payments ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
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

-- Drop existing policies if they exist and recreate them
-- Projects policies
DROP POLICY IF EXISTS "Project participants can view projects" ON projects;
CREATE POLICY "Project participants can view projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING ((hirer_id = auth.uid()) OR (professional_id = auth.uid()));

DROP POLICY IF EXISTS "Hirers can create projects" ON projects;
CREATE POLICY "Hirers can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (hirer_id = auth.uid());

DROP POLICY IF EXISTS "Project participants can update projects" ON projects;
CREATE POLICY "Project participants can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING ((hirer_id = auth.uid()) OR (professional_id = auth.uid()));

-- Project milestones policies
DROP POLICY IF EXISTS "Project participants can view milestones" ON project_milestones;
CREATE POLICY "Project participants can view milestones"
  ON project_milestones
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_milestones.project_id
    AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

DROP POLICY IF EXISTS "Project participants can manage milestones" ON project_milestones;
CREATE POLICY "Project participants can manage milestones"
  ON project_milestones
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_milestones.project_id
    AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_milestones.project_id
    AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

-- Time entries policies
DROP POLICY IF EXISTS "Professionals can manage own time entries" ON time_entries;
CREATE POLICY "Professionals can manage own time entries"
  ON time_entries
  FOR ALL
  TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

DROP POLICY IF EXISTS "Hirers can view time entries for their projects" ON time_entries;
CREATE POLICY "Hirers can view time entries for their projects"
  ON time_entries
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = time_entries.project_id
    AND p.hirer_id = auth.uid()
  ));

-- Project updates policies
DROP POLICY IF EXISTS "Project participants can view updates" ON project_updates;
CREATE POLICY "Project participants can view updates"
  ON project_updates
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_updates.project_id
    AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

DROP POLICY IF EXISTS "Project participants can create updates" ON project_updates;
CREATE POLICY "Project participants can create updates"
  ON project_updates
  FOR INSERT
  TO authenticated
  WITH CHECK ((author_id = auth.uid()) AND EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_updates.project_id
    AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

DROP POLICY IF EXISTS "Authors can update own updates" ON project_updates;
CREATE POLICY "Authors can update own updates"
  ON project_updates
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

-- Project files policies
DROP POLICY IF EXISTS "Project participants can view files" ON project_files;
CREATE POLICY "Project participants can view files"
  ON project_files
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_files.project_id
    AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

DROP POLICY IF EXISTS "Project participants can upload files" ON project_files;
CREATE POLICY "Project participants can upload files"
  ON project_files
  FOR INSERT
  TO authenticated
  WITH CHECK ((uploader_id = auth.uid()) AND EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_files.project_id
    AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

-- Milestone payments policies
DROP POLICY IF EXISTS "Project participants can view payments" ON milestone_payments;
CREATE POLICY "Project participants can view payments"
  ON milestone_payments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = milestone_payments.project_id
    AND (p.hirer_id = auth.uid() OR p.professional_id = auth.uid())
  ));

DROP POLICY IF EXISTS "Professionals can request payments" ON milestone_payments;
CREATE POLICY "Professionals can request payments"
  ON milestone_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = milestone_payments.project_id
    AND p.professional_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Hirers can approve payments" ON milestone_payments;
CREATE POLICY "Hirers can approve payments"
  ON milestone_payments
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = milestone_payments.project_id
    AND p.hirer_id = auth.uid()
  ));

-- Trigger functions for updated_at timestamps
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

-- Function to update project completion based on milestones
CREATE OR REPLACE FUNCTION trigger_update_project_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_milestones integer;
  completed_percentage numeric;
  project_id_val uuid;
BEGIN
  -- Get the project ID
  IF TG_OP = 'DELETE' THEN
    project_id_val := OLD.project_id;
  ELSE
    project_id_val := NEW.project_id;
  END IF;
  
  -- Count total milestones
  SELECT COUNT(*) INTO total_milestones
  FROM project_milestones
  WHERE project_id = project_id_val;
  
  -- Calculate completion percentage
  IF total_milestones > 0 THEN
    SELECT COALESCE(AVG(completion_percentage), 0) INTO completed_percentage
    FROM project_milestones
    WHERE project_id = project_id_val;
  ELSE
    completed_percentage := 0;
  END IF;
  
  -- Update project
  UPDATE projects
  SET 
    completion_percentage = ROUND(completed_percentage::numeric),
    updated_at = now()
  WHERE id = project_id_val;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update project hours based on time entries
CREATE OR REPLACE FUNCTION trigger_update_project_hours()
RETURNS TRIGGER AS $$
DECLARE
  total_hours numeric(8,2);
  project_id_val uuid;
BEGIN
  -- Get the project ID
  IF TG_OP = 'DELETE' THEN
    project_id_val := OLD.project_id;
  ELSE
    project_id_val := NEW.project_id;
  END IF;
  
  -- Calculate total hours
  SELECT COALESCE(SUM(duration_minutes) / 60.0, 0) INTO total_hours
  FROM time_entries
  WHERE project_id = project_id_val;
  
  -- Update project
  UPDATE projects
  SET 
    total_hours_logged = total_hours,
    updated_at = now()
  WHERE id = project_id_val;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist and recreate them
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

DROP TRIGGER IF EXISTS update_project_milestones_updated_at ON project_milestones;
CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_project_milestones_updated_at();

DROP TRIGGER IF EXISTS update_time_entries_updated_at ON time_entries;
CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_time_entries_updated_at();

DROP TRIGGER IF EXISTS update_project_updates_updated_at ON project_updates;
CREATE TRIGGER update_project_updates_updated_at
  BEFORE UPDATE ON project_updates
  FOR EACH ROW
  EXECUTE FUNCTION update_project_updates_updated_at();

DROP TRIGGER IF EXISTS update_project_files_updated_at ON project_files;
CREATE TRIGGER update_project_files_updated_at
  BEFORE UPDATE ON project_files
  FOR EACH ROW
  EXECUTE FUNCTION update_project_files_updated_at();

DROP TRIGGER IF EXISTS update_milestone_payments_updated_at ON milestone_payments;
CREATE TRIGGER update_milestone_payments_updated_at
  BEFORE UPDATE ON milestone_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_payments_updated_at();

-- Create business logic triggers
DROP TRIGGER IF EXISTS trigger_update_project_completion ON project_milestones;
CREATE TRIGGER trigger_update_project_completion
  AFTER INSERT OR UPDATE OR DELETE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_project_completion();

DROP TRIGGER IF EXISTS trigger_update_project_hours ON time_entries;
CREATE TRIGGER trigger_update_project_hours
  AFTER INSERT OR UPDATE OR DELETE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_project_hours();

-- Function to get project dashboard for a user
CREATE OR REPLACE FUNCTION get_project_dashboard(p_user_id uuid)
RETURNS TABLE (
  project_id uuid,
  project_title text,
  project_status project_status,
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
    p.status as project_status,
    p.completion_percentage,
    p.total_hours_logged,
    (
      SELECT COUNT(*) 
      FROM project_milestones pm 
      WHERE pm.project_id = p.id 
        AND pm.status != 'completed' 
        AND pm.due_date < CURRENT_DATE
    ) as overdue_milestones,
    (
      SELECT COUNT(*) 
      FROM milestone_payments mp 
      WHERE mp.project_id = p.id 
        AND mp.is_requested = true 
        AND mp.is_approved = false
    ) as pending_payments,
    CASE
      WHEN p.hirer_id = p_user_id THEN 
        COALESCE(
          prof.first_name || ' ' || prof.last_name,
          'Professional'
        )
      ELSE 
        COALESCE(
          hirer.company_name,
          hirer.first_name || ' ' || hirer.last_name,
          'Client'
        )
    END as other_party_name,
    CASE
      WHEN p.hirer_id = p_user_id THEN prof.avatar_url
      ELSE hirer.avatar_url
    END as other_party_avatar,
    p.updated_at as last_update
  FROM projects p
  LEFT JOIN profiles prof ON prof.id = p.professional_id
  LEFT JOIN profiles hirer ON hirer.id = p.hirer_id
  WHERE p.hirer_id = p_user_id OR p.professional_id = p_user_id
  ORDER BY p.updated_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate project completion
CREATE OR REPLACE FUNCTION calculate_project_completion(p_project_id uuid)
RETURNS numeric AS $$
DECLARE
  completion_pct numeric;
BEGIN
  SELECT COALESCE(AVG(completion_percentage), 0) INTO completion_pct
  FROM project_milestones
  WHERE project_id = p_project_id;
  
  RETURN ROUND(completion_pct);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate project hours
CREATE OR REPLACE FUNCTION calculate_project_hours(p_project_id uuid)
RETURNS numeric AS $$
DECLARE
  total_hours numeric;
BEGIN
  SELECT COALESCE(SUM(duration_minutes) / 60.0, 0) INTO total_hours
  FROM time_entries
  WHERE project_id = p_project_id;
  
  RETURN total_hours;
END;
$$ LANGUAGE plpgsql;

-- Function to update milestone statuses based on dates
CREATE OR REPLACE FUNCTION update_milestone_statuses()
RETURNS void AS $$
BEGIN
  -- Mark overdue milestones
  UPDATE project_milestones
  SET status = 'overdue'
  WHERE status = 'pending'
    AND due_date < CURRENT_DATE;
  
  -- Mark completed milestones if 100% complete
  UPDATE project_milestones
  SET 
    status = 'completed',
    completed_date = CURRENT_DATE
  WHERE status IN ('pending', 'in_progress')
    AND completion_percentage = 100
    AND completed_date IS NULL;
    
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for projects (only if tables are empty)
DO $$
BEGIN
  -- Only insert if no projects exist
  IF NOT EXISTS (SELECT 1 FROM projects LIMIT 1) THEN
    INSERT INTO projects (
      job_id, hirer_id, professional_id, title, description, status,
      start_date, end_date, estimated_hours, total_budget, hourly_rate
    )
    SELECT 
      j.id,
      j.hirer_id,
      a.professional_id,
      j.title,
      'Project created from job application. ' || j.description,
      'in_progress'::project_status,
      CURRENT_DATE - INTERVAL '2 weeks',
      CURRENT_DATE + INTERVAL '2 months',
      CASE 
        WHEN j.salary_type = 'hourly' THEN j.salary_max * 40
        ELSE 160
      END,
      CASE 
        WHEN j.salary_type = 'project' THEN j.salary_max
        WHEN j.salary_type = 'hourly' THEN j.salary_max * 160
        ELSE j.salary_max
      END,
      CASE 
        WHEN j.salary_type = 'hourly' THEN j.salary_max
        ELSE j.salary_max / 160
      END
    FROM jobs j
    JOIN applications a ON a.job_id = j.id
    WHERE a.status = 'hired'
      AND NOT EXISTS (
        SELECT 1 FROM projects p 
        WHERE p.job_id = j.id AND p.professional_id = a.professional_id
      )
    LIMIT 5;

    -- Create sample milestones for projects
    INSERT INTO project_milestones (
      project_id, title, description, status, due_date,
      completion_percentage, payment_amount, display_order
    )
    SELECT 
      p.id,
      'Project Planning Phase',
      'Initial planning, requirements gathering, and project setup.',
      'completed'::milestone_status,
      p.start_date + INTERVAL '1 week',
      100,
      p.total_budget * 0.2,
      1
    FROM projects p
    WHERE NOT EXISTS (
      SELECT 1 FROM project_milestones pm WHERE pm.project_id = p.id
    )
    LIMIT 5;

    -- Add second milestone
    INSERT INTO project_milestones (
      project_id, title, description, status, due_date,
      completion_percentage, payment_amount, display_order
    )
    SELECT 
      p.id,
      'Initial Implementation',
      'First phase of project implementation.',
      'in_progress'::milestone_status,
      p.start_date + INTERVAL '3 weeks',
      50,
      p.total_budget * 0.3,
      2
    FROM projects p
    WHERE EXISTS (
      SELECT 1 FROM project_milestones pm 
      WHERE pm.project_id = p.id AND pm.display_order = 1
    )
    LIMIT 5;

    -- Add third milestone
    INSERT INTO project_milestones (
      project_id, title, description, status, due_date,
      completion_percentage, payment_amount, display_order
    )
    SELECT 
      p.id,
      'Final Completion',
      'Project completion and final deliverables.',
      'pending'::milestone_status,
      p.end_date - INTERVAL '1 week',
      0,
      p.total_budget * 0.5,
      3
    FROM projects p
    WHERE EXISTS (
      SELECT 1 FROM project_milestones pm 
      WHERE pm.project_id = p.id AND pm.display_order = 2
    )
    LIMIT 5;

    -- Add time entries
    INSERT INTO time_entries (
      project_id, professional_id, milestone_id, entry_type,
      description, start_time, end_time, duration_minutes,
      hourly_rate, is_billable, is_approved
    )
    SELECT 
      p.id,
      p.professional_id,
      pm.id,
      'work'::time_entry_type,
      'Initial project planning and setup',
      p.start_date + INTERVAL '2 days' + (RANDOM() * INTERVAL '5 days'),
      p.start_date + INTERVAL '2 days 4 hours' + (RANDOM() * INTERVAL '5 days'),
      240, -- 4 hours
      p.hourly_rate,
      true,
      true
    FROM projects p
    JOIN project_milestones pm ON pm.project_id = p.id AND pm.display_order = 1
    WHERE NOT EXISTS (
      SELECT 1 FROM time_entries te WHERE te.project_id = p.id
    )
    LIMIT 5;

    -- Add second time entry
    INSERT INTO time_entries (
      project_id, professional_id, milestone_id, entry_type,
      description, start_time, end_time, duration_minutes,
      hourly_rate, is_billable, is_approved
    )
    SELECT 
      p.id,
      p.professional_id,
      pm.id,
      'work'::time_entry_type,
      'Implementation work',
      p.start_date + INTERVAL '1 week 2 days' + (RANDOM() * INTERVAL '5 days'),
      p.start_date + INTERVAL '1 week 2 days 6 hours' + (RANDOM() * INTERVAL '5 days'),
      360, -- 6 hours
      p.hourly_rate,
      true,
      true
    FROM projects p
    JOIN project_milestones pm ON pm.project_id = p.id AND pm.display_order = 2
    WHERE EXISTS (
      SELECT 1 FROM time_entries te WHERE te.project_id = p.id
    )
    LIMIT 5;

    -- Add project updates
    INSERT INTO project_updates (
      project_id, author_id, milestone_id, update_type,
      title, content, is_important
    )
    SELECT 
      p.id,
      p.professional_id,
      pm.id,
      'status'::update_type,
      'Project Planning Complete',
      'I have completed the planning phase of the project. All requirements have been gathered and documented. Ready to begin implementation phase.',
      true
    FROM projects p
    JOIN project_milestones pm ON pm.project_id = p.id AND pm.display_order = 1
    WHERE NOT EXISTS (
      SELECT 1 FROM project_updates pu WHERE pu.project_id = p.id
    )
    LIMIT 5;

    -- Add second update from hirer
    INSERT INTO project_updates (
      project_id, author_id, update_type,
      title, content
    )
    SELECT 
      p.id,
      p.hirer_id,
      'general'::update_type,
      'Great progress so far',
      'Thank you for the detailed planning. Looking forward to seeing the implementation progress. Let me know if you need any additional information from our side.'
    FROM projects p
    WHERE EXISTS (
      SELECT 1 FROM project_updates pu WHERE pu.project_id = p.id
    )
    LIMIT 5;

    -- Add milestone payment
    INSERT INTO milestone_payments (
      project_id, milestone_id, amount, currency,
      is_requested, requested_at, is_approved, approved_at, is_paid, paid_at
    )
    SELECT 
      p.id,
      pm.id,
      pm.payment_amount,
      'USD',
      true,
      p.start_date + INTERVAL '1 week 3 days',
      true,
      p.start_date + INTERVAL '1 week 4 days',
      true,
      p.start_date + INTERVAL '1 week 5 days'
    FROM projects p
    JOIN project_milestones pm ON pm.project_id = p.id AND pm.display_order = 1
    WHERE pm.status = 'completed'
    LIMIT 5;

    -- Update project completion percentages
    UPDATE projects p
    SET completion_percentage = (
      SELECT COALESCE(AVG(completion_percentage), 0)
      FROM project_milestones pm
      WHERE pm.project_id = p.id
    );

    -- Update project total hours
    UPDATE projects p
    SET total_hours_logged = (
      SELECT COALESCE(SUM(duration_minutes) / 60.0, 0)
      FROM time_entries te
      WHERE te.project_id = p.id
    );
  END IF;
END
$$;