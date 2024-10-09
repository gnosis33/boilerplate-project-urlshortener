const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

