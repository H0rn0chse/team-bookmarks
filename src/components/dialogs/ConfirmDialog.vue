<script setup>
import { reactive } from "vue";

const state = reactive({
  show: false,
  message: ""
});

function show (message) {
  state.show = true;
  state.message = message;
  return Promise.resolve(true);
}

defineExpose({
  show
});
</script>

<template>
  <v-dialog
    v-model="state.show"
    min-width="350"
    max-width="400"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-text>
        {{ state.message }}
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="confirm"
        >
          Confirm
        </v-btn>
        <v-btn
          color="error"
          @click="decline"
        >
          Decline
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
</style>
