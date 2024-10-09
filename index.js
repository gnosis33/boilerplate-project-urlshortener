require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

const urls = {}; // to store shortened URLs

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Endpoint to handle POST request for creating a short URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Verify if URL is valid by checking its hostname
  const hostname = new URL(originalUrl).hostname;
  
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }
    const shortUrlId = Object.keys(urls).length + 1;
    urls[shortUrlId] = originalUrl;
    res.json({ original_url: originalUrl, short_url: shortUrlId });
  });
});

// Endpoint to handle redirecting to original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrlId = req.params.shortUrl;
  const originalUrl = urls[shortUrlId];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
