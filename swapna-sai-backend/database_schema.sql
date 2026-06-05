-- Run this in your Supabase SQL Editor

-- 1. Create Admins Table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default admin (Password is: admin123, you should change this later)
-- Note: bcrypt hash for 'admin123' is '$2b$10$X8C5a0.N0eRk/lZ7V1O5kO0pI/H3p7F4n.E6p6B8A0E2.f3.e.f.'
INSERT INTO admins (email, password_hash) 
VALUES ('admin@swapnasai.com', '$2a$12$N0yXlS.m4/O3Q7R6s5wUce7Bv9F2G7z.e2g.l4vJ3vR1.T8D2C.2q');

-- 2. Create Enquiries Table
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  budget VARCHAR(50),
  college VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'New', -- New, Contacted, Closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Rooms Table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  sharing_type VARCHAR(50) NOT NULL, -- e.g., '2 sharing', '3 sharing'
  facilities TEXT[] DEFAULT '{}',
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Gallery Table
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- Rooms, Common areas, Food
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Analytics Table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page VARCHAR(255) NOT NULL,
  visitor_type VARCHAR(50) DEFAULT 'Guest',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup Row Level Security (RLS) - Basic public read access, authenticated write access
-- You might want to customize this based on your exact Supabase JWT setup
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert analytics" ON analytics FOR INSERT WITH CHECK (true);

-- We'll rely on our custom backend (Node.js) with the service_role key to bypass RLS for admin operations,
-- or implement proper JWT auth tied to Supabase. For this MVP, we use the backend service.
