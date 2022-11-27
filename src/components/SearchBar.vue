<script setup>
import { reactive } from "vue";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

const combobox = reactive({
    delimiters: [" ", ","],
});

</script>

<template>
    <div class="searchBarComponent d-flex align-center justify-center">
        <div class="searchBarWrapper">
            <v-combobox
                bg-color="background-light"
                v-model="mainStore.searchTerms"
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
    top: 0;
    position: sticky;
    padding: 2em;
}

.searchBarWrapper {
    width: 60vw;
}
</style>