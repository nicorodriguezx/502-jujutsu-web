# 502 Jujutsu - Martial Arts Academy Website

A modern, responsive website for 502 Jujutsu, a martial arts academy in Guatemala City specializing in self-defense using the Hermanos Valente methodology.

## 🎯 Overview

This project consists of:
- **Backend API** (Node.js/Express/PostgreSQL) - Content management and data storage
- **Public Website** (React/Vite/Tailwind) - Professional landing page for visitors
- **Admin Panel** (React/Vite/Tailwind) - Complete content management interface

### Current Features
- **Professional Public Website** - Complete landing page with hero, programs, schedule, merchandise, testimonials, and contact sections
- **6 Martial Arts Programs** (First Steps through Law Enforcement training)
- **Complete Content Management** - All public and admin content managed through web interface
- **Advanced Image Management** - Direct file uploads with automatic WebP conversion and Cloudflare R2 storage
- **Dynamic Visual Content** - Hero background image carousel and program header images with hover effects
- **Merchandise Catalog** - Product showcase for in-person sales (kimonos, equipment, apparel)
- **Student Testimonials** - Success stories with featured content highlighting
- **Interactive Class Schedule** - Accordion-style weekly timetable with 25+ class entries
- **Lead Management** - Inquiry tracking and WhatsApp integration
- **Full Spanish Localization** - Guatemala City focus with proper cultural terminology
- **Photo Gallery** - Multi-category image management (training, facilities, events, hero backgrounds)
- **Social Media Integration** - Instagram and WhatsApp connectivity

## 🛠 Tech Stack

### Backend
- **Node.js** (18.x+) with Express.js
- **PostgreSQL** (15.x+) with pg library
- **Image Processing**: Sharp library for WebP conversion and optimization
- **Cloud Storage**: Cloudflare R2 with AWS SDK for scalable image hosting
- **File Upload**: Multer middleware for secure multipart form handling
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: Helmet.js with CSP, CORS
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
- Cloudflare R2 account (for image uploads)

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
   
   # Run visual enhancements migration
   psql -d jujutsu_502 -f database/migration-002-visual-enhancements.sql
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings:
   # - DATABASE_URL
   # - JWT_SECRET
   # - Cloudflare R2 credentials (for image uploads)
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1: Backend API
   npm run dev

   # Terminal 2: Admin panel
   cd client && npm run dev
   ```

5. **Access the applications:**
   - **Public Website**: Open http://localhost:5173 (professional landing page for visitors)
   - **Admin Panel**: Navigate to http://localhost:5173/admin (content management interface)
   - Create your first admin user via API call or database insert
   - Log in to the admin panel to manage all website content

## 📊 Database Schema

### Core Tables
- **programs** - Class offerings (First Steps ages 2-5, Little Champs ages 5-9, Juniors ages 11-17, Mujeres, Adultos, Seguridad)
- **schedule_entries** - Weekly class timetable with 25+ scheduled classes
- **instructors** - Staff profiles with photos and bios
- **gallery_images** - Training photos, facilities, events
- **announcements** - News and academy updates
- **merchandise** - Academy merchandise catalog for in-person sales
- **testimonials** - Student success stories with featured content support
- **site_content** - Editable text blocks for all public website sections
- **contact_info** - Contact details, WhatsApp, Instagram, and address
- **inquiries** - Contact form submissions and lead tracking
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
- Single React application serving both public website and admin panel
- **Public Website**: Root URL (`/`) - Professional landing page for visitors
- **Admin Panel**: `/admin` route - Complete content management interface
- API calls proxy to backend with proper authentication handling
- Image storage via Cloudflare R2 (planned)
- Mobile-first responsive design with modern UI components

## 📝 API Reference

### Public Endpoints (No Authentication Required)
- `GET /api/health` - Health check
- `GET /api/public/site-content` - All editable site content as key-value pairs
- `GET /api/public/contact-info` - Contact details and social media links
- `GET /api/public/programs` - Active martial arts programs with descriptions
- `GET /api/public/schedule` - Weekly class schedule with program associations
- `GET /api/public/instructors` - Active instructor profiles
- `GET /api/public/gallery[?category=]` - Photo gallery with optional category filter
- `GET /api/public/announcements` - Published news and announcements
- `GET /api/public/merchandise` - Available merchandise catalog
- `GET /api/public/testimonials` - Active student testimonials
- `POST /api/public/inquiries` - Submit contact form inquiries
- `POST /api/auth/login` - Admin authentication

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
- **Secondary Colors**: Light gray, blue, black (per academy branding)
- **Typography**: Sans-serif (Montserrat/Roboto/Open Sans)
- **Layout**: Mobile-first responsive design
- **Icons**: Lucide React icon library

### Visual Content Management

#### Hero Background Images
The hero section supports dynamic background images that rotate automatically:
- Images are stored in the `gallery_images` table with category `"hero"`
- Configure transition interval via `hero_image_transition_interval` in site_content
- Adjust overlay darkness via `hero_background_overlay_opacity` (0.0 to 1.0)
- Falls back to gradient background if no hero images exist

#### Program Images
Each program can have an optional header image:
- Add `image_url` when creating/editing programs in admin panel
- Images display in program cards with hover effects
- Recommended size: 800x600px or similar 4:3 aspect ratio

#### Gallery Categories
Images are organized by category:
- `hero` - Hero section background images
- `training` - Training session photos
- `facilities` - Dojo and equipment photos
- `events` - Special events and seminars
- `instructors` - Instructor profile photos
- `students` - Student achievement photos

### Image Upload System

#### Direct File Uploads
Admins can upload images directly instead of using URLs:
- **Gallery Images**: Upload via admin panel with automatic WebP conversion
- **Program Images**: Upload program images directly in Programs page
- **Automatic Optimization**: All uploads converted to WebP format (25-80% smaller)
- **Cloudflare R2 Storage**: Images stored in R2 with global CDN distribution

#### WebP Conversion
All uploaded images are automatically optimized:
- Converted to WebP format for maximum compression
- Multiple presets available (hero: 1920px, program: 1200px, gallery: 1600px)
- Quality: 85% (excellent balance of quality and file size)
- Progressive encoding for faster loading

#### Image Upload Configuration
Set up Cloudflare R2 in `.env`:
```bash
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=502-jujutsu-images
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

See `docs/image-upload-system.md` for complete setup instructions.

## 📈 Features

### Admin Panel
- Complete CRUD interface for all content types
- Content management for both public website and admin panel
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

2. **Migration 001 includes:**
   - Added `merchandise` table for product catalog management
   - Added `testimonials` table for student success stories
   - New "First Steps" program (ages 2-5) with display order adjustments
   - Updated Little Champs age range from 3-10 to 5-9
   - Updated branding from "Valente Brothers" to "Hermanos Valente"
   - Translated all program target audiences to Spanish
   - Added comprehensive site content keys for public website sections
   - Populated complete weekly class schedule with 25+ entries

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