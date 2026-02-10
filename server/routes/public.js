// ---------------------------------------------------------------------------
// Public read-only API endpoints for the landing page.
// No authentication required. GET only.
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");
const { formatTime } = require("../utils/formatters");

const router = Router();

// GET /api/public/site-content -- all content entries
router.get("/site-content", async (_req, res) => {
  try {
    const rows = await prisma.siteContent.findMany({
      select: { section_key: true, content_text: true },
      orderBy: { section_key: "asc" },
    });
    // Return as a key-value object for easy frontend consumption
    const content = {};
    for (const row of rows) {
      content[row.section_key] = row.content_text;
    }
    return res.json(content);
  } catch (err) {
    console.error("GET /api/public/site-content error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/contact-info -- all contact entries as key-value
router.get("/contact-info", async (_req, res) => {
  try {
    const rows = await prisma.contactInfo.findMany({
      select: { info_key: true, info_value: true },
      orderBy: { info_key: "asc" },
    });
    const info = {};
    for (const row of rows) {
      info[row.info_key] = row.info_value;
    }
    return res.json(info);
  } catch (err) {
    console.error("GET /api/public/contact-info error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/programs -- active programs ordered by display_order
router.get("/programs", async (_req, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: { is_active: true },
      select: {
        id: true,
        name: true,
        slug: true,
        subtitle: true,
        description: true,
        age_range_min: true,
        age_range_max: true,
        target_audience: true,
        image_url: true,
      },
      orderBy: { display_order: "asc" },
    });
    return res.json(programs);
  } catch (err) {
    console.error("GET /api/public/programs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/schedule -- active schedule entries with program name
router.get("/schedule", async (_req, res) => {
  try {
    const entries = await prisma.scheduleEntry.findMany({
      where: {
        is_active: true,
        program: { is_active: true },
      },
      select: {
        day_of_week: true,
        start_time: true,
        end_time: true,
        description: true,
        program: { select: { name: true } },
      },
      orderBy: [{ day_of_week: "asc" }, { start_time: "asc" }],
    });
    // Flatten program relation and format time fields
    const result = entries.map(({ program, ...rest }) => ({
      ...rest,
      start_time: formatTime(rest.start_time),
      end_time: formatTime(rest.end_time),
      program_name: program.name,
    }));
    return res.json(result);
  } catch (err) {
    console.error("GET /api/public/schedule error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/instructors -- active instructors
router.get("/instructors", async (_req, res) => {
  try {
    const instructors = await prisma.instructor.findMany({
      where: { is_active: true },
      select: {
        full_name: true,
        bio: true,
        photo_url: true,
      },
      orderBy: { display_order: "asc" },
    });
    return res.json(instructors);
  } catch (err) {
    console.error("GET /api/public/instructors error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/gallery -- active gallery images, optional ?category=
router.get("/gallery", async (req, res) => {
  try {
    const { category } = req.query;
    const where = { is_active: true };
    if (category) {
      where.category = category;
    }

    const images = await prisma.galleryImage.findMany({
      where,
      select: {
        id: true,
        url: true,
        alt_text: true,
        caption: true,
        category: true,
      },
      orderBy: { display_order: "asc" },
    });
    return res.json(images);
  } catch (err) {
    console.error("GET /api/public/gallery error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/announcements -- published and active only
router.get("/announcements", async (_req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        is_active: true,
        published_at: { lte: new Date() },
      },
      select: {
        title: true,
        body: true,
        published_at: true,
      },
      orderBy: { published_at: "desc" },
    });
    return res.json(announcements);
  } catch (err) {
    console.error("GET /api/public/announcements error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/merchandise -- available merchandise
router.get("/merchandise", async (_req, res) => {
  try {
    const items = await prisma.merchandise.findMany({
      where: { is_available: true },
      select: {
        name: true,
        slug: true,
        description: true,
        price: true,
        image_url: true,
      },
      orderBy: { display_order: "asc" },
    });
    return res.json(items);
  } catch (err) {
    console.error("GET /api/public/merchandise error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/testimonials -- active testimonials with program name
router.get("/testimonials", async (_req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { is_active: true },
      select: {
        student_name: true,
        content: true,
        photo_url: true,
        is_featured: true,
        program: { select: { name: true } },
      },
      orderBy: [{ is_featured: "desc" }, { display_order: "asc" }],
    });
    // Flatten program relation
    const result = testimonials.map(({ program, ...rest }) => ({
      ...rest,
      program_name: program?.name ?? null,
    }));
    return res.json(result);
  } catch (err) {
    console.error("GET /api/public/testimonials error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
