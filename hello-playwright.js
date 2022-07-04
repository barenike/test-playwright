const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();

  // Go to https://playwright.dev/
  await page.goto('https://playwright.dev/');

  // Click nav >> text=API
  await page.locator('nav >> text=API').click();
  await page.waitForURL('https://playwright.dev/docs/api/class-playwright');

  // Click aside >> text=Browser >> nth=0
  await page.locator('aside >> text=Browser').first().click();
  await page.waitForURL('https://playwright.dev/docs/api/class-browser');

  await page.screenshot({path: 'playwright_api_screen.png'});

  // ---------------------
  await context.close();
  await browser.close();
})();