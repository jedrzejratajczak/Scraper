const acceptCookies = async (page) => {
  const acceptCookiesButton = await page.$("consents-accept-necessary");

  if (acceptCookiesButton) {
    await acceptCookiesButton.click();
  }
};

const fetchProducts = async (page) => {
  const itemsContainerSelector = await page.waitForSelector(
    "product-list > div"
  );
  const items = await itemsContainerSelector.$$("product-tile");

  const products = [];

  for (const item of items) {
    const srcTag = await item.$("picture.image img");
    const priceTag = await item.$("span.price__value");
    const titleTag = await item.$("h2.product-tile__name");
    const hrefTag = await item.$("product-link a");
    const productIdTag = await item.$("product-tile");

    const src = srcTag
      ? await page.evaluate((img) => img.src, srcTag)
      : undefined;
    const price = priceTag
      ? await page.evaluate((price) => price.textContent.trim(), priceTag)
      : undefined;
    const title = titleTag
      ? await page.evaluate((link) => link.textContent.trim(), titleTag)
      : undefined;
    const productId = productIdTag
      ? await page.evaluate(
          (tag) => tag.getAttribute("product-id"),
          productIdTag
        )
      : undefined;
    const href = hrefTag
      ? await page.evaluate((link) => link.href, hrefTag)
      : undefined;

    products.push({ src, price, title, productId, href });
  }

  return products.filter((product) => product.productId);
};

const goToNextPage = () => false;

export default { acceptCookies, fetchProducts, goToNextPage };
