// ---------------------------------------------------------------------------
// CRUD: merchandise
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/merchandise -- list all, optional ?category= filter
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = `SELECT id, name, slug, description, price, image_url,
                        category, is_available, display_order, created_at, updated_at
                   FROM merchandise`;
    const params = [];

    if (category) {
      query += ` WHERE category = $1`;
      params.push(category);
    }

    query += ` ORDER BY display_order ASC`;

    const { rows } = await db.query(query, params);
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/merchandise error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/merchandise/:id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, slug, description, price, image_url,
              category, is_available, display_order, created_at, updated_at
         FROM merchandise
        WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Merchandise item not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/merchandise/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/merchandise
router.post("/", async (req, res) => {
  const { name, slug, description, price, image_url, category, is_available, display_order } =
    req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: "name and slug are required" });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO merchandise
              (name, slug, description, price, image_url, category, is_available, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name,
        slug,
        description || null,
        price ?? null,
        image_url || null,
        category || "general",
        is_available ?? true,
        display_order ?? 0,
      ]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "slug already exists" });
    }
    console.error("POST /api/merchandise error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/merchandise/:id
router.put("/:id", async (req, res) => {
  const { name, slug, description, price, image_url, category, is_available, display_order } =
    req.body;

  try {
    const { rows } = await db.query(
      `UPDATE merchandise
          SET name          = COALESCE($1, name),
              slug          = COALESCE($2, slug),
              description   = $3,
              price         = $4,
              image_url     = $5,
              category      = COALESCE($6, category),
              is_available  = COALESCE($7, is_available),
              display_order = COALESCE($8, display_order)
        WHERE id = $9
        RETURNING *`,
      [name, slug, description, price, image_url, category, is_available, display_order, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Merchandise item not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "slug already exists" });
    }
    console.error("PUT /api/merchandise/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/merchandise/:id
router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM merchandise WHERE id = $1`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Merchandise item not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/merchandise/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
