# Curses · a customized interpreter

A customized Z-machine interpreter for Graham Nelson’s 1993 text adventure *Curses*, playable in the browser, with original room illustrations, an automatic map, generative music, inventory icons, translation help and a smart parser. No game text included – load your own `curses.z5`. Everything in a single HTML file, ready to play.

**Spielen / Play:** [index.html](index.html) (über GitHub Pages: `https://tholeu.github.io/curses-fan-edition/`)

Du brauchst deine eigene Spieldatei `curses.z5`. Sie ist nicht in diesem Repository enthalten; du bekommst sie kostenlos im [IF Archive](https://ifarchive.org/if-archive/games/zcode/curses.z5) (siehe die [README des Autors](https://ifarchive.org/if-archive/games/zcode/curses_rel16.txt)), oder du lässt die Startseite sie direkt von dort laden. / You need your own story file `curses.z5`; it is not part of this repository. Get it free from the [IF Archive](https://ifarchive.org/if-archive/games/zcode/curses.z5) (see the [author's README](https://ifarchive.org/if-archive/games/zcode/curses_rel16.txt)), or let the start page load it from there.

*Curses* © Graham Nelson. The game is free and may be distributed without profit, as its README says; this interpreter is a separate, unofficial player and does not include it.

## Aktuelle Version

26-11-12-1924 – Titelbild zentriert; Hinweise in eckigen Klammern werden nicht vorgelesen

## Ältere Versionen

- [26-11-12-1919](archiv/26-11-12-1919.html) – Neuer Titel: Curses · a customized interpreter
- [26-11-12-1842](archiv/26-11-12-1842.html) – Knopf „Alles zurücksetzen“ in den Einstellungen
- [26-11-12-1835](archiv/26-11-12-1835.html) – Vorlesen in der Übersetzungsspalte

<!-- verlauf -->
## Entwicklungsverlauf

Das Projekt ist in einem langen Gespräch zwischen dem Projektinhaber und Claude (Anthropic) entstanden: Der Projektinhaber hat die Richtung vorgegeben, gespielt, Fehler gefunden und entschieden; Claude hat programmiert, gezeichnet, komponiert und getestet. Die Abschnitte folgen der Reihenfolge, in der die Teile entstanden sind.

### Grundsätze
- **Kein Spieltext in der Seite.** Weder die Spieldatei noch Texte aus dem Spiel oder der Komplettlösung sind eingebettet. Jeder Spieler lädt seine eigene `curses.z5` (und auf Wunsch eine eigene Komplettlösung für die Vorführung).
- **Eigene Werke.** Alle Bilder, Symbole, die Musik und die Hinweise sind eigens für dieses Projekt entstanden.
- **Nur zeigen, was beschrieben wurde.** Ein Bild darf nichts zeigen, was der Text noch nicht genannt hat. Was im Raum noch nicht erwähnt wurde, erscheint höchstens als unscharfer, farbloser Schemen. Diese Regel gilt für jeden Raum einzeln. Es wird auch nichts erfunden, was im Spiel nicht vorkommt.

### 1. Der Spielkern
- Eigener Z-Machine-Interpreter (Version 5) in JavaScript, der `curses.z5` vollständig durchspielt.
- Statuszeile, Zitatboxen des Spiels, Undo, Spielstände im Browser (komprimiert, damit viele hineinpassen), automatisches Speichern und Fortsetzen.
- Ein Neustart löscht wirklich alles vom vorigen Durchgang, auch Karte und Notizen.

### 2. Oberfläche und Komfort
- Deutsche und englische Oberfläche, Übersetzungsspalte für den Spieltext, Vorlesen.
- Ein „schlauer“ Parser, der freiere Eingaben in Befehle übersetzt, die das Spiel versteht (z. B. „get all out of cupboard“).
- Inventar mit Symbolen und passenden Aktionen per Klick; Befehle aus Symbolen benutzen die richtigen Namen der Gegenstände.
- Raum-Inventarleiste unter dem Bild: Gegenstände, die du irgendwo abgelegt hast und die dort nicht hingehören.
- Automatische Karte nach Regionen, mit frei verschiebbaren Räumen (an einem Raster einrastend).
- Notizen, Hinweise, bekannte Wege als Knöpfe, Vorführmodus „Komplettlösung vorführen“.
- Die Eingabetaste funktioniert auch in eingebetteten Ansichten (dort wird das Absenden selbst ausgelöst).

### 3. Musik
- Generative Musik mit der Web-Audio-Schnittstelle, keine Aufnahmen.
- Nach einem ersten, eher gruseligen Entwurf neu komponiert: mystisch und sphärisch, mit eigener Stimmung für jeden Bereich (Dachboden, Garten, Labyrinth, Griechenland, Ägypten, Alexandria, Römisches Britannien, Jenseits …), die auf Ereignisse und Punkte reagiert.
- Die Lautstärke ist fest eingestellt; der frühere Schieberegler entfiel.

### 4. Raumbilder
- Zuerst ein Baukasten aus Kategorien (Dachboden, Keller, Garten, Tempel …), dann nach und nach einzeln gezeichnete Räume: der ganze Dachboden, das Haus, die Keller, Gärten, Labyrinth und weitere wichtige Orte – insgesamt 73 Räume mit eigener Bildidee.
- Die Bilder folgen dem Spielzustand: offene und geschlossene Türen, Gegenstände, die da sind oder fehlen.
- Korrektur nach Hinweis: Der Schrank im Raum „Old Furniture“ hat im Spiel keine Türen – er wird ohne Türen gezeichnet, sein Inhalt erscheint erst, wenn der Text ihn nennt. Daraus entstand die allgemeine Regel „nur zeigen, was beschrieben wurde“.
- Die Farben der Gegenstände im Bild und ihrer Inventarsymbole wurden aufeinander abgestimmt.
- Figuren: 23 Personen und Tiere des Spiels (Jemima, Austin, Homer, die Druidin, Andromeda …) werden gezeichnet, wenn sie anwesend sind.
- Grafikstile: Zeitweise gab es einen Pixel-Stil als Option und weitere Stilentwürfe (u. a. im Stil von 8-Bit-Heimcomputern). Sie wurden am 12. November 2026 verworfen; der gezeichnete Stil ist der einzige.

### 5. Prüfen und Testen
- Automatischer Durchlauf der kompletten Lösung (1083 Züge) im Browser: keine Fehler, jeder Raum mit Bild, volle Punktzahl.
- „Chaos-Tests“: Durchläufe mit falschen, unsinnigen und gefährlichen Eingaben, die immer wieder per Undo, Spielstand oder Neustart zurückgesetzt werden – das Spiel muss trotzdem mit voller Punktzahl enden.
- Dabei gefundene und behobene Fehler u. a.: verlorene Zitatboxen, Undo bei einer Rückfrage des Spiels, volle Spielstände, alte Karte nach Neustart, fehlerhafte Befehle aus Inventarsymbolen.

### 6. Alle übrigen Räume (12. November 2026)
- Statt jeden der restlichen Räume einzeln zu zeichnen, wurde der Baukasten neu gebaut: Er liest die Raumbeschreibung und setzt das Bild daraus zusammen.
- Erkannt werden die Art des Ortes (Zimmer, Gang, Höhle, Zelt, Schiffsdeck, Landschaft), Tageszeit, Wand- und Bodenmaterial, die Ausgänge in der richtigen Himmelsrichtung und rund 90 Dinge, die der Text nennen kann – von Reliefs und Götterstatuen über Hieroglyphen und Kirchenfenster bis zu Leuchtturm, Ziegen und Prozessionen. Verneinungen („There are no bones“) werden beachtet.
- Damit haben alle 164 echten Räume ein Bild: 73 einzeln gezeichnete, 91 aus ihrer Beschreibung zusammengesetzte. Bei kurzen Zweitbesuchen behält das Bild die Raumbeschreibung vom ersten Besuch.
- 15 neue Inventarsymbole für Dinge, die in diesen Bildern vorkommen (Feige, Wasserball, Fackel …), jeweils in denselben Farben wie im Bild.

### 7. Nahansichten (12. November 2026)
- Wer eine Tarotkarte oder einen Stab untersucht, sieht ein großes Bild davon; ein Klick, die Escape-Taste oder der nächste Befehl schließt es.
- Alle zehn Tarotkarten des Spiels (Madame Sosostris, Grim Reaper, Fool, Drowned Sailor, Ace of Cups, Castle, Star, Maiden, Crescent Moon, Eight of Wands), die Adamant-Stäbe Life, Death und Love sowie die Mahagoni-Stäbe mit ihrem Silberschild.
- Dieselben Bilder dienen verkleinert als Inventarsymbole.

### 8. Veröffentlichung
- Neben dem Artefakt auf claude.ai wird jede neue Version automatisch in dieses Repository übertragen; die drei vorigen Versionen liegen in `archiv/`.

### 9. Erkundungstest und Feinschliff (12. November 2026)
- Neuer Erkundungstest: Von jedem dritten Zug der Komplettlösung aus werden alle Richtungen und einfache Bewegungen (klettern, hineingehen, springen …) ausprobiert, und von jedem neu gefundenen Raum aus weiter. So wurden neun Räume abseits der Lösung erreicht (u. a. Chimney, Wine Cellars, Vegetable Garden, Dark Staircase, Stadium, Hellish Place); alle zeigen ihr Bild ohne Fehler.
- Personen werden erst gezeichnet, wenn der Text von ihnen spricht – auch unter dem Namen, den das Spiel gerade benutzt. Der unsichtbare Geist auf den Battlements verriet sich vorher als Schemen; jetzt erscheint er erst, wenn er sich zeigt, und der Schlüssel, den er verschluckt, verschwindet aus dem Bild.
- Der Pixel-Stil wurde entfernt.

### 10. Feinschliff am Abend (12. November 2026)
- Versionsstempel (JJ-MM-TT-HHMM) klein neben dem Titel, gleich auf claude.ai und GitHub.
- Tab-Symbol: eine Tarotkarte mit Mondsichel.
- Musik ist standardmäßig an (wer sie ausschaltet, bei dem bleibt sie aus); die Einstellung „Bildposition“ entfiel, das Bild steht immer in der Seitenleiste.
- Handy: Die Statuszeile passt auf schmale Bildschirme, die Knöpfe stehen in einer Reihe unter dem Titel, die man seitlich schieben kann; einheitliche Häkchen und dunkle Bildlaufleisten.
- Schlussbild für das Spielende (Raum „House“): Meldrew Hall und das Auto auf dem Weg zum Flughafen.
- Die grünen Lichtflocken im Traum (Melancholy Dream) werden gezeichnet, sobald der Text sie nennt. Der „Geist deiner selbst“ ist die Spielfigur im Traum und wird – wie die Spielfigur überall – nicht gezeichnet; der Botenjunge in der Bibliothek ist nur einen Augenblick da und hat im Spiel keine eigene Gestalt.
- Das Vorschaubild beim Fortsetzen nutzt die gespeicherte Raumbeschreibung.

### 11. Die Bohnenranke (12. November 2026)
- Mit dem Hinweis aus der Komplettlösung von Key & Compass gefunden: Im Gemüsegarten „strike stalking“ und „point stalking at plant“ lassen die Bohnenpflanze zur Riesenranke wachsen; über „u“ und „n“ geht es zu Up the Beanstalk und Heavenly Place. Beide im laufenden Spiel geprüft.
- Das Bild des Gemüsegartens folgt jetzt der Pflanze: die kleine Pflanze an ihren Stangen, die Riesenranke bis in die Wolken (sofort, wenn sie wächst) oder gar nichts mehr nach dem Unkrautvernichter.
- Damit sind alle Räume geklärt: jeder erreichbare Raum ist im laufenden Spiel geprüft. Inside Well betritt man nur im Dunkeln, Near Dolmen ist Teil eines Traums, aus dem das Spiel im selben Zug weckt – beide erscheinen nie als eigenes Bild.

### 12. Abgleich mit der Komplettlösung von Key & Compass (12. November 2026)
- Räume, die sich im Lauf des Spiels verändern, nachgeprüft: Dead End zeigt jetzt die offene Luke zur Feuertreppe (mit einfallendem Licht) und später die offene Geheimtür; Lawn Ornaments zeigt nach der Walze Gipsstaub und den alten Brunnen an der Stelle der Statuette, die goldene Kugel daneben und die geparkte Walze.
- Neue Inventarsymbole für den Affen und die Schriftrollen-Hülsen.

### 13. Spieldatei aus dem IF Archive (12. November 2026)
- Die Spieldatei bleibt draußen – Grundsatz beibehalten, obwohl die README des Autors die kostenlose Weitergabe erlauben würde.
- Startseite: Link zur README des Autors und ein Knopf „direkt von dort laden“, der die Datei im Browser aus dem IF Archive holt, wenn Browser und Archiv das von der Seite aus zulassen; sonst erscheint ein Hinweis, die Datei herunterzuladen und abzulegen.

### 14. Speicherort der Spielstände (12. November 2026)
- Im Fenster „Spielstände“ erklärt ein aufklappbarer Hinweis, dass alles nur im Browser auf dem eigenen Gerät liegt, dass jede Adresse ihren eigenen Speicher hat, wann Spielstände verloren gehen und wie man sie per Export sichert.

### 15. Übersetzung vorlesen (12. November 2026)
- Die Übersetzungsspalte hat jetzt eine Vorlesefunktion: ein 🔊-Knopf an jedem Abschnitt und „Vorlesen“ oben für die letzte Übersetzung, gelesen mit einer Stimme in der Zielsprache. In den Einstellungen lässt sich diese Stimme eigens wählen. Ist ein Abschnitt (noch) nicht übersetzt, liest die englische Stimme das Original.

### 16. Alles zurücksetzen (12. November 2026)
- In den Einstellungen unter „Spiel“: „Alles zurücksetzen“ löscht nach einer Rückfrage alles, was die Seite in diesem Browser gespeichert hat – Einstellungen, Spielstände, Karte, Notizen, gespeicherte Spieldatei – und lädt die Seite neu wie beim ersten Besuch.

### 17. Neuer Titel (12. November 2026)
- Aus „Curses · Fan-Edition“ wird „Curses · a customized interpreter“: Das Projekt ist ein eigener Interpreter, der das unveränderte Spiel abspielt, keine eigene Ausgabe des Spiels. Geändert auf der Startseite, in der Kopfleiste, im Browser-Tab und hier.

### 18. Titelbild und Vorlesen (12. November 2026)
- Zeilen, die das Spiel mit Leerzeichen für einen Bildschirm fester Breite zentriert (etwa „Welcome to CURSES“), werden jetzt richtig zentriert; Zitatkästen verlieren die Einrückung aus dem Statusfenster. Zeichnungen und Tabellen aus Zeichen behalten ihre Spalten.
- Hinweise in eckigen Klammern (z. B. „[Your score has just gone up …]“) werden beim Vorlesen übersprungen; in den Einstellungen lässt sich das wieder einschalten.

### Offen
- Einzelne aus der Beschreibung zusammengesetzte Räume bei Bedarf von Hand nachzeichnen.
<!-- /verlauf -->
