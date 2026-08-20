const fs = require('fs');
const c = fs.readFileSync('src/pages/Home/Home.jsx', 'utf8');
const needle = 'className="contact-section"';
const i = c.indexOf(needle);
if (i === -1) { console.log('NOT FOUND'); process.exit(0); }
const e = c.indexOf('</section>', i) + 10;
console.log(`INDEX=${i} END=${e}`);
console.log(c.slice(i - 300, e + 300));