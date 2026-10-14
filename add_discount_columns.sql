-- ========================================================
-- Add Discount & Original Price Columns to Products Table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ========================================================

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS original_price NUMERIC,
ADD COLUMN IF NOT EXISTS is_discounted BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.products.original_price IS 'Actual/MRP price before discount';
COMMENT ON COLUMN public.products.is_discounted IS 'Whether product is on discount sale';
