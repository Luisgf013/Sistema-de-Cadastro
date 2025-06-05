const express = require('express');
const router = express.Router();
const db = require('./database');

router.get('/pessoas', (req, res) => {
  db.all('SELECT * FROM pessoas', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/pessoas', (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) return res.status(400).json({ error: 'Nome e email obrigatórios.' });

  db.run('INSERT INTO pessoas (nome, email) VALUES (?, ?)', [nome, email], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nome, email });
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
