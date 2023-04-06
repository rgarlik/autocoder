import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

/**
 * Helps with reading package assets
 */
export function readAsset(assetName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  try {
    const filePath = path.join(__dirname, "../assets", assetName);
    const fileContent = fs.readFileSync(filePath, "utf8");
    return fileContent;
  } catch (e) {
    throw new Error(`Error loading asset file ${assetName}: ${e}`);
  }
}
