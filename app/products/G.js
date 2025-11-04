import { fetcher } from '../utils';

async function getProducts(url) {
  return fetcher({
    urls: Array.from({ length: 26 }, (_, i) => i === 0 ? url : `${url}/start=${i * 96}`),
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
      list: 'div.products-box-listing-results div.product-box',
      src: (item) => item.find('div.product-image img').attr('src'),
      price: (item) => item.find('div.product-price').text().trim(),
      title: (item) => item.find('div.product-title').text().trim(),
      href: (item) => `${process.env.G_BASE}${item.find('div.product-title > a').attr('href')}`,
      productId: (item) => item.find('div.product-actions button.cartbutton').attr('data-product-id')
    }
  });
}

export { getProducts };
