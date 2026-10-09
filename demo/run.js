import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { computeDiffHtml } from '../src/core/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(readFileSync(join(here, '../data/test.json'), 'utf8'));

for (const [i, c] of cases.entries()) {
  console.log(`\n=== Cas ${i + 1} ===`);
  console.log('redgreen V1->V2 :', computeDiffHtml({
    original: c.v1, modified: c.v2, mode: 'redgreen',
  }));
  console.log('orange V1 vs [V2,V3] :', computeDiffHtml({
    original: c.v1, modified: [c.v2, c.v3], mode: 'orange',
  }));
}
