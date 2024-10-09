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

// Serve static files from the public directory
app.use('/public', express.static(`${process.cwd()}/public`));

// Serve the index.html file on the root route
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your URL shortener logic
app.post('/api/shorturl', (req, res) => {
  let originalUrl;

  try {
    originalUrl = new URL(req.body.url);
  } catch (e) {
    return res.json({ error: 'invalid url' });
  }

  const hostname = originalUrl.hostname;

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrlId = Object.keys(urls).length + 1;
    urls[shortUrlId] = originalUrl.href;
    res.json({ original_url: originalUrl.href, short_url: shortUrlId });
  });
});

// Redirect short URLs
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrlId = req.params.shortUrl;
  const originalUrl = urls[shortUrlId];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// Listen for requests
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
