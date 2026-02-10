// ---------------------------------------------------------------------------
// Public site layout: top nav + page content + footer.
// Minimal, clean, mobile-first.
// ---------------------------------------------------------------------------
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

export default function PublicLayout() {
  const [contact, setContact] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/public/contact-info")
      .then((r) => r.json())
      .then(setContact)
      .catch(console.error);
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#hero" className="text-xl font-bold text-[#003366] tracking-tight">
              502 Jujutsu
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-[#003366] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#003366] text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-[#0D47A1] transition-colors"
              >
                Contactar
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-medium text-gray-600 hover:text-[#003366] border-b border-gray-50"
              >
                {link.label}
              </a>
            ))}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="block mt-3 text-center bg-[#003366] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#0D47A1]"
            >
              Contactar
            </a>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet context={{ contact }} />
      </main>

      {/* Footer */}
      <footer className="bg-[#003366] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-bold tracking-tight">502 Jujutsu</h3>
              <p className="text-sm text-blue-200 mt-2">
                Defensa Personal Real – Metodología Hermanos Valente
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-200 mb-3">
                Contacto
              </h4>
              <div className="space-y-2 text-sm">
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-blue-300" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.instagram_handle && (
                  <a
                    href={contact.instagram_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    {contact.instagram_handle}
                  </a>
                )}
                {contact.address && (
                  <p className="text-blue-200">{contact.address}</p>
                )}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-200 mb-3">
                Escríbenos
              </h4>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-[#003366] px-5 py-2.5 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-6 text-center text-xs text-blue-300">
            © {new Date().getFullYear()} 502 Jujutsu. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
