// ---------------------------------------------------------------------------
// CRUD: merchandise
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");

const router = Router();

// GET /api/merchandise -- list all
router.get("/", async (_req, res) => {
  try {
    const items = await prisma.merchandise.findMany({
      orderBy: { display_order: "asc" },
    });
    return res.json(items);
  } catch (err) {
    console.error("GET /api/merchandise error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/merchandise/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await prisma.merchandise.findUnique({
      where: { id: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ error: "Merchandise item not found" });
    }
    return res.json(item);
  } catch (err) {
    console.error("GET /api/merchandise/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/merchandise
router.post("/", async (req, res) => {
  const { name, slug, description, price, image_url, is_available, display_order } =
    req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: "name and slug are required" });
  }

  try {
    const item = await prisma.merchandise.create({
      data: {
        name,
        slug,
        description: description || null,
        price: price ?? null,
        image_url: image_url || null,
        is_available: is_available ?? true,
        display_order: display_order ?? 0,
      },
    });
    return res.status(201).json(item);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "slug already exists" });
    }
    console.error("POST /api/merchandise error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/merchandise/:id
router.put("/:id", async (req, res) => {
  const { name, slug, description, price, image_url, is_available, display_order } =
    req.body;

  try {
    const item = await prisma.merchandise.update({
      where: { id: req.params.id },
      data: {
        name,
        slug,
        description,
        price,
        image_url,
        is_available,
        display_order,
      },
    });
    return res.json(item);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Merchandise item not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "slug already exists" });
    }
    console.error("PUT /api/merchandise/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/merchandise/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.merchandise.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Merchandise item not found" });
    }
    console.error("DELETE /api/merchandise/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
