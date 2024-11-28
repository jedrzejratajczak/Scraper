const acceptCookies = async (page) => {
  const acceptCookiesButton = await page.$(
    'button[data-ta="cookie-btn-accept-all"]'
  );

  if (acceptCookiesButton) {
    await acceptCookiesButton.click();
  }
};

const fetchProducts = async (page) => {
  const itemsContainerSelector = await page.waitForSelector(
    "div.search-content"
  );
  const items = await itemsContainerSelector.$$("div.search-list-item");

  const products = [];

  for (const item of items) {
    const hasRibbonAdvertisement = await item.$(".ribbon--advertisement");
    if (hasRibbonAdvertisement) {
      continue;
    }

    const srcTag = await item.$("img.lazy");
    const priceTag = await item.$("div.price");
    const titleTag = await item.$("a.seoTitle");

    const src = srcTag
      ? await page.evaluate((img) => img.getAttribute("lazy-img"), srcTag)
      : undefined;
    const price = priceTag
      ? await page.evaluate((price) => price.textContent.trim(), priceTag)
      : undefined;
    const title = titleTag
      ? await page.evaluate((link) => link.title, titleTag)
      : undefined;
    const productId = titleTag
      ? await page.evaluate((link) => link.dataset.productId, titleTag)
      : undefined;
    const href = titleTag
      ? await page.evaluate((link) => link.href, titleTag)
      : undefined;

    if (!productId) {
      continue;
    }

    products.push({ src, price, title, productId, href });
  }

  return products;
};

const goToNextPage = async (page) => {
  const footerSelector = await page.waitForSelector("div.search-footer");

  const nextPageButton = await footerSelector.$("a.ta-next-page");
  const nextPageButtonClasses = await nextPageButton.evaluate(
    (el) => el.className
  );

  if (nextPageButtonClasses.includes("disabled")) {
    return false;
  }

  await nextPageButton.click();
  await page.waitForNavigation();
  return true;
};

export default { acceptCookies, fetchProducts, goToNextPage };
