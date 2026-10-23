// og.html を 1200×630 の PNG にする（../assets/og.png）
import puppeteer from "puppeteer-core";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
const here = path.dirname(fileURLToPath(import.meta.url));
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, "og.html")).href, { waitUntil: "networkidle0" });
await page.evaluate(async () => { await document.fonts.ready; });
await page.screenshot({ path: path.join(here, "..", "assets", "og.png") });
await browser.close();
console.log("og → assets/og.png");
