const { test, expect } = require('@playwright/test');

async function waitForMochaAndAssertResult(page) {
  await page.waitForFunction(() => window.mochaResults); // eslint-disable-line no-undef
  const mochaResults = await page.evaluate('window.mochaResults');

  expect(mochaResults.failures).toBe(0);
}

test('Spec guardrails.js', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/spec/?headless=true`);
  await waitForMochaAndAssertResult(page);
});

test('Spec guardrails.js (UMD)', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/spec/umd.html?headless=true`);
  await waitForMochaAndAssertResult(page);
});

test('Spec guardrails.runtime.js (UMD)', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/spec/umd-runtime.html?headless=true`);
  await waitForMochaAndAssertResult(page);
});
