// ---------------------------------------------------------------------------
// CRUD: admin_users
//
// Manages admin accounts. Passwords are hashed with bcrypt on create/update.
// Password hash is NEVER returned in responses.
// ---------------------------------------------------------------------------
const { Router } = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../db");

const SALT_ROUNDS = 12;

/** Fields to return (excludes password_hash) */
const adminUserSelect = {
  id: true,
  email: true,
  full_name: true,
  is_active: true,
  created_at: true,
  updated_at: true,
};

const router = Router();

// GET /api/admin-users -- list all admin users (no password hashes)
router.get("/", async (_req, res) => {
  try {
    const users = await prisma.adminUser.findMany({
      select: adminUserSelect,
      orderBy: { created_at: "asc" },
    });
    return res.json(users);
  } catch (err) {
    console.error("GET /api/admin-users error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin-users/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: req.params.id },
      select: adminUserSelect,
    });
    if (!user) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    return res.json(user);
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

    const user = await prisma.adminUser.create({
      data: {
        email,
        password_hash,
        full_name,
        is_active: is_active ?? true,
      },
      select: adminUserSelect,
    });
    return res.status(201).json(user);
  } catch (err) {
    if (err.code === "P2002") {
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
    // If a new password is provided, hash it. Otherwise leave it unchanged.
    let password_hash;
    if (password) {
      password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const user = await prisma.adminUser.update({
      where: { id: req.params.id },
      data: {
        email,
        password_hash,
        full_name,
        is_active,
      },
      select: adminUserSelect,
    });
    return res.json(user);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Admin user not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "email already exists" });
    }
    console.error("PUT /api/admin-users/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin-users/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.adminUser.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Admin user not found" });
    }
    console.error("DELETE /api/admin-users/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
