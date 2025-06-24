/*
  # Update Professional Skills Data

  1. Data Updates
    - Update existing professional profiles with handwork/engineering skills
    - Update job postings with relevant professional skills
    - Add sample data for professional trades

  2. Sample Skills
    - Electrical engineering and installation
    - Plumbing and pipe fitting
    - HVAC systems
    - Carpentry and woodworking
    - Masonry and concrete work
    - Welding and fabrication
    - Painting and finishing
    - Tiling and flooring
    - Roofing
    - Architecture and design
    - Surveying
    - Interior design
*/

-- Update sample professional skills to focus on handwork and engineering
UPDATE professional_profiles 
SET skills = CASE 
  WHEN id = (SELECT id FROM professional_profiles LIMIT 1 OFFSET 0) THEN 
    ARRAY['Electrical Wiring', 'Circuit Design', 'Power Systems', 'Motor Control', 'Code Compliance']
  WHEN id = (SELECT id FROM professional_profiles LIMIT 1 OFFSET 1) THEN 
    ARRAY['Plumbing Installation', 'Pipe Fitting', 'Water Systems', 'Gas Lines', 'Drainage Systems']
  WHEN id = (SELECT id FROM professional_profiles LIMIT 1 OFFSET 2) THEN 
    ARRAY['HVAC Installation', 'Air Conditioning', 'Heating Systems', 'Refrigeration', 'Ventilation']
  WHEN id = (SELECT id FROM professional_profiles LIMIT 1 OFFSET 3) THEN 
    ARRAY['Carpentry', 'Framing', 'Finish Carpentry', 'Cabinet Making', 'Flooring']
  WHEN id = (SELECT id FROM professional_profiles LIMIT 1 OFFSET 4) THEN 
    ARRAY['Masonry', 'Brickwork', 'Concrete Work', 'Stone Work', 'Foundation Work']
  WHEN id = (SELECT id FROM professional_profiles LIMIT 1 OFFSET 5) THEN 
    ARRAY['Welding', 'Arc Welding', 'MIG Welding', 'TIG Welding', 'Fabrication']
  WHEN id = (SELECT id FROM professional_profiles LIMIT 1 OFFSET 6) THEN 
    ARRAY['Painting', 'Interior Painting', 'Exterior Painting', 'Surface Preparation', 'Color Consultation']
  WHEN id = (SELECT id FROM professional_profiles LIMIT 1 OFFSET 7) THEN 
    ARRAY['Tiling', 'Ceramic Tiling', 'Stone Tiling', 'Bathroom Renovation', 'Kitchen Backsplash']
  WHEN id = (SELECT id FROM professional_profiles LIMIT 1 OFFSET 8) THEN 
    ARRAY['Roofing', 'Shingle Installation', 'Metal Roofing', 'Roof Repair', 'Gutter Installation']
  WHEN id = (SELECT id FROM professional_profiles LIMIT 1 OFFSET 9) THEN 
    ARRAY['Architecture', 'Building Design', 'CAD Design', 'Structural Design', 'Permit Processing']
  ELSE 
    ARRAY['Project Management', 'Construction Management', 'Quality Control', 'Safety Management', 'Blueprint Reading']
END
WHERE skills IS NOT NULL;

-- Update job required skills to focus on professional trades
UPDATE jobs 
SET required_skills = CASE 
  WHEN category = 'engineering' THEN 
    ARRAY['Electrical Design', 'Circuit Analysis', 'Power Systems', 'CAD Design', 'Code Compliance']
  WHEN category = 'construction' THEN 
    ARRAY['Blueprint Reading', 'Construction Management', 'Safety Management', 'Quality Control', 'Project Coordination']
  WHEN category = 'design' THEN 
    ARRAY['Space Planning', 'Interior Design', 'Color Theory', 'Material Selection', 'CAD Design']
  WHEN category = 'real-estate' THEN 
    ARRAY['Property Management', 'Real Estate Law', 'Market Analysis', 'Property Valuation', 'Contract Negotiation']
  WHEN category = 'project-management' THEN 
    ARRAY['Project Planning', 'Resource Management', 'Risk Assessment', 'Quality Assurance', 'Team Leadership']
  ELSE 
    ARRAY['Professional Skills', 'Technical Expertise', 'Problem Solving', 'Communication', 'Time Management']
END
WHERE required_skills IS NOT NULL;

-- Update job required licenses to focus on professional trades
UPDATE jobs 
SET required_licenses = CASE 
  WHEN category = 'engineering' THEN 
    ARRAY['PE License (Professional Engineer)', 'Electrical License', 'OSHA Certification']
  WHEN category = 'construction' THEN 
    ARRAY['General Contractor License', 'OSHA Certification', 'Construction Supervisor License']
  WHEN category = 'design' THEN 
    ARRAY['Interior Design License', 'NCIDQ Certification', 'Architecture License']
  WHEN category = 'real-estate' THEN 
    ARRAY['Real Estate License', 'Property Management License']
  ELSE 
    ARRAY['Professional License', 'OSHA Certification']
END
WHERE required_licenses IS NOT NULL;

-- Update professional titles to reflect handwork and engineering roles
UPDATE professional_profiles 
SET title = CASE 
  WHEN title ILIKE '%software%' OR title ILIKE '%developer%' OR title ILIKE '%programmer%' THEN 
    'Electrical Engineer'
  WHEN title ILIKE '%marketing%' OR title ILIKE '%sales%' THEN 
    'Project Manager'
  WHEN title ILIKE '%design%' AND title NOT ILIKE '%interior%' THEN 
    'Interior Designer'
  WHEN title ILIKE '%manager%' AND title NOT ILIKE '%project%' THEN 
    'Construction Manager'
  WHEN title IS NULL OR title = '' THEN 
    'Professional Contractor'
  ELSE 
    title
END;

-- Add sample professional licenses
UPDATE professional_profiles 
SET licenses = CASE 
  WHEN title ILIKE '%electrical%' OR title ILIKE '%engineer%' THEN 
    ARRAY['PE License (Professional Engineer)', 'Electrical License', 'OSHA Certification']
  WHEN title ILIKE '%plumber%' THEN 
    ARRAY['Master Plumber License', 'Journeyman Plumber License', 'OSHA Certification']
  WHEN title ILIKE '%hvac%' THEN 
    ARRAY['HVAC License', 'EPA Certification', 'OSHA Certification']
  WHEN title ILIKE '%carpenter%' THEN 
    ARRAY['Carpentry License', 'OSHA Certification']
  WHEN title ILIKE '%mason%' THEN 
    ARRAY['Masonry License', 'OSHA Certification']
  WHEN title ILIKE '%welder%' THEN 
    ARRAY['Welding Certification', 'AWS Certification', 'OSHA Certification']
  WHEN title ILIKE '%painter%' THEN 
    ARRAY['Painting Contractor License', 'OSHA Certification']
  WHEN title ILIKE '%tile%' THEN 
    ARRAY['Tiling Certification', 'OSHA Certification']
  WHEN title ILIKE '%roof%' THEN 
    ARRAY['Roofing License', 'OSHA Certification']
  WHEN title ILIKE '%architect%' THEN 
    ARRAY['Architecture License', 'NCARB Certification']
  WHEN title ILIKE '%interior%' THEN 
    ARRAY['Interior Design License', 'NCIDQ Certification']
  WHEN title ILIKE '%survey%' THEN 
    ARRAY['Professional Land Surveyor License', 'OSHA Certification']
  ELSE 
    ARRAY['Professional License', 'OSHA Certification']
END
WHERE licenses IS NULL OR array_length(licenses, 1) IS NULL;