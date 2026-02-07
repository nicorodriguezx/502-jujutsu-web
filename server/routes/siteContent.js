// ---------------------------------------------------------------------------
// CRUD: site_content
//
// Key-value store. The frontend reads by section_key.
// Admin creates/updates entries by key.
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/site-content -- list all content entries
router.get("/", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, section_key, content_text, updated_at
         FROM site_content
        ORDER BY section_key ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/site-content error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/site-content/:key -- get one entry by section_key
router.get("/:key", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, section_key, content_text, updated_at
         FROM site_content
        WHERE section_key = $1`,
      [req.params.key]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Content key not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/site-content/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/site-content/:key -- upsert: create if missing, update if exists
router.put("/:key", async (req, res) => {
  const { content_text } = req.body;

  if (!content_text) {
    return res.status(400).json({ error: "content_text is required" });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO site_content (section_key, content_text)
       VALUES ($1, $2)
       ON CONFLICT (section_key) DO UPDATE
          SET content_text = EXCLUDED.content_text
       RETURNING *`,
      [req.params.key, content_text]
    );
    return res.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/site-content/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/site-content/:key -- remove a content entry
router.delete("/:key", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM site_content WHERE section_key = $1`,
      [req.params.key]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Content key not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/site-content/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
