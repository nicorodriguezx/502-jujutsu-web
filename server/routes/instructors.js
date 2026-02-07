// ---------------------------------------------------------------------------
// CRUD: instructors
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/instructors -- list all, ordered by display_order
router.get("/", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, full_name, bio, photo_url,
              display_order, is_active, created_at, updated_at
         FROM instructors
        ORDER BY display_order ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/instructors error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/instructors/:id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, full_name, bio, photo_url,
              display_order, is_active, created_at, updated_at
         FROM instructors
        WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Instructor not found" });
    }
    return res.json(rows[0]);
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
    const { rows } = await db.query(
      `INSERT INTO instructors (full_name, bio, photo_url, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [full_name, bio || null, photo_url || null, display_order ?? 0, is_active ?? true]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/instructors error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/instructors/:id
router.put("/:id", async (req, res) => {
  const { full_name, bio, photo_url, display_order, is_active } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE instructors
          SET full_name     = COALESCE($1, full_name),
              bio           = $2,
              photo_url     = $3,
              display_order = COALESCE($4, display_order),
              is_active     = COALESCE($5, is_active)
        WHERE id = $6
        RETURNING *`,
      [full_name, bio, photo_url, display_order, is_active, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Instructor not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/instructors/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/instructors/:id
router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM instructors WHERE id = $1`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Instructor not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/instructors/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
