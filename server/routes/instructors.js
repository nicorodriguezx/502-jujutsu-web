// ---------------------------------------------------------------------------
// CRUD: instructors
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");

const router = Router();

// GET /api/instructors -- list all, ordered by display_order
router.get("/", async (_req, res) => {
  try {
    const instructors = await prisma.instructor.findMany({
      orderBy: { display_order: "asc" },
    });
    return res.json(instructors);
  } catch (err) {
    console.error("GET /api/instructors error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/instructors/:id
router.get("/:id", async (req, res) => {
  try {
    const instructor = await prisma.instructor.findUnique({
      where: { id: req.params.id },
    });
    if (!instructor) {
      return res.status(404).json({ error: "Instructor not found" });
    }
    return res.json(instructor);
  } catch (err) {
    console.error("GET /api/instructors/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/instructors
router.post("/", async (req, res) => {
  const { full_name, bio, photo_url, display_order, is_active } = req.body;

  if (!full_name) {
    return res.status(400).json({ error: "full_name is required" });
  }

  try {
    const instructor = await prisma.instructor.create({
      data: {
        full_name,
        bio: bio || null,
        photo_url: photo_url || null,
        display_order: display_order ?? 0,
        is_active: is_active ?? true,
      },
    });
    return res.status(201).json(instructor);
  } catch (err) {
    console.error("POST /api/instructors error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/instructors/:id
router.put("/:id", async (req, res) => {
  const { full_name, bio, photo_url, display_order, is_active } = req.body;

  try {
    const instructor = await prisma.instructor.update({
      where: { id: req.params.id },
      data: {
        full_name,
        bio,
        photo_url,
        display_order,
        is_active,
      },
    });
    return res.json(instructor);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Instructor not found" });
    }
    console.error("PUT /api/instructors/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/instructors/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.instructor.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Instructor not found" });
    }
    console.error("DELETE /api/instructors/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
