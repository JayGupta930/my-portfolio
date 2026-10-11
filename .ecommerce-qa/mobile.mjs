import { chromium } from "file:///C:/Users/JAY%20GUPTA/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import assert from "node:assert/strict";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:5180/ecommerce#admin");
await page.locator("#admin-title").waitFor();
await page.waitForFunction(
  () =>
    Math.abs(
      document.querySelector("#admin").getBoundingClientRect().top - 90,
    ) < 5,
);
await page.getByRole("button", { name: "Open navigation" }).focus();
await page.keyboard.press("Enter");
await page.locator(".site-nav-panel").waitFor();
await page
  .locator(".site-nav-panel")
  .getByRole("link", { name: "E-commerce", exact: true })
  .click();
assert.equal(await page.locator(".site-nav-panel").count(), 0);
await page.locator('.ec-section-nav a[href="#idea"]').click();
await page.waitForFunction(
  () => document.querySelector("#idea").getBoundingClientRect().top < 100,
);
await page.getByRole("link", { name: "See How It Works" }).click();
await page.waitForFunction(
  () =>
    Math.abs(
      document.querySelector("#problem").getBoundingClientRect().top - 90,
    ) < 5,
);
await page.locator('.ec-section-nav a[href="#storefront"]').click();
await page
  .getByRole("button", { name: "Add to bag +", exact: true })
  .first()
  .click();
await page.getByRole("button", { name: "Bag (1)" }).click();
await page.getByRole("button", { name: "Remove Everyday tote" }).click();
assert.match(await page.locator(".ec-cart").innerText(), /empty/);
await page.getByRole("button", { name: "Keep exploring" }).click();
await page
  .getByRole("button", { name: "Add to bag +", exact: true })
  .last()
  .click();
await page.getByRole("button", { name: "Bag (1)" }).click();
await page.getByRole("button", { name: "Continue to demo checkout" }).click();
await page.getByRole("button", { name: "Place demo order" }).click();
await page.getByRole("link", { name: "Follow the order" }).click();
await page.getByRole("button", { name: "Mark as processed" }).click();
assert.match(
  await page.locator(".ec-incoming").innerText(),
  /Slow morning mug/,
);
await page.screenshot({ path: ".ecommerce-qa/mobile-admin.png" });
await page.locator('.ec-section-nav a[href="#idea"]').click();
await page.waitForFunction(
  () =>
    document.querySelector(".ec-section-nav a[aria-current]").hash === "#idea",
);
await page.screenshot({ path: ".ecommerce-qa/mobile-final.png" });
console.log(
  "PASS: direct hash, smooth anchors, keyboard mobile navigation, remove item, mobile checkout and admin.",
);
await browser.close();
