import chalk from "chalk";
import path from "path";
import fs from "fs";

/**
 * Executes the correct tree command based on the current OS
 * @returns The source code tree excluding the ignored folders
 */
export function getSourceTree(directory, ignoredFolders) {
  console.log(chalk.blue(`Ignoring folders: ${ignoredFolders.join(", ")}`));

  const tree = displayTree(directory, ignoredFolders);
  const codeblock = "```";

  return `${codeblock}\n${tree}\n${codeblock}`;
}

function displayTree(directory, ignoredFolders = [], level = 0, prefix = "") {
  let tree = "";
  const entries = fs.readdirSync(directory);

  for (const entry of entries) {
    if (ignoredFolders.includes(entry)) {
      continue;
    }

    const entryPath = path.join(directory, entry);
    const stats = fs.statSync(entryPath);

    if (stats.isDirectory()) {
      tree += `${prefix}${entry}/\n`;
      tree += displayTree(entryPath, ignoredFolders, level + 1, `${prefix}  `);
    } else {
      tree += `${prefix}${entry}\n`;
    }
  }

  return tree;
}
