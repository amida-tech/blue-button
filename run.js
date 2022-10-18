const fs = require('fs');
const path = require('path');
const bb = require('./');

const file = path.join('test/fixtures/parser-ccda/CCD_SocialHistory_PQ_value.xml');
const xml = fs.readFileSync(file, {encoding: 'utf-8'});
const result = bb.parse(xml);

console.log(JSON.stringify(result, null, 2));
