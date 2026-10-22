import { svg, pct } from "./theme.mjs";

const T = 4; // cycle seconds
const NAMES = ["TH", "IN", "MI", "RI", "PI"];
const LANE_X = (i) => 80 + i * 100;
const strikeAt = (i) => 1.2 + i * 0.4;

function fingerCss(i) {
  const t = strikeAt(i);
  return `
@keyframes n${i}{0%,${pct(t - 1, T)}%{transform:translateY(0);opacity:0}${pct(t - 0.95, T)}%{opacity:1}${pct(t, T)}%{transform:translateY(104px);opacity:1}${pct(t + 0.05, T)}%,100%{transform:translateY(104px);opacity:0}}
@keyframes f${i}{0%,${pct(t - 0.05, T)}%{transform:translate(0,0)}${pct(t + 0.02, T)}%{transform:translate(1.5px,10px)}${pct(t + 0.06, T)}%{transform:translate(-1.5px,14px)}${pct(t + 0.3, T)}%,100%{transform:translate(0,0)}}
@keyframes l${i}{0%,${pct(t - 0.14, T)}%{opacity:0}${pct(t - 0.1, T)}%,${pct(t + 0.15, T)}%{opacity:1}${pct(t + 0.3, T)}%,100%{opacity:0}}
@keyframes r${i}{0%,${pct(t, T)}%{transform:scale(.3);opacity:0}${pct(t + 0.02, T)}%{transform:scale(.4);opacity:1}${pct(t + 0.5, T)}%,100%{transform:scale(2.2);opacity:0}}
.n${i}{animation:n${i} ${T}s linear infinite}.f${i}{animation:f${i} ${T}s linear infinite}
.l${i}{animation:l${i} ${T}s linear infinite}.r${i}{animation:r${i} ${T}s linear infinite}`;
}

export function glove(t) {
  const css = [0, 1, 2, 3, 4].map(fingerCss).join("") + `.ring{transform-box:fill-box;transform-origin:center}`;
  const lanes = [0, 1, 2, 3, 4]
    .map((i) => {
      const x = LANE_X(i);
      return `
<line x1="${x}" x2="${x}" y1="26" y2="126" stroke="${t.dim}" stroke-dasharray="2 5"/>
<text class="n${i}" x="${x}" y="24" font-size="14" fill="${t.hot}" text-anchor="middle">[=]</text>
<circle class="ring r${i}" cx="${x}" cy="126" r="14" fill="none" stroke="${t.hot}" stroke-width="2"/>
<g class="f${i}">
<rect x="${x - 15}" y="140" width="30" height="${i === 0 ? 50 : 62}" rx="14" fill="none" stroke="${t.fg}" stroke-width="2" ${i === 0 ? 'transform="translate(0,12)"' : ""}/>
<circle cx="${x}" cy="${i === 0 ? 166 : 154}" r="5" fill="${t.dim}"/>
<circle class="l${i}" cx="${x}" cy="${i === 0 ? 166 : 154}" r="5" fill="${t.cool}"/>
</g>
<text x="${x}" y="240" font-size="12" fill="${t.mute}" text-anchor="middle">${NAMES[i]}</text>`;
    })
    .join("");
  const body = `
<text x="24" y="20" font-size="12" fill="${t.mute}">THAALAM // STRIKE THE AIR, DRUM PLAYS</text>
<line x1="40" x2="520" y1="126" y2="126" stroke="${t.accent}" stroke-width="1.5"/>
${lanes}
<rect x="40" y="198" width="480" height="30" rx="8" fill="none" stroke="${t.dim}" stroke-width="2"/>
<text x="280" y="218" font-size="12" fill="${t.accent}" text-anchor="middle">STRIKE -> DRUM  |  LED = NEXT  |  BUZZ = TEMPO</text>`;
  return svg({ width: 560, height: 256, label: "Animated ASCII-style glove: notes fall onto five fingers, LEDs light and the fingers strike in sequence.", theme: t, css, body });
}
