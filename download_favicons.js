const https = require('https');
const fs = require('fs');
const path = require('path');

const domains = {
  samsung: 'samsung.com',
  midea: 'midea.com',
  carrier: 'carrier.com',
  bgh: 'bgh.com.ar',
  daikin: 'daikin.com',
  lg: 'lg.com'
};

const dir = 'C:\\Users\\lucag\\Desktop\\CLAUDE\\APPS\\WEBS\\Clima Service Web\\img_optimized\\logos';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function downloadFavicon(name, domain) {
  return new Promise((resolve, reject) => {
    const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    https.get(url, res => {
      if (res.statusCode >= 400) {
         reject(new Error("Status " + res.statusCode));
         return;
      }
      const file = fs.createWriteStream(path.join(dir, `${name}.png`));
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function run() {
  for (const [name, domain] of Object.entries(domains)) {
    try {
      await downloadFavicon(name, domain);
      console.log(`Downloaded ${name}.png`);
    } catch (e) {
      console.log(`Failed ${name}: ${e.message}`);
    }
  }
}

run();
