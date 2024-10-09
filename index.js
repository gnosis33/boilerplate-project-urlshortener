require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();
const urlParser = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // To handle form submissions

// Store URLs in-memory
let urls = {};
let urlId = 1;

// Serve static files
app.use('/public', express.static(`${process.cwd()}/public`));

// Serve index.html on root
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// POST API: Handle URL Shortening
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url.trim();
  
  // Basic URL validation using regex
  const urlRegex = /^(https?:\/\/)(www\.)?[\w-]+(\.[\w-]+)+[/#?]?.*$/;
  
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Extract hostname and check if it exists using dns.lookup
  const hostname = urlParser.parse(originalUrl).hostname;
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Store URL and respond with the shortened version
    const shortUrlId = urlId++;
    urls[shortUrlId] = originalUrl;
    res.json({
      original_url: originalUrl,
      short_url: shortUrlId
    });
  });
});

// GET API: Redirect to the original URL using short_url
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrlId = req.params.short_url;

  if (urls[shortUrlId]) {
    return res.redirect(urls[shortUrlId]);
  } else {
    return res.json({ error: 'No short URL found for the given input' });
  }
});

// Test API Endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Listen on the specified port
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
