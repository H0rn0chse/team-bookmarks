<script setup>
import { readonly, computed } from "vue";
import { useDialogStore } from "@/stores/dialog";
import { useMainStore } from "@/stores/main";

const dialogStore = useDialogStore();
const mainStore = useMainStore();

const combobox = readonly({
  delimiters: [" ", ","],
  menuProps: {
    closeOnClick: false,
    closeOnContentClick: false,
    disableKeys: true,
    openOnClick: false,
    maxHeight: 200
  }
});

const keywordSuggestions = computed({
  get () {
    return mainStore.availableKeywords
      .filter(keyword => !dialogStore.itemDetails.keywords.includes(keyword));
  }
});

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
    <v-combobox
      v-model="dialogStore.itemDetails.keywords"
      :items="keywordSuggestions"
      :delimiters="combobox.delimiters"
      label="Enter Keywords"
      :menu-props="combobox.menuProps"
      hide-selected
      closable-chips
      multiple
      chips
      clearable
    />
  </div>
</template>


<style scoped>
</style>
