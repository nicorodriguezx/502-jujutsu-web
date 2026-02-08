// ---------------------------------------------------------------------------
// Admin layout: sidebar navigation + main content area.
// ---------------------------------------------------------------------------
import { NavLink, Outlet } from "react-router-dom";
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
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-slate-800 text-white flex flex-col">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-700">
          <h1 className="text-lg font-bold tracking-tight">502 Jujutsu</h1>
          <p className="text-xs text-slate-400 mt-0.5">Panel Admin</p>
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

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
