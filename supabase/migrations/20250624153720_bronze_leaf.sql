/*
  # Sample Data for SeekCa Platform

  1. Sample Professional Profiles
    - Electrical Engineers
    - Plumbers
    - HVAC Technicians
    - Carpenters
    - Masons
    - Welders
    - Painters
    - Tilers
    - Roofers
    - Architects
    - Interior Designers
    - Surveyors

  2. Sample Jobs
    - Engineering projects
    - Construction work
    - Design projects
    - Maintenance tasks

  3. Sample Applications and Reviews
    - Professional applications to jobs
    - Client reviews and ratings
*/

-- Insert sample professional profiles (only if they don't exist)
INSERT INTO professional_profiles (
  user_id, title, hourly_rate, experience_years, skills, licenses, certifications,
  availability_status, response_time_hours, rating, total_reviews, completed_projects
)
SELECT 
  p.id,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 1 THEN 'Licensed Electrical Engineer'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 2 THEN 'Master Plumber'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 3 THEN 'HVAC Technician'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 4 THEN 'Master Carpenter'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 5 THEN 'Certified Mason'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 6 THEN 'Certified Welder'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 7 THEN 'Professional Painter'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 8 THEN 'Tile Installation Specialist'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 9 THEN 'Licensed Roofer'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 10 THEN 'Licensed Architect'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 11 THEN 'Interior Designer'
    ELSE 'Professional Land Surveyor'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 IN (1, 10, 12) THEN 85 + (RANDOM() * 40)::integer -- Engineers, Architects, Surveyors
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 IN (2, 3, 6) THEN 65 + (RANDOM() * 25)::integer -- Plumbers, HVAC, Welders
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 IN (4, 5, 9) THEN 55 + (RANDOM() * 20)::integer -- Carpenters, Masons, Roofers
    ELSE 45 + (RANDOM() * 20)::integer -- Painters, Tilers, Interior Designers
  END,
  5 + (RANDOM() * 15)::integer, -- 5-20 years experience
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 1 THEN 
      ARRAY['Electrical Wiring', 'Circuit Design', 'Power Systems', 'Motor Control', 'Code Compliance']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 2 THEN 
      ARRAY['Plumbing Installation', 'Pipe Fitting', 'Water Systems', 'Gas Lines', 'Drainage Systems']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 3 THEN 
      ARRAY['HVAC Installation', 'Air Conditioning', 'Heating Systems', 'Refrigeration', 'Ventilation']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 4 THEN 
      ARRAY['Carpentry', 'Framing', 'Finish Carpentry', 'Cabinet Making', 'Flooring']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 5 THEN 
      ARRAY['Masonry', 'Brickwork', 'Concrete Work', 'Stone Work', 'Foundation Work']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 6 THEN 
      ARRAY['Welding', 'Arc Welding', 'MIG Welding', 'TIG Welding', 'Fabrication']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 7 THEN 
      ARRAY['Painting', 'Interior Painting', 'Exterior Painting', 'Surface Preparation', 'Color Consultation']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 8 THEN 
      ARRAY['Tiling', 'Ceramic Tiling', 'Stone Tiling', 'Bathroom Renovation', 'Kitchen Backsplash']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 9 THEN 
      ARRAY['Roofing', 'Shingle Installation', 'Metal Roofing', 'Roof Repair', 'Gutter Installation']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 10 THEN 
      ARRAY['Architecture', 'Building Design', 'CAD Design', 'Structural Design', 'Permit Processing']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 11 THEN 
      ARRAY['Interior Design', 'Space Planning', 'Color Theory', 'Material Selection', 'Project Coordination']
    ELSE 
      ARRAY['Land Surveying', 'Construction Surveying', 'Boundary Surveys', 'Topographic Surveys', 'GPS Technology']
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 1 THEN 
      ARRAY['PE License (Professional Engineer)', 'Electrical License', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 2 THEN 
      ARRAY['Master Plumber License', 'Journeyman Plumber License', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 3 THEN 
      ARRAY['HVAC License', 'EPA Certification', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 4 THEN 
      ARRAY['Carpentry License', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 5 THEN 
      ARRAY['Masonry License', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 6 THEN 
      ARRAY['Welding Certification', 'AWS Certification', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 7 THEN 
      ARRAY['Painting Contractor License', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 8 THEN 
      ARRAY['Tiling Certification', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 9 THEN 
      ARRAY['Roofing License', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 10 THEN 
      ARRAY['Architecture License', 'NCARB Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 = 11 THEN 
      ARRAY['Interior Design License', 'NCIDQ Certification']
    ELSE 
      ARRAY['Professional Land Surveyor License', 'OSHA Certification']
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 IN (1, 10) THEN 
      ARRAY['Professional Engineer Certification', 'Project Management Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 12 IN (2, 3) THEN 
      ARRAY['Advanced Technical Certification', 'Safety Management Certification']
    ELSE 
      ARRAY['Trade Certification', 'Quality Assurance Certification']
  END,
  CASE 
    WHEN RANDOM() < 0.7 THEN 'available'
    WHEN RANDOM() < 0.9 THEN 'busy'
    ELSE 'unavailable'
  END::availability_status,
  CASE 
    WHEN RANDOM() < 0.5 THEN 24
    WHEN RANDOM() < 0.8 THEN 12
    ELSE 6
  END,
  4.0 + (RANDOM() * 1.0), -- Rating between 4.0 and 5.0
  (5 + (RANDOM() * 25)::integer), -- 5-30 reviews
  (10 + (RANDOM() * 40)::integer) -- 10-50 completed projects
FROM profiles p
WHERE p.role = 'professional' 
  AND NOT EXISTS (
    SELECT 1 FROM professional_profiles pp WHERE pp.user_id = p.id
  )
LIMIT 20;

-- Insert sample jobs for different categories
INSERT INTO jobs (
  hirer_id, title, description, category, job_type, location, remote_allowed,
  salary_type, salary_min, salary_max, required_skills, required_licenses,
  requirements, is_urgent, status
)
SELECT 
  h.id,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 1 THEN 'Electrical System Installation for New Office Building'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 2 THEN 'Complete Plumbing System for Residential Complex'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 3 THEN 'HVAC Installation for Commercial Warehouse'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 4 THEN 'Custom Kitchen Cabinet Installation'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 5 THEN 'Stone Masonry for Exterior Wall'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 6 THEN 'Structural Steel Welding Project'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 7 THEN 'Interior Painting for Office Renovation'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 8 THEN 'Bathroom Tile Installation'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 9 THEN 'Commercial Roof Replacement'
    ELSE 'Architectural Design for Residential Home'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 1 THEN 
      'We need a licensed electrical engineer to design and oversee the installation of a complete electrical system for our new 5-story office building. The project includes power distribution, lighting systems, emergency backup, and fire safety systems. Must comply with local building codes and safety regulations.'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 2 THEN 
      'Looking for a master plumber to install complete plumbing systems for a 20-unit residential complex. Work includes water supply lines, drainage systems, gas lines, and fixture installations. Project timeline is 3 months with potential for additional phases.'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 3 THEN 
      'Commercial warehouse requires complete HVAC system installation including heating, cooling, and ventilation for 50,000 sq ft space. Must be energy efficient and meet commercial building standards. Experience with large-scale commercial projects required.'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 4 THEN 
      'High-end residential kitchen renovation requiring custom cabinet installation. Includes design consultation, precise measurements, and installation of premium hardwood cabinets. Attention to detail and fine craftsmanship essential.'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 5 THEN 
      'Exterior stone masonry work for commercial building facade. Requires expertise in natural stone installation, mortar work, and weatherproofing. Must match existing architectural style and ensure structural integrity.'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 6 THEN 
      'Structural steel welding for industrial facility expansion. Requires certified welder with experience in heavy structural work. Must meet AWS standards and pass all required inspections. Safety certification mandatory.'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 7 THEN 
      'Professional interior painting for corporate office renovation. Includes surface preparation, primer application, and finish painting. Must work around business hours and maintain clean, professional work environment.'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 8 THEN 
      'Complete bathroom renovation requiring expert tile installation. Includes floor and wall tiling, waterproofing, and custom shower installation. High-quality materials and precision work required.'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 9 THEN 
      'Commercial roof replacement for 30,000 sq ft building. Requires licensed roofer with commercial experience. Includes tear-off, new membrane installation, and 10-year warranty. Weather-dependent timeline.'
    ELSE 
      'Architectural design services for custom residential home. Includes initial consultation, design development, construction drawings, and permit assistance. Modern design aesthetic with sustainable features preferred.'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 IN (1, 10) THEN 'engineering'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 IN (2, 3, 4, 5, 6, 7, 8, 9) THEN 'construction'
    ELSE 'design'
  END::job_category,
  CASE 
    WHEN RANDOM() < 0.4 THEN 'contract'
    WHEN RANDOM() < 0.7 THEN 'freelance'
    WHEN RANDOM() < 0.9 THEN 'full-time'
    ELSE 'part-time'
  END::job_type,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 5 = 1 THEN 'New York, NY'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 5 = 2 THEN 'Los Angeles, CA'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 5 = 3 THEN 'Chicago, IL'
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 5 = 4 THEN 'Houston, TX'
    ELSE 'Miami, FL'
  END,
  RANDOM() < 0.3, -- 30% remote allowed
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 IN (1, 10) THEN 'salary'
    ELSE 'hourly'
  END::salary_type,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 IN (1, 10) THEN 80000 + (RANDOM() * 40000)::integer
    ELSE 60 + (RANDOM() * 40)::integer
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 IN (1, 10) THEN 120000 + (RANDOM() * 50000)::integer
    ELSE 100 + (RANDOM() * 50)::integer
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 1 THEN 
      ARRAY['Electrical Design', 'Circuit Analysis', 'Power Systems', 'CAD Design', 'Code Compliance']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 2 THEN 
      ARRAY['Plumbing Installation', 'Pipe Fitting', 'Water Systems', 'Gas Lines', 'Code Compliance']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 3 THEN 
      ARRAY['HVAC Installation', 'Air Conditioning', 'Heating Systems', 'Energy Efficiency', 'Commercial Systems']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 4 THEN 
      ARRAY['Carpentry', 'Cabinet Making', 'Precision Measurement', 'Fine Woodworking', 'Installation']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 5 THEN 
      ARRAY['Masonry', 'Stone Work', 'Mortar Application', 'Structural Knowledge', 'Weatherproofing']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 6 THEN 
      ARRAY['Structural Welding', 'Steel Fabrication', 'AWS Standards', 'Safety Procedures', 'Quality Control']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 7 THEN 
      ARRAY['Interior Painting', 'Surface Preparation', 'Color Matching', 'Professional Finish', 'Clean Work']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 8 THEN 
      ARRAY['Tile Installation', 'Waterproofing', 'Precision Cutting', 'Grout Application', 'Design Layout']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 9 THEN 
      ARRAY['Commercial Roofing', 'Membrane Installation', 'Waterproofing', 'Safety Procedures', 'Warranty Work']
    ELSE 
      ARRAY['Architectural Design', 'CAD Software', 'Building Codes', 'Permit Process', 'Project Management']
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 1 THEN 
      ARRAY['PE License (Professional Engineer)', 'Electrical License']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 2 THEN 
      ARRAY['Master Plumber License', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 3 THEN 
      ARRAY['HVAC License', 'EPA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 4 THEN 
      ARRAY['Carpentry License', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 5 THEN 
      ARRAY['Masonry License', 'OSHA Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 6 THEN 
      ARRAY['Welding Certification', 'AWS Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 7 THEN 
      ARRAY['Painting Contractor License']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 8 THEN 
      ARRAY['Tiling Certification']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 9 THEN 
      ARRAY['Roofing License', 'OSHA Certification']
    ELSE 
      ARRAY['Architecture License', 'NCARB Certification']
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 1 THEN 
      ARRAY['Minimum 5 years electrical engineering experience', 'Experience with commercial projects', 'Knowledge of local building codes', 'Professional liability insurance']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 2 THEN 
      ARRAY['Minimum 7 years plumbing experience', 'Commercial plumbing experience', 'Own tools and equipment', 'Reliable transportation']
    WHEN ROW_NUMBER() OVER (ORDER BY h.created_at) % 10 = 3 THEN 
      ARRAY['Commercial HVAC experience required', 'Minimum 5 years experience', 'Energy efficiency knowledge', 'Professional references']
    ELSE 
      ARRAY['Relevant trade experience', 'Professional references', 'Own tools and equipment', 'Reliable and punctual']
  END,
  RANDOM() < 0.2, -- 20% urgent
  'active'::job_status
FROM profiles h
WHERE h.role = 'hirer'
LIMIT 15;

-- Insert sample portfolio items for professionals
INSERT INTO portfolio_items (
  professional_id, title, description, project_type, start_date, end_date,
  duration_months, client_name, project_value, location, skills_used, tools_used,
  challenges_overcome, results_achieved, client_testimonial, is_featured, is_public
)
SELECT 
  p.id,
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN 'Commercial Office Building Electrical System'
    WHEN pp.title ILIKE '%plumber%' THEN 'Luxury Hotel Plumbing Installation'
    WHEN pp.title ILIKE '%hvac%' THEN 'Hospital HVAC System Upgrade'
    WHEN pp.title ILIKE '%carpenter%' THEN 'Custom Home Kitchen Renovation'
    WHEN pp.title ILIKE '%mason%' THEN 'Historic Building Restoration'
    WHEN pp.title ILIKE '%welder%' THEN 'Industrial Bridge Construction'
    WHEN pp.title ILIKE '%painter%' THEN 'Corporate Headquarters Interior Painting'
    WHEN pp.title ILIKE '%tile%' THEN 'Luxury Spa Bathroom Installation'
    WHEN pp.title ILIKE '%roof%' THEN 'Shopping Mall Roof Replacement'
    WHEN pp.title ILIKE '%architect%' THEN 'Modern Residential Home Design'
    WHEN pp.title ILIKE '%interior%' THEN 'High-End Restaurant Interior Design'
    ELSE 'Commercial Property Survey'
  END,
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN 'Complete electrical system design and installation for a 10-story commercial office building. Included power distribution, lighting control systems, emergency backup power, and fire safety systems. Project required coordination with multiple contractors and strict adherence to building codes.'
    WHEN pp.title ILIKE '%plumber%' THEN 'Full plumbing system installation for a 200-room luxury hotel including guest rooms, kitchens, laundry facilities, and spa areas. Featured high-end fixtures, water recycling systems, and energy-efficient hot water distribution.'
    WHEN pp.title ILIKE '%hvac%' THEN 'Complete HVAC system upgrade for a 500-bed hospital facility. Included specialized air filtration for operating rooms, patient room climate control, and energy-efficient central plant systems. Critical timing to minimize disruption to hospital operations.'
    ELSE 'Professional project showcasing expertise in trade-specific skills and successful project completion with high client satisfaction.'
  END,
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN 'Commercial Electrical'
    WHEN pp.title ILIKE '%plumber%' THEN 'Commercial Plumbing'
    WHEN pp.title ILIKE '%hvac%' THEN 'Commercial HVAC'
    WHEN pp.title ILIKE '%carpenter%' THEN 'Residential Carpentry'
    WHEN pp.title ILIKE '%mason%' THEN 'Historic Restoration'
    WHEN pp.title ILIKE '%welder%' THEN 'Structural Welding'
    WHEN pp.title ILIKE '%painter%' THEN 'Commercial Painting'
    WHEN pp.title ILIKE '%tile%' THEN 'Luxury Tiling'
    WHEN pp.title ILIKE '%roof%' THEN 'Commercial Roofing'
    WHEN pp.title ILIKE '%architect%' THEN 'Residential Architecture'
    WHEN pp.title ILIKE '%interior%' THEN 'Commercial Interior Design'
    ELSE 'Professional Surveying'
  END,
  CURRENT_DATE - (30 + (RANDOM() * 365)::integer), -- Start date 1-13 months ago
  CURRENT_DATE - (RANDOM() * 30)::integer, -- End date 0-1 month ago
  1 + (RANDOM() * 12)::integer, -- 1-12 months duration
  CASE 
    WHEN RANDOM() < 0.7 THEN 'Commercial Client'
    ELSE 'Residential Client'
  END,
  25000 + (RANDOM() * 200000)::integer, -- $25k - $225k project value
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 5 = 1 THEN 'New York, NY'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 5 = 2 THEN 'Los Angeles, CA'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 5 = 3 THEN 'Chicago, IL'
    WHEN ROW_NUMBER() OVER (ORDER BY p.created_at) % 5 = 4 THEN 'Houston, TX'
    ELSE 'Miami, FL'
  END,
  pp.skills[1:3], -- Use first 3 skills
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN ARRAY['AutoCAD', 'Electrical Testing Equipment', 'Conduit Benders']
    WHEN pp.title ILIKE '%plumber%' THEN ARRAY['Pipe Threading Machine', 'Drain Cleaning Equipment', 'Pressure Testing Tools']
    WHEN pp.title ILIKE '%hvac%' THEN ARRAY['Refrigerant Recovery Unit', 'Duct Blaster', 'Digital Manifolds']
    ELSE ARRAY['Professional Tools', 'Measuring Equipment', 'Safety Gear']
  END,
  'Project required careful coordination with multiple stakeholders and strict adherence to safety protocols. Weather delays and material supply issues required creative problem-solving and schedule adjustments.',
  'Successfully completed project on time and within budget. Client reported 100% satisfaction with quality of work. All inspections passed on first attempt. Project became a reference for future similar work.',
  '"Outstanding professional work. The attention to detail and commitment to quality exceeded our expectations. Would definitely hire again for future projects."',
  RANDOM() < 0.3, -- 30% featured
  true
FROM profiles p
JOIN professional_profiles pp ON pp.user_id = p.id
WHERE p.role = 'professional'
LIMIT 15;

-- Insert sample reviews for professionals
INSERT INTO reviews (
  job_id, reviewer_id, reviewee_id, rating, title, comment,
  skills_rating, communication_rating, timeliness_rating, professionalism_rating,
  would_recommend, is_public
)
SELECT 
  j.id,
  j.hirer_id,
  pp.user_id,
  4 + (RANDOM())::integer, -- 4-5 star ratings
  CASE 
    WHEN (4 + (RANDOM())::integer) = 5 THEN 'Excellent Work - Highly Recommended'
    ELSE 'Good Quality Professional Work'
  END,
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN 'Professional electrical work completed to high standards. All code requirements met and project finished on schedule. Would hire again for future electrical projects.'
    WHEN pp.title ILIKE '%plumber%' THEN 'Expert plumbing installation with attention to detail. Clean work area and professional communication throughout the project. Very satisfied with the results.'
    WHEN pp.title ILIKE '%hvac%' THEN 'HVAC system installation exceeded expectations. Energy efficient and quiet operation. Professional explained everything clearly and provided excellent service.'
    ELSE 'High quality professional work completed on time and within budget. Excellent communication and attention to detail throughout the project.'
  END,
  4 + (RANDOM())::integer, -- Skills rating
  4 + (RANDOM())::integer, -- Communication rating
  4 + (RANDOM())::integer, -- Timeliness rating
  4 + (RANDOM())::integer, -- Professionalism rating
  RANDOM() < 0.9, -- 90% would recommend
  true
FROM jobs j
JOIN professional_profiles pp ON true
WHERE j.status = 'active'
  AND EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = pp.user_id AND p.role = 'professional'
  )
  AND RANDOM() < 0.3 -- Only 30% of job-professional combinations get reviews
LIMIT 25;

-- Update professional ratings based on reviews
UPDATE professional_profiles 
SET 
  rating = subquery.avg_rating,
  total_reviews = subquery.review_count
FROM (
  SELECT 
    r.reviewee_id,
    ROUND(AVG(r.rating), 1) as avg_rating,
    COUNT(*) as review_count
  FROM reviews r
  WHERE r.is_public = true
  GROUP BY r.reviewee_id
) subquery
WHERE professional_profiles.user_id = subquery.reviewee_id;