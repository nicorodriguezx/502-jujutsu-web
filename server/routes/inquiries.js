// ---------------------------------------------------------------------------
// CRUD: inquiries
//
// Tracks inbound contact from WhatsApp clicks and contact form submissions.
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/inquiries -- list all, newest first. Optional ?status= filter.
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let query = `SELECT id, full_name, phone, email, message,
                        source, status, created_at, updated_at
                   FROM inquiries`;
    const params = [];

    if (status) {
      query += ` WHERE status = $1`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const { rows } = await db.query(query, params);
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/inquiries error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/inquiries/:id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, full_name, phone, email, message,
              source, status, created_at, updated_at
         FROM inquiries
        WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/inquiries/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/inquiries -- create a new inquiry (public endpoint)
router.post("/", async (req, res) => {
  const { full_name, phone, email, message, source } = req.body;

  if (!full_name) {
    return res.status(400).json({ error: "full_name is required" });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO inquiries (full_name, phone, email, message, source)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [full_name, phone || null, email || null, message || null, source || "whatsapp"]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/inquiries error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/inquiries/:id -- update inquiry (admin: change status, add notes)
router.put("/:id", async (req, res) => {
  const { full_name, phone, email, message, source, status } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE inquiries
          SET full_name = COALESCE($1, full_name),
              phone     = $2,
              email     = $3,
              message   = $4,
              source    = COALESCE($5, source),
              status    = COALESCE($6, status)
        WHERE id = $7
        RETURNING *`,
      [full_name, phone, email, message, source, status, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/inquiries/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/inquiries/:id
router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM inquiries WHERE id = $1`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/inquiries/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
