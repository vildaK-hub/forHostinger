import { test, expect } from '@playwright/test';
import { OrderPage } from '../pages/orderPage.ts';

test('Make Online order', async ({ page }) => {
  const product = 'Glazed Paradise Donuts';
  const shippingPrice = 2.50;
  const phone = '61067454';

  const order = new OrderPage(page);
  await order.gotoBaseurl();
  await order.clickOnLink('Shop');
  await expect(order.logo).toBeVisible();
  await expect(page).toHaveURL(/shop/);
  await order.clickOnLink(product);

  // assert checkout window, get the price and add 2 items to bag
  await order.roleIsVisible(product);
  const priceText = await order.getTotalText();
  const priceFor1 = parseFloat(priceText.slice(1)).toFixed(2);
  const priceFor2 = parseFloat(2 * priceFor1).toFixed(2);
  console.log("Price for 1 quantity: " + priceFor1);
  console.log("Price for 2 quantities: " + priceFor2);
  await order.plusBtn.click();
  await expect(order.qty).toHaveValue('2');
  await order.addBtn.click();

  // assert checkout window
  await order.textIsVisible('Shopping bag');
  await order.checkoutFieldsIsVisible(product);
  await order.checkoutFieldsIsVisible(`€${priceFor1}`);
  await expect(order.cartQty).toHaveValue('2');
  await order.checkoutFieldsIsVisible(`Subtotal: €${priceFor2}Checkout`);
  await order.checkoutBtn.click();

  // assert contact information window
  const totalPrice = (parseFloat(priceFor2) + parseFloat(shippingPrice)).toFixed(2);
  console.log("Total price: " + totalPrice);
  await order.destination.click();
  await order.shipToLt.click();
  await order.textIsVisible('Shipping destinationLithuania');
  await expect(order.cartItem).toHaveText(`${product} €${priceFor2} €${priceFor1} each`);
  await expect(order.cartSubTotalName).toHaveText('Subtotal');
  await expect(order.cartSubTotalValue).toHaveText(`€${priceFor2}`);
  await expect(order.cartTotalName).toHaveText('Total due');
  await expect(order.cartTotalValue).toHaveText(`€${totalPrice}`);
  await page.getByPlaceholder('Choose address').fill('Vilniaus RIMI');
  await page.getByText('Vilniaus RIMI Žirmūnų paš').click();
  await order.continueBtn.click();
  await order.fillText('Email', 'vildag@gmail.com');
  await order.clickOnText('Your full name');
  await order.fillText('Your full name', 'Vilda test');
  await order.countryCodeBtn.click();
  await order.clickOnText('Search by country name or');
  await order.fillText('Search by country name or', 'Lithuania');
  await order.countryCodeBtn.click();
  await order.fillText('Your phone number', phone);
  await order.fillText('Your comment', 'no');
  await expect(page.locator(`[value="+370${phone}"]`)).toBeVisible();
  await order.continueBtn.click();

  // assert payment window
  await order.textIsVisible('Please ensure that you include the reference to help us identify your payment. Thank you!');
  await order.textIsVisible('You will get a copy of these instructions to your email after placing an order');
  await expect(order.total).toHaveText(`€${totalPrice}`);
  await expect(order.cartItem).toHaveText(`${product} €${priceFor2} €${priceFor1} each`);
  await expect(order.cartSubTotalName).toHaveText('Subtotal');
  await expect(order.cartSubTotalValue).toHaveText(`€${priceFor2}`);
  await expect(order.cartTotalName).toHaveText('Total due');
  await expect(order.cartTotalValue).toHaveText(`€${totalPrice}`);
  await expect(order.paymentMethods).toHaveText('Bank Transfer');
  await order.placeOrderBtn.click();

  // // assert order created window
  await order.roleIsVisible('Thank you for your order');
  await order.textIsVisible('Your order has been received.');
  await order.gotItBtn.click();
  await expect(page).toHaveURL(/open-modal=EcommerceCheckoutSuccess/);
  await page.close();
});