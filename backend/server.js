const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = 'backend/banco.db';

// Cria o banco de dados e a tabela caso ainda não existam
if (!fs.existsSync(DB_FILE)) {
  const db = new sqlite3.Database(DB_FILE);
  const schema = fs.readFileSync('backend/schema.sql', 'utf-8');
  db.exec(schema);
  db.close();
}

const db = new sqlite3.Database(DB_FILE);

// Rota para obter todos os clientes
app.get('/clientes', (req, res) => {
  db.all('SELECT * FROM clientes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Rota para criar novo cliente
app.post('/clientes', (req, res) => {
  const { nome, email, telefone } = req.body;
  if (!nome || !email) return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });

  const sql = 'INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)';
  db.run(sql, [nome, email, telefone], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, nome, email, telefone });
  });
});

// Rota para atualizar cliente
app.put('/clientes/:id', (req, res) => {
  const { nome, email, telefone } = req.body;
  const id = req.params.id;
  const sql = 'UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?';
  db.run(sql, [nome, email, telefone, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, nome, email, telefone });
  });
});

// Rota para deletar cliente
app.delete('/clientes/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM clientes WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
