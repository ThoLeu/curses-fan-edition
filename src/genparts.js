// Building blocks for the generic room pictures: the things a description can name, and the open-air scenes.
(function (root) {
'use strict';
const Gx = () => root.ZGeneric || require('./generic.js');
const IC = () => root.ZIcons || (typeof require === 'function' ? (() => { try { return require('./icons.js'); } catch (e) { return null; } })() : null);
const W = 400, H = 260;
const lerp = (a, b, t) => a + (b - a) * t;
const f1 = v => Math.round(v * 10) / 10;
const at = (p, body, sx) => `<g transform="translate(${f1(p.x)} ${f1(p.y)}) scale(${Math.round((sx || 1) * p.s * 100) / 100} ${Math.round(p.s * 100) / 100})">${body}</g>`;

// ---------------------------------------------------------------- shapes, in local units (origin: bottom centre, 1 unit ~ 1px close up)
const S = {
  table: (w = 110, cloth) => `<rect x="${-w / 2}" y="-52" width="${w}" height="8" fill="${cloth || '#6a4628'}" stroke="#2a180c"/><rect x="${-w / 2 + 6}" y="-44" width="6" height="44" fill="#4a2e18"/><rect x="${w / 2 - 12}" y="-44" width="6" height="44" fill="#4a2e18"/><rect x="${-w / 2 + 2}" y="-44" width="${w - 4}" height="5" fill="#000" opacity=".25"/>`,
  trestle: (w = 150) => `<rect x="${-w / 2}" y="-56" width="${w}" height="7" fill="#7a5a36" stroke="#2a180c"/><path d="M${-w / 2 + 14},-49 L${-w / 2 + 2},0 M${-w / 2 + 14},-49 L${-w / 2 + 26},0 M${w / 2 - 14},-49 L${w / 2 - 26},0 M${w / 2 - 14},-49 L${w / 2 - 2},0" stroke="#5a3e22" stroke-width="5"/>`,
  desk: () => `<rect x="-70" y="-60" width="140" height="10" fill="#6a4a2c" stroke="#2a180c"/><rect x="-66" y="-50" width="40" height="50" fill="#5a3c22" stroke="#2a180c"/><rect x="26" y="-50" width="40" height="50" fill="#5a3c22" stroke="#2a180c"/><rect x="-44" y="-68" width="30" height="8" fill="#e8dcc0" transform="rotate(-6 -30 -64)"/><rect x="-6" y="-66" width="26" height="6" fill="#d8ccb0" transform="rotate(8 7 -63)"/><rect x="30" y="-72" width="9" height="12" fill="#c8b890"/><rect x="44" y="-70" width="9" height="10" fill="#c8b890"/>`,
  bar: () => `<rect x="-130" y="-74" width="260" height="12" fill="#6a4426" stroke="#2a160a"/><rect x="-126" y="-62" width="252" height="62" fill="#4a2e18"/><path d="M-120,-56 h240 M-120,-30 h240" stroke="#2a160a" stroke-width="2"/>${[-100, -82, -64, 70, 88].map((x, i) => `<rect x="${x}" y="-96" width="8" height="22" rx="2" fill="${['#3a6a3a', '#8a6a2a', '#c8d8c0', '#3a6a3a', '#8a3a2a'][i]}" opacity=".9"/>`).join('')}`,
  crates: n => { let s = ''; for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * 62, y = i % 2 ? -50 : 0; s += `<rect x="${x - 30}" y="${y - 46}" width="60" height="46" fill="#7a5a34" stroke="#2a1a0c" stroke-width="1.5"/><path d="M${x - 30},${y - 23} h60 M${x - 30},${y - 46} l60,46" stroke="#3a2614" stroke-width="1.5" opacity=".7"/>${[0, 1, 2, 3].map(k => `<path d="M${x - 24 + k * 14},${y - 46} l2,-9 h8 l2,9" fill="#cfe0e8" opacity=".6"/>`).join('')}`; } return s; },
  cabinet: () => `<rect x="-26" y="-118" width="52" height="118" fill="#3a2414" stroke="#1a0e06" stroke-width="2"/><rect x="-21" y="-112" width="42" height="96" fill="#8aa8b8" opacity=".35"/><path d="M-21,-80 h42 M-21,-48 h42" stroke="#3a2414" stroke-width="2"/><circle cx="-6" cy="-92" r="6" fill="#a08a60"/><rect x="2" y="-64" width="12" height="14" fill="#8a7a5a"/><path d="M-14,-24 q6,-10 12,0z" fill="#7a6a50"/><path d="M-18,-110 l10,40" stroke="#fff" opacity=".25" stroke-width="2"/>`,
  couch: () => `<rect x="-60" y="-34" width="120" height="22" rx="6" fill="#8a5a3a"/><rect x="-60" y="-58" width="20" height="46" rx="6" fill="#7a4a2e"/><rect x="-62" y="-12" width="6" height="12" fill="#4a2e18"/><rect x="56" y="-12" width="6" height="12" fill="#4a2e18"/>`,
  bed: () => `<rect x="-70" y="-40" width="140" height="26" fill="#d8cfb8"/><rect x="-74" y="-66" width="10" height="66" fill="#5a3a20"/><rect x="64" y="-48" width="10" height="48" fill="#5a3a20"/><rect x="-62" y="-50" width="34" height="12" rx="5" fill="#efe8d8"/>`,
  statue: (god, tall, flower) => {
    const k = tall ? 1.25 : 1;
    let attr = '';
    if (/demeter/.test(god)) attr = `<path d="M14,${-92 * k} l10,-26 M16,${-92 * k} l14,-22 M12,${-92 * k} l4,-28" stroke="#d8c890" stroke-width="2.5"/>`;
    else if (/dionysus/.test(god)) attr = `<path d="M14,${-96 * k} h14 l-3,10 h-8z" fill="#cfc8b8"/><circle cx="-14" cy="${-128 * k}" r="4" fill="#bcb4a4"/><circle cx="-8" cy="${-130 * k}" r="4" fill="#bcb4a4"/>`;
    else if (/ares/.test(god)) attr = `<line x1="18" y1="${-30}" x2="22" y2="${-150 * k}" stroke="#bcb4a4" stroke-width="3"/><path d="M22,${-150 * k} l-5,12 h10z" fill="#bcb4a4"/><ellipse cx="-16" cy="${-74 * k}" rx="10" ry="14" fill="#bcb4a4"/>`;
    else if (/poseidon/.test(god)) attr = `<line x1="18" y1="-30" x2="20" y2="${-156 * k}" stroke="#bcb4a4" stroke-width="3"/><path d="M12,${-150 * k} v-12 M20,${-152 * k} v-14 M28,${-150 * k} v-12 M12,${-150 * k} h16" stroke="#bcb4a4" stroke-width="3" fill="none"/>`;
    else if (/diana/.test(god)) attr = `<path d="M-18,${-86 * k} q-14,-26 0,-52" stroke="#bcb4a4" stroke-width="3" fill="none"/><line x1="-18" y1="${-86 * k}" x2="-18" y2="${-138 * k}" stroke="#bcb4a4" stroke-width="1"/>` + (flower ? `<g transform="translate(9 ${-134 * k}) scale(1.6)"><circle r="5" fill="#f4eee4" stroke="#b8ac98"/><path d="M-3,-1 q3,-4 6,0 q-3,4 -6,0z" fill="#d8cfc0"/><path d="M-5,3 l-5,4" stroke="#a8a090" stroke-width="1.5"/></g>` : '');
    return `<rect x="-24" y="-30" width="48" height="30" fill="#8a8478"/><rect x="-28" y="-34" width="56" height="6" fill="#a09a8e"/><path d="M-16,-34 L-12,${-110 * k} Q0,${-120 * k} 12,${-110 * k} L16,-34Z" fill="#dcd6ca"/><path d="M-12,${-104 * k} q-10,20 -6,40 M12,${-104 * k} q10,20 6,40" stroke="#cfc8bc" stroke-width="7" fill="none"/><circle cx="0" cy="${-124 * k}" r="11" fill="#e4dfd4"/><path d="M-8,-40 q8,-36 0,-60 M6,-44 q-4,-30 2,-56" stroke="#a8a296" stroke-width="1.2" fill="none"/>${attr}`;
  },
  sphinx: flip => `<g transform="scale(${flip ? -1 : 1} 1)"><rect x="-40" y="-12" width="80" height="12" fill="#a8885a"/><path d="M-34,-12 q4,-26 30,-26 h26 q10,0 12,10 l2,16z" fill="#c8a670"/><path d="M14,-38 q0,-24 14,-26 q14,2 14,24 l-4,16 h-20z" fill="#d0b07a"/><path d="M12,-56 l-6,20 M44,-56 l6,20" stroke="#a8885a" stroke-width="6"/><circle cx="24" cy="-48" r="2" fill="#2a1a0a"/><circle cx="34" cy="-48" r="2" fill="#2a1a0a"/><path d="M26,-40 h6" stroke="#5a3a1a" stroke-width="1.6"/><path d="M-34,-12 q-12,-4 -10,-18" stroke="#c8a670" stroke-width="4" fill="none"/></g>`,
  altar: flame => `<rect x="-52" y="-44" width="104" height="44" fill="#14121a"/><rect x="-56" y="-50" width="112" height="8" fill="#22202a"/><path d="M-40,-30 h80" stroke="#3a3848" stroke-width="1"/>${flame ? `<path d="M-14,-50 q-4,-22 14,-28 q18,6 14,28z" fill="#a8783a" stroke="#5a3a12" stroke-width="1.5"/><path d="M-10,-78 q10,-30 4,-46 q16,16 10,46z" fill="#ff9a30"/><path d="M-4,-78 q4,-16 2,-26 q8,10 6,26z" fill="#ffe08a"/>` : ''}`,
  mummy: (open) => open ? `<path d="M-90,-8 L-80,-40 Q-60,-52 60,-48 Q90,-44 92,-26 L84,-6Z" fill="#d8a830" stroke="#6a4a10" stroke-width="2"/><path d="M-74,-40 Q-20,-48 52,-45 Q76,-42 78,-28 L72,-14 L-76,-12Z" fill="#2a1a08"/><path d="M-70,-36 Q-20,-44 48,-41" stroke="#f0c850" stroke-width="2" fill="none" opacity=".7"/><g transform="translate(-6 -50) rotate(-16)"><path d="M-84,0 Q-60,-14 60,-10 Q90,-6 92,10 L-84,10Z" fill="#2a5aa8" stroke="#6a4a10" stroke-width="2"/>${[-60, -40, -20, 0, 20, 40].map(x => `<path d="M${x},-8 v16" stroke="#e8c040" stroke-width="3"/>`).join('')}<ellipse cx="72" cy="2" rx="16" ry="10" fill="#e8c040" stroke="#6a4a10"/></g><rect x="-92" y="-8" width="186" height="8" fill="#5a4a2a"/>` : `<path d="M-90,-8 L-80,-40 Q-60,-52 60,-48 Q90,-44 92,-26 L84,-6Z" fill="#d8a830" stroke="#6a4a10" stroke-width="2"/><path d="M-70,-40 Q-20,-50 50,-46 L48,-14 L-72,-12Z" fill="#2a5aa8"/>${[-56, -40, -24, -8, 8, 24, 40].map(x => `<path d="M${x},-46 v34" stroke="#e8c040" stroke-width="3"/>`).join('')}<ellipse cx="70" cy="-30" rx="18" ry="15" fill="#e8c040" stroke="#6a4a10"/><circle cx="66" cy="-32" r="2" fill="#1a1a2a"/><circle cx="76" cy="-32" r="2" fill="#1a1a2a"/><rect x="-92" y="-8" width="186" height="8" fill="#5a4a2a"/>`,
  // the adamantine knight on his tomb: headless, handless and heartless until the parts are fitted
  tombKnight: (parts = {}) => {
    let s = `<rect x="-90" y="-44" width="180" height="44" fill="#6a6660" stroke="#2a2826" stroke-width="2"/><rect x="-94" y="-50" width="188" height="8" fill="#7a766e"/><path d="M-60,-30 h120 M-60,-16 h120" stroke="#4a4844" stroke-width="1"/>`;
    if (parts.gone) return s;
    // the body lying along the tomb, the neck to the west end
    s += `<path d="M-62,-50 Q-66,-64 -50,-64 L60,-62 Q76,-60 74,-50Z" fill="#c8ccd4" stroke="#6a6e78" stroke-width="1.5"/><path d="M0,-62 v-6 M20,-62 v-6 M40,-62 v-4" stroke="#8a8e98"/><rect x="-70" y="-60" width="9" height="8" fill="#9a9ea8"/>`;
    // the ribcage, empty or with the heart in it
    s += `<path d="M-46,-63 q12,-8 24,0 v-1 q-12,-12 -24,0z" fill="#1a1a20"/><path d="M-42,-66 v4 M-37,-68 v6 M-32,-68 v6 M-27,-66 v4" stroke="#aab0b8" stroke-width="1.4"/>`;
    if (parts.heart) s += `<path d="M-34,-63 q-6,-8 -1,-10 q3,-1 4,2 q1,-3 4,-2 q5,2 -1,10z" fill="#c8323a" stroke="#6a1018"/>`;
    // the left arm, and the hand at the wrist reaching out
    s += `<path d="M-30,-60 L6,-54" stroke="#aab0b8" stroke-width="5" stroke-linecap="round"/>`;
    if (parts.hand) s += `<path d="M6,-56 l10,-2 l8,-3 l1,2 l-7,3 l9,-1 v2 l-9,1 l8,2 l-1,2 l-10,-2 l-8,1z" fill="#d8dce4" stroke="#6a6e78" stroke-width="1"/>`;
    // the skull on the neck
    if (parts.skull) s += `<circle cx="-80" cy="-62" r="10" fill="#e8e2d0" stroke="#8a8270" stroke-width="1.2"/><circle cx="-84" cy="-64" r="2.4" fill="#2a2620"/><circle cx="-78" cy="-65" r="2.4" fill="#2a2620"/><path d="M-84,-56 h7" stroke="#6a6250" stroke-width="1.2"/>`;
    return s;
  },
  easel: (k = 0) => `<path d="M-20,0 L0,-110 L20,0 M0,-110 L4,0" stroke="#6a4a28" stroke-width="4" fill="none"/><rect x="-30" y="-100" width="60" height="46" fill="#efe6d0" stroke="#5a3a1a" transform="rotate(${k ? -6 : 4})"/><circle cx="${-8 + k * 10}" cy="-80" r="10" fill="${k ? '#3a7ab8' : '#c84a3a'}" opacity=".8" transform="rotate(${k ? -6 : 4})"/><path d="M-22,-62 q20,-12 44,-4" stroke="#e8b040" stroke-width="5" fill="none" opacity=".8" transform="rotate(${k ? -6 : 4})"/>`,
  kiosk: () => `<rect x="-50" y="-90" width="100" height="90" fill="#3a4a5a" stroke="#1a222a" stroke-width="2"/><rect x="-56" y="-104" width="112" height="16" fill="#2a3644"/><rect x="-44" y="-80" width="88" height="34" fill="#1a1410"/>${[-38, -24, -10, 4, 18].map((x, i) => `<rect x="${x}" y="-46" width="11" height="15" fill="${['#c8382a', '#e8c040', '#3a7ab8', '#e8e0d0', '#3a8a5a'][i]}"/>`).join('')}<rect x="-50" y="-32" width="100" height="6" fill="#5a6a7a"/>`,
  globe: () => `<path d="M-20,0 L0,-40 L20,0" stroke="#5a3a1a" stroke-width="5" fill="none"/><path d="M-40,-80 a40,40 0 1 1 34,39 l-10,-20 l-14,10z" fill="#c8b880" stroke="#5a4a2a" stroke-width="2"/><path d="M-30,-96 q20,-10 40,6 q-6,14 -24,10 M2,-70 q14,-4 26,4" stroke="#6a8a5a" stroke-width="4" fill="none"/><path d="M-6,-41 l-4,-14 l12,6z" fill="#2a1a0a"/>`,
  spindle: () => `<line x1="-6" y1="-36" x2="6" y2="-128" stroke="#a8a8b0" stroke-width="4"/>`,
  troughs: () => { let s = ''; for (let i = 0; i < 3; i++) { const x = (i - 1) * 74; s += `<ellipse cx="${x}" cy="-12" rx="34" ry="11" fill="#9a5a34"/><ellipse cx="${x}" cy="-16" rx="30" ry="8" fill="#c8a040" opacity=".85"/><ellipse cx="${x - 8}" cy="-18" rx="10" ry="2.5" fill="#fff0b0" opacity=".5"/>`; } return s; },
  armour: () => `<path d="M-80,0 l30,-130 M-64,0 l26,-136 M-50,0 l22,-128" stroke="#7a6a50" stroke-width="3"/><path d="M-50,-130 l-6,14 h12z M-38,-136 l-6,14 h12z M-28,-128 l-6,14 h12z" fill="#9a9ea8"/><path d="M0,-6 q4,-40 30,-44 q26,4 30,44z" fill="#6a6a6a" stroke="#2a2a2a"/><circle cx="30" cy="-64" r="14" fill="#7a7a7a" stroke="#2a2a2a"/><path d="M18,-64 h24" stroke="#1a1a1a" stroke-width="3"/>`,
  hides: () => `<path d="M-90,-4 q10,-18 40,-14 q20,-10 40,0 q24,-8 40,4 q-10,14 -60,14 q-50,4 -60,-4z" fill="#8a6a44"/><path d="M-60,-8 q20,-10 50,-4" stroke="#5a4428" stroke-width="2" fill="none"/>`,
  fires: () => { let s = ''; for (let i = 0; i < 3; i++) { const x = (i - 1) * 90; s += `<path d="M${x - 24},-4 l48,-6 M${x - 24},-10 l48,6" stroke="#3a2414" stroke-width="5"/><path d="M${x - 14},-8 Q${x - 10},-32 ${x},-44 Q${x + 10},-30 ${x + 14},-8Z" fill="#ff9a30"/><path d="M${x - 6},-8 Q${x - 4},-22 ${x},-30 Q${x + 5},-20 ${x + 6},-8Z" fill="#ffe08a"/>`; } return s; },
  capstan: () => `<rect x="-26" y="-60" width="52" height="60" fill="#5a3a20" stroke="#2a180a" stroke-width="2"/><ellipse cx="0" cy="-60" rx="30" ry="9" fill="#6a4628" stroke="#2a180a"/><path d="M-60,-62 h120 M-40,-74 l80,24 M40,-74 l-80,24" stroke="#7a5a34" stroke-width="5"/><path d="M-26,-30 q-10,4 -14,12 M26,-44 q20,10 26,36" stroke="#6a6a72" stroke-width="7" fill="none" stroke-dasharray="6 3"/>`,
  shipwheel: () => `<circle cx="0" cy="-130" r="36" fill="none" stroke="#7a5430" stroke-width="7"/>${[0, 1, 2, 3].map(i => `<line x1="${f1(Math.cos(i * .785) * 52)}" y1="${f1(-130 + Math.sin(i * .785) * 52)}" x2="${f1(-Math.cos(i * .785) * 52)}" y2="${f1(-130 - Math.sin(i * .785) * 52)}" stroke="#6a4626" stroke-width="5"/>`).join('')}<circle cx="0" cy="-130" r="8" fill="#5a3a1a"/>`,
  cage: () => `<rect x="-14" y="-26" width="28" height="26" fill="none" stroke="#5a5a5a" stroke-width="1.5"/><path d="M-7,-26v26M0,-26v26M7,-26v26" stroke="#5a5a5a"/><path d="M-14,-26 q14,-10 28,0" fill="none" stroke="#5a5a5a" stroke-width="1.5"/><ellipse cx="0" cy="-8" rx="6" ry="5" fill="#8a6a4a"/>`
};
// wall shapes, local units with the bottom of the wall at 0 (back wall ~220 units high)
const WS = {
  relief: (motif, w = 300) => {
    let s = `<rect x="${-w / 2}" y="-190" width="${w}" height="70" fill="#000" opacity=".16"/><rect x="${-w / 2}" y="-190" width="${w}" height="70" fill="none" stroke="#000" opacity=".3" stroke-width="2"/>`;
    const n = Math.floor(w / 50);
    for (let i = 0; i < n; i++) {
      const x = -w / 2 + 25 + i * (w - 50) / Math.max(1, n - 1);
      const c = 'stroke="#000" stroke-width="3" fill="none" opacity=".45"';
      if (motif === 'fish') s += `<path d="M${x - 16},-150 q16,-14 30,0 q-14,14 -30,0z M${x + 14},-150 l8,-6 v12z" ${c}/><path d="M${x - 22},-132 q10,-8 22,0 t22,0" ${c}/>`;
      else if (motif === 'wheat') s += `<path d="M${x},-124 q4,-30 0,-60 M${x - 8},-124 q0,-26 -8,-50 M${x + 8},-124 q2,-26 10,-48" ${c}/><circle cx="${x + 18}" cy="-176" r="6" ${c}/>`;
      else if (motif === 'warriors') s += `<circle cx="${x}" cy="-176" r="6" ${c}/><path d="M${x},-170 v28 l-8,18 M${x},-142 l8,18 M${x + 12},-186 v60" ${c}/><ellipse cx="${x - 8}" cy="-156" rx="8" ry="11" ${c}/>`;
      else if (motif === 'grapes') s += `<path d="M${x - 16},-178 q16,-6 32,4" ${c}/>${[0, 1, 2].map(k => `<circle cx="${x - 4 + k * 5}" cy="${-160 + k * 7}" r="4" ${c}/>`).join('')}<ellipse cx="${x + 16}" cy="-138" rx="8" ry="10" ${c}/>`;
      else if (motif === 'seasons') s += [`<path d="M${x - 10},-130 l6,-14 l6,14 M${x + 4},-150 q4,-10 10,-4" ${c}/>`, `<circle cx="${x}" cy="-168" r="9" ${c}/><path d="M${x - 14},-168 h-6 M${x + 14},-168 h6 M${x},-182 v-6" ${c}/>`, `<path d="M${x - 10},-126 l20,-40 M${x - 16},-140 q16,-6 30,4" ${c}/>`, `<path d="M${x - 20},-140 q10,-8 20,0 t20,0 M${x - 20},-128 q10,-8 20,0 t20,0" ${c}/>`, `<path d="M${x},-130 v-48 M${x - 18},-154 h36 M${x - 12},-166 l24,24 M${x + 12},-166 l-24,24" ${c}/>`][i % 5];
      else if (motif === 'hunters') s += `<circle cx="${x}" cy="-176" r="6" ${c}/><path d="M${x},-170 v24 l-10,20 M${x},-146 l10,20 M${x - 16},-130 l32,-56" ${c}/>`;
      else s += `<circle cx="${x}" cy="-174" r="6" ${c}/><path d="M${x},-168 v26 l-8,18 M${x},-142 l8,18 M${x},-160 l-12,8 M${x},-160 l12,8" ${c}/>`;
    }
    return s;
  },
  mural: () => `<rect x="-150" y="-200" width="300" height="190" fill="#9a6a2a" stroke="#5a3a10" stroke-width="5"/><rect x="-140" y="-190" width="280" height="170" fill="#b88a3a"/>${[-100, -40, 20, 80].map((x, i) => `<circle cx="${x}" cy="-150" r="12" fill="none" stroke="#6a4416" stroke-width="3"/><path d="M${x},-138 v40 l-14,30 M${x},-98 l14,30 M${x},-124 l-18,${i % 2 ? -10 : 12} M${x},-124 l18,${i % 2 ? 12 : -10}" stroke="#6a4416" stroke-width="4" fill="none"/>`).join('')}<path d="M-140,-40 q70,-16 140,0 t140,0" stroke="#6a4416" stroke-width="3" fill="none"/><path d="M-120,-180 l40,30 M60,-180 l50,20" stroke="#d8b060" stroke-width="2" opacity=".6"/>`,
  glyphs: (w = 300) => { let s = ''; for (let r = 0; r < 5; r++) for (let x = -w / 2 + 12; x < w / 2 - 10; x += 22) { const y = -196 + r * 30, k = (x * 7 + r * 13) & 7; s += [`<circle cx="${x}" cy="${y}" r="6"`, `<path d="M${x - 6},${y + 6} l6,-14 l6,14z"`, `<path d="M${x},${y - 8} v16 M${x - 6},${y} h12"`, `<path d="M${x - 7},${y} q7,-10 14,0 q-7,10 -14,0z"`, `<rect x="${x - 5}" y="${y - 7}" width="10" height="14"`, `<path d="M${x - 6},${y + 6} q2,-14 12,-12"`, `<path d="M${x - 6},${y - 6} l12,12 M${x + 6},${y - 6} l-12,12"`, `<path d="M${x - 7},${y + 4} h14 M${x},${y + 4} v-12 l6,4"`][k] + ' stroke="#3a1e08" stroke-width="2.4" fill="none" opacity=".7"/>'; } return s; },
  writings: (w = 260) => { let s = ''; for (let r = 0; r < 6; r++) s += `<path d="M${-w / 2},${-180 + r * 18} ${Array.from({ length: 14 }, (_, i) => `l${8 + (i * 7 + r) % 9},${((i + r) % 3) - 1}`).join(' ')}" stroke="#2a1a10" stroke-width="2" fill="none" opacity=".5"/>`; return s; },
  scenes: () => [-110, -40, 30, 100].map((x, i) => `<rect x="${x - 30}" y="-180" width="60" height="64" fill="${['#c8503a', '#3a7ab8', '#e8b040', '#5a9a5a'][i]}" opacity=".75" stroke="#2a1a10" stroke-width="2"/><path d="M${x - 10},-160 q10,-12 20,0 q-2,16 -10,18 q-8,-2 -10,-18z" fill="#efe6d0"/><path d="M${x - 6},-152 h4 M${x + 2},-152 h4 M${x - 4},-144 q4,${i % 2 ? -4 : 4} 8,0" stroke="#2a1a10" stroke-width="1.5" fill="none"/>`).join('') + `<circle cx="-140" cy="-100" r="5" fill="#3ab0a0"/><circle cx="-60" cy="-96" r="5" fill="#d0508a"/><circle cx="60" cy="-98" r="5" fill="#e8c040"/><circle cx="140" cy="-100" r="5" fill="#5a8ad8"/>`,
  painting: (w, hh, what) => {
    let inner = '';
    if (what === 'still') inner = `<rect x="${-w / 2 + 8}" y="${-hh + 8}" width="${w - 16}" height="${hh - 16}" fill="#2a2016"/><ellipse cx="${-w / 4}" cy="-34" rx="16" ry="13" fill="#c84a2a"/><circle cx="${-w / 8}" cy="-30" r="9" fill="#e8b040"/><path d="M${w / 10},-24 h40 l-6,-30 h-28z" fill="#6a8aa8"/><circle cx="${w / 3}" cy="-30" r="8" fill="#7a3a6a"/><circle cx="${w / 3 + 12}" cy="-28" r="8" fill="#7a3a6a"/><path d="M${-w / 2 + 12},-20 h${w - 24}" stroke="#5a4a3a" stroke-width="4"/>`;
    else if (what === 'priest') inner = `<rect x="${-w / 2 + 6}" y="${-hh + 6}" width="${w - 12}" height="${hh - 12}" fill="#d8c8a0"/><path d="M-14,-14 l4,-50 q10,-8 20,0 l4,50z" fill="#8a8a92"/><circle cx="0" cy="-72" r="8" fill="#c8945a"/><path d="M-6,-80 h12 l-2,-10 h-8z" fill="#3a5aa8"/><line x1="18" y1="-14" x2="22" y2="-86" stroke="#c8a040" stroke-width="3"/><circle cx="22" cy="-88" r="4" fill="#c8a040"/>`;
    else inner = `<rect x="${-w / 2 + 6}" y="${-hh + 6}" width="${w - 12}" height="${hh - 12}" fill="#8ab0c8"/><path d="M${-w / 2 + 6},-26 q${w / 3},-16 ${w - 12},-6 V-6 H${-w / 2 + 6}z" fill="#6a9a5a"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${-w / 2 + 14 + i * (w - 28) / 5}" cy="${-36 - (i % 2) * 8}" r="5" fill="${['#f0d060', '#e88a8a', '#fff', '#d0a0e0'][i % 4]}" opacity=".9"/>`).join('')}`;
    return `<g transform="translate(0 -110)"><rect x="${-w / 2 - 5}" y="${-hh - 5}" width="${w + 10}" height="${hh + 10}" fill="#a8803a" stroke="#5a3a10" stroke-width="2"/>${inner}</g>`;
  },
  posters: (w = 220) => { let s = ''; for (let i = 0; i < 7; i++) { const x = -w / 2 + (i * 37) % w, y = -170 + (i * 23) % 60, c = ['#c8a87a', '#b8c0c8', '#d8c8a0', '#a85a4a', '#7a8a9a', '#e0d8c0', '#c87a4a'][i]; s += `<rect x="${x}" y="${y}" width="44" height="58" fill="${c}" transform="rotate(${(i % 3) * 4 - 4} ${x + 22} ${y + 29})"/><path d="M${x + 6},${y + 12} h30 M${x + 6},${y + 20} h22" stroke="#2a2018" stroke-width="3" opacity=".5"/>`; } s += `<path d="M${-w / 2 + 40},-112 l10,14 l-14,-4z" fill="#d8c8a0" opacity=".8"/>`; return s; },
  tapestry: bear => `<rect x="-60" y="-200" width="120" height="150" fill="#6a3a24" stroke="#3a1a0a" stroke-width="3"/><rect x="-52" y="-192" width="104" height="134" fill="#8a5a34"/>${bear ? `<path d="M-14,-70 l-4,-34 q-10,-20 -4,-40 l-8,-10 l10,0 q8,-14 22,-8 q10,6 10,20 l10,18 l-10,4 l2,40 l-8,10 l-6,-16 l-6,16z" fill="#2a1408"/>` : ''}<path d="M-60,-50 v12 M-40,-50 v10 M-20,-50 v12 M0,-50 v10 M20,-50 v12 M40,-50 v10 M60,-50 v12" stroke="#6a3a24" stroke-width="3"/>`,
  shelves: (w = 280, scrolls) => { let s = `<rect x="${-w / 2}" y="-210" width="${w}" height="206" fill="#2a1a0e"/>`; for (let r = 0; r < 5; r++) { const y = -200 + r * 40; s += `<rect x="${-w / 2}" y="${y + 34}" width="${w}" height="5" fill="#5a3a1e"/>`; for (let x = -w / 2 + 6; x < w / 2 - 12; x += 13) s += scrolls ? `<circle cx="${x + 6}" cy="${y + 26}" r="6" fill="${['#e8dcbc', '#d8c8a0', '#c8b890'][(x + r) & 1 ? 0 : (x & 2 ? 1 : 2)]}" stroke="#7a6a4a"/><circle cx="${x + 6}" cy="${y + 26}" r="1.5" fill="#7a5a3a"/>${(x + r * 3) % 5 === 0 ? `<path d="M${x + 6},${y + 32} v6" stroke="#a83a2a" stroke-width="2"/>` : ''}` : `<rect x="${x}" y="${y + 10}" width="10" height="24" fill="${['#6e2a22', '#2f4a3a', '#7a5a2a', '#33405e'][(x + r) & 3]}"/>`; } return s; },
  pigeonhole: () => { let s = `<rect x="-40" y="-170" width="80" height="60" fill="#5a3a1e" stroke="#2a180a" stroke-width="2"/>`; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) s += `<rect x="${-36 + c * 19}" y="${-166 + r * 19}" width="15" height="15" fill="#1a1008"/>`; return s; },
  niche: () => `<path d="M-36,-40 V-120 A36,36 0 0 1 36,-120 V-40Z" fill="#000" opacity=".5"/><path d="M-36,-40 h72" stroke="#fff" opacity=".2" stroke-width="3"/>`,
  // three sockets in a row; the sceptre, if the game has it fixed in one, projects from it like a handle
  sockets: (fixed = -1, y = -170) => [-40, 0, 40].map((x, i) => `<circle cx="${x}" cy="${y}" r="9" fill="#0a0806" stroke="#8a7a5a" stroke-width="3"/>` + (i === fixed ? `<path d="M${x},${y} l10,22" stroke="#7a5a10" stroke-width="7" stroke-linecap="round"/><path d="M${x},${y} l10,22" stroke="#e8c040" stroke-width="4" stroke-linecap="round"/><circle cx="${x + 11}" cy="${y + 24}" r="5.5" fill="#f0d060" stroke="#7a5a10"/><circle cx="${x}" cy="${y}" r="3" fill="#c8a030"/>` : '')).join(''),
  stained: (theme, w = 70) => { let s = `<path d="M${-w / 2},-30 V-150 Q${-w / 2},-200 0,-212 Q${w / 2},-200 ${w / 2},-150 V-30Z" fill="#111"/>`; const cols = ['#b8323a', '#2a5ab0', '#d8a830', '#3a8a5a', '#8a3ab0']; for (let r = 0; r < 9; r++) for (let c = 0; c < 3; c++) { const x = -w / 2 + 5 + c * (w - 10) / 3, y = -196 + r * 18; if (y < -186 && c !== 1) continue; s += `<rect x="${f1(x)}" y="${y}" width="${f1((w - 14) / 3)}" height="16" fill="${cols[(r * 3 + c * 2 + w) % 5]}" opacity=".85"/>`; } if (theme === 'star') s += `<path d="M0,-180 l4,10 h10 l-8,6 l3,10 l-9,-6 l-9,6 l3,-10 l-8,-6 h10z" fill="#fff4b0"/>`; else if (theme === 'rise') s += `<path d="M-8,-60 l4,-70 q4,-8 8,0 l4,70z M-20,-120 l20,-12 l20,12" fill="#fff4d0" stroke="#fff4d0" stroke-width="3" opacity=".9"/><circle cx="0" cy="-146" r="8" fill="#fff4d0"/>`; s += `<path d="M${-w / 2},-30 V-150 Q${-w / 2},-200 0,-212 Q${w / 2},-200 ${w / 2},-150 V-30Z" fill="none" stroke="#2a2830" stroke-width="5"/>`; return s; },
  window: (storm, narrow) => { const w = narrow ? 26 : 50; return `<rect x="${-w / 2}" y="-200" width="${w}" height="80" fill="${storm ? '#1a2030' : '#26324a'}" stroke="#1a120b" stroke-width="4"/>${storm ? Array.from({ length: 8 }, (_, i) => `<line x1="${-w / 2 + 3 + i * w / 8}" y1="-196" x2="${-w / 2 + i * w / 8}" y2="-124" stroke="#8aa0c0" stroke-width=".8" opacity=".6"/>`).join('') + `<path d="M${w / 6},-198 l-6,24 h6 l-8,22" stroke="#e8f0ff" stroke-width="1.5" fill="none" opacity=".7"/>` : ''}<line x1="0" y1="-200" x2="0" y2="-120" stroke="#1a120b" stroke-width="2"/>`; },
  skylight: () => `<rect x="-50" y="-214" width="100" height="26" fill="#d8dcd0" opacity=".85" stroke="#2a2a26" stroke-width="3"/><path d="M-16,-214v26M18,-214v26" stroke="#2a2a26" stroke-width="2"/><polygon points="-50,-188 50,-188 110,0 -90,0" fill="#e8ecd8" opacity=".06"/>`,
  torch: () => `<path d="M-4,-120 l-10,-14 h28 l-10,14z" fill="#3a3a3a"/><rect x="-4" y="-150" width="8" height="30" fill="#6a4a28"/><path d="M-8,-150 q-2,-20 8,-30 q10,12 8,30z" fill="#ff9a30"/><path d="M-3,-150 q0,-12 3,-18 q5,8 3,18z" fill="#ffe08a"/>`,
  bones: () => { let s = ''; for (let i = 0; i < 14; i++) { const x = -150 + (i * 53) % 300, y = -200 + (i * 37) % 170, a = (i * 47) % 180; s += `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-12" y="-2" width="24" height="4" fill="#d8d0bc"/><circle cx="-12" cy="-2" r="3" fill="#d8d0bc"/><circle cx="-12" cy="2" r="3" fill="#d8d0bc"/><circle cx="12" cy="-2" r="3" fill="#d8d0bc"/><circle cx="12" cy="2" r="3" fill="#d8d0bc"/></g>`; if (i % 5 === 0) s += `<g transform="translate(${x + 20} ${y + 14})"><circle r="8" fill="#e0d8c4"/><circle cx="-3" cy="-1" r="2" fill="#222"/><circle cx="3" cy="-1" r="2" fill="#222"/></g>`; } return s; },
  contraption: () => { let s = `<rect x="-150" y="-210" width="300" height="206" fill="#3a3020"/>`; for (let i = 0; i < 7; i++) { const x = -120 + i * 40, y = -160 + (i % 3) * 40, r = 16 + (i % 2) * 8; s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#b8945a" stroke-width="4" stroke-dasharray="4 3"/><circle cx="${x}" cy="${y}" r="3" fill="#b8945a"/>`; } s += `<path d="M-130,-190 L-50,-120 L20,-180 L110,-100 M-100,-40 h200 M-60,-200 v160 M60,-200 v170" stroke="#c8b890" stroke-width="1.5" fill="none"/><circle cx="30" cy="-60" r="14" fill="none" stroke="#c8b890" stroke-width="2"/><circle cx="30" cy="-60" r="4" fill="#8a8a8a"/><rect x="-150" y="-210" width="300" height="206" fill="#a8c0b0" opacity=".25"/><path d="M-140,-200 v40 M-120,-200 v70 M100,-200 v50" stroke="#e8f0e8" opacity=".25" stroke-width="3"/>`; return s; },
  amberSheet: () => `<rect x="-160" y="-214" width="320" height="210" fill="#a8782a" opacity=".9"/><path d="M-160,-150 h320 M-160,-80 h320" stroke="#6a4a14" opacity=".4"/>`,
  slab: () => `<rect x="-46" y="-130" width="92" height="130" fill="#7a6a54" stroke="#2a2218" stroke-width="3"/><path d="M-40,-70 h80" stroke="#2a2218" opacity=".4"/><path d="M-60,0 q30,-14 60,-4 q30,-10 60,4z" fill="#d8b878"/>`,
  metalBarrier: () => `<rect x="-60" y="-170" width="120" height="170" fill="#4a4c52" stroke="#1a1a1e" stroke-width="3"/>${[-40, -20, 0, 20, 40].map(x => `<line x1="${x}" y1="-170" x2="${x}" y2="0" stroke="#2a2a2e" stroke-width="2"/>`).join('')}`,
  castle: () => { let s = ''; for (let x = -180; x < 180; x += 40) s += `<rect x="${x}" y="-214" width="22" height="18" fill="#000" opacity=".3"/>`; for (const x of [-110, 0, 110]) s += `<rect x="${x - 4}" y="-170" width="8" height="40" fill="#0a0806" opacity=".8"/><rect x="${x - 12}" y="-154" width="24" height="7" fill="#0a0806" opacity=".8"/>`; return s; },
  hostileLight: () => ''
};

// ---------------------------------------------------------------- what the room descriptions name
// [pattern, where, width, draw(match, ctx) -> local svg, label]

// Bohemia's mural: the style and subject come from the text ("a yellow chair")
function muralArt(t) {
  const style = /pointillist/.test(t) ? 'dots' : /pre-raphaelite/.test(t) ? 'smooth' : /cubist/.test(t) ? 'cubes' : 'brush';
  const subj = /park by a lake/.test(t) ? 'park' : /virgin mary/.test(t) ? 'virgin' : /plate of fish/.test(t) ? 'fish' : /waitress/.test(t) ? 'bar' : /parasol/.test(t) ? 'parasol' : /yellow chair/.test(t) ? 'chair' : /lilies/.test(t) ? 'lilies' : /bathers/.test(t) ? 'bathers' : /chateau/.test(t) ? 'chateau' : 'abstract';
  const W = 260, H = 150, X = -130, Y = -170;
  let bg = '#c8b890', s = '';
  const sky = c => `<rect x="${X}" y="${Y}" width="${W}" height="${H * .55}" fill="${c}"/>`, ground = c => `<rect x="${X}" y="${Y + H * .55}" width="${W}" height="${H * .45}" fill="${c}"/>`;
  const fig = (x, y, k, col, hat) => `<path d="M${x - 6 * k},${y} l${3 * k},${-26 * k} h${6 * k} l${3 * k},${26 * k}z" fill="${col}"/><circle cx="${x}" cy="${y - 31 * k}" r="${5 * k}" fill="#e0c0a0"/>${hat ? `<path d="M${x - 14 * k},${y - 40 * k} q14,-14 28,0z" fill="${hat}"/>` : ''}`;
  if (subj === 'park') { s = sky('#a8c8e0') + ground('#6a9a4a') + `<ellipse cx="40" cy="${Y + H * .62}" rx="90" ry="12" fill="#4a7ab0"/>` + fig(-70, -36, 1.2, '#2a2a3a', '#2a2a3a') + fig(-40, -40, 1, '#6a3a5a') + `<circle cx="-100" cy="${Y + 40}" r="24" fill="#3a6a2a"/>`; }
  else if (subj === 'virgin') { s = `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#3a4a6a"/><path d="M40,${Y} L-20,${Y + H}" stroke="#fff4c8" stroke-width="40" opacity=".25"/>` + `<path d="M-30,-20 q4,-70 30,-80 q26,10 30,80z" fill="#2a4aa8"/><circle cx="0" cy="-108" r="11" fill="#f0d8c0"/><circle cx="0" cy="-108" r="18" fill="none" stroke="#f0d060" stroke-width="3"/>`; }
  else if (subj === 'fish') { s = `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#a89a7a"/>` + `<polygon points="-30,-20 -40,-90 0,-110 40,-90 30,-20" fill="#8a5a3a"/><polygon points="-14,-110 14,-110 20,-80 -20,-80" fill="#e0c0a0"/><ellipse cx="0" cy="-118" rx="34" ry="6" fill="#e8e8e8"/><path d="M-22,-124 q12,-8 24,0 l6,-5 v10 l-6,-5 q-12,8 -24,0z" fill="#8aa8b8"/>`; }
  else if (subj === 'bar') { s = `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#3a3028"/><rect x="${X}" y="-60" width="${W}" height="40" fill="#6a4a2a"/>${[-100, -80, 70, 90, 110].map((x, i) => `<rect x="${x}" y="-84" width="8" height="24" rx="2" fill="${['#3a6a3a', '#c8a040', '#8a3a2a', '#c8a040', '#3a5a8a'][i]}"/>`).join('')}` + fig(0, -60, 1.6, '#2a2a3a') + `<circle cx="-60" cy="${Y + 24}" r="8" fill="#f0e0a0" opacity=".8"/><circle cx="50" cy="${Y + 20}" r="8" fill="#f0e0a0" opacity=".8"/>`; }
  else if (subj === 'parasol') { s = sky('#b8d0e8') + ground('#9ab860') + fig(0, -40, 1.6, '#e8e8f0') + `<path d="M-34,-108 q34,-34 68,0z" fill="#5a8a5a"/><line x1="0" y1="-108" x2="0" y2="-80" stroke="#4a3a2a" stroke-width="2"/>`; }
  else if (subj === 'chair') { s = `<rect x="${X}" y="${Y}" width="${W}" height="${H * .6}" fill="#a8b8a0"/><rect x="${X}" y="${Y + H * .6}" width="${W}" height="${H * .4}" fill="#c88a4a"/><path d="M-26,-34 v-70 M26,-34 v-70 M-26,-60 h52 M-26,-80 h52 M-26,-100 h52" stroke="#e8c030" stroke-width="7"/><path d="M-34,-60 h68 v8 h-68z M-30,-52 v30 M30,-52 v30" fill="#e8c030" stroke="#e8c030" stroke-width="6"/>`; }
  else if (subj === 'lilies') { s = `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#4a7a8a"/>${[[-90, -120], [-30, -80], [40, -130], [90, -60], [-80, -40], [10, -40]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="7" fill="#4a8a4a"/><circle cx="${x + 4}" cy="${y - 3}" r="4" fill="#f0c8d8"/>`).join('')}`; }
  else if (subj === 'bathers') { s = sky('#a8c0d8') + `<rect x="${X}" y="${Y + H * .55}" width="${W}" height="${H * .45}" fill="#5a8ab0"/>` + `<circle cx="-110" cy="${Y + 30}" r="30" fill="#4a7a3a"/><circle cx="110" cy="${Y + 26}" r="34" fill="#4a7a3a"/>` + [-60, -20, 30, 70].map(x => `<ellipse cx="${x}" cy="-50" rx="6" ry="14" fill="#e0b090" opacity=".8"/><circle cx="${x}" cy="-68" r="5" fill="#e0b090"/>`).join(''); }
  else if (subj === 'chateau') { s = sky('#b8c8e0') + ground('#a8a050') + `<rect x="-50" y="-110" width="100" height="56" fill="#e8d8b8"/><polygon points="-56,-110 0,-140 56,-110" fill="#b85a3a"/>${[-34, -10, 14, 38].map(x => `<rect x="${x - 4}" y="-96" width="8" height="12" fill="#5a4a3a"/>`).join('')}<path d="M${X},-60 q60,-30 130,-10 q60,-20 130,6" stroke="#6a8a3a" stroke-width="8" fill="none"/>`; }
  else { s = `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#c8b890"/>`; }
  if (style === 'cubes' || subj === 'abstract') for (let i = 0; i < 14; i++) { const x = X + (i * 37) % W, y = Y + (i * 53) % (H - 30); s += `<polygon points="${x},${y} ${x + 30},${y + 8} ${x + 22},${y + 36} ${x - 6},${y + 26}" fill="${['#8a5a3a', '#6a7a8a', '#c8a050', '#4a4a3a'][i % 4]}" opacity="${subj === 'abstract' ? .85 : .3}"/>`; }
  if (style === 'dots') for (let i = 0; i < 160; i++) { const x = X + 4 + (i * 41) % (W - 8), y = Y + 4 + (i * 67) % (H - 8); s += `<circle cx="${x}" cy="${y}" r="2.2" fill="${['#f0e0a0', '#a8d0f0', '#8ab870', '#f0b0a0'][i % 4]}" opacity=".7"/>`; }
  if (style === 'brush') for (let i = 0; i < 18; i++) { const x = X + 8 + (i * 47) % (W - 30), y = Y + 8 + (i * 31) % (H - 16); s += `<path d="M${x},${y} q8,-4 16,0" stroke="#fff8e0" stroke-width="3" opacity=".25" fill="none"/>`; }
  return `<g transform="translate(0 -20)"><rect x="${X - 6}" y="${Y - 6}" width="${W + 12}" height="${H + 12}" fill="#7a6a5a"/>${s}</g>`;
}

// the game's own state wins over a description the player has not refreshed yet (opened since the last look)
const DOOR_OPEN = () => `<rect x="-38" y="-150" width="76" height="150" fill="#0e0a06"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${-30 + i * 4},${-8 - i * 22} h${60 - i * 8}" stroke="#6a5a44" stroke-width="5"/>`).join('')}<path d="M-38,-150 L-62,-140 L-62,-6 L-38,0Z" fill="#5a4a34" stroke="#2a2014" stroke-width="2"/>${[0, 1, 2, 3, 4, 5].map(r => `<path d="M-58,${-128 + r * 20} l18,${2 + r % 2}" stroke="#1a1008" stroke-width="2" opacity=".7"/>`).join('')}`;
const MURAL_ASIDE = () => `<rect x="-150" y="-200" width="160" height="200" fill="#0a0806"/>${[0, 1, 2, 3].map(i => `<path d="M${-136 + i * 10},${-30 - i * 26} h${120 - i * 20}" stroke="#4a3e30" stroke-width="5"/>`).join('')}<g transform="translate(110 0)">${WS.mural()}</g>`;
const HATCH_OPEN = () => `<ellipse cx="0" cy="-6" rx="44" ry="13" fill="#2a2016" stroke="#3a2414" stroke-width="2.5"/><ellipse cx="0" cy="-5" rx="36" ry="9" fill="#030201"/><path d="M-36,-5 Q0,8 36,-5" stroke="#4a3018" stroke-width="2" fill="none" opacity=".7"/><g transform="translate(54 -8) rotate(-8)"><ellipse cx="0" cy="0" rx="20" ry="6" fill="#7a5630" stroke="#3a2414" stroke-width="2"/></g>`;
const COVER_RAISED =() => `<ellipse cx="0" cy="-12" rx="40" ry="13" fill="#4a4036" stroke="#2a221a" stroke-width="3"/><ellipse cx="0" cy="-12" rx="32" ry="9" fill="#020202"/><path d="M-50,-14 L-36,-70 H36 L50,-14Z" fill="#6a4a28" stroke="#2a180a" stroke-width="2" transform="translate(0 -6)"/><path d="M-30,-44 h60 M-24,-62 h48" stroke="#3a2614" stroke-width="2"/>`;
// the Spirit World tomb ages as you lie in it: cracks, dust and faded paint grow with the centuries
const TOMB_AGE = [['beautifully well-preserved', 0], ['weighed under with centuries', 1], ['a thousand years old', 2], ['two thousand years old', 3], ['it has been opened', 4]];
const tombAge = ctx => { const h = ctx.h, t = ctx.rd.t; let a = -1; for (const [p, n] of TOMB_AGE) if (t.includes(p)) a = Math.max(a, n); if (a <= 0) return;
  for (let i = 0; i < a * 6; i++) { const x = h.R(10, 390), y = h.R(20, 200); h.add(`<path d="M${x.toFixed(0)},${y.toFixed(0)} l${h.R(-14, 14).toFixed(0)},${h.R(6, 18).toFixed(0)} l${h.R(-10, 10).toFixed(0)},${h.R(6, 16).toFixed(0)}" stroke="#3a2a20" stroke-width="1.2" fill="none" opacity=".55"/>`); }
  for (let i = 0; i < a * 20; i++) h.add(`<circle cx="${h.R(0, 400).toFixed(0)}" cy="${h.R(200, 260).toFixed(0)}" r="${h.R(.8, 2.4).toFixed(1)}" fill="#c8b89a" opacity=".35"/>`);
  h.add(`<rect width="400" height="260" fill="#8a8070" opacity="${(a * .06).toFixed(2)}"/>`); };
const isOpen = (ctx, obj) => !!(ctx.h.st && ctx.h.st.known && ctx.h.st.open(obj, false));
const FEAT = [
  ['revolving door', 'special', 0, (m, ctx) => { const { h } = ctx; h.add(`<path d="M60,0 Q20,130 60,260 M340,0 Q380,130 340,260" stroke="#c8d8e0" stroke-width="5" fill="none" opacity=".5"/><rect x="60" y="0" width="280" height="260" fill="#a8c0d0" opacity=".1"/><path d="M200,10 V250" stroke="#2a2a2a" stroke-width="6"/><path d="M90,20 l40,200 M300,30 l-30,180" stroke="#fff" stroke-width="2" opacity=".2"/>`); return ''; }],
  ['tomb is beautifully well-preserved|tomb seems older now|tomb swelters now|two thousand years old|it has been opened', 'special', 0, (w, ctx) => tombAge(ctx), 'tomb age'],
  ['slightly to one side', 'wall:south', .78, () => MURAL_ASIDE(), 'mural'],
  ['bronze mural', 'wall:south', .78, (m, ctx) => isOpen(ctx, 'bronze mural') ? MURAL_ASIDE() : WS.mural(), 'mural'],
  ['mural painting', 'wall', .8, (m, ctx) => muralArt(ctx.rd.t), 'mural'],
  ['impressionist mural', 'wall', .8, () => `<g transform="translate(0 -20)"><rect x="-130" y="-170" width="260" height="150" fill="#c8b890"/><rect x="-130" y="-60" width="260" height="40" fill="#6a3a24"/><path d="M-130,-60 h260" stroke="#8a5a34" stroke-width="5"/>${[-110, -80, -50, 60, 90, 110].map((x, i) => `<rect x="${x}" y="-100" width="10" height="40" rx="2" fill="${['#3a6a3a', '#c8a040', '#8a3a2a', '#3a5a8a', '#c8a040', '#3a6a3a'][i]}" opacity=".8"/>`).join('')}<path d="M-14,-60 l4,-58 q10,-10 20,0 l4,58z" fill="#2a2a3a"/><circle cx="0" cy="-128" r="10" fill="#e8c8a8"/><path d="M-10,-136 q10,-10 20,0" fill="#c89040"/><path d="M-120,-160 q60,-10 100,6 M30,-164 q50,-6 90,8" stroke="#e8d8a8" stroke-width="6" fill="none" opacity=".5"/></g>`, 'mural'],
  ['bronze mirror', 'wall', .9, () => `<rect x="-160" y="-212" width="320" height="208" fill="${'#b88a4a'}"/><rect x="-150" y="-202" width="300" height="188" fill="#8a6a3a" opacity=".55"/><path d="M-130,-190 l60,170 M40,-200 l50,160" stroke="#f0d8a0" stroke-width="6" opacity=".25"/>`, 'mirror'],
  ['see-saw', 'floor:back', .6, () => `<rect x="-140" y="-150" width="280" height="150" fill="#a8c0b0" opacity=".18" stroke="#c8d8d0" stroke-width="2"/><path d="M-90,-40 L90,-70" stroke="#7a5430" stroke-width="7"/><path d="M-6,0 L0,-56 L6,0Z" fill="#5a3a1a"/><path d="M-110,-40 q20,26 40,0z M70,-70 q20,26 40,0z" fill="#8a5a2a" stroke="#4a2a10"/>`, 'see-saw', 1, { d: .7 }],
  ['iron panel', 'floor', .3, () => `<rect x="-40" y="-110" width="80" height="54" fill="#4a4a50" stroke="#1a1a1e" stroke-width="3"/>${Array.from({ length: 15 }, (_, i) => `<rect x="${-34 + (i % 5) * 14}" y="${-104 + Math.floor(i / 5) * 16}" width="10" height="12" fill="#2a2a2e" stroke="#6a6a72"/>`).join('')}<rect x="-4" y="-56" width="8" height="56" fill="#3a3a40"/>`, 'panel', 1, { d: .3 }],
  ['bas relief|relief|frieze|carvings|carved|inlaid with carvings', 'band', .9, (m, ctx) => { const t = ctx.rd.t; return WS.relief(/fish|waves|nets/.test(t) ? 'fish' : /wheat/.test(t) ? 'wheat' : /hoplite|warriors|battle/.test(t) ? 'warriors' : /grape|vine/.test(t) ? 'grapes' : /seasons/.test(t) ? 'seasons' : /hunters|spear-carriers/.test(t) ? 'hunters' : ''); }, null, 'relief'],
  ['hieroglyphics', 'band', .9, () => WS.glyphs(), 'hieroglyphics'],
  ['painted writings|dull painted writings', 'band', .8, () => WS.writings(), 'writings'],
  ['painted scenes', 'band', .9, () => WS.scenes(), 'scenes'],
  ['glass ornaments', 'band', .9, () => [-120, -70, -20, 30, 80, 130].map((x, i) => `<circle cx="${x}" cy="-70" r="7" fill="${['#3ab0a0', '#d0508a', '#e8c040', '#5a8ad8'][i % 4]}" opacity=".85"/><circle cx="${x - 2}" cy="-72" r="2" fill="#fff" opacity=".7"/>`).join(''), 'ornaments'],
  ['curious sockets|sockets', 'wall:west', .34, (m, ctx) => {
    const st = ctx.h.st, t = ctx.rd.t, ord = ['first', 'second', 'third'];
    const lk = /projects from the (first|second|third) socket/.exec(t);
    const fixed = st.known && st.here('sceptre') ? ord.findIndex(o => (st.link('sceptre') || '').startsWith(o)) : lk ? ord.indexOf(lk[1]) : -1;
    if (!/painting of a priest/.test(t)) return WS.sockets(fixed);
    ctx.doneF.add('painting');
    return WS.sockets(fixed, -204) + `<g transform="translate(0 34) scale(.8)">${WS.painting(70, 110, 'priest')}</g>`;
  }, 'sockets'],
  ['painting of a priest', 'wall', .34, () => WS.painting(70, 110, 'priest'), 'painting'],
  ['still life', 'wall:side', .5, () => WS.painting(150, 64, 'still'), 'still life'],
  ['posters', 'walls', .7, () => WS.posters(), 'posters'],
  ['tapestry', 'wall', .4, (m, ctx) => WS.tapestry(ctx.rd.has('bear')), 'tapestry'],
  ['inset shelves|shelves|scrolls beyond count', 'walls', .9, (m, ctx) => WS.shelves(280, ctx.rd.has('scroll')), 'shelves'],
  ['pigeonhole', 'wall', .26, () => WS.pigeonhole(), 'pigeonhole'],
  ['stained glass windows|stained glass', 'wall', .3, (m, ctx) => WS.stained(ctx.rd.has('nativity') ? 'star' : ctx.rd.has('resurrection') ? 'rise' : ''), 'windows', 3],
  ['narrow dark windows|windows are high|high windows|windows', 'wall', .16, (m, ctx) => WS.window(ctx.rd.has('storm'), /narrow/.test(m)), 'windows', 2],
  ['skylight', 'wall', .34, () => WS.skylight(), 'skylight'],
  ['niche', 'wall', .3, () => WS.niche(), 'niche', 1, { surf: [0, -40] }],
  ["ship's wheel|eight-spoked", 'wall:northwest', .34, () => S.shipwheel(), 'wheel'],
  ['torches bracketed|flaming torches', 'torches', 0, () => WS.torch(), 'torches'],
  ['decorated with bones', 'band', .9, () => WS.bones(), 'bones'],
  ['contraption|cogs|pulleys', 'wall:west', .9, () => WS.contraption(), 'contraption'],
  ['amber-coloured metal', 'wall:north', .9, () => WS.amberSheet(), 'metal'],
  ['ingenious stone slab|stone slab', 'wall', .3, () => WS.slab(), 'slab'],
  ['metal barrier', 'end', .5, () => WS.metalBarrier(), 'barrier'],
  // This Is The Death: the passage ends in marble until the burial chamber is opened
  ['solid marble wall', 'end', .5, () => `<rect x="-70" y="-160" width="140" height="160" fill="#e4ddd0" stroke="#9a9284" stroke-width="2"/><path d="M-70,-110 L-20,-96 L30,-120 L70,-104 M-40,-160 L-30,-60 M20,-40 L60,-10" stroke="#b8b0a2" stroke-width="1.5" fill="none"/>`, 'marble wall'],
  ['onto the burial chamber', 'end', .5, () => `<rect x="-70" y="-160" width="140" height="160" fill="#0a0806"/><path d="M-70,0 L-40,-30 H40 L70,0Z" fill="#3a3024"/><rect x="-30" y="-60" width="60" height="30" fill="#2a2018" opacity=".8"/>`, 'opening'],
  // Beside the Wall: the timber hatch over the old barrel-shaft
  ['timber hatch, three feet across', 'floor', .3, (m, ctx) => isOpen(ctx, 'timber hatch') ? HATCH_OPEN() : `<ellipse cx="0" cy="-6" rx="44" ry="13" fill="#7a5630" stroke="#3a2414" stroke-width="2.5"/>${[-26, -9, 9, 26].map(x => `<line x1="${x}" y1="${-17 + Math.abs(x) / 5}" x2="${x}" y2="${5 - Math.abs(x) / 5}" stroke="#4a3018" stroke-width="1.5"/>`).join('')}<rect x="-6" y="-9" width="12" height="5" fill="#5a5a5a"/>`, 'hatch', 1, { d: .7 }],
  ['timber lid stands open', 'floor', .3, () => HATCH_OPEN(), 'hatch', 1, { d: .7 }],
  ['castle walls|arrowslits', 'band', .9, () => WS.castle(), 'walls'],
  ['crowded, bohemian|noisy, bustling|crowded', 'floor:back', .9, () => [-120, -70, 60, 120].map((x, i) => `<g transform="translate(${x} 0)">${S.table(46, '#e8e0d0')}<g transform="translate(${i % 2 ? 22 : -22} 0)"><rect x="-9" y="-74" width="18" height="40" rx="6" fill="${['#3a2a3a', '#5a3a2a', '#2a3a4a', '#4a4a2a'][i]}"/><circle cy="-82" r="8" fill="#d8b090"/></g></g>`).join(''), 'customers', 1, { d: .7 }],
  ['defaced door opens', 'wall', .3, () => DOOR_OPEN(), 'door'],
  ['door heavily defaced', 'wall', .3, (m, ctx) => isOpen(ctx, 'defaced door') ? DOOR_OPEN() : `<rect x="-38" y="-150" width="76" height="150" fill="#5a4a34" stroke="#2a2014" stroke-width="3"/>${Array.from({ length: 9 }, (_, r) => `<path d="M-32,${-140 + r * 15} ${Array.from({ length: 7 }, (_, i) => `l${7 + (i * 5 + r) % 4},${((i + r) % 3) - 1}`).join(' ')}" stroke="#1a1008" stroke-width="2" fill="none" opacity=".7"/>`).join('')}`, 'door'],
  ['cell door|only door is shut|the only door', 'wall', .3, (m, ctx) => `<rect x="-38" y="-150" width="76" height="150" fill="#060504"/><rect x="-35" y="-147" width="70" height="147" fill="#5a3a20" stroke="#2a180c" stroke-width="2"/>${/cell/.test(m) ? `<rect x="-16" y="-128" width="32" height="24" fill="#0a0806"/><path d="M-8,-128v24M0,-128v24M8,-128v24" stroke="#6a6a6a" stroke-width="2"/>` : ''}<circle cx="24" cy="-74" r="3" fill="#c8a060"/>`, 'door'],
  ['natural pillars of rock', 'rockpillars', 0, null, 'pillars'],
  ['columns|pillars?(?! of rock)|colonnaded|colonnade|ringed with columns', 'columns', 0, null, 'columns'],
  ['twisty little passages|maze of', 'maze', 0, null, 'passages'],
  ['bathed in hostile light|hostile light', 'hostile', 0, null, 'light'],
  ['hundreds of thousands of books|thousands of books', 'band', .9, () => WS.shelves(300, true), 'books'],
  ['revealing a circular well', 'floor', .3, () => COVER_RAISED(), 'cover', 1, { d: .25 }],
  ['hinged wooden cover', 'floor', .3, (m, ctx) => isOpen(ctx, 'kitchen well') ? COVER_RAISED() : `<path d="M-50,0 L-36,-26 H36 L50,0Z" fill="#6a4a28" stroke="#2a180a" stroke-width="2"/><path d="M-30,-8 h60 M-24,-18 h48" stroke="#3a2614" stroke-width="2"/><rect x="30" y="-10" width="10" height="4" fill="#8a8a8a"/>`, 'cover', 1, { d: .25 }],
  ['vents in the roof', 'ceilvents', 0, null, 'vents'],
  ['entirely filled with dry sand', 'fillsand', 0, null, 'sand'],
  ['fallen tombstone', 'floor', .7, () => `<path d="M-120,0 L-90,-30 H90 L120,0Z" fill="#6a6660" stroke="#3a3834" stroke-width="2"/><path d="M0,-26 v20 M-12,-18 h24" stroke="#3a3834" stroke-width="3"/><path d="M-70,-12 h40 M40,-12 h40" stroke="#4a4844" stroke-width="2"/>`, 'tombstone', 1, { d: .12 }],
  ['lamps chained|trestle lamps', 'ceil', 0, null, 'lamps'],
  ['square hole in the roof|light streams in(?!, searing)|hole through which', 'beam', 0, null, 'hole'],
  ['mosaic', 'floorpat', 0, null, 'mosaic'],
  ['strewn with leaves', 'leaves', 0, null, 'leaves'],
  ['sand spills|filled with dry sand|dry sand', 'sand', 0, null, 'sand'],
  ['bone pit|broken bones|crushed', 'bonepit', 0, null, 'bones'],
  ['glass cabinets|cabinets', 'floor:back', .5, (m, ctx) => [-62, 0, 62].map((x, i) => `<g transform="translate(${x} 0)">${S.cabinet()}${i === 1 && (ctx.rd.has('broken glass cabinet') || isOpen(ctx, 'glass cabinet')) ? `<rect x="-21" y="-112" width="42" height="96" fill="#1a120a" opacity=".55"/><path d="M-21,-112 l12,30 l-6,22 M21,-112 l-14,26 l8,18 M-21,-30 l16,-14 l10,10" stroke="#d8e8f0" stroke-width="1.5" fill="none"/><path d="M-30,2 l8,-4 l4,4z M14,2 l10,-5 l3,5z M-6,2 l6,-3 l2,3z" fill="#c8dce8" opacity=".8"/>` : ''}</g>`).join(''), 'cabinets', 1, { d: .7 }],
  ['crate after crate|crates', 'floor', .7, () => S.crates(4), 'crates', 1, { d: .45, surf: [-62, -96] }],
  ['display table', 'floor', .3, () => S.table(70, '#3a2a4a'), 'table', 1, { d: .5, surf: [0, -52] }],
  ['trestle table', 'floor', .5, () => S.trestle(), 'table', 1, { d: .55, surf: [0, -56] }],
  ['writing implements|sand-wells|documents on his desk|desk', 'floor', .45, () => S.desk(), 'desk', 1, { d: .5, surf: [0, -60] }],
  ['behind the bar|the bar', 'floor', .7, () => S.bar(), 'bar', 1, { d: .6 }],
  ['a table for one|table for one', 'floor', .35, () => S.table(70, '#e8e0d0') + `<g transform="translate(-90 0)">${S.table(60, '#e8e0d0')}</g><g transform="translate(96 0)">${S.table(60, '#e8e0d0')}</g>`, 'table', 1, { d: .25, surf: [0, -52] }],
  ['one table|on the table|tables?|a table', 'floor', .32, () => S.table(), 'table', 1, { d: .4, surf: [0, -52] }],
  ['couch', 'floor', .34, () => S.couch(), 'couch', 1, { d: .5 }],
  ['a bed|bed is', 'floor', .4, () => S.bed(), 'bed', 1, { d: .5 }],
  ['statue of (?:the )?(?:god(?:dess)? )?\\w+|marble statue of \\w+', 'floor', .26, (m, ctx) => {
    // every statue that stands here: the game's state says which (statues can be pushed from room to room), else the text
    const st = ctx.h.st, flower = st.inside('statue of diana').some(n => /rose|flower/i.test(n)) || /flower is placed .* in her hair/.test(ctx.rd.t);
    let gods = st.known ? (st.hereList || []).map(n => /^statue of (\w+)$/i.exec(n)).filter(Boolean).map(x => x[1].toLowerCase()) : [];
    if (!gods.length) gods = [...ctx.rd.t.matchAll(/statue of (?:the )?(?:god(?:dess)? )?(\w+)/g)].map(x => x[1]);
    if (!gods.length) return S.statue(m, ctx.rd.has('tall'), flower);
    gods = [...new Set(gods)].slice(0, 3);
    const off = gods.length === 1 ? [0] : gods.length === 2 ? [-46, 46] : [-80, 0, 80];
    return gods.map((g, i) => `<g transform="translate(${off[i]} 0)">${S.statue('statue of ' + g, ctx.rd.has('tall'), flower && /diana/.test(g))}</g>`).join('');
  }, 'statue', 1, { d: .42, label: m => /^statue$/.test(m) ? 'statue' : m.replace(/^.*statue of (the )?(god(dess)? )?/, ''), state: ctx => (ctx.h.st.hereList || []).some(n => /^statue of \w+$/i.test(n)) ? { w: 'statue', i: 0 } : null }],
  ['headless adamantine statue|knight on a tomb', 'floor', .6, (m, ctx) => {
    const st = ctx.h.st, t = ctx.rd.t, f = st.fitted('adamantine statue');
    // once he has leapt up, only the tomb is left
    if (st.known && !st.here('adamantine statue')) return S.tombKnight({ gone: true });
    return S.tombKnight({ hand: f.includes('adamantine hand') || /hand outstretched/.test(t), skull: f.includes('adamantine skull') || (/adamantine statue/.test(t) && !/headless/.test(t)), heart: f.includes('adamantine heart') || /heart in his ribcage/.test(t) });
  }, 'knight', 1, { d: .45 }],
  // the square opening in the Labyrinth floor, and the inscribed stone wedged across it
  ['opening in the floor|opening is securely wedged', 'floor', .34, (m, ctx) => {
    const st = ctx.h.st, wedged = (st.known && st.here('inscribed stone')) || /wedged with the stone/.test(ctx.rd.t);
    let s = `<path d="M-40,0 L-28,-22 H28 L40,0Z" fill="#0a0806" stroke="#5a4a34" stroke-width="2"/>`;
    if (wedged) s += `<path d="M-46,2 L-32,-26 H32 L46,2Z" fill="#b8b0a0" stroke="#6a6458" stroke-width="2"/><path d="M-26,-16 h12 M-8,-16 h20 M-30,-8 h18 M-6,-8 h26" stroke="#5a5448" stroke-width="2"/>`;
    if (ctx.rd.has('inscriptions')) s += `<g opacity=".55">${[-90, -76, 64, 80].map((x, i) => `<path d="M${x},-6 l4,-10 l4,10 M${x + 2},-2 h8" stroke="#3a3024" stroke-width="1.6" fill="none" transform="translate(0 ${i % 2 * 6})"/>`).join('')}</g>`;
    return s;
  }, 'opening', 1, { d: .3 }],
  ['sphinxes|sphinx', 'sphinxes', 0, null, 'sphinxes'],
  ['altar stone|altar', 'floor', .34, (m, ctx) => S.altar(ctx.rd.has('flaming')), 'altar', 1, { d: .5 }],
  ['mummy case|sarcophagus, rests|gold and blue|coffin is open', 'floor', .6, (m, ctx) => S.mummy((ctx.h.st.known && ctx.h.st.open('mummy case', false)) || ctx.rd.has('coffin is open')), 'mummy case', 1, { d: .55 }],
  ['easels|brushes', 'floor', .5, () => `<g transform="translate(-50 0)">${S.easel(0)}</g><g transform="translate(50 6)">${S.easel(1)}</g>${[-80, -20, 30, 90].map((x, i) => `<rect x="${x}" y="-3" width="20" height="3" fill="${['#c84a3a', '#3a7ab8', '#e8b040', '#3a8a5a'][i]}" transform="rotate(${i * 30} ${x} 0)"/>`).join('')}`, 'easels', 1, { d: .45 }],
  ['kiosk', 'floor', .34, () => S.kiosk(), 'kiosk', 1, { d: .5 }],
  ['ticket gates', 'floor:back', .6, () => [-80, -40, 0, 40, 80].map(x => `<rect x="${x - 4}" y="-50" width="8" height="50" fill="#6a6a70"/><rect x="${x + 4}" y="-34" width="30" height="5" fill="#a8a8b0"/>`).join(''), 'gates', 1, { d: .75 }],
  ['broken globe|globe', 'floor', .3, () => S.globe(), 'globe', 1, { d: .45, surf: [0, -40] }],
  ['troughs', 'floor', .7, () => S.troughs(), 'troughs', 1, { d: .4 }],
  ['crude armour|armour|spears', 'floor', .5, () => S.armour(), 'armour', 1, { d: .6 }],
  ['animal hides|rough blankets', 'floor', .5, () => S.hides(), 'blankets', 1, { d: .2 }],
  ['log fires|fires which are kept', 'floor', .8, () => S.fires(), 'fires', 1, { d: .6 }],
  ['capstan', 'floor', .3, () => S.capstan(), 'capstan', 1, { d: .35 }],
  ['caged animals|cages', 'onsurf:table', 0, () => `<g transform="translate(-40 0)">${S.cage()}</g><g transform="translate(30 0)">${S.cage()}</g><path d="M-10,-2 h22 l-4,-8 h-14z" fill="#8a2a2a"/><rect x="-60" y="-1" width="26" height="2" fill="#c8b890"/>`, 'cages'],
  ['little shelf', 'wall', .26, () => `<rect x="-36" y="-110" width="72" height="7" fill="#d8d0c0" stroke="#8a8272"/>`, 'shelf', 1, { surf: [0, -110] }],
  ['string quartet', 'floor:back', .5, () => [-60, -20, 20, 60].map((x, i) => `<g transform="translate(${x} 0)"><rect x="-8" y="-60" width="16" height="40" rx="5" fill="#1a1a20"/><circle cy="-68" r="8" fill="#d8b890"/><rect x="-6" y="-20" width="5" height="20" fill="#1a1a20"/><rect x="2" y="-20" width="5" height="20" fill="#1a1a20"/>${i === 3 ? '<path d="M10,-50 q8,6 4,40" stroke="#6a3a1a" stroke-width="10" fill="none"/>' : '<path d="M8,-58 l12,-6" stroke="#6a3a1a" stroke-width="5"/>'}</g>`).join(''), 'quartet', 1, { d: .8 }],
  ['drinking retsina|ashamed men|miserable', 'floor', .5, () => [-50, 40].map(x => `<g transform="translate(${x} 0)">${S.table(70)}<g transform="translate(-34 0)"><rect x="-10" y="-80" width="20" height="38" rx="6" fill="#3a3430"/><circle cy="-90" r="9" fill="#c8a080"/></g><g transform="translate(34 0)"><rect x="-10" y="-80" width="20" height="38" rx="6" fill="#2a3440"/><circle cy="-90" r="9" fill="#b89070"/></g><rect x="-4" y="-66" width="7" height="14" fill="#c8d8b0" opacity=".8"/></g>`).join(''), 'men', 1, { d: .65 }],
  ['tarot box', 'none', 0, null, '']
];

// draw the features of a room
function FEATURES(ctx, pass) {
  const { h, rd } = ctx, G = ctx.G, { add, R, tag } = h;
  const done = ctx.doneF = ctx.doneF || new Set();
  const relWall = d => { const r = ctx.rel(d); return r === 0 || r === 1 || r === 7 ? 'back' : r === 6 || r === 5 ? 'left' : r === 2 || r === 3 ? 'right' : 'back'; };
  const floorQ = [];
  for (const [src, where0, width, draw, label, count, opt] of FEAT) {
    if ((pass === 'pre') !== (where0 === 'band')) continue;
    // a thing the game's state puts here although the stored description does not (yet) say so
    const m = rd.find(src) || (opt && opt.state && ctx.h.st && ctx.h.st.known ? opt.state(ctx) : null);
    if (!m || done.has(label || src)) continue;
    if (label) done.add(label);
    const word = m.w, lbl = ((opt && opt.label ? opt.label(word) : null) || word).replace(/^(the|a|an|one) /, '');
    const T = s => tag(lbl, s);
    let where = where0;
    // the wall the text names, if any
    let side = 'back';
    if (/^wall/.test(where)) {
      const w = ctx.walls.find(w => Math.abs(w.i - m.i) < 120);
      const named = w ? w.dir : where.includes(':') ? GT().COMPASS.indexOf(where.split(':')[1]) : null;
      side = where === 'wall:side' ? (ctx.used.left.length <= ctx.used.right.length ? 'left' : 'right') : named !== null && named >= 0 ? relWall(named) : 'back';
      if (side === 'back' && G.size === 'deep' && !/slab|barrier/.test(label || '')) side = ctx.used.left.length <= ctx.used.right.length ? 'left' : 'right';
      where = 'wall';
    }
    if (where === 'special') { draw(word, ctx); continue; }
    if (where === 'band') {
      // a band of decoration all round the walls, behind the ways out
      const body = draw(word, ctx);
      add(T(at(G.back(.5), body)));
      for (const s2 of ['left', 'right']) for (const t of G.size === 'deep' ? [.3, .7] : [.5]) add(T(Gx().onSide(G, s2, t, body)));
      continue;
    }
    if (where === 'maze') { for (const u of [.2, .8]) if (claim(ctx, 'back', .25, [u]) !== null) add(T(at(G.back(u), `<path d="M-34,0 V-120 A34,34 0 0 1 34,-120 V0Z" fill="#0a0806" opacity=".85"/>`))); for (const s2 of ['left', 'right']) { const q = G.sideQuad(s2, .38, .62, 0, .66); add(T(poly(q, 'fill="#0a0806" opacity=".85"'))); } continue; }
    if (where === 'ceilvents') { for (const u of [.3, .5, .7]) { const x = lerp(G.bx0, G.bx1, u), y = G.by0 * .55; add(T(`<rect x="${f1(x - 12)}" y="${f1(y - 3)}" width="24" height="6" fill="#d8c8a0" opacity=".7"/>`)); add(`<polygon points="${f1(x - 10)},${f1(y)} ${f1(x + 10)},${f1(y)} ${f1(x + 30)},${H} ${f1(x - 26)},${H}" fill="#e8d8b0" opacity=".05"/>`); } continue; }
    if (where === 'fillsand') { add(T(`<path d="M0,${H} L0,40 Q100,${G.by0 + 10} 200,${G.by0 + 20} Q300,${G.by0 + 6} ${W},40 L${W},${H}Z" fill="${h.lin('sd', [[0, '#c8a86a'], [1, '#e0c488']])}"/>`)); for (let i = 0; i < 12; i++) add(`<path d="M${f1(R(0, 300))},${f1(R(80, 250))} q40,-6 90,0" stroke="#f4e0b0" fill="none" opacity=".4"/>`); continue; }
    if (where === 'hostile') { add(T(`<rect y="${H - 70}" width="${W}" height="70" fill="${h.lin('hl', [[0, '#c83a1a', 0], [1, '#ff5a2a', .45]])}"/>`)); continue; }
    if (where === 'none') continue;
    if (where === 'end') { add(T(at(G.back(.5), draw(word, ctx)))); continue; }
    if (where === 'wall') {
      if (side === 'back') {
        const n = count || 1;
        const hi = opt && opt.high || /window|skylight/.test(label || '');
        for (let k = 0; k < n; k++) {
          const u = claim(ctx, hi ? 'high' : 'back', width, n > 1 ? [.2 + k * .6 / Math.max(1, n - 1), .5, .3, .7] : [.5, .3, .7, .2, .8]) ?? (hi ? claim(ctx, 'high', width * .7, [.88, .12, .74, .26]) : null);
          if (u === null) { if (n === 1) { const t = claim(ctx, 'left', .5, [.5, .3]); if (t !== null) add(T(Gx().onSide(G, 'left', t, draw(word, ctx)))); } continue; }
          const p = G.back(u);
          add(T(at(p, draw(word, ctx))));
          if (opt && opt.surf) ctx.surf[label] = { x: p.x + opt.surf[0] * p.s, y: p.y + opt.surf[1] * p.s, s: p.s };
        }
      } else {
        // find a free stretch: this wall, narrower near the corners, the other side wall, then the back wall;
        // only if all are taken does it go in the middle (never silently on top of a doorway if avoidable)
        const other = side === 'left' ? 'right' : 'left';
        let t = claim(ctx, side, .6, [.5, .4, .62]);
        if (t === null) t = claim(ctx, side, .42, [.22, .78]);
        if (t === null) { t = claim(ctx, other, .6, [.5, .4, .62]) ?? claim(ctx, other, .42, [.22, .78]); if (t !== null) side = other; }
        if (t === null) { const u = claim(ctx, 'back', width, [.5, .3, .7, .2, .8]) ?? claim(ctx, 'back', .28, [.17, .83]); if (u !== null) { ctx.used.high.push([u - .14, u + .14]); add(T(at(G.back(u), draw(word, ctx)))); continue; } t = .5; }
        add(T(Gx().onSide(G, side, t, draw(word, ctx))));
        if (opt && opt.surf) { const x = G.sideX(side, t), b = G.sideBot(t); ctx.surf[label] = { x, y: b + opt.surf[1] * .5, s: .5 }; }
      }
      continue;
    }
    if (where === 'walls') {
      const body = draw(word, ctx);
      const u = claim(ctx, 'back', width * .6, [.5, .3, .7]);
      if (u !== null) add(T(at(G.back(u), body)));
      for (const s2 of ['left', 'right']) { const t = claim(ctx, s2, .5, [.45, .3, .6]); if (t !== null) add(T(Gx().onSide(G, s2, t, body))); }
      continue;
    }
    if (where === 'torches') {
      for (const [s2, t] of [['left', .55], ['right', .55]]) { add(T(Gx().onSide(G, s2, t, draw()))); const x = G.sideX(s2, t), y = lerp(G.sideBot(t), G.sideTop(t), .6); h.glow(x, y, 80, '#ffb050', .45); }
      continue;
    }
    if (where === 'columns') { columns(ctx, T); continue; }
    if (where === 'rockpillars') { for (const u of [.18, .82]) { const p = G.floor(u, .45); add(T(at(p, `<path d="M-30,0 Q-20,-120 -36,-260 H36 Q22,-120 30,0Z" fill="#3a3028"/><path d="M-30,0 Q-20,-120 -36,-260 H-10 Q-4,-120 -8,0Z" fill="#000" opacity=".3"/>`))); } add(`<rect width="${W}" height="${H}" fill="#9a9aa8" opacity=".06"/>`); continue; }
    if (where === 'ceil') { for (const u of [.3, .7]) { const p = G.floor(u, .5); const y = p.y - 150 * p.s; add(T(`<line x1="${f1(p.x)}" y1="0" x2="${f1(p.x)}" y2="${f1(y)}" stroke="#5a5048" stroke-width="2" stroke-dasharray="3 2"/><path d="M${f1(p.x - 14 * p.s)},${f1(y)} h${f1(28 * p.s)} l${f1(-6 * p.s)},${f1(18 * p.s)} h${f1(-16 * p.s)}z" fill="#a8783a"/>`)); h.glow(p.x, y + 14 * p.s, 90, '#ffc060', .5); } continue; }
    if (where === 'beam') { const x = (G.bx0 + G.bx1) / 2; add(T(`<polygon points="${x - 30},0 ${x + 30},0 ${x + 80},${H} ${x - 60},${H}" fill="#e8ecf0" opacity=".1"/><rect x="${x - 34}" y="0" width="68" height="${f1(G.by0 * .5)}" fill="#a8b8c8" opacity=".5"/>`)); add(`<g opacity=".5">${Array.from({ length: 18 }, () => `<line x1="${f1(R(x - 40, x + 60))}" y1="${f1(R(0, 200))}" x2="${f1(R(x - 44, x + 56))}" y2="${f1(R(10, 230))}" stroke="#c8d8e8" stroke-width=".7"/>`).join('')}</g>`); continue; }
    if (where === 'floorpat') { const c = (G.bx0 + G.bx1) / 2; const y0 = G.by1 + 14, y1 = H - 16; add(T(`<polygon points="${c - 70},${y0} ${c + 70},${y0} ${c + 150},${y1} ${c - 150},${y1}" fill="#c8a870" stroke="#6a4a28" stroke-width="3"/><line x1="${c}" y1="${y0}" x2="${c}" y2="${y1}" stroke="#6a4a28" stroke-width="3"/><line x1="${c - 110}" y1="${f1((y0 + y1) / 2)}" x2="${c + 110}" y2="${f1((y0 + y1) / 2)}" stroke="#6a4a28" stroke-width="3"/><circle cx="${c - 50}" cy="${f1(y0 + 18)}" r="8" fill="#3a6a8a"/><path d="M${c + 30},${y0 + 22} q16,-12 32,0" stroke="#8a3a2a" stroke-width="4" fill="none"/><circle cx="${c - 70}" cy="${y1 - 22}" r="11" fill="#5a8a4a"/><path d="M${c + 40},${y1 - 14} l20,-24 l20,24z" fill="#c84a2a"/>`)); if (rd.has('vents')) for (const [x, y] of [[c - 90, y0 + 10], [c + 90, y0 + 10], [c - 170, y1 + 6], [c + 170, y1 + 6]]) add(tag('vents', `<rect x="${x - 10}" y="${y - 4}" width="20" height="8" fill="#0a0806"/><path d="M${x - 6},${y - 4}v8M${x},${y - 4}v8M${x + 6},${y - 4}v8" stroke="#5a4a3a"/>`)); continue; }
    if (where === 'leaves') { let s = ''; for (let i = 0; i < 40; i++) { const x = R(10, 390), y = R(G.by1 + 4, H - 4); s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(R(3, 6))}" ry="${f1(R(1.5, 3))}" fill="${['#8a5a2a', '#6a4a1a', '#a8782a', '#5a6a2a'][i % 4]}" transform="rotate(${f1(R(0, 180))} ${f1(x)} ${f1(y)})"/>`; } add(T(s)); add(`<rect width="${W}" height="${H}" fill="#6a8aa0" opacity=".08"/>`); continue; }
    if (where === 'sand') { add(T(`<path d="M0,${H} L0,${f1(G.by1 + 30)} Q120,${f1(G.by1 + 4)} 200,${f1(G.by1 + 16)} T400,${f1(G.by1 + 24)} L400,${H}Z" fill="#d8b878" opacity=".85"/>`)); continue; }
    if (where === 'bonepit') { let s = ''; for (let i = 0; i < 46; i++) { const x = R(20, 380), y = R(G.by1 + 10, H - 4), a = R(0, 180); s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})"><rect x="-10" y="-1.5" width="20" height="3" fill="#d8d0bc"/><circle cx="-10" cy="0" r="2.6" fill="#d8d0bc"/><circle cx="10" cy="0" r="2.6" fill="#d8d0bc"/></g>`; } for (let i = 0; i < 4; i++) s += `<g transform="translate(${f1(R(40, 360))} ${f1(R(G.by1 + 20, H - 20))})"><circle r="8" fill="#e0d8c4"/><circle cx="-3" cy="-1" r="2" fill="#222"/><circle cx="3" cy="-1" r="2" fill="#222"/></g>`; add(T(s)); continue; }
    if (where === 'sphinxes') {
      // two sphinxes flanking the doorway the text names, or the middle of the back wall
      const e = ctx.exits.find(e => /door/.test(e.type));
      const rel = e ? ctx.rel(e.dir) : 0;
      const pairs = rel === 6 ? [[.12, .62], [.1, .25]] : rel === 2 ? [[.88, .62], [.9, .25]] : [[.32, .7], [.68, .7]];
      pairs.forEach(([u, d], k) => add(T(at(G.floor(u, d), S.sphinx(rel === 6 ? true : rel === 2 ? false : k === 0)))));
      continue;
    }
    if (/^onsurf/.test(where)) { const sf = ctx.surf[where.split(':')[1]]; if (sf) { const body = T(at(sf, draw(word, ctx))); if (sf.d != null) floorQ.push({ d: sf.d - 1e-4, k: floorQ.length, body }); else add(body); } continue; }
    if (/^floor/.test(where)) {
      const d = opt && opt.d !== undefined ? opt.d : .4;
      let prefs = where === 'floor:back' ? [.5, .35, .65] : [.5, .3, .7, .2, .8];
      // keep the ways out in the back wall clear
      if (d > .3 && width <= .4 && ctx.backExits) prefs = prefs.filter(u => ctx.backExits.every(b => Math.abs(b - u) > .14)).concat([.3, .7, .22, .78]);
      const u = claim(ctx, d >= .5 ? 'floorB' : 'floor', width, prefs);
      if (u === null) continue;
      const p = G.floor(u, d);
      // drawn later, far ones first, so that nearer things stand in front (not in the order the text names them)
      floorQ.push({ d, k: floorQ.length, body: T(at(p, draw(word, ctx))) });
      if (opt && opt.surf) ctx.surf[label] = { x: p.x + opt.surf[0] * p.s, y: p.y + opt.surf[1] * p.s, s: p.s, d };
    }
  }
  if (!ctx.exits.some(e => e.type === 'stairs') && rd.has('flight of steps|staircase|stairs|steps') && !rd.has('door opens onto a staircase')) {
    // the way the steps go is kept with the room's layout, so a later "strides down the stairs" does not turn them round
    const L = ctx.layout || {}, vert = L.stairsVert || (rd.has('down') && !rd.has('steps up|leads up|back up') ? 'down' : 'up');
    L.stairsVert = vert;
    Gx().drawExit(ctx, { dir: null, vert, type: 'stairs' });
  }
  // things standing on the floor go in front of walls, doorways and stairs, far ones first
  floorQ.sort((a, b) => b.d - a.d || a.k - b.k).forEach(q => add(q.body));
  // the sealed entrance at the top of the steps burst open: daylight pours down them
  if (rd.has('entrance bursts open|light streams in, searing')) { add(`<rect width="400" height="260" fill="#fff0c8" opacity=".12"/>`); ctx.h.glow(30, 60, 160, '#fff4d0', .7); }
}
const claim = (...a) => Gx().claim(...a);
const poly = (pts, attrs) => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" ${attrs}/>`;
const GT = () => root.ZGenText || require('./gentext.js');

function columns(ctx, T) {
  const { h, rd } = ctx, G = ctx.G, { add } = h;
  const col = (p, hh) => at(p, `<rect x="-11" y="${-hh}" width="22" height="${hh}" fill="${ctx.mat === 'marble' ? '#e8e2d4' : '#e4d8bc'}"/><rect x="-11" y="${-hh}" width="7" height="${hh}" fill="#000" opacity=".12"/><rect x="-16" y="${-hh - 8}" width="32" height="9" fill="#d8ccb0"/><rect x="-15" y="-7" width="30" height="7" fill="#c8bca0"/>${[-5, 0, 5].map(x => `<line x1="${x}" y1="${-hh + 2}" x2="${x}" y2="-8" stroke="#000" opacity=".1"/>`).join('')}`);
  // columns stand along both sides, in perspective
  const hh = (G.by1 - G.by0) / G.sb * .92;
  const cl = rd.has('cloister') && !rd.has('atrium');
  let s = '';
  for (const u of cl ? [.84, .95] : [.08, .92]) for (const d of [.85, .62, .38, .12]) { if (cl && u < .5) continue; s += col(G.floor(cl ? u : u, d), hh); }
  if (cl) for (const d of [.85, .62, .38, .12]) s += col(G.floor(.86 + (1 - d) * .1, d), hh);
  add(T(s));
}

// ---------------------------------------------------------------- portable things the text names
// [pattern, icon name, the object's name in the game (to see whether it is still here), placement]
const PORT = [
  ['silk handkerchief|handkerchief', 'silk handkerchief', 'handkerchief', 'mound'],
  ['impressionist painting', 'Impressionist painting', 'impressionist painting', 'wall'],
  ['beach ball', 'beach ball', 'beach ball', 'float'],
  ['tarot box', 'Tarot box', 'tarot box', 'on:table'],
  ["shepherd's crook", "shepherd's crook", 'crook'],
  ['whisky bottle', 'mounted bottle', 'mounted bottle', 'on:crates'],
  ['ekmek special', 'Ekmek Special', 'ekmek', 'on:table'],
  ['inscribed pumice stone|pumice stone', 'inscribed stone', 'inscribed stone', 'on:niche'],
  ['gem of amber|amber gem', 'gleaming amber gem', 'amber gem', 'centre'],
  ['wrought iron key', 'long wrought iron key', 'wrought iron key', 'centre'],
  ['historical pamphlet', 'historical pamphlet', 'pamphlet'],
  ['flaming torch', 'flaming torch', 'flaming torch', 'bracket'],
  ['crude bone die', 'crude bone die', 'bone die'],
  ['leather sandals', 'leather sandals', 'sandals'],
  ['horn made from a tusk', 'summoning horn', 'horn', 'lean'],
  ['polished blue stone|shining blue stone', 'bluish stone', 'bluish stone', 'on:dolmen'],
  ['heavy iron mascot|iron mascot', 'heavy iron mascot', 'mascot', 'on:table'],
  ['green-leafed branch', 'green branch', 'branch', 'figurehead'],
  ['spindle', 'spindle from the globe', 'spindle', 'on:globe'],
  ['hideously ugly model animal|model animal', "animal so ugly", 'model of an animal', 'on:shelf'],
  ['inscribed six-sided die|six-sided die', 'inscribed die', 'inscribed die', 'on:table'],
  ['bunch of nuts', 'bunch of nuts', 'nuts', 'nest'],
  ['adamantine hand', 'adamantine hand', 'adamantine hand', 'vane'],
  ['a fig\\b', 'fig', 'fig', 'tree'],
  // washed up by the harbour in Alexandria
  ['iron key(?= seems to have washed up)', 'rusty iron key', 'rusty iron key'],
  ['strange stone(?= again)', 'smooth round stone', 'smooth round stone']
];
function PORTABLES(ctx) {
  const { h, rd } = ctx, { add, tag } = h; const st = h.st;
  const ic = IC();
  const icon = (name, p, sc = 1) => { if (!ic) return ''; const svg = ic.icon(name); const body = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''); const k = .9 * p.s * sc; return `<g transform="translate(${f1(p.x - 20 * k)} ${f1(p.y - 36 * k)}) scale(${f1(k * 100) / 100})">${body}</g>`; };
  let n = 0;
  for (const [src, iname, obj, where] of PORT) {
    if (!iname) continue;
    let m = rd.find(src);
    // pushed here, not carried: the text named it as it came ("bounce the beach ball"), the room's description does not
    if (!m && st && st.known && obj && st.here(obj) && !st.moved(obj) && st.mentioned && st.mentioned(obj)) m = { w: obj, i: 0 };
    if (!m) continue;
    if (st && st.known && obj && !st.here(obj)) continue;
    let p = null, sc = 1;
    const sf = where && where.startsWith('on:') ? ctx.surf[where.slice(3)] : null;
    if (sf) p = { x: sf.x, y: sf.y, s: sf.s };
    else if (ctx.anchor && ctx.anchor[where]) { p = ctx.anchor[where]; sc = p.k || 1; }
    else if (ctx.G) {
      if (where === 'wall') { const u = claim(ctx, 'back', .3, [.5, .3, .7]); if (u !== null) { const q = ctx.G.back(u, .45); p = { x: q.x, y: q.y, s: q.s }; sc = 2.4; } }
      else if (where === 'float') { p = ctx.G.floor(.62, .35); p.y -= 40 * p.s; sc = 1.6; }
      else if (where === 'bracket') { const t = .45, side = 'right'; const x = ctx.G.sideX(side, t), y = lerp(ctx.G.sideBot(t), ctx.G.sideTop(t), .55); p = { x, y, s: .8 }; sc = 1.4; add(`<path d="M${f1(x)},${f1(y + 4)} h${f1(16)}" stroke="#3a3a3a" stroke-width="4"/>`); h.glow(x, y - 10, 80, '#ffb050', .5); }
      else if (where === 'lean') { p = ctx.G.floor(.84, .55); sc = 2.2; }
      else { const u = [.4, .6, .3, .7][n++ % 4]; p = ctx.G.floor(u, where === 'centre' ? .35 : .15); }
    }
    if (!p) { p = { x: [150, 250, 100, 300][n++ % 4], y: 246, s: 1 }; }
    add(tag(m.w.replace(/^(a|an|the) /, ''), icon(iname, p, sc)));
  }
}

// clinging inside a deep well: rings of stone going down into the dark
function SHAFT(ctx) {
  const { h, rd } = ctx, { add, R, tag } = h;
  add(`<rect width="${W}" height="${H}" fill="#060504"/>`);
  for (let i = 0; i < 9; i++) { const k = 1 - i / 10, rx = 260 * k, ry = 200 * k, c = Math.round(80 * k); add(`<ellipse cx="200" cy="${f1(140 + i * 3)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="rgb(${c},${c - 6},${c - 12})" stroke-width="${f1(26 * k)}"/>`); for (let j = 0; j < 14; j++) { const a = j / 14 * Math.PI * 2 + i * .3; add(`<line x1="${f1(200 + Math.cos(a) * (rx - 13 * k))}" y1="${f1(140 + i * 3 + Math.sin(a) * (ry - 13 * k))}" x2="${f1(200 + Math.cos(a) * (rx + 13 * k))}" y2="${f1(140 + i * 3 + Math.sin(a) * (ry + 13 * k))}" stroke="#000" opacity=".4"/>`); } }
  if (rd.has('from the east')) { const r = ctx.rel(2); const x = r === 2 ? 330 : r === 6 ? 70 : 200; add((s => s)(`<path d="M${x - 8},110 l10,30 l-6,30 l8,26" stroke="#000" stroke-width="7" fill="none"/>`)); h.glow(x, 150, 50, '#ffb070', .2); }
  h.glow(200, 120, 160, '#fff0c0', .08);
  add(`<rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`);
}

// lying in the mummy case: only the lid above, and the gilded inside
function COFFIN(ctx) {
  const { h } = ctx, { add, lin, tag } = h;
  add(`<rect width="${W}" height="${H}" fill="#0a0806"/>`);
  add(`<path d="M30,${H} L70,40 Q200,10 330,40 L370,${H}Z" fill="${lin('cf', [[0, '#5a4210'], [1, '#2a1e08']])}"/>`);
  add(`<path d="M70,40 Q200,10 330,40 L310,70 Q200,48 90,70Z" fill="#000" opacity=".5"/>`);
  for (let i = 0; i < 7; i++) add(`<path d="M${60 + i * 44},${H} L${90 + i * 36},70" stroke="#c8a030" stroke-width="2" opacity=".35"/>`);
  add(tag('lid', `<path d="M0,0 H${W} V36 Q200,6 0,36Z" fill="#1a1408"/><path d="M0,36 Q200,6 ${W},36" stroke="#e8c040" stroke-width="3" fill="none" opacity=".5"/>`));
  h.glow(200, 160, 160, '#ffd27a', .12);
  add(`<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`);
}

const api = { FEATURES, PORTABLES, COFFIN, SHAFT, S, WS, FEAT, PORT };
root.ZGenParts = Object.assign(root.ZGenParts || {}, api);
if (typeof module !== 'undefined' && module.exports) module.exports = Object.assign(root.ZGenParts, require('./genland.js'));
})(typeof window !== 'undefined' ? window : this);
