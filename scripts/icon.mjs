// Zeichnet das App-Icon als 32×32-Pixel-Art und speichert es 32-fach vergrößert (1024×1024) als PNG.
// Danach: npx tauri icon src-tauri/icons/quelle.png
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const N = 32, FAKTOR = 32;
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), 255];
const LEER = [0, 0, 0, 0];
const F = {
  rand: hex('#1b3014'),
  himmel: ['#4a98ea', '#6cb2f0', '#8ccaf5', '#b4e0f8'].map(hex),
  sonne: hex('#ffe680'), sonneKern: hex('#fff8d0'),
  hugel: hex('#74ae90'),
  gras: hex('#5aae3a'), grasHell: hex('#8dd452'), grasDunkel: hex('#3c8a2a'),
  stiel: hex('#2e7d32'),
  bluete: hex('#ff6fa8'), blueteHell: hex('#ffa6cc'), blueteDunkel: hex('#c8417e'), mitte: hex('#ffd23f'), mitteDunkel: hex('#e0a020'),
};

const bild = Array.from({ length: N }, () => Array(N).fill(LEER));
const setze = (x, y, farbe) => { if (x >= 0 && y >= 0 && x < N && y < N) bild[y][x] = farbe; };
const kreis = (cx, cy, r, farbe) => {
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r) setze(x, y, farbe);
  }
};

// Abgerundete Kachel: innen ja/nein
const ECKE = 4;
function innen(x, y) {
  const dx = Math.max(ECKE - x - 0.5, x + 0.5 - (N - ECKE), 0);
  const dy = Math.max(ECKE - y - 0.5, y + 0.5 - (N - ECKE), 0);
  return dx * dx + dy * dy <= ECKE * ECKE;
}

// Himmel, Hügel, Boden
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  if (y < 20) setze(x, y, F.himmel[Math.min(3, Math.floor(y / 5))]);
  if (y >= 16 + Math.round(1.6 * Math.sin(x * 0.35 + 1)) && y < 21) setze(x, y, F.hugel);
  if (y >= 21) setze(x, y, y < 25 ? F.gras : F.grasDunkel);
}
kreis(25, 7, 3.6, F.sonne);
kreis(25, 7, 2.2, F.sonneKern);
// Grasbüschel an der Kante
for (let x = 1; x < N; x += 3) { setze(x, 20, F.grasHell); setze(x + 1, 19, F.grasHell); }
for (let x = 2; x < N; x += 5) { setze(x, 24, F.grasHell); setze(x + 2, 27, F.grasHell); }

// Blume: Stiel, Blätter, Blüte
for (let y = 14; y < 29; y++) setze(15, y, F.stiel), setze(16, y, F.stiel);
for (const [x, y] of [[13, 22], [14, 22], [12, 21], [17, 19], [18, 19], [19, 18]]) setze(x, y, F.stiel);
for (const [dx, dy] of [[0, -3.2], [3.2, 0], [0, 3.2], [-3.2, 0]]) kreis(16 + dx, 11 + dy, 2.9, F.bluete);
for (const [dx, dy] of [[-0.8, -4], [2.4, -1.2]]) kreis(16 + dx, 11 + dy, 1.1, F.blueteHell);
kreis(16, 11, 2.3, F.mitteDunkel);
kreis(15.6, 10.6, 1.6, F.mitte);
// Kontur um die Blüte
const bluetenteil = f => f === F.bluete || f === F.blueteHell || f === F.mitte || f === F.mitteDunkel;
const kontur = [];
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  if (bild[y][x] !== F.bluete) continue;
  if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !bluetenteil(bild[y + dy]?.[x + dx]))) kontur.push([x, y]);
}
for (const [x, y] of kontur) setze(x, y, F.blueteDunkel);

// Ecken ausschneiden und dunklen Rand ziehen
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  if (!innen(x, y)) { bild[y][x] = LEER; continue; }
  const randpixel = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !innen(x + dx, y + dy));
  if (randpixel) bild[y][x] = F.rand;
}

// PNG schreiben (RGBA, ohne Filter)
const crcTabelle = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = puffer => {
  let c = 0xffffffff;
  for (const b of puffer) c = crcTabelle[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const block = (typ, daten) => {
  const laenge = Buffer.alloc(4); laenge.writeUInt32BE(daten.length);
  const inhalt = Buffer.concat([Buffer.from(typ, 'ascii'), daten]);
  const pruef = Buffer.alloc(4); pruef.writeUInt32BE(crc32(inhalt));
  return Buffer.concat([laenge, inhalt, pruef]);
};

const groesse = N * FAKTOR;
const roh = Buffer.alloc(groesse * (groesse * 4 + 1));
for (let y = 0; y < groesse; y++) {
  const zeile = y * (groesse * 4 + 1);
  for (let x = 0; x < groesse; x++) {
    const farbe = bild[Math.floor(y / FAKTOR)][Math.floor(x / FAKTOR)];
    roh.set(farbe, zeile + 1 + x * 4);
  }
}
const kopf = Buffer.alloc(13);
kopf.writeUInt32BE(groesse, 0); kopf.writeUInt32BE(groesse, 4);
kopf[8] = 8; kopf[9] = 6;
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  block('IHDR', kopf), block('IDAT', deflateSync(roh)), block('IEND', Buffer.alloc(0)),
]);
const ziel = join(dirname(fileURLToPath(import.meta.url)), '..', 'src-tauri', 'icons', 'quelle.png');
writeFileSync(ziel, png);
console.log(`Icon gespeichert: ${ziel}`);
