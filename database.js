const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cadastro.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pessoas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    cargo TEXT,
    endereco TEXT
  )`);
});

module.exports = db;
