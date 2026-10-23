// index.html を 1 コマずつ撮って、動画にする。
//   node render.mjs                 → koebumi-promo.mp4（30 秒、1920×1080、30fps）
//   node render.mjs --stills 1,5,12 → stills/ に指定した秒の静止画だけ書き出す
// この Mac の Google Chrome を使う（puppeteer-core はブラウザを入れない）。
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import puppeteer from "puppeteer-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const args = process.argv.slice(2);
const opt = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const stillsArg = opt("--stills", null);
const PAGE = opt("--page", "index.html");
const OUT = opt("--out", "koebumi-promo.mp4");
const FPS = Number(opt("--fps", "30"));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files", "--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, PAGE)).href + "?render", { waitUntil: "load" });
await page.evaluate(async () => { await document.fonts.ready; });

async function shoot(t, file) {
  await page.evaluate((x) => window.renderAt(x), t);
  await page.screenshot({ path: file, type: "png" });
}

if (stillsArg) {
  const dir = path.join(here, "stills");
  mkdirSync(dir, { recursive: true });
  for (const s of stillsArg.split(",").map(Number)) {
    await shoot(s, path.join(dir, `${path.basename(PAGE, ".html")}-t${String(s).replace(".", "_")}.png`));
  }
  await browser.close();
  console.log(`stills → ${dir}`);
} else {
  const duration = await page.evaluate(() => window.DURATION);
  const frames = path.join(here, "frames");
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    await shoot(i / FPS, path.join(frames, `${String(i).padStart(4, "0")}.png`));
    if (i % (FPS * 3) === 0) console.log(`frame ${i}/${total}`);
  }
  await browser.close();
  // X の推奨に合わせて H.264・yuv420p にする。音は入れない
  const out = path.join(here, OUT);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(frames, "%04d.png"),
    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", out], { stdio: "inherit" });
  console.log(`video → ${out}`);
}
