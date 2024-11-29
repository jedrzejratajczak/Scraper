const acceptCookies = () => null;

const fetchProducts = async (page) => {
  const items = await page.$$(`div.article.ng-scope div .line.ng-scope`);

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

      return { src, price: null, title, productId, href: `${process.env.H_BASE}${href}` };
    })
  );

  return products.filter((product) => product.productId);
};

const goToNextPage = () => false;

export default { acceptCookies, fetchProducts, goToNextPage };
