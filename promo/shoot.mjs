// ページを開いて、スクロール位置ごとに画面を撮る（サイトの案を自分で確かめる用）。
//   node shoot.mjs <html> <出力の接頭辞> <幅>x<高さ> <スクロール位置(px),...> [待つ秒数]
import puppeteer from "puppeteer-core";
import { pathToFileURL } from "node:url";

const [file, prefix, size = "1440x900", scrolls = "0", wait = "2.5"] = process.argv.slice(2);
const [w, h] = size.split("x").map(Number);
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto(/^https?:/.test(file) ? file : pathToFileURL(file).href, { waitUntil: "networkidle2", timeout: 90000 });
await page.evaluate(async () => { await document.fonts.ready; });
await new Promise((r) => setTimeout(r, Number(wait) * 1000));
for (const spec of scrolls.split(",")) {
  // 数字ならその位置、#id ならその要素の上端（+数字でずらす）
  const y = spec.startsWith("#") ? await page.evaluate((s) => { const [id, off] = s.slice(1).split("+"); const el = document.getElementById(id); return el.getBoundingClientRect().top + scrollY + Number(off || 0); }, spec) : Number(spec);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${prefix}-${w}-${spec.replace(/[#+]/g, "_")}.png` });
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log(JSON.stringify({ errors, overflowX: overflow, height: await page.evaluate(() => document.documentElement.scrollHeight) }));
await browser.close();
