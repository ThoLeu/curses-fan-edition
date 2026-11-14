// Inventory icons: a library of small original SVG pictograms chosen by item name.
(function (root) {
'use strict';
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const closeUps = () => root.ZClose || (typeof require === 'function' ? (() => { try { return require('./closeup.js'); } catch (e) { return null; } })() : null);
const TINTS = ['#c8a050', '#b8604a', '#6a9ab8', '#8ab070', '#a878b8', '#d8b878', '#c87a8a', '#70a8a0'];

// each entry: [regex on the lower-case name, function(tint) -> svg body in a 40x40 box]
const LIB = [
  [/^miniature$/, () => `<ellipse cx="20" cy="20" rx="11" ry="14" fill="#c8a040" stroke="#6a4a10" stroke-width="1.5"/><ellipse cx="20" cy="20" rx="8" ry="11" fill="#e8dcc4"/><circle cx="20" cy="16" r="3.4" fill="#c89a7a"/><path d="M14,28 q6,-9 12,0" fill="#5a3a5a"/>`],
  [/timber spar/, () => `<rect x="4" y="16" width="32" height="8" rx="1.5" fill="#8a6038" stroke="#4a3018" transform="rotate(-20 20 20)"/><path d="M8,22 l26,-10 M10,25 l20,-7" stroke="#5a3a1a" stroke-width=".8" transform="rotate(0)"/><path d="M33,8 l3,-2 1,4z" fill="#8a6038"/>`],
  [/papyrus fragment/, () => `<path d="M9,8 L30,6 L32,14 L28,20 L33,27 L29,34 L11,33 L8,24 L12,18Z" fill="#d8c890" stroke="#8a7a40"/><path d="M13,13 h12 M12,18 h9 M14,24 h13 M13,29 h10" stroke="#6a5a30" stroke-width="1.2"/>`],
  [/smooth round stone/, () => `<ellipse cx="20" cy="24" rx="13" ry="10" fill="#8a8a86" stroke="#4a4a46" stroke-width="1.5"/><ellipse cx="16" cy="20" rx="5" ry="3" fill="#c8c8c4" opacity=".6"/>`],
  // items that also appear in the room pictures: same colours as there
  [/\btube\b/, () => `<rect x="14" y="5" width="12" height="30" rx="5" fill="#a8784a" stroke="#5a3a1a" transform="rotate(20 20 20)"/><ellipse cx="25" cy="7" rx="6" ry="2.5" fill="#c89860" stroke="#5a3a1a" transform="rotate(20 20 20)"/>`],
  // the Tarot cards: the same picture as their close-up, small
  [/^madame sosostris|^grim reaper$|^fool$|^drowned sailor$|^ace of cups$|^castle$|^star$|^maiden$|^crescent moon$|^eight of wands$/, (c, n) => { const CU = closeUps(); if (!CU) return null; const t = { madame: 'has a bad cold', grim: 'hood, scythe, skeleton', fool: 'edge of a cliff', drowned: 'pearls that were his eyes', ace: 'crystal-glass cups and glasses', castle: 'castle on a hill', star: 'single bright light', maiden: 'andromeda chained to a rock', crescent: 'old druidical symbol', eight: 'nothing special about the eight of wands' }[n.split(/[ ,]/)[0]]; const r = CU.find(t); return r ? `<svg x="7" y="1" width="26" height="38" viewBox="8 8 184 304">${r.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>` : null; }],
  // the rods: adamantine ones with their sculpted end, mahogany ones with the silver plaque
  [/^(life|death|love)$/, (c, n) => `<rect x="17.5" y="10" width="5" height="28" rx="2.5" fill="#c8d0dc" stroke="#6a7280" transform="rotate(35 20 24)"/>` + ({ l: `<path d="M24,13 l-1,-7 q0,-2 2,-2 l1,5 v-6 q0,-2 2,-2 q2,0 2,2 v6 v-5 q0,-2 2,-2 q2,0 2,2 v6 v-3 q0,-2 2,-2 q2,0 2,2 v6 q0,6 -6,7 h-4 q-4,-1 -6,-5z" fill="#dce4ee" stroke="#6a7280" stroke-width=".8"/>`, d: `<path d="M23,12 q0,-9 8,-9 q8,0 8,9 q0,4 -3,5 v3 h-10 v-3 q-3,-1 -3,-5z" fill="#dce4ee" stroke="#6a7280" stroke-width=".8"/><circle cx="28" cy="11" r="2.2" fill="#2a2e36"/><circle cx="34" cy="11" r="2.2" fill="#2a2e36"/>`, o: `<path d="M31,20 C22,14 24,5 28,6 C30,6 31,8 31,9 C31,8 32,6 34,6 C38,5 40,14 31,20Z" fill="#dce4ee" stroke="#6a7280" stroke-width=".8"/>` }[n[0] === 'l' ? (n[1] === 'i' ? 'l' : 'o') : 'd'])],
  [/^(fire|returning|stalking|infinity|husbandry|bronze|sacrifice|luck|ice|language)$/, () => `<rect x="17.5" y="5" width="5" height="32" rx="2.5" fill="#7a3418" stroke="#2a0e04" transform="rotate(35 20 21)"/><rect x="24" y="4" width="9" height="6" rx="1" fill="#e8e8f0" stroke="#7a7a82" transform="rotate(35 20 21)"/>`],
  [/spindle/, () => `<line x1="12" y1="34" x2="28" y2="6" stroke="#a8a8b0" stroke-width="4" stroke-linecap="round"/><circle cx="12" cy="34" r="3" fill="#7a7a82"/><circle cx="28" cy="6" r="2.5" fill="#7a7a82"/>`],
  [/ekmek|dessert/, () => `<ellipse cx="20" cy="30" rx="15" ry="5" fill="#e8e4dc"/><path d="M8,28 q12,-18 24,0z" fill="#e8b860"/><path d="M9,24 q11,-6 22,0" stroke="#fff6e0" stroke-width="4" fill="none"/><circle cx="20" cy="14" r="3" fill="#c83a3a"/>`],
  [/adamantine hand|\bhand\b/, () => `<path d="M12,36 v-14 l-3,-8 q0,-3 3,-1 l3,6 v-14 q0,-3 3,0 v12 v-14 q0,-3 3,0 v14 v-12 q0,-3 3,0 v12 v-8 q0,-3 3,0 v14 q0,10 -8,10z" fill="#c8ccd4" stroke="#6a6e78"/>`],
  [/flaming torch/, () => `<rect x="17" y="18" width="6" height="18" fill="#6a4a28"/><path d="M14,18 q-2,-10 6,-14 q8,6 6,14z" fill="#ff9a30"/><path d="M18,18 q0,-6 2,-9 q4,4 2,9z" fill="#ffe08a"/><circle cx="20" cy="12" r="10" fill="#ffd27a" opacity=".25"/>`],
  [/beach ball/, () => `<circle cx="20" cy="21" r="14" fill="#f4f0e8"/><path d="M20,7 q-10,14 0,28 M20,7 q10,14 0,28" fill="none"/><path d="M20,7 a14,14 0 0 0 -12,7 q6,8 12,-7z" fill="#d83a3a"/><path d="M20,7 q8,8 12,7 a14,14 0 0 0 -12,-7z" fill="#3a7ad8"/><path d="M8,28 q8,-6 12,7 a14,14 0 0 1 -12,-7z" fill="#e8c040"/><path d="M32,28 q-8,-6 -12,7 a14,14 0 0 0 12,-7z" fill="#3a9a5a"/>`],
  [/summoning horn|horn made/, () => `<rect x="18.5" y="14" width="3" height="23" fill="#7a5430"/><path d="M8,8 q14,-4 24,4 l-2,6 q-10,-6 -22,-4z" fill="#e8e0c8" stroke="#8a7a5a"/>`],
  [/mounted bottle|whisky/, () => `<rect x="5" y="24" width="30" height="10" rx="2" fill="#7a5430" stroke="#3a2410"/><path d="M8,22 h18 q4,0 6,-3 h4 v-4 h-4 q-2,-3 -6,-3 h-18z" fill="#6a4a1a" opacity=".9" stroke="#3a2008"/>`],
  [/inscribed stone|pumice/, () => `<path d="M12,35 q-4,-14 2,-26 q6,-6 12,0 q6,12 2,26z" fill="#c8c0b0" stroke="#8a8476"/>${[0, 1, 2].map(i => `<path d="M15,${16 + i * 6} h10" stroke="#6a6458" stroke-width="1.5"/>`).join('')}`],
  [/bluish stone|blue stone/, () => `<ellipse cx="20" cy="23" rx="12" ry="10" fill="#3a7ad8"/><ellipse cx="16" cy="19" rx="4" ry="3" fill="#a8d0ff" opacity=".8"/><circle cx="20" cy="22" r="15" fill="#5a9aff" opacity=".2"/>`],
  [/iron mascot|mascot/, () => `<rect x="11" y="30" width="18" height="6" fill="#4a4a50"/><path d="M14,30 q-2,-12 6,-18 q8,6 6,18z" fill="#5a5a62"/><circle cx="20" cy="10" r="5" fill="#5a5a62"/><path d="M15,8 l-3,-4 M25,8 l3,-4" stroke="#5a5a62" stroke-width="2"/>`],
  [/model of an animal|ugly/, () => `<rect x="8" y="30" width="24" height="5" fill="#8a7a5a"/><path d="M10,30 q0,-12 8,-14 q4,-8 10,-4 l4,6 l-4,2 v10z" fill="#7a8a3a"/><circle cx="26" cy="14" r="1.6" fill="#e83a3a"/><path d="M12,30 v-4 M18,30 v-4" stroke="#5a6a2a" stroke-width="2"/>`],
  [/\bfig\b/, () => `<path d="M20,8 q-12,12 -10,20 q2,8 10,8 q8,0 10,-8 q2,-8 -10,-20z" fill="#6a3a5a"/><path d="M20,8 l2,-4" stroke="#4a6a2a" stroke-width="2.5"/><ellipse cx="16" cy="24" rx="3" ry="5" fill="#8a5a7a" opacity=".6"/>`],
  [/bunch of nuts|\bnuts\b/, () => `${[[14, 22], [24, 20], [19, 29], [27, 29], [12, 31]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="5" fill="#8a5a2a" stroke="#4a2a10"/>`).join('')}<path d="M20,6 q0,8 -4,12 M20,6 q2,8 6,10" stroke="#4a6a2a" stroke-width="2" fill="none"/>`],
  [/impressionist painting/, () => `<rect x="5" y="9" width="30" height="22" fill="#c8a040" stroke="#7a5a10"/><rect x="8" y="12" width="24" height="16" fill="#8ab0c8"/><path d="M8,22 q10,-5 24,-2 v8 h-24z" fill="#6a9a5a"/><circle cx="12" cy="21" r="2" fill="#f0d060"/><circle cx="18" cy="23" r="2" fill="#e88a8a"/><circle cx="25" cy="21" r="2" fill="#fff"/>`],
  [/tarot box/, () => `<rect x="7" y="14" width="26" height="18" rx="2" fill="#3a2a4a" stroke="#1a1024"/><path d="M7,14 q13,-7 26,0" fill="#4a3a5a" stroke="#1a1024"/><circle cx="20" cy="23" r="4" fill="#e8c040"/>`],
  [/gift-wrapped parcel|\bparcel\b/, () => `<rect x="7" y="13" width="26" height="21" rx="2" fill="#c83a4a"/><rect x="18" y="13" width="4" height="21" fill="#e8c040"/><rect x="7" y="21" width="26" height="4" fill="#e8c040"/><path d="M20,13 q-7,-9 -11,-2 M20,13 q7,-9 11,-2" stroke="#e8c040" stroke-width="2.4" fill="none"/>`],
  [/medicine bottle/, () => `<rect x="12" y="12" width="16" height="24" rx="3" fill="#7a4a1e" stroke="#3a2008"/><rect x="13" y="5" width="14" height="8" rx="2" fill="#f0ece0" stroke="#a8a090"/><rect x="13" y="19" width="14" height="9" fill="#efe6cc"/><path d="M15,22 h10 M15,25 h7" stroke="#8a7a5a"/>`],
  [/weed killer/, () => `<rect x="11" y="13" width="18" height="23" rx="3" fill="#3a6a3a"/><rect x="15" y="6" width="10" height="8" fill="#d8d8d8"/><path d="M15,24 h10 M20,20 l-4,9 h8z" stroke="#e8e0c8" stroke-width="1.6" fill="none"/>`],
  [/jewellery box/, () => `<rect x="6" y="15" width="28" height="18" rx="2" fill="#6a4024" stroke="#2a1608"/><path d="M6,15 q14,-9 28,0" fill="#7a4a2a" stroke="#2a1608"/><rect x="17" y="17" width="6" height="6" fill="#e8c040"/>`],
  [/prayer book/, () => `<rect x="8" y="7" width="24" height="27" rx="2" fill="#3a1a14"/><rect x="8" y="7" width="4" height="27" fill="#000" opacity=".3"/><rect x="19" y="12" width="4" height="15" fill="#c8a040"/><rect x="15" y="16" width="12" height="4" fill="#c8a040"/>`],
  [/dictionary/, () => `<rect x="8" y="7" width="24" height="27" rx="2" fill="#2a5a3a"/><rect x="8" y="7" width="4" height="27" fill="#000" opacity=".25"/><rect x="8" y="7" width="24" height="5" fill="#e8dcc0"/><rect x="15" y="17" width="12" height="3" fill="#e8dcc0" opacity=".8"/>`],
  [/wooden ball/, () => `<circle cx="20" cy="21" r="13" fill="#8a5a2a"/><circle cx="15" cy="16" r="4" fill="#b88a4a"/><path d="M10,24 q10,4 20,-2" stroke="#6a4020" fill="none"/>`],
  [/gothic.*key|iron key/, () => `<circle cx="12" cy="20" r="7" fill="none" stroke="#3a3a3e" stroke-width="4"/><rect x="18" y="18" width="18" height="4" fill="#3a3a3e"/><rect x="29" y="22" width="3" height="7" fill="#3a3a3e"/><rect x="33" y="22" width="3" height="5" fill="#3a3a3e"/>`],
  [/striped scarf|\bscarf\b/, () => `<path d="M8,10 q12,-4 24,0 v5 q-12,-4 -24,0z" fill="#2a4ab0"/>${[['#2a4ab0', 0], ['#2a8a5a', 1], ['#4a4a52', 2], ['#c8282a', 3]].map(([c, i]) => `<rect x="12" y="${15 + i * 5}" width="7" height="5" fill="${c}"/>`).join('')}<path d="M12,35 l1,3 M15,35 l0,3 M18,35 l-1,3" stroke="#c8282a"/>`],
  [/spade|shovel/, () => `<rect x="18.5" y="4" width="3" height="20" fill="#7a5430"/><rect x="14" y="3" width="12" height="4" rx="2" fill="#5a3a20"/><path d="M12,24 h16 l-1.5,9 q-6.5,5 -13,0z" fill="#9aa0a8" stroke="#5a6068"/>`],
  [/bean pole|tent pole|\bpole\b/, () => `<rect x="18" y="3" width="4" height="34" rx="2" fill="#b8945a" transform="rotate(18 20 20)"/>`],
  [/skull/, () => `<path d="M10,20 q0,-13 10,-13 q10,0 10,13 q0,5 -4,7 v5 h-12 v-5 q-4,-2 -4,-7z" fill="#e8e4dc" stroke="#9a948a"/><circle cx="15.5" cy="19" r="3" fill="#2a2420"/><circle cx="24.5" cy="19" r="3" fill="#2a2420"/><path d="M17,32 v-3 M20,32 v-3 M23,32 v-3" stroke="#9a948a"/>`],
  [/painting|portrait/, () => `<rect x="9" y="5" width="22" height="30" fill="#c8a040" stroke="#7a5a10"/><rect x="12" y="8" width="16" height="24" fill="#2a2420"/><ellipse cx="20" cy="17" rx="4" ry="5" fill="#e8d8c0"/><path d="M13,32 q7,-12 14,0z" fill="#e8d8c0" opacity=".85"/>`],
  [/scroll/, () => `<rect x="14" y="5" width="12" height="30" rx="3" fill="#efe6cc" stroke="#a89870" transform="rotate(12 20 20)"/><ellipse cx="22" cy="6" rx="6" ry="2.5" fill="#f8f2e0" stroke="#a89870" transform="rotate(12 20 20)"/><path d="M17,14 h7 M17,19 h7 M17,24 h5" stroke="#8a7a5a" transform="rotate(12 20 20)"/>`],
  [/drowned sailor|grim reaper|\bfool\b|ace of|\bstar\b/, () => `<rect x="11" y="5" width="18" height="30" rx="2" fill="#f4e8c8" stroke="#8a6a30"/><rect x="14" y="8" width="12" height="24" fill="none" stroke="#a03040"/><circle cx="20" cy="18" r="4" fill="#3a5a8a"/><path d="M16,27 h8" stroke="#3a2a1a"/>`],
  [/whistle/, () => `<path d="M6,18 h20 a6,6 0 0 1 0,12 h-20z" fill="#c8b8a0" stroke="#8a7a60"/><circle cx="6" cy="24" r="4" fill="#a89880"/><path d="M30,14 q4,-4 8,0" stroke="#b8a888" fill="none"/>`],
  [/^(fire|ice|luck|returning|stalking|infinity|husbandry|bronze|sacrifice|language|life|death|love)$|\brod\b/, c => `<rect x="18" y="8" width="5" height="28" rx="2" fill="#c8ccd4" transform="rotate(30 20 22)"/><circle cx="27" cy="9" r="5" fill="${c}"/><circle cx="27" cy="9" r="8" fill="${c}" opacity=".25"/>`],
  [/daisy|clover|flower|branch|plant|leaf|seed|bean\b|shrub|twig|mistletoe|oak/, c => `<path d="M20,36 v-16" stroke="#3a7a3a" stroke-width="2.5"/>${[0, 1, 2, 3].map(i => `<ellipse cx="${20 + Math.cos(i * 1.57) * 6}" cy="${16 + Math.sin(i * 1.57) * 6}" rx="5.5" ry="5.5" fill="${/daisy/.test(c) ? '#f4f0e0' : '#4a9a4a'}"/>`).join('')}<circle cx="20" cy="16" r="2.4" fill="#2a6a2a"/>`],
  [/flash|camera|projector/, c => `<rect x="7" y="13" width="26" height="18" rx="3" fill="#2a2a2e"/><circle cx="20" cy="22" r="6" fill="#4a4a52" stroke="#9a9aa0"/><rect x="11" y="9" width="10" height="5" fill="#3a3a3e"/><rect x="26" y="15" width="5" height="3" fill="#e8e8f0"/>`],
  [/matchbook|match|candle|lamp|lantern/, c => `<rect x="15" y="16" width="10" height="20" rx="2" fill="#efe6cc"/><path d="M20,5 q5,6 0,11 q-5,-5 0,-11z" fill="#ffb347"/><circle cx="20" cy="12" r="9" fill="#ffd27a" opacity=".25"/>`],
  [/hairband|necklace|\bring\b|bracelet|brooch|tiara|crown/, c => `<ellipse cx="20" cy="22" rx="12" ry="9" fill="none" stroke="#e8b040" stroke-width="3"/><circle cx="20" cy="13" r="3.5" fill="${c}"/>`],
  [/glove/, c => `<path d="M12,34 v-14 l-3,-6 q0,-3 3,-1 l3,5 v-12 q0,-3 3,0 v10 v-12 q0,-3 3,0 v12 v-10 q0,-3 3,0 v12 v-7 q0,-3 3,0 v13 q0,10 -8,10z" fill="#f2d428" stroke="#b89a10"/>`],
  [/\bkey\b/, c => `<circle cx="13" cy="20" r="7" fill="none" stroke="${c}" stroke-width="3.5"/><rect x="19" y="18" width="16" height="4" fill="${c}"/><rect x="29" y="22" width="3" height="6" fill="${c}"/><rect x="24" y="22" width="3" height="4" fill="${c}"/>`],
  [/torch|flashlight/, c => `<rect x="6" y="16" width="20" height="9" rx="2" fill="#5a5a62"/><polygon points="26,14 34,10 34,31 26,27" fill="#7a7a84"/><rect x="10" y="18" width="5" height="5" fill="#c83a2a"/><path d="M35,12 l4,-2 M35,20 h4 M35,28 l4,2" stroke="#ffe08a" stroke-width="1.5"/>`],
  [/battery/, c => `<rect x="10" y="9" width="20" height="26" rx="3" fill="${c}"/><rect x="16" y="5" width="8" height="4" fill="#555"/><path d="M17,17 h6 M20,14 v6 M17,28 h6" stroke="#fff" stroke-width="2"/>`],
  [/biscuit|cookie|cake|dessert|fig\b|nuts|bread|food|wishbone/, c => `<circle cx="20" cy="21" r="13" fill="#b8844a"/><circle cx="20" cy="21" r="10" fill="#6a3a1a"/>${[[15, 17], [24, 16], [20, 24], [14, 26], [26, 25]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#d8a860"/>`).join('')}`],
  [/paper|note|letter|postcard|parchment|scroll|pamphlet|leaflet|etching|sketch|ticket|poster|photograph/, c => `<path d="M9,7 h17 l6,6 v21 h-23z" fill="#efe6cc" stroke="#9a8a60"/><path d="M26,7 v6 h6" fill="#d8cca8" stroke="#9a8a60"/><path d="M13,17 h15 M13,22 h15 M13,27 h10" stroke="#8a7a50" stroke-width="1.4"/>`],
  [/map/, c => `<polygon points="5,10 15,7 25,10 35,7 35,31 25,34 15,31 5,34" fill="#e8dcb0" stroke="#8a7a50"/><path d="M15,7 v24 M25,10 v24" stroke="#b0a070"/><path d="M8,24 q6,-8 12,-2 t12,-6" stroke="#6a8aa8" stroke-width="1.6" fill="none"/><circle cx="28" cy="18" r="1.8" fill="#c83a2a"/>`],
  [/dictionary|book|novel|poetry|history|volume|bible|diary|prayer|guide/, c => `<rect x="8" y="7" width="24" height="27" rx="2" fill="${c}"/><rect x="8" y="7" width="4" height="27" fill="#000" opacity=".25"/><rect x="15" y="12" width="13" height="5" fill="#f4ecd4" opacity=".85"/><rect x="10" y="31" width="22" height="3" fill="#f4ecd4"/>`],
  [/scarf|sash|ribbon|handkerchief|cloth|sheet|towel/, c => `<path d="M8,10 q12,-4 24,0 v6 q-12,-4 -24,0z" fill="#2a4a8a"/><path d="M12,14 v20 h6 v-20z" fill="#2a4a8a"/>${[0, 1, 2, 3].map(i => `<rect x="12" y="${16 + i * 5}" width="6" height="2.5" fill="${['#c8322a', '#3a8a4a', '#6a6a6a', '#e8d8b0'][i]}"/>`).join('')}`],
  [/wrench|spanner|spade|shovel|trowel|implement|tool|hammer|crowbar/, c => `<rect x="8" y="17" width="20" height="6" rx="3" fill="#9aa0a6" transform="rotate(-35 20 20)"/><path d="M27,8 a7,7 0 1 1 5,11 l-3,-3 -3,0 0,-3z" fill="#9aa0a6"/>`],
  [/orb|ball|sphere|globe|marble/, c => `<circle cx="20" cy="21" r="13" fill="${c}"/><circle cx="15" cy="16" r="4" fill="#fff" opacity=".55"/><circle cx="20" cy="21" r="13" fill="none" stroke="#000" opacity=".2"/>`],
  [/card|tarot|cards|pack/, c => `<rect x="8" y="8" width="17" height="25" rx="2" fill="#e8d8b0" stroke="#8a6a30" transform="rotate(-10 16 20)"/><rect x="15" y="7" width="17" height="25" rx="2" fill="#f4e8c8" stroke="#8a6a30"/><circle cx="23.5" cy="19.5" r="5" fill="none" stroke="#8a3a2a" stroke-width="1.6"/><path d="M23.5,14 v11 M18,19.5 h11" stroke="#8a3a2a" stroke-width="1"/>`],
  [/box|parcel|case|chest|casket|package|crate/, c => `<rect x="7" y="15" width="26" height="18" rx="2" fill="${c}"/><path d="M7,15 q13,-9 26,0" fill="${c}" stroke="#000" stroke-opacity=".25"/><rect x="18" y="15" width="4" height="18" fill="#e8c040"/><rect x="7" y="22" width="26" height="3" fill="#e8c040"/>`],
  [/bottle|demijohn|tablet|medicine|pill|potion|jar|whisky|oil/, c => `<path d="M16,5 h8 v7 q7,3 7,10 v12 h-22 v-12 q0,-7 7,-10z" fill="${c}" opacity=".8" stroke="#3a3a3a"/><rect x="15" y="3" width="10" height="4" fill="#6a4a2a"/><rect x="12" y="21" width="16" height="7" fill="#f4ecd4"/>`],
  [/mask/, c => `<ellipse cx="20" cy="20" rx="13" ry="12" fill="#4a5244"/><circle cx="14" cy="17" r="4.5" fill="#9ab0b8" stroke="#222" stroke-width="1.5"/><circle cx="26" cy="17" r="4.5" fill="#9ab0b8" stroke="#222" stroke-width="1.5"/><rect x="16" y="25" width="8" height="10" rx="2" fill="#2a2e28"/>`],
  [/coin|money|penny|drachma/, c => `<circle cx="20" cy="20" r="13" fill="${c === '#c87a3a' ? c : '#d8b048'}" stroke="#8a5a1a" stroke-width="1.5"/><circle cx="20" cy="20" r="9" fill="none" stroke="#8a5a1a" opacity=".6"/><path d="M17,16 q3,-3 6,0 q-3,3 0,8 q-3,2 -6,0" stroke="#8a5a1a" stroke-width="1.5" fill="none"/>`],
  [/\bdie\b|dice/, c => `<rect x="9" y="9" width="22" height="22" rx="4" fill="#f4ecd8" stroke="#8a7a5a"/>${[[14, 14], [26, 14], [20, 20], [14, 26], [26, 26]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#3a2a1a"/>`).join('')}`],
  [/gem|amber|stone|jewel|crystal|rose|pebble|sapphire|emerald|ruby/, c => `<polygon points="20,6 32,16 20,35 8,16" fill="${c}"/><polygon points="8,16 32,16 20,6" fill="#fff" opacity=".3"/><path d="M8,16 l12,19 l12,-19 M14,16 l6,-10 l6,10" stroke="#000" opacity=".2" fill="none"/>`],
  [/\brod\b/, c => `<rect x="18" y="8" width="5" height="28" rx="2" fill="#c8ccd4" transform="rotate(30 20 22)"/><circle cx="27" cy="9" r="5" fill="${c}"/>`],
  [/whistle|horn|pipes|syrinx|flute|trumpet/, c => `<path d="M6,18 h20 a6,6 0 0 1 0,12 h-20z" fill="#c8b8a0" stroke="#8a7a60"/><circle cx="26" cy="24" r="3" fill="#8a7a60"/><path d="M30,14 q4,-4 8,0 M31,10 q5,-5 9,0" stroke="${c}" stroke-width="1.5" fill="none"/>`],
  [/mallet|pole|stick|crook|cane|staff|spear|bat\b|club/, c => `<rect x="18" y="5" width="4" height="30" rx="2" fill="#b8945a" transform="rotate(25 20 20)"/><rect x="5" y="28" width="20" height="8" rx="3" fill="#7a3a2a" transform="rotate(25 15 32)"/>`],
  [/watch|clock|chain/, c => `<circle cx="20" cy="23" r="11" fill="#e8c040" stroke="#a88010" stroke-width="2"/><circle cx="20" cy="23" r="8" fill="#fbf4dc"/><path d="M20,23 v-5 M20,23 h4" stroke="#3a2a1a" stroke-width="1.5"/><path d="M20,12 v-5 q4,-3 8,1" stroke="#c8a040" stroke-width="1.6" fill="none"/>`],
  [/flag|ensign|banner/, c => `<rect x="9" y="5" width="3" height="31" fill="#6a4a2a"/><rect x="12" y="7" width="22" height="14" fill="#c8202a"/><rect x="12" y="7" width="9" height="7" fill="#1a2a6a"/>`],
  [/clover|daisy|flower|branch|plant|leaf|seed|bean|shrub|twig|mistletoe/, c => `<path d="M20,36 v-16" stroke="#3a7a3a" stroke-width="2.5"/>${[0, 1, 2, 3].map(i => `<ellipse cx="${20 + Math.cos(i * 1.57) * 6}" cy="${16 + Math.sin(i * 1.57) * 6}" rx="5.5" ry="5.5" fill="#4a9a4a"/>`).join('')}<circle cx="20" cy="16" r="2.4" fill="#2a6a2a"/>`],
  [/mouse|rat|cat\b|squirrel|goat|bird|monkey|animal/, c => `<ellipse cx="22" cy="24" rx="12" ry="8" fill="#9a9aa0"/><circle cx="11" cy="20" r="6" fill="#aaaab0"/><circle cx="9" cy="15" r="3" fill="#b8b8c0"/><circle cx="8.5" cy="20" r="1.2" fill="#c83a2a"/><path d="M33,26 q6,2 5,-6" stroke="#6a6a6a" stroke-width="1.6" fill="none"/><path d="M14,30 v3 M28,30 v3" stroke="#555" stroke-width="2"/>`],
  [/sandal|shoe|boot/, c => `<path d="M6,26 q0,-6 8,-6 h10 q10,0 10,8 v3 h-28z" fill="#8a5a30"/><path d="M14,20 l4,-8 M22,20 l2,-8" stroke="#6a4020" stroke-width="2.5"/>`],
  [/umbrella|parasol/, c => `<path d="M5,18 a15,12 0 0 1 30,0z" fill="${c}"/><path d="M20,18 v13 q0,4 -4,3" stroke="#3a3a3a" stroke-width="2" fill="none"/>`],
  [/hat|cap|helmet/, c => `<ellipse cx="20" cy="28" rx="16" ry="5" fill="${c}"/><path d="M10,28 q0,-16 10,-16 q10,0 10,16z" fill="${c}"/><rect x="10" y="23" width="20" height="3" fill="#000" opacity=".25"/>`],
  [/coat|jacket|robe|cloak|dress|shirt|clothes/, c => `<path d="M12,6 l-8,8 l4,6 l4,-3 v17 h16 v-17 l4,3 l4,-6 l-8,-8 q-4,4 -8,0z" fill="${c}"/>`],
  [/rope|cord|string|thread/, c => `<path d="M10,8 q12,4 4,12 q-8,8 6,12 q12,4 10,-6" stroke="#c8a870" stroke-width="4" fill="none"/>`],
  [/statue|statuette|bust|figurine|model|mascot|idol/, c => `<rect x="12" y="28" width="16" height="7" fill="#9a948a"/><path d="M14,28 q0,-14 6,-16 q6,2 6,16z" fill="#c8c2b6"/><circle cx="20" cy="9" r="5" fill="#d0cabe"/>`],
  [/wireless|radio/, c => `<rect x="6" y="13" width="28" height="20" rx="4" fill="#6a4a2a"/><circle cx="15" cy="23" r="6" fill="#c8b890"/><rect x="24" y="18" width="6" height="3" fill="#e8d8a8"/><circle cx="27" cy="27" r="2" fill="#2a1a0a"/><path d="M30,13 l6,-8" stroke="#3a3a3a" stroke-width="1.5"/>`],
  [/sack|bag|rucksack|pouch|purse/, c => `<path d="M10,14 q-4,20 4,22 h12 q8,-2 4,-22z" fill="#8a7a50"/><path d="M12,14 q8,-6 16,0" fill="#9a8a5c" stroke="#3a3220"/><rect x="14" y="20" width="12" height="7" rx="2" fill="#6a5a3a"/>`]
];

const FALLBACK = c => `<rect x="9" y="9" width="22" height="22" rx="5" fill="${c}" opacity=".85"/><path d="M15,20 h10 M20,15 v10" stroke="#fff" stroke-width="2.4" opacity=".8"/>`;

function icon(name) {
  const n = (name || '').toLowerCase();
  const special = /\bred\b/.test(n) ? '#b02a22' : /copper/.test(n) ? '#c87a3a' : /gold/.test(n) ? '#e8c040' : /amber/.test(n) ? '#e8a030' : /\bblue\b/.test(n) ? '#3a7ad8' : /green/.test(n) ? '#3a8a4a' : /silver|steel|iron/.test(n) ? '#9aa0a8' : null;
  const c = special || TINTS[hash(n) % TINTS.length];
  let body = null;
  for (const [re, fn] of LIB) if (re.test(n)) { body = fn(c, n); if (body) break; }
  return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body || FALLBACK(c)}</svg>`;
}

// suggested verbs for an item, based on its name
function verbsFor(name) {
  const n = (name || '').toLowerCase();
  const v = ['examine'];
  if (/book|dictionary|novel|poetry|paper|note|letter|postcard|scroll|pamphlet|parchment|map|poster|history|prayer|guide|label|etching/.test(n)) v.push('read');
  if (/biscuit|fig|nuts|cake|dessert|food|bread/.test(n)) v.push('eat');
  if (/scarf|glove|mask|sandal|hat|coat|robe|hairband|ring|watch|shoe/.test(n)) v.push('wear');
  if (/box|parcel|bottle|demijohn|case|bag|rucksack|torch|jar|chest/.test(n)) v.push('open');
  if (/whistle|horn|pipes|syrinx|flute/.test(n)) v.push('blow');
  if (/torch|lamp|lantern|wireless|radio|flash|mouse/.test(n)) v.push('turn on');
  v.push('drop');
  return v;
}

const api = { icon, verbsFor };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ZIcons = api;
})(typeof window !== 'undefined' ? window : this);
