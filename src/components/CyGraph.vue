<template>
  <div id="cy"></div>
</template>

<script>

import fcose from "cytoscape-fcose";
import cytoscape from "cytoscape";

/*
function similarity(str1, str2) {

  if (!str1 || !str2) {
    return 0;
  }
  // Convertir ambas cadenas a minúsculas y eliminar acentos
  str1 = str1.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  str2 = str2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

  if (str1 === str2) {
    return 100;
  }

  // Algoritmo de Comparación de Cadena Similar (Levenshtein Distance)
  const m = str1.length;
  const n = str2.length;
  const d = [];
  for (let i = 0; i <= m; i++) {
    d[i] = [i];
  }
  for (let j = 1; j <= n; j++) {
    d[0][j] = j;
  }
  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      if (str1[i - 1] === str2[j - 1]) {
        d[i][j] = d[i - 1][j - 1];
      } else {
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + 1
        );
      }
    }
  }

  // Calcular porcentaje de similitud
  const maxLen = Math.max(m, n);
  const similarity = ((maxLen - d[m][n]) / maxLen) * 100;
  return similarity;
}
*/

function similarity(str1, str2) {

  if (!str1 || !str2) {
    return 0;
  }
  // Normalize both strings
  str1 = str1.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  str2 = str2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

  if (str1 === str2) {
    return 100;
  } else {
    return 0;
  }

}

export default {
  name: "CyGraph",
  emits: ['nodeCountChanged', 'edgeCountChanged', 'incomingTypes', 'nodeMouseOver'],
  data: () => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    cy: null
  }),
  mounted() {
    window.addEventListener('resize', this.getDimensions);
    this.drawGraph();
    this.cy.boxSelectionEnabled(true);
    const that = this;
    this.cy.on('mouseover', 'node', function (evt) {
      var node = evt.target;
      //node.select();
      that.$emit('nodeMouseOver', node.data());
    });
    this.cy.on('mouseout', 'node', function () {
      that.$emit('nodeMouseOver', null);
    });
    this.getDimensions();
    setTimeout(function () {
      that.cy.fit(that.cy.elements, 50)
    }, 500)
  },
  unmounted() {
    window.removeEventListener('resize', this.getDimensions);
  },
  methods: {
    drawGraph() {
      cytoscape.use(fcose);
      this.cy = cytoscape({
        container: document.getElementById("cy"),
        boxSelectionEnabled: false,
        autounselectify: false,
        style: cytoscape
          .stylesheet()
          .selector("node")
          .css({
            'color': 'white',
            'background-repeat': 'no-repeat',
            'background-clip': 'none',
            'border-width': 2,
            'background-opacity': '1',
            'background-color': 'data(color)',
            'border-color': '#4dcab1',
            'border-opacity': '0.5',
            'background-height': 32,
            'background-width': 32,
            'height': 42,
            'width': 42,
            'min-zoomed-font-size': '9',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'label': 'data(label)'
          })
          .selector(":selected")
          .css({
            'border-width': 5,
            'border-opacity': '1'
          })
          .selector("edge")
          .css({
            'width': 3,
            'color': 'white',
            'line-color': '#4dcab1',
            'opacity': '0.5',
            'font-size': '12',
            'label': 'data(label)',
            'min-zoomed-font-size': '9',
            'target-arrow-color': '#4dcab1',
            'target-arrow-shape': 'triangle'
          }),
        layout: {
          name: "fcose",
          spacingFactor: 1.5,
          rankDir: "LR",
          quality: "default",
          randomize: true,
          animate: true,
          animationDuration: 1000,
          animationEasing: undefined,
          fit: true,
          padding: 30
        },
      });
      this.cy.layout({
        name: "fcose",
        spacingFactor: 1.5,
        rankDir: "LR",
        quality: "default",
        randomize: true,
        animate: true,
        animationDuration: 1000,
        animationEasing: undefined,
        fit: true,
        padding: 30
      });

    },
    getDimensions() {
      this.width = document.documentElement.clientWidth;
      this.height = document.documentElement.clientHeight;
      document.getElementById("cy").style.height = this.height + "px";
    },
    fit(eles) {
      if (eles) {
        this.cy.animate({ fit: { eles: eles, padding: 20 } }, { duration: 500 });
      } else {
        this.cy.animate({ fit: { eles: this.cy.elements, padding: 20 } }, { duration: 500 });
      }
    },
    selectType(type) {
      this.cy.elements().unselect();
      const nodes = this.cy.elements('node[type="' + type + '"]');
      nodes.select();
      this.fit(nodes);
    },
    countType(type) {
      return this.cy.elements('node[type="' + type + '"]').length;
    },
    getTypes() {
      const types = new Set();
      this.cy.nodes().forEach(function (ele) {
        types.add(ele.data()['type']);
      });
      return (types);
    },
    clear() {
      this.cy.remove('node');
      this.$emit('nodeCountChanged', this.cy.nodes().length);
      this.$emit('edgeCountChanged', this.cy.edges().length);
    },
    add(graph) {
      // if graph is empty, we can simply add nodes and edges
      // if not, we must merge the incoming and existing graphs
      if (this.cy.nodes().length === 0) {
        // no nodes in the graph, we can add the colleciones directly
        this.cy.add(graph.nodes);
        this.cy.add(graph.relations);
      } else {
        // Merge incoming graph with existing graph
        let newNodes = new Array();
        let newEdges = new Array();
        let equivalences = new Map();
        for (let node in graph.nodes) {
          // find out is this node is already in the graph
          const equivalentNodeId = this.findEquivalent(graph.nodes[node].data.label);
          if (!equivalentNodeId) {
            // there is none, add as new node
            newNodes.push(graph.nodes[node]);
          } else {
            // we dont add a new node to the graph, instead we take
            // note of the equivalent id
            equivalences.set(graph.nodes[node].data.id, equivalentNodeId);
          }
        }
        // relations need to be adjusted if they point to an equivalent node
        for (let index in graph.relations) {
          // find out if we have an equivalence of source id
          if (equivalences.get(graph.relations[index].data.source)) {
            // if so, substitute source id by its equivalent in the graph
            graph.relations[index].data.source = equivalences.get(graph.relations[index].data.source);
          }
          // same for target id
          if (equivalences.get(graph.relations[index].data.target)) {
            graph.relations[index].data.target = equivalences.get(graph.relations[index].data.target);
          }
          newEdges.push(graph.relations[index]);
        }
        this.cy.add(newNodes);
        this.cy.add(newEdges);

      }
      this.cy.elements().unselect();
      this.layout();
      this.$emit('nodeCountChanged', this.cy.nodes().length);
      this.$emit('edgeCountChanged', this.cy.edges().length);
      this.$emit('incomingTypes', this.getTypes());

    },
    json(param) {
      const result = this.cy.json(param);
      if (param) {
        this.$emit('incomingTypes', this.getTypes());
        this.$emit('nodeCountChanged', this.cy.nodes().length);
        this.$emit('edgeCountChanged', this.cy.edges().length);
      }
      return result;
    },
    layout() {
      const lay = this.cy.layout({
        name: "fcose",
        spacingFactor: 1.5,
        rankDir: "LR",
        quality: "default",
        randomize: true,
        animate: true,
        animationDuration: 1000,
        animationEasing: undefined,
        fit: true,
        padding: 40
      });
      lay.run();
    },
    findEquivalent(label) {
      // find if there is a node with a similar label
      const candidates = new Array();
      this.cy.nodes().forEach(function (node) {
        const candidateLabel = node.data()['label'];
        if (similarity(label, candidateLabel) > 80) {
          candidates.push(node.data()['id']);
        }
      });
      if (candidates.length > 0) {
        return candidates[0];
      } else {
        return null;
      }
    }
  }
};

</script>
<style lang="scss">
#cy {
  width: 100%;
  margin: 0px;
  padding: 0px;
  background-color: #20262e;
}
</style>