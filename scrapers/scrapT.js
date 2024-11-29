const acceptCookies = () => null;

const fetchProducts = async (page) => {
  const items = await page.$$(`.products.row article.product-miniature`);

  /* prettier-ignore */
  const products = await Promise.all(
    items.map(async (item) => {
      const [src, title, href, productId] = await Promise.all([
        item
          .$eval('img.img_1', img => img.getAttribute('src'))
          .catch(() => undefined),
        item
          .$eval('h5.product-title a', el => el.innerText)
          .catch(() => undefined),
        item
          .$eval('a.thumbnail.product-thumbnail', el => el.getAttribute('href'))
          .catch(() => undefined),
        item
          .evaluate(el => el.getAttribute('data-id-product'))
          .catch(() => undefined),
      ]);

      return { src, price: null, title, productId, href };
    })
  );

  return products.filter((product) => product.productId);
};

const goToNextPage = () => false;

export default { acceptCookies, fetchProducts, goToNextPage };
