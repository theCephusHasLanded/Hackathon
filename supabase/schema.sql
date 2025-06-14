-- LKHN Hackathon Platform Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table to track all signups
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  auth_provider TEXT DEFAULT 'email' CHECK (auth_provider IN ('email', 'google')),
  signup_timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  received_confirmation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table to define selectable projects
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'planning' CHECK (status IN ('active', 'planning', 'future', 'completed')),
  difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  team_size TEXT DEFAULT '4-6',
  duration TEXT DEFAULT '2 weeks',
  mentor TEXT,
  technologies TEXT[] DEFAULT '{}',
  objectives TEXT[] DEFAULT '{}',
  prerequisites TEXT[] DEFAULT '{}',
  max_participants INTEGER DEFAULT 100,
  current_participants INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_projects table (many-to-many) linking users to projects
CREATE TABLE user_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'applied', 'accepted', 'declined')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_signup_timestamp ON users(signup_timestamp);
CREATE INDEX idx_users_auth_provider ON users(auth_provider);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_difficulty ON projects(difficulty);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX idx_user_projects_project_id ON user_projects(project_id);
CREATE INDEX idx_user_projects_selected_at ON user_projects(selected_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample projects (migrating from your existing mock data)
INSERT INTO projects (
  title, 
  description, 
  tags, 
  status, 
  difficulty, 
  team_size, 
  duration, 
  mentor,
  technologies,
  objectives,
  prerequisites
) VALUES 
(
  'AI-Powered Data Pipeline',
  'Build an intelligent data processing system that automatically optimizes massive datasets with minimal resource usage. Focus on clean architecture and performance.',
  ARRAY['Python', 'AI/ML', 'Data Engineering'],
  'active',
  'advanced',
  '4-6',
  '3 weeks',
  'Dr. Sarah Chen',
  ARRAY['Python', 'Apache Airflow', 'TensorFlow', 'Docker', 'AWS'],
  ARRAY['Design scalable data pipeline architecture', 'Implement ML-based optimization algorithms', 'Create monitoring and alerting systems', 'Deploy on cloud infrastructure'],
  ARRAY['Python proficiency', 'Basic ML knowledge', 'Database experience']
),
(
  'Minimalist Analytics Dashboard',
  'Create a clean, intuitive dashboard that displays complex analytics through simple visualizations. Emphasis on user experience and performance.',
  ARRAY['React', 'D3.js', 'UI/UX'],
  'planning',
  'intermediate',
  '3-5',
  '2 weeks',
  'Alex Rodriguez',
  ARRAY['React', 'D3.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  ARRAY['Design user-centric dashboard interface', 'Implement real-time data visualization', 'Optimize for mobile responsiveness', 'Create reusable component library'],
  ARRAY['React experience', 'JavaScript proficiency', 'Basic design knowledge']
),
(
  'Micro-Service Architecture Framework',
  'Design a lightweight framework for building scalable microservices with built-in monitoring, logging, and deployment automation.',
  ARRAY['Node.js', 'Docker', 'DevOps'],
  'active',
  'advanced',
  '5-7',
  '4 weeks',
  'Michael Thompson',
  ARRAY['Node.js', 'Docker', 'Kubernetes', 'Redis', 'MongoDB'],
  ARRAY['Create microservice template framework', 'Implement service discovery mechanism', 'Build automated deployment pipeline', 'Design monitoring and logging system'],
  ARRAY['Node.js experience', 'Docker knowledge', 'Basic DevOps understanding']
),
(
  'Smart City IoT Platform',
  'Develop an IoT platform for smart city infrastructure with real-time monitoring, predictive maintenance, and energy optimization.',
  ARRAY['IoT', 'Edge Computing', 'Sustainability'],
  'future',
  'expert',
  '6-8',
  '5 weeks',
  'Prof. Elena Vasquez',
  ARRAY['Python', 'MQTT', 'InfluxDB', 'Grafana', 'Raspberry Pi'],
  ARRAY['Design IoT sensor network architecture', 'Implement edge computing solutions', 'Create predictive maintenance algorithms', 'Build energy optimization system'],
  ARRAY['IoT experience', 'Python proficiency', 'Hardware knowledge']
),
(
  'Blockchain Document Verification',
  'Build a simple, secure system for document verification using blockchain technology with focus on privacy and user accessibility.',
  ARRAY['Blockchain', 'Cryptography', 'Security'],
  'planning',
  'advanced',
  '4-5',
  '3 weeks',
  'David Kim',
  ARRAY['Solidity', 'Web3.js', 'React', 'IPFS', 'MetaMask'],
  ARRAY['Design blockchain verification protocol', 'Implement smart contract system', 'Create user-friendly web interface', 'Ensure privacy and security measures'],
  ARRAY['Blockchain basics', 'JavaScript experience', 'Cryptography knowledge']
),
(
  'Voice-Controlled Dev Environment',
  'Create a voice-controlled development environment that allows developers to navigate code, run tests, and deploy applications hands-free.',
  ARRAY['Voice AI', 'Developer Tools', 'Accessibility'],
  'future',
  'advanced',
  '4-6',
  '4 weeks',
  'Lisa Park',
  ARRAY['Python', 'Speech Recognition', 'VS Code API', 'Docker', 'CI/CD'],
  ARRAY['Implement voice command recognition', 'Create IDE integration plugins', 'Build automated workflow system', 'Design accessibility features'],
  ARRAY['Python experience', 'API development', 'Basic AI/ML knowledge']
);

-- Function to automatically update project participant count
CREATE OR REPLACE FUNCTION update_project_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects 
    SET current_participants = current_participants + 1 
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects 
    SET current_participants = GREATEST(current_participants - 1, 0) 
    WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update participant count when users join/leave projects
CREATE TRIGGER update_project_participant_count_trigger
  AFTER INSERT OR DELETE ON user_projects
  FOR EACH ROW EXECUTE PROCEDURE update_project_participant_count();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can only view and update their own records
CREATE POLICY "Users can view their own records" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own records" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow user creation during signup
CREATE POLICY "Enable insert for authenticated users" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects are readable by all authenticated users
CREATE POLICY "Projects are viewable by authenticated users" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

-- User projects: users can only see and modify their own selections
CREATE POLICY "Users can view their own project selections" ON user_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own project selections" ON user_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project selections" ON user_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project selections" ON user_projects
  FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for all tables
ALTER publication supabase_realtime ADD TABLE users;
ALTER publication supabase_realtime ADD TABLE projects;
ALTER publication supabase_realtime ADD TABLE user_projects;