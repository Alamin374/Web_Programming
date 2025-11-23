const express = require('express');
const taskRoutes = require('./routes/tasks');

const app = express();
const port = 3000;

app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send("MySQL Powered Task Management API Running");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
