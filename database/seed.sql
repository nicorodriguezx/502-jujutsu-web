-- =============================================================================
-- 502 Jujutsu - Seed Data
-- Run after schema.sql. Populates tables with real content from features.md.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Programs (6 programs)
-- ---------------------------------------------------------------------------
INSERT INTO programs (name, slug, subtitle, description, age_range_min, age_range_max, target_audience, display_order) VALUES
(
    'First Steps',
    'first-steps',
    'Edades 2-5',
    'Introduce a los niños al movimiento y la disciplina de forma segura, a través del juego y ejercicios guiados. Desarrolla coordinación básica, equilibrio y conciencia corporal, fomentando el respeto, la confianza y la socialización temprana.',
    2,
    5,
    'children',
    1
),
(
    'Little Champs',
    'little-champs',
    'Edades 5-9',
    'Desarrolla disciplina, coraje, respeto, confianza, paciencia y control emocional a través de técnicas básicas de Jūjutsu. Construye coordinación, memoria, equilibrio y flexibilidad mientras establece las bases para manejar situaciones de acoso.',
    5,
    9,
    'children',
    2
),
(
    'Juniors',
    'juniors',
    'Edades 11-17',
    'Se construye sobre la base de Little Champs para manejar el acoso de forma no violenta. Desarrolla habilidades atléticas, sociales y emocionales a través de técnicas de Jūjutsu y entrenamiento en resolución de conflictos.',
    11,
    17,
    'teens',
    3
),
(
    'Mujeres',
    'mujeres',
    NULL,
    'Entrenamiento especializado para neutralizar ataques rápidamente y escapar de situaciones peligrosas. Se enfoca en defenderse contra atacantes más grandes y fuertes con técnicas eficientes.',
    NULL,
    NULL,
    'women',
    4
),
(
    'Adultos',
    'adultos',
    NULL,
    'Provee herramientas esenciales para sobrevivir confrontaciones reales con mínimo daño. Enfatiza la aplicación correcta de técnicas para respuestas apropiadas ante situaciones peligrosas.',
    NULL,
    NULL,
    'adults',
    5
),
(
    'Seguridad / Cumplimiento de la Ley',
    'seguridad',
    NULL,
    'Entrena profesionales para defenderse y neutralizar amenazas sin armas como primer recurso. Esencial para guardaespaldas, policías, soldados y personal de seguridad.',
    NULL,
    NULL,
    'professionals',
    6
);

-- ---------------------------------------------------------------------------
-- Site Content
-- ---------------------------------------------------------------------------
INSERT INTO site_content (section_key, content_text) VALUES
('hero_headline',        '502 Jujutsu - Defensa Personal Real – Metodología Hermanos Valente'),
('hero_subheadline',     'Clases para niños, jóvenes, mujeres y adultos en Ciudad de Guatemala'),
('hero_cta_primary',     'Contactar'),
('hero_cta_secondary',   'Ver Horarios'),

('about_history',        'Fundada por amigos con 15 a 25 años cada uno entrenando bajo la metodología Hermanos Valente, desarrollada a partir de las enseñanzas de Helio Gracie transmitidas a través de 3 generaciones de la familia Valente. Raíces guatemaltecas fuertes con enfoque comunitario.'),
('about_authenticity',   'Utiliza la transliteración correcta 柔術 (Jūjutsu) en lugar del fonético "jiu-jitsu", preservando el arte marcial tradicional japonés.'),
('about_mission',        'Instalaciones de clase mundial, instructores altamente calificados y atención personalizada. Ambiente familiar con instructores dedicados y amigables comprometidos a preservar las raíces del Jūjutsu tal como lo enseñan los Hermanos Valente.'),
('about_student_goals',  'Construir confianza física y bienestar a través de un arte marcial de defensa personal completo y eficiente en un ambiente seguro, limpio y respetuoso. Mejorar habilidades de defensa personal, enfoque, confianza, disciplina y capacidades físicas, mentales y espirituales sin importar edad, género o atributos físicos.'),

('codigo_753_intro',     'Filosofía de vida completa enseñada a todos los estudiantes.'),
('codigo_753_spiritual', 'Rectitud, Coraje, Benevolencia, Respeto, Honestidad, Honor, Lealtad'),
('codigo_753_physical',  'Ejercicio, Nutrición, Descanso, Higiene, Positivismo'),
('codigo_753_mental',    'Conciencia, Balance emocional, Adaptabilidad'),

('methodology',          'Todos los programas siguen Helio Gracie Jūjutsu con el sistema Hermanos Valente cubriendo ataques sorpresa, golpes traumáticos, lucha de pie, proyecciones, lucha en el suelo y filosofía. Las técnicas se convierten en memoria muscular a través de repetición constante para aplicación automática.'),
('schedule_note',        'Para confirmar horarios y disponibilidad, contáctanos por WhatsApp.'),

('merchandise_headline',  'Mercancía'),
('merchandise_note',      'Todos los artículos están disponibles para compra directamente en la academia.'),
('testimonials_headline', 'Testimonios');

-- ---------------------------------------------------------------------------
-- Contact Info
-- ---------------------------------------------------------------------------
INSERT INTO contact_info (info_key, info_value) VALUES
('phone',                '+502 0000 0000'),
('whatsapp_number',      '+502 0000 0000'),
('whatsapp_message',     'Hola, me interesa obtener información sobre las clases de Jūjutsu en 502 Jujutsu.'),
('instagram_handle',     '@502jujutsu'),
('instagram_url',        'https://instagram.com/502jujutsu'),
('address',              'Ciudad de Guatemala, Guatemala'),
('google_maps_embed_url', '');
