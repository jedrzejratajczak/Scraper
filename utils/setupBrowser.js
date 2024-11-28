import puppeteer from "puppeteer";

const setupBrowser = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-extensions",
      "--disable-gpu",
      "--disable-software-rasterizer",
      "--no-zygote",
      "--disable-background-timers-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
      "--disable-breakpad",
      "--disable-sync",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-features=site-per-process",
    ],
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (["image", "stylesheet", "font"].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(url);
  await page.setViewport({ width: 1600, height: 900 });

  return { page, browser };
};

export default setupBrowser;
