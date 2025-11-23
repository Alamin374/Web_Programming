const db = require('./config/db');

async function seed() {
  try {
    const [check] = await db.query("SELECT COUNT(*) AS count FROM tasks");
    if (check[0].count > 0) {
      console.log("Database already seeded!");
      return;
    }

    const sampleTasks = [];

    for (let i = 1; i <= 15; i++) {
      sampleTasks.push([
        `Sample Task ${i}`,
        `Description for sample task ${i}`,
        i % 3 === 0 ? 'completed' : i % 2 === 0 ? 'in-progress' : 'pending'
      ]);
    }

    const sql = "INSERT INTO tasks (title, description, status) VALUES ?";
    await db.query(sql, [sampleTasks]);

    console.log("15 tasks inserted successfully!");

  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    process.exit();
  }
}

seed();
