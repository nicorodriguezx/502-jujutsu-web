// ---------------------------------------------------------------------------
// CRUD: contact_info
//
// Key-value store for phone, WhatsApp, Instagram, address, maps URL.
// Same upsert pattern as site_content.
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/contact-info -- list all contact entries
router.get("/", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, info_key, info_value, updated_at
         FROM contact_info
        ORDER BY info_key ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/contact-info error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/contact-info/:key -- get one entry by info_key
router.get("/:key", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, info_key, info_value, updated_at
         FROM contact_info
        WHERE info_key = $1`,
      [req.params.key]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Contact info key not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/contact-info/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/contact-info/:key -- upsert: create if missing, update if exists
router.put("/:key", async (req, res) => {
  const { info_value } = req.body;

  if (!info_value) {
    return res.status(400).json({ error: "info_value is required" });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO contact_info (info_key, info_value)
       VALUES ($1, $2)
       ON CONFLICT (info_key) DO UPDATE
          SET info_value = EXCLUDED.info_value
       RETURNING *`,
      [req.params.key, info_value]
    );
    return res.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/contact-info/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/contact-info/:key -- remove a contact entry
router.delete("/:key", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM contact_info WHERE info_key = $1`,
      [req.params.key]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Contact info key not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/contact-info/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
