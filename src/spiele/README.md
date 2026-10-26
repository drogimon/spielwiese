# Spiele

Jedes Spiel hat einen eigenen Ordner:

```
spiele/<kennung>/
├─ index.html   ← das Spiel, eigenständig lauffähig
└─ spiel.json   ← Angaben für das Schild auf der Wiese
```

`spiel.json` (Format wird in Phase 2 festgelegt):

```json
{
  "name": "Anzeigename",
  "beschreibung": "Ein Satz zum Spiel",
  "icon": "icon.png"
}
```

Ein Spiel kommt erst hierher, wenn sein Originalitäts-Check in `docs/ORIGINALITAET.md` abgehakt ist.
