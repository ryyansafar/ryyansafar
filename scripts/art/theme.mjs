// Shared palette and SVG helpers for the profile art.
export const THEMES = {
  dark: { bg: "#0a0a0a", fg: "#e6e6dc", accent: "#a3b86c", dim: "#464A39", hot: "#ffb000", cool: "#5eead4", mute: "#7b7f6e" },
  light: { bg: "#f5f0e8", fg: "#111111", accent: "#4d5a2a", dim: "#cfc9b8", hot: "#b45309", cool: "#0f766e", mute: "#6b6e5f" },
};

export const FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
export const CHAR_W = 0.6; // monospace advance as a fraction of font size

export const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function svg({ width, height, label, theme, css = "", body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}">
<style>
text{font-family:${FONT};}
${css}
</style>
<rect width="${width}" height="${height}" rx="10" fill="${theme.bg}"/>
${body}
</svg>
`;
}

export const pct = (t, total) => +((t / total) * 100).toFixed(2);
