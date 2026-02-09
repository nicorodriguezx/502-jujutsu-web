// ---------------------------------------------------------------------------
// CRUD: contact_info
//
// Key-value store for phone, WhatsApp, Instagram, address, maps URL.
// Same upsert pattern as site_content.
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");

const router = Router();

// GET /api/contact-info -- list all contact entries
router.get("/", async (_req, res) => {
  try {
    const entries = await prisma.contactInfo.findMany({
      orderBy: { info_key: "asc" },
    });
    return res.json(entries);
  } catch (err) {
    console.error("GET /api/contact-info error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/contact-info/:key -- get one entry by info_key
router.get("/:key", async (req, res) => {
  try {
    const entry = await prisma.contactInfo.findUnique({
      where: { info_key: req.params.key },
    });
    if (!entry) {
      return res.status(404).json({ error: "Contact info key not found" });
    }
    return res.json(entry);
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
    const entry = await prisma.contactInfo.upsert({
      where: { info_key: req.params.key },
      update: { info_value },
      create: { info_key: req.params.key, info_value },
    });
    return res.json(entry);
  } catch (err) {
    console.error("PUT /api/contact-info/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/contact-info/:key -- remove a contact entry
router.delete("/:key", async (req, res) => {
  try {
    await prisma.contactInfo.delete({
      where: { info_key: req.params.key },
    });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Contact info key not found" });
    }
    console.error("DELETE /api/contact-info/:key error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
