<script setup>
import { reactive } from "vue";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

const combobox = reactive({
    delimiters: [" ", ","],
});

</script>

<template>
  <div class="searchBarComponent d-flex align-start justify-center">
    <div class="searchBarWrapper">
      <v-combobox
        v-model="mainStore.searchTerms"
        bg-color="background-light"
        :delimiters="combobox.delimiters"
        label="Enter Search Terms"
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
