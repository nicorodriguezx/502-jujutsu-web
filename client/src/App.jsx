// ---------------------------------------------------------------------------
// App: routes + auth guard
// ---------------------------------------------------------------------------
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Layout from "./Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Programs from "./pages/Programs";
import ScheduleEntries from "./pages/ScheduleEntries";
import Instructors from "./pages/Instructors";
import GalleryImages from "./pages/GalleryImages";
import Announcements from "./pages/Announcements";
import SiteContent from "./pages/SiteContent";
import ContactInfo from "./pages/ContactInfo";
import Merchandise from "./pages/Merchandise";
import Testimonials from "./pages/Testimonials";
import Inquiries from "./pages/Inquiries";
import AdminUsers from "./pages/AdminUsers";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="programs" element={<Programs />} />
        <Route path="schedule" element={<ScheduleEntries />} />
        <Route path="instructors" element={<Instructors />} />
        <Route path="gallery" element={<GalleryImages />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="merchandise" element={<Merchandise />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="site-content" element={<SiteContent />} />
        <Route path="contact-info" element={<ContactInfo />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="admin-users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
