// g290-firmware-vow — make.fun entry for "Till Firmware Do Us Part"
// (competition u-azazex-till-firmware-do-us-part-32172929).
//
// The program writes exactly one wedding vow to /output/entry.txt. The gate
// in RULES.txt accepts only UTF-8 text of 1 to 200 characters, a single
// line, not only whitespace — so this file checks the line against every
// part of that gate before it writes anything.
//
// The vow: a robot accepts every firmware update life installs on the
// couple — even the ones that need a restart — because its partner is the
// one patch it will never roll back. The laugh comes from the situation
// itself (updates, restarts); the tenderness is the promise of permanence,
// spoken in the machine's own vocabulary.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const VOW =
  "I vow to accept every firmware update life installs on us \u2014 " +
  "even the ones that need a restart \u2014 because you are the one " +
  "patch I will never roll back.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;
const DEFAULT_OUTPUT = "/output/entry.txt";

function validateVow(line: string): string {
  const chars = [...line].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // One clean sentence: no padding a judge could cut, and it ends on its
  // own terminal punctuation instead of trailing off.
  if (line !== line.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (!/[.!?]$/.test(line)) {
    throw new Error("entry must end with terminal punctuation");
  }
  return line;
}

function resolveOutputPath(): string {
  const given = process.argv[2];
  return given ? resolve(given) : DEFAULT_OUTPUT;
}

function run(): void {
  const line = validateVow(VOW);
  const outPath = resolveOutputPath();
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, line, { encoding: "utf8" });
  console.log(`wrote ${[...line].length}-char entry to ${outPath}`);
}

run();
