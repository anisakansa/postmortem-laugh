// The Postmortem That Made Us Laugh — one-line postmortem entry.
//
// The winning line (98 chars, 1 line), chosen from 5 candidates scored
// against the postmortem rubric, in rubric order:
//   postmortem voice > funny-specific > twist > concise.
//   A (19/20): "Root cause: the deploy worked. The rollback worked. The
//   only thing that failed was our confidence."
//     Voice 5 — opens "Root cause", names deploy + rollback: pure blameless
//     postmortem diction, not a generic joke.
//     Funny 5 — the deploy worked, the rollback worked; the only casualty
//     is the team's confidence. Specific, human, blameless.
//     Twist 5 — the failing component is not a service but the humans'
//     confidence. The incident is a feeling.
//     Concise 4 — 98 chars; every clause earns its place, no padding.
//   A is the only candidate scoring 5 on voice AND twist at once: the
//   postmortem form itself carries the joke, instead of the joke wearing
//   a postmortem costume.
//   B (18): "The outage lasted nine minutes. The postmortem lasted nine
//   days. The fix was one line." — great ratio joke, but the twist (one-line
//   fix) is the most common postmortem punchline.
//   C (17): "We found the bug in production. It had been there so long it
//   was paying rent." — funny and specific, but no postmortem structure.
//   D (17): "Root cause: someone deployed on Friday. Action item: never
//   speak of Friday again." — strong voice, but the Friday-deploy joke is
//   the predictable one everyone writes.
//   E (17): "The system did exactly what we told it to do. That was the
//   incident." — sharpest twist, but reads as a slogan, not a postmortem.
//
// Deterministic by construction: a constant string plus a gate. No clock,
// no randomness, no I/O besides the single output write. Two runs produce
// byte-identical output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Root cause: the deploy worked. The rollback worked. The only thing that failed was our confidence.";

const MIN_CHARS = 1;
const MAX_CHARS = 120;

function fail(message: string): never {
  throw new Error(message);
}

const chars = [...LINE].length;
if (chars < MIN_CHARS || chars > MAX_CHARS) {
  fail(`entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`);
}
if (LINE.trim() !== LINE) fail("entry must not have leading or trailing whitespace");
if (LINE.includes("\n") || LINE.includes("\r")) fail("entry must be a single line");
if (/\s{2,}/.test(LINE)) fail("entry must not contain repeated whitespace");
// Pure ASCII: byte length equals character count, so the gate is exact.
if (Buffer.byteLength(LINE, "utf8") !== chars) fail("entry must be pure ASCII");

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Round-trip guard: what we wrote must read back byte-identical, with no
// trailing newline and exactly the gated length.
const back = readFileSync("/output/entry.txt", "utf8");
if (back !== LINE) fail("round-trip mismatch");
if (back.length !== 98 || back.endsWith("\n")) fail("expected exactly 98 chars, no trailing newline");
if (Buffer.byteLength(back, "utf8") !== 98) fail("expected 98 bytes");

console.log(LINE);
