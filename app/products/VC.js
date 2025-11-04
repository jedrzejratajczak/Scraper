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
      list: 'product-list product-tile',
      src: (item) => {
        const src = item.find('picture.image img').attr('src');
        return src ? `${process.env.VC_BASE}${src}` : undefined;
      },
      price: (item) => item.find('span.price__value').text().trim(),
      title: (item) => item.find('h3.product-tile__name').text().trim(),
      href: (item) => {
        const href = item.find('product-link a').attr('href');
        return href ? `${process.env.VC_BASE}${href}` : undefined;
      },
      productId: (item) => item.attr('product-id')
    }
  });
};

export { getProducts };
