import axios from 'axios';
import config from '../config/prompts.js'

const API_URL = 'https://api.openai.com/v1/completions';

export default class OpenAIDavinciService {

  apiKey;

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  calcMaxTokens(text) {
    // Roughly calculate number ok tokens in the prompt
    return parseInt(config.maxModelTokens - text.trim().length / 4, 10)
  }

  async generateText(text, initialId, entityTypes) {
    let typesprompt;
    if(entityTypes && entityTypes.length > 0) {
      typesprompt = config.listTypesPrompt + entityTypes.join(',');
    } else {
      typesprompt = config.noTypesPrompt;
    }
    const prompt = config.task_prompt.replace(/{{initialId}}/g, initialId).replace(/{{typesPrompt}}/g, typesprompt);
    console.log('GPT PROMPT: '+ prompt);
    try {
      const response = await axios.post(API_URL, {
        model: config.model,
        prompt: prompt + '\n\n' + text,
        max_tokens: this.calcMaxTokens(prompt + '\n\n' + text),
        n: 1,
        temperature: config.temperature
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(error.code);
      throw error;
    }
  }

}