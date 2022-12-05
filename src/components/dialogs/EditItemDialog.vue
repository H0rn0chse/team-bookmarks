<script setup>
import ItemDetails from "@/components/ItemDetails.vue";
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

function deleteBookmark () {
  // todo user confirmation
  dialogStore.deleteEditItem();
  dialogStore.hideEdit();
}

function hideBookmark () {
  // todo check user confirmation
  dialogStore.hideEditItem();
  dialogStore.hideEdit();
}

function updateBookmark () {
  dialogStore.saveEditItem();
  dialogStore.hideEdit();
}

</script>

<template>
  <v-dialog
    v-model="dialogStore.editBookmark.show"
    min-width="400"
    max-width="800"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-title>Edit Bookmark</v-card-title>
      <v-card-text>
        <ItemDetails />
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="updateBookmark"
        >
          Save
        </v-btn>

        <v-btn
          color="error"
          @click="hideBookmark"
        >
          Hide
        </v-btn>
        <v-btn
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
