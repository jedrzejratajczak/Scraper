module.exports = {
  apps: [
    {
      name: "scraper",
      script: "index.js",
      interpreter: "bun",
      instances: 1,
      // cwd: "",
    },
  ],
};
