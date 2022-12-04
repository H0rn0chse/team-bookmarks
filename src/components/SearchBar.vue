<script setup>
import { reactive, readonly } from "vue";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

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
        v-model="mainStore.searchTerms"
        :items="mainStore.searchKeywords"
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
