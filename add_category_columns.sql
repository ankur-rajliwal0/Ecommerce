-- ========================================================
-- Add image_url and featured columns to categories table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ========================================================

ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add comments for clarity
COMMENT ON COLUMN public.categories.image_url IS 'Public image URL for category showcase';
COMMENT ON COLUMN public.categories.featured IS 'Whether this category is featured on homepage';
