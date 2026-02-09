// ---------------------------------------------------------------------------
// Public read-only API endpoints for the landing page.
// No authentication required. GET only.
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/public/site-content -- all content entries
router.get("/site-content", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT section_key, content_text FROM site_content ORDER BY section_key`
    );
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
    const { rows } = await db.query(
      `SELECT info_key, info_value FROM contact_info ORDER BY info_key`
    );
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
    const { rows } = await db.query(
      `SELECT id, name, slug, subtitle, description,
              age_range_min, age_range_max, target_audience, image_url
         FROM programs
        WHERE is_active = TRUE
        ORDER BY display_order ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/public/programs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/schedule -- active schedule entries with program name
router.get("/schedule", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT se.day_of_week, se.start_time, se.end_time,
              se.description, p.name AS program_name
         FROM schedule_entries se
         JOIN programs p ON p.id = se.program_id
        WHERE se.is_active = TRUE AND p.is_active = TRUE
        ORDER BY se.day_of_week ASC, se.start_time ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/public/schedule error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/instructors -- active instructors
router.get("/instructors", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT full_name, bio, photo_url
         FROM instructors
        WHERE is_active = TRUE
        ORDER BY display_order ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/public/instructors error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/gallery -- active gallery images, optional ?category=
router.get("/gallery", async (req, res) => {
  try {
    const { category } = req.query;
    let query = `SELECT id, url, alt_text, caption, category
                   FROM gallery_images
                  WHERE is_active = TRUE`;
    const params = [];
    if (category) {
      query += ` AND category = $1`;
      params.push(category);
    }
    query += ` ORDER BY display_order ASC`;
    const { rows } = await db.query(query, params);
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/public/gallery error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/announcements -- published and active only
router.get("/announcements", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT title, body, published_at
         FROM announcements
        WHERE is_active = TRUE
          AND published_at IS NOT NULL
          AND published_at <= now()
        ORDER BY published_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/public/announcements error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/merchandise -- available merchandise
router.get("/merchandise", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT name, slug, description, price, image_url, category
         FROM merchandise
        WHERE is_available = TRUE
        ORDER BY display_order ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/public/merchandise error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/testimonials -- active testimonials with program name
router.get("/testimonials", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT t.student_name, t.content, t.photo_url,
              t.is_featured, p.name AS program_name
         FROM testimonials t
         LEFT JOIN programs p ON p.id = t.program_id
        WHERE t.is_active = TRUE
        ORDER BY t.is_featured DESC, t.display_order ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/public/testimonials error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
