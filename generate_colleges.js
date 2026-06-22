import fs from 'fs';
import path from 'path';

function cleanName(name) {
  if (!name) return '';
  // Remove (Id: ...)
  let clean = name.replace(/\s*\(\s*id\s*:[^)]+\)/gi, '');
  // Remove outer quotes, trailing/leading commas, and whitespace
  clean = clean.replace(/^["'\s,]+|["'\s,]+$/g, '').trim();
  // Remove multiple consecutive spaces
  clean = clean.replace(/\s+/g, ' ');
  return clean;
}

async function run() {
  console.log("Loading existing HM colleges...");
  const { HM_COLLEGES_INDIA: existingHMColleges } = await import('./src/data/hmColleges.js');
  console.log(`Loaded ${existingHMColleges.length} existing HM colleges.`);

  console.log("Reading colleges.json...");
  const jsonPath = path.resolve('node_modules/indian-colleges/colleges.json');
  const colleges = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const list = [];
  for (const c of existingHMColleges) {
    list.push(cleanName(c));
  }

  for (const item of colleges) {
    if (item.university) list.push(cleanName(item.university));
    if (item.college) list.push(cleanName(item.college));
  }

  const cleanList = list.filter(name => name.length > 0);
  const uniqueList = Array.from(new Set(cleanList)).sort();

  console.log(`Total colleges and universities: ${uniqueList.length}`);

  const outputPath = path.resolve('src/data/hmColleges.js');
  fs.writeFileSync(outputPath, `export const HM_COLLEGES_INDIA = ${JSON.stringify(uniqueList, null, 2)};\n`);
  console.log(`Successfully generated ${outputPath} with ${uniqueList.length} entries!`);
}

run().catch(console.error);
