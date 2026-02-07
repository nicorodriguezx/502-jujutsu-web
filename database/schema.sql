-- =============================================================================
-- 502 Jujutsu - Database Schema
-- PostgreSQL 15+
--
-- Every table, column, type, and constraint is written out explicitly.
-- No ORMs, no magic. Read top to bottom.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- 1. programs
--
-- The six class offerings: First Steps, Little Champs, Juniors, Mujeres,
-- Adultos, Seguridad/Cumplimiento de la Ley. Each row is one program card
-- shown on the "Nuestros Programas" section.
-- ---------------------------------------------------------------------------
CREATE TABLE programs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,                -- "Little Champs"
    slug            TEXT        NOT NULL UNIQUE,         -- "little-champs"
    subtitle        TEXT,                                -- "Edades 3-10"
    description     TEXT        NOT NULL,                -- full card body text
    age_range_min   INTEGER,                             -- 3  (nullable for programs without age range)
    age_range_max   INTEGER,                             -- 10 (nullable for programs without age range)
    target_audience TEXT        NOT NULL,                -- "children" | "teens" | "women" | "adults" | "professionals"
    display_order   INTEGER     NOT NULL DEFAULT 0,      -- controls card order left-to-right
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT programs_age_range_check CHECK (
        age_range_min IS NULL AND age_range_max IS NULL
        OR age_range_min <= age_range_max
    )
);

-- ---------------------------------------------------------------------------
-- 2. schedule_entries
--
-- One row per class slot on the weekly timetable. Ties back to a program.
-- Displayed in the "Horarios" accordion section.
-- ---------------------------------------------------------------------------
CREATE TABLE schedule_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id      UUID        NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    day_of_week     SMALLINT    NOT NULL,                -- 0=Sunday … 6=Saturday (ISO would be 1=Mon, but we store 0-6)
    start_time      TIME        NOT NULL,                -- 09:00
    end_time        TIME        NOT NULL,                -- 10:00
    description     TEXT,                                -- optional note, e.g. "Clase avanzada"
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT schedule_entries_day_check CHECK (day_of_week BETWEEN 0 AND 6),
    CONSTRAINT schedule_entries_time_check CHECK (start_time < end_time)
);

CREATE INDEX idx_schedule_entries_program_id ON schedule_entries(program_id);
CREATE INDEX idx_schedule_entries_day        ON schedule_entries(day_of_week);

-- ---------------------------------------------------------------------------
-- 3. instructors
--
-- Instructors displayed in the "Nosotros" / about section photo gallery.
-- ---------------------------------------------------------------------------
CREATE TABLE instructors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       TEXT        NOT NULL,
    bio             TEXT,                                -- short paragraph
    photo_url       TEXT,                                -- path in Cloudflare R2 or full URL
    display_order   INTEGER     NOT NULL DEFAULT 0,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 4. gallery_images
--
-- Professional photos: training sessions, facilities, events, student progress.
-- Managed through admin image upload pipeline.
-- ---------------------------------------------------------------------------
CREATE TABLE gallery_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url             TEXT        NOT NULL,                -- Cloudflare R2 object URL
    alt_text        TEXT        NOT NULL,                -- accessibility / SEO
    caption         TEXT,                                -- optional display caption
    category        TEXT        NOT NULL,                -- "training" | "facilities" | "events" | "instructors" | "students"
    display_order   INTEGER     NOT NULL DEFAULT 0,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_images_category ON gallery_images(category);

-- ---------------------------------------------------------------------------
-- 5. announcements
--
-- News / academy updates shown on the site.
-- Only rows with published_at <= now() AND is_active = TRUE are public.
-- ---------------------------------------------------------------------------
CREATE TABLE announcements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT        NOT NULL,
    body            TEXT        NOT NULL,
    published_at    TIMESTAMPTZ,                         -- NULL = draft, set a timestamp to publish
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_announcements_published ON announcements(published_at)
    WHERE is_active = TRUE AND published_at IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 6. site_content
--
-- Key-value store for every editable text block on the site.
-- One row per content slot. Admin edits the value; frontend reads by key.
--
-- Expected keys (non-exhaustive):
--   hero_headline, hero_subheadline, hero_cta_primary, hero_cta_secondary,
--   about_history, about_mission, about_philosophy,
--   codigo_753_spiritual, codigo_753_physical, codigo_753_mental,
--   methodology_description, schedule_note
-- ---------------------------------------------------------------------------
CREATE TABLE site_content (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key     TEXT        NOT NULL UNIQUE,         -- lookup key, e.g. "hero_headline"
    content_text    TEXT        NOT NULL,                -- the actual content (may contain markdown)
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 7. contact_info
--
-- Editable contact details shown in the header, footer, and contact section.
-- One row per contact field so the admin can update each independently.
--
-- Expected keys:
--   phone, whatsapp_number, whatsapp_message, instagram_handle,
--   instagram_url, address, google_maps_embed_url
-- ---------------------------------------------------------------------------
CREATE TABLE contact_info (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    info_key        TEXT        NOT NULL UNIQUE,         -- "phone", "whatsapp_number", etc.
    info_value      TEXT        NOT NULL,                -- "+502 1234 5678"
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 8. inquiries
--
-- Tracks inbound contact: WhatsApp clicks, future contact form submissions.
-- Lets the admin see who reached out and follow up.
-- ---------------------------------------------------------------------------
CREATE TABLE inquiries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       TEXT        NOT NULL,
    phone           TEXT,
    email           TEXT,
    message         TEXT,
    source          TEXT        NOT NULL DEFAULT 'whatsapp',   -- "whatsapp" | "contact_form"
    status          TEXT        NOT NULL DEFAULT 'new',        -- "new" | "contacted" | "enrolled" | "closed"
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT inquiries_source_check CHECK (source IN ('whatsapp', 'contact_form')),
    CONSTRAINT inquiries_status_check CHECK (status IN ('new', 'contacted', 'enrolled', 'closed'))
);

CREATE INDEX idx_inquiries_status     ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);

-- ---------------------------------------------------------------------------
-- 9. merchandise
--
-- Products available for purchase at the academy (kimonos, equipment, etc.).
-- In-person sales only. Displayed on the "Mercancía" section.
-- ---------------------------------------------------------------------------
CREATE TABLE merchandise (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,                -- "Kimono 502 Jujutsu"
    slug            TEXT        NOT NULL UNIQUE,         -- "kimono-502"
    description     TEXT,                                -- product details
    price           DECIMAL(10,2),                       -- nullable: some items may not show price
    image_url       TEXT,                                -- Cloudflare R2 URL
    category        TEXT        NOT NULL DEFAULT 'general', -- "kimono" | "equipment" | "apparel" | "general"
    is_available    BOOLEAN     NOT NULL DEFAULT TRUE,
    display_order   INTEGER     NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_merchandise_category ON merchandise(category);

-- ---------------------------------------------------------------------------
-- 10. testimonials
--
-- Student testimonials and success stories shown on the "Testimonios" section.
-- ---------------------------------------------------------------------------
CREATE TABLE testimonials (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name    TEXT        NOT NULL,
    content         TEXT        NOT NULL,                -- the testimonial text
    photo_url       TEXT,                                -- student photo
    program_id      UUID        REFERENCES programs(id) ON DELETE SET NULL, -- optional link to program
    is_featured     BOOLEAN     NOT NULL DEFAULT FALSE,
    display_order   INTEGER     NOT NULL DEFAULT 0,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 11. admin_users
--
-- Users who can log into the admin interface to manage schedules, content,
-- images, and contact info. Passwords stored as bcrypt hashes.
-- ---------------------------------------------------------------------------
CREATE TABLE admin_users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT        NOT NULL UNIQUE,
    password_hash   TEXT        NOT NULL,                -- bcrypt hash
    full_name       TEXT        NOT NULL,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 12. Trigger: auto-update updated_at on row modification
--
-- Applied to every table that has an updated_at column.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_programs_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_schedule_entries_updated_at
    BEFORE UPDATE ON schedule_entries
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_instructors_updated_at
    BEFORE UPDATE ON instructors
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_gallery_images_updated_at
    BEFORE UPDATE ON gallery_images
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_contact_info_updated_at
    BEFORE UPDATE ON contact_info
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_merchandise_updated_at
    BEFORE UPDATE ON merchandise
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
