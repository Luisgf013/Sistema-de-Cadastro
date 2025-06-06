const express = require('express');
const router = express.Router();
const db = require('./database');

router.get('/pessoas', (req, res) => {
  db.all('SELECT * FROM pessoas', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/pessoas/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM pessoas WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Pessoa não encontrada.' });
    res.json(row);
  });
});

router.post('/pessoas', (req, res) => {
  const { nome, email, cargo, endereco } = req.body;
  if (!nome || !email || !email.includes('@')) return res.status(400).json({ error: 'Nome e email válidos são obrigatórios.' });

  db.run('INSERT INTO pessoas (nome, email, cargo, endereco) VALUES (?, ?, ?, ?)', [nome, email, cargo, endereco], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nome, email, cargo, endereco });
  });
});

router.put('/pessoas/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, cargo, endereco } = req.body;
  if (!nome || !email || !email.includes('@')) return res.status(400).json({ error: 'Nome e email válidos são obrigatórios.' });

  db.run('UPDATE pessoas SET nome = ?, email = ?, cargo = ?, endereco = ? WHERE id = ?', [nome, email, cargo, endereco, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

router.delete('/pessoas/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM pessoas WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
