<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useDialogStore } from "@/stores/dialog";
import { useSearchStore } from "@/stores/search";

const mainStore = useMainStore();
const searchStore = useSearchStore();
const dialogStore = useDialogStore();

const preparedItems = computed(() => {
  return mainStore.allItems.map(item => {
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
      display: searchStore.filteredItems.includes(item.id) ? "" : "none !important",
    };
  });
});

function toggleFavorite (itemId) {
  const item = mainStore.getItem(itemId);
  const newFavoriteState = !item.favorite;
  mainStore.updateItem(itemId, { favorite: newFavoriteState });
}
function showBookmarkDetail (itemId) {
  dialogStore.showEdit(itemId);
}

const container = ref(null);
function scrollTop () {
  container.value.scrollTop = 0;
}
</script>

<template>
  <ul
    ref="container"
    class="container containerList"
  >
    <v-lazy
      v-for="item in preparedItems"
      :key="item.id"
      tag="li"
      class="item"
      :style="{ backgroundColor: item.itemBackground, color: item.itemColor, borderColor: item.itemColor, display: item.display }"
    >
      <div class="itemContainer flexContainer">
        <div class="start shrinking flexContainer">
          <a
            class="link shrinking flexContainer"
            :href="item.src"
            target="_blank"
          >
            <span class="linkText shrinking">
              {{ item.title }}
            </span>
            <vue-feather
              title="Open in New Tab"
              class="linkIcon growing"
              size="1em"
              :stroke="item.iconColor"
              type="external-link"
            />
          </a>
          <vue-feather
            title="Toggle Favorite"
            class="itemIcon growing"
            :size="item.iconSize"
            :stroke="item.favoriteStroke"
            :fill="item.favoriteFill"
            type="star"
            @click="toggleFavorite(item.id)"
          />
        </div>
        <div class="end growing flexContainer">
          <vue-feather
            title="Show Details"
            class="itemIcon"
            :size="item.iconSize"
            :stroke="item.iconColor"
            type="more-horizontal"
            @click="showBookmarkDetail(item.id)"
          />
        </div>
      </div>
    </v-lazy>
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
  </ul>
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

.itemIcon {
  margin-left: 1em;
  cursor: pointer;
}

.item {
  display: block;
  max-width: 30em;
  min-height: calc(2.5em + 4px);
  min-width: 5em;
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

.flexContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.growing {
  flex-grow: 1;
  flex-shrink: 0;
}

.shrinking {
  flex-shrink: 1;
  min-width: 0;
}

.start {
  justify-content: flex-start;
}

.linkText {
  justify-content: flex-start;
  overflow: hidden;
}

.linkIcon {
  margin-left: 0.2em;
}

.end {
  justify-content: flex-end;
}

.containerList {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
}

.container {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 1em;
}

@media only screen and (min-width: 1264px) {
  .container {
    padding: 4em;
  }
}
</style>
