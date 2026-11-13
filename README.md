# Curses · an illustrated interpreter

An illustrated Z-machine interpreter for Graham Nelson’s 1993 text adventure *Curses*, playable in the browser, with original room illustrations, an automatic map, generative music, inventory icons, translation help and a smart parser. No game text included – load your own `curses.z5`. Everything in a single HTML file, ready to play.

**Spielen / Play:** [index.html](index.html) (über GitHub Pages: `https://tholeu.github.io/curses-fan-edition/`)

Du brauchst deine eigene Spieldatei `curses.z5`. Sie ist nicht in diesem Repository enthalten; du bekommst sie kostenlos im [IF Archive](https://ifarchive.org/if-archive/games/zcode/curses.z5) (siehe die [README des Autors](https://ifarchive.org/if-archive/games/zcode/curses_rel16.txt)), oder du lässt die Startseite sie direkt von dort laden. / You need your own story file `curses.z5`; it is not part of this repository. Get it free from the [IF Archive](https://ifarchive.org/if-archive/games/zcode/curses.z5) (see the [author's README](https://ifarchive.org/if-archive/games/zcode/curses_rel16.txt)), or let the start page load it from there.

*Curses* © Graham Nelson. The game is free and may be distributed without profit, as its README says; this interpreter is a separate, unofficial player and does not include it.

## Aktuelle Version

26-11-13-1712 – Abgleich mit dem rekonstruierten Quelltext

## Ältere Versionen

- [26-11-13-1658](archiv/26-11-13-1658.html) – Dinge, die man schiebt
- [26-11-13-1549](archiv/26-11-13-1549.html) – Startbildschirm mit Spielen-Knopf
- [26-11-13-1541](archiv/26-11-13-1541.html) – Inventar wie im Spiel

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

### 19. Der Diaprojektor (12. November 2026)
- Souvenirs Room: Die Südwand zeigt jetzt, was der Projektor tatsächlich wirft – dunkel, wenn er aus ist, weißes Licht ohne Dia, und sonst das Bild im Schlitz: die jeweilige Tarotkarte (ganz und hochkant, leicht durchscheinend wie ein Dia), die Miniatur der Folly (hochkant, so groß wie eine Spielkarte) oder die Skizze des Palasts von Alexandria (quer), alle leicht durchscheinend. Nach dem Drehen am Rad schießt der Strahl rückwärts aus dem Projektor.
- Disused Observatory: Der Strahl kommt von Süden, trifft die Glaskugel und fällt auf das Tierkreiszeichen, das der Text nennt.
- Dafür kennen die Bilder jetzt auch, was eingeschaltet ist und was in einem Behälter steckt.

### 20. Gegenstände verändern Räume (13. November 2026)
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

### Offen
- Einzelne aus der Beschreibung zusammengesetzte Räume bei Bedarf von Hand nachzeichnen.
<!-- /verlauf -->
