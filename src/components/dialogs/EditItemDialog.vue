<script setup>
import { ref, inject } from "vue";
import ItemDetails from "@/components/ItemDetails.vue";
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();
const confirm = inject("confirm");

async function deleteBookmark () {
  const userConfirmed = await confirm("Are you sure? This Action removes the Bookmark permanently!");
  if (userConfirmed) {
    dialogStore.hideEdit();
    dialogStore.deleteEditItem();
  }
}

function hideBookmark () {
  dialogStore.hideEdit();
  dialogStore.hideEditItem();
}

function unhideBookmark () {
  dialogStore.hideEdit();
  dialogStore.unhideEditItem();
}

const itemDetails = ref(null);
async function updateBookmark () {
  const valid = await itemDetails.value.validate();

  if (valid) {
    dialogStore.hideEdit();
    dialogStore.saveEditItem();
  }
}
</script>

<template>
  <!-- Test commit -->
  <v-dialog
    v-model="dialogStore.editBookmark.show"
    min-width="350"
    max-width="800"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-title>Edit Bookmark</v-card-title>
      <v-card-text>
        <ItemDetails ref="itemDetails" />
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="updateBookmark"
        >
          Save
        </v-btn>

        <v-btn
          v-if="dialogStore.itemDetails.hidden"
          color="primary"
          @click="unhideBookmark"
        >
          Unhide
        </v-btn>
        <v-btn
          v-if="(dialogStore.editIsOriginal && !dialogStore.itemDetails.hidden)"
          color="error"
          @click="hideBookmark"
        >
          Hide
        </v-btn>
        <v-btn
          v-if="!dialogStore.editIsOriginal"
          color="error"
          @click="deleteBookmark"
        >
          Delete
        </v-btn>
        <v-btn
          color="black"
          @click="dialogStore.hideEdit"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
</style>
