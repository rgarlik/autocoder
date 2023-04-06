/**
 * Handles history with ChatGPT
 */
export default class ChatHistory {
  constructor() {
    this.historyArray = [];
  }

  /**
   * Add a user chat record
   */
  addUser(message) {
    this.historyArray.push({ role: "user", content: message });
  }

  /**
   * Add an assistant chat record
   */
  addAssistant(message) {
    this.historyArray.push({ role: "assistant", content: message });
  }

  /**
   * Add a message with a custom role
   */
  add(message, role) {
    this.historyArray.push({ role: role, content: message });
  }

  /**
   * Get the full history array
   */
  get fullHistory() {
    return this.historyArray;
  }
}
