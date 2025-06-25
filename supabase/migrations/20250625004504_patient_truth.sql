/*
  # Review and Portfolio Functions

  1. New Functions
    - `get_professional_reviews`: Retrieves reviews for a professional with detailed information
    - `get_review_statistics`: Calculates statistics for a professional's reviews
    - `get_professional_portfolio`: Retrieves portfolio items for a professional

  2. Changes
    - Drops existing functions first to avoid return type conflicts
    - Creates functions with SECURITY DEFINER to maintain proper access control
*/

-- First, drop the existing functions before redefining them
DROP FUNCTION IF EXISTS get_professional_reviews(uuid,integer,integer);
DROP FUNCTION IF EXISTS get_review_statistics(uuid);
DROP FUNCTION IF EXISTS get_professional_portfolio(uuid,integer,integer);

-- Function to get professional reviews with detailed information
CREATE OR REPLACE FUNCTION get_professional_reviews(
  p_professional_id uuid,
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  job_id uuid,
  reviewer_id uuid,
  reviewee_id uuid,
  rating integer,
  title text,
  comment text,
  skills_rating integer,
  communication_rating integer,
  timeliness_rating integer,
  professionalism_rating integer,
  would_recommend boolean,
  is_public boolean,
  helpful_count integer,
  created_at timestamptz,
  updated_at timestamptz,
  job_title text,
  reviewer_name text,
  reviewer_avatar text,
  reviewer_company text,
  response_text text,
  response_created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.job_id,
    r.reviewer_id,
    r.reviewee_id,
    r.rating,
    r.title,
    r.comment,
    r.skills_rating,
    r.communication_rating,
    r.timeliness_rating,
    r.professionalism_rating,
    r.would_recommend,
    r.is_public,
    r.helpful_count,
    r.created_at,
    r.updated_at,
    j.title AS job_title,
    CASE
      WHEN p.role = 'professional' THEN p.first_name || ' ' || p.last_name
      ELSE p.company_name
    END AS reviewer_name,
    p.avatar_url AS reviewer_avatar,
    p.company_name AS reviewer_company,
    rr.response_text,
    rr.created_at AS response_created_at
  FROM reviews r
  LEFT JOIN jobs j ON j.id = r.job_id
  LEFT JOIN profiles p ON p.id = r.reviewer_id
  LEFT JOIN review_responses rr ON rr.review_id = r.id
  WHERE r.reviewee_id = p_professional_id
    AND (r.is_public = true OR r.reviewer_id = auth.uid() OR r.reviewee_id = auth.uid())
  ORDER BY r.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get review statistics for a professional
CREATE OR REPLACE FUNCTION get_review_statistics(
  p_professional_id uuid
)
RETURNS TABLE (
  total_reviews integer,
  average_rating numeric,
  rating_distribution jsonb,
  category_averages jsonb,
  recommendation_percentage integer
) AS $$
DECLARE
  v_total_reviews integer;
  v_average_rating numeric;
  v_rating_distribution jsonb;
  v_category_averages jsonb;
  v_recommendation_percentage integer;
BEGIN
  -- Get total reviews
  SELECT COUNT(*) INTO v_total_reviews
  FROM reviews
  WHERE reviewee_id = p_professional_id
    AND is_public = true;
  
  -- Get average rating
  SELECT COALESCE(AVG(rating), 0) INTO v_average_rating
  FROM reviews
  WHERE reviewee_id = p_professional_id
    AND is_public = true;
  
  -- Get rating distribution
  SELECT jsonb_build_object(
    '5', COUNT(*) FILTER (WHERE rating = 5),
    '4', COUNT(*) FILTER (WHERE rating = 4),
    '3', COUNT(*) FILTER (WHERE rating = 3),
    '2', COUNT(*) FILTER (WHERE rating = 2),
    '1', COUNT(*) FILTER (WHERE rating = 1)
  ) INTO v_rating_distribution
  FROM reviews
  WHERE reviewee_id = p_professional_id
    AND is_public = true;
  
  -- Get category averages
  SELECT jsonb_build_object(
    'skills', COALESCE(AVG(skills_rating), 0),
    'communication', COALESCE(AVG(communication_rating), 0),
    'timeliness', COALESCE(AVG(timeliness_rating), 0),
    'professionalism', COALESCE(AVG(professionalism_rating), 0)
  ) INTO v_category_averages
  FROM reviews
  WHERE reviewee_id = p_professional_id
    AND is_public = true;
  
  -- Get recommendation percentage
  SELECT 
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(*) FILTER (WHERE would_recommend = true) * 100.0) / COUNT(*))
      ELSE 0
    END INTO v_recommendation_percentage
  FROM reviews
  WHERE reviewee_id = p_professional_id
    AND is_public = true;
  
  -- Return the results
  RETURN QUERY
  SELECT 
    v_total_reviews,
    v_average_rating,
    v_rating_distribution,
    v_category_averages,
    v_recommendation_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get professional portfolio items
CREATE OR REPLACE FUNCTION get_professional_portfolio(
  p_professional_id uuid,
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0
)
RETURNS SETOF portfolio_items AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM portfolio_items
  WHERE professional_id = p_professional_id
    AND is_public = true
  ORDER BY 
    is_featured DESC,
    display_order ASC,
    created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;