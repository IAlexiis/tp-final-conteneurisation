const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

db.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE
  )
`, (err) => {
  if (err) console.error('DB Table creation error:', err);
});

app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, title, done: false });
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;
  db.query(
    'UPDATE tasks SET title = ?, done = ? WHERE id = ?',
    [title, done ? 1 : 0, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Task updated' });
    }
  );
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Task deleted' });
  });
});


app.listen(3000, () => {
  console.log('🚀 Backend running on port 3000');
});
