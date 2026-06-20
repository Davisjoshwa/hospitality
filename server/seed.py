import os
import json
from passlib.hash import bcrypt
from db import get_db_connection

def run_seed():
    print("Starting restructured database seeding in Python...")
    
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Read schema.sql
        schema_path = os.path.join(os.path.dirname(__file__), 'db', 'schema.sql')
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
            
        print("Resetting schema and creating tables...")
        # Split by semicolon and run each statement
        statements = schema_sql.split(';')
        for stmt in statements:
            cleaned_stmt = stmt.strip()
            if cleaned_stmt:
                cursor.execute(cleaned_stmt)
                
        conn.commit()
        print("Tables created successfully.")

        # 2. Hash default passwords using passlib bcrypt
        student_pass_hash = bcrypt.hash("password123")
        recruiter_pass_hash = bcrypt.hash("recruiter123")
        admin_pass_hash = bcrypt.hash("admin123")

        # 3. Seed users
        print("Seeding students table...")
        cursor.execute(
            """INSERT INTO students (email, phone, password_hash, name, bio, languages, education, edu_grad_year, skills, internships, certificates, resume_name) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (
                'student@cornell.edu',
                '+1 (555) 019-2834',
                student_pass_hash,
                'Alex Mercer',
                'Passionate hotel management student focused on guest hospitality, luxury services, and front-desk software systems.',
                'English (Native), French (Conversational)',
                'B.Sc. in Hotel Management, Cornell University',
                '2026',
                ['Front Office Operations', 'Opera PMS', 'Guest Relations', 'Bilingual'],
                json.dumps([
                  {
                    'role': 'Front Desk Intern',
                    'company': 'Hilton Orlando',
                    'duration': '6 Months (2025)',
                    'desc': 'Assisted with guest registration, managed keycard distribution, resolved billing inquiries via Opera PMS, and maintained guest service logs.'
                  }
                ]),
                ['ServSafe Manager', 'AHLEI Certified Front Desk Representative'],
                'Alex_Mercer_Resume.pdf'
            )
        )
        student_id = cursor.fetchone()[0]

        print("Seeding hotels table...")
        cursor.execute(
            """INSERT INTO hotels (email, phone, password_hash, company_name, location, description, is_verified) 
               VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (
                'recruiter@marriott.com',
                '+1 (555) 048-9321',
                recruiter_pass_hash,
                'Marriott International',
                'Orlando, FL',
                'Marriott International is an American multinational company that operates, franchises, and licenses lodging including hotel, residential, and timeshare properties.',
                True
            )
        )
        hotel_id = cursor.fetchone()[0]

        print("Seeding admins table...")
        cursor.execute(
            """INSERT INTO admins (email, phone, password_hash, name) 
               VALUES (%s, %s, %s, %s)""",
            ('admin@hospihire.com', '+1 (800) 555-HOSP', admin_pass_hash, 'System Admin')
        )

        conn.commit()
        print("Restructured user accounts seeded successfully.")

        # 4. Seed jobs
        print("Seeding initial jobs board listings...")
        initial_jobs = [
          {
            'recruiter_id': hotel_id,
            'title': 'Culinary Management Intern',
            'company': 'Marriott International',
            'logo': 'MI',
            'logo_bg': 'bg-red-700 text-white',
            'location': 'Orlando, FL',
            'type': 'Internship',
            'experience': 'Entry-level (0-1 year)',
            'salary': '$18 - $22 / hour',
            'salary_min': 35000,
            'salary_max': 45005,
            'category': 'Food & Beverage / Culinary',
            'description': 'Kickstart your culinary career with our structured 6-month culinary internship. Work alongside Michelin-star chefs and learn kitchen management, menu prep, and banqueting.',
            'requirements': [
              'Currently enrolled in or recently graduated from a Culinary Arts / Hotel Management program.',
              'Basic knife skills and knowledge of food safety standards (ServSafe certification is a plus).',
              'Positive attitude and willingness to work flexible kitchen shifts.',
              'Passion for fine dining and international cuisines.'
            ]
          },
          {
            'recruiter_id': hotel_id,
            'title': 'Assistant Front Office Manager',
            'company': 'The Ritz-Carlton',
            'logo': 'RC',
            'logo_bg': 'bg-slate-900 text-amber-500',
            'location': 'Miami, FL',
            'type': 'Full-time',
            'experience': 'Mid-level (2-4 years)',
            'salary': '$58,000 - $65,000 / year',
            'salary_min': 58000,
            'salary_max': 65000,
            'category': 'Front Office & Guest Relations',
            'description': 'We are seeking a guest-centric Assistant Front Office Manager to lead our front desk operations, supervise guest relations agents, and ensure the highest standards of luxury hospitality.',
            'requirements': [
              'Degree in Hospitality Management or equivalent experience.',
              'Minimum 2 years of supervisory experience in a luxury hotel.',
              'Proficiency in Opera PMS is highly preferred.',
              'Excellent communication and leadership skills.'
            ]
          },
          {
            'recruiter_id': hotel_id,
            'title': 'F&B Operations Supervisor',
            'company': 'Four Seasons Resorts',
            'logo': 'FS',
            'logo_bg': 'bg-stone-800 text-stone-200',
            'location': 'Maui, HI',
            'type': 'Full-time',
            'experience': 'Mid-level (2-4 years)',
            'salary': '$60,000 - $70,000 / year',
            'salary_min': 60000,
            'salary_max': 70000,
            'category': 'Food & Beverage / Culinary',
            'description': 'Supervise daily restaurant operations, banquet events, and beachside dining. The F&B Supervisor is responsible for staff scheduling, inventory audits, and guest service standard checks.',
            'requirements': [
              'Degree in Hospitality or Business Administration preferred.',
              '3+ years in upscale F&B outlets with at least 1 year in a lead/supervisor capacity.',
              'Knowledge of wine pairing, POS systems, and beverage costing.',
              'Active TIPs certification.'
            ]
          },
          {
            'recruiter_id': hotel_id,
            'title': 'Hospitality Management Trainee',
            'company': 'Hilton Worldwide',
            'logo': 'HW',
            'logo_bg': 'bg-blue-800 text-white',
            'location': 'Chicago, IL',
            'type': 'Internship',
            'experience': 'Entry-level (0-1 year)',
            'salary': '$20 - $24 / hour',
            'salary_min': 40000,
            'salary_max': 50000,
            'category': 'General Management',
            'description': 'Our global management program rotates candidates through Front Office, Housekeeping, Revenue Management, and F&B over 12 months, preparing you for assistant manager roles.',
            'requirements': [
              'Recent hospitality management graduates or final year students.',
              'Strong analytical capabilities and leadership potential.',
              'Mobility within the US is highly desirable.',
              'Fluent in English, bilingual capability is a strong asset.'
            ]
          }
        ]

        for job in initial_jobs:
            cursor.execute(
                """INSERT INTO jobs (recruiter_id, title, company, logo, logo_bg, location, type, experience, salary, salary_min, salary_max, category, description, requirements) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (
                    job['recruiter_id'],
                    job['title'],
                    job['company'],
                    job['logo'],
                    job['logo_bg'],
                    job['location'],
                    job['type'],
                    job['experience'],
                    job['salary'],
                    job['salary_min'],
                    job['salary_max'],
                    job['category'],
                    job['description'],
                    job['requirements']
                )
            )
            
        conn.commit()
        print("Jobs seeded successfully.")
        print("HospiHire database seeding completed successfully.")
        
    except Exception as e:
        if conn:
            conn.rollback()
        console_err = f"Error seeding restructured database: {e}"
        print(console_err)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    run_seed()
