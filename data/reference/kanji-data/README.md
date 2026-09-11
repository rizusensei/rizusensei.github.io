# kanji-data 👹 — Offline Kanji Database for Node.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/npm/v/kanji-data.svg)](https://www.npmjs.com/package/kanji-data)
[![NPM Downloads](https://img.shields.io/npm/dm/kanji-data.svg)](https://www.npmjs.com/package/kanji-data)

A distilled, offline-first kanji database for Node.js with zero dependencies. Provides instant access to 13,000+ kanji characters and vocabulary, optimized with lazy-loading shards for memory-constrained serverless environments.

> ⚡️ **Production Use:** This library is used to assist in compiling the comprehensive kanji data for **[Jepang.org](https://jepang.org/kanji/)**.

- **Repository:** [github.com/sepTN/kanji-data](https://github.com/sepTN/kanji-data)
- **Documentation:** [jepang.org/kanji-data](https://jepang.org/kanji-data/)
- **npm:** [npmjs.com/package/kanji-data](https://www.npmjs.com/package/kanji-data)

---

## The Problem

Typically, accessing a comprehensive Japanese dictionary offline means parsing a massive 100MB+ JSON file.

*   Loading a file that large blocks the Node.js event loop, resulting in terrible app startup times.
*   It easily consumes 300MB+ of RAM once parsed, which instantly crashes serverless environments (like AWS Lambda, Vercel, or Netlify).
*   Relying on local databases (like SQLite) often introduces bulky C++ dependencies (`node-gyp`) that cause cross-platform installation errors.

## The Solution

`kanji-data` solves the memory problem using **build-time data sharding** and **lazy evaluation**.

Instead of shipping one massive file, the database is pre-compiled into tiny optimized chunks. Core metadata is loaded instantly, while massive vocabulary lists are split by Unicode hex-prefix and only loaded into memory (~1MB at a time) exactly when requested.

## Features

*   📦 **Zero Dependencies:** Pure JavaScript and JSON. No databases, no binaries.
*   ⚡ **Serverless Ready:** Cold starts are nearly instantaneous with a tiny memory footprint.
*   📴 **100% Offline:** No API keys, no rate limits, no network latency.
*   🧠 **Smart Caching:** Chunks are cached in memory after the first read for lightning-fast subsequent queries.
*   🔷 **TypeScript Ready:** Full `.d.ts` type definitions included.

## Installation

```bash
npm install kanji-data
```

## Usage

```javascript
const kanji = require('kanji-data');

// 1. Get core kanji metadata (meanings, readings, stroke count, etc.)
const neko = kanji.get('猫');
console.log(neko.meanings);       // ['cat']
console.log(neko.kun_readings);   // ['ねこ']
console.log(neko.jlpt);           // 3
console.log(neko.stroke_count);   // 11

// 2. Fetch vocabulary containing a specific kanji
// (lazily loads the required ~1MB vocabulary shard on first call)
const nekoWords = kanji.getWords('猫');
console.log(nekoWords[0]);
/*
{
  "variants": [
    { "written": "猫", "pronounced": "ねこ", "priorities": ["spec1"] }
  ],
  "meanings": [
    { "glosses": ["cat"] }
  ]
}
*/

// 3. Get lists of kanji by JLPT level (N5 to N1)
const n5Kanji = kanji.getJlpt(5);
console.log(n5Kanji); // ['一', '二', '三', '日', '月', ...]

// 4. Get lists of kanji by school grade
const grade1 = kanji.getGrade(1);
console.log(grade1); // ['一', '右', '雨', '円', '王', ...]

// 5. Get all kanji in the database
const all = kanji.getAll();
console.log(all.length); // 13108

// 6. Extract kanji from any Japanese text
const found = kanji.extractKanji('私は猫が好きです');
console.log(found); // ['私', '猫', '好']

// 7. Search by meaning or reading
const results = kanji.search('fire');
console.log(results[0].kanji); // '火'

// 8. Get a random kanji (optionally filtered)
const random = kanji.getRandom({ jlpt: 5 });
console.log(random.kanji); // (random N5 kanji)
```

## API Reference

### `get(character: string): KanjiMetadata | null`

Returns core metadata for a given kanji character. Returns `null` if not found.

```javascript
{
  kanji: "猫",
  grade: 8,                      // School grade (1–6, 8–9) or null
  stroke_count: 11,
  meanings: ["cat"],
  kun_readings: ["ねこ"],
  on_readings: ["ビョウ"],
  name_readings: [],
  jlpt: 3,                       // JLPT level (1–5) or null
  unicode: "732B",
  heisig_en: "cat",              // Heisig keyword (may be null)
  freq_mainichi_shinbun: 1702,   // Newspaper frequency rank (may be null)
  notes: []
}
```

### `getWords(character: string): Word[]`

Returns an array of vocabulary words that use the specified kanji. Returns `[]` if none found.

Uses **lazy loading** — the first call reads a ~1MB shard from disk and caches it. Subsequent calls in the same shard are instantaneous.

```javascript
{
  variants: [
    {
      written: "猫",
      pronounced: "ねこ",
      priorities: ["spec1", "ichi1"]   // frequency lists (may be empty)
    }
  ],
  meanings: [
    { glosses: ["cat"] }
  ]
}
```

### `getJlpt(level: number): string[]`

Returns kanji in the specified JLPT level (1–5). Returns `[]` for invalid levels.

```javascript
kanji.getJlpt(5);  // ['一', '二', '三', ...]  ← N5 (easiest)
kanji.getJlpt(1);  // ['蹴', '串', '厨', ...]  ← N1 (hardest)
```

### `getGrade(grade: number): string[]`

Returns kanji taught in the specified Japanese school grade. Returns `[]` for grades with no data.

| Grade | Level |
|---|---|
| 1–6 | Elementary school (教育漢字) |
| 8 | Secondary school / Jōyō kanji not in grades 1–6 |
| 9 | Jinmeiyō kanji (used in names) |

```javascript
kanji.getGrade(1); // ['一', '右', '雨', ...']
kanji.getGrade(8); // ['亜', '哀', '握', ...']
```

### `getAll(): string[]`

Returns an array of all ~13,000 kanji characters in the database.

```javascript
const allKanji = kanji.getAll();
console.log(allKanji.length); // 13108
```

### `extractKanji(text: string): string[]`

Extracts unique kanji characters from a string of Japanese text. Only returns characters present in the database.

```javascript
kanji.extractKanji('私は猫が好きです');
// ['私', '猫', '好']

kanji.extractKanji('hello'); // []
kanji.extractKanji('ひらがなだけ'); // []
```

### `search(query: string): KanjiMetadata[]`

Searches for kanji by English meaning or Japanese reading. Performs case-insensitive partial matching on meanings, kun readings, and on readings.

```javascript
kanji.search('cat');     // [{ kanji: '猫', meanings: ['cat'], ... }, ...]
kanji.search('ねこ');    // [{ kanji: '猫', ... }]
kanji.search('fire');    // [{ kanji: '火', ... }, ...]
```

### `getByStrokeCount(count: number): KanjiMetadata[]`

Returns an array of kanji with the specified stroke count. Returns `[]` for invalid input (zero, negative, non-integer).

```javascript
kanji.getByStrokeCount(1);  // [{ kanji: '一', stroke_count: 1, ... }, ...]
kanji.getByStrokeCount(11); // [{ kanji: '猫', ... }, ...]
kanji.getByStrokeCount(0);  // []
```

### `getRandom(options?: { jlpt?: number, grade?: number }): KanjiMetadata | null`

Returns a random kanji, optionally filtered by JLPT level and/or school grade. Returns `null` when no kanji match the filters.

```javascript
kanji.getRandom();               // { kanji: '猫', ... } (any random kanji)
kanji.getRandom({ jlpt: 5 });    // guaranteed N5 kanji
kanji.getRandom({ grade: 1 });   // guaranteed grade 1 kanji
kanji.getRandom({ jlpt: 5, grade: 1 }); // both filters applied
kanji.getRandom({ grade: 99 });  // null (no match)
```

### `searchWords(query: string): Word[]`

Searches for vocabulary words by English meaning or reading across all shards. Performs case-insensitive partial matching on glosses and readings.

> ⚠️ **Performance Note:** The first call loads all word shards (~100 files) into memory. Subsequent calls are instant due to caching.

```javascript
kanji.searchWords('cat');  // [{ variants: [...], meanings: [{ glosses: ['cat'] }] }, ...]
kanji.searchWords('ねこ'); // finds words with reading ねこ
kanji.searchWords('xyz');  // []
```

## Examples

The `examples/` directory contains a fully interactive console quiz that demos the package.

```bash
# Run the quiz directly (data is included!)
node examples/quiz.js

# Options
node examples/quiz.js --level=5      # N5 only (easiest, 79 kanji)
node examples/quiz.js --level=3      # N5–N3 (default, ~600 kanji)
node examples/quiz.js --rounds=20    # longer session
```

Each round presents a **4-option multiple-choice question** — either "guess the meaning" or "which kanji matches this reading". After every answer it shows example vocabulary words loaded live from the data shards.

## Contributing

Found a bug or want to improve the data pipeline? PRs are welcome!

- Bug reports → [GitHub Issues](https://github.com/sepTN/kanji-data/issues)
- The raw data lives in `references/kanjiapi_full.json`
- Run `npm test` before submitting a PR

## About

**kanji-data** is an npm package authored and maintained by **[Septian Ganendra S. K.](https://jepang.org/tentang-kami/)** at **[Jepang.org](https://jepang.org)** — Indonesia's comprehensive Japanese learning platform. This package optimizes and repackages the [kanjiapi.dev](https://kanjiapi.dev) dataset into lazy-loading shards for production Node.js use.

> 📚 **If you use this package in your project, we'd appreciate a link back to [Jepang.org](https://jepang.org)!**
> It helps us continue maintaining and expanding this free resource for Japanese learners worldwide.

### Related Packages

- **[kanji-png](https://www.npmjs.com/package/kanji-png)** — Generate kanji PNGs and animated stroke-order GIFs.
- **[kotowaza](https://www.npmjs.com/package/kotowaza)** — Japanese proverbs (ことわざ) dataset with bilingual meanings and JLPT levels.

## Attribution & License

This package is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

The underlying dictionary data originates from [kanjiapi.dev](https://kanjiapi.dev) (MIT), which uses the **EDICT and KANJIDIC dictionary files** — the property of the [Electronic Dictionary Research and Development Group](https://www.edrdg.org/), used in conformance with the Group's [licence](https://www.edrdg.org/edrdg/licence.html). JLPT level data sourced from Jonathan Waller's JLPT Resources.

---

[MIT](LICENSE) © [Septian Ganendra S. K.](https://jepang.org)
