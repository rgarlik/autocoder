import start from "./start.js";
import chalk from "chalk";

// Top-level exception catching and prettifying
try {
  await start();
} catch (e) {
  console.error(chalk.red("⚠ " + e.stack));
}
