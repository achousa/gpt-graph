# gpt-graph

![gpt-graph](https://github.com/achousa/gpt-graph/blob/main/extras/gpt-graph.png?raw=true)

gpt-graph is a text-to-graph application that uses GPT-3 to generate a graph of entities and their relationships. GPT-3 is a language model developed by OpenAI that can perform a variety of natural language tasks, including text generation, translation, and summarization. With gpt-graph, users can provide a text document to the application, and it will extract the relevant entities and their relationships to create a graph. It can also search for entity attributes in the text, that cannot be represented as a relation, and label the entity with those.

gpt-graph uses [cytoscape.js](https://js.cytoscape.org/) graph visualization library to display the graph in an interactive format. Users can explore the graph and its relationships by zooming in and out and moving around.

## How it works?

gpt-graph works by providing a custom prompt which instructs the model on what to do with the incoming text and how to format the output. It can be provided with a list of entities to look for, or be left for the model to decide. Once you have the graph on screen, you can provide subsequent pieces of text and the application will try to merge the new information with the existing graph.

This subsequent calls to add new text are stateless, meaning that existing graph information is not passed to the model as a starting point, this greatly reduces token compsuption, and allows for larger graphs to be generated. The downside of this approach is that entities may get duplicated if they are written sligly different across the text.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
