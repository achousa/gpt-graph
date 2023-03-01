import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/completions';
const task_prompt = 'I want you to behave like an entity extractor. Your job is to interpret text and convert it to a graph of entities and relationships.' +
' Entities are going to be nodes of the graph, and relationships are going to be edges between nodes. {{typesPrompt}}. I want you to give me the response formatted as a minimized json that contains' +
' a list called nodes and a list called relations. Each node must have this attributes: id (numeric identifier starting with {{initialId}}), label (description), type (type of entity),' +
' attributes (list of key/value pairs, containing any attribute that according to the text can be attributed to the entities). The relationships must have the following fields: source' +
' (id of the source entity), target (id of the target entity), label (description of the relationship). It is very important that you answer only with a well formed json,' +
' do not include text in the response that is not inside the json. The text that you must process is the following;'
const listTypesPrompt = 'The entity types you have to look for, are: '
const noTypesPrompt = 'Feel free to include any entity type you see fit to the text'
const maxModelTokens = 3900;

export default class OpenAIDavinciService {

  apiKey;

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  calcMaxTokens(text) {
    // Roughly calculate number ok tokens in the prompt
    return parseInt(maxModelTokens - text.trim().length / 4, 10)
  }

  async generateText(text, initialId, entityTypes) {
    let typesprompt;
    if(entityTypes && entityTypes.length > 0) {
      typesprompt = listTypesPrompt + entityTypes.join(',');
    } else {
      typesprompt = noTypesPrompt;
    }
    const prompt = task_prompt.replace(/{{initialId}}/g, initialId).replace(/{{typesPrompt}}/g, typesprompt);
    console.log('GPT PROMPT: '+ prompt);
    try {
      const response = await axios.post(API_URL, {
        model: "text-davinci-003",
        prompt: prompt + '\n\n' + text,
        max_tokens: this.calcMaxTokens(prompt + '\n\n' + text),
        n: 1,
        temperature: 0.6
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