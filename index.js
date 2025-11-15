const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// GET ALL
app.get('/students', async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM students");
    res.json(rows);
});

// GET BY ID
app.get('/students/:id', async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [req.params.id]);
    res.json(rows[0] || {});
});

// POST
app.post('/students', async (req, res) => {
    const { name, email, course } = req.body;
    const sql = "INSERT INTO students (name, email, course) VALUES (?, ?, ?)";
    const [result] = await pool.query(sql, [name, email, course]);
    res.json({ id: result.insertId, name, email, course });
});

// PUT
app.put('/students/:id', async (req, res) => {
    const { name, email, course } = req.body;
    const sql = "UPDATE students SET name=?, email=?, course=? WHERE id=?";
    await pool.query(sql, [name, email, course, req.params.id]);
    res.json({ message: "Atualizado com sucesso" });
});

// DELETE
app.delete('/students/:id', async (req, res) => {
    await pool.query("DELETE FROM students WHERE id=?", [req.params.id]);
    res.json({ message: "Deletado com sucesso" });
});

app.listen(process.env.PORT, () => {
    console.log("API rodando na porta " + process.env.PORT);
});
