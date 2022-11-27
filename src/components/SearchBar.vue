<script setup>
import { reactive, computed } from "vue";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

const combobox = reactive({
    delimiters: [" ", ","],
});

</script>

<template>
    <div class="searchBarComponent">
        <div class="searchBarWrapper">
            <v-combobox
                class="searchBar"
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
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    position: sticky;
    padding: 2em;
}

.searchBarWrapper {
    width: 60vw;
}
</style>