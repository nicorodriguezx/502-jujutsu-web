# 502 Jujutsu - Martial Arts Academy Website

A modern, responsive website for 502 Jujutsu, a martial arts academy in Guatemala City specializing in self-defense using the Hermanos Valente methodology.

## 🎯 Overview

This project consists of:
- **Backend API** (Node.js/Express/PostgreSQL) - Content management and data storage
- **Admin Panel** (React/Vite/Tailwind) - Complete content management interface
- **Public Landing Page** (planned) - User-facing website with programs, testimonials, and merchandise

### Current Features
- **6 Martial Arts Programs** (First Steps through Law Enforcement training)
- **Complete Content Management** for all site sections
- **Merchandise Catalog** for in-person sales
- **Student Testimonials** with featured stories
- **Photo Gallery** with multiple categories
- **Class Schedule** management
- **Lead Management** for inquiries and WhatsApp contacts
- **Multi-language Support** (Spanish/English)

## 🛠 Tech Stack

### Backend
- **Node.js** (18.x+) with Express.js
- **PostgreSQL** (15.x+) with pg library
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: Helmet.js, CORS
- **Deployment**: Designed for Railway hosting

### Frontend (Admin Panel)
- **React** (19.x+) with modern hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Database
- **PostgreSQL** with explicit schema design
- **11 main tables**: programs, schedule_entries, instructors, gallery_images, announcements, merchandise, testimonials, site_content, contact_info, inquiries, admin_users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd 502-jujutsu-web
   npm install
   cd client && npm install && cd ..
   ```

2. **Set up database:**
   ```bash
   # Create PostgreSQL database
   createdb jujutsu_502

   # Run schema and seed data
   psql -d jujutsu_502 -f database/schema.sql
   psql -d jujutsu_502 -f database/seed.sql
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL and JWT_SECRET
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1: Backend API
   npm run dev

   # Terminal 2: Admin panel
   cd client && npm run dev
   ```

5. **Access the admin panel:**
   - Open http://localhost:5173
   - Create your first admin user via direct API call or database insert
   - Log in to manage content

## 📊 Database Schema

### Core Tables
- **programs** - Class offerings (First Steps, Little Champs, Juniors, Mujeres, Adultos, Seguridad)
- **schedule_entries** - Weekly class timetable
- **instructors** - Staff profiles with photos and bios
- **gallery_images** - Training photos, facilities, events
- **announcements** - News and academy updates
- **merchandise** - Academy merchandise for in-person sales
- **testimonials** - Student success stories and achievements
- **site_content** - Editable text blocks (hero, about, philosophy, merchandise, testimonials)
- **contact_info** - Contact details and social media links
- **inquiries** - Contact form submissions and WhatsApp tracking
- **admin_users** - Admin panel users with bcrypt-hashed passwords

## 🔧 Development

### Available Scripts
```bash
# Backend
npm run dev          # Start with --watch
npm start           # Production start
npm run setup-db    # Initialize database (schema + seed)
npm run create-admin # Create admin user

# Frontend (client/)
npm run dev         # Vite dev server
npm run build       # Production build
npm run preview     # Preview built app

# Database
psql -d jujutsu_502 -f database/migration-001.sql  # Run migrations
```

### Project Structure
```
502-jujutsu-web/
├── server/                 # Backend API
│   ├── index.js           # Express app entry
│   ├── db.js             # PostgreSQL connection
│   ├── middleware/       # Auth middleware
│   └── routes/           # CRUD route handlers
├── client/               # Admin panel frontend
│   ├── src/
│   │   ├── pages/        # Admin pages (CRUD interfaces)
│   │   ├── api.js        # Fetch wrapper with JWT
│   │   ├── AuthContext.jsx # Login state management
│   │   └── Layout.jsx    # Admin sidebar navigation
├── database/             # SQL schema and seed data
└── docs/                # Documentation (features.md, tech-stack.md)
```

## 🔐 Authentication

- JWT-based authentication with 24-hour token expiry
- Passwords hashed with bcrypt (12 rounds)
- Admin users managed through admin panel
- Automatic logout on token expiry or 401 responses

## 🚢 Deployment

### Backend (Railway)
- Automatic deployments via Git push
- PostgreSQL database hosted on Railway
- Environment variables for configuration

### Frontend
- Static build served from CDN
- API calls proxy to backend
- Image storage via Cloudflare R2

## 📝 API Reference

### Public Endpoints
- `POST /api/auth/login` - Admin authentication
- `GET /api/health` - Health check

### Protected Endpoints (require JWT)
- `GET|POST|PUT|DELETE /api/programs` - Program management
- `GET|POST|PUT|DELETE /api/schedule-entries` - Class schedules
- `GET|POST|PUT|DELETE /api/instructors` - Instructor profiles
- `GET|POST|PUT|DELETE /api/gallery-images` - Photo gallery
- `GET|POST|PUT|DELETE /api/announcements` - News management
- `GET|POST|PUT|DELETE /api/merchandise` - Product catalog management
- `GET|POST|PUT|DELETE /api/testimonials` - Student testimonials
- `GET|PUT|DELETE /api/site-content` - Content blocks
- `GET|PUT|DELETE /api/contact-info` - Contact details
- `GET|POST|PUT|DELETE /api/inquiries` - Lead tracking
- `GET|POST|PUT|DELETE /api/admin-users` - Admin user management

## 🎨 Design System

- **Primary Color**: Navy blue (#003366/#0D47A1)
- **Typography**: Sans-serif (Montserrat/Roboto/Open Sans)
- **Layout**: Mobile-first responsive design
- **Icons**: Lucide React icon library

## 📈 Features

### Admin Panel
- Complete CRUD interface for all content types
- Dashboard with resource counts
- Form validation and error handling
- Real-time content management

### Content Management
- Editable hero section, about page, contact info
- Class schedule management
- Instructor profile management
- Photo gallery with categories
- News/announcement publishing
- Merchandise catalog management
- Student testimonials management
- Inquiry tracking and status management

## 🔄 Database Migrations

When updating from previous versions:

1. **Run migration script:**
   ```bash
   psql -d jujutsu_502 -f database/migration-001.sql
   ```

2. **Recent changes include:**
   - Added merchandise and testimonials tables
   - New "First Steps" program (ages 2-5)
   - Updated Little Champs age range (5-9)
   - Updated branding to "Hermanos Valente"
   - New site content sections for merchandise and testimonials

## 🤝 Contributing

1. Create admin user via API or database
2. Log into admin panel at `/login`
3. Manage content through the web interface
4. All changes are immediately reflected in the database

### Admin Panel Navigation
- **Dashboard** - Content overview and statistics
- **Programas** - Manage martial arts programs (6 total)
- **Horarios** - Class schedule management
- **Instructores** - Instructor profiles
- **Galería** - Photo gallery management
- **Anuncios** - News and announcements
- **Mercancía** - Product catalog
- **Testimonios** - Student testimonials
- **Contenido** - Editable site content
- **Contacto** - Contact information
- **Consultas** - Lead management
- **Admins** - User management

## 📄 License

UNLICENSED - Private project