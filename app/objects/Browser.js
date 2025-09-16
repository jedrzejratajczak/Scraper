import puppeteer from 'puppeteer';

class Browser {
  constructor() {
    this.browser = null;
  }

  async setup() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-extensions',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--no-zygote',
        '--disable-background-timers-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-sync',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-features=site-per-process',
      ],
    });

    this.browser.on('disconnected', () => {
      this.browser = null;
    });
  }

  async isBrowserAlive() {
    try {
      return this.browser && this.browser.isConnected();
    } catch {
      return false;
    }
  }

  async setupPage(page) {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    );

    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  async openPage(url) {
    if (!(await this.isBrowserAlive())) {
      await this.setup();
    }

    try {
      const page = await this.browser.newPage();
      await this.setupPage(page);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.setViewport({ width: 1600, height: 900 });
      return page;
    } catch (error) {
      this.browser = null;
      await this.setup();
      const page = await this.browser.newPage();
      await this.setupPage(page);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.setViewport({ width: 1600, height: 900 });
      return page;
    }
  }

  async closePage(page) {
    try {
      if (page && !page.isClosed()) {
        await page.close();
      }
    } catch {}
  }

  async closeBrowser() {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    } catch {}
  }
}

export default Browser;
