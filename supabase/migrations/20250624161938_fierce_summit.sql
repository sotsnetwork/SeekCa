/*
  # Sample Portfolio Items and Reviews
  
  1. New Data
    - Add portfolio items for professionals
    - Add reviews for professionals
    - Add review responses and helpful votes
    - Update professional ratings based on reviews
  
  2. Purpose
    - Provides sample data for the portfolio and review features
    - Creates realistic professional profiles with work examples
    - Demonstrates the review and rating system
*/

-- Insert sample portfolio items for professionals
INSERT INTO portfolio_items (
  professional_id, title, description, project_type, start_date, end_date,
  duration_months, client_name, project_value, location, skills_used, tools_used,
  featured_image_url, image_urls, challenges_overcome, results_achieved, 
  client_testimonial, is_featured, is_public, display_order
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
    ELSE 'Professional project showcasing expertise in trade-specific skills and successful project completion with high client satisfaction. Completed on time and within budget with excellent attention to detail and craftsmanship.'
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
  CURRENT_DATE - INTERVAL '6 months',
  CURRENT_DATE - INTERVAL '1 month',
  5,
  'Commercial Client',
  75000,
  'New York, NY',
  CASE 
    WHEN array_length(pp.skills, 1) >= 3 THEN pp.skills[1:3]
    ELSE pp.skills
  END,
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN ARRAY['AutoCAD', 'Electrical Testing Equipment', 'Conduit Benders']
    WHEN pp.title ILIKE '%plumber%' THEN ARRAY['Pipe Threading Machine', 'Drain Cleaning Equipment', 'Pressure Testing Tools']
    WHEN pp.title ILIKE '%hvac%' THEN ARRAY['Refrigerant Recovery Unit', 'Duct Blaster', 'Digital Manifolds']
    ELSE ARRAY['Professional Tools', 'Measuring Equipment', 'Safety Gear']
  END,
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    WHEN pp.title ILIKE '%plumber%' THEN 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    WHEN pp.title ILIKE '%hvac%' THEN 'https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    WHEN pp.title ILIKE '%carpenter%' THEN 'https://images.pexels.com/photos/3637786/pexels-photo-3637786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    WHEN pp.title ILIKE '%mason%' THEN 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    WHEN pp.title ILIKE '%welder%' THEN 'https://images.pexels.com/photos/4491881/pexels-photo-4491881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    WHEN pp.title ILIKE '%painter%' THEN 'https://images.pexels.com/photos/6444256/pexels-photo-6444256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    WHEN pp.title ILIKE '%tile%' THEN 'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    WHEN pp.title ILIKE '%roof%' THEN 'https://images.pexels.com/photos/5971353/pexels-photo-5971353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    WHEN pp.title ILIKE '%architect%' THEN 'https://images.pexels.com/photos/5417636/pexels-photo-5417636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    WHEN pp.title ILIKE '%interior%' THEN 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ELSE 'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  END,
  ARRAY[
    'https://images.pexels.com/photos/8961438/pexels-photo-8961438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/8961441/pexels-photo-8961441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ],
  'Project required careful coordination with multiple stakeholders and strict adherence to safety protocols. Weather delays and material supply issues required creative problem-solving and schedule adjustments.',
  'Successfully completed project on time and within budget. Client reported 100% satisfaction with quality of work. All inspections passed on first attempt. Project became a reference for future similar work.',
  '"Outstanding professional work. The attention to detail and commitment to quality exceeded our expectations. Would definitely hire again for future projects."',
  true,
  true,
  1
FROM profiles p
JOIN professional_profiles pp ON pp.user_id = p.id
WHERE p.role = 'professional'
  AND NOT EXISTS (
    SELECT 1 FROM portfolio_items pi WHERE pi.professional_id = p.id
  )
LIMIT 10;

-- Insert second portfolio item for some professionals
INSERT INTO portfolio_items (
  professional_id, title, description, project_type, start_date, end_date,
  duration_months, client_name, project_value, location, skills_used, tools_used,
  featured_image_url, image_urls, challenges_overcome, results_achieved, 
  client_testimonial, is_featured, is_public, display_order
)
SELECT 
  p.id,
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN 'Industrial Factory Power System Upgrade'
    WHEN pp.title ILIKE '%plumber%' THEN 'Commercial Kitchen Plumbing Installation'
    WHEN pp.title ILIKE '%hvac%' THEN 'Office Building HVAC Replacement'
    WHEN pp.title ILIKE '%carpenter%' THEN 'Custom Built-in Bookshelves'
    WHEN pp.title ILIKE '%mason%' THEN 'Outdoor Stone Fireplace Construction'
    WHEN pp.title ILIKE '%welder%' THEN 'Custom Metal Staircase Fabrication'
    WHEN pp.title ILIKE '%painter%' THEN 'Historic Building Exterior Restoration'
    WHEN pp.title ILIKE '%tile%' THEN 'Commercial Lobby Floor Installation'
    WHEN pp.title ILIKE '%roof%' THEN 'Residential Complex Roof Installation'
    WHEN pp.title ILIKE '%architect%' THEN 'Commercial Office Space Redesign'
    WHEN pp.title ILIKE '%interior%' THEN 'Luxury Home Interior Design'
    ELSE 'Residential Property Boundary Survey'
  END,
  'Major renovation project requiring specialized technical expertise and careful coordination with other trades. Worked closely with the client to understand their specific needs and delivered a solution that exceeded expectations while maintaining budget constraints.',
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN 'Industrial Electrical'
    WHEN pp.title ILIKE '%plumber%' THEN 'Commercial Plumbing'
    WHEN pp.title ILIKE '%hvac%' THEN 'Commercial HVAC'
    WHEN pp.title ILIKE '%carpenter%' THEN 'Custom Carpentry'
    WHEN pp.title ILIKE '%mason%' THEN 'Residential Masonry'
    WHEN pp.title ILIKE '%welder%' THEN 'Custom Fabrication'
    WHEN pp.title ILIKE '%painter%' THEN 'Restoration Painting'
    WHEN pp.title ILIKE '%tile%' THEN 'Commercial Tiling'
    WHEN pp.title ILIKE '%roof%' THEN 'Residential Roofing'
    WHEN pp.title ILIKE '%architect%' THEN 'Commercial Architecture'
    WHEN pp.title ILIKE '%interior%' THEN 'Residential Interior Design'
    ELSE 'Residential Surveying'
  END,
  CURRENT_DATE - INTERVAL '12 months',
  CURRENT_DATE - INTERVAL '8 months',
  4,
  'Residential Client',
  45000,
  'Los Angeles, CA',
  CASE 
    WHEN array_length(pp.skills, 1) >= 3 THEN pp.skills[1:3]
    ELSE pp.skills
  END,
  ARRAY['Professional Tools', 'Measuring Equipment', 'Safety Gear'],
  'https://images.pexels.com/photos/6419135/pexels-photo-6419135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ARRAY[
    'https://images.pexels.com/photos/6419146/pexels-photo-6419146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/4489752/pexels-photo-4489752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ],
  'Complex project with unique requirements that demanded innovative solutions and careful attention to detail.',
  'Delivered exceptional results that exceeded client expectations. Project completed ahead of schedule with outstanding quality.',
  '"Exceptional craftsmanship and professional service. Highly recommend for any similar projects."',
  false,
  true,
  2
FROM profiles p
JOIN professional_profiles pp ON pp.user_id = p.id
WHERE p.role = 'professional'
  AND EXISTS (
    SELECT 1 FROM portfolio_items pi WHERE pi.professional_id = p.id
  )
LIMIT 5;

-- Create sample jobs for review generation if needed
INSERT INTO jobs (
  hirer_id, title, description, category, job_type, location, 
  salary_type, salary_min, salary_max, required_skills, status
)
SELECT 
  p.id,
  'Sample Project for ' || COALESCE(p.company_name, 'Company'),
  'Sample project description for review generation purposes.',
  'construction',
  'contract',
  'Various Locations',
  'project',
  50000,
  100000,
  ARRAY['Professional Skills'],
  'active'
FROM profiles p
WHERE p.role = 'hirer'
  AND NOT EXISTS (SELECT 1 FROM jobs j WHERE j.hirer_id = p.id)
LIMIT 5;

-- Insert sample reviews for professionals
INSERT INTO reviews (
  job_id, reviewer_id, reviewee_id, rating, title, comment,
  skills_rating, communication_rating, timeliness_rating, professionalism_rating,
  would_recommend, is_public, helpful_count
)
SELECT 
  j.id,
  j.hirer_id,
  pp.user_id,
  5, -- 5 star rating
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN 'Exceptional Electrical Work - Highly Recommended'
    WHEN pp.title ILIKE '%plumber%' THEN 'Outstanding Plumbing Services'
    WHEN pp.title ILIKE '%hvac%' THEN 'Top-Notch HVAC Installation'
    WHEN pp.title ILIKE '%carpenter%' THEN 'Masterful Carpentry Work'
    WHEN pp.title ILIKE '%mason%' THEN 'Excellent Masonry Craftsmanship'
    WHEN pp.title ILIKE '%welder%' THEN 'Superior Welding Quality'
    WHEN pp.title ILIKE '%painter%' THEN 'Flawless Painting Job'
    WHEN pp.title ILIKE '%tile%' THEN 'Perfect Tile Installation'
    WHEN pp.title ILIKE '%roof%' THEN 'Excellent Roofing Work'
    WHEN pp.title ILIKE '%architect%' THEN 'Brilliant Architectural Design'
    WHEN pp.title ILIKE '%interior%' THEN 'Stunning Interior Design'
    ELSE 'Excellent Professional Service'
  END,
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN 'Professional electrical work completed to high standards. All code requirements met and project finished on schedule. The wiring was neat and organized, and all systems function perfectly. Would hire again for future electrical projects.'
    WHEN pp.title ILIKE '%plumber%' THEN 'Expert plumbing installation with attention to detail. Clean work area and professional communication throughout the project. All fixtures were installed perfectly and there have been no leaks or issues. Very satisfied with the results.'
    WHEN pp.title ILIKE '%hvac%' THEN 'HVAC system installation exceeded expectations. Energy efficient and quiet operation. Professional explained everything clearly and provided excellent service. The system has been running perfectly and our energy bills have decreased.'
    WHEN pp.title ILIKE '%carpenter%' THEN 'Exceptional carpentry work with outstanding attention to detail. The finished product looks beautiful and the craftsmanship is evident in every aspect. Clean work site and excellent communication throughout the project.'
    WHEN pp.title ILIKE '%mason%' THEN 'Excellent masonry work that transformed our property. The stonework is beautiful and has received many compliments. Professional was knowledgeable, skilled, and maintained a clean work area throughout the project.'
    WHEN pp.title ILIKE '%welder%' THEN 'High-quality welding work completed with precision and care. The structural integrity is excellent and the finish is clean and professional. All safety standards were followed and the project was completed on schedule.'
    WHEN pp.title ILIKE '%painter%' THEN 'Flawless painting job with excellent attention to detail. The preparation work was thorough and the finish is smooth and even. No drips, spills, or missed spots. Very professional service from start to finish.'
    WHEN pp.title ILIKE '%tile%' THEN 'Beautiful tile installation that transformed our space. The pattern alignment is perfect and the grouting is clean and even. Professional was meticulous and took the time to ensure everything was done right.'
    WHEN pp.title ILIKE '%roof%' THEN 'Excellent roofing work completed efficiently and professionally. No leaks even during heavy rain, and the roof looks great. The crew was respectful of our property and cleaned up thoroughly after completion.'
    WHEN pp.title ILIKE '%architect%' THEN 'Brilliant architectural design that perfectly captured our vision. The plans were detailed and comprehensive, making the construction process smooth. Professional was responsive to our needs and made excellent suggestions.'
    WHEN pp.title ILIKE '%interior%' THEN 'Stunning interior design that transformed our space. The color palette, furniture selection, and layout are perfect. Professional listened to our preferences and created a design that exceeded our expectations.'
    ELSE 'High quality professional work completed on time and within budget. Excellent communication and attention to detail throughout the project. Would definitely hire again for future projects.'
  END,
  5, -- Skills rating
  5, -- Communication rating
  5, -- Timeliness rating
  5, -- Professionalism rating
  true, -- Would recommend
  true, -- Is public
  0 -- Initial helpful count
FROM jobs j
JOIN professional_profiles pp ON true
WHERE j.status = 'active'
  AND EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = pp.user_id AND p.role = 'professional'
  )
  AND NOT EXISTS (
    SELECT 1 FROM reviews r 
    WHERE r.job_id = j.id AND r.reviewee_id = pp.user_id
  )
LIMIT 10;

-- Add some 4-star reviews
INSERT INTO reviews (
  job_id, reviewer_id, reviewee_id, rating, title, comment,
  skills_rating, communication_rating, timeliness_rating, professionalism_rating,
  would_recommend, is_public, helpful_count
)
SELECT 
  j.id,
  j.hirer_id,
  pp.user_id,
  4, -- 4 star rating
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN 'Quality Electrical Work'
    WHEN pp.title ILIKE '%plumber%' THEN 'Reliable Plumbing Service'
    WHEN pp.title ILIKE '%hvac%' THEN 'Good HVAC Installation'
    WHEN pp.title ILIKE '%carpenter%' THEN 'Solid Carpentry Work'
    WHEN pp.title ILIKE '%mason%' THEN 'Good Masonry Work'
    WHEN pp.title ILIKE '%welder%' THEN 'Quality Welding Service'
    WHEN pp.title ILIKE '%painter%' THEN 'Good Painting Job'
    WHEN pp.title ILIKE '%tile%' THEN 'Good Tile Installation'
    WHEN pp.title ILIKE '%roof%' THEN 'Reliable Roofing Work'
    WHEN pp.title ILIKE '%architect%' THEN 'Good Architectural Design'
    WHEN pp.title ILIKE '%interior%' THEN 'Nice Interior Design'
    ELSE 'Good Professional Service'
  END,
  'Good quality work completed professionally. Minor delays but overall satisfied with the results. Would consider hiring again for future projects. Communication could have been better but the final product met expectations.',
  4, -- Skills rating
  4, -- Communication rating
  4, -- Timeliness rating
  4, -- Professionalism rating
  true, -- Would recommend
  true, -- Is public
  0 -- Initial helpful count
FROM jobs j
JOIN professional_profiles pp ON true
WHERE j.status = 'active'
  AND EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = pp.user_id AND p.role = 'professional'
  )
  AND NOT EXISTS (
    SELECT 1 FROM reviews r 
    WHERE r.job_id = j.id AND r.reviewee_id = pp.user_id
  )
LIMIT 5;

-- Add some review responses
INSERT INTO review_responses (
  review_id, responder_id, response_text
)
SELECT 
  r.id,
  r.reviewee_id,
  CASE 
    WHEN r.rating = 5 THEN 'Thank you so much for your kind words! It was a pleasure working on your project. I take great pride in my work and I''m thrilled that you''re satisfied with the results. I look forward to working with you again on future projects!'
    ELSE 'Thank you for your feedback. I appreciate you taking the time to share your experience. I''m glad you were satisfied with the work overall, and I''ll keep your suggestions in mind for future projects. Please don''t hesitate to reach out if you need any assistance with the completed work.'
  END
FROM reviews r
WHERE NOT EXISTS (
  SELECT 1 FROM review_responses rr WHERE rr.review_id = r.id
)
LIMIT 5;

-- Add helpful votes to reviews
INSERT INTO review_helpful_votes (
  review_id, voter_id, is_helpful
)
SELECT 
  r.id,
  p.id,
  true -- Mark as helpful
FROM reviews r
JOIN profiles p ON p.id != r.reviewer_id AND p.id != r.reviewee_id
WHERE NOT EXISTS (
  SELECT 1 FROM review_helpful_votes v WHERE v.review_id = r.id AND v.voter_id = p.id
)
LIMIT 10;

-- Update review helpful counts
UPDATE reviews r
SET helpful_count = (
  SELECT COUNT(*)
  FROM review_helpful_votes v
  WHERE v.review_id = r.id AND v.is_helpful = true
);

-- Update professional ratings based on reviews
UPDATE professional_profiles 
SET 
  rating = subquery.avg_rating,
  total_reviews = subquery.review_count
FROM (
  SELECT 
    r.reviewee_id,
    ROUND(AVG(r.rating::numeric), 1) as avg_rating,
    COUNT(*) as review_count
  FROM reviews r
  WHERE r.is_public = true
  GROUP BY r.reviewee_id
) subquery
WHERE professional_profiles.user_id = subquery.reviewee_id;

-- Update completed projects count for professionals
UPDATE professional_profiles 
SET completed_projects = (
  SELECT COUNT(*)
  FROM reviews r
  WHERE r.reviewee_id = professional_profiles.user_id
);