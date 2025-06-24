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
    WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 1 THEN 
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
      END
    WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 2 THEN
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
      END
    ELSE
      CASE 
        WHEN pp.title ILIKE '%electrical%' THEN 'Residential Smart Home Wiring System'
        WHEN pp.title ILIKE '%plumber%' THEN 'Emergency Hospital Plumbing Repair'
        WHEN pp.title ILIKE '%hvac%' THEN 'Energy-Efficient Home HVAC Installation'
        WHEN pp.title ILIKE '%carpenter%' THEN 'Custom Hardwood Staircase'
        WHEN pp.title ILIKE '%mason%' THEN 'Brick Facade Restoration Project'
        WHEN pp.title ILIKE '%welder%' THEN 'Custom Metal Art Installation'
        WHEN pp.title ILIKE '%painter%' THEN 'School Building Complete Repainting'
        WHEN pp.title ILIKE '%tile%' THEN 'Custom Mosaic Tile Installation'
        WHEN pp.title ILIKE '%roof%' THEN 'Historic Building Slate Roof Restoration'
        WHEN pp.title ILIKE '%architect%' THEN 'Sustainable Eco-Home Design'
        WHEN pp.title ILIKE '%interior%' THEN 'Corporate Office Interior Redesign'
        ELSE 'Construction Site Topographic Survey'
      END
  END,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 1 THEN 
      CASE 
        WHEN pp.title ILIKE '%electrical%' THEN 'Complete electrical system design and installation for a 10-story commercial office building. Included power distribution, lighting control systems, emergency backup power, and fire safety systems. Project required coordination with multiple contractors and strict adherence to building codes.'
        WHEN pp.title ILIKE '%plumber%' THEN 'Full plumbing system installation for a 200-room luxury hotel including guest rooms, kitchens, laundry facilities, and spa areas. Featured high-end fixtures, water recycling systems, and energy-efficient hot water distribution.'
        WHEN pp.title ILIKE '%hvac%' THEN 'Complete HVAC system upgrade for a 500-bed hospital facility. Included specialized air filtration for operating rooms, patient room climate control, and energy-efficient central plant systems. Critical timing to minimize disruption to hospital operations.'
        ELSE 'Professional project showcasing expertise in trade-specific skills and successful project completion with high client satisfaction. Completed on time and within budget with excellent attention to detail and craftsmanship.'
      END
    WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 2 THEN
      'Major renovation project requiring specialized technical expertise and careful coordination with other trades. Worked closely with the client to understand their specific needs and delivered a solution that exceeded expectations while maintaining budget constraints.'
    ELSE
      'Challenging technical project that required innovative problem-solving and expert knowledge. Completed all work to the highest professional standards while maintaining excellent communication with the client throughout the process.'
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
  CASE 
    WHEN pp.title ILIKE '%electrical%' THEN ARRAY[
      'https://images.pexels.com/photos/8961438/pexels-photo-8961438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/8961441/pexels-photo-8961441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
    WHEN pp.title ILIKE '%plumber%' THEN ARRAY[
      'https://images.pexels.com/photos/6419135/pexels-photo-6419135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6419146/pexels-photo-6419146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
    WHEN pp.title ILIKE '%hvac%' THEN ARRAY[
      'https://images.pexels.com/photos/4489752/pexels-photo-4489752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4489754/pexels-photo-4489754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
    ELSE ARRAY[
      'https://images.pexels.com/photos/8961438/pexels-photo-8961438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/8961441/pexels-photo-8961441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  END,
  'Project required careful coordination with multiple stakeholders and strict adherence to safety protocols. Weather delays and material supply issues required creative problem-solving and schedule adjustments.',
  'Successfully completed project on time and within budget. Client reported 100% satisfaction with quality of work. All inspections passed on first attempt. Project became a reference for future similar work.',
  '"Outstanding professional work. The attention to detail and commitment to quality exceeded our expectations. Would definitely hire again for future projects."',
  ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 1, -- First item is featured
  true,
  ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM())
FROM profiles p
JOIN professional_profiles pp ON pp.user_id = p.id
WHERE p.role = 'professional'
  AND RANDOM() < 0.8 -- 80% of professionals get portfolio items
  AND NOT EXISTS (
    SELECT 1 FROM portfolio_items pi WHERE pi.professional_id = p.id
  )
  CROSS JOIN generate_series(1, 1 + (RANDOM() * 3)::integer) -- 1-4 portfolio items per professional
LIMIT 50;

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
    WHEN (4 + (RANDOM())::integer) = 5 THEN 
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
      END
    ELSE 
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
      END
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
LIMIT 50;

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
WHERE RANDOM() < 0.4 -- 40% of reviews get responses
LIMIT 20;

-- Add helpful votes to reviews
INSERT INTO review_helpful_votes (
  review_id, voter_id, is_helpful
)
SELECT 
  r.id,
  p.id,
  RANDOM() < 0.8 -- 80% helpful, 20% not helpful
FROM reviews r
JOIN profiles p ON p.id != r.reviewer_id AND p.id != r.reviewee_id
WHERE RANDOM() < 0.5 -- 50% of reviews get votes
LIMIT 100;

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
    ROUND(AVG(r.rating)::numeric, 1) as avg_rating,
    COUNT(*) as review_count
  FROM reviews r
  WHERE r.is_public = true
  GROUP BY r.reviewee_id
) subquery
WHERE professional_profiles.user_id = subquery.reviewee_id;