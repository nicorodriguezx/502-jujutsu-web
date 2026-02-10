// ---------------------------------------------------------------------------
// Admin layout: sidebar navigation + main content area.
// Mobile-responsive with collapsible sidebar drawer.
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  Image,
  Megaphone,
  FileText,
  Phone,
  MessageSquare,
  Shield,
  ShoppingBag,
  Quote,
  LogOut,
  Heart,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/quienes-somos", label: "Quiénes Somos", icon: Heart },
  { to: "/admin/programs", label: "Programas", icon: BookOpen },
  { to: "/admin/schedule", label: "Horarios", icon: Calendar },
  // { to: "/admin/instructors", label: "Instructores", icon: Users },
  { to: "/admin/gallery", label: "Galería", icon: Image },
  // { to: "/admin/announcements", label: "Anuncios", icon: Megaphone },
  { to: "/admin/merchandise", label: "Mercancía", icon: ShoppingBag },
  { to: "/admin/testimonials", label: "Testimonios", icon: Quote },
  { to: "/admin/site-content", label: "Contenido", icon: FileText },
  { to: "/admin/contact-info", label: "Contacto", icon: Phone },
  // { to: "/admin/inquiries", label: "Consultas", icon: MessageSquare },
  { to: "/admin/admin-users", label: "Admins", icon: Shield },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-60 bg-slate-800 text-white flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:flex-shrink-0
        `}
      >
        {/* Brand + close button */}
        <div className="px-5 py-5 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">502 Jujutsu</h1>
            <p className="text-xs text-slate-400 mt-0.5">Panel Admin</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white font-medium"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 px-5 py-4">
          <p className="text-xs text-slate-400 truncate">{user?.full_name}</p>
          <button
            onClick={logout}
            className="flex items-center gap-2 mt-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main area (top bar + content) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 bg-slate-800 text-white px-4 py-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 hover:text-white transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-base font-bold tracking-tight">502 Jujutsu</h1>
          <span className="text-xs text-slate-400">Panel Admin</span>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
