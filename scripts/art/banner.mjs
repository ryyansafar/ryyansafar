import { svg, esc } from "./theme.mjs";

const FONT5 = {
  R: ["XXXX.", "X...X", "XXXX.", "X..X.", "X...X"],
  Y: ["X...X", "X...X", ".X.X.", "..X..", "..X.."],
  A: [".XXX.", "X...X", "XXXXX", "X...X", "X...X"],
  N: ["X...X", "XX..X", "X.X.X", "X..XX", "X...X"],
  S: [".XXXX", "X....", ".XXX.", "....X", "XXXX."],
  F: ["XXXXX", "X....", "XXXX.", "X....", "X...."],
  " ": ["....", "....", "....", "....", "...."],
};

const PX = 13;
const WIDTH = 900;

function nameRects(text) {
  const rects = [];
  let cx = 0;
  for (const ch of text) {
    const glyph = FONT5[ch];
    glyph.forEach((row, y) =>
      [...row].forEach((c, x) => c === "X" && rects.push(`M${(cx + x) * PX} ${y * PX}h${PX - 2}v${PX - 2}h-${PX - 2}z`)),
    );
    cx += glyph[0].length + 1;
  }
  return { markup: `<path d="${rects.join("")}"/>`, cols: cx - 1 };
}

const PERIOD = 300;
const BEAT = "M0,0 L60,0 L70,-6 L80,6 L90,0 L130,0 L140,-4 L150,0 L180,0 L190,-34 L200,38 L210,-14 L220,0 L300,0";
const wavePath = () => Array.from({ length: 5 }, (_, i) => `<path transform="translate(${i * PERIOD},0)" d="${BEAT}"/>`).join("");

export function banner(t) {
  const { markup, cols } = nameRects("RYYAN SAFAR");
  const nameX = Math.round((WIDTH - cols * PX) / 2);
  const css = `
.name path{fill:${t.fg}}
.c1 path{fill:${t.hot}}.c2 path{fill:${t.cool}}
.c1{opacity:.75;animation:g1 4s steps(1) infinite}.c2{opacity:.75;animation:g2 4s steps(1) infinite}
@keyframes g1{0%,90%,100%{transform:translate(0,0)}91%{transform:translate(-5px,1px)}93%{transform:translate(4px,-1px)}96%{transform:translate(-2px,0)}}
@keyframes g2{0%,90%,100%{transform:translate(0,0)}92%{transform:translate(5px,-1px)}94%{transform:translate(-4px,1px)}97%{transform:translate(2px,0)}}
.scan{animation:scan 3.6s linear infinite}
@keyframes scan{from{transform:translateX(-60px)}to{transform:translateX(${WIDTH}px)}}
.wave{animation:wave 3s linear infinite}
@keyframes wave{from{transform:translateX(0)}to{transform:translateX(-${PERIOD}px)}}
.blink{animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
`;
  const body = `
<defs>
<linearGradient id="sg" x1="0" x2="1"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="1" stop-color="${t.accent}" stop-opacity=".45"/></linearGradient>
<clipPath id="wc"><rect x="0" y="128" width="${WIDTH}" height="80"/></clipPath>
<clipPath id="nc"><rect x="0" y="48" width="${WIDTH}" height="76"/></clipPath>
</defs>
<text x="24" y="30" font-size="13" fill="${t.mute}">${esc("[ ECE '27 // RSET KOCHI // OPEN TO RELOCATE ]")}</text>
<text x="${WIDTH - 24}" y="30" font-size="13" fill="${t.accent}" text-anchor="end">SIGNAL: <tspan class="blink">LOCKED</tspan></text>
<g transform="translate(${nameX},56)">
<g class="c1">${markup}</g><g class="c2">${markup}</g><g class="name">${markup}</g>
</g>
<line x1="24" x2="${WIDTH - 24}" y1="168" y2="168" stroke="${t.dim}" stroke-dasharray="2 6"/>
<g clip-path="url(#wc)"><g transform="translate(0,168)"><g class="wave" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linejoin="round">${wavePath()}</g></g></g>
<text x="24" y="232" font-size="15" fill="${t.fg}">${esc("> seeking: 6-month internship, jan-jun 2027 | embedded / edge-AI silicon / VLSI")}<tspan class="blink" fill="${t.hot}">_</tspan></text>
`;
  return svg({ width: WIDTH, height: 256, label: "Ryyan Safar, ECE '27 at RSET Kochi. Seeking a 6-month internship, Jan to Jun 2027.", theme: t, css, body });
}
