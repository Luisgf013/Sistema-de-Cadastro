const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const routes = require('./routes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../frontend')));
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
