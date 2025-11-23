const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all tasks
// GET /tasks with pagination + search + exclude soft-deleted items
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const search = req.query.q ? `%${req.query.q}%` : "%%";
    const offset = (page - 1) * limit;

    // Count total non-deleted tasks
    const [countResult] = await db.query(
      "SELECT COUNT(*) AS count FROM tasks WHERE deleted_at IS NULL AND title LIKE ?",
      [search]
    );

    const totalTasks = countResult[0].count;
    const totalPages = Math.ceil(totalTasks / limit);

    // Paginated tasks
    const [rows] = await db.query(
      `SELECT * FROM tasks 
       WHERE deleted_at IS NULL 
       AND title LIKE ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [search, limit, offset]
    );

    res.json({
      totalTasks,
      totalPages,
      currentPage: page,
      limit,
      data: rows
    });

  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: "Database error" });
  }
});


// POST create task
router.post('/', async (req, res) => {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const sql = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
        const [result] = await db.query(sql, [title, description || null]);

        const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

        res.status(201).json(newTask[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT update task
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const updates = [];
        const values = [];

        if (title !== undefined) { updates.push('title = ?'); values.push(title); }
        if (description !== undefined) { updates.push('description = ?'); values.push(description); }
        if (status !== undefined) { updates.push('status = ?'); values.push(status); }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);

        const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const [updated] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
        res.json(updated[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE task
// SOFT DELETE task (set deleted_at timestamp)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE tasks SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found or already deleted" });
    }

    res.status(204).send();
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: "Failed to soft delete task" });
  }
});

// GET only soft-deleted tasks
router.get('/deleted/all', async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM tasks WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC"
    );

    res.json(rows);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: "Database error" });
  }
});


module.exports = router;
