-- =============================================================================
-- Migration 002: Visual Enhancements
-- Adds support for background images and more visual content
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Add image_url column to programs table
-- Allows each program to have an optional header image
-- ---------------------------------------------------------------------------
ALTER TABLE programs ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ---------------------------------------------------------------------------
-- Add hero background image URLs to site_content
-- These will be used for the hero section background slideshow/carousel
-- ---------------------------------------------------------------------------
INSERT INTO site_content (section_key, content_text) VALUES
('hero_background_image_1', ''),
('hero_background_image_2', ''),
('hero_background_image_3', ''),
('hero_background_overlay_opacity', '0.6'),  -- Controls darkness overlay on hero images (0.0 to 1.0)
('hero_image_transition_interval', '5000')   -- Milliseconds between image transitions
ON CONFLICT (section_key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Add sample gallery images for different sections
-- Categories: 'training', 'facilities', 'events', 'hero', 'instructors'
-- Note: Hero category images should be uploaded by admins after setup
-- ---------------------------------------------------------------------------
INSERT INTO gallery_images (url, alt_text, caption, category, display_order, is_active) VALUES
(
    'https://images.unsplash.com/photo-1583473348853-7d2b2d9b4d1d?w=1920&q=80',
    'Estudiantes practicando técnicas de proyección',
    'Entrenamiento de técnicas Valente en acción',
    'training',
    1,
    TRUE
),
(
    'https://images.unsplash.com/photo-1563199930-52dcf6224e6b?w=1200&q=80',
    'Vista de las instalaciones del dojo',
    'Espacio amplio y seguro para entrenamiento',
    'facilities',
    1,
    TRUE
)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Add visual content keys for section backgrounds
-- These allow admins to customize background images for different sections
-- ---------------------------------------------------------------------------
INSERT INTO site_content (section_key, content_text) VALUES
('programas_background_style', 'light'),     -- 'light', 'dark', or 'image'
('schedule_background_style', 'light'),
('testimonials_background_style', 'light'),
('use_parallax_effects', 'true')             -- Enable/disable parallax scrolling effects
ON CONFLICT (section_key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Update existing content to be more visual-focused
-- ---------------------------------------------------------------------------
UPDATE site_content 
SET content_text = 'Defensa Personal Real con la Metodología Hermanos Valente'
WHERE section_key = 'hero_headline';

UPDATE site_content 
SET content_text = 'Transforma tu vida con Helio Gracie Jūjutsu. Clases para todas las edades en Ciudad de Guatemala.'
WHERE section_key = 'hero_subheadline';
