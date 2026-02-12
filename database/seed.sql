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
    'niños',
    1
),
(
    'Little Champs',
    'little-champs',
    'Edades 5-9',
    'Desarrolla disciplina, coraje, respeto, confianza, paciencia y control emocional a través de técnicas básicas de Jūjutsu. Construye coordinación, memoria, equilibrio y flexibilidad mientras establece las bases para manejar situaciones de acoso.',
    5,
    9,
    'niños',
    2
),
(
    'Juniors',
    'juniors',
    'Edades 11-17',
    'Se construye sobre la base de Little Champs para manejar el acoso de forma no violenta. Desarrolla habilidades atléticas, sociales y emocionales a través de técnicas de Jūjutsu y entrenamiento en resolución de conflictos.',
    11,
    17,
    'jóvenes',
    3
),
(
    'Mujeres',
    'mujeres',
    NULL,
    'Entrenamiento especializado para neutralizar ataques rápidamente y escapar de situaciones peligrosas. Se enfoca en defenderse contra atacantes más grandes y fuertes con técnicas eficientes.',
    NULL,
    NULL,
    'mujeres',
    4
),
(
    'Adultos',
    'adultos',
    NULL,
    'Provee herramientas esenciales para sobrevivir confrontaciones reales con mínimo daño. Enfatiza la aplicación correcta de técnicas para respuestas apropiadas ante situaciones peligrosas.',
    NULL,
    NULL,
    'adultos',
    5
),
(
    'Seguridad / Cumplimiento de la Ley',
    'seguridad',
    NULL,
    'Entrena profesionales para defenderse y neutralizar amenazas sin armas como primer recurso. Esencial para guardaespaldas, policías, soldados y personal de seguridad.',
    NULL,
    NULL,
    'profesionales',
    6
);

-- ---------------------------------------------------------------------------
-- Site Content
-- ---------------------------------------------------------------------------
INSERT INTO site_content (section_key, content_text) VALUES
('hero_headline',        '502 Jujutsu - Defensa Personal Real – Metodología Hermanos Valente'),
('hero_subheadline',     'Transforma tu vida con Valente Brothers Jūjutsu. Clases para todas las edades en Ciudad de Guatemala.'),
('hero_cta_primary',     'Contactar'),
('hero_cta_secondary',   'Ver Horarios'),

('codigo_753_intro',     'Filosofía de vida completa enseñada a todos los estudiantes.'),
('codigo_753_spiritual', 'Rectitud, Coraje, Benevolencia, Respeto, Honestidad, Honor, Lealtad'),
('codigo_753_physical',  'Ejercicio, Nutrición, Descanso, Higiene, Positivismo'),
('codigo_753_mental',    'Conciencia, Balance emocional, Adaptabilidad'),

('methodology',          'Todos los programas siguen Helio Gracie Jūjutsu con el sistema Hermanos Valente cubriendo ataques sorpresa, golpes traumáticos, lucha de pie, proyecciones, lucha en el suelo y filosofía. Las técnicas se convierten en memoria muscular a través de repetición constante para aplicación automática.'),

('programas_headline',      'Entrenamiento para Todas las Edades'),
('programas_description',   'Desde niños hasta adultos, ofrecemos programas especializados que siguen la metodología Hermanos Valente basada en Helio Gracie Jūjutsu.'),

('schedule_headline',       'Horarios de Clases'),
('schedule_description',    'Nuestro horario semanal está diseñado para adaptarse a diferentes edades y niveles. Todas las clases siguen un progreso estructurado.'),
('schedule_cta',            'Contactar por WhatsApp'),
('schedule_note',           'Para confirmar horarios y disponibilidad, contáctanos por WhatsApp.'),

('merchandise_headline',        'Mercancía'),
('merchandise_note',            'Todos los artículos están disponibles para compra directamente en la academia.'),
('merchandise_cta_title',       'Visítanos en la Academia'),
('merchandise_cta_description', 'Todos nuestros productos están disponibles exclusivamente en nuestras instalaciones. Ven a conocernos y equiparte con el mejor material.'),

('testimonials_headline',       'Testimonios'),
('testimonials_description',    'Historias reales de nuestros estudiantes y el impacto del entrenamiento en sus vidas.'),

('contact_headline',            'Contáctanos'),
('contact_description',         'Estamos listos para ayudarte. Escríbenos por WhatsApp o visítanos en nuestra academia.'),
('contact_whatsapp_description','Envíanos un mensaje directo por WhatsApp para información sobre clases, horarios y precios.');

-- ---------------------------------------------------------------------------
-- Contact Info
-- ---------------------------------------------------------------------------
INSERT INTO contact_info (info_key, info_value) VALUES
('phone',                '+502 3746 6617'),
('whatsapp_number',      '+502 3746 6617'),
('whatsapp_message',     'Hola, me interesa obtener información sobre las clases de Jūjutsu en 502 Jujutsu.'),
('instagram_handle',     '@502jujutsu'),
('instagram_url',        'https://instagram.com/502jujutsu'),
('address',              '19 Avenida 13-90 Paseo Cayala, Local 5, Zona 16, Ciudad de Guatemala'),
('google_maps_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.8987354296182!2d-90.48934042412554!3d14.604844076971142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8589a3ef61c8a1f5%3A0xc91c3cc06bee4e37!2s502%20jujutsu!5e0!3m2!1ses!2sar!4v1770509456034!5m2!1ses!2sar');

-- ---------------------------------------------------------------------------
-- Schedule Entries
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
