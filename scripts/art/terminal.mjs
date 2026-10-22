import { svg, esc, CHAR_W } from "./theme.mjs";

const FS = 14;
const CW = FS * CHAR_W;
const CYCLE = 18;
const LINE_H = 24;
const TOP = 70;

const LINES = [
  { kind: "cmd", text: "$ whoami" },
  { kind: "out", text: "ryyan safar | ece '27 @ rset kochi | builds hardware that thinks" },
  { kind: "cmd", text: "$ cat now.txt" },
  { kind: "out", text: "seeking: 6-month internship, jan-jun 2027 (embedded, edge-ai silicon, vlsi)" },
  { kind: "cmd", text: "$ ls ./wins" },
  { kind: "out", text: "layover-2026  best-use-of-gemma  kruizex-1st  maker-of-the-month-sep26" },
  { kind: "cmd", text: "$ ./fix_things.sh" },
  { kind: "out", text: "permission denied. breaking things first, as is tradition." },
];

// Discrete SMIL: one value per typed character, so the reveal is exactly char by char.
function typing(text, start, perChar) {
  const n = text.length;
  const times = [0];
  const widths = [0];
  for (let i = 1; i <= n; i++) {
    times.push((start + i * perChar) / CYCLE);
    widths.push(+(i * CW).toFixed(2));
  }
  times.push(0.97);
  widths.push(+(n * CW).toFixed(2));
  times.push(0.985);
  widths.push(0);
  times.push(1);
  widths.push(0);
  return { times, widths, end: start + n * perChar };
}

export function terminal(t) {
  let clock = 0.4;
  const rows = LINES.map((line, i) => {
    const perChar = line.kind === "cmd" ? 0.07 : 0.022;
    const { times, widths, end } = typing(line.text, clock, perChar);
    clock = end + (line.kind === "cmd" ? 0.35 : 0.5);
    const y = TOP + i * LINE_H;
    const color = line.kind === "cmd" ? t.accent : t.fg;
    const kt = times.map((x) => Math.min(x, 1).toFixed(4)).join(";");
    const vals = widths.join(";");
    const cursorOpacity = `0;0;1;1;0;0`;
    const c0 = (times[1] - 0.0001).toFixed(4);
    const cEnd = Math.min(end / CYCLE + 0.012, 0.96).toFixed(4);
    return `
<clipPath id="k${i}"><rect x="28" y="${y - FS}" height="${LINE_H}" width="0"><animate attributeName="width" calcMode="discrete" dur="${CYCLE}s" repeatCount="indefinite" keyTimes="${kt}" values="${vals}"/></rect></clipPath>
<text x="28" y="${y}" font-size="${FS}" fill="${color}" textLength="${(line.text.length * CW).toFixed(2)}" lengthAdjust="spacing" clip-path="url(#k${i})" xml:space="preserve">${esc(line.text)}</text>
<rect y="${y - FS + 2}" width="${(CW * 0.8).toFixed(1)}" height="${FS}" fill="${t.hot}" opacity="0"><animate attributeName="x" calcMode="discrete" dur="${CYCLE}s" repeatCount="indefinite" keyTimes="${kt}" values="${widths.map((w) => (28 + w).toFixed(1)).join(";")}"/><animate attributeName="opacity" calcMode="discrete" dur="${CYCLE}s" repeatCount="indefinite" keyTimes="0;${c0};${cEnd};1" values="0;1;0;0"/></rect>`;
  });
  const body = `
<rect x="0" y="0" width="860" height="38" rx="10" fill="${t.dim}" opacity=".5"/>
<circle cx="24" cy="19" r="6" fill="${t.hot}"/><circle cx="44" cy="19" r="6" fill="${t.accent}"/><circle cx="64" cy="19" r="6" fill="${t.cool}"/>
<text x="430" y="24" font-size="13" fill="${t.mute}" text-anchor="middle">ryyan@rset:~</text>
${rows.join("")}`;
  return svg({ width: 860, height: TOP + LINES.length * LINE_H + 16, label: "Terminal: ryyan safar, ECE '27 at RSET Kochi, seeking a 6-month internship Jan to Jun 2027, wins list.", theme: t, body });
}
