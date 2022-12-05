<script setup>
import { reactive } from "vue";
import ItemDetails from "@/components/ItemDetails.vue";
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

const foo = reactive({
  bar: false
});

</script>

<template>
  <v-dialog
    v-model="dialogStore.editBookmark.show"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-title>Edit Bookmark</v-card-title>
      <v-card-text>
        <ItemDetails />
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          block
          @click="dialogStore.hideEdit"
        >
          Close Dialog
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
</style>
