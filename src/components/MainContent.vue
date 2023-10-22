<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useDialogStore } from "@/stores/dialog";
import { useSearchStore } from "@/stores/search";
import LinkItem from "@/components/LinkItem.vue";

const mainStore = useMainStore();
const searchStore = useSearchStore();
const dialogStore = useDialogStore();

const preparedItems = computed(() => {
  return mainStore.allItems.map(item => {
    return {
      ...item,
      hidden: !searchStore.filteredItems.includes(item.id),
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

function focusNextItem (itemId) {
  const index = preparedItems.value.findIndex((item) => item.id === itemId);
  const target = container.value.querySelectorAll("li")[index + 1];
  if (target) {
    target.focus();
  }
}

function focusPrevItem (itemId) {
  const index = preparedItems.value.findIndex((item) => item.id === itemId);
  const target = container.value.querySelectorAll("li")[index - 1];
  if (target) {
    target.focus();
  }
}

</script>

<template>
  <ul
    ref="container"
    class="container containerList"
  >
    <LinkItem
      v-for="item in preparedItems"
      :key="item.id"
      class="item"
      tag="li"
      :title="item.title"
      :src="item.src"
      :background-color="item.groupBackground"
      :font-color="item.groupColor"
      :is-favorite="item.favorite"
      :hidden="item.hidden"
      tabindex="0"
      @click="showBookmarkDetail(item.id)"
      @favorite-click="toggleFavorite(item.id)"
      @more-click="showBookmarkDetail(item.id)"
      @keyup.down="focusNextItem(item.id)"
      @keyup.right="focusNextItem(item.id)"
      @keyup.up="focusPrevItem(item.id)"
      @keyup.left="focusPrevItem(item.id)"
    />
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

.item:focus {
  outline-offset: 5px;
}

</style>
