-- =============================================================================
-- Migration 001: Add merchandise + testimonials tables, First Steps program,
--                update branding to "Hermanos Valente", fix Little Champs age.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. New table: merchandise
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

CREATE TRIGGER trg_merchandise_updated_at
    BEFORE UPDATE ON merchandise
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- 2. New table: testimonials
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

CREATE TRIGGER trg_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Add "First Steps" program (display_order 1, shift existing programs)
-- ---------------------------------------------------------------------------
UPDATE programs SET display_order = display_order + 1;

INSERT INTO programs (name, slug, subtitle, description, age_range_min, age_range_max, target_audience, display_order)
VALUES (
    'First Steps',
    'first-steps',
    'Edades 2-5',
    'Introduce a los niños al movimiento y la disciplina de forma segura, a través del juego y ejercicios guiados. Desarrolla coordinación básica, equilibrio y conciencia corporal, fomentando el respeto, la confianza y la socialización temprana.',
    2,
    5,
    'children',
    1
);

-- ---------------------------------------------------------------------------
-- 4. Fix Little Champs age range: was 3-10, now 5-9
-- ---------------------------------------------------------------------------
UPDATE programs
   SET subtitle      = 'Edades 5-9',
       age_range_min = 5,
       age_range_max = 9
 WHERE slug = 'little-champs';

-- ---------------------------------------------------------------------------
-- 5. Update branding: "Valente Brothers" -> "Hermanos Valente"
--    (seed.sql already had some of these, but update any remaining)
-- ---------------------------------------------------------------------------
UPDATE site_content
   SET content_text = '502 Jujutsu - Defensa Personal Real – Metodología Hermanos Valente'
 WHERE section_key = 'hero_headline';

UPDATE site_content
   SET content_text = 'Fundada por amigos con 15 a 25 años cada uno entrenando bajo la metodología Hermanos Valente, desarrollada a partir de las enseñanzas de Helio Gracie transmitidas a través de 3 generaciones de la familia Valente. Raíces guatemaltecas fuertes con enfoque comunitario.'
 WHERE section_key = 'about_history';

UPDATE site_content
   SET content_text = 'Instalaciones de clase mundial, instructores altamente calificados y atención personalizada. Ambiente familiar con instructores dedicados y amigables comprometidos a preservar las raíces del Jūjutsu tal como lo enseñan los Hermanos Valente.'
 WHERE section_key = 'about_mission';

UPDATE site_content
   SET content_text = 'Todos los programas siguen Helio Gracie Jūjutsu con el sistema Hermanos Valente cubriendo ataques sorpresa, golpes traumáticos, lucha de pie, proyecciones, lucha en el suelo y filosofía. Las técnicas se convierten en memoria muscular a través de repetición constante para aplicación automática.'
 WHERE section_key = 'methodology';

-- ---------------------------------------------------------------------------
-- 6. Add new site_content keys for new sections
-- ---------------------------------------------------------------------------
INSERT INTO site_content (section_key, content_text) VALUES
('merchandise_headline',    'Mercancía'),
('merchandise_note',        'Todos los artículos están disponibles para compra directamente en la academia.'),
('testimonials_headline',   'Testimonios');
