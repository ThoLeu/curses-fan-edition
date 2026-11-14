// Interface language: German (source) and English. Game text itself is never translated.
(function (root) {
'use strict';
const EN = {
  // start screen (title page)
  'Ein Textadventure von Graham Nelson · 1993': 'A text adventure by Graham Nelson · 1993',
  'Ein Dachboden, eine verlorene Karte von Paris und ein Familienfluch.': 'An attic, a lost map of Paris and a family curse.', 'Der Dachboden von Meldrew Hall': 'The attic of Meldrew Hall',
  'Lade': 'Download', 'kostenlos aus dem IF Archive.': 'for free from the IF Archive.', 'kostenlos aus dem IF Archive': 'for free from the IF Archive', '– oder': '– or', 'Leg die Datei hier ab oder wähle sie aus.': 'Drop the file here or choose it.', 'Such die Karte. Und vielleicht noch etwas mehr.': 'Look for the map. And perhaps a little more.',
  '▶ Spielen': '▶ Play', 'Spielweise': 'How to play', 'Lädt': 'Loads', 'kostenlos aus dem': 'for free from the', 'oder mit eigener Datei': 'or with your own file', 'curses.z5 herunterladen': 'download curses.z5',
  'Direkt laden ging hier nicht – der Browser oder das IF Archive lässt es von dieser Seite aus nicht zu. Lade die Datei über den Link „curses.z5 herunterladen“ herunter und leg sie hier ab.': 'Loading directly did not work here: the browser or the IF Archive does not allow it from this page. Download the file with the link below and drop it here.',
  'curses.z5 hier ablegen': 'Drop curses.z5 here', 'Andere Story-Datei laden': 'Load another story file', 'oder klicken, um die Datei auszuwählen': 'or click to choose the file',
  'Illustriert': 'Illustrated', 'Raumbilder, Musik, Karte und Inventar.': 'Room pictures, music, map and inventory.', 'Klassisch': 'Classic', 'Wie 1993: nur Text, Leuchtschrift, keine Hilfen.': 'Like 1993: text only, glowing letters, no aids.',
  'Mit Hilfen': 'With aids', 'Übersetzungsspalte, deutsche Befehle, Hinweise.': 'Translation column, German commands, hints.', 'Übersetzungsspalte': 'Translation column', '♫ Stimmung anhören': '♫ Hear the mood', '■ Hörprobe stoppen': '■ Stop the preview',
  'Fehler gefunden oder eine Idee?': 'Found a bug or have an idea?', 'Rückmeldung auf GitHub': 'Feedback on GitHub', '(mit einem kostenlosen GitHub-Konto).': '(with a free GitHub account).',
  'Über das Spiel:': 'About the game:', 'von Graham Nelson (1993) ist Freeware und eines der Spiele, mit denen die Programmiersprache Inform bekannt wurde.': 'by Graham Nelson (1993) is freeware and one of the games that made the Inform language known.',
  'Ein inoffizieller Fan-Spieler, nicht von Graham Nelson. Das Spiel bleibt sein Werk: Du lädst deine eigene Kopie, diese Seite enthält keinen Text daraus. Andere Z-Code-Spiele (Version 3 bis 5) laufen auch, nur ohne die Curses-Extras.': 'An unofficial fan-made player, not by Graham Nelson. The game remains his work: you load your own copy, and this page contains no text from it. Other Z-code games (versions 3 to 5) also run, just without the Curses extras.',
  '▶ Weiterspielen': '▶ Continue', '▶ Spielen': '▶ Play', 'Neues Spiel': 'New game', 'Zuletzt gespielt': 'Last played', 'Punkte': 'points', 'Züge': 'turns', 'zuletzt': 'last played', 'Trotzdem spielen': 'Play anyway',
  '✓ Erkannt: Curses, Release 16, alles bereit: Bilder, Karte, Hilfe': '✓ Recognised: Curses, release 16, all set: pictures, map, help',
  'Erkannt: Curses, aber eine andere Version. Es läuft, die eigenen Raumbilder, die Hilfe und einige Zustandsbilder sind aber für Release 16 gemacht.': 'Recognised: Curses, but a different release. It runs, but the room pictures, help and some state pictures are made for release 16.',
  'Das ist nicht Curses. Das Spiel läuft trotzdem, nur ohne die Curses-Extras (eigene Raumbilder, Hilfe, Zustandsbilder).': 'This is not Curses. The game still runs, just without the Curses extras (room pictures, help, state pictures).',
  'Die Datei wird geladen …': 'Loading the file …',
  // start screen
  'mit Karte': 'with map', 'Ein Interpreter für klassische Textadventures im Z-Code-Format (Version 3 bis 5), gebaut für': 'An interpreter for classic Z-code text adventures (versions 3 to 5), built for',
  'von Graham Nelson. Das Spiel selbst bringst du mit: Die Datei': 'by Graham Nelson. You bring the game itself: the file', 'gibt es kostenlos im': 'is free from the',
  'Story-Datei hier ablegen': 'Drop the story file here', 'oder klicken, um eine .z5-Datei auszuwählen': 'or click to choose a .z5 file',
  'Minimap, die sich selbst zeichnet': 'A map that draws itself', 'Ein Bild für jeden Raum': 'A picture for every room', 'Musik je nach Stimmung': 'Music that follows the mood', 'Speichern und Undo': 'Saving and undo',
  'Zuletzt geladen:': 'Last loaded:', 'Weiterspielen': 'Continue', 'Von vorn beginnen': 'Start over', 'Weiterspielen, wo ich war': 'Continue where I left off', 'Neu starten': 'Restart',
  'Das sieht nicht nach einer Z-Code-Datei (Version 3–5) aus.': 'This does not look like a Z-code file (version 3–5).',
  // header & panels
  'Bild & Karte': 'Picture & map', 'Bild &amp; Karte': 'Picture & map', '🔊 Vorlesen': '🔊 Read aloud', '■ Stopp': '■ Stop', '♫ Musik aus': '♫ Music off', '♫ Musik an': '♫ Music on', 'Kein Audio': 'No audio',
  '💾 Spielstände': '💾 Saves', '💡 Hilfe': '💡 Help', 'Das Spiel wartet auf einen Tastendruck:': 'The game is waiting for a key press:', 'Leertaste': 'Space',
  'Karte': 'Map', 'Inventar': 'Inventory', 'Notizen': 'Notes', 'Zentrieren': 'Centre', 'Karte leeren': 'Clear map', 'Wirklich leeren?': 'Really clear?', 'Sicher?': 'Sure?',
  'Tippe auf einen Gegenstand für passende Aktionen.': 'Tap an item for suitable actions.', 'Zu diesem Raum:': 'About this room:', 'Allgemeine Notizen': 'General notes',
  'Letzte Antwort des Spiels vorlesen': 'Read the game’s last reply aloud', 'Vorlesen beenden': 'Stop reading', 'Letzten Zug zurücknehmen (UNDO)': 'Take back the last move (UNDO)',
  'Spielstände, Export, Import, Transkript': 'Saves, export, import, transcript', 'Optionale Hinweise, schrittweise aufdeckbar': 'Optional hints, revealed step by step', 'Einstellungen': 'Settings',
  'Was tust du?': 'What do you do?', 'Drück eine Taste …': 'Press a key …', 'Karte wählen': 'Choose map', 'Herauszoomen': 'Zoom out', 'Hineinzoomen': 'Zoom in',
  'Was ist dir hier aufgefallen?': 'What did you notice here?', 'Rätsel, Ideen, Inschriften …': 'Puzzles, ideas, inscriptions …', 'Schließen': 'Close', 'Lautstärke': 'Volume', 'Stimme': 'Voice',
  'Name des Spielstands': 'Name of the save', 'Exportierten Spielstand hier einfügen': 'Paste an exported save here', 'Hilfe schließen': 'Close help', 'Diesen Abschnitt vorlesen': 'Read this passage aloud',
  // settings
  'Darstellung': 'Display', 'Schriftgröße': 'Font size', 'Zeilenbreite': 'Line width', 'schmal': 'narrow', 'mittel': 'medium', 'breit': 'wide', 'Farbschema': 'Colour scheme',
  'Dunkel (Pergament)': 'Dark (parchment)', 'Hell (Papier)': 'Light (paper)', 'Klassischer Modus': 'Classic mode', 'wie ein Terminal von 1993, ohne Bilder, Musik und Hilfen': 'like a 1993 terminal, without pictures, music or aids',
  'Terminalfarbe': 'Terminal colour', 'Bernstein': 'Amber', 'Grün': 'Green', 'Weiß': 'White', 'Eingabehilfen': 'Input aids', 'Wörter antippen': 'Tap words',
  'ein Klick auf ein Wort im Text schlägt Befehle vor': 'clicking a word in the text suggests commands', 'Bekannte Wege als Knöpfe': 'Known exits as buttons', 'Autovervollständigung': 'Autocomplete',
  'nur Wörter, die schon im Text vorkamen': 'only words that have already appeared', 'Punkteanzeige': 'Score pop-up', 'kurzes „+5“, wenn der Punktestand steigt': 'a brief “+5” when the score goes up',
  'Klang': 'Sound', 'Grusel-Stärke': 'Creepiness', 'von unaufdringlich bis unheimlich': 'from unobtrusive to eerie', 'unaufdringlich': 'unobtrusive', 'unheimlich': 'eerie', 'Musik-Lautstärke': 'Music volume', 'Geräusche': 'Sound effects', 'Luken, Gegenstände, Regen, Glocken, Brandung': 'hatches, items, rain, bells, surf', 'Geräusch-Lautstärke': 'Effects volume',
  'Vorlese-Stimme': 'Reading voice', 'Sprechtempo': 'Speaking rate', 'Spiel': 'Game', 'Von vorn beginnen oder andere Story-Datei laden': 'Start over or load another story file', 'Datei…': 'File…',
  'Sprache': 'Language', 'Sprache & Eingabe': 'Language & input', 'Oberfläche, Hilfe und Hinweise': 'interface, help and hints', 'Schlauer Parser': 'Smart parser', 'versteht Tippfehler und andere Formulierungen, ohne Züge zu verbrauchen': 'understands typos and other phrasings without using up turns',
  'Deutsche Befehle verstehen': 'Understand German commands', 'zum Beispiel „nimm das Buch“ oder „geh nach Norden“': 'for example “nimm das Buch” or “geh nach Norden”',
  // saves
  'Spielstände': 'Saves', 'Jetzt speichern': 'Save now', 'Export': 'Export', 'Kopieren': 'Copy', 'Als Datei speichern': 'Save as file', 'Auf einem anderen Gerät: Spielstände öffnen und den Text unten bei „Importieren“ einfügen.': 'On another device: open Saves and paste the text under “Import”.',
  'Importieren': 'Import', 'Datei wählen': 'Choose file', 'Transkript': 'Transcript', 'Das bisherige Spielprotokoll als Text, zum Nachlesen oder Aufheben.': 'The game so far as text, to reread or keep.', 'Transkript anzeigen': 'Show transcript',
  'Laden': 'Load', 'Exportieren': 'Export', 'Löschen': 'Delete', 'Löschen?': 'Delete?', 'Noch keine Spielstände.': 'No saves yet.', 'Kopiert ✓': 'Copied ✓', 'Markiert, mit Strg+C kopieren': 'Selected, copy with Ctrl+C',
  'Speichern abgebrochen': 'Saving cancelled', 'Speichern und Laden geht, sobald das Spiel auf eine Eingabe wartet.': 'Saving and loading work once the game is waiting for input.',
  'Importiert. Der Spielstand steht oben in der Liste.': 'Imported. The save is at the top of the list.', 'Das ist kein gültiger Spielstand-Text.': 'This is not a valid save text.',
  'Das ist kein Spielstand aus dem Z-Spieler.': 'This is not a save from the Z-Spieler.', 'Dieser Spielstand gehört zu einer anderen Story-Datei': 'This save belongs to a different story file', 'Spielstand': 'Save', 'jetzt': 'now', '(importiert)': '(imported)',
  // help
  'Hilfe': 'Help', 'Hier verrät nichts mehr, als du willst. Jede Frage hat mehrere Stufen: Klick auf': 'Nothing here gives away more than you want. Each question has several steps: click',
  'Stufe 1': 'Step 1', 'für einen sanften Schubs, die nächsten Stufen werden deutlicher. Die Hinweise sind auf Deutsch, Befehle stehen in der englischen Form, die das Spiel versteht.': 'for a gentle nudge; the next steps get more explicit. Commands are given in the English form the game understands.',
  'Mehr Hilfe': 'More help', 'InvisiClues für Curses': 'InvisiClues for Curses', 'von Brian Rushton (intfiction.org): ausführliche, gestufte Hinweise für das ganze Spiel, auf Englisch.': 'by Brian Rushton (intfiction.org): detailed, graded hints for the whole game.',
  'Komplettlösung mit Karten': 'Full walkthrough with maps', 'von David Welbourn: vollständige Lösung für Release 16. Achtung, Spoiler.': 'by David Welbourn: complete solution for release 16. Spoilers!',
  'Curses bei der IFDB': 'Curses on IFDB', ': Infos, Rezensionen und weitere Lösungen.': ': information, reviews and more solutions.', 'Im Spiel selbst:': 'In the game itself:', 'öffnet Graham Nelsons eigenes Infomenü mit Anleitung und Befehlsübersicht.': 'opens Graham Nelson’s own menu with instructions and a list of commands.',
  'Stufe': 'Step', ' (Lösung)': ' (solution)',
  'Allgemein': 'General', 'Dachboden': 'Attic', 'Keller': 'Cellars',
  'Wie gebe ich Befehle ein?': 'How do I enter commands?',
  'Das Spiel versteht englische Befehle in der Form „Verb Gegenstand“, also zum Beispiel <code>take book</code> oder <code>open door</code>.': 'The game understands English commands of the form “verb object”, for example <code>take book</code> or <code>open door</code>.',
  'Die wichtigsten Kürzel: <code>l</code> (look, Raum ansehen), <code>x ding</code> (examine, untersuchen), <code>i</code> (Inventar), Richtungen als <code>n s e w ne nw se sw u d in out</code>.': 'The main abbreviations: <code>l</code> (look), <code>x thing</code> (examine), <code>i</code> (inventory), directions as <code>n s e w ne nw se sw u d in out</code>.',
  'Untersuche alles, was im Text vorkommt. In Curses stecken die Hinweise fast immer in den Beschreibungen. Mit <code>undo</code> nimmst du einen Zug zurück.': 'Examine everything the text mentions. In Curses the clues are almost always in the descriptions. <code>undo</code> takes back a move.',
  'Kann ich mich festspielen?': 'Can I get myself stuck?', 'Ja. Curses gilt als gnadenlos: Man kann sich den Sieg verbauen, ohne es sofort zu merken.': 'Yes. Curses is known as merciless: you can make the game unwinnable without noticing straight away.',
  'Speichere regelmäßig und nutze dafür abwechselnd die drei Speicherplätze oben. Dann kannst du zu einem älteren Stand zurück, falls du in einer Sackgasse steckst.': 'Save often and keep several saves. Then you can go back to an older one if you end up in a dead end.',
  'Wo ist es zu dunkel?': 'Where is it too dark?', 'Du trägst von Anfang an eine Taschenlampe bei dir.': 'You carry a torch from the very start.', 'Mit <code>turn on torch</code> schaltest du sie ein. Dunkle Ecken des Dachbodens werden damit sichtbar.': '<code>turn on torch</code> switches it on and makes the dark corners of the attic visible.',
  'Soll ich durch die offene Falltür nach unten?': 'Should I go down through the open trapdoor?', 'Denk daran, wer unten ist: die Familie, mitten im Kofferpacken.': 'Remember who is down there: the family, busy packing.',
  'Wer durch die Falltür hinuntergeht, gibt die Suche auf, und das Spiel ist sofort zu Ende. Bleib oben und such einen anderen Weg.': 'Going down through the trapdoor means giving up the search, and the game ends at once. Stay up here and find another way.',
  'Wie komme ich sonst vom Dachboden weg?': 'How else do I get out of the attic?', 'Es gibt noch einen Weg nach unten, der eigentlich nicht für Menschen gedacht ist.': 'There is another way down that was not really meant for people.',
  'Schau dich im Lagerraum östlich der alten Weinkammer um. Dort hängt etwas in einem Schacht.': 'Look around the storage room east of the old winery. Something hangs in a shaft there.',
  'Steig in den Speiseaufzug (<code>enter dumbwaiter</code>) und zieh an den Seilen (<code>pull ropes</code>). Die Fahrt ist ruppig, endet aber im Keller.': 'Get into the dumbwaiter (<code>enter dumbwaiter</code>) and pull the ropes (<code>pull ropes</code>). The ride is rough but ends in the cellars.',
  'Das große Rad im Lagerraum dreht sich nicht.': 'The big wheel in the storage room will not turn.', 'Mit roher Kraft kommst du hier nicht weiter. Sieh es dir genauer an.': 'Brute force will not help here. Look at it more closely.',
  'Beim Untersuchen (<code>x wheel</code>) entdeckst du eine schlecht versteckte Sicherung am Rad. Der Schraubenschlüssel daneben passt übrigens nicht darauf.': 'Examining it (<code>x wheel</code>) reveals a poorly hidden safety catch. The wrench next to it does not fit, by the way.',
  'Wozu ist das kleine Buch im Dienstbotenzimmer?': 'What is the little book in the servant’s room for?', 'Nimm es und lies es.': 'Take it and read it.',
  'Es ist ein Nachschlagewerk zur klassischen Mythologie. Behalte es: Wenn dir später Götter und Sagengestalten begegnen, kannst du darin nachschlagen.': 'It is a reference work on classical mythology. Keep it: when you meet gods and legendary figures later, you can look them up.',
  'Der Glasballon mit dem Stadtplan geht nicht auf.': 'The glass demijohn with the map will not open.', 'Mit Gewalt geht es nicht. Er ist aus robustem Laborglas und steht fest am Boden.': 'Force does not work. It is made of tough laboratory glass and fixed to the floor.',
  'Lies das Etikett. Wie du an den Inhalt kommst, löst sich erst später im Spiel. Ausführliche Hinweise dazu findest du unten unter „Mehr Hilfe“.': 'Read the label. How to get at what is inside is solved later in the game. Detailed hints are under “More help” below.',
  'Was hat es mit dem Roboter in der Ecke auf sich?': 'What about the robot in the corner?', 'Untersuch ihn genau. Jemand hat sich vor Kurzem an ihm zu schaffen gemacht.': 'Examine it closely. Someone has been tinkering with it recently.',
  'Du kannst die Robotermaus mitnehmen (<code>take mouse</code>). Sie einfach in das Loch im Südkeller zu stecken, bringt allerdings noch nichts. Behalte sie im Hinterkopf.': 'You can take the robot mouse (<code>take mouse</code>). Simply putting it into the hole in the south cellar does nothing yet. Keep it in mind.',
  'Die eisenbeschlagene Tür im Westkeller ist verschlossen.': 'The ironbound door in the west cellar is locked.', 'Ja, sie ist abgeschlossen. Erinnerst du dich an einen Schlüssel, der irgendwo hinuntergefallen ist?': 'Yes, it is locked. Remember a key that fell down somewhere?',
  'Für diese Tür findest du ausführliche Hinweise unter „Mehr Hilfe“. Ein Tipp vorweg: Das Fensterchen im Hauptkeller verrät beim Untersuchen einen goldenen Schimmer.': 'Detailed hints for this door are under “More help”. One tip: examining the little window in the main cellar shows a golden glow.',
  'Gibt es im Spiel selbst eine Auskunft?': 'Is there a help desk in the game itself?', 'Ja, und zwar an einem Ort, den man nicht unbedingt freiwillig betritt.': 'Yes, in a place you would not necessarily visit by choice.',
  'Die goldene Treppe im Westkeller (<code>s</code>) führt hinab zu einem sehr höflichen Dämon mit einem Auskunftsschalter.': 'The golden staircase in the west cellar (<code>s</code>) leads down to a very polite demon with an information desk.',
  'Frag ihn mit <code>ask demon about …</code>. Pro Besuch gibt es nur einen Hinweis. Für den nächsten musst du einmal hinausgehen und wiederkommen. Nicht jedes Thema darf er beantworten.': 'Ask him with <code>ask demon about …</code>. There is only one hint per visit; leave and come back for the next one. He may not answer every topic.',
  'Der Spielstand passt nicht mehr in den Browser-Speicher. Lösche unter „Spielstände“ ein paar alte Stände oder exportiere sie.': 'The browser storage is full, so the game could not be saved. Delete or export a few old saves under “Saves”.',
  'Komplettlösung vorführen': 'Play the walkthrough', 'Komplettlösung wählen …': 'Choose walkthrough …', '▶ Komplettlösung': '▶ Walkthrough', 'Gemächlich': 'Leisurely', 'Normal': 'Normal', 'Schnell': 'Fast', 'Turbo': 'Turbo', '■ Beenden': '■ Stop', 'Weiter': 'Continue', 'Pause': 'Pause', 'Ein Zug weiter': 'One move', 'Tempo': 'Speed',
  'Die Vorführung ist zu Ende. Mit „Beenden“ kommst du zurück zu deinem eigenen Spiel.': 'The demo is over. “Stop” takes you back to your own game.',
  'Vorführung der Komplettlösung: Das Spiel spielt sich selbst. Dein eigener Spielstand bleibt unberührt.': 'Walkthrough demo: the game plays itself. Your own saved game is left untouched.',
  'Lade zuerst die Story-Datei curses.z5, dann die Komplettlösung.': 'Load the story file curses.z5 first, then the walkthrough.',
  'Komplettlösung wird vorbereitet …': 'Preparing the walkthrough …', 'Diese Datei sieht nicht nach der Komplettlösung für Curses aus.': 'This file does not look like the walkthrough for Curses.',
  'Lass dir das ganze Spiel vorspielen: Wähle die Textdatei der Komplettlösung (zum Beispiel': 'Watch the whole game being played: choose the text file of the walkthrough (for example',
  '), dann startet ein eigenes Vorführ-Spiel, das sich Zug für Zug selbst spielt, mit Bildern, Karte und Musik. Tempo, Pause und Einzelschritte stellst du unten ein. Dein eigener Spielstand bleibt dabei unberührt.': '). A separate demo game then plays itself move by move, with pictures, map and music. Speed, pause and single steps are set below. Your own saved game is left untouched.',
  'Gemütlich': 'Cosy',
  'Höhe': 'Heights',
  'Kälte': 'Chill',
  'Gewölbe': 'Vaults',
  'Geheimnis': 'Mystery',
  'Garten': 'Garden',
  'Irrgarten': 'Maze',
  'Dorf': 'Village',
  'Meer': 'Sea',
  'Anderswelt': 'Otherworld',
  'Schatten': 'Shadows',
  'Himmel': 'Heaven',
  'Stimmung der Musik': 'Mood of the music',
  'von sphärisch bis düster': 'from ethereal to dark',
  'sphärisch': 'ethereal',
  'düster': 'dark',
  'von dir hierher gebracht': 'brought here by you', 'Hier abgelegt:': 'Left here:', 'Hinweise in [eckigen Klammern] vorlesen': 'Read notes in [square brackets] aloud', 'zum Beispiel „[Your score has just gone up …]“': 'for example “[Your score has just gone up …]”', 'Alles zurücksetzen': 'Reset everything', 'löscht in diesem Browser alle Einstellungen, Spielstände, Karte, Notizen und die gespeicherte Spieldatei – danach startet die Seite wie beim ersten Besuch': 'deletes all settings, saved games, the map, notes and the stored story file in this browser – the page then starts as on a first visit', 'Wirklich alles löschen?': 'Really delete everything?', 'für den englischen Spieltext': 'for the English game text', 'Stimme für die Übersetzung': 'Voice for the translation', 'passend zur Zielsprache der Übersetzungsspalte': 'matching the language of the translation column', 'automatisch': 'automatic', 'keine Stimme für diese Sprache': 'no voice for this language', 'Übersetzung vorlesen': 'Read the translation aloud', 'Letzte Übersetzung vorlesen': 'Read the latest translation aloud', 'Keine passende Stimme für diese Sprache gefunden – es liest die Standardstimme.': 'No voice for this language found – the default voice is reading.', 'Wo werden die Spielstände gespeichert?': 'Where are the saved games kept?', 'Nur hier im Browser, auf diesem Gerät (im lokalen Speicher des Browsers) – nichts geht an einen Server. Dazu gehören auch der automatische Spielstand nach jedem Zug, die Karte und deine Notizen.': 'Only here in the browser, on this device (in the browser’s local storage) – nothing is sent to a server. That includes the automatic save after every move, the map and your notes.', 'Jede Adresse hat ihren eigenen Speicher: Auf GitHub Pages, in der Ansicht bei Claude und in einer heruntergeladenen Datei siehst du jeweils andere Spielstände, ebenso in einem anderen Browser oder auf einem anderen Gerät.': 'Each address has its own storage: on GitHub Pages, in the view on Claude and in a downloaded file you see different saved games, and the same goes for another browser or device.', 'Verloren gehen sie, wenn du die Browserdaten für die Seite löschst; in einem privaten Fenster bleiben sie nur bis zum Schließen. Zum Sichern oder Mitnehmen: einen Spielstand exportieren und den Text oder die Datei aufheben.': 'They are lost if you clear the browser data for the page; in a private window they only last until you close it. To keep a copy or take it elsewhere: export a saved game and keep the text or the file.', 'README des Autors': "author's README", 'direkt von dort laden': 'load it straight from there', 'Lade aus dem IF Archive …': 'Loading from the IF Archive …', 'Direkt laden ging hier nicht – der Browser oder das IF Archive lässt es von dieser Seite aus nicht zu. Lade die Datei über den Link in Schritt 1 herunter und leg sie hier ab.': 'Loading it directly did not work here – the browser or the IF Archive does not allow it from this page. Download the file with the link in step 1 and drop it here.', 'Zum Schließen klicken': 'Click to close',
  'Ziehen zum Verschieben': 'Drag to move',
  'Klick: untersuchen': 'Click: examine', 'Was tust du? (auf Deutsch)': 'What do you do? (in German)', 'Deutsche Eingabe': 'German input', 'Namen im Bild': 'Names in the picture', 'beim Darüberfahren mit der Maus; ein Klick untersucht den Gegenstand': 'when hovering with the mouse; a click examines the item', 'Übersetzung': 'Translation', '🌐 Übersetzung': '🌐 Translation', 'Spieltext in einer eigenen Spalte übersetzen lassen': 'Have the game text translated in a separate column', 'Wie übersetze ich?': 'How do I translate?', 'Falls dein Browser keine eingebaute Übersetzung anbietet: Nutze seine Übersetzen-Funktion, zum Beispiel per Rechtsklick → „Übersetzen“. Übersetzt wird dann nur diese Spalte, das Original bleibt englisch.': 'If your browser has no built-in translation: use its translate feature, for example right-click → “Translate”. Only this column is translated; the original stays in English.', 'Spieltext in einem eigenen Feld übersetzen lassen': 'Have the game text translated in a separate panel', 'Zielsprache': 'Target language', 'Automatisch übersetzen': 'Translate automatically', 'Übersetzung aus': 'Stop translating',
  'Falls dein Browser keine eingebaute Übersetzung anbietet: Nutze seine Übersetzen-Funktion, zum Beispiel per Rechtsklick → „Übersetzen“. Übersetzt wird dann nur dieses Feld, das Original bleibt englisch.': 'If your browser has no built-in translation: use its translate feature, for example right-click → “Translate”. Only this panel is translated; the original stays in English.',
  'Hier erscheinen die Antworten des Spiels zum Übersetzen.': 'The game’s replies appear here for translation.', 'Sprachmodell wird geladen …': 'Loading language model …', 'übersetzt automatisch': 'translating automatically',
  'Dein Browser bietet keine eingebaute Übersetzung an. Nutze seine Übersetzen-Funktion (siehe unten).': 'Your browser offers no built-in translation. Use its translate feature (see below).', 'Diese Sprachkombination wird nicht unterstützt.': 'This language pair is not supported.', 'Übersetzung fehlgeschlagen': 'Translation failed',
  // dynamic texts
  'Spiel fortgesetzt.': 'Game resumed.', 'Automatischer Spielstand ließ sich nicht laden, das Spiel startet neu.': 'The automatic save could not be loaded; the game starts afresh.',
  'Das Spiel ist beendet. Über „Neu starten“ geht es von vorn los.': 'The game has ended. “Restart” (in Settings) begins again.', 'Der Interpreter ist auf einen Fehler gestoßen: ': 'The interpreter ran into an error: ',
  'übersetzt: ': 'translated: ', 'verstanden als: ': 'understood as: ', 'Ohne Region': 'No region', 'Umbenennen': 'Rename', '● = hier bist du gerade': '● = you are here',
  'Die Karte zeichnet sich, sobald du dich bewegst.': 'The map draws itself as you move.', 'Du trägst nichts bei dir.': 'You are carrying nothing.', 'geschlossen': 'closed', 'zuletzt gesehen': 'last seen',
  ' (zuletzt gesehen, als der Behälter offen war)': ' (last seen when the container was open)', 'Tab übernimmt': 'Tab accepts', 'Punkt': 'point', 'Punkte': 'points', 'Notizen zu anderen Räumen': 'Notes on other rooms',
  'Bekannte Wege:': 'Known exits:', 'nach': 'to', 'in Eingabe übernehmen': 'put in the input line', '↑ hoch': '↑ up', '↓ runter': '↓ down', 'rein': 'in', 'raus': 'out', 'O': 'E', 'NO': 'NE', 'SO': 'SE',
  'Haus': 'House', 'Dunkel': 'Dark', 'Natur': 'Nature', 'Wasser': 'Water', 'Sakral': 'Sacred', 'Antike': 'Antiquity', 'Traum': 'Dream', 'Stadt': 'City', 'Dunkelheit': 'Darkness', '… stockfinster …': '… pitch dark …',
  'Platz': 'Slot', '(alt)': '(old)', 'Spielstand „': 'Save “', '“': '”', 'Das Spiel hat das nicht verstanden.': 'The game did not understand that.'
};
let lang = 'de';
const T = s => (lang === 'en' && EN[s] !== undefined) ? EN[s] : s;
const SKIP = '#transcript, #status, #overlay, #mapSvg, #invList, #saveList, #noteOthers, #hintList, #pop, #acBox, #exitBar, #roomName, #xferText, #impText, #noteRoom, #noteGeneral, #voiceSel, #sheetMenu, #resumeName';
function applyLang(l) {
  lang = l === 'en' ? 'en' : 'de';
  document.documentElement.lang = lang;
  const walk = el => {
    for (const n of el.childNodes) {
      if (n.nodeType === 3) {
        if (n.__de === undefined) n.__de = n.textContent;
        const raw = n.__de, key = raw.replace(/\s+/g, ' ').trim();
        if (!key) continue;
        const tr = T(key);
        n.textContent = tr === key ? raw : raw.replace(key, tr).replace(raw.replace(/\s+/g, ' ').trim(), tr);
        if (lang === 'de') n.textContent = raw;
      } else if (n.nodeType === 1 && !n.matches(SKIP)) {
        for (const a of ['title', 'placeholder', 'aria-label']) if (n.hasAttribute(a)) { const k = 'data-de-' + a; if (!n.hasAttribute(k)) n.setAttribute(k, n.getAttribute(a)); n.setAttribute(a, T(n.getAttribute(k))); }
        walk(n);
      }
    }
  };
  walk(document.body);
}
const api = { T, applyLang, lang: () => lang, EN };
root.ZI18n = api; root.T = T;
})(window);
