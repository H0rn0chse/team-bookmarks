<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useDialogStore } from "@/stores/dialog";
import { useSearchStore } from "@/stores/search";

const mainStore = useMainStore();
const searchStore = useSearchStore();
const dialogStore = useDialogStore();

const peraparedItems = computed(() => {
  return searchStore.filteredItems.map(item => {
    const iconColor = item.groupColor || "var(--common-font-primary)";
    return {
      ...item,
      iconColor,
      iconSize: "1.5em",
      itemColor: item.groupColor || "var(--common-font-primary)",
      itemBackground: item.groupBackground || "var(--common-bg-light)",
      favoriteStroke: item.favorite ? "var(--common-favorite)" : iconColor,
      //favoriteStroke: iconColor,
      favoriteFill: item.favorite ? "var(--common-favorite)" : "none",
      // favoriteFill: item.favorite ? iconColor : "none",
    };
  });
});

function toggleFavorite (itemId) {
  const item = mainStore.getItem(itemId);
  const newFavoriteState = !item.favorite;
  mainStore.updateItem(itemId, { favorite: newFavoriteState });
}
function showBookmarkDetail (itemId) {
  console.error(`show more: ${itemId}`);
  dialogStore.showEdit(itemId);
}

const container = ref(null);
function scrollTop () {
  container.value.scrollTop = 0;
}
</script>

<template>
  <div
    ref="container"
    class="container d-flex"
  >
    <ul
      v-for="item in peraparedItems"
      :key="item.id"
    >
      <div
        class="item d-flex align-center"
        :style="{ backgroundColor: item.itemBackground, color: item.itemColor, borderColor: item.itemColor }"
      >
        <a
          class="d-flex align-center"
          :href="item.src"
          target="_blank"
        >
          {{ item.title }}
          <vue-feather
            title="Open in New Tab"
            size="1em"
            :stroke="item.iconColor"
            type="external-link"
            style="marginLeft:0.2em;"
          />
        </a>
        <vue-feather
          title="Toggle Favorite"
          class="itemIcon"
          :size="item.iconSize"
          :stroke="item.favoriteStroke"
          :fill="item.favoriteFill"
          type="star"
          @click="toggleFavorite(item.id)"
        />
        <span class="end d-flex align-center">
          <vue-feather
            title="Show Details"
            class="itemIcon"
            :size="item.iconSize"
            :stroke="item.iconColor"
            type="more-horizontal"
            @click="showBookmarkDetail(item.id)"
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
    color: inherit;
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
