# Namen für Launcher und Spiele

Stand: 2026-10-26

## Launcher

| Feld | Wert |
|---|---|
| Anzeigename | **Spielwiese** |
| Repo-Slug | `spielwiese` → `github.com/drogimon/spielwiese` |
| Tauri-App-Kennung (`identifier`) | `io.github.drogimon.spielwiese` |

- Gewählt vom Nutzer in der Hauptsitzung („Der Name soll auch im Stil wieder zu finden sein“).
- GitHub-Benutzer `drogimon`, vom Nutzer am 2026-10-26 bestätigt.
- Kennung nur in Kleinbuchstaben, ohne Bindestrich oder Umlaut, damit sie unter Windows/NSIS und im Updater problemlos ist.

### Kollisionsprüfung „Spielwiese“ (2026-10-26)

- **Marken:** Die Websuche zeigt keine eingetragene Marke „Spielwiese“ für Software/Spiele (Klassen 9, 28, 41). Nicht geprüft wurde direkt im DPMAregister bzw. in EUIPO eSearch. Das Wort ist ein gängiger deutscher Begriff und damit beschreibend, eine Abmahnung ist unwahrscheinlich.
- **App-Stores:** Es gibt keine App mit genau diesem Namen. Ähnlich sind „Spielwerk – Create Mini Games“ (iOS) und „Die Wiese lebt“ (Kinder-App). Keine der beiden ist ein Launcher, eine Verwechslung ist gering.
- **GitHub:** Es gibt viele Repos namens `spielwiese`, alle sind private Test- oder Übungsrepos (meist unter 5 Sterne). Das ist kein Konflikt, weil der Slug pro Account eindeutig ist. `drogimon/spielwiese` ist frei.
- **Bewertung:** unbedenklich.

## Spiel 1: Many Mines (bisher „Minesweeper“)

- **Name:** **Many Mines**. Vom Nutzer gewählt, ein Wortspiel auf einen Songtitel im Stil von „Straße von Hormus“ (vermutlich *Many Men* von 50 Cent).
- Kennung im Launcher: `many-mines` (`src/spiele/many-mines/`)

### Kollisionsprüfung „Many Mines“ (2026-10-26)

- **Marken/Steam/App-Stores:** In der Websuche gibt es kein Spiel und keine Marke mit diesem Namen. Treffer kommen nur für generische Casino-„Mines“-Spiele (z. B. Spribe „Mines“), die einen anderen Namen haben. Nicht direkt geprüft wurden DPMAregister, EUIPO und USPTO.
- **GitHub:** Es gibt kein Repo mit diesem Namen. Nahe dran ist `yurichen17/Too-Many-Mines` (0 Sterne, ohne Beschreibung). Sonst taucht die Phrase nur in Beschreibungen wie „how many mines are nearby“ auf.
- **Bewertung:** unbedenklich.

### Nötige Änderungen am Spiel (macht die Hauptsitzung)

**Name und Texte**
1. `<title>Minesweeper</title>` (Zeile 6) wird zu `Many Mines`.
2. `<h1>Minesweeper</h1>` (Zeile 125) wird zu `Many Mines`.
3. Verlusttext (Zeile 334): „Klick auf den Smiley für ein neues Spiel.“ an das neue Neustart-Symbol anpassen (siehe 4).

**Trade Dress von Windows-Minesweeper entfernen**
4. **Smiley-Knopf** `#face` mit 🙂 😮 😵 😎 (Zeilen 145, 220, 333, 353, 383, 386): Das Gesicht als Neustart-Knopf ist das Erkennungszeichen des Microsoft-Originals. **Entscheidung des Nutzers:** Es wird durch ein Neustart-Symbol ersetzt, einen Pfeil, der fast einen Kreis bildet (↻). Am besten als eigenes Inline-SVG, damit es überall gleich aussieht. Das Symbol bleibt immer gleich, die wechselnden Gesichtsausdrücke entfallen. Den `title` „Neues Spiel (F2)“ behalten. Der Verlusttext aus Punkt 3 wird z. B. zu „Klick auf ↻ für ein neues Spiel.“
5. **Zahlenfarben** `.n1`–`.n8` (Zeilen 94–95): Blau, Grün, Rot, Dunkelblau, Dunkelrot, Türkis, Schwarz und Grau sind 1:1 die klassische Windows-Palette. **Entscheidung des Nutzers:** Die Farbfamilien und ihre Reihenfolge bleiben (1 bläulich, 2 grünlich, 3 rötlich …), aber jeder Ton wird anders abgestimmt, passend zur Wiesen-Palette. Diese Zuordnung nutzen fast alle Klone (z. B. GNOME Mines), deshalb ist sie unkritisch. Die exakten Microsoft-Hexwerte sollen nicht stehen bleiben.
6. **Zähler im LED-Stil** (Zeilen 64–68, rote Ziffern mit Leuchten, monospace, `000`): Sie ahmen die rote 7-Segment-Anzeige des Originals nach. Den Stil ändern, z. B. in normale Schrift ohne rotes Glühen oder Ziffern in Wiesenfarben.

**Optional (Spielmechanik, frei verwendbar, aber eigener machbar)**
7. Schwierigkeitsstufen „Anfänger 9×9 / Fortgeschritten 16×16 / Experte 30×16“ mit 10, 40 und 99 Minen sind die Microsoft-Werte. Zahlen sind nicht geschützt und dürfen bleiben. Eigene Stufennamen würden aber helfen, z. B. passend zum Namen.
8. Emoji 💣 🚩 💥 ❌ ❓ sind Systemschrift und keine Original-Grafiken, also erlaubt. Für einen einheitlichen Wiesen-Look später eigene Symbole verwenden.
9. Fragezeichen-Markierung, Mittelklick zum Aufdecken, F2 für ein neues Spiel: Das ist Spielmechanik und darf bleiben.

**Schon eigenständig**
- Dunkles Blau-Lila-Farbschema mit Verlaufs-Hintergrund, abgerundete Zellen ohne den grauen 3D-Rahmen des Originals
- Keine Original-Grafiken und keine Sounds
- Deutsche, selbst geschriebene Texte, eigene Hilfezeile, Touch-Bedienung durch langes Drücken

## Prüfliste für künftige Spiele

Vor der Veröffentlichung pro Spiel durchgehen und das Ergebnis hier als eigenen Abschnitt eintragen.

**1. Name**
- [ ] Der Name enthält nicht den Originalnamen oder ein typisches Namensteil (z. B. „-tris“, „Flappy“, „Pac“, „Sweeper“).
- [ ] Kollisionen sind geprüft:
  - Websuche „<Name>“ game / app / trademark
  - App Store, Google Play, Steam, itch.io
  - GitHub-Suche
  - bei Zweifel DPMAregister, EUIPO eSearch und USPTO in den Klassen 9, 28 und 41
- [ ] Wortspiele auf Titel sind okay. Einen echten Film- oder Spieletitel 1:1 nicht übernehmen, weil es in Deutschland Titelschutz gibt.
- [ ] Auf Wunsch zur Namensfamilie passend: Wortspiel auf Song, Film oder Ereignis („Many Mines“) und/oder Bezug zur Wiese.

**2. Look**
- [ ] Keine Original-Grafiken, Sprites, Figuren, Logos oder Schriften
- [ ] Kein Farbschema des Originals, besonders keine typischen Farben für Spielsteine oder Zahlen
- [ ] Keine markanten UI-Elemente des Originals, etwa der Smiley-Knopf oder das LED-Display
- [ ] Eigener Stil der Spielwiese

**3. Ton**
- [ ] Keine Original-Sounds oder -Melodien, auch nicht nachgespielt (z. B. das Tetris-Thema „Korobeiniki“ in der Original-Arrangement-Version)

**4. Texte**
- [ ] Titel, Überschrift, Hilfe-, Sieg- und Verlusttexte nennen den Originalnamen nicht.
- [ ] Optional ein Hinweis in der README wie „inspiriert von …“. Das Original darf dort sachlich genannt werden, aber nicht als Name des Spiels.

**5. Festhalten**
- [ ] Liste „muss geändert werden / ist schon anders“ wie oben bei Many Mines

**Besondere Vorsicht bei geplanten Spielen**
- **Snake:** Risiko gering, das Prinzip ist uralt und der Name generisch. Trotzdem einen eigenen Namen wählen und nicht den Nokia-Look (grüner Pixel-LCD) kopieren.
- **Flappy-Bird-artig:** „Flappy Bird“ ist eine Marke. Kein „Flappy“ im Namen, keine Vogelfigur im Stil des Originals und keine grünen Röhren, denn die stammen aus Nintendos Mario. Hindernisse und Figur passend zur Wiese gestalten, z. B. eine Hummel zwischen Grashalmen.
- **Tetris-artig:** am heikelsten. Im US-Fall *Tetris Holding v. Xio* (2012) wurde ein Klon wegen seines Looks verurteilt.
  - Nicht das 10×20-Feld nehmen
  - Nicht die sieben Standardfarben der Steine
  - Keine Steine mit dem typischen Aussehen
  - Kein Namensteil „-tris“
  - Nicht die Melodie „Korobeiniki“
  - Besser abweichende Feldgröße, eigene Steinformen oder -optik und ein eigenes Thema

## Verworfene Namen

| Name | Grund |
|---|---|
| Straße von Hormus | Bezieht sich auf einen aktuellen, realen Konflikt und kann in einem öffentlichen Repo politisch wirken. Das Prinzip „Wortspiel auf ein Ereignis“ ist trotzdem in die Namensfamilie eingeflossen. |
| Minenwiese, Pusteblume, Wiesenroulette, Tretminchen | Richtung „verspielt/Wiese“, nicht gewählt |
| Fehltritt, Blindgänger, Feldversuch, Barfußpfad, Sonntagsspaziergang | Richtung „schwarzer Humor ohne Bezug“, nicht gewählt. Der Nutzer wollte Wortspiele auf Titel oder Ereignisse. |
| Glasbrücke, Der Boden ist Lava, Rotes Kabel, Meins! Meins!, Nur der Demütige, Ich bin raus | nur Popkultur-Anspielungen, keine Titel-Wortspiele |
| 99 Minen, Stayin' Alive, Tiptoe Through the Tulips, Und täglich grüßt das Murmeltier u. a. | echte oder fast echte Titel statt Wortspiele (Titelschutz), nicht gewählt |
| Straße von Humus, Kraterloo, Sweet Field o' Mine, Major Boom, Ziemlich beste Minen, Der Schuh des Minitu u. a. | Wortspiele aus der letzten Runde, Many Mines wurde bevorzugt. Gut als Reserve für künftige Spiele. |
| Minecraft-Abwandlungen („Minenkraft“), Fallout, Keep Talking and Nobody Explodes | Marken, zu nah am Original |
