import { chromium } from "file:///C:/Users/JAY%20GUPTA/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import assert from "node:assert/strict";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = "http://127.0.0.1:5180";
await page.goto(base + "/ecommerce");
await page.locator(".ec-hero h1").waitFor();
const anchors = await page
  .locator(".ec-section-nav a")
  .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
for (const hash of anchors) {
  await page.locator(`.ec-section-nav a[href="${hash}"]`).click();
  await page.waitForFunction(
    (id) => document.activeElement.id === id,
    hash.slice(1),
  );
  const top = await page
    .locator(hash)
    .evaluate((e) => e.getBoundingClientRect().top);
  assert(top >= 75 && top < 150, `${hash} anchor offset ${top}`);
  await page.waitForFunction(
    (hash) =>
      document
        .querySelector(".ec-section-nav a[aria-current]")
        .getAttribute("href") === hash,
    hash,
  );
}
await page.locator('.ec-section-nav a[href="#storefront"]').click();
await page.getByRole("button", { name: "Home", exact: true }).click();
assert.equal(await page.locator(".ec-products article").count(), 1);
await page.getByRole("button", { name: "All", exact: true }).click();
await page
  .getByRole("button", { name: "View Everyday tote", exact: true })
  .click();
await page.getByRole("button", { name: "Add to bag +", exact: true }).click();
await page.getByRole("button", { name: "Bag (1)" }).click();
await page.getByRole("button", { name: "Continue to demo checkout" }).click();
await page.getByRole("button", { name: "Place demo order" }).click();
await page.getByRole("link", { name: "Follow the order" }).click();
assert.match(await page.locator(".ec-incoming").innerText(), /Everyday tote/);
assert.match(await page.locator(".ec-incoming").innerText(), /790/);
await page.getByRole("button", { name: "Mark as processed" }).click();
assert.match(await page.locator(".ec-incoming").innerText(), /Processed/);
for (const tab of ["Products", "Inventory", "Customers", "Orders"])
  await page.getByRole("button", { name: tab, exact: true }).click();
await page.getByRole("button", { name: "Reset demo", exact: true }).click();
assert.equal(await page.locator(".ec-incoming").count(), 0);
await page
  .locator(".ec-project-feature-0")
  .getByRole("button", { name: "Catalog", exact: true })
  .click();
assert.match(
  await page.locator(".ec-project-feature-0 img").getAttribute("src"),
  /153630/,
);
await page
  .locator(".ec-project-feature-1")
  .getByRole("button", { name: "Catalog", exact: true })
  .click();
assert.match(
  await page.locator(".ec-project-feature-1 img").getAttribute("src"),
  /153658/,
);
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  for (const hash of anchors) {
    await page.locator(hash).scrollIntoViewIfNeeded();
  }
  await page.locator("#idea").scrollIntoViewIfNeeded();
  const overflow = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth > innerWidth,
    els: [...document.querySelectorAll(".ec-page *")]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return (
          r.width &&
          getComputedStyle(e).position !== "fixed" &&
          (r.right > innerWidth + 2 || r.left < -2)
        );
      })
      .map((e) => e.className?.baseVal ?? e.className),
  }));
  assert.equal(overflow.page, false, `page overflow ${width}`);
  console.log("layout", width, JSON.stringify(overflow));
  await page.screenshot({ path: `.ecommerce-qa/${width}.png` });
  if (width === 390)
    await page.screenshot({
      path: ".ecommerce-qa/mobile-full.png",
      fullPage: true,
    });
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.locator("#real-projects").scrollIntoViewIfNeeded();
await page.waitForFunction(() =>
  [...document.querySelectorAll(".ec-project-preview img")].every(
    (e) => e.complete && e.naturalWidth,
  ),
);
await page.screenshot({ path: ".ecommerce-qa/projects.png" });
await page.screenshot({ path: ".ecommerce-qa/full-final.png", fullPage: true });
for (const [topic, subject] of [
  ["ready-to-launch", "Explore a ready-to-launch e-commerce store"],
  ["custom-ecommerce", "Discuss a custom e-commerce project"],
  ["ecommerce-quote", "Request an e-commerce quote"],
  ["ecommerce", "Discuss an e-commerce project"],
]) {
  await page.goto(base + "/contact?topic=" + topic);
  await page.locator("input[name=subject]").waitFor();
  assert.equal(await page.locator("input[name=subject]").inputValue(), subject);
}
// Exercise existing enquiry success and error handling without sending email.
await page.route("https://api.web3forms.com/submit", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: false }),
  }),
);
for (const [name, value] of [
  ["email", "qa@example.com"],
  ["name", "Local QA"],
  ["subject", "Test"],
  ["message", "Intercepted local test; never submitted."],
])
  await page.locator(`[name=${name}]`).fill(value);
await page.locator("button[type=submit]").click();
await page.getByText("Failed to send message. Please try again.").waitFor();
assert.equal(
  await page.locator("input[name=email]").inputValue(),
  "qa@example.com",
);
await page.unroute("https://api.web3forms.com/submit");
await page.route("https://api.web3forms.com/submit", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: true }),
  }),
);
await page.locator("button[type=submit]").click();
await page.getByText(/Message sent successfully/).waitFor();
assert.equal(await page.locator("input[name=email]").inputValue(), "");
for (const route of ["/projects", "/about", "/"]) {
  await page.goto(base + route);
  await page.locator(".site-nav").waitFor();
  assert(await page.locator("#root").innerText());
}
console.log(
  JSON.stringify({ result: "PASS", anchors: anchors.length, errors }),
);
assert.deepEqual(errors, []);
await browser.close();
