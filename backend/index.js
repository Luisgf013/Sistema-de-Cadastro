const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Banco de Dados
const db = new sqlite3.Database('banco.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT
  )`);
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para cadastro
app.post('/cadastro', (req, res) => {
  const { nome, email, telefone } = req.body;
  db.run(`INSERT INTO usuarios (nome, email, telefone) VALUES (?, ?, ?)`,
    [nome, email, telefone],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar no banco de dados');
      } else {
        res.send('Cadastro realizado com sucesso!');
      }
    });
});

// Opcional: rota para ver usuários cadastrados
app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', (err, rows) => {
    if (err) {
      res.status(500).send('Erro ao buscar usuários');
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
