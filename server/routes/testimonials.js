// ---------------------------------------------------------------------------
// CRUD: testimonials
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/testimonials -- list all, joined with program name
router.get("/", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT t.id, t.student_name, t.content, t.photo_url,
              t.program_id, p.name AS program_name,
              t.is_featured, t.display_order, t.is_active,
              t.created_at, t.updated_at
         FROM testimonials t
         LEFT JOIN programs p ON p.id = t.program_id
        ORDER BY t.display_order ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/testimonials error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/testimonials/:id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT t.id, t.student_name, t.content, t.photo_url,
              t.program_id, p.name AS program_name,
              t.is_featured, t.display_order, t.is_active,
              t.created_at, t.updated_at
         FROM testimonials t
         LEFT JOIN programs p ON p.id = t.program_id
        WHERE t.id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    return res.json(rows[0]);
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
    const { rows } = await db.query(
      `INSERT INTO testimonials
              (student_name, content, photo_url, program_id, is_featured, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        student_name,
        content,
        photo_url || null,
        program_id || null,
        is_featured ?? false,
        display_order ?? 0,
        is_active ?? true,
      ]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23503") {
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
    const { rows } = await db.query(
      `UPDATE testimonials
          SET student_name  = COALESCE($1, student_name),
              content       = COALESCE($2, content),
              photo_url     = $3,
              program_id    = $4,
              is_featured   = COALESCE($5, is_featured),
              display_order = COALESCE($6, display_order),
              is_active     = COALESCE($7, is_active)
        WHERE id = $8
        RETURNING *`,
      [student_name, content, photo_url, program_id, is_featured, display_order, is_active, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    if (err.code === "23503") {
      return res.status(400).json({ error: "program_id does not exist" });
    }
    console.error("PUT /api/testimonials/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/testimonials/:id
router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM testimonials WHERE id = $1`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/testimonials/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
