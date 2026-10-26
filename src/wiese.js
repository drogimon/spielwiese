// Pixel-Wiese: zeichnet die Landschaft auf ein kleines Canvas, das ganzzahlig hochskaliert wird.
// Farben und Lebewesen hängen von der Uhrzeit ab (Stunde als Kommazahl 0–24).

// Stützpunkte über den Tag; dazwischen wird linear überblendet
const STUETZPUNKTE = [
  { h: 0, himmelOben: '#0b1030', himmelUnten: '#23305e', hugelFern: '#1b2a4a', hugelNah: '#1d3a34', boden: '#1f3d2a', grasDunkel: '#16301f', grasHell: '#2c5a3c', wolke: '#3a4670', schatten: '#0e1428', dunkel: 0.65, sterne: 1, gluehwuermchen: 1, falter: 0, tau: 0 },
  { h: 5, himmelOben: '#0f1538', himmelUnten: '#2e3a6e', hugelFern: '#1e2c4e', hugelNah: '#1f3c36', boden: '#21402c', grasDunkel: '#183321', grasHell: '#2e5c3e', wolke: '#3e4a74', schatten: '#0e1428', dunkel: 0.6, sterne: 0.9, gluehwuermchen: 0.6, falter: 0, tau: 0.3 },
  { h: 6.2, himmelOben: '#3b4a8c', himmelUnten: '#f2a46b', hugelFern: '#5a5f8a', hugelNah: '#4f7a55', boden: '#4f8a3e', grasDunkel: '#3a6e30', grasHell: '#78b04a', wolke: '#f4c8b0', schatten: '#2a2050', dunkel: 0.25, sterne: 0.2, gluehwuermchen: 0, falter: 0, tau: 1 },
  { h: 8, himmelOben: '#5aa8e6', himmelUnten: '#cdeaf5', hugelFern: '#7fae9c', hugelNah: '#5c9c4a', boden: '#5fae3e', grasDunkel: '#3f8a2e', grasHell: '#8fd05a', wolke: '#ffffff', schatten: '#2a3050', dunkel: 0, sterne: 0, gluehwuermchen: 0, falter: 0.6, tau: 0.8 },
  { h: 10, himmelOben: '#4a98ea', himmelUnten: '#b4e0f8', hugelFern: '#74ae90', hugelNah: '#529c3e', boden: '#5aae3a', grasDunkel: '#3c8a2a', grasHell: '#8dd452', wolke: '#ffffff', schatten: '#2a3050', dunkel: 0, sterne: 0, gluehwuermchen: 0, falter: 1, tau: 0 },
  { h: 17, himmelOben: '#4a90e0', himmelUnten: '#bfe2f0', hugelFern: '#78aa88', hugelNah: '#56983c', boden: '#5eaa3a', grasDunkel: '#3e862a', grasHell: '#92d052', wolke: '#fff6ea', schatten: '#2a3050', dunkel: 0, sterne: 0, gluehwuermchen: 0, falter: 1, tau: 0 },
  { h: 19.3, himmelOben: '#4a3a7a', himmelUnten: '#ff9a5a', hugelFern: '#7a5a7a', hugelNah: '#5a7040', boden: '#6a8a38', grasDunkel: '#4a6a2a', grasHell: '#a8bc50', wolke: '#ffb890', schatten: '#3a2050', dunkel: 0.12, sterne: 0, gluehwuermchen: 0.2, falter: 0.3, tau: 0 },
  { h: 20.6, himmelOben: '#1c1d4a', himmelUnten: '#8a4a6a', hugelFern: '#3a3458', hugelNah: '#2c4a3a', boden: '#2f5a32', grasDunkel: '#22452a', grasHell: '#4a7a40', wolke: '#6a5a80', schatten: '#1a1838', dunkel: 0.45, sterne: 0.6, gluehwuermchen: 0.8, falter: 0, tau: 0 },
  { h: 22, himmelOben: '#0b1030', himmelUnten: '#23305e', hugelFern: '#1b2a4a', hugelNah: '#1d3a34', boden: '#1f3d2a', grasDunkel: '#16301f', grasHell: '#2c5a3c', wolke: '#3a4670', schatten: '#0e1428', dunkel: 0.65, sterne: 1, gluehwuermchen: 1, falter: 0, tau: 0 },
];
STUETZPUNKTE.push({ ...STUETZPUNKTE[0], h: 24 });

const BLUMENFARBEN = ['#ffffff', '#ffd23f', '#ff6fa8', '#b388ff', '#ff8a3d', '#7fd6ff'];
const FALTERFARBEN = ['#ffd23f', '#ff8ac0', '#ffffff', '#9ad0ff'];

// Reproduzierbarer Zufall, damit die Wiese bei jedem Start gleich aussieht
function zufall(saat) {
  return () => {
    saat |= 0; saat = (saat + 0x6d2b79f5) | 0;
    let t = Math.imul(saat ^ (saat >>> 15), 1 | saat);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hexZuRgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const rgb = ([r, g, b]) => `rgb(${r | 0},${g | 0},${b | 0})`;
const mischen = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

for (const p of STUETZPUNKTE) {
  for (const [k, v] of Object.entries(p)) if (typeof v === 'string') p[k] = hexZuRgb(v);
}

export function paletteFuer(stunde) {
  const h = ((stunde % 24) + 24) % 24;
  let i = 0;
  while (STUETZPUNKTE[i + 1].h <= h) i++;
  const a = STUETZPUNKTE[i], b = STUETZPUNKTE[i + 1];
  const t = (h - a.h) / (b.h - a.h);
  const p = {};
  for (const k of Object.keys(a)) {
    p[k] = Array.isArray(a[k]) ? mischen(a[k], b[k], t) : a[k] + (b[k] - a[k]) * t;
  }
  return p;
}

export function erstelleWiese(canvas) {
  const ctx = canvas.getContext('2d');
  const himmelCanvas = document.createElement('canvas');
  const himmelCtx = himmelCanvas.getContext('2d');
  let B = 0, H = 0, horizont = 0, bodenY = 0;
  let hugelFern = [], hugelNah = [], halme = [], blumen = [], sterne = [], wolken = [], falter = [], gluehwuermchen = [];
  let himmelSchluessel = '';

  function aufbauen() {
    const massstab = Math.max(2, Math.floor(innerHeight / 190));
    B = Math.ceil(innerWidth / massstab);
    H = Math.ceil(innerHeight / massstab);
    canvas.width = himmelCanvas.width = B;
    canvas.height = himmelCanvas.height = H;
    canvas.style.width = `${B * massstab}px`;
    canvas.style.height = `${H * massstab}px`;
    horizont = Math.round(H * 0.5);
    bodenY = Math.round(H * 0.58);
    himmelSchluessel = '';

    const r = zufall(42);
    const phasen = Array.from({ length: 4 }, () => r() * 10);
    hugelFern = Array.from({ length: B }, (_, x) =>
      Math.round(horizont - 10 - 7 * Math.sin(x * 0.021 + phasen[0]) - 4 * Math.sin(x * 0.057 + phasen[1])));
    hugelNah = Array.from({ length: B }, (_, x) =>
      Math.round(bodenY - 4 - 5 * Math.sin(x * 0.034 + phasen[2]) - 2 * Math.sin(x * 0.11 + phasen[3])));

    // Grashalme und Blumen; Dichte nach Fläche, damit große Fenster nicht kahl wirken
    const flaeche = B * (H - bodenY);
    halme = Array.from({ length: Math.round(flaeche / 18) }, () => {
      const y = bodenY + 2 + Math.floor(r() * (H - bodenY));
      const tiefe = (y - bodenY) / (H - bodenY);
      return { x: Math.floor(r() * B), y, hoehe: 2 + Math.round(tiefe * 3 + r() * 2), hell: r() < 0.5, tau: r() < 0.15, phase: r() * 6.28 };
    }).sort((a, b) => a.y - b.y);
    blumen = Array.from({ length: Math.round(flaeche / 260) }, () => ({
      x: 2 + Math.floor(r() * (B - 4)),
      y: bodenY + 6 + Math.floor(r() * (H - bodenY - 6)),
      farbe: hexZuRgb(BLUMENFARBEN[Math.floor(r() * BLUMENFARBEN.length)]),
      phase: r() * 6.28,
    })).sort((a, b) => a.y - b.y);

    sterne = Array.from({ length: Math.round(B * horizont / 140) }, () => ({
      x: Math.floor(r() * B), y: Math.floor(r() * (horizont - 12)), gross: r() < 0.08, phase: r() * 6.28, tempo: 0.5 + r() * 2,
    }));
    wolken = Array.from({ length: Math.max(3, Math.round(B / 90)) }, () => wolkeErzeugen(r, Math.floor(r() * B)));
    falter = Array.from({ length: Math.max(3, Math.round(B / 110)) }, () => ({
      x: r() * B, y: bodenY + r() * (H - bodenY) * 0.6, phase: r() * 6.28, tempo: 6 + r() * 6, richtung: r() < 0.5 ? -1 : 1,
      farbe: hexZuRgb(FALTERFARBEN[Math.floor(r() * FALTERFARBEN.length)]),
    }));
    gluehwuermchen = Array.from({ length: Math.max(12, Math.round(B / 18)) }, () => ({
      x: r() * B, y: bodenY - 8 + r() * (H - bodenY), phase: r() * 6.28, tempo: 0.4 + r() * 0.8,
    }));
  }

  function wolkeErzeugen(r, x) {
    const breite = 14 + Math.floor(r() * 18);
    const anzahl = 3 + Math.floor(r() * 3);
    const teile = Array.from({ length: anzahl }, (_, i) => ({
      dx: Math.round((i / (anzahl - 1)) * (breite - 8)), radius: 3 + Math.floor(r() * 4),
    }));
    return { x, y: 6 + Math.floor(r() * (horizont * 0.45)), breite, teile, tempo: 0.6 + r() * 1.2 };
  }

  // Himmel mit Farbstufen und Schachbrett-Dithering an den Übergängen – typischer Pixel-Look
  function himmelZeichnen(p) {
    const schluessel = `${p.himmelOben.map(Math.round)}|${p.himmelUnten.map(Math.round)}`;
    if (schluessel === himmelSchluessel) return;
    himmelSchluessel = schluessel;
    const STUFEN = 7;
    const bild = himmelCtx.createImageData(B, horizont + 20);
    for (let y = 0; y < horizont + 20; y++) {
      const t = Math.min(1, y / horizont) * (STUFEN - 1);
      const unten = Math.floor(t), anteil = t - unten;
      for (let x = 0; x < B; x++) {
        const schwelle = ((x + y) & 1) ? 0.66 : 0.33;
        const stufe = anteil > schwelle ? unten + 1 : unten;
        const farbe = mischen(p.himmelOben, p.himmelUnten, Math.min(1, stufe / (STUFEN - 1)));
        const i = (y * B + x) * 4;
        bild.data[i] = farbe[0]; bild.data[i + 1] = farbe[1]; bild.data[i + 2] = farbe[2]; bild.data[i + 3] = 255;
      }
    }
    himmelCtx.putImageData(bild, 0, 0);
  }

  function scheibe(cx, cy, radius, farbe) {
    ctx.fillStyle = farbe;
    for (let dy = -radius; dy <= radius; dy++) {
      const halb = Math.round(Math.sqrt(radius * radius - dy * dy));
      ctx.fillRect(cx - halb, cy + dy, halb * 2 + 1, 1);
    }
  }

  function gestirne(stunde) {
    const h = ((stunde % 24) + 24) % 24;
    const bahn = (fortschritt, hoch) => ({
      x: Math.round(B * (0.08 + 0.84 * fortschritt)),
      y: Math.round(horizont - Math.sin(fortschritt * Math.PI) * hoch + 4),
    });
    if (h > 5.6 && h < 20.6) {
      const f = (h - 5.6) / 15;
      const { x, y } = bahn(f, horizont * 0.75);
      const tief = 1 - Math.sin(f * Math.PI);
      scheibe(x, y, 9, rgb(mischen([255, 240, 160], [255, 150, 80], tief)));
      scheibe(x, y, 7, rgb(mischen([255, 252, 220], [255, 190, 110], tief)));
    }
    if (h > 19.8 || h < 6.4) {
      const f = ((h - 19.8 + 24) % 24) / 10.6;
      const { x, y } = bahn(f, horizont * 0.7);
      scheibe(x, y, 6, '#e8ecf4');
      ctx.fillStyle = '#c4cad8';
      ctx.fillRect(x - 2, y - 2, 2, 2);
      ctx.fillRect(x + 2, y + 1, 2, 1);
      ctx.fillRect(x - 1, y + 3, 1, 1);
    }
  }

  function wolkenZeichnen(p, dt) {
    const farbe = rgb(p.wolke);
    const unterseite = rgb(mischen(p.wolke, p.himmelOben, 0.25));
    for (const w of wolken) {
      w.x += w.tempo * dt;
      if (w.x > B + 20) w.x = -w.breite - 20;
      const x0 = Math.round(w.x);
      for (const t of w.teile) scheibe(x0 + t.dx + 4, w.y, t.radius, unterseite);
      for (const t of w.teile) scheibe(x0 + t.dx + 4, w.y - 1, t.radius, farbe);
      // flache Unterkante zwischen erstem und letztem Bausch
      const erster = w.teile[0], letzter = w.teile[w.teile.length - 1];
      ctx.fillStyle = unterseite;
      ctx.fillRect(x0 + erster.dx + 4, w.y + 1, letzter.dx - erster.dx + 1, 2);
    }
  }

  function landschaft(p) {
    ctx.fillStyle = rgb(p.hugelFern);
    for (let x = 0; x < B; x++) ctx.fillRect(x, hugelFern[x], 1, bodenY - hugelFern[x] + 2);
    ctx.fillStyle = rgb(p.hugelNah);
    for (let x = 0; x < B; x++) ctx.fillRect(x, hugelNah[x], 1, bodenY - hugelNah[x] + 2);
    // Boden in drei Streifen: hinten heller, vorne satter
    const streifen = [mischen(p.boden, p.hugelNah, 0.35), p.boden, mischen(p.boden, p.grasDunkel, 0.45)];
    const hoehe = (H - bodenY) / 3;
    streifen.forEach((farbe, i) => {
      ctx.fillStyle = rgb(farbe);
      ctx.fillRect(0, Math.round(bodenY + i * hoehe), B, Math.ceil(hoehe) + 1);
    });
  }

  function grasUndBlumen(p, zeit) {
    const hell = rgb(p.grasHell), dunkel = rgb(p.grasDunkel);
    const tauFarbe = `rgba(235,250,255,${p.tau})`;
    let bi = 0;
    for (const g of halme) {
      // Blumen in der richtigen Tiefe zwischen die Halme einsortieren
      while (bi < blumen.length && blumen[bi].y <= g.y) blumeZeichnen(blumen[bi++], p, zeit);
      const wind = Math.round(Math.sin(zeit * 1.6 + g.x * 0.12 + g.phase * 0.2));
      ctx.fillStyle = g.hell ? hell : dunkel;
      ctx.fillRect(g.x, g.y - g.hoehe + 1, 1, g.hoehe - 1);
      ctx.fillRect(g.x + wind, g.y - g.hoehe, 1, 1);
      ctx.fillRect(g.x - 1, g.y - 1, 1, 1);
      ctx.fillRect(g.x + 1, g.y - 2 + (wind > 0 ? 0 : 1), 1, 2);
      if (g.tau && p.tau > 0.05 && Math.sin(zeit * 2 + g.phase) > 0.6) {
        ctx.fillStyle = tauFarbe;
        ctx.fillRect(g.x + wind, g.y - g.hoehe - 1, 1, 1);
      }
    }
    while (bi < blumen.length) blumeZeichnen(blumen[bi++], p, zeit);
  }

  function blumeZeichnen(b, p, zeit) {
    const wind = Math.round(Math.sin(zeit * 1.6 + b.x * 0.12) * 0.6);
    ctx.fillStyle = rgb(p.grasDunkel);
    ctx.fillRect(b.x, b.y - 3, 1, 3);
    const blatt = rgb(mischen(b.farbe, p.schatten, p.dunkel));
    const kopfX = b.x + wind, kopfY = b.y - 5;
    ctx.fillStyle = blatt;
    ctx.fillRect(kopfX - 1, kopfY, 3, 1);
    ctx.fillRect(kopfX, kopfY - 1, 1, 3);
    ctx.fillStyle = rgb(mischen([255, 210, 63], p.schatten, p.dunkel));
    ctx.fillRect(kopfX, kopfY, 1, 1);
  }

  function falterZeichnen(p, zeit, dt) {
    if (p.falter < 0.05) return;
    for (const f of falter) {
      f.x += f.richtung * f.tempo * dt * 0.6;
      if (f.x < -6) f.x = B + 6; else if (f.x > B + 6) f.x = -6;
      const y = Math.round(f.y + Math.sin(zeit * 1.3 + f.phase) * 6 - (1 - p.falter) * 40);
      if (y < bodenY - 30) continue;
      const x = Math.round(f.x);
      const offen = Math.sin(zeit * 14 + f.phase) > 0;
      ctx.globalAlpha = Math.min(1, p.falter * 1.5);
      ctx.fillStyle = rgb(f.farbe);
      if (offen) { ctx.fillRect(x - 2, y - 1, 2, 2); ctx.fillRect(x + 1, y - 1, 2, 2); }
      else { ctx.fillRect(x - 1, y - 2, 1, 2); ctx.fillRect(x + 1, y - 2, 1, 2); }
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(x, y - 1, 1, 2);
      ctx.globalAlpha = 1;
    }
  }

  function sterneZeichnen(p, zeit) {
    if (p.sterne < 0.02) return;
    for (const s of sterne) {
      const funkeln = 0.55 + 0.45 * Math.sin(zeit * s.tempo + s.phase);
      ctx.fillStyle = `rgba(255,250,230,${p.sterne * funkeln})`;
      ctx.fillRect(s.x, s.y, 1, 1);
      if (s.gross) {
        ctx.fillStyle = `rgba(255,250,230,${p.sterne * funkeln * 0.5})`;
        ctx.fillRect(s.x - 1, s.y, 3, 1);
        ctx.fillRect(s.x, s.y - 1, 1, 3);
      }
    }
  }

  function gluehwuermchenZeichnen(p, zeit) {
    if (p.gluehwuermchen < 0.02) return;
    for (const g of gluehwuermchen) {
      const x = Math.round(g.x + Math.sin(zeit * g.tempo + g.phase) * 10);
      const y = Math.round(g.y + Math.cos(zeit * g.tempo * 0.7 + g.phase) * 5);
      const leuchten = Math.max(0, Math.sin(zeit * 1.8 + g.phase * 3)) * p.gluehwuermchen;
      if (leuchten < 0.05) continue;
      ctx.fillStyle = `rgba(220,255,120,${leuchten * 0.18})`;
      ctx.fillRect(x - 2, y - 1, 5, 3);
      ctx.fillRect(x - 1, y - 2, 3, 5);
      ctx.fillStyle = `rgba(230,255,140,${leuchten * 0.5})`;
      ctx.fillRect(x - 1, y, 3, 1);
      ctx.fillRect(x, y - 1, 1, 3);
      ctx.fillStyle = `rgba(250,255,200,${leuchten})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  function zeichnen(stunde, zeit, dt) {
    const p = paletteFuer(stunde);
    himmelZeichnen(p);
    ctx.drawImage(himmelCanvas, 0, 0);
    sterneZeichnen(p, zeit);
    gestirne(stunde);
    wolkenZeichnen(p, dt);
    landschaft(p);
    grasUndBlumen(p, zeit);
    falterZeichnen(p, zeit, dt);
    gluehwuermchenZeichnen(p, zeit);
  }

  aufbauen();
  return { aufbauen, zeichnen };
}
