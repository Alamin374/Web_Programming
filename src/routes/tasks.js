const express = require('express');
const router = express.Router();

const tasks = [
  { id: 1, title: 'Learn Node.js', completed: false, priority: 'high', createdAt: new Date() },
  { id: 2, title: 'Build REST API', completed: false, priority: 'medium', createdAt: new Date() },
  { id: 3, title: 'Test with Postman', completed: true, priority: 'low', createdAt: new Date() },
  { id: 4, title: 'Write Documentation', completed: false, priority: 'medium', createdAt: new Date() },
  { id: 5, title: 'Push to GitHub', completed: false, priority: 'high', createdAt: new Date() }
];

router.get('/tasks', (req, res) => {
  res.json(tasks);
});

router.get('/task/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

module.exports = router;
