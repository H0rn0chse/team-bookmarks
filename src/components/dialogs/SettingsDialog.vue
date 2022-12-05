<script setup>
import { reactive, readonly } from "vue";
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

const foo = reactive({
  bar: false
});


</script>

<template>
  <v-dialog
    v-model="dialogStore.settings.show"
    min-width="400"
    max-width="1200"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          block
          @click="dialogStore.hideSettings"
        >
          Close Dialog
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
</style>
