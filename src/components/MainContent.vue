<script setup>
import { reactive } from "vue";

const state = reactive({
    items: new Array(20)
        .fill({})
        .map((item, index) => {
            return {
                id: index,
                text: `Item No. ${index.toString().padStart(2, "0")}`
            };
        })
});
</script>

<template>
    <div class="cont d-flex flex-column align-center">
        <div v-for="item in state.items" :key="item.id">
            <div class="item">{{ item.text }}</div>
        </div>
    </div>
</template>

<style scoped>
.item {
    width: 10em;
    background-color: var(--common-warn);
    border-color: var(--common-delete);
    border-width: 2px;
    border-style: solid;
    border-radius: 5px;
    margin: 0.5em;
    padding: 0.5em;
}

.cont {
    height: 80vh;
    width: calc(100% - 4em);
    overflow-y: scroll;
    background-color: var(--common-bg-light);
    border-radius: 5px;
}

.cont::-webkit-scrollbar {
    display: "inherit";
}

</style>