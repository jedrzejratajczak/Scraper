const acceptCookies = () => null;

const fetchProducts = async (page) => {
  await page.waitForSelector('.flex-row-fluid.ml-lg-8 .card.card-custom.gutter-b');
  const items = await page.$$('.flex-row-fluid.ml-lg-8 .card.card-custom.gutter-b');

  const products = await Promise.all(
    items.map(async (item) => {
      const [src, title, href, productId] = await Promise.all([
        item.$eval('div.card-body img', (img) => img.getAttribute('data-src')).catch(() => undefined),
        item.$eval('div.card-title h2 a', (el) => el.innerText.trim()).catch(() => undefined),
        item.$eval('div.card-title h2 a', (el) => el.getAttribute('href')).catch(() => undefined),
        item.evaluate((el) => el.getAttribute('id')).catch(() => undefined),
      ]);

      return { src, title, productId, href: `${process.env.P_BASE}${href}` };
    })
  );

  return products.filter((product) => product.productId);
};

const goToNextPage = () => false;

export default { acceptCookies, fetchProducts, goToNextPage };
