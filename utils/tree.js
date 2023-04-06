import chalk from "chalk";
import shell from "shelljs";
import path from "path";

/**
 * Executes the correct tree command based on the current OS
 * @returns The source code tree excluding the ignored folders
 */
export function getSourceTree(ignoredFolders) {
  console.log(chalk.blue(`Ignoring folders: ${ignoredFolders.join(", ")}`));

  // TODO: implement ignored folders and files
  // Windows' tree does not support ignoring
  const treeCommand = "tree";

  const tree = shell.exec(treeCommand, { silent: true }).stdout;
  const codeblock = "```";

  return `${codeblock}\n${tree}\n${codeblock}`;
}
