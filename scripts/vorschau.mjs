// Kleiner Vorschau-Server für src/ ohne Browser-Cache – zum Testen von Wiese und Spielen im Browser.
// Aufruf: npm run vorschau  →  http://127.0.0.1:5317/?zeit=nacht
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const port = Number(process.env.PORT ?? 5317);
const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
};

createServer(async (anfrage, antwort) => {
  let pfad = decodeURIComponent(new URL(anfrage.url, 'http://x').pathname);
  if (pfad.endsWith('/')) pfad += 'index.html';
  const datei = normalize(join(wurzel, pfad));
  if (!datei.startsWith(wurzel)) { antwort.writeHead(403).end(); return; }
  try {
    const inhalt = await readFile(datei);
    antwort.writeHead(200, { 'Content-Type': TYPEN[extname(datei)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    antwort.end(inhalt);
  } catch {
    antwort.writeHead(404).end('Nicht gefunden');
  }
}).listen(port, '127.0.0.1', () => console.log(`Vorschau: http://127.0.0.1:${port}/`));
