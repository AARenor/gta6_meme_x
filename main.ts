// Copies POST.json from the bot directory to the output directory.
// Node 22, standard library only. No network and no clock: the same input
// writes the same bytes every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = readFileSync(join(botDir, "POST.json"));
const parsed: unknown = JSON.parse(source.toString("utf8"));

if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
  process.stderr.write("POST.json must be a JSON object\n");
  process.exit(1);
}

const url = (parsed as { url?: unknown }).url;
const xPost =
  /^https:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/(?:[A-Za-z0-9_]{1,15}\/status|i\/web\/status)\/\d+\/?(?:[?#].*)?$/;
const starter = "https://x.com/<handle>/status/<id>";

if (typeof url !== "string" || (url !== starter && !xPost.test(url))) {
  process.stderr.write("POST.json url must be an X post address\n");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "POST.json"), source);
