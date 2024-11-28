import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "../logs.txt");

const addLog = (content) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: ${content}\n------\n`;

  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, logEntry);
  } else {
    fs.writeFileSync(filePath, logEntry);
  }
};

export default addLog;
