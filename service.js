import { Service } from "node-windows";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svc = new Service({
  name: "Scraper Service",
  description: "Scraper Service",
  script: path.join(__dirname, "index.js"),
  nodeOptions: [],
  wait: 2,
  grow: 0.5,
  maxRetries: 3,
  maxRestarts: 3,
  workingDirectory: __dirname,
  failureActions: [
    { action: "restart", delay: 5000 },
    { action: "restart", delay: 10000 },
    { action: "restart", delay: 15000 },
  ],
});

svc.on("install", () => {
  svc.start();
  console.log("Service installed and started");
});

svc.on("alreadyinstalled", () => {
  console.log("Service already installed. Starting...");
  svc.start();
});

svc.on("error", (error) => {
  console.error("Service error:", error);
});

svc.on("start", () => {
  console.log("Service started");
});

svc.install();
