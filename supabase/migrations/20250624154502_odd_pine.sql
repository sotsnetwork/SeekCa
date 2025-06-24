/*
  # Sample Data for SeekCa Platform

  1. Enhanced Professional Profiles
    - Realistic professional titles and skills
    - Professional handwork and engineering focus
    - Proper licensing and certifications

  2. Sample Jobs
    - Engineering and construction projects
    - Skilled trades opportunities
    - Professional service requirements

  3. Sample Reviews and Portfolio
    - Professional client feedback
    - Work showcase examples
    - Rating and recommendation data

  4. Sample Projects and Milestones
    - Active project tracking
    - Milestone-based progress
    - Time and payment tracking
*/

-- Insert additional sample professional profiles if needed
INSERT INTO professional_profiles (
  user_id, title, hourly_rate, experience_years, skills, licenses, certifications,
  availability_status, response_time_hours, rating, total_reviews, completed_projects
)
SELECT 
  p.id,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 1 THEN 'Licensed Structural Engineer'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 2 THEN 'Certified Automotive Technician'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 3 THEN 'Master Electrician'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 4 THEN 'Polymer Engineering Specialist'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 5 THEN 'Textile Manufacturing Engineer'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 6 THEN 'General Contractor'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 7 THEN 'Certified Flooring Installer'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 8 THEN 'Professional Landscaper'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 9 THEN 'HVAC System Designer'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 10 THEN 'Mechanical Engineer'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 11 THEN 'Civil Engineering Consultant'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 12 THEN 'Professional Surveyor'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 13 THEN 'Kitchen & Bath Designer'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 14 THEN 'Solar Installation Specialist'
    ELSE 'Construction Project Manager'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 IN (1, 4, 5, 9, 10, 11) THEN 95 + (RANDOM() * 50)::integer -- Engineers
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 IN (2, 6, 12, 15) THEN 75 + (RANDOM() * 30)::integer -- Specialists/Managers
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 IN (3, 14) THEN 85 + (RANDOM() * 25)::integer -- Licensed trades
    ELSE 55 + (RANDOM() * 25)::integer -- Other trades
  END,
  3 + (RANDOM() * 20)::integer, -- 3-23 years experience
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 1 THEN 
      ARRAY['Structural Analysis', 'Steel Design', 'Concrete Design', 'Seismic Engineering', 'Building Codes']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 2 THEN 
      ARRAY['Engine Diagnostics', 'Transmission Repair', 'Brake Systems', 'Electrical Systems', 'Hybrid Technology']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 3 THEN 
      ARRAY['High Voltage Systems', 'Industrial Wiring', 'Motor Controls', 'Panel Installation', 'Code Compliance']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 4 THEN 
      ARRAY['Polymer Chemistry', 'Material Testing', 'Process Engineering', 'Quality Control', 'Product Development']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 5 THEN 
      ARRAY['Fabric Engineering', 'Dyeing Processes', 'Quality Testing', 'Production Planning', 'Fiber Technology']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 6 THEN 
      ARRAY['Project Management', 'Construction Scheduling', 'Budget Management', 'Safety Compliance', 'Team Leadership']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 7 THEN 
      ARRAY['Hardwood Installation', 'Laminate Flooring', 'Tile Installation', 'Carpet Installation', 'Floor Refinishing']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 8 THEN 
      ARRAY['Landscape Design', 'Irrigation Systems', 'Plant Selection', 'Hardscape Installation', 'Maintenance Planning']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 9 THEN 
      ARRAY['System Design', 'Load Calculations', 'Energy Efficiency', 'Duct Design', 'Control Systems']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 10 THEN 
      ARRAY['Machine Design', 'CAD Modeling', 'Manufacturing Processes', 'Materials Engineering', 'Quality Assurance']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 11 THEN 
      ARRAY['Site Planning', 'Infrastructure Design', 'Environmental Engineering', 'Traffic Engineering', 'Permitting']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 12 THEN 
      ARRAY['Boundary Surveys', 'Topographic Mapping', 'Construction Layout', 'GPS Technology', 'Legal Descriptions']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 13 THEN 
      ARRAY['Space Planning', 'Cabinet Design', 'Fixture Selection', 'Plumbing Layout', 'Electrical Planning']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 14 THEN 
      ARRAY['Solar Panel Installation', 'Electrical Integration', 'System Design', 'Permitting', 'Maintenance']
    ELSE 
      ARRAY['Project Coordination', 'Schedule Management', 'Quality Control', 'Safety Management', 'Cost Control']
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 1 THEN 
      ARRAY['PE License (Structural)', 'SEAOC Certification', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 2 THEN 
      ARRAY['ASE Certification', 'Automotive Service Excellence', 'Hybrid Vehicle Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 3 THEN 
      ARRAY['Master Electrician License', 'Industrial Electrical License', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 4 THEN 
      ARRAY['PE License (Chemical)', 'Polymer Engineering Certification', 'Quality Management Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 5 THEN 
      ARRAY['Textile Engineering Certification', 'Quality Control Certification', 'Manufacturing License']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 6 THEN 
      ARRAY['General Contractor License', 'PMP Certification', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 7 THEN 
      ARRAY['Flooring Installation Certification', 'NWFA Certification', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 8 THEN 
      ARRAY['Landscape Contractor License', 'Irrigation Certification', 'Pesticide License']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 9 THEN 
      ARRAY['PE License (Mechanical)', 'HVAC Design Certification', 'Energy Auditor Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 10 THEN 
      ARRAY['PE License (Mechanical)', 'Manufacturing Engineering Certification', 'Quality Management Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 11 THEN 
      ARRAY['PE License (Civil)', 'Traffic Engineering Certification', 'Environmental Engineering License']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 12 THEN 
      ARRAY['Professional Land Surveyor License', 'GPS Certification', 'Boundary Survey Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 13 THEN 
      ARRAY['Kitchen & Bath Design Certification', 'NKBA Certification', 'Interior Design License']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 = 14 THEN 
      ARRAY['Solar Installation Certification', 'NABCEP Certification', 'Electrical License']
    ELSE 
      ARRAY['Project Management Certification', 'Construction Management License', 'OSHA Certification']
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 IN (1, 4, 5, 9, 10, 11) THEN 
      ARRAY['Professional Engineering Certification', 'Advanced Technical Training']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 15 IN (6, 15) THEN 
      ARRAY['Project Management Professional', 'Leadership Training']
    ELSE 
      ARRAY['Trade Certification', 'Safety Training', 'Quality Assurance']
  END,
  CASE 
    WHEN RANDOM() < 0.8 THEN 'available'
    WHEN RANDOM() < 0.95 THEN 'busy'
    ELSE 'unavailable'
  END::availability_status,
  CASE 
    WHEN RANDOM() < 0.6 THEN 24
    WHEN RANDOM() < 0.85 THEN 12
    ELSE 6
  END,
  4.2 + (RANDOM() * 0.8), -- Rating between 4.2 and 5.0
  (8 + (RANDOM() * 35)::integer), -- 8-43 reviews
  (15 + (RANDOM() * 60)::integer) -- 15-75 completed projects
FROM profiles p
WHERE p.role = 'professional' 
  AND NOT EXISTS (
    SELECT 1 FROM professional_profiles pp WHERE pp.user_id = p.id
  )
LIMIT 15;

-- Insert sample projects for active job-professional pairs
INSERT INTO projects (
  job_id, hirer_id, professional_id, title, description, status,
  start_date, end_date, estimated_hours, total_budget, hourly_rate,
  completion_percentage
)
SELECT 
  j.id,
  j.hirer_id,
  pp.user_id,
  'Project: ' || j.title,
  'Active project based on job posting: ' || j.title || '. Working with professional to complete all requirements within timeline and budget.',
  CASE 
    WHEN RANDOM() < 0.6 THEN 'in_progress'
    WHEN RANDOM() < 0.8 THEN 'planning'
    ELSE 'on_hold'
  END::project_status,
  CURRENT_DATE - (RANDOM() * 60)::integer, -- Started 0-60 days ago
  CURRENT_DATE + (30 + (RANDOM() * 90)::integer), -- Ends 30-120 days from now
  40 + (RANDOM() * 160)::integer, -- 40-200 hours estimated
  CASE 
    WHEN j.salary_type = 'hourly' THEN 
      (40 + (RANDOM() * 160)::integer) * (j.salary_min + (RANDOM() * (COALESCE(j.salary_max, j.salary_min + 50) - j.salary_min)))
    ELSE 
      j.salary_min + (RANDOM() * (COALESCE(j.salary_max, j.salary_min + 10000) - j.salary_min))
  END,
  pp.hourly_rate,
  (RANDOM() * 80)::integer -- 0-80% completion
FROM jobs j
JOIN professional_profiles pp ON true
WHERE j.status = 'active'
  AND EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = pp.user_id AND p.role = 'professional'
  )
  AND RANDOM() < 0.15 -- Only 15% of job-professional combinations become projects
LIMIT 8;

-- Insert sample milestones for projects
INSERT INTO project_milestones (
  project_id, title, description, status, due_date, completion_percentage,
  payment_amount, display_order
)
SELECT 
  p.id,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 1 THEN 'Project Planning & Design'
    WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 2 THEN 'Material Procurement & Setup'
    WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 3 THEN 'Implementation Phase 1'
    WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 4 THEN 'Implementation Phase 2'
    WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 5 THEN 'Testing & Quality Assurance'
    ELSE 'Final Delivery & Documentation'
  END,
  'Milestone description for project phase completion with specific deliverables and quality requirements.',
  CASE 
    WHEN RANDOM() < 0.3 THEN 'completed'
    WHEN RANDOM() < 0.6 THEN 'in_progress'
    WHEN RANDOM() < 0.8 THEN 'pending'
    ELSE 'overdue'
  END::milestone_status,
  p.start_date + (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) * 15), -- Spaced 15 days apart
  CASE 
    WHEN RANDOM() < 0.3 THEN 100 -- Completed milestones
    ELSE (RANDOM() * 80)::integer -- Partial completion
  END,
  (p.total_budget / 4) + (RANDOM() * (p.total_budget / 6)), -- 25-40% of total budget per milestone
  ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM())
FROM projects p,
     generate_series(1, 3 + (RANDOM() * 3)::integer) -- 3-6 milestones per project
LIMIT 25;

-- Insert sample time entries for projects
INSERT INTO time_entries (
  project_id, professional_id, description, start_time, end_time,
  duration_minutes, hourly_rate, is_billable, entry_type
)
SELECT 
  p.id,
  p.professional_id,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 6 = 1 THEN 'Site preparation and material setup'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 6 = 2 THEN 'Installation and construction work'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 6 = 3 THEN 'Quality inspection and testing'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 6 = 4 THEN 'Client consultation and planning'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 6 = 5 THEN 'Documentation and reporting'
    ELSE 'Problem solving and troubleshooting'
  END,
  NOW() - (RANDOM() * 30 || ' days')::interval - (RANDOM() * 8 || ' hours')::interval,
  NOW() - (RANDOM() * 30 || ' days')::interval - (RANDOM() * 4 || ' hours')::interval,
  120 + (RANDOM() * 360)::integer, -- 2-8 hours
  p.hourly_rate,
  RANDOM() < 0.9, -- 90% billable
  CASE 
    WHEN RANDOM() < 0.7 THEN 'work'
    WHEN RANDOM() < 0.85 THEN 'meeting'
    WHEN RANDOM() < 0.95 THEN 'planning'
    ELSE 'review'
  END::time_entry_type
FROM projects p,
     generate_series(1, 5 + (RANDOM() * 10)::integer) -- 5-15 time entries per project
LIMIT 60;

-- Insert sample project updates
INSERT INTO project_updates (
  project_id, author_id, title, content, update_type, is_important
)
SELECT 
  p.id,
  CASE WHEN RANDOM() < 0.5 THEN p.hirer_id ELSE p.professional_id END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 1 THEN 'Project Progress Update'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 2 THEN 'Milestone Completion'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 3 THEN 'Schedule Adjustment'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 4 THEN 'Quality Inspection Results'
    ELSE 'Client Communication'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 1 THEN 'Project is progressing well according to schedule. All materials have been delivered and work is proceeding as planned. Expected completion remains on target.'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 2 THEN 'Successfully completed the current milestone ahead of schedule. Quality inspection passed with excellent results. Ready to proceed to next phase.'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 3 THEN 'Minor schedule adjustment needed due to weather conditions. Estimated delay of 2-3 days. Will make up time in subsequent phases.'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 4 THEN 'Quality inspection completed with outstanding results. All work meets or exceeds specifications. Client expressed high satisfaction with progress.'
    ELSE 'Regular client update provided. Discussed upcoming phases and addressed any questions. Client approval received for next milestone.'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 1 THEN 'status'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 2 THEN 'milestone'
    WHEN ROW_NUMBER() OVER (ORDER BY RANDOM()) % 5 = 3 THEN 'issue'
    ELSE 'general'
  END::update_type,
  RANDOM() < 0.2 -- 20% important updates
FROM projects p,
     generate_series(1, 2 + (RANDOM() * 4)::integer) -- 2-6 updates per project
LIMIT 30;

-- Insert sample saved searches
INSERT INTO saved_searches (
  user_id, name, search_type, criteria, is_alert_enabled, alert_frequency
)
SELECT 
  p.id,
  CASE 
    WHEN p.role = 'professional' THEN
      CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 4 = 1 THEN 'Electrical Engineering Jobs'
        WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 4 = 2 THEN 'Local Construction Projects'
        WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 4 = 3 THEN 'High-Paying HVAC Work'
        ELSE 'Remote Engineering Consulting'
      END
    ELSE
      CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 4 = 1 THEN 'Licensed Electricians'
        WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 4 = 2 THEN 'Experienced Plumbers'
        WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 4 = 3 THEN 'Certified Contractors'
        ELSE 'Local Professionals'
      END
  END,
  CASE WHEN p.role = 'professional' THEN 'jobs' ELSE 'professionals' END,
  CASE 
    WHEN p.role = 'professional' THEN
      jsonb_build_object(
        'category', 'engineering',
        'job_type', 'contract',
        'salary_min', 75,
        'remote_allowed', true
      )
    ELSE
      jsonb_build_object(
        'skills', ARRAY['Electrical Wiring', 'Plumbing', 'HVAC'],
        'availability_status', 'available',
        'rating_min', 4.0
      )
  END,
  RANDOM() < 0.6, -- 60% have alerts enabled
  CASE 
    WHEN RANDOM() < 0.5 THEN 'daily'
    WHEN RANDOM() < 0.8 THEN 'weekly'
    ELSE 'immediate'
  END
FROM profiles p
WHERE RANDOM() < 0.4 -- 40% of users have saved searches
LIMIT 20;

-- Update search_text fields for better search functionality
UPDATE jobs 
SET search_text = title || ' ' || description || ' ' || 
  COALESCE(array_to_string(required_skills, ' '), '') || ' ' ||
  COALESCE(array_to_string(required_licenses, ' '), '') || ' ' ||
  COALESCE(location, '')
WHERE search_text IS NULL;

UPDATE professional_profiles 
SET search_text = COALESCE(title, '') || ' ' || 
  COALESCE(array_to_string(skills, ' '), '') || ' ' ||
  COALESCE(array_to_string(licenses, ' '), '') || ' ' ||
  COALESCE(array_to_string(certifications, ' '), '')
WHERE search_text IS NULL;