const acceptCookies = async (page) => {
  const acceptCookiesButton = await page.$(
    "button#cookiejar-popup-main-button-accept"
  );

  if (acceptCookiesButton) {
    await acceptCookiesButton.click();
  }
};

const fetchProducts = async (page) => {
  const itemsContainerSelector = await page.waitForSelector(
    "div.products-box-listing-results"
  );
  const items = await itemsContainerSelector.$$("div.product-box");

  const products = [];

  for (const item of items) {
    const srcTag = await item.$("div.product-image img");
    const priceTag = await item.$("div.product-price");
    const titleTag = await item.$("div.product-title");
    const cartButtonTag = await item.$("div.product-actions button.cartbutton");
    const hrefTag = await item.$("div.product-title > a");

    const src = srcTag
      ? await page.evaluate((img) => img.src, srcTag)
      : undefined;
    const price = priceTag
      ? await page.evaluate((price) => price.textContent.trim(), priceTag)
      : undefined;
    const title = titleTag
      ? await page.evaluate((link) => link.textContent.trim(), titleTag)
      : undefined;
    const productId = cartButtonTag
      ? await page.evaluate(
          (button) => button.getAttribute("data-product-id"),
          cartButtonTag
        )
      : undefined;
    const href = hrefTag
      ? await page.evaluate((link) => link.href, hrefTag)
      : undefined;

    if (!src || !price || !title || !productId || !href) {
      continue;
    }

    products.push({ src, price, title, productId, href });
  }

  return products.filter((product) => product.productId);
};

const goToNextPage = async (page) => {
  const footerSelector = await page.waitForSelector(".pagination");

  const nextPageButton = await footerSelector.$("a.--next");

  if (!nextPageButton) {
    return false;
  }

  await page.evaluate((button) => button.click(), nextPageButton);
  await page.waitForNavigation();
  return true;
};

export default { acceptCookies, fetchProducts, goToNextPage };
