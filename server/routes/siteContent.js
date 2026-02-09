// ---------------------------------------------------------------------------
// CRUD: site_content
//
// Key-value store. The frontend reads by section_key.
// Admin creates/updates entries by key.
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");

const router = Router();

// GET /api/site-content -- list all content entries
router.get("/", async (_req, res) => {
  try {
    const entries = await prisma.siteContent.findMany({
      orderBy: { section_key: "asc" },
    });
    return res.json(entries);
  } catch (err) {
    console.error("GET /api/site-content error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/site-content/:key -- get one entry by section_key
router.get("/:key", async (req, res) => {
  try {
    const entry = await prisma.siteContent.findUnique({
      where: { section_key: req.params.key },
    });
    if (!entry) {
      return res.status(404).json({ error: "Content key not found" });
    }
    return res.json(entry);
  } catch (err) {
    console.error("GET /api/site-content/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/site-content/:key -- upsert: create if missing, update if exists
router.put("/:key", async (req, res) => {
  const { content_text } = req.body;

  if (!content_text) {
    return res.status(400).json({ error: "content_text is required" });
  }

  try {
    const entry = await prisma.siteContent.upsert({
      where: { section_key: req.params.key },
      update: { content_text },
      create: { section_key: req.params.key, content_text },
    });
    return res.json(entry);
  } catch (err) {
    console.error("PUT /api/site-content/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/site-content/:key -- remove a content entry
router.delete("/:key", async (req, res) => {
  try {
    await prisma.siteContent.delete({
      where: { section_key: req.params.key },
    });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Content key not found" });
    }
    console.error("DELETE /api/site-content/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
