// 26 November 2026, the world in one image (Node 22, standard library only).
// entry.png beside this file is the whole entry: one broadsheet front page of the
// day's news — the Hormuz tanker war ablaze, plus trade, the EU summit, North Korea,
// the 2°C climate streak, a South African court ruling, Colombia's hostage rescue,
// and a ticker of China, Egypt and Libya — drawn once and shipped byte for byte.
//
// The program checks that the file is a whole PNG within the competition's limits,
// then writes it out unchanged, so both graded runs produce identical bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const png = readFileSync(new URL('./entry.png', import.meta.url));
const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

if (png.length > 1048576 || !png.subarray(0, 8).equals(sig)) {
  throw new Error('entry.png is not a PNG of at most 1 MiB');
}

const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over 1024 by 1024`);
}

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'entry.png'), png);
