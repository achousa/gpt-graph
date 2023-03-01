<template>
  <Dialog v-model:visible="display" style="width: 35em">
    <template #header>
      <strong>Configuration</strong>
    </template>
    <p>Enter your Open AI API key</p>
    <InputText v-model="apiKey" style="width: 32em; text-align: center;" />
    <p>If you don't have an API key, you'll need to sign up on <a href="https://openai.com/api/" target="_blank"> Open AI platform,</a> and then go to the User Settings to generate your key. Note this is a paid service, although there are some free credits upon registration.</p>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="this.hide()" />
      <Button label="Ok" icon="pi pi-check" autofocus @click="this.changeApiKey()" />
    </template>
  </Dialog>
  <Toast position="bottom-right" />
</template>

<script>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import OpenAIDavinciService from './OpenAIDavinciService.js';
import Toast from 'primevue/toast';

export default {
  name: "ConfigDialog",
  emits: ['apikeyChanged'],
  data: () => ({
    display: false,
    apiKey: "",
    openAIDavinciService: OpenAIDavinciService
  }),
  components: {
    Button,
    Dialog,
    InputText,
    Toast
  },
  mounted() {
    // Load API Key from local storage
    if(window.localStorage.getItem('apiKey')){
      this.apiKey = window.localStorage.getItem('apiKey');
    }
  },
  methods: {
    show() {
      this.display = true
    },
    hide() {
      this.display = false
    },
    changeApiKey(){
      window.localStorage.setItem('apiKey',this.apiKey);
      this.$emit('apikeyChanged',this.apiKey);
      this.hide();
    }
  }
};
</script>

<style lang="scss"></style>