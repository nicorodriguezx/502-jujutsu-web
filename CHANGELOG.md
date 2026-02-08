# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-08

### 🚀 **Major Feature Release - Public Website Launch**

Complete implementation of the public-facing website alongside the existing admin panel, featuring a professional landing page, comprehensive content management, and full Spanish localization for Guatemala City.

### ✨ **Added**

#### **🌐 Public Website Infrastructure**
- **Complete Public Site** - New React application serving the landing page at root URL (`/`)
- **Public Layout Component** - Fixed navigation header with mobile menu and footer
- **Public Home Page** - Comprehensive landing page with hero, programs, schedule, merchandise, testimonials, and contact sections
- **Public API Routes** - New `/api/public/*` endpoints for unauthenticated content access
- **Route Architecture** - Separated public routes from admin routes with proper middleware

#### **🏠 Public Content Sections**
- **Hero Section** - Professional hero with academy branding, call-to-action buttons, and contact info bar
- **Programs Showcase** - Interactive display of all 6 martial arts programs with icons and descriptions
- **Class Schedule** - Accordion-style weekly schedule with program-specific class details
- **Merchandise Catalog** - Product showcase with in-person purchase call-to-action
- **Testimonials Gallery** - Student success stories with featured content highlighting
- **Contact & Location** - Complete contact information with WhatsApp integration and Google Maps embed

#### **🇪🇸 Spanish Language & Cultural Adaptation**
- **Complete Localization** - All content translated to Spanish with Guatemala focus
- **Cultural Terms** - Proper Spanish terminology ("niños", "jóvenes", "mujeres", "adultos", "profesionales")
- **Local Contact Info** - Guatemala City address and local business phone number (+502 3746 6617)
- **WhatsApp Integration** - Primary communication channel with pre-configured messages
- **Instagram Integration** - Social media presence (@502jujutsu) with proper URLs

#### **🔧 Technical Enhancements**
- **Modern UI Framework** - Mobile-first responsive design with Tailwind CSS
- **Interactive Components** - Schedule accordion, smooth scrolling navigation, mobile menu
- **Content Management** - All public content editable through existing admin panel
- **SEO Optimization** - Proper meta tags, titles, and structured content
- **Performance** - Optimized React components with efficient state management

#### **📊 Database Schema Extensions**
- **New Tables**:
  - `merchandise` - Product catalog for in-person sales (kimonos, equipment, apparel)
  - `testimonials` - Student success stories with featured content support
- **New Program** - "First Steps" program for ages 2-5 (discipline and coordination through play)
- **Updated Programs** - Little Champs age range corrected (5-9 instead of 3-10)
- **Content Localization** - All program target audiences translated to Spanish
- **Branding Updates** - "Valente Brothers" → "Hermanos Valente" methodology throughout

#### **🗓️ Class Schedule Implementation**
- **Complete Timetable** - 25+ class entries covering morning, afternoon, and evening sessions
- **Program Diversity** - Classes for all age groups and skill levels
- **Flexible Scheduling** - Morning sessions (6:00-13:00), afternoon kids classes (16:15-17:50), evening adult classes (18:00-20:30)
- **Specialized Training** - Fighting foundations, sparring, striking, and advanced techniques

### 🔄 **Changed**
- **Application Structure** - Single React app serving both public site and admin panel
- **Routing System** - Public routes (`/`) separated from admin routes (`/admin/*`)
- **Navigation Flow** - Admin login redirects to `/admin`, public navigation updated
- **Content Architecture** - All site content now supports public display
- **Typography** - Modern font stack with improved readability

### 📝 **Migration & Setup Notes**
- **Database Migration** - Run `database/migration-001.sql` to add new tables and update existing data
- **Environment Setup** - No additional environment variables required
- **Content Population** - New content sections will be populated via seed data or admin panel
- **URL Structure** - Public website at root URL (`/`), admin panel at `/admin`
- **Backward Compatibility** - All existing admin panel functionality preserved

## [0.1.0] - 2026-02-07

### 🎉 **Initial Release - Complete Martial Arts Academy Management System**

This is the first complete version of the 502 Jujutsu martial arts academy website, featuring a full content management system with admin panel and comprehensive database schema.

### ✨ **Added**

#### **Core Platform Features**
- **Complete Backend API** - Node.js/Express server with PostgreSQL database
- **Admin Panel** - Full React/Vite frontend for content management
- **Authentication System** - JWT-based admin authentication with bcrypt password hashing
- **Database Schema** - 11 PostgreSQL tables with proper relationships and constraints

#### **Content Management System**
- **Programs Management** - CRUD for 6 martial arts programs (First Steps through Law Enforcement)
- **Schedule Management** - Class timetables with program associations
- **Instructor Profiles** - Staff management with photos and bios
- **Photo Gallery** - Multi-category image management (training, facilities, events, etc.)
- **News & Announcements** - Publishing system with draft/publish dates
- **Site Content** - Editable text blocks for all static content
- **Contact Information** - Dynamic contact details management
- **Lead Management** - Inquiry tracking with WhatsApp integration

#### **New Features (Latest Update)**
- **🛍️ Merchandise Catalog** - Product management for in-person sales (kimonos, equipment)
- **💬 Testimonials System** - Student success stories with featured content
- **First Steps Program** - New age 2-5 introductory martial arts program
- **Updated Branding** - "Hermanos Valente" methodology throughout

#### **Technical Implementation**
- **Database Design** - Explicit PostgreSQL schema with 11 tables
- **API Architecture** - RESTful endpoints with proper error handling
- **Frontend Framework** - React 19 with modern hooks and routing
- **UI Components** - Tailwind CSS with responsive design
- **Security** - Helmet.js, CORS, input validation
- **Development Tools** - Vite for fast builds, ESLint for code quality

#### **Database Tables**
- `programs` - Martial arts program offerings
- `schedule_entries` - Class timetables
- `instructors` - Staff profiles
- `gallery_images` - Photo management
- `announcements` - News and updates
- `merchandise` - Product catalog
- `testimonials` - Student success stories
- `site_content` - Editable text blocks
- `contact_info` - Contact details
- `inquiries` - Lead tracking
- `admin_users` - Administrator accounts

#### **API Endpoints**
- `POST /api/auth/login` - Admin authentication
- `GET /api/health` - Health check
- `GET|POST|PUT|DELETE /api/programs` - Program management
- `GET|POST|PUT|DELETE /api/schedule-entries` - Schedule management
- `GET|POST|PUT|DELETE /api/instructors` - Instructor management
- `GET|POST|PUT|DELETE /api/gallery-images` - Photo gallery
- `GET|POST|PUT|DELETE /api/announcements` - News management
- `GET|POST|PUT|DELETE /api/merchandise` - Product catalog
- `GET|POST|PUT|DELETE /api/testimonials` - Testimonials
- `GET|PUT|DELETE /api/site-content` - Content blocks
- `GET|PUT|DELETE /api/contact-info` - Contact details
- `GET|POST|PUT|DELETE /api/inquiries` - Lead management
- `GET|POST|PUT|DELETE /api/admin-users` - Admin user management

### 🔧 **Technical Details**

#### **Backend Stack**
- **Node.js 18+** with Express.js framework
- **PostgreSQL 15+** with pg driver
- **Security**: Helmet.js, CORS, bcrypt, JWT
- **Environment**: dotenv configuration

#### **Frontend Stack**
- **React 19** with modern hooks
- **Vite** for development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

#### **Database Schema**
- **11 tables** with proper foreign keys
- **Automatic triggers** for `updated_at` timestamps
- **Indexes** for performance optimization
- **Check constraints** for data integrity

### 📦 **Installation & Setup**

#### **Prerequisites**
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

#### **Quick Start**
```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Database setup
createdb jujutsu_502
psql -d jujutsu_502 -f database/schema.sql
psql -d jujutsu_502 -f database/seed.sql

# Start development servers
npm run dev                    # Backend on :3000
cd client && npm run dev       # Admin panel on :5173
```

### 🎨 **Features Overview**

#### **Admin Panel Capabilities**
- **Dashboard** - Overview with content statistics
- **Programs Management** - Complete CRUD for martial arts offerings
- **Schedule Planning** - Class timetables and availability
- **Content Editing** - All site text and contact information
- **Media Management** - Photo galleries and instructor profiles
- **Lead Tracking** - Inquiry management and status updates
- **User Management** - Admin account administration

#### **Content Types Managed**
- **6 Martial Arts Programs** (ages 2-5 through professional training)
- **Class Schedules** with flexible booking
- **Instructor Bios** with professional photos
- **Photo Galleries** across multiple categories
- **News Articles** with publishing workflow
- **Product Catalog** for academy merchandise
- **Student Testimonials** with featured content
- **Contact Information** (phone, WhatsApp, social media)
- **Lead Database** from website inquiries

### 🔒 **Security Features**
- **JWT Authentication** with 24-hour token expiry
- **Password Hashing** using bcrypt (12 rounds)
- **Input Validation** and sanitization
- **SQL Injection Protection** via parameterized queries
- **CORS Configuration** for cross-origin requests
- **Helmet.js** security headers

### 🚀 **Performance & Scalability**
- **Database Indexing** for query optimization
- **Lazy Loading** for images and components
- **Responsive Design** for mobile optimization
- **Progressive Web App** capabilities
- **CDN Ready** for image storage (Cloudflare R2)

### 📝 **Configuration**

#### **Environment Variables**
```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/jujutsu_502
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
```

#### **Database Connection**
- **Local Development**: PostgreSQL on localhost
- **Production Ready**: Railway PostgreSQL hosting
- **Migration Support**: SQL scripts for schema updates

### 🎯 **Use Cases Supported**

#### **Academy Management**
- Daily class schedule updates
- Program enrollment tracking
- Instructor profile management
- Content marketing and SEO

#### **Customer Engagement**
- WhatsApp integration for inquiries
- Social media content management
- Student testimonial collection
- Merchandise catalog display

#### **Administrative Tasks**
- Content updates without developer intervention
- Lead management and follow-up
- Photo gallery curation
- News and announcement publishing