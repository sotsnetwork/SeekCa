/*
  # Add Sample Reviews Data

  1. New Data
    - Sample reviews for professionals
    - Sample review responses
    - Sample review helpful votes
  
  2. Purpose
    - Provides realistic review data for testing and demonstration
    - Creates a variety of ratings and feedback types
*/

-- Insert sample reviews (only if no reviews exist)
DO $$
DECLARE
  v_professional_id uuid;
  v_hirer_id uuid;
  v_job_id uuid;
  v_review_id uuid;
BEGIN
  -- Only insert if no reviews exist
  IF NOT EXISTS (SELECT 1 FROM reviews LIMIT 1) THEN
    -- Get a professional ID
    SELECT user_id INTO v_professional_id
    FROM professional_profiles
    LIMIT 1;
    
    -- Get a hirer ID
    SELECT id INTO v_hirer_id
    FROM profiles
    WHERE role = 'hirer'
    LIMIT 1;
    
    -- Get a job ID
    SELECT id INTO v_job_id
    FROM jobs
    LIMIT 1;
    
    -- If we have the necessary IDs, create sample reviews
    IF v_professional_id IS NOT NULL AND v_hirer_id IS NOT NULL AND v_job_id IS NOT NULL THEN
      -- 5-star review
      INSERT INTO reviews (
        job_id, reviewer_id, reviewee_id, rating, title, comment,
        skills_rating, communication_rating, timeliness_rating, professionalism_rating,
        would_recommend, is_public, helpful_count
      ) VALUES (
        v_job_id, v_hirer_id, v_professional_id, 5,
        'Exceptional work, highly recommended!',
        'I hired this professional for a complex project and was thoroughly impressed with their work. They were knowledgeable, efficient, and delivered high-quality results ahead of schedule. Communication was excellent throughout the project, and they were very responsive to all my questions and concerns. I would definitely hire them again for future projects.',
        5, 5, 5, 5, true, true, 3
      ) RETURNING id INTO v_review_id;
      
      -- Add a response to this review
      INSERT INTO review_responses (
        review_id, responder_id, response_text
      ) VALUES (
        v_review_id, v_professional_id,
        'Thank you so much for your kind words! It was a pleasure working with you on this project. I appreciate your clear communication and prompt feedback throughout the process. Looking forward to collaborating with you again in the future.'
      );
      
      -- 4-star review
      INSERT INTO reviews (
        job_id, reviewer_id, reviewee_id, rating, title, comment,
        skills_rating, communication_rating, timeliness_rating, professionalism_rating,
        would_recommend, is_public, helpful_count
      ) VALUES (
        v_job_id, v_hirer_id, v_professional_id, 4,
        'Very good work with minor issues',
        'Overall, I was very satisfied with the work. The professional demonstrated strong technical skills and was professional throughout the project. There were a couple of minor issues with the timeline, but they communicated well about the delays. The final result met my expectations and I would work with them again.',
        5, 4, 3, 5, true, true, 1
      );
      
      -- 3-star review
      INSERT INTO reviews (
        job_id, reviewer_id, reviewee_id, rating, title, comment,
        skills_rating, communication_rating, timeliness_rating, professionalism_rating,
        would_recommend, is_public, helpful_count
      ) VALUES (
        v_job_id, v_hirer_id, v_professional_id, 3,
        'Decent work but communication issues',
        'The quality of work was acceptable, but there were some communication challenges throughout the project. Responses were sometimes delayed, and I had to follow up multiple times on certain issues. The project was completed on time, but the process could have been smoother with better communication.',
        4, 2, 3, 3, false, true, 0
      );
      
      -- Add some helpful votes
      INSERT INTO review_helpful_votes (review_id, voter_id, is_helpful)
      SELECT v_review_id, id, true
      FROM profiles
      WHERE id != v_hirer_id
      LIMIT 3;
      
      -- Update professional profile rating
      UPDATE professional_profiles
      SET 
        rating = 4.0,
        total_reviews = 3
      WHERE user_id = v_professional_id;
    END IF;
  END IF;
END
$$;