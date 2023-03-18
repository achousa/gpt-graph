<template>
  <Sidebar class="p-sidebar-sm" :show-close-icon="false" :modal="false" v-model:visible="visibleLeft"
    style="max-width: 15em;">

    <div style="width: 100%; text-align: left; margin-bottom: 1em;">
      <img src="./assets/logo.svg" style="width: 3em;" />
      <div style="margin-top: -1.7em; margin-left: 3.2em; font-size: 22px;"><strong>gpt-graph</strong></div>
    </div>

    <Menu :model="menuItems" style="border: 0; width: 100%; margin-top: 2em;">
    </Menu>

    <div style="width: 100%; text-align: center; margin-bottom: 1em; margin-top: 2em;">
      <div class="p-button-sm p-button-rounded" v-for="item in types" :key="item" style="margin-top: 5px;">
        <Button class="p-button-sm" @click="$refs.cy.selectType(item)" :label="item" style="width: 100%;"
          :style="{ background: colorService.getColor(item) }" :badge="$refs.cy.countType(item)" />
      </div>
    </div>

    <div id="card">
      <div style="float: left; width: 50%;" v-if="numEntities > 0">
        <i class="pi pi-users" style="margin-right: 15px; font-size: 1.5rem;"></i>
        <Badge :value="numEntities" size="medium" severity="success"></Badge>
      </div>
      <div style="float: left; width: 50%;" v-if="numEdges > 0">
        <i class="pi pi-link" style="margin-right: 15px; font-size: 1.5rem;"></i>
        <Badge :value="numEdges" size="medium" severity="success"></Badge>
      </div>
    </div>

  </Sidebar>

  <div id="menu-button">
    <Button icon="pi pi-arrow-right" @click="visibleLeft = true" />
  </div>
  <div id="toolbar">
    <Button icon="pi pi-share-alt" class="toolbar-button" @click="$refs.cy.layout()" />
    <Button icon="pi pi-arrows-alt" class="toolbar-button" @click="$refs.cy.fit()" />
  </div>
  <div id="spinner" v-if="isProcessing">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem; margin-left: -5em;"></i>
  </div>
  <div class="nopadding">
    <CyGraph ref="cy" @node-count-changed="(nodeCount) => { this.numEntities = nodeCount; }"
      @edge-count-changed="(edgeCount) => { this.numEdges = edgeCount; }" @incoming-types="(types) => this.types = types"
      @node-mouse-over="(data) => this.openAttributes(data)" />
  </div>

  <TextEntry ref="textEntry" :numEntities="numEntities"
    @incoming-graph="(graph) => { if (graph) { this.$refs.cy.add(graph) }; this.isProcessing = false; }"
    @init-processing="() => this.isProcessing = true" />

  <ConfigDialog ref="configDialog" />

  <NodeAttributes ref="nodeAttributes" :node="currentNode" />

  <Toast position="bottom-right" />
</template>

<script>

import 'primevue/resources/themes/bootstrap4-dark-purple/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import Badge from 'primevue/badge';
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import CyGraph from "./components/CyGraph";
import TextEntry from "./components/TextEntry";
import ConfigDialog from "./components/ConfigDialog";
import NodeAttributes from "./components/NodeAttributes";
import Menu from 'primevue/menu';
import ColorService from './services/ColorService.js';
import Toast from 'primevue/toast';
import fs from 'fs'

export default {
  name: "App",
  data() {
    return {
      visibleLeft: false,
      isProcessing: false,
      apiKeyPresent: false,
      numEntities: 0,
      currentNode: {},
      numEdges: 0,
      types: [],
      colorService: ColorService,
      menuItems: [
        {
          label: 'Enter new text',
          icon: 'pi pi-upload',
          command: () => {
            if (this.apiKeyPresent) {
              this.$refs.textEntry.show();
            } else {
              this.$toast.add({ severity: 'error', summary: 'Enter API Key', detail: 'Please go to the Configuration option, and provide a valid Open AI API Key', life: 10000 });
            }
          }
        },
        {
          label: 'Save to file',
          icon: 'pi pi-save',
          command: () => {
            const json = JSON.stringify(this.$refs.cy.json());
            window.localStorage.setItem('graph', json);
            this.saveFile(json);
          }
        },
        {
          label: 'Load from file',
          icon: 'pi pi-upload',
          command: () => {
            this.loadFile();
          }
        },
        {
          label: 'Clear graph',
          icon: 'pi pi-eraser',
          command: () => {
            this.$refs.cy.clear();
            this.types = [];
          }
        },
        {
          label: 'Configuration',
          icon: 'pi pi-wrench',
          command: () => {
            this.$refs.configDialog.show();
          }
        }
      ]
    }
  },
  mounted() {
    if (window.localStorage.getItem('graph')) {
      const graph = JSON.parse(window.localStorage.getItem('graph'));
      this.$refs.cy.json(graph);
      this.$refs.cy.fit();
    }
    if (!window.localStorage.getItem('apiKey')) {
      this.visibleLeft = true;
      this.$toast.add({ severity: 'info', summary: 'Enter Open AI API Key', detail: 'Before you can process any text, you need to go to the Configuration option, and provide a valid Open AI API Key', life: 10000 });
    }
  },
  updated() {
    if (window.localStorage.getItem('apiKey')) {
      this.apiKeyPresent = true;
    } else {
      this.apiKeyPresent = false;
    }
  },
  components: {
    CyGraph,
    TextEntry,
    ConfigDialog,
    NodeAttributes,
    Button,
    Menu,
    Sidebar,
    Badge,
    Toast
  },
  methods: {
    saveFile(data) {
      const blob = new Blob([data], { type: 'application/json' })
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = "graph.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    loadFile() {
      let input = document.createElement('input');
      input.type = 'file';
      input.onchange = _ => {
        console.log(_);
        let files = Array.from(input.files);
        const data = fs.readFileSync(files[0].path);
        const graph = JSON.parse(data);
        this.$refs.cy.json(graph);
      };
      input.click();
    },
    openAttributes(data) {
      if (!data) {
        this.$refs.nodeAttributes.hide();
      } else {
        //if (data.attributes) {
          // the component only likes to display maps
          const attributeMap = new Map();
          for (const element in data.attributes) {
            attributeMap.set(element, data.attributes[element]);
          }
          this.currentNode = { id: data.id, label: data.label, attributes: attributeMap };
          this.$refs.nodeAttributes.show();
        //}
      }
    }
  }
};

</script>

<style>
.nopadding {
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}

#menu-button {
  position: absolute;
  z-index: 1;
  left: 1em;
  top: 1em;
}

#toolbar {
  position: absolute;
  z-index: 1;
  right: 1em;
  top: 1em;
}

#spinner {
  position: absolute;
  z-index: 1;
  right: 1em;
  top: 1em;
}

#card {
  text-align: center;
  vertical-align: middle;
  width: 80%;
  font-size: 2em;
  position: absolute;
  bottom: 30px;
  background-color: rgba(0, 0, 0, 0.1);
}

.toolbar-button {
  margin-left: 1em;
}

#app {
  padding: 0px;
  margin: 0px;
}

body {
  padding: 0px;
  margin: 0px;
}
</style>