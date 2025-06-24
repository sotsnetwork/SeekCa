/*
  # Portfolio and Review Sample Data

  1. Schema Updates
    - Add missing helpful_count column to reviews table
    - Add missing image_urls column to portfolio_items table
    
  2. Sample Data
    - Portfolio items for professionals
    - Sample jobs for review generation
    - Reviews with ratings and comments
    - Review responses
    - Helpful votes
    - Updated professional ratings
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add helpful_count column to reviews table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'helpful_count'
  ) THEN
    ALTER TABLE reviews ADD COLUMN helpful_count integer DEFAULT 0;
  END IF;
  
  -- Add image_urls column to portfolio_items table if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'portfolio_items' AND column_name = 'image_urls'
  ) THEN
    ALTER TABLE portfolio_items ADD COLUMN image_urls text[] DEFAULT '{}';
  END IF;
END $$;

-- Insert sample portfolio items for professionals
INSERT INTO portfolio_items (
  professional_id, title, description, project_type, start_date, end_date,
  duration_months, client_name, project_value, location, skills_used, tools_used,
  featured_image_url, image_urls, challenges_overcome, results_achieved, 
  client_testimonial, is_featured, is_public, display_order
) VALUES
-- Electrical professional portfolio
((SELECT id FROM profiles WHERE role = 'professional' AND first_name = 'John' LIMIT 1),
 'Commercial Office Building Electrical System',
 'Complete electrical system design and installation for a 10-story commercial office building. Included power distribution, lighting control systems, emergency backup power, and fire safety systems.',
 'Commercial Electrical',
 '2024-01-15',
 '2024-06-15',
 5,
 'Metro Properties LLC',
 125000,
 'New York, NY',
 ARRAY['Electrical Design', 'Code Compliance', 'Project Management'],
 ARRAY['AutoCAD', 'Electrical Testing Equipment', 'Conduit Benders'],
 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
 ARRAY[
   'https://images.pexels.com/photos/8961438/pexels-photo-8961438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
   'https://images.pexels.com/photos/8961441/pexels-photo-8961441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
 ],
 'Project required careful coordination with multiple stakeholders and strict adherence to safety protocols.',
 'Successfully completed project on time and within budget. All inspections passed on first attempt.',
 'Outstanding professional work. The attention to detail exceeded our expectations.',
 true,
 true,
 1),

-- Add a second portfolio item for the same professional
((SELECT id FROM profiles WHERE role = 'professional' AND first_name = 'John' LIMIT 1),
 'Industrial Factory Power System Upgrade',
 'Major electrical upgrade for manufacturing facility including new power distribution panels and motor control centers.',
 'Industrial Electrical',
 '2023-08-01',
 '2023-12-01',
 4,
 'Industrial Manufacturing Corp',
 85000,
 'Chicago, IL',
 ARRAY['Industrial Electrical', 'Motor Controls', 'Safety Systems'],
 ARRAY['Multimeter', 'Power Quality Analyzer', 'Thermal Imaging'],
 'https://images.pexels.com/photos/8961438/pexels-photo-8961438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
 ARRAY[
   'https://images.pexels.com/photos/4489752/pexels-photo-4489752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
 ],
 'Complex project with tight deadlines and minimal downtime requirements.',
 'Completed upgrade with zero production downtime. Improved energy efficiency by 15%.',
 'Exceptional work quality and professional service throughout the project.',
 false,
 true,
 2);

-- Insert portfolio items for other professionals (only if they exist)
DO $$
DECLARE
  sarah_id uuid;
  mike_id uuid;
BEGIN
  -- Get Sarah's ID if she exists
  SELECT id INTO sarah_id FROM profiles WHERE role = 'professional' AND first_name = 'Sarah' LIMIT 1;
  
  -- Get Mike's ID if he exists  
  SELECT id INTO mike_id FROM profiles WHERE role = 'professional' AND first_name = 'Mike' LIMIT 1;
  
  -- Insert Sarah's portfolio if she exists
  IF sarah_id IS NOT NULL THEN
    INSERT INTO portfolio_items (
      professional_id, title, description, project_type, start_date, end_date,
      duration_months, client_name, project_value, location, skills_used, tools_used,
      featured_image_url, image_urls, challenges_overcome, results_achieved, 
      client_testimonial, is_featured, is_public, display_order
    ) VALUES
    (sarah_id,
     'Luxury Hotel Plumbing Installation',
     'Complete plumbing system for 200-room luxury hotel including guest rooms, kitchens, and spa facilities.',
     'Commercial Plumbing',
     '2024-02-01',
     '2024-07-01',
     5,
     'Luxury Hotels Group',
     95000,
     'Miami, FL',
     ARRAY['Commercial Plumbing', 'Fixture Installation', 'Water Systems'],
     ARRAY['Pipe Threading Machine', 'Pressure Testing Tools', 'Drain Cleaning Equipment'],
     'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
     ARRAY[
       'https://images.pexels.com/photos/6419135/pexels-photo-6419135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
       'https://images.pexels.com/photos/6419146/pexels-photo-6419146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
     ],
     'Complex coordination with multiple trades and strict quality standards.',
     'Zero leaks or callbacks. Hotel opened on schedule with perfect plumbing systems.',
     'Flawless installation and professional service. Highly recommended.',
     true,
     true,
     1);
  END IF;
  
  -- Insert Mike's portfolio if he exists
  IF mike_id IS NOT NULL THEN
    INSERT INTO portfolio_items (
      professional_id, title, description, project_type, start_date, end_date,
      duration_months, client_name, project_value, location, skills_used, tools_used,
      featured_image_url, image_urls, challenges_overcome, results_achieved, 
      client_testimonial, is_featured, is_public, display_order
    ) VALUES
    (mike_id,
     'Hospital HVAC System Upgrade',
     'Critical HVAC upgrade for 500-bed hospital including specialized air filtration for operating rooms.',
     'Commercial HVAC',
     '2023-10-01',
     '2024-03-01',
     5,
     'Regional Medical Center',
     180000,
     'Houston, TX',
     ARRAY['HVAC Design', 'Medical Grade Systems', 'Energy Efficiency'],
     ARRAY['Refrigerant Recovery Unit', 'Duct Blaster', 'Digital Manifolds'],
     'https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
     ARRAY[
       'https://images.pexels.com/photos/4489752/pexels-photo-4489752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
       'https://images.pexels.com/photos/4489754/pexels-photo-4489754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
     ],
     'Critical timing to minimize disruption to hospital operations.',
     'Improved air quality and reduced energy costs by 20%. Zero downtime.',
     'Exceptional technical expertise and project management skills.',
     true,
     true,
     1);
  END IF;
END $$;

-- Create sample jobs for review generation (only if hirers exist)
DO $$
DECLARE
  hirer1_id uuid;
  hirer2_id uuid;
  hirer3_id uuid;
BEGIN
  -- Get hirer IDs
  SELECT id INTO hirer1_id FROM profiles WHERE role = 'hirer' LIMIT 1;
  SELECT id INTO hirer2_id FROM profiles WHERE role = 'hirer' LIMIT 1 OFFSET 1;
  SELECT id INTO hirer3_id FROM profiles WHERE role = 'hirer' LIMIT 1 OFFSET 2;
  
  -- Insert jobs if hirers exist
  IF hirer1_id IS NOT NULL THEN
    INSERT INTO jobs (
      hirer_id, title, description, category, job_type, location, 
      salary_type, salary_min, salary_max, required_skills, status
    ) VALUES
    (hirer1_id,
     'Electrical System Installation',
     'Need experienced electrician for commercial building project.',
     'engineering',
     'contract',
     'New York, NY',
     'project',
     50000,
     100000,
     ARRAY['Electrical Installation', 'Code Compliance'],
     'active');
  END IF;
  
  IF hirer2_id IS NOT NULL THEN
    INSERT INTO jobs (
      hirer_id, title, description, category, job_type, location, 
      salary_type, salary_min, salary_max, required_skills, status
    ) VALUES
    (hirer2_id,
     'Plumbing System Upgrade',
     'Commercial plumbing upgrade for office building.',
     'construction',
     'contract',
     'Miami, FL',
     'project',
     40000,
     80000,
     ARRAY['Commercial Plumbing', 'Fixture Installation'],
     'active');
  END IF;
  
  IF hirer3_id IS NOT NULL THEN
    INSERT INTO jobs (
      hirer_id, title, description, category, job_type, location, 
      salary_type, salary_min, salary_max, required_skills, status
    ) VALUES
    (hirer3_id,
     'HVAC Installation Project',
     'HVAC system installation for new construction.',
     'construction',
     'contract',
     'Houston, TX',
     'project',
     60000,
     120000,
     ARRAY['HVAC Installation', 'System Design'],
     'active');
  END IF;
END $$;

-- Insert sample reviews (only if jobs and professionals exist)
DO $$
DECLARE
  job1_id uuid;
  job2_id uuid;
  job3_id uuid;
  john_id uuid;
  sarah_id uuid;
  mike_id uuid;
BEGIN
  -- Get job and professional IDs
  SELECT id INTO job1_id FROM jobs WHERE title = 'Electrical System Installation' LIMIT 1;
  SELECT id INTO job2_id FROM jobs WHERE title = 'Plumbing System Upgrade' LIMIT 1;
  SELECT id INTO job3_id FROM jobs WHERE title = 'HVAC Installation Project' LIMIT 1;
  
  SELECT id INTO john_id FROM profiles WHERE role = 'professional' AND first_name = 'John' LIMIT 1;
  SELECT id INTO sarah_id FROM profiles WHERE role = 'professional' AND first_name = 'Sarah' LIMIT 1;
  SELECT id INTO mike_id FROM profiles WHERE role = 'professional' AND first_name = 'Mike' LIMIT 1;
  
  -- Insert reviews if all required data exists
  IF job1_id IS NOT NULL AND john_id IS NOT NULL THEN
    INSERT INTO reviews (
      job_id, reviewer_id, reviewee_id, rating, title, comment,
      skills_rating, communication_rating, timeliness_rating, professionalism_rating,
      would_recommend, is_public, helpful_count
    ) VALUES
    (job1_id,
     (SELECT hirer_id FROM jobs WHERE id = job1_id),
     john_id,
     5,
     'Exceptional Electrical Work - Highly Recommended',
     'Professional electrical work completed to high standards. All code requirements met and project finished on schedule. The wiring was neat and organized, and all systems function perfectly. Would hire again for future electrical projects.',
     5, 5, 5, 5, true, true, 0);
  END IF;
  
  IF job2_id IS NOT NULL AND sarah_id IS NOT NULL THEN
    INSERT INTO reviews (
      job_id, reviewer_id, reviewee_id, rating, title, comment,
      skills_rating, communication_rating, timeliness_rating, professionalism_rating,
      would_recommend, is_public, helpful_count
    ) VALUES
    (job2_id,
     (SELECT hirer_id FROM jobs WHERE id = job2_id),
     sarah_id,
     5,
     'Outstanding Plumbing Services',
     'Expert plumbing installation with attention to detail. Clean work area and professional communication throughout the project. All fixtures were installed perfectly and there have been no leaks or issues. Very satisfied with the results.',
     5, 5, 5, 5, true, true, 0);
  END IF;
  
  IF job3_id IS NOT NULL AND mike_id IS NOT NULL THEN
    INSERT INTO reviews (
      job_id, reviewer_id, reviewee_id, rating, title, comment,
      skills_rating, communication_rating, timeliness_rating, professionalism_rating,
      would_recommend, is_public, helpful_count
    ) VALUES
    (job3_id,
     (SELECT hirer_id FROM jobs WHERE id = job3_id),
     mike_id,
     4,
     'Good HVAC Installation',
     'Good quality work completed professionally. Minor delays but overall satisfied with the results. Would consider hiring again for future projects. Communication could have been better but the final product met expectations.',
     4, 4, 4, 4, true, true, 0);
  END IF;
END $$;

-- Add review responses (only if reviews exist)
DO $$
DECLARE
  review1_id uuid;
  review2_id uuid;
BEGIN
  SELECT id INTO review1_id FROM reviews WHERE rating = 5 LIMIT 1;
  SELECT id INTO review2_id FROM reviews WHERE rating = 4 LIMIT 1;
  
  IF review1_id IS NOT NULL THEN
    INSERT INTO review_responses (
      review_id, responder_id, response_text
    ) VALUES
    (review1_id,
     (SELECT reviewee_id FROM reviews WHERE id = review1_id),
     'Thank you so much for your kind words! It was a pleasure working on your project. I take great pride in my work and I''m thrilled that you''re satisfied with the results. I look forward to working with you again on future projects!');
  END IF;
  
  IF review2_id IS NOT NULL THEN
    INSERT INTO review_responses (
      review_id, responder_id, response_text
    ) VALUES
    (review2_id,
     (SELECT reviewee_id FROM reviews WHERE id = review2_id),
     'Thank you for your feedback. I appreciate you taking the time to share your experience. I''m glad you were satisfied with the work overall, and I''ll keep your suggestions in mind for future projects.');
  END IF;
END $$;

-- Add helpful votes to reviews (only if reviews and other professionals exist)
DO $$
DECLARE
  review_rec RECORD;
  voter_id uuid;
BEGIN
  FOR review_rec IN SELECT id, reviewee_id FROM reviews LIMIT 3 LOOP
    -- Find a professional who is not the reviewee to vote
    SELECT id INTO voter_id 
    FROM profiles 
    WHERE role = 'professional' 
      AND id != review_rec.reviewee_id 
    LIMIT 1;
    
    IF voter_id IS NOT NULL THEN
      INSERT INTO review_helpful_votes (
        review_id, voter_id, is_helpful
      ) VALUES
      (review_rec.id, voter_id, true);
    END IF;
  END LOOP;
END $$;

-- Update review helpful counts
UPDATE reviews 
SET helpful_count = (
  SELECT COUNT(*)
  FROM review_helpful_votes v
  WHERE v.review_id = reviews.id AND v.is_helpful = true
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

-- Add notification preferences for users (only if they don't already exist)
INSERT INTO notification_preferences (
  user_id, email_notifications, push_notifications, 
  application_updates, message_notifications, job_recommendations
)
SELECT 
  id, true, true, true, true, true
FROM profiles 
WHERE NOT EXISTS (
  SELECT 1 FROM notification_preferences np WHERE np.user_id = profiles.id
)
LIMIT 10;