// ---------------------------------------------------------------------------
// CRUD: gallery_images
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/gallery-images -- list all, optional ?category= filter
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = `SELECT id, url, alt_text, caption, category,
                        display_order, is_active, created_at, updated_at
                   FROM gallery_images`;
    const params = [];

    if (category) {
      query += ` WHERE category = $1`;
      params.push(category);
    }

    query += ` ORDER BY display_order ASC`;

    const { rows } = await db.query(query, params);
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/gallery-images error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/gallery-images/:id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, url, alt_text, caption, category,
              display_order, is_active, created_at, updated_at
         FROM gallery_images
        WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Gallery image not found" });
    }
    return res.json(rows[0]);
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
    const { rows } = await db.query(
      `INSERT INTO gallery_images (url, alt_text, caption, category, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [url, alt_text, caption || null, category, display_order ?? 0, is_active ?? true]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/gallery-images error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/gallery-images/:id
router.put("/:id", async (req, res) => {
  const { url, alt_text, caption, category, display_order, is_active } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE gallery_images
          SET url           = COALESCE($1, url),
              alt_text      = COALESCE($2, alt_text),
              caption       = $3,
              category      = COALESCE($4, category),
              display_order = COALESCE($5, display_order),
              is_active     = COALESCE($6, is_active)
        WHERE id = $7
        RETURNING *`,
      [url, alt_text, caption, category, display_order, is_active, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Gallery image not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/gallery-images/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/gallery-images/:id
router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM gallery_images WHERE id = $1`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Gallery image not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/gallery-images/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
