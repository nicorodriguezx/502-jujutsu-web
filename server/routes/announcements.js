// ---------------------------------------------------------------------------
// CRUD: announcements
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");

const router = Router();

// GET /api/announcements -- list all (admin view, includes drafts)
// Query param ?published=true returns only published & active
router.get("/", async (req, res) => {
  try {
    const publishedOnly = req.query.published === "true";

    const where = publishedOnly
      ? { is_active: true, published_at: { lte: new Date() } }
      : {};

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [
        { published_at: { sort: "desc", nulls: "last" } },
        { created_at: "desc" },
      ],
    });
    return res.json(announcements);
  } catch (err) {
    console.error("GET /api/announcements error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/announcements/:id
router.get("/:id", async (req, res) => {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: req.params.id },
    });
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    return res.json(announcement);
  } catch (err) {
    console.error("GET /api/announcements/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/announcements
router.post("/", async (req, res) => {
  const { title, body, published_at, is_active } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: "title and body are required" });
  }

  try {
    const announcement = await prisma.announcement.create({
      data: {
        title,
        body,
        published_at: published_at || null,
        is_active: is_active ?? true,
      },
    });
    return res.status(201).json(announcement);
  } catch (err) {
    console.error("POST /api/announcements error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/announcements/:id
router.put("/:id", async (req, res) => {
  const { title, body, published_at, is_active } = req.body;

  try {
    const announcement = await prisma.announcement.update({
      where: { id: req.params.id },
      data: {
        title,
        body,
        published_at,
        is_active,
      },
    });
    return res.json(announcement);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Announcement not found" });
    }
    console.error("PUT /api/announcements/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/announcements/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Announcement not found" });
    }
    console.error("DELETE /api/announcements/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
