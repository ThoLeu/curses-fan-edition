// Builds index.html from template.html and the scripts: node build.js
const fs=require('fs');
let t=fs.readFileSync('template.html','utf8');
const inc=(k,f)=>{t=t.replace(`/*${k}*/`,()=>fs.readFileSync(f,'utf8').replace(/<\/script/gi,'<\\/script'));};
inc('I18N','i18n.js');inc('ZMACHINE','zmachine.js');inc('PARSER','parser.js');inc('BESPOKE','bespoke.js');inc('BESPOKE2','bespoke2.js');inc('BESPOKE3','bespoke3.js');inc('GENTEXT','gentext.js');inc('GENERIC','generic.js');inc('GENPARTS','genparts.js');inc('GENLAND','genland.js');inc('CLOSEUP','closeup.js');inc('ENDINGS','endings.js');inc('ART','art.js');inc('ICONS','icons.js');inc('PEOPLE','people.js');inc('DEMO','demo.js');inc('MUSIC','music.js');inc('APP','app.js');inc('FEATURES','features.js');
// the build's version, as YY-MM-DD-HHMM Berlin time: shown small next to the title
{ const P = Object.fromEntries(new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).map(p => [p.type, p.value]));
  const stamp = `${P.year}-${P.month}-${P.day}-${P.hour}${P.minute}`; t = t.split('__BUILDSTAMP__').join(stamp); fs.writeFileSync('stamp.txt', stamp); }
fs.writeFileSync('index.html',t);
// optional local test build (never published): set CURSES_Z5 to your own copy of the game;
// test.html then loads it and plays commands from the URL hash
const storyPath = process.env.CURSES_Z5 || (fs.existsSync('/home/claude/story/curses.z5') ? '/home/claude/story/curses.z5' : '');
if (storyPath) {
const story=fs.readFileSync(storyPath).toString('base64');
const test=t.replace('</body>',()=>`<script>
(function(){const cmds=decodeURIComponent(location.hash.slice(1)).split('|').filter(Boolean);
const b=atob("${story}");const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
window.__zp.startGame(u,false);
for(const c of cmds){const zm=window.__zp.S.zm; if(zm.state==='char') window.__zp.sendKey(c===' '?32:c.charCodeAt(0)); else window.__zp.sendCommand(c);}
})();</script></body>`);
fs.writeFileSync('test.html',test);
}
console.log('built',t.length,'bytes');
