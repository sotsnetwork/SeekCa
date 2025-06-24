/*
  # Fix helpful_count column and review triggers
  
  1. Changes
    - Add helpful_count column to reviews table if it doesn't exist
    - Fix update_review_helpful_count function to properly handle the column
    - Recreate the trigger to ensure it works correctly
  
  2. Purpose
    - Resolves error: "column 'helpful_count' of relation 'reviews' does not exist"
    - Ensures review helpful votes are properly counted
*/

-- First check if helpful_count column exists and add it if not
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'helpful_count'
  ) THEN
    ALTER TABLE reviews ADD COLUMN helpful_count integer DEFAULT 0;
  END IF;
END $$;

-- Drop the trigger first if it exists
DROP TRIGGER IF EXISTS update_review_helpful_count_trigger ON review_helpful_votes;

-- Recreate the function with proper error handling
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
DECLARE
  helpful_count_val integer;
  review_id_val uuid;
BEGIN
  -- Get the review ID
  IF TG_OP = 'DELETE' THEN
    review_id_val := OLD.review_id;
  ELSE
    review_id_val := NEW.review_id;
  END IF;
  
  -- Calculate helpful count
  SELECT COUNT(*) 
  INTO helpful_count_val
  FROM review_helpful_votes 
  WHERE review_id = review_id_val
  AND is_helpful = true;
  
  -- Update review
  UPDATE reviews 
  SET helpful_count = helpful_count_val
  WHERE id = review_id_val;
  
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in update_review_helpful_count: %', SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Update all review helpful counts to ensure consistency
UPDATE reviews r
SET helpful_count = (
  SELECT COUNT(*)
  FROM review_helpful_votes v
  WHERE v.review_id = r.id AND v.is_helpful = true
);