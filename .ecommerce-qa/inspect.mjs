import { chromium } from "file:///C:/Users/JAY%20GUPTA/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5180/ecommerce");
await page.locator(".ec-hero h1").waitFor();
await page.screenshot({ path: ".ecommerce-qa/desktop.png", fullPage: true });
console.log(
  JSON.stringify({
    title: await page.title(),
    sections: await page.locator(".ec-section").count(),
    errors,
  }),
);
await browser.close();
