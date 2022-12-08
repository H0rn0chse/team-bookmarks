<script setup>
import { ref } from "vue";

const showDialog = ref(false);
const errorMessage = ref("");

function show (message = "") {
  errorMessage.value = message;
  showDialog.value = true;
}

defineExpose({
  show
});
</script>

<template>
  <v-dialog
    v-model="showDialog"
    min-width="350"
    max-width="400"
    transition="dialog-top-transition"
  >
    <v-card class="dialog">
      <v-card-title class="title">
        Some Error occurred
      </v-card-title>
      <v-card-text class="text">
        <p :style="{ textAlign: 'center' }">
          {{ errorMessage }}
        </p>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="showDialog = false"
        >
          Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
.dialog {
  background-color: var(--error-text-bg);
  color: var(--error-text-color);
}
.title {
  background-color: var(--error-title-bg);
  color: var(--error-title-color);
}
</style>

