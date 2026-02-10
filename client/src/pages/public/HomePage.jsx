// ---------------------------------------------------------------------------
// Public: Home Page — All landing-page sections (redesigned).
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ChevronDown,
  Users,
  Clock,
  ChevronRight,
  MessageCircle,
  Award,
  Target,
  Shield,
  Heart,
  Zap,
  ShoppingBag,
  Star,
  Quote,
  Phone,
  MapPin,
  Instagram,
  ExternalLink,
  BookOpen,
  Eye,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Section Divider — full-width image strip between sections
// ---------------------------------------------------------------------------
function SectionDivider({ imageUrl, altText, overlayText }) {
  if (!imageUrl) return null;

  return (
    <div className="relative h-56 md:h-72 overflow-hidden">
      <img
        src={imageUrl}
        alt={altText || ""}
        className="w-full h-full object-cover scale-[1.02]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      {overlayText && (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <p className="text-white text-lg sm:text-xl lg:text-3xl font-bold tracking-wide text-center drop-shadow-xl">
            {overlayText}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Schedule Day Accordion Component
// ---------------------------------------------------------------------------
function ScheduleDayAccordion({ dayName, classes }) {
  const [isOpen, setIsOpen] = useState(false);

  const sortedClasses = classes.sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden transition-shadow hover:shadow-soft-lg">
      {/* Day Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-navy-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-navy-600 to-navy-500 rounded-xl flex items-center justify-center shadow-sm">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">{dayName}</h3>
            <p className="text-sm text-gray-500">
              {sortedClasses.length} clase
              {sortedClasses.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Classes List */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          <div className="divide-y divide-gray-100">
            {sortedClasses.map((classItem, index) => (
              <div key={index} className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-lg font-semibold text-navy-600">
                        {classItem.start_time} - {classItem.end_time}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {classItem.program_name}
                      </span>
                    </div>
                    {classItem.description && (
                      <p className="text-sm text-gray-500">
                        {classItem.description}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-medium bg-navy-600/10 text-navy-600">
                    {classItem.program_name.toLowerCase().includes("mujeres")
                      ? "Mujeres"
                      : classItem.program_name
                            .toLowerCase()
                            .includes("adultos")
                        ? "Adultos"
                        : classItem.program_name
                              .toLowerCase()
                              .includes("seguridad")
                          ? "Profesionales"
                          : classItem.program_name
                                .toLowerCase()
                                .includes("juniors")
                            ? "11-17 años"
                            : classItem.program_name
                                  .toLowerCase()
                                  .includes("little")
                              ? "5-9 años"
                              : classItem.program_name
                                    .toLowerCase()
                                    .includes("first")
                                ? "2-5 años"
                                : "Todos"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// HOME PAGE
// =========================================================================
export default function HomePage() {
  const { contact } = useOutletContext();
  const [content, setContent] = useState({});
  const [programs, setPrograms] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  /* ── Data fetching ──────────────────────────────────────────────── */
  useEffect(() => {
    fetch("/api/public/site-content").then((r) => r.json()).then(setContent).catch(console.error);
    fetch("/api/public/programs").then((r) => r.json()).then(setPrograms).catch(console.error);
    fetch("/api/public/schedule").then((r) => r.json()).then(setSchedule).catch(console.error);
    fetch("/api/public/merchandise").then((r) => r.json()).then(setMerchandise).catch(console.error);
    fetch("/api/public/testimonials").then((r) => r.json()).then(setTestimonials).catch(console.error);
  }, []);

  /* ── Scroll-triggered entrance animations ───────────────────────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".animate-on-scroll, .stagger-children")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [content, programs, schedule, merchandise, testimonials]);

  /* ── Derived data ───────────────────────────────────────────────── */
  const whatsappUrl = contact?.whatsapp_number
    ? `https://wa.me/${contact.whatsapp_number.replace(/\D/g, "")}${
        contact.whatsapp_message
          ? `?text=${encodeURIComponent(contact.whatsapp_message)}`
          : ""
      }`
    : "#";

  const programIcons = {
    "first-steps": Heart,
    "little-champs": Award,
    juniors: Users,
    mujeres: Target,
    adultos: Shield,
    "law-enforcement": Zap,
  };

  const dayNames = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",
  };

  const scheduleByDay = schedule.reduce((acc, entry) => {
    const day = entry.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {});

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <>
      {/* ============================================================= */}
      {/* HERO                                                           */}
      {/* ============================================================= */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          {content.hero_image_url ? (
            <img
              src={content.hero_image_url}
              alt={content.hero_image_alt || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-800 to-navy-600" />
          )}
          {/* Dark overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"
            style={{
              opacity:
                parseFloat(content.hero_background_overlay_opacity) || 0.65,
            }}
          />
        </div>

        {/* Soft dark backdrop behind text for readability */}
        <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
          <div className="w-[90%] max-w-3xl aspect-[4/3] bg-black/40 rounded-full blur-[120px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 animate-fade-in">
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest">
              Helio Gracie Jūjutsu
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight animate-fade-in-up">
            {content.hero_headline || "502 Jujutsu"}
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:150ms]">
            {content.hero_subheadline ||
              "Clases para niños, jóvenes, mujeres y adultos en Ciudad de Guatemala"}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-navy-600 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-50 transition-all shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              {content.hero_cta_primary || "Contactar"}
            </a>
            <a
              href="#horarios"
              className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-white/10 hover:border-white/50 transition-all"
            >
              {content.hero_cta_secondary || "Ver Horarios"}
            </a>
          </div>

          {/* Contact bar */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-blue-200/70 animate-fade-in-up [animation-delay:450ms]">
            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="hover:text-white transition-colors"
              >
                {contact.phone}
              </a>
            )}
            {contact?.instagram_handle && (
              <a
                href={contact.instagram_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {contact.instagram_handle}
              </a>
            )}
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <a href="#metodologia" aria-label="Scroll down">
              <ChevronDown size={28} className="text-white/40 mx-auto" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* METODOLOGÍA & CÓDIGO 753 BRIEF                                 */}
      {/* ============================================================= */}
      <section id="metodologia" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll text-center mb-14">
            <div className="section-badge bg-navy-600/10 text-navy-600 mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Nuestro Sistema</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5">
              {content.methodology_headline ||
                "Metodología Valente Brothers™"}
            </h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
              {content.methodology ||
                "Todos los programas siguen Helio Gracie Jūjutsu con el sistema Hermanos Valente cubriendo ataques sorpresa, golpes traumáticos, lucha de pie, proyecciones, lucha en el suelo y filosofía. Las técnicas se convierten en memoria muscular a través de repetición constante para aplicación automática."}
            </p>
          </div>

          {/* Código 753 Brief Card */}
          <div className="animate-on-scroll max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-soft-lg border border-gray-100 overflow-hidden hover:shadow-soft-xl transition-shadow duration-500">
              <div className="px-8 py-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-5">
                  {["7", "5", "3"].map((n) => (
                    <span
                      key={n}
                      className="w-11 h-11 bg-gradient-to-br from-navy-600 to-navy-500 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md"
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Código 753™
                </h3>
                <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                  {content.codigo_753_brief ||
                    'La metodología se complementa con el Código 753™, una filosofía de vida que integra lo espiritual (7), lo físico (5) y lo mental (3), enseñada a todos los alumnos sin importar su edad.'}
                </p>
                <a
                  href="#filosofia"
                  className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-navy-600 hover:text-navy-500 transition-colors group"
                >
                  Conocer más sobre el Código 753
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <SectionDivider
        imageUrl={content.divider_metodologia_quienes_url}
        altText={content.divider_metodologia_quienes_alt}
      />

      {/* ============================================================= */}
      {/* QUIÉNES SOMOS                                                  */}
      {/* ============================================================= */}
      <section id="quienes-somos" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="animate-on-scroll text-center mb-16">
            <div className="section-badge bg-navy-600/10 text-navy-600 mb-4">
              <Users className="w-4 h-4" />
              <span>Nuestra Academia</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              {content.quienes_somos_headline || "Quiénes Somos"}
            </h2>
          </div>

          {/* About Content */}
          <div
            className={`animate-on-scroll grid gap-12 items-start mb-16 ${
              content.quienes_somos_team_photo_url
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {content.quienes_somos_team_photo_url && (
              <div className="relative rounded-2xl overflow-hidden shadow-soft-lg group">
                <img
                  src={content.quienes_somos_team_photo_url}
                  alt={content.quienes_somos_team_photo_alt || "Equipo 502 Jūjutsu"}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
            <div>
              {(
                content.quienes_somos_description ||
                "502 Jūjutsu está formado por un grupo de amigos que llevamos entre 13 y 25 años cada uno entrenando bajo la Metodología Valente Brothers™, la cual fue desarrollada a partir de lo que el GM Helio Gracie enseñó a 3 generaciones de la familia Valente."
              )
                .split("\n\n")
                .map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-gray-500 leading-relaxed mb-4 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>

          {/* Mission */}
          <div className="animate-on-scroll bg-gradient-to-br from-navy-600 to-navy-500 rounded-2xl p-8 sm:p-12 text-white mb-8 shadow-glow-navy">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {content.quienes_somos_mision_headline || "Nuestra Misión"}
                </h3>
              </div>
              <div className="space-y-4">
                {(
                  content.quienes_somos_mision ||
                  "Nuestra misión es desarrollar en los alumnos confianza en sus capacidades físicas y lograr bienestar por medio de la enseñanza de un completo y eficiente arte marcial de defensa personal, dentro de un entorno seguro, limpio y respetuoso."
                )
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-blue-100/90 leading-relaxed text-base sm:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="animate-on-scroll bg-white border border-gray-100 rounded-2xl p-8 sm:p-12 shadow-soft-lg">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-navy-600/10 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-navy-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {content.quienes_somos_proposito_headline ||
                    "Nuestro Propósito"}
                </h3>
              </div>
              <div className="space-y-4">
                {(
                  content.quienes_somos_proposito ||
                  "Inspirados en tanto que admiramos y valoramos de Valente Brothers HQ en Miami, tratamos de que 502 Jūjutsu sea una academia con instalaciones de primer nivel, instructores altamente calificados y trato personalizado."
                )
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-gray-500 leading-relaxed text-base sm:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider: Quiénes Somos → Programas ─────────────────────────── */}
      <SectionDivider
        imageUrl={content.divider_quienes_programas_url}
        altText={content.divider_quienes_programas_alt}
      />

      {/* ============================================================= */}
      {/* PROGRAMAS                                                      */}
      {/* ============================================================= */}
      <section id="programas" className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="animate-on-scroll text-center mb-16">
            <div className="section-badge bg-navy-600/10 text-navy-600 mb-4">
              <span>Nuestros Programas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5">
              {content.programas_headline ||
                "Entrenamiento para Todas las Edades"}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {content.programas_description ||
                "Desde niños hasta adultos, ofrecemos programas especializados que siguen la metodología Hermanos Valente basada en Helio Gracie Jūjutsu."}
            </p>
          </div>

          {/* Grid */}
          <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => {
              const IconComponent = programIcons[program.slug] || Users;
              return (
                <div
                  key={program.id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-1"
                >
                  {program.image_url && (
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={program.image_url}
                        alt={program.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-navy-600 to-navy-500 rounded-xl flex items-center justify-center group-hover:shadow-glow-navy transition-shadow duration-500">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {program.name}
                        </h3>
                        <p className="text-sm text-navy-500 font-medium">
                          {program.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {program.description}
                    </p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                      {program.target_audience}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* MODALIDAD                                                      */}
      {/* ============================================================= */}
      <section id="modalidad" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="animate-on-scroll text-center mb-16">
            <div className="section-badge bg-navy-600/10 text-navy-600 mb-4">
              <Users className="w-4 h-4" />
              <span>Modalidad de Entrenamiento</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5">
              {content.modalidad_headline || "¿Cómo Entrenamos?"}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {content.modalidad_description ||
                "Ofrecemos dos modalidades de entrenamiento diseñadas para adaptarse a tus necesidades y objetivos personales."}
            </p>
          </div>

          {/* Cards */}
          <div className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Group Classes */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-500">
              <div className="bg-gradient-to-r from-navy-600 to-navy-500 px-6 py-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {content.modalidad_grupal_title || "Clases Grupales"}
                </h3>
              </div>
              <div className="p-6 sm:p-8 space-y-4">
                {(
                  content.modalidad_grupal_description ||
                  "Las clases grupales siguen un plan de estudios estructurado dentro de la Metodología Valente Brothers™. Cada sesión combina calentamiento, técnica, práctica guiada y repetición, en un ambiente de respeto y camaradería.\n\nEs la forma principal de entrenamiento en la academia, ideal para desarrollar habilidades técnicas y crear comunidad con otros practicantes."
                )
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p key={i} className="text-gray-500 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>

            {/* Private Classes */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-500">
              <div className="bg-gradient-to-r from-navy-600 to-navy-500 px-6 py-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {content.modalidad_privada_title || "Clases Privadas"}
                </h3>
              </div>
              <div className="p-6 sm:p-8 space-y-4">
                {(
                  content.modalidad_privada_description ||
                  "Las clases privadas ofrecen atención personalizada uno a uno con el instructor. Permiten adaptar el ritmo, enfocarse en áreas específicas y profundizar en técnicas según las metas individuales del alumno.\n\nSon ideales para quienes buscan un progreso acelerado, tienen objetivos especiales o prefieren un entorno de entrenamiento más personalizado."
                )
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p key={i} className="text-gray-500 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <SectionDivider
        imageUrl={content.divider_modalidad_filosofia_url}
        altText={content.divider_modalidad_filosofia_alt}
      />

      {/* ============================================================= */}
      {/* FILOSOFÍA / CÓDIGO 753 — DARK SECTION                          */}
      {/* ============================================================= */}
      <section
        id="filosofia"
        className="py-24 bg-gradient-to-b from-gray-900 via-navy-950 to-gray-900 relative overflow-hidden"
      >
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="animate-on-scroll text-center mb-14">
            <div className="section-badge bg-white/10 text-blue-200 mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Nuestra Filosofía</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5">
              Código 753™
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {content.codigo_753_intro ||
                "La filosofía está resumida en el Código 753, el cual se enseña a todos los alumnos (niños, adolescentes y adultos). Dicho código representa la filosofía de vida de la Metodología Valente Brothers™."}
            </p>
          </div>

          {/* The 3 Components */}
          <div className="animate-on-scroll">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                {/* 7 — Spiritual */}
                <div className="p-8 sm:p-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-navy-500 to-navy-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-navy-500/30">
                    <span className="text-3xl font-bold text-white">7</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1.5">
                    {content.codigo_753_spiritual_label || "Espiritual"}
                  </h4>
                  <p className="text-sm text-gray-400 mb-5">
                    {content.codigo_753_spiritual_description ||
                      'El "7" representa la parte Espiritual. Enumera las virtudes de los antiguos guerreros Samurai.'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(
                      content.codigo_753_spiritual ||
                      "Rectitud, Coraje, Benevolencia, Respeto, Honestidad, Honor, Lealtad"
                    )
                      .split(", ")
                      .map((virtue, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10"
                        >
                          {virtue}
                        </span>
                      ))}
                  </div>
                </div>

                {/* 5 — Physical */}
                <div className="p-8 sm:p-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-navy-500 to-navy-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-navy-500/30">
                    <span className="text-3xl font-bold text-white">5</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1.5">
                    {content.codigo_753_physical_label || "Físico"}
                  </h4>
                  <p className="text-sm text-gray-400 mb-5">
                    {content.codigo_753_physical_description ||
                      'El "5" representa la parte física o corporal. Enumera los elementos para tener una vida sana.'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(
                      content.codigo_753_physical ||
                      "Ejercicio, Nutrición, Descanso, Higiene, Positivismo"
                    )
                      .split(", ")
                      .map((element, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10"
                        >
                          {element}
                        </span>
                      ))}
                  </div>
                </div>

                {/* 3 — Mental */}
                <div className="p-8 sm:p-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-navy-500 to-navy-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-navy-500/30">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1.5">
                    {content.codigo_753_mental_label || "Mental"}
                  </h4>
                  <p className="text-sm text-gray-400 mb-5">
                    {content.codigo_753_mental_description ||
                      'El "3" representa la parte mental. Enumera los estados de la mente.'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(
                      content.codigo_753_mental ||
                      "Conciencia, Balance emocional, Adaptabilidad"
                    )
                      .split(", ")
                      .map((state, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10"
                        >
                          {state}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SCHEDULE                                                       */}
      {/* ============================================================= */}
      <section id="horarios" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="animate-on-scroll text-center mb-16">
            <div className="section-badge bg-navy-600/10 text-navy-600 mb-4">
              <Clock className="w-4 h-4" />
              <span>Horarios</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5">
              {content.schedule_headline || "Horarios de Clases"}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
              {content.schedule_description ||
                "Nuestro horario semanal está diseñado para adaptarse a diferentes edades y niveles. Todas las clases siguen un progreso estructurado."}
            </p>

            {/* WhatsApp Contact CTA */}
            <div className="animate-on-scroll bg-white rounded-2xl p-6 shadow-soft border border-gray-100 max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">
                  ¿Necesitas confirmar un horario?
                </span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {content.schedule_cta || "Contactar por WhatsApp"}
              </a>
            </div>
          </div>

          {/* Schedule Accordions */}
          <div className="stagger-children space-y-4">
            {Object.entries(scheduleByDay)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([dayNum, classes]) => (
                <ScheduleDayAccordion
                  key={dayNum}
                  dayName={dayNames[dayNum]}
                  classes={classes}
                />
              ))}
          </div>

          {/* Note */}
          <div className="animate-on-scroll mt-12 text-center">
            <div className="bg-navy-50 border border-navy-100 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-sm text-navy-600">
                <strong>Nota:</strong> Los horarios pueden variar por temporada.
                Por favor confirma tu asistencia con anticipación.
                {content.schedule_note && (
                  <span className="block mt-2">{content.schedule_note}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <SectionDivider
        imageUrl={content.divider_horarios_mercancia_url}
        altText={content.divider_horarios_mercancia_alt}
      />

      {/* ============================================================= */}
      {/* MERCHANDISE                                                    */}
      {/* ============================================================= */}
      <section id="mercancia" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="animate-on-scroll text-center mb-16">
            <div className="section-badge bg-navy-600/10 text-navy-600 mb-4">
              <ShoppingBag className="w-4 h-4" />
              <span>Tienda</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5">
              {content.merchandise_headline || "Mercancía"}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {content.merchandise_note ||
                "Todos los artículos están disponibles para compra directamente en la academia."}
            </p>
          </div>

          {/* Products — horizontal swipe on mobile, grid on sm+ */}
          {merchandise.length > 0 ? (
            <div className="animate-on-scroll scroll-snap-x gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 sm:pb-0 sm:overflow-visible sm:snap-none mb-14">
              {merchandise.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[280px] sm:w-auto snap-center group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-500"
                >
                  {item.image_url ? (
                    <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-gray-200" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {item.name}
                      </h3>
                      {item.price && (
                        <span className="flex-shrink-0 text-lg font-bold text-navy-600">
                          Q{parseFloat(item.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">
                Próximamente productos disponibles.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="animate-on-scroll bg-gradient-to-r from-navy-600 to-navy-500 rounded-2xl p-8 sm:p-10 text-center shadow-glow-navy">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {content.merchandise_cta_title || "Visítanos en la Academia"}
            </h3>
            <p className="text-blue-100/80 mb-6 max-w-lg mx-auto">
              {content.merchandise_cta_description ||
                "Todos nuestros productos están disponibles exclusivamente en nuestras instalaciones. Ven a conocernos y equiparte con el mejor material."}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-navy-600 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Consultar Disponibilidad
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* TESTIMONIALS                                                   */}
      {/* ============================================================= */}
      <section id="testimonios" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="animate-on-scroll text-center mb-16">
            <div className="section-badge bg-navy-600/10 text-navy-600 mb-4">
              <Star className="w-4 h-4" />
              <span>Testimonios</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5">
              {content.testimonials_headline || "Testimonios"}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {content.testimonials_description ||
                "Historias reales de nuestros estudiantes y el impacto del entrenamiento en sus vidas."}
            </p>
          </div>

          {/* Grid */}
          {testimonials.length > 0 ? (
            <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-6 sm:p-7 shadow-soft border transition-all duration-500 hover:shadow-soft-lg hover:-translate-y-0.5 ${
                    testimonial.is_featured
                      ? "border-gold-300 ring-1 ring-gold-200 shadow-glow-gold"
                      : "border-gray-100"
                  }`}
                >
                  {/* Featured badge */}
                  {testimonial.is_featured && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                      <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider">
                        Destacado
                      </span>
                    </div>
                  )}

                  {/* Quote */}
                  <div className="mb-5">
                    <Quote className="w-8 h-8 text-navy-600/15 mb-3" />
                    <p className="text-gray-600 leading-relaxed">
                      {testimonial.content}
                    </p>
                  </div>

                  {/* Student */}
                  <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                    {testimonial.photo_url ? (
                      <img
                        src={testimonial.photo_url}
                        alt={testimonial.student_name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-600 to-navy-500 flex items-center justify-center ring-2 ring-navy-100">
                        <span className="text-white text-sm font-bold">
                          {testimonial.student_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {testimonial.student_name}
                      </p>
                      {testimonial.program_name && (
                        <p className="text-xs text-gray-400">
                          {testimonial.program_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Quote className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">
                Próximamente testimonios de nuestros estudiantes.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================= */}
      {/* CONTACT & LOCATION                                             */}
      {/* ============================================================= */}
      <section id="contacto" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="animate-on-scroll text-center mb-16">
            <div className="section-badge bg-navy-600/10 text-navy-600 mb-4">
              <Phone className="w-4 h-4" />
              <span>Contacto</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5">
              {content.contact_headline || "Contáctanos"}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {content.contact_description ||
                "Estamos listos para ayudarte. Escríbenos por WhatsApp o visítanos en nuestra academia."}
            </p>
          </div>

          <div className="animate-on-scroll grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left — Contact info */}
            <div className="space-y-8">
              {/* WhatsApp CTA */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      WhatsApp
                    </h3>
                    <p className="text-sm text-gray-500">Respuesta rápida</p>
                  </div>
                </div>
                <p className="text-gray-500 mb-5 leading-relaxed">
                  {content.contact_whatsapp_description ||
                    "Envíanos un mensaje directo por WhatsApp para información sobre clases, horarios y precios."}
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-green-600 text-white px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Escríbenos por WhatsApp
                </a>
              </div>

              {/* Contact details */}
              <div className="space-y-3">
                {contact?.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-navy-50/50 hover:border-navy-100 transition-all group"
                  >
                    <div className="w-11 h-11 bg-navy-600/10 rounded-xl flex items-center justify-center group-hover:bg-navy-600/15 transition-colors">
                      <Phone className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                        Teléfono
                      </p>
                      <p className="font-semibold text-gray-900">
                        {contact.phone}
                      </p>
                    </div>
                  </a>
                )}

                {contact?.instagram_handle && (
                  <a
                    href={contact.instagram_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-navy-50/50 hover:border-navy-100 transition-all group"
                  >
                    <div className="w-11 h-11 bg-navy-600/10 rounded-xl flex items-center justify-center group-hover:bg-navy-600/15 transition-colors">
                      <Instagram className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                        Instagram
                      </p>
                      <p className="font-semibold text-gray-900">
                        {contact.instagram_handle}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 ml-auto" />
                  </a>
                )}

                {contact?.address && (
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                    <div className="w-11 h-11 bg-navy-600/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                        Dirección
                      </p>
                      <p className="font-semibold text-gray-900">
                        {contact.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Map */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-soft">
              {contact?.google_maps_embed_url ? (
                <iframe
                  src={contact.google_maps_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "480px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de 502 Jujutsu"
                />
              ) : (
                <div className="bg-gray-50 flex items-center justify-center min-h-[480px]">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      Ciudad de Guatemala, Guatemala
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      Mapa disponible próximamente
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
