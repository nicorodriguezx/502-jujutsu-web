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
    'niños',
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
-- 6. Update program target_audience to Spanish
-- ---------------------------------------------------------------------------
UPDATE programs SET target_audience = CASE
    WHEN target_audience = 'children' THEN 'niños'
    WHEN target_audience = 'teens' THEN 'jóvenes'
    WHEN target_audience = 'women' THEN 'mujeres'
    WHEN target_audience = 'adults' THEN 'adultos'
    WHEN target_audience = 'professionals' THEN 'profesionales'
    ELSE target_audience
END;

-- ---------------------------------------------------------------------------
-- 7. Add new site_content keys for new sections
-- ---------------------------------------------------------------------------
INSERT INTO site_content (section_key, content_text) VALUES
('programas_headline',      'Entrenamiento para Todas las Edades'),
('programas_description',   'Desde niños hasta adultos, ofrecemos programas especializados que siguen la metodología Hermanos Valente basada en Helio Gracie Jūjutsu.'),

('schedule_headline',       'Horarios de Clases'),
('schedule_description',    'Nuestro horario semanal está diseñado para adaptarse a diferentes edades y niveles. Todas las clases siguen un progreso estructurado.'),
('schedule_cta',            'Contactar por WhatsApp'),

('merchandise_headline',    'Mercancía'),
('merchandise_note',        'Todos los artículos están disponibles para compra directamente en la academia.'),
('testimonials_headline',   'Testimonios');

-- ---------------------------------------------------------------------------
-- 8. Add initial schedule entries
-- ---------------------------------------------------------------------------
INSERT INTO schedule_entries (program_id, day_of_week, start_time, end_time, description, is_active) VALUES
-- Early Morning / Morning classes
((SELECT id FROM programs WHERE slug = 'adultos'), 3, '06:00', '07:00', 'Fighting Foundations - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 5, '06:00', '07:00', 'Fighting Foundations - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'first-steps'), 6, '08:15', '09:00', 'First Steps - Niños 2-5 años', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 6, '09:00', '10:00', 'Fighting Foundations - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'mujeres'), 2, '10:00', '11:00', 'Warriors - Mujeres', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 6, '10:00', '11:00', 'Sparring Kimono - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 2, '11:30', '12:15', 'Fighting Foundations - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 4, '11:30', '12:15', 'Fighting Foundations - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 2, '12:15', '13:00', 'Sparring Kimono - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 3, '12:15', '13:00', 'Drills / Sparring - Adultos', TRUE),

-- Afternoon / Kids & Juniors
((SELECT id FROM programs WHERE slug = 'little-champs'), 1, '16:15', '17:00', 'Little Champs - Niños 5-9 años', TRUE),
((SELECT id FROM programs WHERE slug = 'little-champs'), 2, '16:15', '17:00', 'Little Warriors - Niños avanzados', TRUE),
((SELECT id FROM programs WHERE slug = 'little-champs'), 3, '16:15', '17:00', 'Little Champs - Niños 5-9 años', TRUE),
((SELECT id FROM programs WHERE slug = 'little-champs'), 4, '16:15', '17:00', 'Little Champs - Niños 5-9 años', TRUE),
((SELECT id FROM programs WHERE slug = 'juniors'), 1, '17:00', '17:50', 'Juniors - Jóvenes 11-17 años', TRUE),
((SELECT id FROM programs WHERE slug = 'juniors'), 2, '17:00', '17:50', 'Junior Warriors - Jóvenes avanzados', TRUE),
((SELECT id FROM programs WHERE slug = 'juniors'), 3, '17:00', '17:50', 'Juniors - Jóvenes 11-17 años', TRUE),
((SELECT id FROM programs WHERE slug = 'juniors'), 4, '17:00', '17:50', 'Juniors - Jóvenes 11-17 años', TRUE),

-- Evening classes
((SELECT id FROM programs WHERE slug = 'adultos'), 1, '18:00', '19:00', 'Fighting Foundations - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 2, '18:00', '19:00', 'Fighting Foundations - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 3, '18:00', '19:00', 'Fighting Foundations - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 4, '18:00', '19:00', 'Fighting Foundations - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 5, '18:00', '19:00', 'Fighting Foundations - Adultos', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 1, '19:00', '20:00', 'Fighting Mastery - Adultos avanzados', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 2, '19:00', '20:00', 'Fighting Mastery - Adultos avanzados', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 3, '19:00', '20:00', 'Fighting Mastery - Adultos avanzados', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 5, '19:00', '20:00', 'No Kimono - Entrenamiento sin judogi', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 1, '20:00', '20:30', 'Striking - Técnicas de golpeo', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 2, '20:00', '20:30', 'Sparring Kimono - Combate con judogi', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 3, '20:00', '20:30', 'Sparring Kimono - Combate con judogi', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 4, '20:00', '20:30', 'Sparring No Kimono - Combate sin judogi', TRUE),
((SELECT id FROM programs WHERE slug = 'adultos'), 5, '20:00', '20:30', 'Sparring No Kimono - Combate sin judogi', TRUE);
