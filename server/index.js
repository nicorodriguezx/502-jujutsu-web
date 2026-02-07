// ---------------------------------------------------------------------------
// 502 Jujutsu - Express API entry point
// ---------------------------------------------------------------------------
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const requireAuth = require("./middleware/auth");
const authRouter = require("./routes/auth");
const programsRouter = require("./routes/programs");
const scheduleEntriesRouter = require("./routes/scheduleEntries");
const instructorsRouter = require("./routes/instructors");
const galleryImagesRouter = require("./routes/galleryImages");
const announcementsRouter = require("./routes/announcements");
const siteContentRouter = require("./routes/siteContent");
const contactInfoRouter = require("./routes/contactInfo");
const merchandiseRouter = require("./routes/merchandise");
const testimonialsRouter = require("./routes/testimonials");
const inquiriesRouter = require("./routes/inquiries");
const adminUsersRouter = require("./routes/adminUsers");

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Public routes (no auth)
// ---------------------------------------------------------------------------
app.use("/api/auth", authRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ---------------------------------------------------------------------------
// Protected routes (require valid JWT)
// ---------------------------------------------------------------------------
app.use("/api/programs", requireAuth, programsRouter);
app.use("/api/schedule-entries", requireAuth, scheduleEntriesRouter);
app.use("/api/instructors", requireAuth, instructorsRouter);
app.use("/api/gallery-images", requireAuth, galleryImagesRouter);
app.use("/api/announcements", requireAuth, announcementsRouter);
app.use("/api/site-content", requireAuth, siteContentRouter);
app.use("/api/contact-info", requireAuth, contactInfoRouter);
app.use("/api/merchandise", requireAuth, merchandiseRouter);
app.use("/api/testimonials", requireAuth, testimonialsRouter);
app.use("/api/inquiries", requireAuth, inquiriesRouter);
app.use("/api/admin-users", requireAuth, adminUsersRouter);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
