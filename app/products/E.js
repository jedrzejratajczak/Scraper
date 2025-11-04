import { fetcher } from '../utils';

async function getProducts(url) {
  return fetcher({
    urls: Array.from({ length: 11 }, (_, i) => `${url}${i > 0 ? `,${i * 60 + 1}` : ''}${process.env.E_QUERY}`),
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
      list: 'div.search-content div.search-list-item',
      src: (item) => item.find('img.lazy').attr('lazy-img'),
      price: (item) => item.find('div.price.ta-price-tile').attr('content'),
      title: (item) => item.find('h2.product-title a.seoTitle').attr('title'),
      href: (item) => `${process.env.E_BASE}${item.find('a.img.seoImage').attr('href')}`,
      productId: (item) => item.attr('data-product-id')
    }
  });
};

export { getProducts };
