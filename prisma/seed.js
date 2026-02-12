#!/usr/bin/env node
// ---------------------------------------------------------------------------
// 502 Jujutsu - Prisma Seed
// Populates the database with all initial content.
// Run with: npm run prisma:seed
// ---------------------------------------------------------------------------
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

/** Helper: build a Date that Prisma accepts for @db.Time fields */
function time(hhmm) {
  return new Date(`1970-01-01T${hhmm}:00Z`);
}

async function main() {
  console.log("Seeding database...\n");

  // -----------------------------------------------------------------------
  // 1. Programs (6)
  // -----------------------------------------------------------------------
  console.log("  Programs...");
  const programsData = [
    {
      name: "First Steps",
      slug: "first-steps",
      subtitle: "Edades 2-5",
      description:
        "Introduce a los niños al movimiento y la disciplina de forma segura, a través del juego y ejercicios guiados. Desarrolla coordinación básica, equilibrio y conciencia corporal, fomentando el respeto, la confianza y la socialización temprana.",
      age_range_min: 2,
      age_range_max: 5,
      target_audience: "niños",
      display_order: 1,
    },
    {
      name: "Little Champs",
      slug: "little-champs",
      subtitle: "Edades 5-9",
      description:
        "Desarrolla disciplina, coraje, respeto, confianza, paciencia y control emocional a través de técnicas básicas de Jūjutsu. Construye coordinación, memoria, equilibrio y flexibilidad mientras establece las bases para manejar situaciones de acoso.",
      age_range_min: 5,
      age_range_max: 9,
      target_audience: "niños",
      display_order: 2,
    },
    {
      name: "Juniors",
      slug: "juniors",
      subtitle: "Edades 11-17",
      description:
        "Se construye sobre la base de Little Champs para manejar el acoso de forma no violenta. Desarrolla habilidades atléticas, sociales y emocionales a través de técnicas de Jūjutsu y entrenamiento en resolución de conflictos.",
      age_range_min: 11,
      age_range_max: 17,
      target_audience: "jóvenes",
      display_order: 3,
    },
    {
      name: "Mujeres",
      slug: "mujeres",
      subtitle: null,
      description:
        "Entrenamiento especializado para neutralizar ataques rápidamente y escapar de situaciones peligrosas. Se enfoca en defenderse contra atacantes más grandes y fuertes con técnicas eficientes.",
      age_range_min: null,
      age_range_max: null,
      target_audience: "mujeres",
      display_order: 4,
    },
    {
      name: "Adultos",
      slug: "adultos",
      subtitle: null,
      description:
        "Provee herramientas esenciales para sobrevivir confrontaciones reales con mínimo daño. Enfatiza la aplicación correcta de técnicas para respuestas apropiadas ante situaciones peligrosas.",
      age_range_min: null,
      age_range_max: null,
      target_audience: "adultos",
      display_order: 5,
    },
    {
      name: "Seguridad / Cumplimiento de la Ley",
      slug: "seguridad",
      subtitle: null,
      description:
        "Entrena profesionales para defenderse y neutralizar amenazas sin armas como primer recurso. Esencial para guardaespaldas, policías, soldados y personal de seguridad.",
      age_range_min: null,
      age_range_max: null,
      target_audience: "profesionales",
      display_order: 6,
    },
  ];

  for (const p of programsData) {
    await prisma.program.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // Build a slug -> id map for schedule entries
  const programs = await prisma.program.findMany();
  const bySlug = {};
  for (const p of programs) {
    bySlug[p.slug] = p.id;
  }

  // -----------------------------------------------------------------------
  // 2. Site Content (45 entries)
  // -----------------------------------------------------------------------
  console.log("  Site content...");
  const siteContentData = [
    // Hero
    ["hero_headline", "Defensa Personal Real con la Metodología Hermanos Valente"],
    ["hero_subheadline", "Transforma tu vida con Valente Brothers Jūjutsu. Clases para todas las edades en Ciudad de Guatemala."],
    ["hero_cta_primary", "Contactar"],
    ["hero_cta_secondary", "Ver Horarios"],
    ["hero_background_overlay_opacity", "0.6"],

    // Quiénes Somos
    ["quienes_somos_headline", "Quiénes Somos"],
    ["quienes_somos_description", "502 Jūjutsu está formado por un grupo de amigos que llevamos entre 13 y 25 años cada uno entrenando bajo la Metodología Valente Brothers\u2122, la cual fue desarrollada a partir de lo que el GM Helio Gracie enseñó a 3 generaciones de la familia Valente. Los hermanos Valente han estado muy presentes, ayudando al desarrollo del Jūjutsu en Guatemala. 502 Jūjutsu nació con el objetivo de continuar con el sistema Valente Brothers, un sistema que sigue el Jūjutsu de Helio Gracie, enfocado 100% en defensa personal; y con el Código 753\u2122, una filosofía de vida desarrollada por Valente Brothers como un enfoque para una vida equilibrada física, espiritual, emocional y mentalmente, que nos prepara para portar el \"arma invisible\" que es el Jūjutsu.\n\n502 nos identifica con nuestras raíces y apela a nuestro interés por ayudar a la comunidad guatemalteca. Jūjutsu corresponde a la transliteración correcta de la palabra japonesa 柔術, cuya romanización inicial por razones fonéticas se hizo equivocadamente como \"jiu-jitsu\" y al día de hoy sigue siendo la manera utilizada para referirse a dicho arte marcial.\n\nPocos profesores de Jūjutsu de esta generación tuvieron el contacto que los hermanos Valente tuvieron con Helio Gracie desde muy pequeños, motivo por el cual nos sentimos afortunados y orgullosos de ser parte de Valente Brothers."],
    ["quienes_somos_team_photo_url", ""],
    ["quienes_somos_mision_headline", "Nuestra Misión"],
    ["quienes_somos_mision", "Nuestra misión es desarrollar en los alumnos confianza en sus capacidades físicas y lograr bienestar por medio de la enseñanza de un completo y eficiente arte marcial de defensa personal, dentro de un entorno seguro, limpio y respetuoso. Estamos comprometidos a preservar las raíces del Jūjutsu, tanto técnicas como filosóficas, tal y como nos han enseñado los hermanos Valente."],
    ["quienes_somos_proposito_headline", "Nuestro Propósito"],
    ["quienes_somos_proposito", "Inspirados en tanto que admiramos y valoramos de Valente Brothers HQ en Miami, tratamos de que 502 Jūjutsu sea una academia con instalaciones de primer nivel, instructores altamente calificados y trato personalizado. Queremos que nuestros alumnos se sientan en un ambiente familiar y amigable, atendidos por instructores amables y dedicados.\n\nEn 502 Jūjutsu nos esforzamos por crear una atmosfera segura, enriquecedora y positiva, donde todo estudiante, sin importar su edad, género o atributos físicos, aumentará no solo su habilidad o destreza para defenderse ante cualquier situación, sino también mejorará su enfoque, auto-confianza, disciplina, así como su capacidad física, mental y espiritual."],

    // Código 753
    ["codigo_753_intro", "La filosofía está resumida en el Código 753, el cual se enseña a todos los alumnos (niños, adolescentes y adultos). Dicho código representa la filosofía de vida de la Metodología Valente Brothers\u2122. El ser humano está formado por espíritu, cuerpo y mente. El nombre del Código (7-5-3) representa cada uno de estos 3 componentes."],
    ["codigo_753_spiritual", "Rectitud, Coraje, Benevolencia, Respeto, Honestidad, Honor, Lealtad"],
    ["codigo_753_physical", "Ejercicio, Nutrición, Descanso, Higiene, Positivismo"],
    ["codigo_753_mental", "Conciencia, Balance emocional, Adaptabilidad"],
    ["codigo_753_spiritual_label", "Espiritual"],
    ["codigo_753_physical_label", "Físico"],
    ["codigo_753_mental_label", "Mental"],
    ["codigo_753_spiritual_description", 'El "7" representa la parte Espiritual. Enumera las virtudes de los antiguos guerreros Samurai.'],
    ["codigo_753_physical_description", 'El "5" representa la parte física o corporal. Enumera los elementos para tener una vida sana.'],
    ["codigo_753_mental_description", 'El "3" representa la parte mental. Enumera los estados de la mente.'],

    // Methodology
    ["methodology_headline", "Metodología Valente Brothers\u2122"],
    ["methodology", "Todos los programas siguen Helio Gracie Jūjutsu con el sistema Hermanos Valente cubriendo ataques sorpresa, golpes traumáticos, lucha de pie, proyecciones, lucha en el suelo y filosofía. Las técnicas se convierten en memoria muscular a través de repetición constante para aplicación automática."],

    // Programs section
    ["programas_headline", "Entrenamiento para Todas las Edades"],
    ["programas_description", "Desde niños hasta adultos, ofrecemos programas especializados que siguen la metodología Hermanos Valente basada en Helio Gracie Jūjutsu."],

    // Schedule section
    ["schedule_headline", "Horarios de Clases"],
    ["schedule_description", "Nuestro horario semanal está diseñado para adaptarse a diferentes edades y niveles. Todas las clases siguen un progreso estructurado."],
    ["schedule_cta", "Contactar por WhatsApp"],
    ["schedule_note", "Para confirmar horarios y disponibilidad, contáctanos por WhatsApp."],

    // Merchandise section
    ["merchandise_headline", "Mercancía"],
    ["merchandise_note", "Todos los artículos están disponibles para compra directamente en la academia."],
    ["merchandise_cta_title", "Visítanos en la Academia"],
    ["merchandise_cta_description", "Todos nuestros productos están disponibles exclusivamente en nuestras instalaciones. Ven a conocernos y equiparte con el mejor material."],

    // Testimonials section
    ["testimonials_headline", "Testimonios"],
    ["testimonials_description", "Historias reales de nuestros estudiantes y el impacto del entrenamiento en sus vidas."],

    // Contact section
    ["contact_headline", "Contáctanos"],
    ["contact_description", "Estamos listos para ayudarte. Escríbenos por WhatsApp o visítanos en nuestra academia."],
    ["contact_whatsapp_description", "Envíanos un mensaje directo por WhatsApp para información sobre clases, horarios y precios."],

    // Section Divider Images (visual breakpoints between sections)
    ["divider_metodologia_quienes_url", ""],
    ["divider_metodologia_quienes_alt", "Equipo 502 Jūjutsu"],
    ["divider_modalidad_filosofia_url", ""],
    ["divider_modalidad_filosofia_alt", "Filosofía y disciplina en el mat"],
    ["divider_horarios_mercancia_url", ""],
    ["divider_horarios_mercancia_alt", "Energía grupal en entrenamiento"],
  ];

  for (const [section_key, content_text] of siteContentData) {
    await prisma.siteContent.upsert({
      where: { section_key },
      update: { content_text },
      create: { section_key, content_text },
    });
  }

  // -----------------------------------------------------------------------
  // 3. Contact Info (7 entries)
  // -----------------------------------------------------------------------
  console.log("  Contact info...");
  const contactInfoData = [
    ["phone", "+502 3746 6617"],
    ["whatsapp_number", "+502 3746 6617"],
    ["whatsapp_message", "Hola, me interesa obtener información sobre las clases de Jūjutsu en 502 Jujutsu."],
    ["instagram_handle", "@502jujutsu"],
    ["instagram_url", "https://instagram.com/502jujutsu"],
    ["address", "19 Avenida 13-90 Paseo Cayala, Local 5, Zona 16, Ciudad de Guatemala"],
    ["google_maps_embed_url", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.8987354296182!2d-90.48934042412554!3d14.604844076971142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8589a3ef61c8a1f5%3A0xc91c3cc06bee4e37!2s502%20jujutsu!5e0!3m2!1ses!2sar!4v1770509456034!5m2!1ses!2sar"],
  ];

  for (const [info_key, info_value] of contactInfoData) {
    await prisma.contactInfo.upsert({
      where: { info_key },
      update: { info_value },
      create: { info_key, info_value },
    });
  }

  // -----------------------------------------------------------------------
  // 4. Schedule Entries (32 entries)
  // -----------------------------------------------------------------------
  console.log("  Schedule entries...");

  // Delete existing schedule entries to avoid duplicates on re-seed
  await prisma.scheduleEntry.deleteMany();

  const scheduleData = [
    // Early Morning / Morning
    { slug: "adultos",      day: 3, start: "06:00", end: "07:00", desc: "Fighting Foundations - Adultos" },
    { slug: "adultos",      day: 5, start: "06:00", end: "07:00", desc: "Fighting Foundations - Adultos" },
    { slug: "first-steps",  day: 6, start: "08:15", end: "09:00", desc: "First Steps - Niños 2-5 años" },
    { slug: "adultos",      day: 6, start: "09:00", end: "10:00", desc: "Fighting Foundations - Adultos" },
    { slug: "mujeres",      day: 2, start: "10:00", end: "11:00", desc: "Warriors - Mujeres" },
    { slug: "adultos",      day: 6, start: "10:00", end: "11:00", desc: "Sparring Kimono - Adultos" },
    { slug: "adultos",      day: 2, start: "11:30", end: "12:15", desc: "Fighting Foundations - Adultos" },
    { slug: "adultos",      day: 4, start: "11:30", end: "12:15", desc: "Fighting Foundations - Adultos" },
    { slug: "adultos",      day: 2, start: "12:15", end: "13:00", desc: "Sparring Kimono - Adultos" },
    { slug: "adultos",      day: 3, start: "12:15", end: "13:00", desc: "Drills / Sparring - Adultos" },

    // Afternoon / Kids & Juniors
    { slug: "little-champs", day: 1, start: "16:15", end: "17:00", desc: "Little Champs - Niños 5-9 años" },
    { slug: "little-champs", day: 2, start: "16:15", end: "17:00", desc: "Little Warriors - Niños avanzados" },
    { slug: "little-champs", day: 3, start: "16:15", end: "17:00", desc: "Little Champs - Niños 5-9 años" },
    { slug: "little-champs", day: 4, start: "16:15", end: "17:00", desc: "Little Champs - Niños 5-9 años" },
    { slug: "juniors",       day: 1, start: "17:00", end: "17:50", desc: "Juniors - Jóvenes 11-17 años" },
    { slug: "juniors",       day: 2, start: "17:00", end: "17:50", desc: "Junior Warriors - Jóvenes avanzados" },
    { slug: "juniors",       day: 3, start: "17:00", end: "17:50", desc: "Juniors - Jóvenes 11-17 años" },
    { slug: "juniors",       day: 4, start: "17:00", end: "17:50", desc: "Juniors - Jóvenes 11-17 años" },

    // Evening
    { slug: "adultos", day: 1, start: "18:00", end: "19:00", desc: "Fighting Foundations - Adultos" },
    { slug: "adultos", day: 2, start: "18:00", end: "19:00", desc: "Fighting Foundations - Adultos" },
    { slug: "adultos", day: 3, start: "18:00", end: "19:00", desc: "Fighting Foundations - Adultos" },
    { slug: "adultos", day: 4, start: "18:00", end: "19:00", desc: "Fighting Foundations - Adultos" },
    { slug: "adultos", day: 5, start: "18:00", end: "19:00", desc: "Fighting Foundations - Adultos" },
    { slug: "adultos", day: 1, start: "19:00", end: "20:00", desc: "Fighting Mastery - Adultos avanzados" },
    { slug: "adultos", day: 2, start: "19:00", end: "20:00", desc: "Fighting Mastery - Adultos avanzados" },
    { slug: "adultos", day: 3, start: "19:00", end: "20:00", desc: "Fighting Mastery - Adultos avanzados" },
    { slug: "adultos", day: 5, start: "19:00", end: "20:00", desc: "No Kimono - Entrenamiento sin judogi" },
    { slug: "adultos", day: 1, start: "20:00", end: "20:30", desc: "Striking - Técnicas de golpeo" },
    { slug: "adultos", day: 2, start: "20:00", end: "20:30", desc: "Sparring Kimono - Combate con judogi" },
    { slug: "adultos", day: 3, start: "20:00", end: "20:30", desc: "Sparring Kimono - Combate con judogi" },
    { slug: "adultos", day: 4, start: "20:00", end: "20:30", desc: "Sparring No Kimono - Combate sin judogi" },
    { slug: "adultos", day: 5, start: "20:00", end: "20:30", desc: "Sparring No Kimono - Combate sin judogi" },
  ];

  for (const s of scheduleData) {
    await prisma.scheduleEntry.create({
      data: {
        program_id: bySlug[s.slug],
        day_of_week: s.day,
        start_time: time(s.start),
        end_time: time(s.end),
        description: s.desc,
        is_active: true,
      },
    });
  }

  // -----------------------------------------------------------------------
  // 5. Gallery Images (2 placeholder images from migration-002)
  // -----------------------------------------------------------------------
  console.log("  Gallery images...");
  const galleryData = [
    {
      url: "https://images.unsplash.com/photo-1583473348853-7d2b2d9b4d1d?w=1920&q=80",
      alt_text: "Estudiantes practicando técnicas de proyección",
      caption: "Entrenamiento de técnicas Valente en acción",
      category: "training",
      display_order: 1,
    },
    {
      url: "https://images.unsplash.com/photo-1563199930-52dcf6224e6b?w=1200&q=80",
      alt_text: "Vista de las instalaciones del dojo",
      caption: "Espacio amplio y seguro para entrenamiento",
      category: "facilities",
      display_order: 1,
    },
  ];

  for (const img of galleryData) {
    // Avoid duplicates by checking url
    const existing = await prisma.galleryImage.findFirst({ where: { url: img.url } });
    if (!existing) {
      await prisma.galleryImage.create({ data: img });
    }
  }

  // -----------------------------------------------------------------------
  // 6. Admin User
  // -----------------------------------------------------------------------
  console.log("  Admin user...");
  const adminEmail = "admin@example.com";
  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const password_hash = await bcrypt.hash("password123", 12);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        password_hash,
        full_name: "Administrator",
        is_active: true,
      },
    });
    console.log("    Created admin: admin@example.com / password123");
  } else {
    console.log("    Admin user already exists, skipping.");
  }

  console.log("\nSeed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("Seed failed:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
