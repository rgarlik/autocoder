import fs from "fs/promises";
import { exec } from "child_process";
import readline from "readline";
import chalk from "chalk";

/**
 * Parses a ChatGPT result object and executes it
 * @param {Object} result - The result object containing operation, filename and content
 * @returns The message to send back to ChatGPT
 */
export async function executeResult(result) {
  const { operation, filename, content } = result;

  switch (operation) {
    case "create":
      console.log(`✏ Creating file ${chalk.yellow(filename)}`);
      await fs.writeFile(filename, content);
      return "Done";
    case "update":
      console.log(`📝 Updating file ${chalk.yellow(filename)}`);
      await fs.writeFile(filename, content);
      return "Done";
    case "delete":
      console.log(`🚮 Deleting file ${chalk.yellow(filename)}`);
      await fs.unlink(filename);
      return "Done";
    case "read":
      await fs.readFile(filename, "utf-8", (err, fileContent) => {
        console.log(`👀 Reading file ${chalk.yellow(filename)}`);
        if (err) {
          throw err;
        } else {
          return `${fileContent}`;
        }
      });
    case "shell":
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        `🚀 Autocode wants to execute the following command: "${chalk.yellow(
          content
        )}"? (y/n) `,
        (answer) => {
          // TODO: rewrite to use parse()
          if (answer.toLowerCase() === "y") {
            exec(content, (err, stdout, stderr) => {
              if (err) {
                console.error(`Error executing command: ${err}`);
              } else {
                console.log(`Command executed successfully.`);
                console.log(`Output: ${stdout}`);
              }
            });
          } else {
            console.log("Command execution cancelled.");
          }
          rl.close();
        }
      );
      return "Done";
    default:
      console.log("Unknown operation.");
      return "Done";
  }
}
