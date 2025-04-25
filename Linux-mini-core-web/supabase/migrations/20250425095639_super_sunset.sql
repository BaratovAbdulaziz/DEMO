/*
  # Update profiles table and policies
  
  1. Changes
    - Drop existing policies before recreating them
    - Ensure clean policy creation
  
  2. Security
    - Maintain RLS policies for proper access control
    - Set up admin user trigger
*/

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_admin = true);

-- Create admin user trigger
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS trigger AS $$
BEGIN
  IF NEW.email = 'Key@minicore.web' THEN
    INSERT INTO profiles (id, username, is_admin)
    VALUES (NEW.id, 'Key', true);
  ELSE
    INSERT INTO profiles (id, username, is_admin)
    VALUES (NEW.id, split_part(NEW.email, '@', 1), false);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_user();