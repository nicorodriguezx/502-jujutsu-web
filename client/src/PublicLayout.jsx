// ---------------------------------------------------------------------------
// Public site layout: scroll-aware header + page content + footer + FAB.
// ---------------------------------------------------------------------------
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Instagram, MapPin, MessageCircle } from "lucide-react";

export default function PublicLayout() {
  const [contact, setContact] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ── Fetch contact info ─────────────────────────────────────────── */
  useEffect(() => {
    fetch("/api/public/contact-info")
      .then((r) => r.json())
      .then(setContact)
      .catch(console.error);
  }, []);

  /* ── Track scroll position for header transparency ──────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Lock body when mobile menu is open ─────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const whatsappUrl = contact.whatsapp_number
    ? `https://wa.me/${contact.whatsapp_number.replace(/\D/g, "")}${
        contact.whatsapp_message
          ? `?text=${encodeURIComponent(contact.whatsapp_message)}`
          : ""
      }`
    : "#";

  const navLinks = [
    { label: "Inicio", href: "#hero" },
    { label: "Metodología", href: "#metodologia" },
    { label: "Quiénes Somos", href: "#quienes-somos" },
    { label: "Programas", href: "#programas" },
    { label: "Código 753", href: "#filosofia" },
    { label: "Horarios", href: "#horarios" },
    { label: "Mercancía", href: "#mercancia" },
    { label: "Contacto", href: "#contacto" },
  ];

  const headerSolid = scrolled || menuOpen;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ============================================================= */}
      {/* HEADER — transparent over hero, solid on scroll               */}
      {/* ============================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          headerSolid
            ? "bg-white/95 backdrop-blur-md shadow-soft"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <a
              href="#hero"
              className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                headerSolid ? "text-navy-600" : "text-white"
              }`}
            >
              502 Jujutsu
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                    scrolled
                      ? "text-gray-600 hover:text-navy-600 hover:bg-navy-50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`ml-3 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  scrolled
                    ? "bg-navy-600 text-white hover:bg-navy-700 shadow-sm hover:shadow-md"
                    : "bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm"
                }`}
              >
                Contactar
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                headerSolid
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 animate-fade-in-down">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-navy-50 hover:text-navy-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 pb-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-navy-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-navy-700 transition-colors"
                >
                  <MessageCircle size={16} />
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================= */}
      {/* PAGE CONTENT                                                   */}
      {/* ============================================================= */}
      <main className="flex-1">
        <Outlet context={{ contact }} />
      </main>

      {/* ============================================================= */}
      {/* FLOATING WHATSAPP BUTTON                                       */}
      {/* ============================================================= */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:shadow-xl hover:scale-110 transition-all duration-300"
        aria-label="WhatsApp"
      >
        <MessageCircle size={24} />
      </a>

      {/* ============================================================= */}
      {/* FOOTER                                                         */}
      {/* ============================================================= */}
      <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy-400/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Brand */}
            <div className="md:col-span-4">
              <h3 className="text-2xl font-bold tracking-tight">
                502 Jujutsu
              </h3>
              <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                Defensa Personal Real — Metodología Hermanos Valente.
                <br />
                Helio Gracie Jūjutsu en Guatemala.
              </p>
            </div>

            {/* Quick links */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Navegación
              </h4>
              <div className="space-y-2.5">
                {navLinks.slice(0, 5).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact details */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Contacto
              </h4>
              <div className="space-y-3 text-sm">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors"
                  >
                    <Phone size={14} />
                    <span>{contact.phone}</span>
                  </a>
                )}
                {contact.instagram_handle && (
                  <a
                    href={contact.instagram_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors"
                  >
                    <Instagram size={14} />
                    <span>{contact.instagram_handle}</span>
                  </a>
                )}
                {contact.address && (
                  <div className="flex items-start gap-2.5 text-gray-400">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{contact.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Escríbenos
              </h4>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/20 transition-all border border-white/10"
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} 502 Jujutsu. Todos los derechos
              reservados.
            </p>
            <p className="text-xs text-gray-600">
              Helio Gracie Jūjutsu · Guatemala
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
