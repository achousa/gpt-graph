# gpt-graph

![gpt-graph](https://github.com/achousa/gpt-graph/blob/main/extras/gpt-graph.png?raw=true)

gpt-graph is a text-to-graph application that uses GPT-3 to generate a graph of entities and their relationships. GPT-3 is a language model developed by OpenAI that can perform a variety of natural language tasks, including text generation, translation, and summarization. With gpt-graph, users can provide a text document to the application, and it will extract the relevant entities and their relationships to create a graph. It can also search for information in the text that cannot be represented as relations, and label the entities with those attributes.

gpt-graph uses [cytoscape.js](https://js.cytoscape.org/) graph visualization library to display the graph in an interactive format. Users can explore the graph and its relationships by zooming in and out and moving around.

## How it works?

gpt-graph works by providing a custom prompt that instructs the model on how to handle the incoming text and format the output. It can be given a list of entities to identify or left to the model's discretion. Once the graph is on the screen, subsequent pieces of text can be added, and the application will attempt to merge the new information with the existing graph.

These subsequent calls to add new text are stateless, which means that existing graph information is not used as a starting point. This greatly reduces token consumption and enables the creation of larger graphs. However, the downside of this approach is that entities may be duplicated if they are written slightly differently across the text.

## You need an OpenAI API Key !

To make requests to the OpenAI API, you'll need to register on the [the OpenAI platform](https://platform.openai.com) and go to the 'User Settings' to generate an API Key. You can then copy and paste the API key into the gpr-graph configuration dialog. Please note that the OpenAI API is a paid service, although if you simply want to try it out, there are free credits available upon registration that will allow for plenty of experimentation.

## Technology

The project makes use of [Electron](https://www.electronjs.org/), [Vue.js](https://vuejs.org/) and [cytoscape](https://js.cytoscape.org/) graph library. [Axios](https://github.com/axios/axios) is also used to make http requests to the [OpenAI Api](https://openai.com/product).

## Binaries

If you dont want to build the project from source, here are some packaged binaries you can use:

[https://github.com/achousa/gpt-graph/releases](https://github.com/achousa/gpt-graph/releases)

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

### Attributions

Vectors and icons by <a href="https://dribbble.com/nixxdsgn?ref=svgrepo.com" target="_blank">Nixx Design</a> in CC Attribution License via <a href="https://www.svgrepo.com/" target="_blank">SVG Repo</a>
