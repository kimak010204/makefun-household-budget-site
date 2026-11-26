// Anggaran Keluarga Mahesa — program penyerahan (Node 22, stdlib saja).
// Menyalin app/ dan screenshots/ dari samping file ini ke direktori output,
// lalu menulis dossier.json memakai buildDossier dari vendor.
// Di luar grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const root = fileURLToPath(new URL(".", import.meta.url));
const target = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Gagal cepat dengan pesan jelas bila sumber tidak lengkap, sebelum
// menyalin apa pun — jangan menghasilkan output setengah jadi.
if (!existsSync(join(root, "app", "index.html"))) {
  throw new Error("app/index.html tidak ditemukan di " + root);
}
if (!existsSync(join(root, "vendor", "makefun-frontend.ts"))) {
  throw new Error("vendor/makefun-frontend.ts tidak ditemukan di " + root);
}

mkdirSync(target, { recursive: true });
cpSync(join(root, "app"), join(target, "app"), { recursive: true });
mkdirSync(join(target, "screenshots"), { recursive: true });
if (existsSync(join(root, "screenshots"))) {
  cpSync(join(root, "screenshots"), join(target, "screenshots"), { recursive: true });
}

const dossier = buildDossier(target, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(target, "dossier.json"), dossier);
