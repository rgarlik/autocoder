import { Configuration, OpenAIApi } from "openai";
import { readAsset } from "../utils/assets.js";
import ChatHistory from "./chatHistory.js";

/**
 * Handles ChatGPT API connection and prompt sending
 */
export default class ChatGpt {
  /**
   * Builds the ChatGPT service and returns it. Needs to be called first.
   */
  static async build(apiKey, model) {
    console.log(this.history);

    // Establish connection
    const configuration = new Configuration({
      apiKey,
    });
    const api = new OpenAIApi(configuration);

    const chatGpt = new ChatGpt();
    chatGpt.api = api;
    chatGpt.model = model;

    // Create history object
    chatGpt.history = new ChatHistory();

    // Set initial system prompt
    // For some reason the prompt works better when sent as the first user message, not as the system prompt
    const initialPrompt = readAsset("system.md");
    chatGpt.history.add("You are a helpful assistant", "system");
    chatGpt.history.addUser(initialPrompt);
    chatGpt.history.addAssistant("{}");

    return chatGpt;
  }

  /**
   * Send a textual prompt to ChatGPT
   */
  async send(prompt) {
    this.history.addUser(prompt);
    try {
      const returnedData = await this.api.createChatCompletion({
        model: this.model,
        messages: this.history.fullHistory,
      });

      const returnedText = returnedData.data.choices[0].message.content;

      this.history.addAssistant(returnedText);

      return returnedText;
    } catch (e) {
      throw new Error("Failed to send prompt to ChatGPT: " + e);
    }
  }

  /**
   * Send a textual prompt and parse the result as a JSON object.
   */
  async sendAndParse(prompt) {
    const textPrompt = await this.send(prompt);
    console.log(textPrompt);
    return JSON.parse(textPrompt);
  }
}
