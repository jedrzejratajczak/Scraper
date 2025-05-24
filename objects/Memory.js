import sqlite3 from "sqlite3";

class Memory {
  #db;

  constructor() {
    this.#initDb();
  }

  async #initDb() {
    this.#db = await sqlite3.open({
      filename: "./products.db",
      driver: sqlite3.Database,
    });

    await this.#db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        key TEXT,
        productId TEXT,
        src TEXT,
        price TEXT,
        title TEXT,
        href TEXT,
        timestamp INTEGER,
        PRIMARY KEY (key, productId)
      )
    `);
  }

  async updateProducts(key, products) {
    const timestamp = Date.now();
    const delay = timestamp - 48 * 60 * 60 * 1000;
    const newProducts = [];

    for (const product of products) {
      const existing = await this.#db.get(
        "SELECT timestamp FROM products WHERE key = ? AND productId = ?",
        [key, product.productId]
      );

      await this.#db.run(
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
