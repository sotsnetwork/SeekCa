/*
  # Reviews and Portfolio System

  1. New Tables
    - `reviews` - Post-project feedback system with detailed ratings
    - `portfolio_items` - Professional portfolio showcase
    - `review_responses` - Allow professionals to respond to reviews
    - `review_helpful_votes` - Community voting on review helpfulness

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Reviews visible to public, reviewers, and reviewees
    - Portfolio items public by default, manageable by owner

  3. Functions
    - Automatic rating calculation for professionals
    - Portfolio and review retrieval with statistics
    - Review statistics aggregation

  4. Triggers
    - Auto-update professional ratings when reviews change
    - Update helpful counts on reviews
    - Timestamp management
*/

-- Create tables first
-- Reviews table for post-project feedback
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Overall rating (1-5 stars)
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  -- Review content
  title text,
  comment text,
  
  -- Detailed category ratings (1-5 stars each)
  skills_rating integer CHECK (skills_rating >= 1 AND skills_rating <= 5),
  communication_rating integer CHECK (communication_rating >= 1 AND communication_rating <= 5),
  timeliness_rating integer CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  professionalism_rating integer CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  
  -- Additional fields
  would_recommend boolean DEFAULT true,
  is_public boolean DEFAULT true,
  helpful_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one review per job per reviewer-reviewee pair
  UNIQUE(job_id, reviewer_id, reviewee_id)
);

-- Portfolio items for professionals to showcase their work
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Project details
  title text NOT NULL,
  description text NOT NULL,
  project_type text, -- e.g., "Residential Electrical", "Commercial HVAC"
  
  -- Project timeline
  start_date date,
  end_date date,
  duration_months integer,
  
  -- Project details
  client_name text, -- Can be anonymized like "Residential Client"
  project_value numeric(12,2), -- Optional project budget/value
  location text,
  
  -- Skills and technologies used
  skills_used text[] DEFAULT '{}',
  tools_used text[] DEFAULT '{}',
  certifications_applied text[] DEFAULT '{}',
  
  -- Media and documentation
  featured_image_url text,
  image_urls text[] DEFAULT '{}',
  document_urls text[] DEFAULT '{}', -- Plans, certificates, etc.
  
  -- Project outcomes
  challenges_overcome text,
  results_achieved text,
  client_testimonial text,
  
  -- Display settings
  is_featured boolean DEFAULT false,
  is_public boolean DEFAULT true,
  display_order integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Review responses - allow professionals to respond to reviews
CREATE TABLE IF NOT EXISTS review_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  responder_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  response_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- One response per review
  UNIQUE(review_id)
);

-- Track helpful votes on reviews
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  voter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  is_helpful boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- One vote per user per review
  UNIQUE(review_id, voter_id)
);

-- Enable RLS on all tables
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing triggers first (before dropping functions)
DROP TRIGGER IF EXISTS update_professional_rating_trigger ON reviews;
DROP TRIGGER IF EXISTS update_review_helpful_count_trigger ON review_helpful_votes;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
DROP TRIGGER IF EXISTS update_review_responses_updated_at ON review_responses;

-- Now drop existing functions
DROP FUNCTION IF EXISTS update_professional_rating();
DROP FUNCTION IF EXISTS update_review_helpful_count();
DROP FUNCTION IF EXISTS get_professional_portfolio(uuid, integer, integer);
DROP FUNCTION IF EXISTS get_professional_reviews(uuid, integer, integer);
DROP FUNCTION IF EXISTS get_review_statistics(uuid);
DROP FUNCTION IF EXISTS update_reviews_updated_at();
DROP FUNCTION IF EXISTS update_portfolio_items_updated_at();
DROP FUNCTION IF EXISTS update_review_responses_updated_at();

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view public reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view reviews about them" ON reviews;
DROP POLICY IF EXISTS "Users can view reviews they wrote" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update reviews they wrote" ON reviews;

DROP POLICY IF EXISTS "Anyone can view public portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Professionals can manage own portfolio" ON portfolio_items;

DROP POLICY IF EXISTS "Anyone can view review responses" ON review_responses;
DROP POLICY IF EXISTS "Users can respond to reviews about them" ON review_responses;
DROP POLICY IF EXISTS "Users can update own responses" ON review_responses;

DROP POLICY IF EXISTS "Anyone can view helpful votes" ON review_helpful_votes;
DROP POLICY IF EXISTS "Users can vote on reviews" ON review_helpful_votes;
DROP POLICY IF EXISTS "Users can update own votes" ON review_helpful_votes;

-- Create policies
-- Reviews policies
CREATE POLICY "Anyone can view public reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can view reviews about them"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (reviewee_id = auth.uid());

CREATE POLICY "Users can view reviews they wrote"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (reviewer_id = auth.uid());

CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can update reviews they wrote"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (reviewer_id = auth.uid());

-- Portfolio items policies
CREATE POLICY "Anyone can view public portfolio items"
  ON portfolio_items
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Professionals can manage own portfolio"
  ON portfolio_items
  FOR ALL
  TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

-- Review responses policies
CREATE POLICY "Anyone can view review responses"
  ON review_responses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can respond to reviews about them"
  ON review_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    responder_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE id = review_id AND reviewee_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own responses"
  ON review_responses
  FOR UPDATE
  TO authenticated
  USING (responder_id = auth.uid());

-- Review helpful votes policies
CREATE POLICY "Anyone can view helpful votes"
  ON review_helpful_votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can vote on reviews"
  ON review_helpful_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (voter_id = auth.uid());

CREATE POLICY "Users can update own votes"
  ON review_helpful_votes
  FOR UPDATE
  TO authenticated
  USING (voter_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_job_id ON reviews(job_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_is_public ON reviews(is_public);

CREATE INDEX IF NOT EXISTS idx_portfolio_items_professional_id ON portfolio_items(professional_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_is_public ON portfolio_items(is_public);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_is_featured ON portfolio_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_display_order ON portfolio_items(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_project_type ON portfolio_items(project_type);

CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);

-- Create functions first
-- Trigger functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_portfolio_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_review_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update professional rating when reviews change
CREATE OR REPLACE FUNCTION update_professional_rating()
RETURNS TRIGGER AS $$
DECLARE
  prof_id uuid;
  avg_rating numeric;
  review_count integer;
BEGIN
  -- Get the professional ID from the review
  IF TG_OP = 'DELETE' THEN
    prof_id := OLD.reviewee_id;
  ELSE
    prof_id := NEW.reviewee_id;
  END IF;
  
  -- Only update if the reviewee is a professional
  IF EXISTS (SELECT 1 FROM profiles WHERE id = prof_id AND role = 'professional') THEN
    -- Calculate new average rating and count
    SELECT 
      COALESCE(AVG(rating), 0),
      COUNT(*)
    INTO avg_rating, review_count
    FROM reviews 
    WHERE reviewee_id = prof_id AND is_public = true;
    
    -- Update professional profile
    UPDATE professional_profiles 
    SET 
      rating = avg_rating,
      total_reviews = review_count,
      updated_at = now()
    WHERE user_id = prof_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update helpful count on reviews
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
DECLARE
  helpful_count_val integer;
BEGIN
  -- Calculate helpful count
  SELECT COUNT(*) 
  INTO helpful_count_val
  FROM review_helpful_votes 
  WHERE review_id = COALESCE(NEW.review_id, OLD.review_id) 
  AND is_helpful = true;
  
  -- Update review
  UPDATE reviews 
  SET helpful_count = helpful_count_val
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to get professional portfolio with stats
CREATE OR REPLACE FUNCTION get_professional_portfolio(
  p_professional_id uuid,
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  project_type text,
  start_date date,
  end_date date,
  duration_months integer,
  client_name text,
  project_value numeric,
  location text,
  skills_used text[],
  tools_used text[],
  featured_image_url text,
  image_urls text[],
  challenges_overcome text,
  results_achieved text,
  client_testimonial text,
  is_featured boolean,
  display_order integer,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pi.id,
    pi.title,
    pi.description,
    pi.project_type,
    pi.start_date,
    pi.end_date,
    pi.duration_months,
    pi.client_name,
    pi.project_value,
    pi.location,
    pi.skills_used,
    pi.tools_used,
    pi.featured_image_url,
    pi.image_urls,
    pi.challenges_overcome,
    pi.results_achieved,
    pi.client_testimonial,
    pi.is_featured,
    pi.display_order,
    pi.created_at
  FROM portfolio_items pi
  WHERE pi.professional_id = p_professional_id
    AND pi.is_public = true
  ORDER BY 
    pi.is_featured DESC,
    pi.display_order ASC,
    pi.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get reviews for a professional with responses
CREATE OR REPLACE FUNCTION get_professional_reviews(
  p_professional_id uuid,
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  review_id uuid,
  job_id uuid,
  job_title text,
  reviewer_name text,
  reviewer_avatar text,
  reviewer_company text,
  rating integer,
  title text,
  comment text,
  skills_rating integer,
  communication_rating integer,
  timeliness_rating integer,
  professionalism_rating integer,
  would_recommend boolean,
  helpful_count integer,
  created_at timestamptz,
  response_text text,
  response_created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as review_id,
    r.job_id,
    j.title as job_title,
    COALESCE(
      p.first_name || ' ' || p.last_name,
      p.company_name,
      'Anonymous'
    ) as reviewer_name,
    p.avatar_url as reviewer_avatar,
    p.company_name as reviewer_company,
    r.rating,
    r.title,
    r.comment,
    r.skills_rating,
    r.communication_rating,
    r.timeliness_rating,
    r.professionalism_rating,
    r.would_recommend,
    r.helpful_count,
    r.created_at,
    rr.response_text,
    rr.created_at as response_created_at
  FROM reviews r
  LEFT JOIN jobs j ON j.id = r.job_id
  LEFT JOIN profiles p ON p.id = r.reviewer_id
  LEFT JOIN review_responses rr ON rr.review_id = r.id
  WHERE r.reviewee_id = p_professional_id
    AND r.is_public = true
  ORDER BY r.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get review statistics for a professional
CREATE OR REPLACE FUNCTION get_review_statistics(p_professional_id uuid)
RETURNS TABLE (
  total_reviews integer,
  average_rating numeric,
  rating_distribution jsonb,
  category_averages jsonb,
  recommendation_percentage numeric
) AS $$
DECLARE
  stats_result RECORD;
BEGIN
  SELECT 
    COUNT(*)::integer as total,
    ROUND(AVG(rating), 2) as avg_rating,
    jsonb_build_object(
      '5', COUNT(*) FILTER (WHERE rating = 5),
      '4', COUNT(*) FILTER (WHERE rating = 4),
      '3', COUNT(*) FILTER (WHERE rating = 3),
      '2', COUNT(*) FILTER (WHERE rating = 2),
      '1', COUNT(*) FILTER (WHERE rating = 1)
    ) as distribution,
    jsonb_build_object(
      'skills', ROUND(AVG(skills_rating), 2),
      'communication', ROUND(AVG(communication_rating), 2),
      'timeliness', ROUND(AVG(timeliness_rating), 2),
      'professionalism', ROUND(AVG(professionalism_rating), 2)
    ) as categories,
    ROUND(
      (COUNT(*) FILTER (WHERE would_recommend = true)::numeric / 
       NULLIF(COUNT(*), 0)) * 100, 1
    ) as recommendation_pct
  INTO stats_result
  FROM reviews 
  WHERE reviewee_id = p_professional_id AND is_public = true;
  
  RETURN QUERY
  SELECT 
    stats_result.total,
    stats_result.avg_rating,
    stats_result.distribution,
    stats_result.categories,
    stats_result.recommendation_pct;
END;
$$ LANGUAGE plpgsql;

-- Create triggers after functions are created
CREATE TRIGGER update_professional_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_professional_rating();

CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_reviews_updated_at();

CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_items_updated_at();

CREATE TRIGGER update_review_responses_updated_at
  BEFORE UPDATE ON review_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_review_responses_updated_at();