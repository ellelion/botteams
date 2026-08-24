import sharp from "sharp";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconSvg = readFileSync(join(root, "public/brand/bt-icon.svg"));

await sharp(iconSvg).resize(512, 512).png().toFile(join(root, "public/icon.png"));
await sharp(iconSvg).resize(180, 180).png().toFile(join(root, "public/apple-icon.png"));
await sharp(iconSvg).resize(32, 32).png().toFile(join(root, "public/favicon.png"));

console.log("Rendered public/icon.png, apple-icon.png, favicon.png");
