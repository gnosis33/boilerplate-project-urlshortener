const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// In-memory storage for URL mapping
let urls = {};
let urlId = 1;

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// POST request to shorten the URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const parsedUrl = urlParser.parse(originalUrl);
  
  // Verify the URL by checking its hostname
  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }
    
    // Store the URL and assign an ID
    urls[urlId] = originalUrl;
    
    res.json({
      original_url: originalUrl,
      short_url: urlId
    });
    
    urlId++; // Increment ID for the next URL
  });
});

// Redirect to original URL when accessing short URL
app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  const originalUrl = urls[id];
  
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
