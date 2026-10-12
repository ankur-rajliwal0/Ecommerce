-- Run this SQL in your Supabase SQL Editor to create the user_carts table

CREATE TABLE IF NOT EXISTS user_carts (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  cart_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_carts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own cart"
  ON user_carts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart"
  ON user_carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart"
  ON user_carts FOR UPDATE
  USING (auth.uid() = user_id);

-- IMPORTANT: Grant privileges to allow Supabase API to access the table
GRANT ALL ON TABLE public.user_carts TO authenticated;
GRANT ALL ON TABLE public.user_carts TO anon;
GRANT ALL ON TABLE public.user_carts TO service_role;
