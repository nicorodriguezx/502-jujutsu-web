// ---------------------------------------------------------------------------
// CRUD: programs
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");

const router = Router();

// GET /api/programs -- list all programs, ordered by display_order
router.get("/", async (_req, res) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { display_order: "asc" },
    });
    return res.json(programs);
  } catch (err) {
    console.error("GET /api/programs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/programs/:id -- get one program by id
router.get("/:id", async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
    });
    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }
    return res.json(program);
  } catch (err) {
    console.error("GET /api/programs/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/programs -- create a new program
router.post("/", async (req, res) => {
  const {
    name,
    slug,
    subtitle,
    description,
    image_url,
    age_range_min,
    age_range_max,
    target_audience,
    display_order,
    is_active,
  } = req.body;

  if (!name || !slug || !description || !target_audience) {
    return res.status(400).json({
      error: "name, slug, description, and target_audience are required",
    });
  }

  try {
    const program = await prisma.program.create({
      data: {
        name,
        slug,
        subtitle: subtitle || null,
        description,
        image_url: image_url || null,
        age_range_min: age_range_min ?? null,
        age_range_max: age_range_max ?? null,
        target_audience,
        display_order: display_order ?? 0,
        is_active: is_active ?? true,
      },
    });
    return res.status(201).json(program);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "slug already exists" });
    }
    console.error("POST /api/programs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/programs/:id -- update an existing program
router.put("/:id", async (req, res) => {
  const {
    name,
    slug,
    subtitle,
    description,
    image_url,
    age_range_min,
    age_range_max,
    target_audience,
    display_order,
    is_active,
  } = req.body;

  try {
    const program = await prisma.program.update({
      where: { id: req.params.id },
      data: {
        name,
        slug,
        subtitle,
        description,
        image_url,
        age_range_min,
        age_range_max,
        target_audience,
        display_order,
        is_active,
      },
    });
    return res.json(program);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Program not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "slug already exists" });
    }
    console.error("PUT /api/programs/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/programs/:id -- delete a program (cascades to schedule_entries)
router.delete("/:id", async (req, res) => {
  try {
    await prisma.program.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Program not found" });
    }
    console.error("DELETE /api/programs/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
