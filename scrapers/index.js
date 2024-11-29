import scrapE from "./scrapE.js";
import scrapG from "./scrapG.js";
import scrapVC from "./scrapVC.js";
import scrapA from "./scrapA.js";

const scrap = async (page, scraper) => {
  const { acceptCookies, fetchProducts, goToNextPage } = scraper;

  await acceptCookies(page);

  const products = [];
  let nextPageAvailable;

  do {
    const pageProducts = await fetchProducts(page);
    products.push(...pageProducts);

    nextPageAvailable = await goToNextPage(page);
  } while (nextPageAvailable);

  return products;
};

export { scrapE, scrapG, scrapVC, scrapA };
export default scrap;
