const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from /public
app.use('/public', express.static(`${process.cwd()}/public`));

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
