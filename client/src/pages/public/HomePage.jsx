// ---------------------------------------------------------------------------
// Public: Home Page -- All landing page sections.
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
  Eye
} from "lucide-react";

// ---------------------------------------------------------------------------
// Section Divider — full-width image strip between sections
// ---------------------------------------------------------------------------
function SectionDivider({ imageUrl, altText, overlayText }) {
  if (!imageUrl) return null;

  return (
    <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
      <img
        src={imageUrl}
        alt={altText || ""}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
      {/* Optional overlay text */}
      {overlayText && (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <p className="text-white text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide text-center drop-shadow-lg">
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

  // Sort classes by start time
  const sortedClasses = classes.sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Day Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">{dayName}</h3>
            <p className="text-sm text-gray-600">
              {sortedClasses.length} clase{sortedClasses.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Classes List */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="divide-y divide-gray-200">
            {sortedClasses.map((classItem, index) => (
              <div key={index} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Time and Program */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-lg font-semibold text-[#003366]">
                        {classItem.start_time} - {classItem.end_time}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {classItem.program_name}
                      </div>
                    </div>
                    {classItem.description && (
                      <p className="text-sm text-gray-600">{classItem.description}</p>
                    )}
                  </div>

                  {/* Target Audience Badge */}
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#003366]/10 text-[#003366]">
                      {classItem.program_name.toLowerCase().includes('mujeres') ? 'Mujeres' :
                       classItem.program_name.toLowerCase().includes('adultos') ? 'Adultos' :
                       classItem.program_name.toLowerCase().includes('seguridad') ? 'Profesionales' :
                       classItem.program_name.toLowerCase().includes('juniors') ? '11-17 años' :
                       classItem.program_name.toLowerCase().includes('little') ? '5-9 años' :
                       classItem.program_name.toLowerCase().includes('first') ? '2-5 años' :
                       'Todos'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { contact } = useOutletContext();
  const [content, setContent] = useState({});
  const [programs, setPrograms] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch("/api/public/site-content").then((r) => r.json()).then(setContent).catch(console.error);
    fetch("/api/public/programs").then((r) => r.json()).then(setPrograms).catch(console.error);
    fetch("/api/public/schedule").then((r) => r.json()).then(setSchedule).catch(console.error);
    fetch("/api/public/merchandise").then((r) => r.json()).then(setMerchandise).catch(console.error);
    fetch("/api/public/testimonials").then((r) => r.json()).then(setTestimonials).catch(console.error);
    fetch("/api/public/gallery?category=hero").then((r) => r.json()).then(setHeroImages).catch(console.error);
  }, []);

  // Hero image carousel effect
  useEffect(() => {
    if (heroImages.length <= 1) return;
    
    const interval = parseInt(content.hero_image_transition_interval) || 5000;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [heroImages.length, content.hero_image_transition_interval]);

  const whatsappUrl = contact?.whatsapp_number
    ? `https://wa.me/${contact.whatsapp_number.replace(/\D/g, "")}${
        contact.whatsapp_message
          ? `?text=${encodeURIComponent(contact.whatsapp_message)}`
          : ""
      }`
    : "#";

  // Program icons mapping
  const programIcons = {
    'first-steps': Heart,
    'little-champs': Award,
    'juniors': Users,
    'mujeres': Target,
    'adultos': Shield,
    'law-enforcement': Zap
  };

  // Day names mapping
  const dayNames = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo'
  };

  // Group schedule by day
  const scheduleByDay = schedule.reduce((acc, entry) => {
    const day = entry.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {});

  return (
    <>
      {/* ================================================================= */}
      {/* HERO SECTION                                                      */}
      {/* ================================================================= */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Images with Carousel Effect */}
        <div className="absolute inset-0">
          {/* Fallback gradient if no images */}
          {heroImages.length === 0 && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#001a33] via-[#003366] to-[#0D47A1]">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2260%22%20height%3D%2260%22%3E%3Cpath%20d%3D%22M30%200L60%2030L30%2060L0%2030Z%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')]" />
            </div>
          )}
          
          {/* Background Images Carousel */}
          {heroImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt_text}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          {/* Dark overlay for text readability */}
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: parseFloat(content.hero_background_overlay_opacity) || 0.6 }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">
              Helio Gracie Jūjutsu
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            {content.hero_headline || "502 Jujutsu"}
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {content.hero_subheadline ||
              "Clases para niños, jóvenes, mujeres y adultos en Ciudad de Guatemala"}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-[#003366] px-8 py-3.5 rounded-md text-base font-semibold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20"
            >
              {content.hero_cta_primary || "Contactar"}
            </a>
            <a
              href="#horarios"
              className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-white/40 text-white px-8 py-3.5 rounded-md text-base font-semibold hover:bg-white/10 transition-colors"
            >
              {content.hero_cta_secondary || "Ver Horarios"}
            </a>
          </div>

          {/* Contact info bar */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-blue-200">
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
              <ChevronDown size={28} className="text-white/50 mx-auto" />
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* DIVIDER: Hero → Metodología                                      */}
      {/* ================================================================= */}
      <SectionDivider
        imageUrl={content.divider_hero_metodologia_url}
        altText={content.divider_hero_metodologia_alt}
      />

      {/* ================================================================= */}
      {/* METODOLOGÍA & CÓDIGO 753 SECTION                                 */}
      {/* ================================================================= */}
      <section id="metodologia" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#003366]/10 text-[#003366] rounded-full px-4 py-1.5 mb-4">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Nuestro Sistema
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {content.methodology_headline || "Metodología Valente Brothers™"}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {content.methodology ||
                "Todos los programas siguen Helio Gracie Jūjutsu con el sistema Hermanos Valente cubriendo ataques sorpresa, golpes traumáticos, lucha de pie, proyecciones, lucha en el suelo y filosofía. Las técnicas se convierten en memoria muscular a través de repetición constante para aplicación automática."}
            </p>
          </div>

          {/* Código 753 Brief */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <span className="w-10 h-10 bg-gradient-to-br from-[#003366] to-[#0D47A1] rounded-full flex items-center justify-center text-lg font-bold text-white shadow">7</span>
                  <span className="w-10 h-10 bg-gradient-to-br from-[#003366] to-[#0D47A1] rounded-full flex items-center justify-center text-lg font-bold text-white shadow">5</span>
                  <span className="w-10 h-10 bg-gradient-to-br from-[#003366] to-[#0D47A1] rounded-full flex items-center justify-center text-lg font-bold text-white shadow">3</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Código 753™
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                {content.codigo_753_brief ||
                  "La metodología se complementa con el Código 753™, una filosofía de vida que integra lo espiritual (7), lo físico (5) y lo mental (3), enseñada a todos los alumnos sin importar su edad."}
              </p>
              <a
                href="#filosofia"
                className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#003366] hover:text-[#0D47A1] transition-colors"
              >
                Conocer más sobre el Código 753
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* DIVIDER: Metodología → Quiénes Somos                            */}
      {/* ================================================================= */}
      <SectionDivider
        imageUrl={content.divider_metodologia_quienes_url}
        altText={content.divider_metodologia_quienes_alt}
      />

      {/* ================================================================= */}
      {/* QUIÉNES SOMOS SECTION                                            */}
      {/* ================================================================= */}
      <section id="quienes-somos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#003366]/10 text-[#003366] rounded-full px-4 py-1.5 mb-4">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Nuestra Academia
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {content.quienes_somos_headline || "Quiénes Somos"}
            </h2>
          </div>

          {/* About Content with optional team photo */}
          <div className={`grid gap-12 items-start mb-16 ${content.quienes_somos_team_photo_url ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
            {/* Team Photo */}
            {content.quienes_somos_team_photo_url && (
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src={content.quienes_somos_team_photo_url}
                  alt="Equipo 502 Jūjutsu"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* About Text */}
            <div>
              <div className="prose prose-lg max-w-none">
                {(content.quienes_somos_description || "502 Jūjutsu está formado por un grupo de amigos que llevamos entre 13 y 25 años cada uno entrenando bajo la Metodología Valente Brothers™, la cual fue desarrollada a partir de lo que el GM Helio Gracie enseñó a 3 generaciones de la familia Valente.").split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-br from-[#003366] to-[#0D47A1] rounded-2xl p-8 sm:p-12 text-white mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {content.quienes_somos_mision_headline || "Nuestra Misión"}
                </h3>
              </div>
              <div className="space-y-4">
                {(content.quienes_somos_mision || "Nuestra misión es desarrollar en los alumnos confianza en sus capacidades físicas y lograr bienestar por medio de la enseñanza de un completo y eficiente arte marcial de defensa personal, dentro de un entorno seguro, limpio y respetuoso.").split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-blue-100 leading-relaxed text-base sm:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#003366]/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-[#003366]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {content.quienes_somos_proposito_headline || "Nuestro Propósito"}
                </h3>
              </div>
              <div className="space-y-4">
                {(content.quienes_somos_proposito || "Inspirados en tanto que admiramos y valoramos de Valente Brothers HQ en Miami, tratamos de que 502 Jūjutsu sea una academia con instalaciones de primer nivel, instructores altamente calificados y trato personalizado.").split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* PROGRAMAS SECTION                                                */}
      {/* ================================================================= */}
      <section id="programas" className="py-20 bg-gray-50 relative">
        {/* Optional background image overlay */}
        {content.programas_background_style === 'image' && (
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white" />
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#003366]/10 text-[#003366] rounded-full px-4 py-1.5 mb-4">
              <span className="text-sm font-medium uppercase tracking-wider">
                Nuestros Programas
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {content.programas_headline || "Entrenamiento para Todas las Edades"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.programas_description ||
                "Desde niños hasta adultos, ofrecemos programas especializados que siguen la metodología Hermanos Valente basada en Helio Gracie Jūjutsu."}
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => {
              const IconComponent = programIcons[program.slug] || Users;
              return (
                <div
                  key={program.id}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Optional Program Image Header */}
                  {program.image_url && (
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={program.image_url}
                        alt={program.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#003366] rounded-lg flex items-center justify-center group-hover:bg-[#0D47A1] transition-colors">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                        <p className="text-sm text-[#003366] font-medium">{program.subtitle}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {program.description}
                    </p>

                    {/* Target Audience */}
                    <div className="text-xs text-gray-500">
                      <span className="capitalize">{program.target_audience}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* MODALIDAD SECTION                                               */}
      {/* ================================================================= */}
      <section id="modalidad" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#003366]/10 text-[#003366] rounded-full px-4 py-1.5 mb-4">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Modalidad de Entrenamiento
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {content.modalidad_headline || "¿Cómo Entrenamos?"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.modalidad_description ||
                "Ofrecemos dos modalidades de entrenamiento diseñadas para adaptarse a tus necesidades y objetivos personales."}
            </p>
          </div>

          {/* Modalities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Group Classes */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-[#003366] px-6 py-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {content.modalidad_grupal_title || "Clases Grupales"}
                </h3>
              </div>
              <div className="p-6 sm:p-8">
                <div className="space-y-4">
                  {(content.modalidad_grupal_description || "Las clases grupales siguen un plan de estudios estructurado dentro de la Metodología Valente Brothers™. Cada sesión combina calentamiento, técnica, práctica guiada y repetición, en un ambiente de respeto y camaradería.\n\nEs la forma principal de entrenamiento en la academia, ideal para desarrollar habilidades técnicas y crear comunidad con otros practicantes.").split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Private Classes */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-[#003366] px-6 py-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {content.modalidad_privada_title || "Clases Privadas"}
                </h3>
              </div>
              <div className="p-6 sm:p-8">
                <div className="space-y-4">
                  {(content.modalidad_privada_description || "Las clases privadas ofrecen atención personalizada uno a uno con el instructor. Permiten adaptar el ritmo, enfocarse en áreas específicas y profundizar en técnicas según las metas individuales del alumno.\n\nSon ideales para quienes buscan un progreso acelerado, tienen objetivos especiales o prefieren un entorno de entrenamiento más personalizado.").split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* DIVIDER: Modalidad → Código 753                                  */}
      {/* ================================================================= */}
      <SectionDivider
        imageUrl={content.divider_modalidad_filosofia_url}
        altText={content.divider_modalidad_filosofia_alt}
      />

      {/* ================================================================= */}
      {/* FILOSOFÍA / CÓDIGO 753 SECTION                                   */}
      {/* ================================================================= */}
      <section id="filosofia" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#003366]/10 text-[#003366] rounded-full px-4 py-1.5 mb-4">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Nuestra Filosofía
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Código 753™
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {content.codigo_753_intro ||
                "La filosofía está resumida en el Código 753, el cual se enseña a todos los alumnos (niños, adolescentes y adultos). Dicho código representa la filosofía de vida de la Metodología Valente Brothers™."}
            </p>
          </div>

          {/* The 3 Components */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* 7 - Spiritual */}
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#003366] to-[#0D47A1] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">7</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {content.codigo_753_spiritual_label || "Espiritual"}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {content.codigo_753_spiritual_description || 'El "7" representa la parte Espiritual. Enumera las virtudes de los antiguos guerreros Samurai.'}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {(content.codigo_753_spiritual || "Rectitud, Coraje, Benevolencia, Respeto, Honestidad, Honor, Lealtad").split(', ').map((virtue, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#003366]/10 text-[#003366]">
                      {virtue}
                    </span>
                  ))}
                </div>
              </div>

              {/* 5 - Physical */}
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#003366] to-[#0D47A1] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">5</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {content.codigo_753_physical_label || "Físico"}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {content.codigo_753_physical_description || 'El "5" representa la parte física o corporal. Enumera los elementos para tener una vida sana.'}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {(content.codigo_753_physical || "Ejercicio, Nutrición, Descanso, Higiene, Positivismo").split(', ').map((element, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#003366]/10 text-[#003366]">
                      {element}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3 - Mental */}
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#003366] to-[#0D47A1] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {content.codigo_753_mental_label || "Mental"}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {content.codigo_753_mental_description || 'El "3" representa la parte mental. Enumera los estados de la mente.'}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {(content.codigo_753_mental || "Conciencia, Balance emocional, Adaptabilidad").split(', ').map((state, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#003366]/10 text-[#003366]">
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SCHEDULE SECTION                                                */}
      {/* ================================================================= */}
      <section id="horarios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#003366]/10 text-[#003366] rounded-full px-4 py-1.5 mb-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Horarios
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {content.schedule_headline || "Horarios de Clases"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {content.schedule_description ||
                "Nuestro horario semanal está diseñado para adaptarse a diferentes edades y niveles. Todas las clases siguen un progreso estructurado."}
            </p>

            {/* WhatsApp Contact CTA */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">¿Necesitas confirmar un horario?</span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-green-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {content.schedule_cta || "Contactar por WhatsApp"}
              </a>
            </div>
          </div>

          {/* Schedule Display */}
          <div className="space-y-4">
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

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Los horarios pueden variar por temporada. Por favor confirma tu asistencia con anticipación.
                {content.schedule_note && (
                  <span className="block mt-2">{content.schedule_note}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* DIVIDER: Horarios → Mercancía                                    */}
      {/* ================================================================= */}
      <SectionDivider
        imageUrl={content.divider_horarios_mercancia_url}
        altText={content.divider_horarios_mercancia_alt}
      />

      {/* ================================================================= */}
      {/* MERCHANDISE SECTION                                              */}
      {/* ================================================================= */}
      <section id="mercancia" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#003366]/10 text-[#003366] rounded-full px-4 py-1.5 mb-4">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Tienda
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {content.merchandise_headline || "Mercancía"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.merchandise_note ||
                "Todos los artículos están disponibles para compra directamente en la academia."}
            </p>
          </div>

          {/* Products Grid */}
          {merchandise.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {merchandise.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  {item.image_url ? (
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      {item.price && (
                        <span className="flex-shrink-0 text-lg font-bold text-[#003366]">
                          Q{parseFloat(item.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Próximamente productos disponibles.</p>
            </div>
          )}

          {/* In-Person CTA */}
          <div className="bg-[#003366] rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-3">
              {content.merchandise_cta_title || "Visítanos en la Academia"}
            </h3>
            <p className="text-blue-200 mb-6 max-w-lg mx-auto">
              {content.merchandise_cta_description ||
                "Todos nuestros productos están disponibles exclusivamente en nuestras instalaciones. Ven a conocernos y equiparte con el mejor material."}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-[#003366] px-6 py-3 rounded-md text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Consultar Disponibilidad
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TESTIMONIALS SECTION                                             */}
      {/* ================================================================= */}
      <section id="testimonios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#003366]/10 text-[#003366] rounded-full px-4 py-1.5 mb-4">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Testimonios
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {content.testimonials_headline || "Testimonios"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.testimonials_description ||
                "Historias reales de nuestros estudiantes y el impacto del entrenamiento en sus vidas."}
            </p>
          </div>

          {/* Testimonials Grid */}
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-6 shadow-sm border ${
                    testimonial.is_featured
                      ? "border-[#D4A017] ring-1 ring-[#D4A017]/20"
                      : "border-gray-200"
                  }`}
                >
                  {/* Featured badge */}
                  {testimonial.is_featured && (
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-4 h-4 text-[#D4A017] fill-[#D4A017]" />
                      <span className="text-xs font-medium text-[#D4A017] uppercase tracking-wider">
                        Destacado
                      </span>
                    </div>
                  )}

                  {/* Quote */}
                  <div className="mb-4">
                    <Quote className="w-8 h-8 text-[#003366]/20 mb-2" />
                    <p className="text-gray-700 leading-relaxed">
                      {testimonial.content}
                    </p>
                  </div>

                  {/* Student */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    {testimonial.photo_url ? (
                      <img
                        src={testimonial.photo_url}
                        alt={testimonial.student_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#003366] flex items-center justify-center">
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
                        <p className="text-xs text-gray-500">{testimonial.program_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Próximamente testimonios de nuestros estudiantes.</p>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* CONTACT & LOCATION SECTION                                       */}
      {/* ================================================================= */}
      <section id="contacto" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#003366]/10 text-[#003366] rounded-full px-4 py-1.5 mb-4">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Contacto
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {content.contact_headline || "Contáctanos"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.contact_description ||
                "Estamos listos para ayudarte. Escríbenos por WhatsApp o visítanos en nuestra academia."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info + WhatsApp */}
            <div className="space-y-8">
              {/* WhatsApp CTA - Prominent */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">WhatsApp</h3>
                    <p className="text-sm text-gray-600">Respuesta rápida</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {content.contact_whatsapp_description ||
                    "Envíanos un mensaje directo por WhatsApp para información sobre clases, horarios y precios."}
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-green-600 text-white px-6 py-3 rounded-md text-base font-semibold hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Escríbenos por WhatsApp
                </a>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                {contact?.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-[#003366]/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#003366]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium text-gray-900">{contact.phone}</p>
                    </div>
                  </a>
                )}

                {contact?.instagram_handle && (
                  <a
                    href={contact.instagram_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-[#003366]/10 rounded-lg flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-[#003366]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Instagram</p>
                      <p className="font-medium text-gray-900">{contact.instagram_handle}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </a>
                )}

                {contact?.address && (
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-[#003366]/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#003366]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="font-medium text-gray-900">{contact.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              {contact?.google_maps_embed_url ? (
                <iframe
                  src={contact.google_maps_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "450px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de 502 Jujutsu"
                />
              ) : (
                <div className="bg-gray-100 flex items-center justify-center min-h-[450px]">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Ciudad de Guatemala, Guatemala</p>
                    <p className="text-gray-400 text-xs mt-1">Mapa disponible próximamente</p>
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
