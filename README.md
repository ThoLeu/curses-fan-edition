# Curses · an illustrated interpreter

An illustrated Z-machine interpreter for Graham Nelson’s 1993 text adventure *Curses*, playable in the browser, with original room illustrations, an automatic map, generative music, inventory icons, translation help and a smart parser. No game text included – load your own `curses.z5`. Everything in a single HTML file, ready to play.

**Spielen / Play:** [index.html](index.html) (über GitHub Pages: `https://tholeu.github.io/curses-fan-edition/`)

Du brauchst deine eigene Spieldatei `curses.z5`. Sie ist nicht in diesem Repository enthalten; du bekommst sie kostenlos im [IF Archive](https://ifarchive.org/if-archive/games/zcode/curses.z5) (siehe die [README des Autors](https://ifarchive.org/if-archive/games/zcode/curses_rel16.txt)), oder du lässt die Startseite sie direkt von dort laden. / You need your own story file `curses.z5`; it is not part of this repository. Get it free from the [IF Archive](https://ifarchive.org/if-archive/games/zcode/curses.z5) (see the [author's README](https://ifarchive.org/if-archive/games/zcode/curses_rel16.txt)), or let the start page load it from there.

*Curses* © Graham Nelson. The game is free and may be distributed without profit, as its README says; this interpreter is a separate, unofficial player and does not include it.

## Aktuelle Version

26-11-13-1757 – Bilder für die Spielenden; vollständiger Entwicklungsverlauf mit Daten

## Ältere Versionen

- [26-11-13-1726](archiv/26-11-13-1726.html) – Seltene Zustände: Holzluke, Weinkeller-Licht, Marmorwand, Dienstbotentür; Stab-Rückfrage im Inventarmenü
- [26-11-13-1712](archiv/26-11-13-1712.html) – Abgleich mit dem rekonstruierten Quelltext
- [26-11-13-1658](archiv/26-11-13-1658.html) – Dinge, die man schiebt

<!-- verlauf -->
## Entwicklungsverlauf

Das Projekt ist in einem langen Gespräch zwischen dem Projektinhaber und Claude (Anthropic) entstanden: Der Projektinhaber hat die Richtung vorgegeben, gespielt, Fehler gefunden und entschieden; Claude hat programmiert, gezeichnet, komponiert und getestet. Die Abschnitte folgen der Reihenfolge, in der die Teile entstanden sind.

### Grundsätze
- **Kein Spieltext in der Seite.** Weder die Spieldatei noch Texte aus dem Spiel oder der Komplettlösung sind eingebettet. Jeder Spieler lädt seine eigene `curses.z5` (und auf Wunsch eine eigene Komplettlösung für die Vorführung).
- **Eigene Werke.** Alle Bilder, Symbole, die Musik und die Hinweise sind eigens für dieses Projekt entstanden.
- **Nur zeigen, was beschrieben wurde.** Ein Bild darf nichts zeigen, was der Text noch nicht genannt hat. Was im Raum noch nicht erwähnt wurde, erscheint höchstens als unscharfer, farbloser Schemen. Diese Regel gilt für jeden Raum einzeln. Es wird auch nichts erfunden, was im Spiel nicht vorkommt.

### 1. Der Anfang (11. November 2026, ab 15:38)
- Ausgangsfrage war, ob sich Curses in HTML nachbauen lässt, mit Karte und Bildern. Ein Nachbau wurde verworfen, weil er Graham Nelsons Werk kopiert hätte. Stattdessen entstand ein eigener Z-Machine-Interpreter (Version 5) in JavaScript, der die unveränderte `curses.z5` des Spielers abspielt. In der Seite selbst steckt kein Spieltext.
- Die Spieldatei diente nur zum Testen. Die erste Fassung bestand Vorspann, Statuszeile, Hilfemenü, SAVE, RESTORE, UNDO und RESTART sowie 1500 zufällige Befehle ohne Interpreterfehler.
- Von Anfang an dabei waren die Minimap, die sich beim Spielen selbst zeichnet, Raumbilder aus 14 Szenentypen nach Stichwörtern, generative Musik mit acht Stimmungen, drei Speicherplätze mit automatischem Speichern und Bildschirmtasten für Menüs auf dem Handy.
- Alles steckt in einer einzigen `index.html`, die auch ohne Internet läuft und andere Z-Code-Spiele der Versionen 3 bis 5 abspielt.
- Vorlesen auf Klick: ein 🔊 an jedem Abschnitt und ein Knopf für die letzte Antwort. Eigene Eingaben werden nie mitgelesen, die Musik wird beim Vorlesen leiser.

### 2. Raumbilder und Hilfe (11. November 2026, 16:06–16:43)
- Auf Wunsch des Projektinhabers sollten die Bilder möglichst genau der Beschreibung folgen. Zuerst bekamen die 15 Dachbodenräume, die man ohne Rätsel erreicht, eigene Bilder. Danach kamen mit Hilfe der Komplettlösung 37 weitere aus allen Spielbereichen dazu, insgesamt 52. Die Beschreibungen wurden mit dem eigenen Interpreter aus der Spieldatei gelesen.
- Die optionale Hilfe besteht aus eigenen, stufenweise aufdeckbaren Hinweisen, die alle im Interpreter geprüft sind. Die InvisiClues aus dem Forum wurden nicht übernommen, weil ihre Weiterverwendung nicht erlaubt ist. Die Hilfe verlinkt aber auf sie, auf die Komplettlösung von David Welbourn und auf die IFDB.
- Die Bilder folgen dem Spielzustand, der direkt aus dem Objektbaum gelesen wird (Attribut 14 bedeutet „offen“). Schließt man zum Beispiel die Falltür auf dem Dachboden, wird es dunkler, und das Schmuckkästchen erscheint. Gegenstände, die man nimmt, verschwinden aus dem Bild.

### 3. Komfort, Sprache und Startseite (11. November 2026, 16:43–19:04)
- Auf einen Vorschlag hin kamen zehn Erweiterungen dazu: Notizbuch je Raum mit ✎ auf der Karte, beliebig viele benannte Spielstände mit Export und Import, Transkript, Wörter antippen, bekannte Wege als Knöpfe, Autovervollständigung nur mit schon gesehenen Wörtern, Punkteanzeige „+5“, Geräusche bei Zustandswechseln, ein klassischer Terminal-Modus sowie Schriftgröße, Zeilenbreite und ein heller Papiermodus.
- Auf Wunsch des Projektinhabers gibt es ein Inventar mit eigenen Symbolen und passenden Aktionen per Klick.
- Erster vollständiger Durchlauf der Komplettlösung: 554 von 550 Punkten in 1083 Zügen, ohne Fehler. Für die zwei Zufallsrätsel (Statuen im Labyrinth, Schrittzahl beim Krocket) bekam das Testskript einen eigenen Löser. Danach verbinden auf der Karte nur noch echte Wege die Räume, Teleports nicht mehr. Die Stichwortsuche erkennt nur ganze Wörter, damit zum Beispiel das griechische „Cross Centre“ nicht mehr als Kirche gezeichnet wird.
- Die Karte ist nach den Regionen geteilt, die das Spiel in der Statuszeile nennt. Jede Region hat ein eigenes Blatt mit Wegweisern an den Übergängen, der Tarot-Kasten ist in Teilblätter getrennt. Behälter im Inventar zeigen ihren Inhalt nur, wenn das Spiel ihn zeigen würde.
- Die Oberfläche lässt sich ganz zwischen Deutsch und Englisch umschalten. Der Spieltext bleibt englisch, weil eine Übersetzung eine Bearbeitung des Werks wäre. Deutsche Befehle werden vor dem Spiel übersetzt. Der „schlaue Parser“ korrigiert Tippfehler und Formulierungen erst dann, wenn das Spiel einen Befehl nicht versteht. Fehlversuche werden vollständig zurückgedreht.
- Die Übersetzungsspalte übersetzt den Text mit der Übersetzung des Browsers auf dem eigenen Gerät. Zuerst war sie ein Reiter, dann eine eigene Spalte zwischen Original und Seitenleiste, später mit eigenem deutschem Eingabefeld.
- Neue Startseite nach Entwurf B („Buch“): links der Dachboden als Buchtafel mit tanzendem Staub, rechts die Titelseite mit Dateierkennung, Weiterspielen-Karte, Spielweisen und Hörprobe.
- Der Untertitel „der illustrierte Spieler“ wurde zu „Fan-Edition“.

### 4. Musik (11. November 17:34 bis 12. November 06:34)
- Die erste Musik war zu „dudelig“. Die zweite Fassung war dunkel und sparsam, mit Drones, Moll und Kirchentonarten und einem Grusel-Regler, und jeder Raum bekam seine eigene Variante.
- Diese zweite Fassung war dann zu gruselig. Die dritte ist mystisch und sphärisch, mit weichen Flächen, Spieluhr, Harfe, Chor und Glasharmonika und einer Stimmung je Raum nach dem, was dort passiert. Sie reagiert auf Punkte, Gefahr, Magie, Tod und Sieg.
- Diese Fassung wurde fest übernommen. Der Regler entfiel, sein Wert ist bei 30 % fest eingestellt.

### 5. Stile, Prüfung und der Grundsatz der Erwähnung (11. November 18:02 bis 12. November 11:59)
- Stilproben: zuerst nur umgefärbte Varianten, dann vier neu gezeichnete Techniken, später sechs grundverschiedene Entwürfe, eine 8-Bit-Probe im CPC-Stil und ein flacher Pixelstil. Eine umgerechnete Pixelgrafik gab es eine Zeit lang als Option. Alle diese Stile wurden später verworfen, der gezeichnete Stil ist der einzige.
- Hinzugedichtetes wurde entfernt: das tote Kabel auf dem Dachboden, ein drittes Buch in Library Storage, die Sense in der Garage (es ist ein Spaten), Kerzen, Landschaftsbilder und Fackeln in den allgemeinen Räumen. Bilder zeigen nur noch, was es im Spiel gibt.
- Prüfung mit Umwegen: acht Durchläufe mit je rund 700 falschen Befehlen, Undo, Laden und Neustart. Behoben wurden die unsichtbaren Zitatkästen des Spiels, das „undo“, das bei einer Rückfrage etwas öffnete, und volle Spielstände (sie sind jetzt rund 17-mal kleiner). Ein „nicht“ in der Beschreibung wird beachtet, und für das Bild zählt nur die Raumbeschreibung.
- 23 Figuren werden im gezeichneten Stil nach den Angaben des Spiels gezeigt, zum Beispiel Old Evans mit Mondsichel am Hut, die erkältete Madame Sosostris und Andromeda von hinten. Das Orakel wird nicht beschrieben und fehlt deshalb.
- Ein Vorführmodus spielt eine selbst geladene Komplettlösung live im Browser durch. Das eigene Spiel bleibt dabei unberührt.
- Am Morgen des 12. November (06:13) kam der Hinweis des Projektinhabers: Der Schrank in Old Furniture hat keine Türen, und man kennt seinen Inhalt erst, wenn man ihn untersucht. Daraus wurde der Grundsatz „nur zeigen, was beschrieben wurde“. Vorher ist nur ein farbloser Schemen zu sehen. Der Grundsatz gilt für jeden Raum einzeln, nur Dinge, die man selbst getragen hat, kennt man überall.
- Weitere Wünsche am Vormittag des 12. November:
  - eine Leiste „Hier abgelegt“ unter dem Bild für Dinge, die man woanders hingelegt hat
  - ein Neustart, der wirklich alles löscht
  - die Eingabetaste in der Sandbox des Artefakts
  - frei verschiebbare Räume auf der Karte
  - „get all out of cupboard“ im Parser
  - die fehlende Medizinflasche
  - gleiche Farben für Inventarsymbole und Bild (17 Symbole angepasst)
  - richtige Wörter für Befehle aus Symbolen („examine history“ statt „examine II“)
- Danach kamen in zwei Durchgängen die übrigen Räume von Meldrew Hall und den Gärten dazu, darunter das Labyrinth, dessen Gänge sich nach den Richtungen im Text öffnen. Damit waren es 73 einzeln gezeichnete Räume.

### 6. Alle übrigen Räume (12. November 2026)
- Statt jeden der restlichen Räume einzeln zu zeichnen, wurde der Baukasten neu gebaut: Er liest die Raumbeschreibung und setzt das Bild daraus zusammen.
- Erkannt werden die Art des Ortes (Zimmer, Gang, Höhle, Zelt, Schiffsdeck, Landschaft), Tageszeit, Wand- und Bodenmaterial, die Ausgänge in der richtigen Himmelsrichtung und rund 90 Dinge, die der Text nennen kann – von Reliefs und Götterstatuen über Hieroglyphen und Kirchenfenster bis zu Leuchtturm, Ziegen und Prozessionen. Verneinungen („There are no bones“) werden beachtet.
- Damit haben alle 164 echten Räume ein Bild: 73 einzeln gezeichnete, 91 aus ihrer Beschreibung zusammengesetzte. Bei kurzen Zweitbesuchen behält das Bild die Raumbeschreibung vom ersten Besuch.
- 15 neue Inventarsymbole für Dinge, die in diesen Bildern vorkommen (Feige, Wasserball, Fackel …), jeweils in denselben Farben wie im Bild.

### 7. Nahansichten (12. November 2026)
- Wer eine Tarotkarte oder einen Stab untersucht, sieht ein großes Bild davon; ein Klick, die Escape-Taste oder der nächste Befehl schließt es.
- Alle zehn Tarotkarten des Spiels (Madame Sosostris, Grim Reaper, Fool, Drowned Sailor, Ace of Cups, Castle, Star, Maiden, Crescent Moon, Eight of Wands), die Adamant-Stäbe Life, Death und Love sowie die Mahagoni-Stäbe mit ihrem Silberschild.
- Dieselben Bilder dienen verkleinert als Inventarsymbole.

### 8. Veröffentlichung (12. November 2026, ab 16:42)
- Neben dem Artefakt auf claude.ai liegt jede Version in diesem Repository, für GitHub Pages bereit. Die Übertragung läuft automatisch über ein kleines Skript: Die vorige Version wandert nach `archiv/`, wo die letzten drei bleiben, und die README bekommt eine Zeile zur Änderung. Offizielle GitHub-Releases kann die Sitzung nicht anlegen.
- Der Entwicklungsverlauf in dieser README entstand zuerst aus einer Zusammenfassung. Am 13. November wurde er mit dem vollständigen Gesprächsverlauf und seinen Zeitstempeln ergänzt.
- Vor dem Teilen wurde das Repository mit sauberer Historie neu aufgesetzt, damit keine persönlichen Daten in den Commits stehen. Eine Lizenz gibt es bewusst nicht.

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

### 19. Der Diaprojektor (12. November 2026)
- Souvenirs Room: Die Südwand zeigt jetzt, was der Projektor tatsächlich wirft – dunkel, wenn er aus ist, weißes Licht ohne Dia, und sonst das Bild im Schlitz: die jeweilige Tarotkarte (ganz und hochkant, leicht durchscheinend wie ein Dia), die Miniatur der Folly (hochkant, so groß wie eine Spielkarte) oder die Skizze des Palasts von Alexandria (quer), alle leicht durchscheinend. Nach dem Drehen am Rad schießt der Strahl rückwärts aus dem Projektor.
- Disused Observatory: Der Strahl kommt von Süden, trifft die Glaskugel und fällt auf das Tierkreiszeichen, das der Text nennt.
- Dafür kennen die Bilder jetzt auch, was eingeschaltet ist und was in einem Behälter steckt.

### 20. Gegenstände verändern Räume (12. November 2026)
Sieben weitere Räume zeigen jetzt, was der Spieler darin bewirkt hat. Gezeichnet wird nur, was das Spiel zuvor beschrieben hat:
- Infinity Symbol: die Stäbe in den Halterungen des Bogens, die kugelförmige Öffnung und das goldene Licht, sobald die Kugel darin liegt.
- West Side Chapel: Hand, Schädel und Herz am Ritter; ist er erwacht, bleibt nur das Grab.
- Quite an Undertaking: das Zepter in der jeweiligen Halterung, über dem Gemälde des Priesters.
- Necropolis: das Steingesicht, der Bernstein in seinem Mund und die Stufen hinab.
- Cross Centre: die Öffnung im Boden und der Stein, der sie verschließt.
- East Side Chapel: die Marmorrose im Haar der Diana.
- Parish Church: der geöffnete Moonstone mit dem Kristalltor.

### 21. Die Dunkelkammer (13. November 2026)
Die Dunkelkammer leuchtet erst rot, wenn man an der Schnur zieht und die Entwicklerlampe angeht. Vorher erhellt sie nur die mitgebrachte Taschenlampe, und der Raum ist in gedämpften Farben nur schemenhaft zu erkennen. Die goldene Kugel an der Schnur erscheint erst, wenn der Text sie erwähnt hat. Ein neues Prüfwerkzeug in der Entwicklungsumgebung probiert in jedem Raum die üblichen Handlungen aus und vergleicht Beschreibung und Bild vorher und nachher.

### 22. Zwanzig weitere Raumzustände (13. November 2026)
Die Räume zeigen jetzt auch diese Veränderungen, sobald das Spiel sie beschreibt oder den Zustand ändert:
- Licht: der Wandschrank (Inside Cupboard) bleibt dunkel, bis das Dachfenster offen ist; in der East Annexe fällt Sonnenlicht von Süden herein, sobald die Luke in der Sackgasse offen ist; in der Spirit World strömt Licht die Treppe herab, wenn der Eingang aufbricht.
- Geöffnet, zerbrochen, verschoben: die Glasvitrine im Cabinet Room, das Wandbild in der Crypt mit dem Gang dahinter, die Brunnenabdeckung im Triclinium, der Sargdeckel in Quite an Undertaking, die beschriebene Tür mit der Treppe in A Tower, der Modellsarg in The Octagon (zu, offen, oder zu und elektrisch knisternd), die Fenster in Alison's Writing Room, die Klappe des Kohlenbunkers am Garden Stream.
- Hinzugekommen oder verschwunden: die Flagge als Decke auf Alisons Bett, Fahnenmast und Flagge an Deck des Schiffs, das Segelboot am Garden Stream, das gegrabene Loch und die Lücke in der Hecke auf dem Croquet Lawn, die drei High Rods in der Parish Church, das Ausflugsboot am Ufer (Down by River), Schlüssel und Stein am Hafen in Alexandria, die verbrannte Lücke in der Dornenhecke.
- Das Wandbild in Bohemia zeigt jeweils Stil und Motiv, die der Text nennt (zehn Varianten). Im Feld des Gartenrasters (Maze Foundations) stimmen die Beete jetzt mit allen Richtungsangaben überein.
- Räume, die aus ihrer Beschreibung zusammengesetzt werden, behalten ihren Aufbau, wenn sich die Beschreibung durch eine Handlung ändert. Nur das Veränderte wird neu gezeichnet. Wo das Spiel einen Zustand kennt (offen, an, eingesteckt), gilt dieser sofort, auch bevor man sich erneut umsieht.

### 23. Das Bild ist nur noch Illustration (13. November 2026)
Damit der Charakter des Textadventures erhalten bleibt, lässt sich im Bild nichts mehr anklicken. Fährt man mit der Maus darüber, erscheinen keine Namen mehr, und der Mauszeiger verrät nicht mehr, wo etwas liegt. Die Einstellung „Namen im Bild“ ist entfernt. Die Leiste „Hier abgelegt“ unter dem Bild zeigt weiterhin, was man selbst dort abgelegt hat, öffnet aber kein Befehlsmenü mehr. Was im Raum ist und was man damit tut, findet man allein über den Text heraus.

### 24. Die letzten Räume und sofortige Änderungen (13. November 2026)
Auch die vier Räume abseits der Komplettlösung (Stream, Tree Planting, Up the Beanstalk, Heavenly Place) sind jetzt auf Gegenstände durchprobiert. In keinem ändert eine Handlung das Aussehen. Zwei Veränderungen meldet das Spiel nur in der Antwort auf eine Handlung: die Lücke in der Hecke des Croquet Lawn und den aufbrechenden Eingang der Spirit World. Sie erscheinen jetzt sofort im Bild, nicht erst nach dem nächsten Umsehen. Dafür übernimmt die gespeicherte Raumbeschreibung den Satz, mit dem das Spiel die Veränderung später selbst beschreibt.

### 25. Neuer Titel: an illustrated interpreter (13. November 2026)
Aus „Curses · a customized interpreter“ wird „Curses · an illustrated interpreter“. Seit die Bilder reine Illustration sind, beschreibt das Wort genau, was diesen Interpreter von anderen unterscheidet.

### 26. Die Spatzen (13. November 2026)
Die Spatzen kommen an zwei Orten vor, im Hedgery und im Summer House. Im Hedgery drängen sie sich an der Dachrinne des Gartenhauses, wie der Text es sagt. Im Summer House zeigt das Bild jetzt die beiden Zustände der Beschreibung: aufgeschreckt kreisen die Spatzen hoch am Himmel über dem Glasdach, ruhig sitzen sie zwitschernd an der Dachrinne. Nach der Vogelpfeife fliegen sie sofort auf. Die goldene Uhr, die sie dabei losschlagen, hängt danach nicht mehr am Dach, sondern liegt am Boden.

### 27. Breite Prüfung, Behälter und alle Lichtstrahlen (13. November 2026)
Statt das Spiel ohne Lösung zu spielen, was bei Curses Tausende Züge bräuchte, prüft ein breiterer Suchlauf, ob alles, was man tun kann, im Bild ankommt. In jedem Raum werden an drei Zeitpunkten gut 60 Verben auf jedes Ding angewendet. Jeder getragene Gegenstand wird mit jedem Ding kombiniert (hineinlegen, damit schlagen, festbinden, aufschließen, darauf zeigen, werfen, geben …), und jeder Stab wird angeschlagen und auf jedes Ding gerichtet. Insgesamt sind das rund 81.000 Befehle. Verglichen werden die Beschreibung und der Spielzustand des Raums, und nach jeder Veränderung auch die Beschreibungen aller Räume bis zwei Schritte entfernt (Fernwirkungen).
- Was man in die Teekisten auf dem Dachboden, in den Schirmständer im White Hallway oder in den offenen Modellsarg im Octagon legt, ist jetzt darin zu sehen.
- Das Observatorium zeigt alle vier Strahlen, die das Spiel je nach Dia im Projektor kennt: auf ein Sternzeichen gelenkt, als Regenbogenspektrum an der Decke, wild wirbelnd wie ein Stroboskop und als kreisender gelber Suchscheinwerfer.

### 28. Das Inventar spricht wie das Spiel (13. November 2026)
Die Inventarliste stammt jetzt vom Spiel selbst. Nach jedem Zug spielt der Interpreter unsichtbar den Befehl „inventory“ und stellt danach alles exakt wieder her: Spielstand, Undo, Bildschirm und Zufallszahlen. So stehen in der Liste dieselben Namen, Gruppen und Zustände, die das Spiel nennen würde:
- Die Namen sind die des Spiels. Ein Stab heißt „featureless mahogany rod“, bis er einen Namen hat, und erst dann „Rod of Fire“. Der Spaten heißt so, wie das Spiel ihn nennt („bladed agricultural implement“). Die internen Kurznamen der Spieldatei verraten nichts mehr.
- Zustände wie im Spiel, auf Deutsch: leuchtet, getragen, um den Hals, hinterm Ohr, offen, leer, geschlossen, verschlossen, geladen.
- Tarotkarten und Stäbe erscheinen als aufklappbare Gruppen, wie das Spiel sie zusammenfasst. Volle Behälter wie der Rucksack lassen sich zuklappen. Die Zahl am Reiter zählt alle Gegenstände.
- Das Menü beim Antippen schlägt nur noch vor, was nichts verrät: untersuchen, ablegen und das Rückgängigmachen eines angezeigten Zustands (ausziehen, ausschalten, öffnen, schließen).
- Eigene Symbole für die Miniatur, den Holzbalken und das Papyrusfragment. Auch die Leiste „Hier abgelegt“ verwendet die Namen des Spiels.

### 29. Aufgeräumter Startbildschirm (13. November 2026)
Das Bild mit dem tanzenden Staub bleibt, die rechte Seite ist aufgeräumt. Oben steht jetzt ein großer Knopf „Spielen“: Er lädt curses.z5 direkt aus dem IF Archive und startet das Spiel. Darunter kommt als Alternative die eigene Datei, mit Link zum Herunterladen und Ablagefeld. Die drei Spielweisen (Illustriert, Klassisch, Mit Hilfen) stehen ohne die wenig aussagekräftigen Vorschaubilder darunter, die nummerierten Schritte sind entfallen. Mit einem gespeicherten Spiel erscheint statt des Knopfes wie bisher die Karte „Weiterspielen“.

### 30. Dinge, die man schiebt (13. November 2026)
Ein zweiter Lösungsweg (von Marc Leduc) brachte einen neuen Prüflauf: Was lässt sich in jedem Raum in jede Richtung schieben? Gefunden wurden das Radio, Austin, der Wasserball und die Statuen.
- Das alte Radio im Wäscheschrank erscheint, sobald man es unter den Laken gefunden hat. Schiebt man es zu Aunt Jemima, steht es dort, mit glühenden Röhren und Noten, wenn es spielt, und dunkel, wenn es aus ist.
- Die Statuen im Labyrinth erscheinen dort, wo sie wirklich stehen, auch mehrere in einem Raum und auch dann, wenn das Spiel den Raum beim Hineinschieben nur kurz beschreibt.
- Der Wasserball rollt mit ins Museumsfoyer. Was beim Betreten eines Raums über etwas gesagt wird, das man mitbringt, zählt jetzt auch für den neuen Raum als erwähnt.

### 31. Abgleich mit dem rekonstruierten Quelltext (13. November 2026)
Allen Garvin hat Curses aus der Spieldatei dekompiliert und als Inform-6-Quelltext nachgebaut (github.com/allengarvin/curses), nach eigener Aussage mit Graham Nelsons Einverständnis. Mit diesem Quelltext ließ sich zum ersten Mal vollständig prüfen, statt zu suchen: Für jeden Raum wurden alle Sätze herausgezogen, die je nach Spielzustand in seiner Beschreibung erscheinen können, knapp 400 aus 160 Räumen. Jeder Satz wurde gegen das Bild geprüft. Der Quelltext wurde nur zum Prüfen gelesen, nichts daraus steckt im Interpreter.
- Observatorium: drei weitere Strahlen, die keiner der Lösungswege erreicht hatte. Der Strahl endet an der noch trüben Glaskugel, er wirft (mit der Acht der Stäbe) einen geraden Lichtstab an die Wand oder (mit der Mondsichel) eine Sichel. Damit sind alle sieben Varianten des Spiels zu sehen.
- Der Gartenroller steht jetzt auch unter dem Stammbaum (Family Tree), wenn man ihn dorthin fährt.
- Hinter dem Gartenhaus erscheint das Loch in der Bretterwand, sobald das Brett offen ist.
- Auf der Insel Pharos sieht man den Schlüssel im Gang unter dem Gitter, bis man ihn holt.
- In der Spirit World altert das Grab sichtbar, so wie der Text es beschreibt: mit jedem Jahrhundert mehr Risse, Staub und verblasste Farbe.
- Die Stäbe im Bogen des Infinity Symbol lassen sich auch aus jeder Zahlenangabe des Textes ablesen. Austin sitzt in Alexandria auf dem Damm statt im Wasser.

### 32. Seltene Zustände und Garvins Fehlerliste (13. November 2026)
Aus den Bedingungen im Quelltext ließen sich gezielt Zustände herstellen, die man nur auf Umwegen erreicht. Jeder wurde einzeln im Spiel nachgestellt und angesehen.
- Neben der Mauer (Beside the Wall): Wenn man den Strauch beiseiteschiebt, liegt da eine Holzluke. Geschlossen sieht man nur den Deckel, geöffnet den dunklen Fassschacht und den aufgeklappten Deckel daneben.
- Weinkeller: Ist die Luke oben offen, fällt Tageslicht durch den Schacht herein, so wie der Text es sagt.
- This Is The Death: Der Gang endet in einer Marmorwand, bis die Grabkammer darunter offen ist. Danach öffnet er sich.
- Dienstbotenzimmer: Wer über die Dienstbotentreppe kommt, sieht die schmale Tür in der Nordwand offen stehen.
- Garvins Fehlerliste zu Release 16 wurde durchgesehen. Ein Fehler betrifft die Bedienung: Sobald ein Stab einen Namen hat, passt „featureless“ immer noch auf ihn, und das Spiel fragt endlos, welcher Stab gemeint ist. Das Inventarmenü gibt deshalb selbst die Antwort, die das Spiel annimmt („a featureless mahogany rod“). Getippte Befehle bleiben, wie das Spiel sie behandelt.
- Die übrigen Punkte der Liste ändern nichts am Bild. Der Kohlenbunker lässt sich von außen nie aufschließen, das Bild folgt dem Spielzustand. Der doppelt gezählte Stein ergibt am Ende 554 von 550 Punkten, auch auf dem Lösungsweg. Die Anzeige zeigt einfach die Zahl des Spiels.

### 33. Wenn das Spiel endet (13. November 2026)
- Endet das Spiel mit etwas anderem als dem Sieg, wird das Raumbild langsam dunkel und farblos. Das gilt für alle Enden.
- Zwölf auffällige Enden haben ein eigenes Bild, gezeichnet nach dem, was der Schlusstext sagt, schemenhaft und eher komisch: das geplatzte Rohr in der Bibliothek, der Bär im Dunkeln, die zusammenrückenden Wände, Zeus' Blitz, der unglaubliche Zufall (Meteorit, Erdbeben, Vulkan, Blitz oder Speere, je nach Text), der Krake vor Andromedas Felsen, Feuer, die explodierende Bombe, das Gefängnis nach dem Griff zur Bombe, der Sturz vom Fahnenmast, der Geist auf den Zinnen und die Verbannung nach Australien.
- Das Bild bleibt, solange das Spiel nach RESTART, RESTORE oder UNDO fragt, und verschwindet mit dem nächsten Zug, etwa nach „undo“.
- Elf der zwölf Enden wurden im laufenden Spiel ausgelöst und geprüft. Der Bär ließ sich nicht herbeiführen, weil das Spiel fast jeden Schritt im Dunkeln als „Too risky“ ablehnt. Sein Bild ist nur einzeln geprüft.

### Offen
- Einzelne aus der Beschreibung zusammengesetzte Räume bei Bedarf von Hand nachzeichnen.
<!-- /verlauf -->
