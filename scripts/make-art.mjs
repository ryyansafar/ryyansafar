// Generates the animated profile art into assets/ (dark + light variants).
// Run: node scripts/make-art.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { THEMES } from "./art/theme.mjs";
import { banner } from "./art/banner.mjs";
import { terminal } from "./art/terminal.mjs";
import { glove } from "./art/glove.mjs";
import { globe } from "./art/globe.mjs";

const ART = { banner, terminal, glove, globe };

await mkdir("assets", { recursive: true });
for (const [name, render] of Object.entries(ART)) {
  for (const [mode, theme] of Object.entries(THEMES)) {
    await writeFile(`assets/${name}-${mode}.svg`, render(theme));
  }
}
console.log(`wrote ${Object.keys(ART).length * 2} SVGs`);
