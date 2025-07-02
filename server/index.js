// server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/analyze', (req, res) => {
  const { text } = req.body;
  // For now, return dummy emotion
  res.json({ emotion: 'neutral' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
