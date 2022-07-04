const { chromium } = require('playwright');
const login = 'demobank';
const password = '123456';
const smsCode = '1234';
const incorrectEmailMessage = 'Введен некорректный email';

describe('Launch Browser', () => {
  test('Open isfront.ru', async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();

  // Go to https://isfront.ru/
  await page.goto('https://isfront.ru/');

  // Go to https://isfront.ru/login
  await page.goto('https://isfront.ru/login');

  // Click button:has-text("Вход под ЭП")
  await page.locator('button:has-text("Вход под ЭП")').click();

  // Click text=Вход под СМС
  await page.locator('text=Вход под СМС').click();

  // Click [placeholder="Email\/Телефон"]
  await page.locator('[placeholder="Email\\/Телефон"]').click();

  // Fill [placeholder="Email\/Телефон"]
  await page.locator('[placeholder="Email\\/Телефон"]').fill(login);

  // Click [placeholder="Пароль"]
  await page.locator('[placeholder="Пароль"]').click();

  // Fill [placeholder="Пароль"]
  await page.locator('[placeholder="Пароль"]').fill(password);

  // Click text=Войти
  await page.locator('text=Войти').click();
  await page.waitForURL('https://isfront.ru/login/confirm');

  // Fill [placeholder="Код из SMS"]
  await page.locator('[placeholder="Код из SMS"]').fill(smsCode);

  // Click text=Войти
  await page.locator('text=Войти').click();
  await page.waitForURL('https://isfront.ru/summary');

  // Click text=Счета и карты
  await page.locator('text=Счета и карты').click();
  await page.waitForURL('https://isfront.ru/accounts-and-cards');

  // Click ui-show-more div:has-text("Спец транзитный счет Выписка 40702840400000000007 2 098,49") >> nth=1
  await page.locator('ui-show-more div:has-text("Спец транзитный счет Выписка 40702840400000000007 2 098,49")').nth(1).click();
  await page.waitForURL('https://isfront.ru/account/details/40702840400000000007');

  // First manual check
  let dynamicAccountNumber = await page.locator(".invoice-name-details").textContent();
  let detailsAccountNumber = await page.locator("//span[text()='40702840400000000007']").textContent();
  expect(detailsAccountNumber).toBe(dynamicAccountNumber.substring(4));

  // Click text=Реквизиты счета
  await page.locator('text=Реквизиты счета').click();

  // Second manual check
  expect(await page.locator(".modal").isVisible()).toBeTruthy();

  // Third manual check
  expect(await page.locator("//button[text()='Версия для печати']").isVisible()).toBeTruthy();
  
  // Click [placeholder="Адрес e-mail"]
  await page.locator('[placeholder="Адрес e-mail"]').click();

  // Fill [placeholder="Адрес e-mail"]
  await page.locator('[placeholder="Адрес e-mail"]').fill('abc');

  // Click button:has-text("Отправить")
  await page.locator('button:has-text("Отправить")').click();

  // Fourth manual check
  await page.waitForTimeout(1000);
  expect(await page.locator('text=' + incorrectEmailMessage).isVisible()).toBeTruthy();

  // ---------------------
  await context.close();
  await browser.close();
}, 30000)});