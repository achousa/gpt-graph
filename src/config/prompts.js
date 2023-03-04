export default {
    API_URL: 'https://api.openai.com/v1/completions',
    model: 'text-davinci-003',
    temperature: 0.6,
    task_prompt: 'I want you to behave like an entity extractor. Your job is to interpret text and convert it to a graph of entities and relationships. Entities are going to be nodes of the graph, and relationships are going to be edges between nodes. {{typesPrompt}}. I want you to give me the response formatted as a minimized json that contains a list called nodes and a list called relations. Each node must have this attributes: id (numeric identifier starting with {{initialId}}), label (description), type (type of entity), attributes (list of key/value pairs, containing any attribute that according to the text can be attributed to the entities). The relationships must have the following fields: source (id of the source entity), target (id of the target entity), label (description of the relationship). It is very important that you answer only with a well formed json, do not include text in the response that is not inside the json. The text that you must process is the following: ',
    listTypesPrompt: 'The entity types you have to look for, are: ',
    noTypesPrompt: 'Feel free to include any entity type you see fit to the text',
    maxModelTokens: 3900
}
