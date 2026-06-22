import fs from 'fs';
import path from 'path';

async function run() {
  const jsonPath = path.resolve('node_modules/indian-colleges/colleges.json');
  const colleges = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  // Let's sample 50 random entries
  const sampled = [];
  for (let i = 0; i < 50; i++) {
    const idx = Math.floor(Math.random() * colleges.length);
    sampled.push(colleges[idx]);
  }
  
  console.log(JSON.stringify(sampled, null, 2));
}

run().catch(console.error);
