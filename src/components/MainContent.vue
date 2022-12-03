<script setup>
import { readonly, computed, ref } from "vue";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

const icons = readonly({
    size: "1.5em",
    color: "var(--common-font-primary)",
    favorite: "var(--common-favorite)",
});

const favoriteStroke = computed(() => (item) => {
        return item.favorite ? icons.favorite : icons.color;
});
const favoriteFill = computed(() => (item) => {
        return item.favorite ? icons.favorite : "none";
});

function toggleFavorite (evt) {
    alert("toggleFavorite");
}
function showBookmarkDetail (evt) {
    alert("more");
}

const container = ref(null)
function scrollTop () {
    container.value.scrollTop = 0;
}
</script>

<template>
    <div class="container d-flex" ref="container">
        <ul v-for="item in mainStore.filteredItems" :key="item.id">
            <div
                class="item d-flex align-center"
            >
                <a
                    class="d-flex align-center"
                    :href="item.src"
                    target="_blank"
                >
                    {{ item.title }}
                    <vue-feather
                        size="1em"
                        :stroke="icons.color"
                        type="external-link"
                        style="marginLeft:0.2em;"
                    />
                </a>
                <vue-feather
                    class="itemIcon"
                    :size="icons.size"
                    :stroke="favoriteStroke(item)"
                    :fill="favoriteFill(item)"
                    type="star"
                    @click="toggleFavorite"
                />
                <span class="end d-flex align-center">
                    <vue-feather
                        class="itemIcon"
                        :size="icons.size"
                        :stroke="icons.color"
                        type="more-horizontal"
                        @click="showBookmarkDetail"
                    />
                </span>
            </div>
        </ul>
        <v-btn
            id="btn-toTop"
            title="Scroll to Top"
            color="primary"
            icon
        >
            <vue-feather
                size="2em"
                stroke="var(--common-font-primary)"
                type="chevrons-up"
                @click="scrollTop"
            />
        </v-btn>
    </div>
</template>

<style scoped>
a, a:visited {
    color: var(--common-font-primary);
}

#btn-toTop {
    position: fixed;
    bottom: 4em;
    right: 4em;
}

.end {
    flex-grow: 1;
    justify-content: flex-end;
}
.itemIcon {
    padding-left: 1em;
    cursor: pointer;
}
.end > .itemIcon {
    padding-left: 0.5em;
}
.item {
    max-width: 30em;
    background-color: var(--common-bg-light);
    border-color: var(--common-font-secondary);
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
    margin: 1em;
    padding: 0.5em;
}

@media only screen and (min-width: 960px) {
  .item {
    width: 30em;
  }
}

.container {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 1em;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
}

@media only screen and (min-width: 1264px) {
  .container {
    padding: 4em;
  }
}
</style>
