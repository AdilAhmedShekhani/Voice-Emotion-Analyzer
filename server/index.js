// 1️⃣ Required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// 2️⃣ App banayein
const app = express();

// 3️⃣ Middleware
app.use(cors());               // Allow frontend to access backend
app.use(bodyParser.json());    // Allow JSON input

// 4️⃣ Simple emotion detection
function detectEmotion(text) {
  text = text.toLowerCase();
  if (text.includes('happy') || text.includes('great')) return 'Happy';
  if (text.includes('sad') || text.includes('upset')) return 'Sad';
  if (text.includes('angry') || text.includes('mad')) return 'Angry';
  return 'Neutral';
}

// 5️⃣ API route
app.post('/analyze', (req, res) => {
  const { text } = req.body;
  const emotion = detectEmotion(text);
  res.json({ emotion });  // response bhejta hai
});

// 6️⃣ Server listen karega
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
