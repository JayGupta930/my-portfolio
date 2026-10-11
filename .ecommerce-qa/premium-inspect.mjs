import { chromium } from 'file:///C:/Users/JAY%20GUPTA/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5180/ecommerce',{waitUntil:'domcontentloaded'});await page.locator('.ec-hero h1').waitFor();
await page.screenshot({path:'.ecommerce-qa/premium-hero.png'});
await page.locator('#storefront').scrollIntoViewIfNeeded();await page.locator('.ec-premium-store').screenshot({path:'.ecommerce-qa/premium-store.png'});
await page.locator('#admin').scrollIntoViewIfNeeded();await page.waitForTimeout(1400);await page.locator('.ec-premium-admin').screenshot({path:'.ecommerce-qa/premium-admin.png'});
console.log(JSON.stringify({errors,nav:await page.locator('.ec-section-nav').innerText(),metrics:await page.locator('.ec-metrics').innerText()}));
await browser.close();

