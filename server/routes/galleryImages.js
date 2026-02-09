// ---------------------------------------------------------------------------
// CRUD: gallery_images
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");

const router = Router();

// GET /api/gallery-images -- list all, optional ?category= filter
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { display_order: "asc" },
    });
    return res.json(images);
  } catch (err) {
    console.error("GET /api/gallery-images error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/gallery-images/:id
router.get("/:id", async (req, res) => {
  try {
    const image = await prisma.galleryImage.findUnique({
      where: { id: req.params.id },
    });
    if (!image) {
      return res.status(404).json({ error: "Gallery image not found" });
    }
    return res.json(image);
  } catch (err) {
    console.error("GET /api/gallery-images/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/gallery-images
router.post("/", async (req, res) => {
  const { url, alt_text, caption, category, display_order, is_active } = req.body;

  if (!url || !alt_text || !category) {
    return res.status(400).json({
      error: "url, alt_text, and category are required",
    });
  }

  try {
    const image = await prisma.galleryImage.create({
      data: {
        url,
        alt_text,
        caption: caption || null,
        category,
        display_order: display_order ?? 0,
        is_active: is_active ?? true,
      },
    });
    return res.status(201).json(image);
  } catch (err) {
    console.error("POST /api/gallery-images error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/gallery-images/:id
router.put("/:id", async (req, res) => {
  const { url, alt_text, caption, category, display_order, is_active } = req.body;

  try {
    const image = await prisma.galleryImage.update({
      where: { id: req.params.id },
      data: {
        url,
        alt_text,
        caption,
        category,
        display_order,
        is_active,
      },
    });
    return res.json(image);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Gallery image not found" });
    }
    console.error("PUT /api/gallery-images/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/gallery-images/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.galleryImage.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Gallery image not found" });
    }
    console.error("DELETE /api/gallery-images/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
