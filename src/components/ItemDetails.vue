<script setup>
import { reactive, computed } from "vue";

import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

</script>

<template>
  <div>
    <!-- TODO Favorite -->
    <v-text-field
      v-model="dialogStore.itemDetails.title"
      label="Title"
    />
    <v-text-field
      v-model="dialogStore.itemDetails.src"
      label="Link"
    />
    <v-text-field
      v-model="dialogStore.itemDetails.description"
      label="Description"
    />
    <!-- TODO Group -->
    <!-- TODO Keywords -->
  </div>
</template>


<style scoped>
</style>
