const acceptCookies = () => null;

const fetchProducts = async (page) => {
  await page.waitForSelector("#items-holder > div");
  const items = await page.$$("#items-holder > div");

  /* prettier-ignore */
  const products = await Promise.all(
    items.map(async (item) => {
      const [src, price, title, href, productId] = await Promise.all([
        item
          .$eval('img', img => img.getAttribute('src'))
          .catch(() => undefined),
        item
          .$eval('span.price', el => el.innerText)
          .catch(() => undefined),
        item
          .$eval('div.product-item-name a', el => el.innerText)
          .catch(() => undefined),
        item
          .$eval('div.product-item-name a', el => el.getAttribute('href'))
          .catch(() => undefined),
        item
          .$eval('div.product-item-name a', el => el.innerText)
          .catch(() => undefined),
      ]);

      return { src, price, title, productId, href };
    })
  );

  return products.filter((product) => product.productId);
};

const goToNextPage = () => false;

export default { acceptCookies, fetchProducts, goToNextPage };
