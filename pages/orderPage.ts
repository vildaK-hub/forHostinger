import { expect, type Locator, type Page } from '@playwright/test';

export class OrderPage {
  readonly page: Page; readonly logo: Locator; readonly total: Locator;
  readonly qty: Locator; readonly cartQty: Locator; readonly destination: Locator;
  readonly shipToLt: Locator; readonly cartItem: Locator; readonly cartSubTotalName: Locator;
  readonly cartSubTotalValue: Locator; readonly cartTotalName: Locator; readonly cartTotalValue: Locator;
  readonly paymentMethods: Locator; readonly plusBtn: Locator; readonly addBtn: Locator;
  readonly checkoutBtn: Locator; readonly continueBtn: Locator; readonly countryCodeBtn: Locator;
  readonly placeOrderBtn: Locator; readonly gotItBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByRole('link', { name: 'Muffin logo' });
    this.total = page.locator('.total-price.text-black');
    this.qty = page.locator('span').filter({ hasText: '- +' }).getByRole('textbox');
    this.cartQty = page.locator('//input[@data-qa="shoppingcart-text-qty"]');
    this.destination = page.locator('#destination');
    this.shipToLt = page.getByRole('option', { name: 'Lithuania' });
    this.cartItem = page.locator('//div[@data-qa="checkout-cartsummary-item"]');
    this.cartSubTotalName = page.locator('//div[@data-qa="checkout-cartsummary-subtotalprice-name"]');
    this.cartSubTotalValue = page.locator('//div[@data-qa="checkout-cartsummary-subtotalprice-value"]');
    this.cartTotalName = page.locator('//div[@data-qa="checkout-cartsummary-totalprice-name"]');
    this.cartTotalValue = page.locator('//div[@data-qa="checkout-cartsummary-totalprice-value"]');
    this.paymentMethods = page.locator('//div[@data-qa="checkout-paymentmethods-manual"]');
    this.plusBtn = page.getByRole('button', { name: '+' });
    this.addBtn = page.getByRole('button', { name: 'Add to bag' });
    this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
    this.continueBtn = page.getByRole('button', { name: 'Continue' });
    this.countryCodeBtn = page.getByRole('button', { name: 'Country Code Selector' });
    this.placeOrderBtn = page.getByRole('button', { name: 'Place an order' });
    this.gotItBtn = page.getByRole('button', { name: 'Got it' });
  }

  async gotoBaseurl() {
    await this.page.goto('https://lightgrey-antelope-m7vwozwl8xf7l3y2.builder-preview.com/');
  }

  async clickOnLink(name: string) {
    await this.page.getByRole('link', { name: name }).click();
  }

  async roleIsVisible(name: string) {
    await expect(this.page.getByRole('heading', { name: name })).toBeVisible();
  }

  async textIsVisible(text: string) {
    await expect(this.page.getByText(text)).toBeVisible({ timeout: 10000 });
  }

  async checkoutFieldsIsVisible(field: string) {
    await expect(this.page.getByRole('complementary').getByText(field)).toBeVisible();
  }

  async fillText(field: string, text: string) {
    await this.page.getByRole('textbox', { name: field }).fill(text);
  }

  async clickOnText(field: string) {
    await this.page.getByRole('textbox', { name: field }).click();
  }

  async getTotalText(): Promise<string | null> {
    const prText = await this.page.textContent('.block-product__price');
    console.log("Price text: " + prText);
    return prText;
  }
}