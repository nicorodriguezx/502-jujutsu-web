// ---------------------------------------------------------------------------
// CRUD: programs
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/programs -- list all active programs, ordered by display_order
router.get("/", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, slug, subtitle, description, image_url,
              age_range_min, age_range_max, target_audience,
              display_order, is_active, created_at, updated_at
         FROM programs
        ORDER BY display_order ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/programs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/programs/:id -- get one program by id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, slug, subtitle, description, image_url,
              age_range_min, age_range_max, target_audience,
              display_order, is_active, created_at, updated_at
         FROM programs
        WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }
    return res.json(rows[0]);
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
    const { rows } = await db.query(
      `INSERT INTO programs
              (name, slug, subtitle, description, image_url, age_range_min, age_range_max,
               target_audience, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name,
        slug,
        subtitle || null,
        description,
        image_url || null,
        age_range_min ?? null,
        age_range_max ?? null,
        target_audience,
        display_order ?? 0,
        is_active ?? true,
      ]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
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
    const { rows } = await db.query(
      `UPDATE programs
          SET name            = COALESCE($1, name),
              slug            = COALESCE($2, slug),
              subtitle        = $3,
              description     = COALESCE($4, description),
              image_url       = $5,
              age_range_min   = $6,
              age_range_max   = $7,
              target_audience = COALESCE($8, target_audience),
              display_order   = COALESCE($9, display_order),
              is_active       = COALESCE($10, is_active)
        WHERE id = $11
        RETURNING *`,
      [
        name,
        slug,
        subtitle,
        description,
        image_url,
        age_range_min ?? null,
        age_range_max ?? null,
        target_audience,
        display_order,
        is_active,
        req.params.id,
      ]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "slug already exists" });
    }
    console.error("PUT /api/programs/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/programs/:id -- delete a program (cascades to schedule_entries)
router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM programs WHERE id = $1`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Program not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/programs/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
