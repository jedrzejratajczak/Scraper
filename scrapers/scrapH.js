const acceptCookies = () => null;

const fetchProducts = async (page) => {
  await page.waitForSelector("div.article.ng-scope div.product-list");
  const items = await page.$$("div.article.ng-scope div.product-list");

  /* prettier-ignore */
  const products = await Promise.all(
    items.map(async (item) => {
      const [src, title, href, productId] = await Promise.all([
        item
          .$eval('div.p-pict a img', img => img.getAttribute('src'))
          .catch(() => undefined),
        item
          .$eval('div.product-title a.ng-binding', el => el.innerText)
          .catch(() => undefined),
        item
          .$eval('div.product-title a.ng-binding', el => el.getAttribute('href'))
          .catch(() => undefined),
        item
          .$eval('h3.ng-binding span.ref.ng-binding', el => el.innerText)
          .catch(() => undefined),
      ]);

      return { src, price: undefined, title, productId, href: `${process.env.H_BASE}${href}` };
    })
  );

  return products.filter((product) => product.productId);
};

const goToNextPage = () => false;

export default { acceptCookies, fetchProducts, goToNextPage };
