import { erstelleWiese, paletteFuer } from './wiese.js';

// ---------- Tageszeit ----------

const PHASEN = [
  { name: 'Morgen', symbol: '🌅', stunde: 7.5 },
  { name: 'Mittag', symbol: '☀️', stunde: 13 },
  { name: 'Abend', symbol: '🌇', stunde: 19.3 },
  { name: 'Nacht', symbol: '🌙', stunde: 23.5 },
];

function phaseZu(stunde) {
  if (stunde >= 5 && stunde < 10) return PHASEN[0];
  if (stunde >= 10 && stunde < 17) return PHASEN[1];
  if (stunde >= 17 && stunde < 21) return PHASEN[2];
  return PHASEN[3];
}

const echteStunde = () => {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
};

// Testmodus: null = echte Uhrzeit, sonst Index in PHASEN. Per Taste Z, Klick oder ?zeit=nacht
const startParameter = new URLSearchParams(location.search).get('zeit');
let testPhase = PHASEN.findIndex(p => p.name.toLowerCase() === startParameter?.toLowerCase());
if (testPhase < 0) testPhase = null;

const zielStunde = () => (testPhase === null ? echteStunde() : PHASEN[testPhase].stunde);
let angezeigteStunde = zielStunde();
let uebergang = null; // { von, strecke, start }

function testPhaseWechseln() {
  testPhase = testPhase === null ? 0 : testPhase + 1 < PHASEN.length ? testPhase + 1 : null;
  // Immer vorwärts durch den Tag laufen, so wie die Zeit auch
  const strecke = (zielStunde() - angezeigteStunde + 24) % 24;
  uebergang = { von: angezeigteStunde, strecke, start: performance.now() };
  tageszeitAnzeigen();
}

function stundeAktualisieren(jetzt) {
  if (!uebergang) return (angezeigteStunde = zielStunde());
  const t = Math.min(1, (jetzt - uebergang.start) / 2000);
  const sanft = t * t * (3 - 2 * t);
  angezeigteStunde = (uebergang.von + uebergang.strecke * sanft) % 24;
  if (t === 1) uebergang = null;
}

const tageszeitKnopf = document.getElementById('tageszeit');
function tageszeitAnzeigen() {
  const phase = testPhase === null ? phaseZu(echteStunde()) : PHASEN[testPhase];
  const uhr = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  tageszeitKnopf.textContent = testPhase === null
    ? `${phase.symbol} ${phase.name} · ${uhr}`
    : `${phase.symbol} ${phase.name} (Test)`;
}
tageszeitKnopf.addEventListener('click', testPhaseWechseln);
tageszeitAnzeigen();
setInterval(tageszeitAnzeigen, 15000);

// ---------- Wiese zeichnen ----------

const wiese = erstelleWiese(document.getElementById('wiese'));
const ruhig = matchMedia('(prefers-reduced-motion: reduce)');
let pausiert = false;
let letzterFrame = 0;
let zeit = 0;
let letzteDunkelheit = -1;

function frame(jetzt) {
  requestAnimationFrame(frame);
  if (pausiert || document.hidden) return;
  // 30 Bilder pro Sekunde reichen für Pixel-Art; bei „weniger Bewegung“ nur jede Sekunde
  const abstand = ruhig.matches ? 1000 : 33;
  if (jetzt - letzterFrame < abstand) return;
  const dt = ruhig.matches ? 0 : Math.min(0.1, (jetzt - letzterFrame) / 1000);
  letzterFrame = jetzt;
  zeit += dt;

  stundeAktualisieren(jetzt);
  wiese.zeichnen(angezeigteStunde, zeit, dt);

  const dunkel = Math.round(paletteFuer(angezeigteStunde).dunkel * 100) / 100;
  if (dunkel !== letzteDunkelheit) {
    document.documentElement.style.setProperty('--dunkel', dunkel);
    letzteDunkelheit = dunkel;
  }
}
requestAnimationFrame(frame);

let groessenTimer;
addEventListener('resize', () => {
  clearTimeout(groessenTimer);
  groessenTimer = setTimeout(() => { wiese.aufbauen(); letzterFrame = 0; }, 100);
});

// ---------- Bestleistungen (lokal gespeichert) ----------

// Gespeichert wird je Spiel ein Objekt { "<stufe>": { wert, text } }; ohne Stufe ist der Schlüssel "".
const speicherSchluessel = kennung => `spielwiese:bestleistung:${kennung}`;

function bestleistungenLesen(kennung) {
  try { return JSON.parse(localStorage.getItem(speicherSchluessel(kennung))) ?? {}; }
  catch { return {}; }
}

function ergebnisMelden(spiel, { wert, text, stufe }) {
  if (typeof wert !== 'number' || !Number.isFinite(wert)) return;
  const name = typeof stufe === 'string' ? stufe.slice(0, 40) : '';
  const alle = bestleistungenLesen(spiel.kennung);
  const bisher = alle[name];
  const kleinerIstBesser = spiel.bestleistung === 'kleiner';
  const besser = !bisher || (kleinerIstBesser ? wert < bisher.wert : wert > bisher.wert);
  if (!besser) return;
  alle[name] = { wert, text: String(text ?? wert).slice(0, 40) };
  try {
    localStorage.setItem(speicherSchluessel(spiel.kennung), JSON.stringify(alle));
  } catch { /* Speicher nicht verfügbar – dann eben ohne Rekord */ }
  schildAktualisieren(spiel);
}

// ---------- Schilder ----------

const schilderListe = document.getElementById('schilder');
const schilder = new Map();

function schildErstellen(spiel) {
  const li = document.createElement('li');
  const knopf = document.createElement('button');
  knopf.type = 'button';
  knopf.className = 'schild';
  knopf.title = spiel.beschreibung;
  knopf.innerHTML = `
    <span class="schild-brett holz">
      <span class="schild-symbol" aria-hidden="true"></span>
      <span class="schild-name"></span>
      <span class="schild-rekord" hidden></span>
    </span>
    <span class="schild-pfosten" aria-hidden="true"></span>`;
  knopf.querySelector('.schild-symbol').textContent = spiel.symbol ?? '🎮';
  knopf.querySelector('.schild-name').textContent = spiel.name;
  knopf.addEventListener('click', () => spielOeffnen(spiel));
  li.append(knopf);
  schilder.set(spiel.kennung, knopf);
  schildAktualisieren(spiel);
  return li;
}

function schildAktualisieren(spiel) {
  const feld = schilder.get(spiel.kennung)?.querySelector('.schild-rekord');
  if (!feld) return;
  const eintraege = Object.entries(bestleistungenLesen(spiel.kennung));
  feld.hidden = eintraege.length === 0;
  feld.replaceChildren(...eintraege.map(([stufe, { text }]) => {
    const zeile = document.createElement('span');
    zeile.textContent = stufe ? `🏆 ${stufe}: ${text}` : `🏆 ${text}`;
    return zeile;
  }));
}

function hinweisSchild(symbol, name, text) {
  const li = document.createElement('li');
  li.innerHTML = `
    <div class="schild schild-leer">
      <span class="schild-brett holz">
        <span class="schild-symbol" aria-hidden="true"></span>
        <span class="schild-name"></span>
        <span class="schild-beschreibung"></span>
      </span>
      <span class="schild-pfosten" aria-hidden="true"></span>
    </div>`;
  li.querySelector('.schild-symbol').textContent = symbol;
  li.querySelector('.schild-name').textContent = name;
  li.querySelector('.schild-beschreibung').textContent = text;
  return li;
}

async function spieleLaden() {
  try {
    const antwort = await fetch('spiele/liste.json', { cache: 'no-store' });
    if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
    const spiele = await antwort.json();
    schilderListe.replaceChildren(...(spiele.length
      ? spiele.map(schildErstellen)
      : [hinweisSchild('🌱', 'Noch leer', 'Hier wurde noch kein Spiel gepflanzt.')]));
  } catch (fehler) {
    console.error('Spieleliste konnte nicht geladen werden', fehler);
    schilderListe.replaceChildren(hinweisSchild('🪵', 'Hoppla', 'Die Spieleliste konnte nicht geladen werden.'));
  }
}
spieleLaden();

// ---------- Spiel öffnen und schließen ----------

const buehne = document.getElementById('spielbuehne');
const rahmen = document.getElementById('spielrahmen');
const spielTitel = document.getElementById('spieltitel');
let offenesSpiel = null;

function spielOeffnen(spiel) {
  offenesSpiel = spiel;
  spielTitel.textContent = `${spiel.symbol ?? '🎮'} ${spiel.name}`;
  rahmen.title = spiel.name;
  rahmen.src = `spiele/${encodeURIComponent(spiel.kennung)}/index.html`;
  buehne.hidden = false;
  pausiert = true;
}

function spielSchliessen() {
  if (!offenesSpiel) return;
  const kennung = offenesSpiel.kennung;
  offenesSpiel = null;
  rahmen.src = 'about:blank';
  buehne.hidden = true;
  pausiert = false;
  letzterFrame = 0;
  schilder.get(kennung)?.focus();
}

rahmen.addEventListener('load', () => {
  if (!offenesSpiel) return;
  rahmen.focus();
  // Esc und F11 sollen auch funktionieren, während das Spiel den Fokus hat
  try { rahmen.contentWindow.addEventListener('keydown', tastenGlobal); } catch { /* anderer Ursprung */ }
});

document.getElementById('zurueck').addEventListener('click', spielSchliessen);

addEventListener('message', ereignis => {
  if (!offenesSpiel || ereignis.source !== rahmen.contentWindow) return;
  const daten = ereignis.data;
  if (daten?.typ === 'spielwiese:ergebnis') ergebnisMelden(offenesSpiel, daten);
});

// ---------- Tastatur ----------

async function vollbildUmschalten() {
  const fenster = window.__TAURI__?.window?.getCurrentWindow();
  if (fenster) {
    await fenster.setFullscreen(!(await fenster.isFullscreen()));
  } else if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen?.();
  }
}

function tastenGlobal(e) {
  if (e.key === 'F11') {
    e.preventDefault();
    vollbildUmschalten();
  } else if (e.key === 'Escape' && offenesSpiel) {
    e.preventDefault();
    spielSchliessen();
  }
}
addEventListener('keydown', tastenGlobal);

addEventListener('keydown', e => {
  if (offenesSpiel || e.ctrlKey || e.altKey || e.metaKey) return;
  if (e.key === 'z' || e.key === 'Z') testPhaseWechseln();
});
