// ---------------------------------------------------------------------------
// CRUD: schedule_entries
// ---------------------------------------------------------------------------
const { Router } = require("express");
const prisma = require("../db");
const { formatTime, parseTime } = require("../utils/formatters");

const router = Router();

/** Flatten Prisma's nested program relation and format time fields */
function formatEntry({ program, ...rest }) {
  return {
    ...rest,
    program_name: program?.name ?? null,
    start_time: formatTime(rest.start_time),
    end_time: formatTime(rest.end_time),
  };
}

/** Format time fields on a plain entry (no program join) */
function formatEntryTimes(entry) {
  return {
    ...entry,
    start_time: formatTime(entry.start_time),
    end_time: formatTime(entry.end_time),
  };
}

// GET /api/schedule-entries -- list all, joined with program name
router.get("/", async (_req, res) => {
  try {
    const entries = await prisma.scheduleEntry.findMany({
      include: { program: { select: { name: true } } },
      orderBy: [{ day_of_week: "asc" }, { start_time: "asc" }],
    });
    return res.json(entries.map(formatEntry));
  } catch (err) {
    console.error("GET /api/schedule-entries error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/schedule-entries/:id -- get one by id
router.get("/:id", async (req, res) => {
  try {
    const entry = await prisma.scheduleEntry.findUnique({
      where: { id: req.params.id },
      include: { program: { select: { name: true } } },
    });
    if (!entry) {
      return res.status(404).json({ error: "Schedule entry not found" });
    }
    return res.json(formatEntry(entry));
  } catch (err) {
    console.error("GET /api/schedule-entries/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/schedule-entries -- create a new schedule entry
router.post("/", async (req, res) => {
  const { program_id, day_of_week, start_time, end_time, description, is_active } =
    req.body;

  if (!program_id || day_of_week === undefined || !start_time || !end_time) {
    return res.status(400).json({
      error: "program_id, day_of_week, start_time, and end_time are required",
    });
  }

  try {
    const entry = await prisma.scheduleEntry.create({
      data: {
        program_id,
        day_of_week,
        start_time: parseTime(start_time),
        end_time: parseTime(end_time),
        description: description || null,
        is_active: is_active ?? true,
      },
    });
    return res.status(201).json(formatEntryTimes(entry));
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({ error: "program_id does not exist" });
    }
    console.error("POST /api/schedule-entries error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/schedule-entries/:id -- update a schedule entry
router.put("/:id", async (req, res) => {
  const { program_id, day_of_week, start_time, end_time, description, is_active } =
    req.body;

  try {
    const entry = await prisma.scheduleEntry.update({
      where: { id: req.params.id },
      data: {
        program_id,
        day_of_week,
        start_time: parseTime(start_time),
        end_time: parseTime(end_time),
        description,
        is_active,
      },
    });
    return res.json(formatEntryTimes(entry));
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Schedule entry not found" });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ error: "program_id does not exist" });
    }
    console.error("PUT /api/schedule-entries/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/schedule-entries/:id -- delete a schedule entry
router.delete("/:id", async (req, res) => {
  try {
    await prisma.scheduleEntry.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Schedule entry not found" });
    }
    console.error("DELETE /api/schedule-entries/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
