// ---------------------------------------------------------------------------
// CRUD: testimonials
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");

const router = Router();

/** Flatten Prisma's nested program relation into program_name */
function flattenTestimonial({ program, ...rest }) {
  return {
    ...rest,
    program_name: program?.name ?? null,
  };
}

// GET /api/testimonials -- list all, joined with program name
router.get("/", async (_req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: { program: { select: { name: true } } },
      orderBy: { display_order: "asc" },
    });
    return res.json(testimonials.map(flattenTestimonial));
  } catch (err) {
    console.error("GET /api/testimonials error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/testimonials/:id
router.get("/:id", async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: req.params.id },
      include: { program: { select: { name: true } } },
    });
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    return res.json(flattenTestimonial(testimonial));
  } catch (err) {
    console.error("GET /api/testimonials/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/testimonials
router.post("/", async (req, res) => {
  const { student_name, content, photo_url, program_id, is_featured, display_order, is_active } =
    req.body;

  if (!student_name || !content) {
    return res.status(400).json({ error: "student_name and content are required" });
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        student_name,
        content,
        photo_url: photo_url || null,
        program_id: program_id || null,
        is_featured: is_featured ?? false,
        display_order: display_order ?? 0,
        is_active: is_active ?? true,
      },
    });
    return res.status(201).json(testimonial);
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({ error: "program_id does not exist" });
    }
    console.error("POST /api/testimonials error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/testimonials/:id
router.put("/:id", async (req, res) => {
  const { student_name, content, photo_url, program_id, is_featured, display_order, is_active } =
    req.body;

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: {
        student_name,
        content,
        photo_url,
        program_id,
        is_featured,
        display_order,
        is_active,
      },
    });
    return res.json(testimonial);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ error: "program_id does not exist" });
    }
    console.error("PUT /api/testimonials/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/testimonials/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    console.error("DELETE /api/testimonials/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
