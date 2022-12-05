<script setup>
import {} from "vue";
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

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
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
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
