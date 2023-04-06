import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import ChatGpt from "./services/chatGpt.js";
import { getSourceTree } from "./utils/tree.js";
import readline from "readline";
import { executeResult } from "./utils/executeResult.js";

async function start() {
  // Configure dotenv
  await config();

  // Set up CLI
  program
    .option(
      "-i, --ignored-folders <folders>",
      "List of folders to ignore when providing source code folder structure context to ChatGPT (a handful of dependency directories like node_modules by default)"
    )
    .option(
      "-m, --model <name>",
      "Which OpenAI model should be used for prompt completion",
      "gpt-3.5-turbo"
    )
    .option(
      "-k, --key <api_key>",
      "Specify the OpenAI API key (when not set, fallback is the OPENAI_API_KEY env variable)"
    )
    .parse(process.argv);

  const options = program.opts();

  // Default to cwd if no argument provided
  let rootDir = process.cwd();

  if (program.args[0]) {
    rootDir = path.resolve(program.args[0]);
  }

  console.log(`💻 Autocoder CLI started in ${chalk.blue(rootDir)}`);

  const apiKey = options.key ? options.key : process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "") {
    throw new Error(
      "No OpenAI API key provided. Provide one through the OPENAI_API_KEY env variable or pass it directly through the --key flag"
    );
  }

  // Connect to ChatGPT
  const chatGpt = await ChatGpt.build(apiKey, options.model);

  // Send ChatGPT the source tree
  const ignoredFolders = options.ignoredFolders
    ? options.ignoredFolders.split(",")
    : ["node_modules", ".git"];
  const treeString = getSourceTree(rootDir, ignoredFolders);

  //   console.log(`🌳 Project tree:`);
  //   console.log(treeString);
  console.log(`🌳 Sending project tree to ChatGPT`);
  const treeRes = await chatGpt.sendAndParse(treeString);

  if (treeRes.projectType) {
    console.log(
      `💻 Project was analyzed as ${chalk.yellow(treeRes.projectType)}`
    );
  }

  // Core app loop
  await coreLoop(chatGpt);
}

async function coreLoop(chatGpt) {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  reader.question(
    `Enter your programming requirement (e.g. 'create a new header react component')\n${chalk.yellow(
      ">"
    )}`,
    async (enteredPrompt) => {
      let nextMessage = enteredPrompt;
      while (true) {
        const res = await chatGpt.sendAndParse(nextMessage);
        if (res == {}) {
          // empty response means try again
          break;
        }

        nextMessage = await executeResult(res);
      }

      // next message
      await coreLoop(chatGpt);
    }
  );
}

export default start;
