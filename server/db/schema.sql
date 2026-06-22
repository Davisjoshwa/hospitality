-- SQL Schema for HospiHire PostgreSQL database with separate tables per user module

-- Drop dependent tables first
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS job_bookmarks CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- 1. Admins Table
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT 'System Admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Hotels (Recruiters) Table
CREATE TABLE hotels (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255),
  location VARCHAR(255) NOT NULL,
  description TEXT,
  avatar TEXT,
  interests VARCHAR(500),
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Students (Candidates) Table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  school VARCHAR(255),
  field_of_study VARCHAR(255),
  start_year INT,
  end_year INT,
  age_over_16 BOOLEAN DEFAULT TRUE,
  job_title VARCHAR(255),
  avatar TEXT,
  bio TEXT,
  languages VARCHAR(255),
  education TEXT,
  edu_grad_year VARCHAR(10),
  skills TEXT[] DEFAULT '{}',
  internships JSONB DEFAULT '[]'::jsonb,
  certificates TEXT[] DEFAULT '{}',
  resume_name VARCHAR(255),
  interests VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Jobs Table (Posted by hotels)
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  recruiter_id INT REFERENCES hotels(id) ON DELETE CASCADE, -- References hotels table directly!
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  logo VARCHAR(10) NOT NULL,
  logo_bg VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  experience VARCHAR(100) NOT NULL,
  salary VARCHAR(100) NOT NULL,
  salary_min INT NOT NULL,
  salary_max INT NOT NULL,
  category VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Applications Table (Linking students to jobs)
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
  student_id INT REFERENCES students(id) ON DELETE CASCADE, -- References students table directly!
  cover_note TEXT,
  status VARCHAR(50) DEFAULT 'Pending Review',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_student_job UNIQUE (student_id, job_id)
);

-- 6. Bookmarks/Saved Jobs Table
CREATE TABLE job_bookmarks (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(id) ON DELETE CASCADE, -- References students table directly!
  job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_student_bookmark UNIQUE (student_id, job_id)
);
