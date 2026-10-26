# Spiele

Jedes Spiel hat einen eigenen Ordner:

```
spiele/<kennung>/
├─ index.html   ← das Spiel, eigenständig lauffähig (auch per Doppelklick im Browser)
└─ spiel.json   ← Angaben für das Schild auf der Wiese
```

Die Liste aller Spiele (`liste.json`) erzeugt `scripts/spiele-liste.mjs` automatisch vor jedem Start und Build.

## spiel.json

```json
{
  "name": "Anzeigename",
  "beschreibung": "Ein Satz zum Spiel (Tooltip auf dem Schild)",
  "symbol": "🌼",
  "bestleistung": "kleiner",
  "reihenfolge": 10
}
```

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `name` | ja | Name auf dem Schild |
| `beschreibung` | ja | Kurzbeschreibung |
| `symbol` | nein | Emoji auf dem Schild (Standard 🎮) |
| `bestleistung` | nein | `"groesser"` (Standard, z. B. Punkte) oder `"kleiner"` (z. B. Zeit) ist besser |
| `reihenfolge` | nein | Position auf der Wiese, kleiner = weiter vorne (Standard 100) |

## Ergebnis an die Wiese melden

Das Spiel schickt nach einer Runde eine Nachricht an den Launcher. Die Wiese vergleicht selbst mit der bisherigen Bestleistung und zeigt sie auf dem Schild:

```js
window.parent.postMessage({ typ: 'spielwiese:ergebnis', wert: 83, text: '1:23' }, '*');
```

- `wert`: Zahl zum Vergleichen
- `text`: so wird es auf dem Schild angezeigt
- `stufe` (optional): Name der Schwierigkeitsstufe. Jede Stufe hat ihre eigene Bestleistung, z. B. `stufe: 'Viele'`.

Außerhalb der Spielwiese (Spiel direkt im Browser geöffnet) passiert dabei einfach nichts.

## Tasten

Esc und F11 gehören der Wiese (zurück zur Wiese, Vollbild). Spiele sollten sie nicht anders belegen.

Ein Spiel kommt erst hierher, wenn sein Originalitäts-Check in `docs/ORIGINALITAET.md` abgehakt ist.
