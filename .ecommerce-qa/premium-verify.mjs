import { chromium } from 'file:///C:/Users/JAY%20GUPTA/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});const results=[];
for(const width of [320,390,768,1440]) {
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5180/ecommerce',{waitUntil:'domcontentloaded'});await page.locator('.ec-hero h1').waitFor();
 assert.equal(await page.locator('.ec-section-nav a').count(),3);
 assert.equal(await page.locator('body').evaluate(e=>e.scrollWidth<=innerWidth),true,`Overflow ${width}`);
 assert.equal(await page.locator('.ec-metrics strong').first().innerText(),'₹1,24,500');
 for(const id of ['problem','storefront','admin']) {await page.locator(`.ec-section-nav a[href="#${id}"]`).click();await page.waitForTimeout(120);assert.equal(await page.locator('.ec-section-nav a[aria-current]').getAttribute('href'),`#${id}`);const top=await page.locator(`#${id}`).evaluate(e=>e.getBoundingClientRect().top);assert.ok(top>=130,`heading offset ${id}: ${top}`);}
 await page.getByRole('button',{name:'View The essential tee',exact:true}).click();
 await page.getByRole('button',{name:'S',exact:true}).click();await page.getByRole('button',{name:/Add to cart/}).click();
 await page.getByRole('button',{name:'XL',exact:true}).click();await page.getByRole('button',{name:/Add to cart/}).click();
 await page.getByRole('button',{name:'Bag (2) ↗',exact:true}).click();assert.equal(await page.locator('.ec-fashion-cart-row').count(),2);
 await page.getByRole('button',{name:/Continue to demo checkout/}).click();await page.getByRole('button',{name:/Place demo order/}).click();
 await page.getByRole('link',{name:/Follow the order/}).click();
 assert.ok((await page.locator('.ec-dash-orders').innerText()).includes('DEMO-001'));assert.ok((await page.locator('.ec-dash-orders').innerText()).includes('/ XL'));
 await page.getByRole('button',{name:'Mark DEMO-001 as processed'}).click();assert.ok((await page.locator('.ec-dash-orders').innerText()).includes('Processed'));
 await page.getByLabel('Sales date range').selectOption('30 days');await page.locator('.ec-analytics circle[tabindex]').first().focus();assert.ok((await page.locator('.ec-chart-readout').innerText()).includes('₹24,000'));
 for(const name of ['Products','Orders','Inventory','Customers','Settings','Overview']) {await page.getByRole('navigation',{name:'Dashboard views'}).getByRole('button',{name:new RegExp(name)}).click();assert.equal(await page.locator('.ec-dash-header h3').innerText(),name);}
 await page.getByRole('button',{name:'Reset demo orders'}).click();assert.equal(await page.locator('.ec-dash-orders').getByText('DEMO-001').count(),0);
 await page.locator('#storefront').evaluate(e=>e.scrollIntoView());await page.getByRole('button',{name:'Back to shop',exact:true}).click();
 await page.locator('.ec-fashion-filter').getByRole('button',{name:'Layers',exact:true}).click();assert.equal(await page.locator('.ec-fashion-products article').count(),2);
 await page.locator('.ec-fashion-filter').getByRole('button',{name:'All',exact:true}).click();
 await page.screenshot({path:`.ecommerce-qa/premium-${width}.png`,fullPage:true});
 assert.deepEqual(errors,[]);assert.equal(await page.locator('body').evaluate(e=>e.scrollWidth<=innerWidth),true);
 results.push({width,passed:true});await page.close();
}
const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto('http://127.0.0.1:5180/ecommerce',{waitUntil:'domcontentloaded'});await page.locator('.ec-metrics').waitFor();assert.equal(await page.locator('.ec-metrics strong').first().innerText(),'₹0');await page.locator('.ec-metrics').scrollIntoViewIfNeeded();await page.waitForTimeout(1400);assert.equal(await page.locator('.ec-metrics strong').first().innerText(),'₹1,24,500');await page.locator('.ec-hero').scrollIntoViewIfNeeded();await page.locator('.ec-metrics').scrollIntoViewIfNeeded();assert.equal(await page.locator('.ec-metrics strong').first().innerText(),'₹1,24,500');console.log(JSON.stringify({results,counters:'viewport, final values, once-only and reduced motion passed'}));await browser.close();
