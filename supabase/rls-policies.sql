-- Row Level Security (RLS) Policies for LKHN Hackathon Platform
-- Run these after creating the tables

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Users can view their own records
CREATE POLICY "users_select_own" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own records
CREATE POLICY "users_update_own" ON users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow user creation during signup (handled by auth.users trigger)
CREATE POLICY "users_insert_own" ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- =============================================
-- PROJECTS TABLE POLICIES
-- =============================================

-- All authenticated users can view projects
CREATE POLICY "projects_select_authenticated" ON projects
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Only admin users can modify projects (for future admin dashboard)
CREATE POLICY "projects_admin_only" ON projects
  FOR ALL 
  USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- =============================================
-- USER_PROJECTS TABLE POLICIES
-- =============================================

-- Users can view their own project selections
CREATE POLICY "user_projects_select_own" ON user_projects
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own project selections
CREATE POLICY "user_projects_insert_own" ON user_projects
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own project selections
CREATE POLICY "user_projects_update_own" ON user_projects
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own project selections
CREATE POLICY "user_projects_delete_own" ON user_projects
  FOR DELETE 
  USING (auth.uid() = user_id);

-- =============================================
-- FUTURE ADMIN POLICIES (commented out for now)
-- =============================================

-- Uncomment these when you implement admin roles

/*
-- Admin users can view all users
CREATE POLICY "admin_view_all_users" ON users
  FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- Admin users can view all user-project relationships
CREATE POLICY "admin_view_all_user_projects" ON user_projects
  FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- Mentor users can view projects they mentor
CREATE POLICY "mentors_view_mentored_projects" ON projects
  FOR SELECT 
  USING (
    mentor = (auth.jwt() -> 'user_metadata' ->> 'full_name') OR
    auth.jwt() -> 'user_metadata' ->> 'role' = 'mentor'
  );
*/

-- =============================================
-- FUNCTIONS FOR ROLE-BASED ACCESS
-- =============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is mentor
CREATE OR REPLACE FUNCTION is_mentor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'role' = 'mentor' OR 
    auth.jwt() -> 'user_metadata' ->> 'role' = 'mentor'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access project
CREATE OR REPLACE FUNCTION can_access_project(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Always allow if admin
  IF is_admin() THEN
    RETURN TRUE;
  END IF;
  
  -- Allow if user is participant in project
  IF EXISTS (
    SELECT 1 FROM user_projects 
    WHERE user_id = auth.uid() AND project_id = project_uuid
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Allow if user is mentor of project
  IF is_mentor() AND EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_uuid 
    AND p.mentor = (auth.jwt() -> 'user_metadata' ->> 'full_name')
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;