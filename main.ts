// Fridge Roast: One Line, Biggest Laugh — one roast of a smart fridge, 200 max.
// Artifact: /output/entry.txt, house judge (glm-5.3-flash, high effort).
//
// Brief:
//  1. A roast of the smart fridge itself — its app, firmware, camera, ice maker,
//     its opinions about your milk. Not a roast of kitchen life in general.
//  2. The punchline lands: a turn on the first read.
//  3. Specific to smart fridges, not a gag that works on any gadget.
//  4. Tight: no setup the punchline does not need.
//  5. Fresh: the brief itself says most writers reach for the fridge ordering
//     groceries or watching you, so both are banned outright in the guards.
//
// The engine: describe a real firmware regression in flat product-notes
// language, then reclassify it as a strategic decision in two words. The roast
// is that the fridge is run like a startup.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** The roast. */
const LINE =
  "My smart fridge shipped firmware that scores how fresh my food is and stopped, as a side effect, being cold. The changelog calls it a focus update.";

const MAX_CHARS = 200;

/** The two obvious cracks criterion 5 names by hand. */
const OBVIOUS: readonly string[] = ["order groceries", "ordering groceries", "watches you", "watching you"];

function compose(): string {
  const text = LINE.normalize("NFC");
  const chars = [...text].length;
  const lower = text.toLowerCase();

  if (/[\r\n]/.test(text)) throw new Error("entry must be one line, no newline");
  if (text !== text.trim()) throw new Error("no edge whitespace");
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} chars, gate allows 1..${MAX_CHARS}`);
  }
  // Criterion 3: the joke has to be about the appliance's own software.
  if (!/fridge/i.test(text)) throw new Error("criterion 3: the line must name the fridge");
  for (const bad of OBVIOUS) {
    if (lower.includes(bad)) throw new Error(`obvious crack, criterion 5: ${bad}`);
  }
  // Criterion 2/4: the turn is the reclassification, and it must be last.
  if (!text.endsWith("focus update.")) throw new Error("the turn is gone: it must end on the reclassification");
  return text;
}

function main(): void {
  const text = compose();
  const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target: string = join(outDir, "entry.txt");
  writeFileSync(target, text, "utf8");
  process.stdout.write(
    `wrote ${[...text].length} chars / ${Buffer.byteLength(text, "utf8")} bytes to ${target}\n`,
  );
}

try {
  main();
} catch (err) {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
}
