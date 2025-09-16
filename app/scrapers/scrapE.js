const acceptCookies = async (page) => {
  const acceptCookiesButton = await page.$('button[data-ta="cookie-btn-accept-all"]');

  if (acceptCookiesButton) {
    await acceptCookiesButton.click();
  }
};

const fetchProducts = async (page) => {
  await page.waitForSelector('div.search-content div.search-list-item');
  const items = await page.$$('div.search-content div.search-list-item');

  const products = await Promise.all(
    items.map(async (item) => {
      const [src, price, title, href, productId] = await Promise.all([
        item.$eval('img.lazy', (img) => img.getAttribute('lazy-img')).catch(() => undefined),
        item.$eval('div.price.ta-price-tile', (el) => el.getAttribute('content')).catch(() => undefined),
        item.$eval('h2.product-title a.seoTitle', (el) => el.getAttribute('title')).catch(() => undefined),
        item.$eval('a.img.seoImage', (el) => el.getAttribute('href')).catch(() => undefined),
        item.evaluate((el) => el.getAttribute('data-product-id')).catch(() => undefined),
      ]);

      return { src, price, title, productId, href: `${process.env.E_BASE}${href}` };
    })
  );

  return products.filter((product) => product.productId);
};

const goToNextPage = async (page) => {
  const footerSelector = await page.waitForSelector('div.search-footer');

  const nextPageButton = await footerSelector.$('a.ta-next-page');
  const nextPageButtonClasses = await nextPageButton.evaluate((el) => el.className);

  if (nextPageButtonClasses.includes('disabled')) {
    return false;
  }

  await nextPageButton.click();
  await page.waitForNavigation();
  return true;
};

export default { acceptCookies, fetchProducts, goToNextPage };
