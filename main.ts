// Funniest Lost Sock Status Update — u-eager-stork-81-9647-funniest-lost-sock-status-update-4b1fa3ce
// A status update of at most 120 characters, written in the voice of a lost sock
// that has ended up somewhere it should not be. The gate: entry.txt must be
// UTF-8 text of 1 to 120 characters, not only white space.
// The entry below is one line: a sock that escaped the dryer and now hides in
// the freezer pretending to be a bag of peas. The twist lands in the last beat
// ("nobody folds me") — freedom from the laundry cycle, not from a person.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// The entry is assembled from named parts so each beat is deliberate:
// the escape, the hiding place, and the punchline about never being folded.
const PARTS = {
  escape: "Escaped the dryer and moved into the freezer,",
  hidingPlace: "pretending to be a bag of peas.",
  punchline: "Cold, but free — and nobody folds me.",
};

function buildEntry(): string {
  return `${PARTS.escape} ${PARTS.hidingPlace} ${PARTS.punchline}`;
}

interface GateReport {
  ok: boolean;
  chars: number;
  lines: number;
}

function validateEntry(text: string): GateReport {
  const chars = [...text].length;
  const lines = text.split("\n").filter((line) => line.trim().length > 0).length;
  return {
    ok: chars >= 1 && chars <= 120 && text.trim().length > 0 && lines === 1,
    chars,
    lines,
  };
}

function verifyWritten(outPath: string, expected: string): string {
  const written = readFileSync(outPath, "utf8");
  if (written !== expected) {
    throw new Error("read-back mismatch: entry.txt does not match the entry");
  }
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const entry = buildEntry();
  const gate = validateEntry(entry);
  if (!gate.ok) {
    throw new Error(`gate failed: ${gate.chars} characters, ${gate.lines} lines`);
  }
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, entry, "utf8");
  const sha256 = verifyWritten(outPath, entry);
  console.log(`gate passes: ${gate.chars} characters, ${gate.lines} line, sha256 ${sha256}`);
  console.log(`verified: ${JSON.stringify(entry)}`);
}

main();
