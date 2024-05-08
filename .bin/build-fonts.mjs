#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { withWebpackContext } from "../bundle-helper.mjs";
import path from 'path'

const args = process.argv;//.slice(1);
args.forEach((value, index) => {
    console.log(index, value);
});

const fontDir = args[2]

const _require = withWebpackContext();

const ctx = await _require.context(fontDir, true, /\.(woff2?|eot|ttf|otf)$/);

// console.log(ctx);

const fonts = ctx.keys().map(f => ({ path: f }))

await writeFile(path.resolve(fontDir, '../fonts.json'), JSON.stringify(fonts, null, 2), "utf8");