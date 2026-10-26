// Tageszeit nach der Systemuhr – Grundlage für die Wiese in Phase 2
function tageszeit(stunde) {
  if (stunde >= 5 && stunde < 10) return 'Morgen';
  if (stunde >= 10 && stunde < 17) return 'Mittag';
  if (stunde >= 17 && stunde < 21) return 'Abend';
  return 'Nacht';
}

document.getElementById('tageszeit').textContent =
  `Tageszeit: ${tageszeit(new Date().getHours())}`;
