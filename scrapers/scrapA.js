const acceptCookies = async (page) => {
  const acceptCookiesButton = await page.$("#sp-cc-accept");
  if (acceptCookiesButton) await acceptCookiesButton.click();
};

const fetchProducts = async (page) => {
  const items = await page.$$(`.s-main-slot .s-widget-spacing-small`);

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
          .$eval('span.a-size-base-plus.a-color-base.a-text-normal', el => el.innerText)
          .catch(() => undefined),
        item
          .$eval('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal', el => el.getAttribute('href'))
          .catch(() => undefined),
        item
          .evaluate(el => el.getAttribute('data-uuid'))
          .catch(() => undefined),
      ]);

      return { src, price, title, productId, href };
    })
  );

  return products;
};

const goToNextPage = () => false;

export default { acceptCookies, fetchProducts, goToNextPage };
