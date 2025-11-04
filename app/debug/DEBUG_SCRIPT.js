import config from '../config';

const key = 'vc';

const { url, getProducts } = config[key];
const products = await getProducts(url);

console.log('Products length: ', products.length);
console.log('Random product: ', products[Math.floor(Math.random() * products.length)]);
