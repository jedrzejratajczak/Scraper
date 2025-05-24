import sqlite3 from "sqlite3";
import { promisify } from "util";

class Memory {
  #db;

  constructor() {
    this.#initDb();
  }

  #initDb() {
    this.#db = new sqlite3.Database("./products.db");

    this.#db.run(
      `CREATE TABLE IF NOT EXISTS products (
        key TEXT,
        productId TEXT,
        src TEXT,
        price TEXT,
        title TEXT,
        href TEXT,
        timestamp INTEGER,
        PRIMARY KEY (key, productId)
      )`
    );
  }

  async updateProducts(key, products) {
    const timestamp = Date.now();
    const delay = timestamp - 48 * 60 * 60 * 1000;
    const newProducts = [];

    const dbGet = promisify(this.#db.get.bind(this.#db));
    const dbRun = promisify(this.#db.run.bind(this.#db));

    for (const product of products) {
      const existing = await dbGet(
        "SELECT timestamp FROM products WHERE key = ? AND productId = ?",
        [key, product.productId]
      );

      await dbRun(
        `
          INSERT INTO products (key, productId, src, price, title, href, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(key, productId) DO UPDATE SET
          src = ?, price = ?, title = ?, href = ?, timestamp = ?
        `,
        [
          key,
          product.productId,
          product.src,
          product.price,
          product.title,
          product.href,
          timestamp,
          product.src,
          product.price,
          product.title,
          product.href,
          timestamp,
        ]
      );

      if (!existing || existing.timestamp < delay) {
        newProducts.push(product);
      }
    }

    return newProducts;
  }
}

export default Memory;
