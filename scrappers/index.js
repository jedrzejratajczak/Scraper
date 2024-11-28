import scrapE from "./scrapE.js";
import scrapG from "./scrapG.js";
import scrapVC from "./scrapVC.js";

const scrap = async (url, scrapper) => {
  const startTime = performance.now();
  const { page, browser } = await setupBrowser(url);
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
    await browser.close();
    const endTime = performance.now();
    addLog(`Time ${url}\n` + (endTime - startTime) / 1000);
  }
};

export { scrapE, scrapG, scrapVC };
export default scrap;
