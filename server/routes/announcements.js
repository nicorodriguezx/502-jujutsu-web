// ---------------------------------------------------------------------------
// CRUD: announcements
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/announcements -- list all (admin view, includes drafts)
// Query param ?published=true returns only published & active
router.get("/", async (req, res) => {
  try {
    const publishedOnly = req.query.published === "true";

    let query = `SELECT id, title, body, published_at,
                        is_active, created_at, updated_at
                   FROM announcements`;

    if (publishedOnly) {
      query += ` WHERE is_active = TRUE
                   AND published_at IS NOT NULL
                   AND published_at <= now()`;
    }

    query += ` ORDER BY published_at DESC NULLS LAST, created_at DESC`;

    const { rows } = await db.query(query);
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/announcements error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/announcements/:id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, title, body, published_at,
              is_active, created_at, updated_at
         FROM announcements
        WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    return res.json(rows[0]);
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
    const { rows } = await db.query(
      `INSERT INTO announcements (title, body, published_at, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, body, published_at || null, is_active ?? true]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/announcements error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/announcements/:id
router.put("/:id", async (req, res) => {
  const { title, body, published_at, is_active } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE announcements
          SET title        = COALESCE($1, title),
              body         = COALESCE($2, body),
              published_at = $3,
              is_active    = COALESCE($4, is_active)
        WHERE id = $5
        RETURNING *`,
      [title, body, published_at, is_active, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/announcements/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/announcements/:id
router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM announcements WHERE id = $1`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/announcements/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
