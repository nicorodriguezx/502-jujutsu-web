// ---------------------------------------------------------------------------
// CRUD: schedule_entries
// ---------------------------------------------------------------------------
const { Router } = require("express");
const db = require("../db");

const router = Router();

// GET /api/schedule-entries -- list all, joined with program name
router.get("/", async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT se.id, se.program_id, p.name AS program_name,
              se.day_of_week, se.start_time, se.end_time,
              se.description, se.is_active, se.created_at, se.updated_at
         FROM schedule_entries se
         JOIN programs p ON p.id = se.program_id
        ORDER BY se.day_of_week ASC, se.start_time ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/schedule-entries error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/schedule-entries/:id -- get one by id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT se.id, se.program_id, p.name AS program_name,
              se.day_of_week, se.start_time, se.end_time,
              se.description, se.is_active, se.created_at, se.updated_at
         FROM schedule_entries se
         JOIN programs p ON p.id = se.program_id
        WHERE se.id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Schedule entry not found" });
    }
    return res.json(rows[0]);
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
    const { rows } = await db.query(
      `INSERT INTO schedule_entries
              (program_id, day_of_week, start_time, end_time, description, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        program_id,
        day_of_week,
        start_time,
        end_time,
        description || null,
        is_active ?? true,
      ]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23503") {
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
    const { rows } = await db.query(
      `UPDATE schedule_entries
          SET program_id  = COALESCE($1, program_id),
              day_of_week = COALESCE($2, day_of_week),
              start_time  = COALESCE($3, start_time),
              end_time    = COALESCE($4, end_time),
              description = $5,
              is_active   = COALESCE($6, is_active)
        WHERE id = $7
        RETURNING *`,
      [
        program_id,
        day_of_week,
        start_time,
        end_time,
        description,
        is_active,
        req.params.id,
      ]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Schedule entry not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    if (err.code === "23503") {
      return res.status(400).json({ error: "program_id does not exist" });
    }
    console.error("PUT /api/schedule-entries/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/schedule-entries/:id -- delete a schedule entry
router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM schedule_entries WHERE id = $1`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Schedule entry not found" });
    }
    return res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/schedule-entries/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
