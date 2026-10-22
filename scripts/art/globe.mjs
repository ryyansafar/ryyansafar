import { svg, esc } from "./theme.mjs";

const COLS = 44;
const ROWS = 22;
const FRAMES = 16;
const CYCLE = 4;
const FS = 11;
const GLOBE_X = 275;
const GLOBE_Y = 22;
const ROW_H = 11;

// Blobby pseudo-continents from layered sines; not real geography, just texture.
const land = (lon, lat) =>
  Math.sin(lon * 2 + 1) * Math.cos(lat * 3) + Math.sin(lon * 3 - lat * 2) * 0.6 + Math.cos(lon + lat * 4) * 0.4 > 0.55;

function frameRows(frame) {
  const spin = (frame / FRAMES) * Math.PI * 2;
  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    let line = "";
    for (let c = 0; c < COLS; c++) {
      const x = ((c + 0.5) / COLS) * 2 - 1;
      const y = ((r + 0.5) / ROWS) * 2 - 1;
      const d = x * x + y * y;
      if (d > 1) {
        line += " ";
        continue;
      }
      const z = Math.sqrt(1 - d);
      const lat = Math.asin(-y);
      const lon = Math.atan2(x, z) + spin;
      const lit = z > 0.55;
      line += land(lon, lat) ? (lit ? "#" : "%") : lit ? "." : ":";
    }
    rows.push(line);
  }
  return rows;
}

export function globe(t) {
  const frames = Array.from({ length: FRAMES }, (_, f) => {
    const rows = frameRows(f)
      .map((line, r) => `<text x="${GLOBE_X}" y="${GLOBE_Y + r * ROW_H}" font-size="${FS}" textLength="${COLS * FS * 0.6}" lengthAdjust="spacing" xml:space="preserve">${esc(line)}</text>`)
      .join("");
    return `<g class="gf" style="animation-delay:${((f * CYCLE) / FRAMES / 2.5).toFixed(3)}s" fill="${t.accent}">${rows}</g>`;
  }).join("");
  const slot = (100 / FRAMES).toFixed(3);
  const css = `
.gf{opacity:0;animation:gf ${(CYCLE / 2.5).toFixed(2)}s steps(1) infinite}
@keyframes gf{0%{opacity:1}${slot}%{opacity:0}100%{opacity:0}}
`;
  const arc = "M24,226 Q210,0 400,128";
  const body = `
<text x="24" y="20" font-size="12" fill="${t.mute}">VISA ROULETTE // AI SEES, RULES DECIDE</text>
${frames}
<path d="${arc}" fill="none" stroke="${t.dim}" stroke-width="2" stroke-dasharray="3 7"/>
<text font-size="16" font-weight="bold" fill="${t.hot}" text-anchor="middle">-=&gt;
<animateMotion dur="${CYCLE}s" repeatCount="indefinite" rotate="auto" calcMode="linear" keyPoints="0;1;1" keyTimes="0;0.7;1" path="${arc}"/>
</text>
<circle cx="400" cy="128" r="5" fill="none" stroke="${t.hot}" stroke-width="2" opacity="0">
<animate attributeName="r" dur="${CYCLE}s" repeatCount="indefinite" values="3;3;3;16;3" keyTimes="0;0.69;0.7;0.9;1"/>
<animate attributeName="opacity" dur="${CYCLE}s" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.69;0.7;0.9;1"/>
</circle>
<text x="40" y="238" font-size="15" font-weight="bold" fill="${t.hot}" opacity="0" transform="rotate(-6 80 238)">[ CLEARED ]
<animate attributeName="opacity" dur="${CYCLE}s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.7;0.72;0.95;1"/>
</text>
<text x="24" y="256" font-size="11" fill="${t.mute}">(demo rules are unverified: see the repo)</text>`;
  return svg({ width: 580, height: 266, label: "Animated ASCII globe rotating while a paper plane arcs in and lands on a country with a CLEARED stamp.", theme: t, css, body });
}
