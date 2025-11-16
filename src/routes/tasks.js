const express = require('express');
const router = express.Router();

const tasks = [
  { id: 1, title: "Learn Node.js", completed: false, priority: "high", createdAt: new Date() },
  { id: 2, title: "Build REST API", completed: false, priority: "medium", createdAt: new Date() },
  { id: 3, title: "Practice Postman", completed: true, priority: "low", createdAt: new Date() },
  { id: 4, title: "Write Documentation", completed: false, priority: "medium", createdAt: new Date() },
  { id: 5, title: "Push Code to GitHub", completed: true, priority: "high", createdAt: new Date() }
];

router.get('/tasks', (req, res) => {
  res.json(tasks);
});

module.exports = router;
