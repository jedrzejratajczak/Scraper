import { fetcher } from '../utils';

async function getProducts(url) {
  return fetcher({
    urls: [url],
    headers: {
      'sec-ch-ua': '"Google Chrome";v="121", "Not:A-Brand";v="99", "Chromium";v="121"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'DNT': '1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Sec-GPC': '1',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
    },
    selectors: {
      list: '.s-main-slot .s-widget-spacing-small',
      src: (item) => item.find('img.s-image').attr('src'),
      price: (item) => item.find('span.a-price span.a-offscreen').text(),
      title: (item) => item.find('h2.a-size-base-plus.a-color-base.a-text-normal span').text(),
      href: (item) => {
        const href = item.find('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').attr('href');
        return href ? `${process.env.A_BASE}${href.split('?')[0]}` : undefined;
      },
      productId: (item) => item.attr('data-asin')
    }
  });
};

export { getProducts };
