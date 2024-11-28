import { Service } from "node-windows";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svc = new Service({
  name: "scraper",
  script: path.join(__dirname, "index.js"),
});

svc.on("uninstall", () => {
  svc.install();
});

svc.on("install", () => {
  svc.start();
});

svc.exists((exists) => {
  if (exists) {
    svc.uninstall();
  } else {
    svc.install();
  }
});
