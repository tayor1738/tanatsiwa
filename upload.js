const fs = require('fs');
const cheerio = require('cheerio');
const algoliasearch = require('algoliasearch');

// Initialize Algolia with YOUR keys
const client = algoliasearch('GDBZS21HXP', '3bce0bec1fdc0aecbf4eebcd68fa3588');
const index = client.initIndex('website_search');

// List your HTML files
const htmlFiles = ['about.html', 'contact.html', 'cv.html', 'home.html'];
const records = [];

htmlFiles.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);
  
  records.push({
    objectID: file.replace('.html', ''), // e.g. "about"
    title: $('title').text(),
    content: $('body').text()
      .replace(/\s+/g, ' ')  // Collapse whitespace
      .trim()
      .substring(0, 5000),   // Limit to 5000 chars
    url: file
  });
});

// Upload to Algolia
index.saveObjects(records)
  .then(() => console.log('✅ Success! Data uploaded to Algolia.'))
  .catch(err => console.error('❌ Error:', err));