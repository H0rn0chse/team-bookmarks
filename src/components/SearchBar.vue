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
    <div class="searchBarWrapper d-flex">
      <v-combobox
        v-model="searchStore.searchTerms"
        class="searchCombobox"
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
      <v-select
        v-model="searchStore.searchGroup"
        class="groupSelect"
        bg-color="background-light"
        :items="searchStore.searchGroups"
        label="Search group"
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
  flex-wrap: wrap;
}

.searchBarWrapper > * {
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.searchCombobox {
  min-width: 10em;
}

.groupSelect {
  max-width: 12em;
  min-width: 10em;
}

</style>
