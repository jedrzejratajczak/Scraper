const acceptCookies = () => null;

const fetchProducts = async (page) => {
  await page.waitForSelector('product-list product-tile');
  const items = await page.$$('product-list product-tile');

  const products = await Promise.all(
    items.map(async (item) => {
      const [src, price, title, href, productId] = await Promise.all([
        item.$eval('picture.image img', (img) => img.getAttribute('src')).catch(() => undefined),
        item.$eval('span.price__value', (el) => el.innerText.trim()).catch(() => undefined),
        item.$eval('h3.product-tile__name', (el) => el.innerText.trim()).catch(() => undefined),
        item.$eval('product-link a', (el) => el.getAttribute('href')).catch(() => undefined),
        item.evaluate((el) => el.getAttribute('product-id')).catch(() => undefined),
      ]);

      return { src: `${process.env.VCY_BASE}${src}`, price, title, productId, href: `${process.env.VCY_BASE}${href}` };
    })
  );

  return products.filter((product) => product.productId);
};

const goToNextPage = () => false;

export default { acceptCookies, fetchProducts, goToNextPage };
