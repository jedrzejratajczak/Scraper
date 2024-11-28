import { addLog } from "../utils/index.js";
import scrapE from "./scrapE.js";
import scrapG from "./scrapG.js";
import scrapVC from "./scrapVC.js";
import scrapA from "./scrapA.js";

const scrap = async (page, scrapper) => {
  const startTime = performance.now();
  const { acceptCookies, fetchProducts, goToNextPage } = scrapper;

  try {
    await acceptCookies(page);

    const products = [];
    let nextPageAvailable;

    do {
      const pageProducts = await fetchProducts(page);
      products.push(...pageProducts);

      nextPageAvailable = await goToNextPage(page);
    } while (nextPageAvailable);

    return products;
  } finally {
    const endTime = performance.now();
    addLog(`Time ${url}\n` + (endTime - startTime) / 1000);
  }
};

export { scrapE, scrapG, scrapVC, scrapA };
export default scrap;
