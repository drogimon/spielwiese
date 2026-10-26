// Sammelt alle src/spiele/<kennung>/spiel.json in src/spiele/liste.json.
// Läuft automatisch vor `tauri dev` und `tauri build`.
import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const spieleOrdner = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'spiele');
const PFLICHT = ['name', 'beschreibung'];

const spiele = [];
for (const eintrag of await readdir(spieleOrdner, { withFileTypes: true })) {
  if (!eintrag.isDirectory()) continue;
  const kennung = eintrag.name;
  const ordner = join(spieleOrdner, kennung);

  let daten;
  try {
    daten = JSON.parse(await readFile(join(ordner, 'spiel.json'), 'utf8'));
  } catch (fehler) {
    throw new Error(`spiele/${kennung}/spiel.json fehlt oder ist kein gültiges JSON: ${fehler.message}`);
  }
  for (const feld of PFLICHT) {
    if (!daten[feld]) throw new Error(`spiele/${kennung}/spiel.json: Feld "${feld}" fehlt`);
  }
  await access(join(ordner, 'index.html')).catch(() => {
    throw new Error(`spiele/${kennung}/index.html fehlt`);
  });

  spiele.push({ kennung, reihenfolge: 100, ...daten });
}

spiele.sort((a, b) => a.reihenfolge - b.reihenfolge || a.name.localeCompare(b.name, 'de'));
await writeFile(join(spieleOrdner, 'liste.json'), JSON.stringify(spiele, null, 2) + '\n');
console.log(`Spielwiese: ${spiele.length} Spiel(e) gefunden – ${spiele.map(s => s.name).join(', ') || 'keine'}`);
