const https = require('https');
const fs = require('fs');
const path = require('path');

const brands = {
  samsung: 'File:Samsung_Logo.svg',
  midea: 'File:Midea_Group_logo.svg', 
  carrier: 'File:Carrier_logo.svg',
  bgh: 'File:Logo_de_BGH.svg',
  daikin: 'File:Daikin_logo.svg',
  lg: 'File:LG_logo_(2015).svg'
};

const dir = 'C:\\Users\\lucag\\Desktop\\CLAUDE\\APPS\\WEBS\\Clima Service Web\\img_optimized\\logos';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const options = {
  headers: {
    'User-Agent': 'ClimaServiceWeb/1.0 (clima@example.com)'
  }
};

function httpsGet(url, customOptions = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { ...options, ...customOptions }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpsGet(res.headers.location, customOptions).then(resolve).catch(reject);
      } else if (res.statusCode >= 400) {
        reject(new Error(`Status ${res.statusCode}`));
      } else {
        resolve(res);
      }
    }).on('error', reject);
  });
}

async function fetchWikiUrl(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=${encodeURIComponent(title)}`;
  const res = await httpsGet(url);
  return new Promise((resolve, reject) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const pages = json.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pages[pageId].imageinfo) {
           resolve(pages[pageId].imageinfo[0].url);
        } else {
           reject(new Error("No imageinfo"));
        }
      } catch(e) { reject(e); }
    });
  });
}

async function download() {
  for (const [name, title] of Object.entries(brands)) {
    try {
      const url = await fetchWikiUrl(title);
      console.log(`${name} -> ${url}`);
      const res = await httpsGet(url);
      await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(dir, `${name}.svg`));
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      });
      console.log(`Downloaded ${name}.svg`);
    } catch (e) {
      console.log(`Failed ${name}: ${e.message}`);
    }
  }
}

download();
