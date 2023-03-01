<template>
  <div class="attributes-overlay p-component" v-if="display" >
    <div style="margin-bottom: 5px;"><strong>{{ node.label }}</strong></div>
    <table style="width: 100%;">
      <tr v-for="[key, value] in node.attributes" :key="key">
        <td class="attribute-key">{{key}}:</td>
        <td class="attribute-value">{{value}}</td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  name: "NodeAttributes",
  data: () => ({
    display: false
  }),
  props: ['node'],
  components: {
  },
  mounted() {
  },
  methods: {
    show() {
      this.display = true
    },
    hide() {
      this.display = false
    }
  }
};

</script>

<style lang="scss">

.attributes-overlay {
  position: absolute;
  bottom: 1em;
  right: 1em;
  padding: 0.5em;
  background-color: rgba($color: #000000, $alpha: 0.3);
}

.attribute-key {
  background-color: rgba($color: #000000, $alpha: 0.5);
  font-style: italic;
  font-weight: bold;
  width: 50%;
  padding: 5px;
  padding-right: 3em;
}
.attribute-value {
  background-color: rgba($color: #000000, $alpha: 0.2);
  width: 50%;
  text-align: center;
  padding: 7px;
}


</style>