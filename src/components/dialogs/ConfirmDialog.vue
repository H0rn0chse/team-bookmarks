<script setup>
import { ref, watch } from "vue";

const showDialog = ref(false);
const dialogMessage = ref("");
const confirm = ref(null);

let resolveShow = () => {};
function show (message = "") {
  // reset confirm
  confirm.value = null;

  dialogMessage.value = message;
  showDialog.value = true;
  return new Promise((resolve) => {
    resolveShow = resolve;
  });
}

watch(showDialog, (newValue) => {
  if (!newValue) {
    resolveShow(!!confirm.value);
  }
});

function close (result) {
  confirm.value = result;
  showDialog.value = false;
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
    <v-card>
      <v-card-text>
        <p :style="{ textAlign: 'center' }">
          {{ dialogMessage }}
        </p>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="close(true)"
        >
          Confirm
        </v-btn>
        <v-btn
          color="error"
          @click="close(false)"
        >
          Decline
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
</style>
