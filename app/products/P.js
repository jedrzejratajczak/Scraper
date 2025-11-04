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
      list: '.flex-row-fluid.ml-lg-8 .card.card-custom.gutter-b',
      src: (item) => item.find('div.card-body img').attr('data-src'),
      price: () => undefined,
      title: (item) => item.find('div.card-title h2 a').text().trim(),
      href: (item) => {
        const href = item.find('div.card-title h2 a').attr('href');
        return href ? `${process.env.P_BASE}${href}` : undefined;
      },
      productId: (item) => item.attr('id')
    }
  });
};

export { getProducts };
