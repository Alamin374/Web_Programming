const express = require('express');
const app = express();
const port = 3000;

// Task data
const tasks = [
  { id: 1, title: 'Learn Node.js', completed: false, priority: 'high', createdAt: new Date() },
  { id: 2, title: 'Build REST API', completed: false, priority: 'medium', createdAt: new Date() },
  { id: 3, title: 'Test with Postman', completed: true, priority: 'low', createdAt: new Date() },
  { id: 4, title: 'Write Documentation', completed: false, priority: 'medium', createdAt: new Date() },
  { id: 5, title: 'Push to GitHub', completed: false, priority: 'high', createdAt: new Date() }
];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
