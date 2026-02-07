// ---------------------------------------------------------------------------
// Dashboard: overview counts for each resource
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  BookOpen,
  Calendar,
  Users,
  Image,
  Megaphone,
  ShoppingBag,
  Quote,
  MessageSquare,
} from "lucide-react";

const CARDS = [
  { label: "Programas", icon: BookOpen, url: "/api/programs", to: "/programs" },
  { label: "Horarios", icon: Calendar, url: "/api/schedule-entries", to: "/schedule" },
  { label: "Instructores", icon: Users, url: "/api/instructors", to: "/instructors" },
  { label: "Galería", icon: Image, url: "/api/gallery-images", to: "/gallery" },
  { label: "Anuncios", icon: Megaphone, url: "/api/announcements", to: "/announcements" },
  { label: "Mercancía", icon: ShoppingBag, url: "/api/merchandise", to: "/merchandise" },
  { label: "Testimonios", icon: Quote, url: "/api/testimonials", to: "/testimonials" },
  { label: "Consultas nuevas", icon: MessageSquare, url: "/api/inquiries?status=new", to: "/inquiries" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    CARDS.forEach(({ url }) => {
      api.get(url).then((data) => {
        setCounts((prev) => ({ ...prev, [url]: data.length }));
      });
    });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map(({ label, icon: Icon, url, to }) => (
          <Link
            key={url}
            to={to}
            className="bg-white rounded-lg border p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {counts[url] !== undefined ? counts[url] : "—"}
                </p>
              </div>
              <Icon size={28} className="text-blue-600" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
