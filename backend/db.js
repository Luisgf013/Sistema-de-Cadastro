import sqlite3 from 'sqlite3';
import fs from 'fs';

// Conecta ao banco (cria se não existir)
const db = new sqlite3.Database('./clientes.db');

// Lê e executa o schema para criar as tabelas
const schema = fs.readFileSync('./schema.sql', 'utf8');
db.exec(schema, (err) => {
  if (err) console.error('Erro ao criar tabelas:', err.message);
  else console.log('Tabelas criadas com sucesso.');
});

export default db;
