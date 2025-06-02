const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Cria ou abre banco SQLite local
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  } else {
    console.log('Conectado ao banco SQLite.');
  }
});

// Cria tabela clientes se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    cpf TEXT
  )
`);

// Rotas CRUD

// Listar todos os clientes
app.get('/clientes', (req, res) => {
  db.all('SELECT * FROM clientes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Criar cliente
app.post('/clientes', (req, res) => {
  const { nome, email, telefone, cpf } = req.body;
  if (!nome || !email) {
    res.status(400).json({ error: 'Nome e email são obrigatórios' });
    return;
  }
  const sql = 'INSERT INTO clientes (nome, email, telefone, cpf) VALUES (?, ?, ?, ?)';
  const params = [nome, email, telefone || '', cpf || ''];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, nome, email, telefone, cpf });
  });
});

// Atualizar cliente
app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, cpf } = req.body;
  const sql = 'UPDATE clientes SET nome = ?, email = ?, telefone = ?, cpf = ? WHERE id = ?';
  const params = [nome, email, telefone || '', cpf || '', id];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Cliente não encontrado' });
      return;
    }
    res.json({ id, nome, email, telefone, cpf });
  });
});

// Deletar cliente
app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM clientes WHERE id = ?';
  db.run(sql, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Cliente não encontrado' });
      return;
    }
    res.json({ message: 'Cliente deletado com sucesso', id });
  });
});

// Inicia servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

