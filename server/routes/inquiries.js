// ---------------------------------------------------------------------------
// CRUD: inquiries
//
// Tracks inbound contact from WhatsApp clicks and contact form submissions.
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");

const router = Router();

// GET /api/inquiries -- list all, newest first. Optional ?status= filter.
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { created_at: "desc" },
    });
    return res.json(inquiries);
  } catch (err) {
    console.error("GET /api/inquiries error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/inquiries/:id
router.get("/:id", async (req, res) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: req.params.id },
    });
    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    return res.json(inquiry);
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
    const inquiry = await prisma.inquiry.create({
      data: {
        full_name,
        phone: phone || null,
        email: email || null,
        message: message || null,
        source: source || "whatsapp",
      },
    });
    return res.status(201).json(inquiry);
  } catch (err) {
    console.error("POST /api/inquiries error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/inquiries/:id -- update inquiry (admin: change status, add notes)
router.put("/:id", async (req, res) => {
  const { full_name, phone, email, message, source, status } = req.body;

  try {
    const inquiry = await prisma.inquiry.update({
      where: { id: req.params.id },
      data: {
        full_name,
        phone,
        email,
        message,
        source,
        status,
      },
    });
    return res.json(inquiry);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    console.error("PUT /api/inquiries/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/inquiries/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.inquiry.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    console.error("DELETE /api/inquiries/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
