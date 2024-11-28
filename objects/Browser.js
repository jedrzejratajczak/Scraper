import puppeteer from "puppeteer";

class Browser {
  async setup() {
    this.browser = await puppeteer.launch({
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
  }

  async openPage(url) {
    if (!this.browser) {
      await this.setup();
    }

    const page = await this.browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );

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

    return page;
  }

  async closePage(page) {
    await page.close();
  }
}

export default Browser;
