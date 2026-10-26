# Originalitäts-Check

Spielprinzipien sind frei, Namen, Figuren, Grafiken, Sounds und das typische Aussehen des Originals nicht.
Jedes Spiel wird vor der Aufnahme in die Spielwiese geprüft.

Die vollständige **Prüfliste** und die Kollisionsprüfungen der Namen stehen in [NAMEN.md](NAMEN.md#prüfliste-für-künftige-spiele).

## Many Mines (`src/spiele/many-mines`)

Inspiriert vom klassischen Minensuch-Spielprinzip.

| Prüfpunkt | Ergebnis |
|---|---|
| Eigener Name, Kollision geprüft | ✅ „Many Mines“, unbedenklich (siehe NAMEN.md) |
| Originalname nicht im Spiel | ✅ Titel, Überschrift und Texte geändert |
| Kein Smiley-Neustartknopf | ✅ ersetzt durch festes Neustart-Symbol ↻ (eigenes SVG) |
| Keine Original-Zahlenfarben | ✅ gleiche Farbfamilien, eigene Töne |
| Kein LED-Zähler | ✅ normale Schrift, kein rotes Leuchten, keine führenden Nullen |
| Eigene Stufennamen | ✅ „Ein paar“, „Viele“, „Zu viele“, „Eigene“ (Feldgrößen wie üblich, Zahlen sind nicht geschützt) |
| Keine Original-Grafiken oder -Sounds | ✅ nur System-Emoji, keine Töne |
| Eigener Look | ✅ Blau-Lila-Verlauf, abgerundete Zellen ohne grauen 3D-Rahmen |
