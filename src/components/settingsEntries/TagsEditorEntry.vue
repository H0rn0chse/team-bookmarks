<script setup>
import { computed, reactive } from "vue";
import ColorInput from "vue-color-input";
import { useMainStore } from "@/stores/main";
import LinkItem from "@/components/LinkItem.vue";

const mainStore = useMainStore();
const preparedData = computed(() => {
  return {
    tags: mainStore.allGroups,
    items: mainStore.allItems
  };
});
const data = reactive({
  selectedTag: null,
  previewTag: { }
});

if (Object.keys(preparedData.value.tags).length) {
  setSelectedTag(preparedData.value.tags[Object.keys(preparedData.value.tags)[0]]);
}

function setSelectedTag (tag) {
  data.selectedTag = tag;
  data.previewTag.title = tag.title;
  data.previewTag.background = tag.background;
  data.previewTag.color = tag.color;
}

function saveTag () {
  mainStore.updateGroup(data.selectedTag.id, data.previewTag);
}

function addNewTag () {
  let newTag = {
    title: "New Tag",
    background: "white",
    color: "black"
  };
  const idOfNewTag = mainStore.addGroup(newTag);
  setSelectedTag(preparedData.value.tags[idOfNewTag]);
}
</script>

<template>
  <div class="container">
    <!-- Tag list -->
    <div class="tagList">
      <h3>Available Tags</h3>
      <ul>
        <li
          v-for="tag in preparedData.tags"
          :key="tag.id"
          class="tagListEntry d-flex align-center"
          :class="tag.id === data.selectedTag.id ? 'selectedTag' : ''"
          :style="{ backgroundColor: tag.background, color: tag.color }"
          @click="setSelectedTag(tag)"
        >
          {{ tag.title }}
        </li>
      </ul>
      <v-btn
        class="addButton"
        size="x-small"
        icon
        @click="addNewTag"
      >
        <vue-feather
          title="Add new Tag"
          type="plus"
        />
      </v-btn>
    </div>
    <!-- Edit section -->
    <div class="editSection">
      <div v-if="(data.selectedTag != null)">
        <v-text-field
          v-model="data.previewTag.title"
          label="Title"
        />
        <v-text-field
          v-model="data.previewTag.background"
          label="Background Color"
        >
          <color-input
            v-model="data.previewTag.background"
            format="rgb"
            class="colorPicker"
          />
        </v-text-field>
        <v-text-field
          v-model="data.previewTag.color"
          label="Text Color"
        >
          <color-input
            v-model="data.previewTag.color"
            format="rgb"
            class="colorPicker"
          />
        </v-text-field>
        <!-- Preview Item -->
        <LinkItem
          :background-color="data.previewTag.background"
          :font-color="data.previewTag.color"
          title="Example Item"
        />
        <v-btn
          color="primary"
          title="Save Tag"
          @click="saveTag"
        >
          Save Tag
        </v-btn>
        <v-btn
          color=""
          title="Reset Tag"
          style="marginLeft:0.2em;"
          @click="setSelectedTag(data.selectedTag)"
        >
          Reset Tag
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>

.container {
  margin-left: 1em;
  margin-bottom: 1em;
  display: grid;
  grid-template-columns: 20% auto;
  grid-template-rows: auto;
  grid-template-areas: 
    "tagList editSection";
}

.tagList {
  grid-area: tagList;
}

.editSection {
  grid-area: editSection;
}

.addButton {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.colorPicker :deep(.picker-popup) {
  position: relative;
  left: 0 !important;
  top: 0 !important;
  cursor: pointer
}

.tagListEntry {
    max-width: 80%;
    min-width: 5em;
    border-color: var(--common-font-secondary);
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
    margin: 1em;
    padding: 0.5em;
    cursor: pointer;
}

.selectedTag {
  outline: 2px solid red;
}
</style>
