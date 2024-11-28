import sqlite3 from "sqlite3";
import { open } from "sqlite";

class Memory {
  #db;

  constructor() {
    this.#initDb();
  }

  async #initDb() {
    this.#db = await open({
      filename: "./products.db",
      driver: sqlite3.Database,
    });

    await this.#db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        shop TEXT,
        productId TEXT,
        src TEXT,
        price TEXT,
        title TEXT,
        href TEXT,
        timestamp INTEGER,
        PRIMARY KEY (shop, productId)
      )
    `);
  }

  async updateProducts(shop, products) {
    const timestamp = Date.now();
    const twelveHoursAgo = timestamp - 12 * 60 * 60 * 1000;
    const newProducts = [];

    for (const product of products) {
      const existing = await this.#db.get(
        "SELECT timestamp FROM products WHERE shop = ? AND productId = ?",
        [shop, product.productId]
      );

      await this.#db.run(
        `
          INSERT INTO products (shop, productId, src, price, title, href, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(shop, productId) DO UPDATE SET
          src = ?, price = ?, title = ?, href = ?, timestamp = ?
        `,
        [
          shop,
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

      if (!existing || existing.timestamp < twelveHoursAgo) {
        newProducts.push(product);
      }
    }

    return newProducts;
  }
}

export default Memory;
