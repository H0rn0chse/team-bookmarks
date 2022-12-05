<script setup>
import ItemDetails from "@/components/ItemDetails.vue";
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

function addBookmark () {
  dialogStore.saveAddItem();
  dialogStore.hideAdd();
}
</script>

<template>
  <v-dialog
    v-model="dialogStore.addBookmark.show"
    min-width="400"
    max-width="800"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-title>Add Bookmark</v-card-title>
      <v-card-text>
        <ItemDetails />
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="addBookmark"
        >
          Add
        </v-btn>
        <v-btn
          color="black"
          @click="dialogStore.hideAdd"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
</style>
