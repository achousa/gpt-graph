<template>
  <Dialog v-model:visible="display">
    <template #header>
      <strong>Extract entities and relations form text</strong>
    </template>
    <p>Enter the text to be interpreted</p>
    <Textarea v-model="input" rows="15" cols="82" />
    <p></p>
    <!--
    <div>
      Enter maximum length of the response
      <InputText v-model.number="maxTokens" style="float: right; margin-top: -0.5em" />
      <Slider v-model="maxTokens" :step="1" :min="1000" :max="3000" style="margin-top: 1.5em;" />
    </div>
    -->
    <p>Enter types of entities to be interpreted</p>
    <Chips v-model="entityTypes" style="width: 100%" />
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="this.hide()" />
      <Button label="Proceed" icon="pi pi-check" autofocus @click="this.processText(this.input)" :disabled="!this.input" />
    </template>
  </Dialog>
  <Toast position="bottom-right" />
</template>

<script>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
//import InputText from 'primevue/inputtext';
//import Slider from 'primevue/slider';
import Chips from 'primevue/chips';
import OpenAIDavinciService from '../services/OpenAIDavinciService.js';
import ColorService from '../services/ColorService.js';
import Toast from 'primevue/toast';

export default {
  name: "TextEntry",
  emits: ['incomingGraph', 'initProcessing'],
  props: ['numEntities'],
  data: () => ({
    display: false,
    input: "",
    maxTokens: 1000,
    usage: 0,
    entityTypes: ['Person', 'Place', 'Organization', 'Company', 'Event'],
    openAIDavinciService: OpenAIDavinciService,
    colorService: ColorService
  }),
  components: {
    Button,
    Dialog,
    Textarea,
    //InputText,
    //Slider,
    Chips,
    Toast
  },
  mounted() {
  },
  updated(){
  },
  methods: {
    show() {
      this.display = true;
      this.openAIDavinciService = new OpenAIDavinciService(window.localStorage.getItem('apiKey'));
    },
    hide() {
      this.display = false
    },
    json2graph(jsonString) {

      let data = JSON.parse(jsonString);
      let nodes = data.nodes.map(node => {
        return {
          group: 'nodes',
          data: {
            id: node.id,
            label: node.label,
            type: node.type,
            color: this.getColor(node.type),
            attributes: node.attributes
          }
        }
      });

      let relations = data.relations.map(relation => {
        return {
          data: {
            group: 'edges',
            source: relation.source,
            target: relation.target,
            label: relation.label
          }
        }
      });

      return {
        nodes: nodes,
        relations: relations
      }
    },
    getColor(data) {
      return this.colorService.getColor(data);
    },
    async processText(text) {
      this.hide();
      this.$emit('initProcessing');
      this.$toast.add({ severity: 'info', summary: 'Info Message', detail: 'Query submitted', life: 3000 });
      try {
        const data = await this.openAIDavinciService.generateText(text, this.numEntities + 1, this.entityTypes);
        var completion = data.choices[0].text;
        this.usage = this.usage + data.usage.total_tokens;
        // remove trailing text if any
        if (!completion.startsWith("{")) {
          completion = completion.substring(completion.indexOf('{'));
        }
        console.log('COMPLETION : ' + completion);
        const graph = this.json2graph(completion);
        this.$emit('incomingGraph', graph);
        this.$toast.add({ severity: 'success', summary: 'Success', detail: graph.nodes.length + ' Entities where added to the graph', life: 3000 });
        this.input = "";

      } catch (error) {
        if(error.code == 'ERR_BAD_REQUEST'){
          this.$toast.add({ severity: 'error', summary: 'There was a problem', detail: 'The request has failed, probably becouse the text is too long. Try processing it in batches.: ' + error, life: 8000 });          
        } else if(error.contains('Unexpected end of JSON')) {
            this.$toast.add({ severity: 'error', summary: 'There was a problem', detail: 'The response message was not complete, please try again.' + error, life: 8000 });
        } else {
          this.$toast.add({ severity: 'error', summary: 'There was a problem', detail: 'There was a poblem making the request: ' + error, life: 8000 });
        }
        this.$emit('incomingGraph', null);
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss"></style>