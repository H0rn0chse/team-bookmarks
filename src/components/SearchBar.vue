<script setup>
import { readonly } from "vue";
import { useSearchStore } from "@/stores/search";

const searchStore = useSearchStore();

const combobox = readonly({
  delimiters: [" ", ","],
  menuProps: {
    closeOnClick: false,
    closeOnContentClick: false,
    disableKeys: true,
    openOnClick: false,
    maxHeight: 304
  }
});

</script>

<template>
  <div class="searchBarComponent d-flex align-start justify-center">
    <div class="searchBarWrapper">
      <v-combobox
        v-model="searchStore.searchTerms"
        :items="searchStore.searchKeywords"
        bg-color="background-light"
        :delimiters="combobox.delimiters"
        label="Enter Search Terms"
        :menu-props="combobox.menuProps"
        hide-selected
        closable-chips
        multiple
        chips
        clearable
      />
    </div>
  </div>
</template>

<style scoped>
.searchBarComponent {
    width: 100%;
    height: 100%;
}

.searchBarWrapper {
    width: 70%;
    margin-top: 3em;
}
</style>
