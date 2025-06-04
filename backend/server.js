import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Servir o frontend
app.use(express.static(path.join(__dirname, 'public')));

// Banco de dados
let db;
const initDb = async () => {
  db = await open({ filename: './clientes.db', driver: sqlite3.Database });
  const schema = await fs.readFile('./schema.sql', 'utf8');
  await db.exec(schema);
};

// Rotas API
app.get('/clientes', async (req, res) => {
  const clientes = await db.all('SELECT * FROM clientes');
  res.json(clientes);
});

app.post('/clientes', async (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
  }
  await db.run('INSERT INTO clientes (nome, email) VALUES (?, ?)', [nome, email]);
  res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso' });
});

// Inicialização
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
