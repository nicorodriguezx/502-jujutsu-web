# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.6] - 2026-02-12

### ✨ **Added - Hero Section Logo & Text Updates**

- **Logo Integration** - Added prominent transparent PNG logo above hero headline
- **Typography Adjustments** - Reduced headline size for better visual hierarchy with logo
- **Content Update** - Updated subheadline to "Transforma tu vida con Valente Brothers Jūjutsu"

## [0.2.5] - 2026-02-10

### ✨ **Added - Major Frontend Redesign with Tailwind CSS & Modern UI/UX**

#### **🎨 Complete Design System Overhaul**
- **Brand Color Palette** - Replaced hardcoded colors with semantic Tailwind color scales:
  - Navy: 50-950 scale (`#003366` → `navy-600`, `#0D47A1` → `navy-500`)
  - Gold: 50-800 scale for featured testimonials (`#D4A017` → `gold-400`)
- **Typography System** - Switched to Rajdhani for stronger brand identity:
  - Replaced Inter with Rajdhani font family (weights 300-700)
- **Custom Animations** - Added scroll-triggered entrance animations:
  - Fade-in, fade-up, scale-in effects with IntersectionObserver
  - Staggered children animations for grid layouts
  - Float and pulse effects for subtle motion
- **Enhanced Shadows** - Custom shadow utilities:
  - `shadow-soft`, `shadow-soft-lg`, `shadow-soft-xl` for depth
  - `shadow-glow-navy`, `shadow-glow-gold` for premium feel

#### **🌐 Redesigned Public Layout & Navigation**
- **Scroll-Aware Header** - Dynamic header that transitions from transparent to frosted glass
  - Starts transparent over hero, becomes solid white with backdrop blur on scroll
  - Adaptive nav link colors (white → gray) and CTA button styles
- **Enhanced Mobile Menu** - Modern dropdown with smooth animations and body scroll lock
  - Rounded menu items with hover states and staggered entrance
  - Clean close button and improved accessibility
- **Floating WhatsApp Button** - Fixed FAB with scale animation and brand positioning
- **Premium Dark Footer** - Complete redesign with gradient background and structured layout
  - 4-column responsive grid with navigation, contact, and CTA sections
  - Enhanced brand presentation and social links

#### **🏠 Transformed Home Page Experience**
- **Hero Section Enhancement** - Dramatic typography improvements and staggered animations
  - Larger headings (up to `text-7xl`), enhanced CTA buttons with hover lift
  - Smooth carousel transitions and improved overlay controls
- **Scroll-Triggered Animations** - Every section animates in as you scroll
  - IntersectionObserver-powered entrance effects throughout the page
  - Staggered grid animations for programs, testimonials, and merchandise
- **Dark Código 753 Section** - Complete visual transformation
  - Dark gradient background (`gray-900` → `navy-950`) for dramatic impact
  - Glassmorphism cards with glowing number circles and frosted badges
  - Enhanced spiritual/physical/mental component presentation
- **Premium Card Designs** - Consistent rounded corners, soft shadows, and hover effects
  - Program cards with gradient icons and glow effects on hover
  - Featured testimonials with gold accent rings and star indicators
  - Enhanced merchandise and contact cards with better spacing

#### **📱 Improved Mobile Experience**
- **Responsive Typography** - Scalable font sizes from mobile to desktop
- **Touch-Friendly Interactions** - Larger tap targets and improved spacing
- **Smooth Transitions** - All interactive elements have polished hover/focus states
- **Performance Optimized** - Efficient scroll event handling and animation triggers

#### **🛠️ Developer Experience Improvements**
- **Semantic Color Tokens** - Replaced all magic color values with maintainable design tokens
- **Reusable Component Classes** - Added `.section-badge` and animation utility classes
- **Clean Code Structure** - Organized component styling with consistent patterns
- **Build Optimization** - Maintained fast build times with enhanced CSS output

#### **🎨 Enhanced Image Management System**
- **Site Image Architecture** - Migrated from category-based gallery images to site-specific images in `site_content`
- **Hero Section** - Replaced carousel with single static image for better performance and readability
- **Admin Gallery Refactor** - Redesigned with separate "Site Section Images" and "General Gallery" sections
- **Merchandise Simplification** - Removed category field from merchandise system for streamlined management
- **Mobile Enhancements** - Added horizontal swipe for merchandise catalog and collapsible admin sidebar

#### **🖼️ New Image Upload for Modalidad de Entrenamiento Cards**
- **Admin Panel** - New "Modalidad de Entrenamiento — Imágenes" section with upload interfaces for both training modality cards
- **File Upload** - Support for image uploads (auto-optimized to WebP) and manual URL entry with live previews
- **Public Display** - Modalidad cards now show uploaded images with hover effects, matching "Nuestros Programas" card style

#### **📁 Files Modified**
- `client/tailwind.config.js` - Complete design system with custom colors, animations, and shadows
- `client/src/index.css` - Scroll animations, component utilities, horizontal scroll utilities, and enhanced base styles
- `client/src/PublicLayout.jsx` - Redesigned header, mobile menu, footer, and floating FAB
- `client/src/pages/public/HomePage.jsx` - Full page redesign with scroll animations, dark Código 753 section, single hero image, and mobile merchandise swipe
- `client/src/pages/GalleryImages.jsx` - Complete refactor with site images management and general gallery section
- `client/src/pages/QuienesSomos.jsx` - Streamlined admin form with team photo moved to site images
- `server/routes/galleryImages.js` - Removed category requirement and validation
- `server/routes/siteContent.js` - Enhanced to allow empty strings for image removal

## [0.2.4] - 2026-02-10

### ✨ **Added - Visual Section Dividers**

#### **🖼️ 16:9 Image Dividers**
- Added 3 visual section breaks between major website sections:
  - Metodología → Quiénes Somos: Team/group photo
  - Modalidad → Código 753: Philosophical/meditative training image
  - Horarios → Mercancía: Energy-filled group training scene
- 16:9 aspect ratio with lazy loading and subtle gradient overlays

#### **⚙️ Admin Management**
- Added "Divisores entre Secciones" section to Gallery admin page
- File upload and URL input with WebP conversion
- Individual divider cards with preview and alt text management

#### **🗃️ Database Updates**
- Added 6 new site_content keys for divider images and alt text
- Integrated into Prisma seed for initial setup

### 📊 **Files Modified**
- `client/src/pages/public/HomePage.jsx` - SectionDivider component and insertions
- `client/src/pages/GalleryImages.jsx` - Divider admin management interface
- `prisma/seed.js` - Database keys

## [0.2.3] - 2026-02-10

### ✨ **Added - Complete "Quienes Somos" Content Management & Enhanced Public Website**

#### **📝 New Admin Content Management System**
- **"Quienes Somos" Admin Page** - Complete content management for academy information
  - About Us section with headline, description, and optional team photo
  - Mission statement with customizable headline and text
  - Purpose statement with dedicated content block
  - Methodology description for Valente Brothers system
  - Código 753 philosophy with detailed spiritual, physical, and mental components
- **Comprehensive Content Fields** - 18+ editable content keys for complete customization
- **Real-time Content Updates** - Save individual fields or entire sections
- **Admin Navigation Enhancement** - Added "Quienes Somos" to admin sidebar with heart icon

#### **🌐 Enhanced Public Website Experience**
- **New "Metodología" Section** - Dedicated methodology showcase with Código 753 introduction
  - Professional section header with "Nuestro Sistema" badge
  - Methodology description with Valente Brothers branding
  - Interactive Código 753 preview linking to philosophy section
  - Visual design with gradient accent elements
- **Enhanced "Quienes Somos" Section** - Complete about page with mission and purpose
  - Team photo support with optional display
  - Mission statement with target icon and gradient background
  - Purpose statement with eye icon and clean card design
  - Improved content structure and visual hierarchy
- **New "Modalidad" Section** - Training modalities showcase
  - Group classes vs. private classes comparison
  - Detailed descriptions for each training approach
  - Visual cards with academy branding colors
- **Improved "Código 753" Philosophy Section** - Enhanced presentation
  - Three-component breakdown (Spiritual 7, Physical 5, Mental 3)
  - Interactive virtue/element/state tags with academy colors
  - Detailed descriptions for each component
  - Professional grid layout with gradient circles

#### **🧭 Navigation & Routing Updates**
- **Admin Layout Enhancement** - Added Quienes Somos route and navigation item
- **Public Layout Updates** - Enhanced navigation menu with new sections:
  - Added "Metodología" link
  - Added "Quienes Somos" link
  - Added "Código 753" link (renamed from "Filosofía")
  - Removed "Testimonios" from navigation
- **Scroll Behavior** - Updated hero scroll indicator to link to methodology section

#### **🎨 Visual Design Improvements**
- **Section Background Alternation** - Alternating gray/white backgrounds for better visual flow
- **Enhanced Typography** - Improved text hierarchy and readability
- **Professional Card Designs** - Consistent card styling throughout new sections
- **Icon Integration** - Strategic use of Lucide React icons for visual enhancement
- **Mobile Responsiveness** - All new sections fully responsive across devices

#### **📊 Database Content Expansion**
- **18 New Content Keys** - Comprehensive content management for all new sections:
  - `quienes_somos_headline`, `quienes_somos_description`, `quienes_somos_team_photo_url`
  - `quienes_somos_mision_headline`, `quienes_somos_mision`
  - `quienes_somos_proposito_headline`, `quienes_somos_proposito`
  - `methodology_headline`, `methodology`
  - `codigo_753_intro`, `codigo_753_spiritual*`, `codigo_753_physical*`, `codigo_753_mental*`
  - `modalidad_*` keys for training modality content
- **Updated Seed Data** - Complete Spanish content for Guatemala market
- **Legacy Compatibility** - Maintained backward compatibility with existing content keys

### 🔄 **Changed**
- **Homepage Section Reordering** - Strategic section placement for better user journey
- **Navigation Flow** - Updated scroll targets and section linking
- **Content Architecture** - Enhanced content organization for better user experience
- **Database Seed Updates** - Expanded seed data with comprehensive Spanish content

### 📚 **Content Management Features**
- **Section-based Organization** - Logical grouping of related content fields
- **Individual Field Saving** - Save specific content without affecting other fields
- **Bulk Section Saving** - Save entire content sections at once
- **Content Preview Integration** - Real-time preview of changes on public site
- **Error Handling** - Comprehensive error messages and validation feedback

### 🎯 **User Experience Enhancements**
- **Progressive Content Discovery** - Methodology introduction leads to detailed philosophy
- **Clear Information Hierarchy** - Mission and purpose prominently displayed
- **Interactive Navigation** - Smooth scrolling between related sections
- **Cultural Relevance** - Content tailored for Guatemala City martial arts community
- **Professional Presentation** - Academy values and philosophy clearly communicated

## [0.2.2] - 2026-02-09

### 🔄 **Major Infrastructure Migration - Prisma ORM Integration**

Complete migration from raw PostgreSQL queries to Prisma ORM for improved type safety, maintainability, and developer experience.

#### **🏗️ Database Layer Modernization**
- **Prisma Client Integration** - Replaced direct `pg` library usage with Prisma ORM
  - Type-safe database operations with auto-generated TypeScript types
  - Improved SQL injection protection through parameterized queries
  - Better error handling and connection management
  - Singleton pattern for database client instance
- **Schema Definition** - Complete Prisma schema (`prisma/schema.prisma`) defining all 11 database models:
  - `Program`, `ScheduleEntry`, `Instructor`, `GalleryImage`, `Announcement`
  - `SiteContent`, `ContactInfo`, `Inquiry`, `Merchandise`, `Testimonial`, `AdminUser`
  - Proper relationships, indexes, and constraints
  - PostgreSQL-specific type mappings (`@db.Uuid`, `@db.Timestamptz`, `@db.Time`, etc.)

#### **📊 Data Seeding & Migration**
- **Prisma Seed System** (`prisma/seed.js`) - Comprehensive data seeding with all initial content:
  - 6 martial arts programs with complete descriptions
  - 37 site content entries (hero, about, methodology, etc.)
  - 7 contact information entries (phone, WhatsApp, address, etc.)
  - 32 schedule entries across all programs and time slots
  - 2 placeholder gallery images for training and facilities
  - Admin user creation with secure password hashing
- **Migration Scripts** - Seamless transition from existing SQL-based setup

#### **🔧 API Route Modernization**
- **Complete Route Refactoring** - All 13 API route files updated to use Prisma:
  - `adminUsers.js`, `announcements.js`, `auth.js`, `contactInfo.js`, `galleryImages.js`
  - `inquiries.js`, `instructors.js`, `merchandise.js`, `programs.js`, `public.js`
  - `scheduleEntries.js`, `siteContent.js`, `testimonials.js`
- **Consistent CRUD Operations** - Standardized create, read, update, delete patterns
- **Error Handling** - Improved error responses and validation

#### **🛠️ Development Tools & Scripts**
- **Prisma CLI Integration** - New npm scripts for database management:
  - `prisma:generate` - Generate Prisma client
  - `prisma:pull` - Pull database schema from existing database
  - `prisma:migrate` - Run database migrations
  - `prisma:studio` - Launch Prisma Studio GUI
  - `prisma:seed` - Populate database with initial data
- **Postinstall Automation** - Automatic Prisma client generation on dependency installation

#### **🔧 Utility Enhancements**
- **Time Formatting Utilities** (`server/utils/formatters.js`)
  - `formatTime()` - Convert Prisma DateTime to "HH:MM:SS" strings
  - `parseTime()` - Parse time strings for Prisma Time fields
  - Proper UTC handling for database compatibility

### 🔧 **Changed**
- **Dependencies Updated**:
  - Added `@prisma/client@^6.19.2` - Type-safe database client
  - Added `prisma@^6.19.2` (dev) - Prisma CLI and studio
  - Removed direct `pg` dependency (now handled by Prisma)
- **Database Connection** - Migrated from `pg.Pool` to `PrismaClient` singleton
- **Build Process** - Postinstall script now generates Prisma client automatically

### 📦 **Database Schema Preservation**
- **Zero Data Loss** - All existing table structures and data preserved
- **Backward Compatibility** - Existing API contracts maintained
- **Migration Path** - Smooth transition from SQL-based to ORM-based architecture

### 🏗️ **Architecture Benefits**
- **Type Safety** - Compile-time validation of database queries
- **Developer Experience** - IntelliSense, auto-completion, and better debugging
- **Maintainability** - Centralized schema definition and automated migrations
- **Performance** - Optimized query generation and connection pooling
- **Future-Proof** - Modern ORM foundation for scaling and feature development

## [0.2.1] - 2026-02-09

### ✨ **Added - Complete Image Management & Visual Enhancement System**

#### **📤 Direct File Upload**
- **File Upload in Admin Panel** - Upload images directly instead of pasting URLs
  - Gallery Images page supports file upload with toggle between upload/URL modes
  - Programs page supports file upload for program images
  - Real-time upload progress indicators
  - Image preview after successful upload
- **Multiple Upload Support** - Batch upload up to 10 images at once
- **Supported Formats** - JPEG, PNG, WebP, GIF (all converted to WebP)

#### **🎨 Automatic WebP Conversion**
- **Smart Image Processing** - All uploads automatically converted to WebP format
  - 25-35% smaller than JPEG at same quality
  - 80%+ smaller than PNG for photos
  - Lossless quality at high compression ratios
- **Image Optimization** - Sharp library handles conversion
  - Configurable quality (default 85%)
  - Smart resizing based on preset
  - Progressive encoding for faster loading
  - Effort level 6 (maximum compression)
- **Multiple Presets** - Pre-configured settings for different use cases:
  - `hero`: 1920px width, 85% quality (hero backgrounds)
  - `program`: 1200px width, 85% quality (program cards)
  - `gallery`: 1600px width, 85% quality (gallery images)
  - `thumbnail`: 400px width, 80% quality (thumbnails)
  - `merchandise`: 800px width, 85% quality (products)

#### **☁️ Cloudflare R2 Storage Integration**
- **S3-Compatible Storage** - Seamless upload to Cloudflare R2
  - No egress fees (free bandwidth)
  - Global CDN distribution included
  - Secure credential-based access
  - Public URL generation
- **R2 Upload Service** (`server/services/r2Upload.js`)
  - Complete upload pipeline handling
  - Automatic filename generation with timestamps
  - Secure file deletion support
  - Error handling and retry logic
- **Environment Configuration** - R2 credentials in .env:
  - `CLOUDFLARE_R2_ACCOUNT_ID`
  - `CLOUDFLARE_R2_ACCESS_KEY_ID`
  - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
  - `CLOUDFLARE_R2_BUCKET_NAME`
  - `CLOUDFLARE_R2_PUBLIC_URL`

#### **🔌 Upload API Endpoints**
- **POST /api/upload/image** - Upload single image with WebP conversion
  - Multipart form data support
  - Query params for preset, width, quality
  - Returns public URL
- **POST /api/upload/multiple** - Batch upload multiple images
  - Process up to 10 images in parallel
  - Returns array of URLs
- **DELETE /api/upload/image** - Delete image from R2 storage
  - Removes file from bucket
  - Validates R2 URL before deletion
- **GET /api/upload/presets** - Get available image processing presets

#### **🛡️ Security & Validation**
- **File Type Validation** - Only image formats allowed
- **File Size Limit** - 10MB maximum per file
- **JWT Authentication** - All upload endpoints protected
- **Secure Credentials** - R2 keys stored in environment variables
- **Error Handling** - Comprehensive error messages and logging

#### **🎯 Admin Panel Enhancements**
- **Gallery Images Page** - Enhanced with upload support
  - Toggle between "Subir archivo" and "URL externa"
  - File input with drag-drop support
  - Upload progress indicator
  - Automatic URL population after upload
  - Image preview with error handling
- **Programs Page** - File upload for program images
  - Upload button with preset (program size)
  - "Or" divider for URL input
  - Live image preview
  - Both upload and URL input available

### 🔧 **Changed**
- **Dependencies Added**:
  - `@aws-sdk/client-s3@^3.710.0` - S3-compatible client for R2
  - `multer@^1.4.5-lts.1` - File upload middleware
  - `sharp@^0.33.5` - High-performance image processing
- **Server Architecture** - New upload service layer
- **.env.example** - Updated with R2 configuration template

### 🔧 **Server Configuration**
- **Content Security Policy** - Updated Helmet configuration to allow R2 image domains
  - Added `*.r2.dev` and `*.cloudflare.com` to allowed image sources
  - Supports Cloudflare R2 CDN images in admin panel and public site

### 📚 **Documentation Added**
- **`docs/image-upload-system.md`** - Complete technical documentation for image upload system
- **`docs/image-upload-quickstart.md`** - Quick setup guide for image uploads
- **`docs/image-upload-summary.md`** - Feature overview and implementation summary
- **`docs/visual-enhancements-summary.md`** - Visual enhancements overview and features
- **`docs/visual-enhancements-setup.md`** - Setup instructions for visual features
- **`docs/visual-enhancements-implementation.md`** - Technical implementation details

### 📦 **Technical Details**
- **Memory-based Upload** - Files processed in-memory (no temp files)
- **Parallel Processing** - Multiple images processed simultaneously
- **Cache Control** - Images cached for 1 year (`max-age=31536000`)
- **Content Type** - Proper `image/webp` MIME type set
- **Progressive Enhancement** - Falls back to URL input if upload fails

#### **📸 Background Images & Visual Content**
- **Hero Background Images** - Support for dynamic background image carousel in hero section
  - Fetch images from gallery with "hero" category
  - Automatic slideshow with configurable transition intervals
  - Configurable overlay opacity for text readability
  - Fallback to gradient if no images available
- **Program Images** - Added optional `image_url` field to programs table
  - Display program images in card headers on public site
  - Hover effects and visual transitions on program cards
  - Admin interface updated to manage program images
- **Gallery Categories** - Added "hero" category to gallery_images table
  - Allows dedicated management of hero background images
  - Separate from training/facilities/events images
- **Visual Content Keys** - New site_content keys for visual customization:
  - `hero_background_image_1`, `hero_background_image_2`, `hero_background_image_3`
  - `hero_background_overlay_opacity` - Controls darkness of hero overlay
  - `hero_image_transition_interval` - Milliseconds between image transitions
  - `programas_background_style`, `schedule_background_style`, `testimonials_background_style`
  - `use_parallax_effects` - Enable/disable parallax scrolling

#### **🎨 Enhanced UI Components**
- **Enhanced Program Cards** - Visual improvements to program display
  - Image headers with gradient overlays
  - Hover animations (scale, shadow, translate)
  - Better visual hierarchy with icons and imagery
- **Hero Section Carousel** - Smooth transitions between background images
  - Cross-fade effect with opacity transitions
  - Automatic rotation based on configurable interval
  - Multiple image support with array-based state management

#### **🛠 Admin Panel Updates**
- **Gallery Management** - Added "hero" to available image categories
- **Program Management** - New image URL field with preview support
  - Optional image URL input in program edit form
  - Help text explaining image usage
  - Full CRUD support for program images

### 🔧 **Changed**
- **HomePage Component** - Refactored to support dynamic background images
  - New state management for hero images and carousel
  - useEffect hook for automatic image transitions
  - Enhanced visual styling throughout
- **Hero Content** - Updated default hero text to be more action-oriented
  - More concise headline emphasizing Valente methodology
  - Transformative subheadline focusing on lifestyle change

### 📦 **Database Changes**
- **Migration 002** - Visual enhancements schema updates
  - Added `image_url` column to `programs` table (nullable TEXT)
  - Added hero-specific content keys to `site_content`
  - Sample gallery images for hero category (using Unsplash placeholders)
  - Background style configuration keys

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
- **Database Migration** - Run `database/migration-002-visual-enhancements.sql` to add visual enhancements schema
- **Environment Setup** - Add Cloudflare R2 credentials to `.env` file (see prerequisites)
- **Content Population** - Hero background images can be added via admin gallery (category: "hero")
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