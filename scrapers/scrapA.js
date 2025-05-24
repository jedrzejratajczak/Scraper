const acceptCookies = async (page) => {
  const acceptCookiesButton = await page.$("#sp-cc-accept");
  if (acceptCookiesButton) await acceptCookiesButton.click();
};

const fetchProducts = async (page) => {
  await page.waitForSelector(".s-main-slot .s-widget-spacing-small");
  const items = await page.$$(".s-main-slot .s-widget-spacing-small");

  /* prettier-ignore */
  const products = await Promise.all(
    items.map(async (item) => {
      const [src, price, title, href, productId] = await Promise.all([
        item
          .$eval('img.s-image', img => img.getAttribute('src'))
          .catch(() => undefined),
        item
          .$eval('span.a-price span.a-offscreen', el => el.innerText)
          .catch(() => undefined),
        item
          .$eval('h2.a-size-base-plus.a-color-base.a-text-normal span', el => el.innerText)
          .catch(() => undefined),
        item
          .$eval('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal', el => el.getAttribute('href'))
          .catch(() => undefined),
        item
          .evaluate(el => el.getAttribute('data-asin'))
          .catch(() => undefined),
      ]);

      return { src, price, title, productId, href: `${process.env.A_BASE}${href?.split("?")[0]}` };
    })
  );

  return products.filter((product) => product.productId);
};

const goToNextPage = () => false;

export default { acceptCookies, fetchProducts, goToNextPage };
