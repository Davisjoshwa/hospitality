import { State, City } from 'country-state-city';
import fs from 'fs';

const indianStates = State.getStatesOfCountry('IN');
const indianCities = City.getCitiesOfCountry('IN');

const locations = new Set();
indianStates.forEach(s => locations.add(s.name));
indianCities.forEach(c => {
  const state = indianStates.find(s => s.isoCode === c.stateCode);
  if (state) {
    locations.add(`${c.name}, ${state.name}`);
  }
});

const sorted = Array.from(locations).sort();
fs.writeFileSync('src/data/locations.js', `export const INDIAN_LOCATIONS = ${JSON.stringify(sorted, null, 2)};\n`);
console.log(`Generated ${sorted.length} locations!`);
