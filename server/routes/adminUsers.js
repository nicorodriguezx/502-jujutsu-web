// ---------------------------------------------------------------------------
// CRUD: admin_users
//
// Manages admin accounts. Passwords are hashed with bcrypt on create/update.
// Password hash is NEVER returned in responses.
// ---------------------------------------------------------------------------
const { Router } = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const SALT_ROUNDS = 12;

const router = Router();

// GET /api/admin-users -- list all admin users (no password hashes)
router.get("/", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, email, full_name, is_active, created_at, updated_at
         FROM admin_users
        ORDER BY created_at ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/admin-users error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin-users/:id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, email, full_name, is_active, created_at, updated_at
         FROM admin_users
        WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/admin-users/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin-users -- create a new admin user
router.post("/", async (req, res) => {
  const { email, password, full_name, is_active } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({
      error: "email, password, and full_name are required",
    });
  }

  try {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const { rows } = await db.query(
      `INSERT INTO admin_users (email, password_hash, full_name, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, is_active, created_at, updated_at`,
      [email, password_hash, full_name, is_active ?? true]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "email already exists" });
    }
    console.error("POST /api/admin-users error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/admin-users/:id -- update admin user (password optional)
router.put("/:id", async (req, res) => {
  const { email, password, full_name, is_active } = req.body;

  try {
    // If a new password is provided, hash it. Otherwise keep the existing one.
    let password_hash = null;
    if (password) {
      password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const { rows } = await db.query(
      `UPDATE admin_users
          SET email         = COALESCE($1, email),
              password_hash = COALESCE($2, password_hash),
              full_name     = COALESCE($3, full_name),
              is_active     = COALESCE($4, is_active)
        WHERE id = $5
        RETURNING id, email, full_name, is_active, created_at, updated_at`,
      [email, password_hash, full_name, is_active, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "email already exists" });
    }
    console.error("PUT /api/admin-users/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin-users/:id
router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM admin_users WHERE id = $1`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/admin-users/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
