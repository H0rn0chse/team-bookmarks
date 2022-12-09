<script setup>
import { computed, reactive } from "vue";
import { useMainStore } from "@/stores/main";
import ColorInput from "vue-color-input";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

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

setSelectedTag(preparedData.value.tags[Object.keys(preparedData.value.tags)[0]]);

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
  <splitpanes class="splitpane default-theme">
    <!-- Tag list -->
    <pane size="20">
      <v-card
        flat
        class="align-center"
      >
        <v-card-text>
          Available Tags
        </v-card-text>
      </v-card>
      <li
        v-for="tag in preparedData.tags"
        :key="tag.id"
        class="tag d-flex align-center"
        :class="tag.id === data.selectedTag.id ? 'selectedTag' : ''"
        :style="{ backgroundColor: tag.background, color: tag.color }"
        @click="setSelectedTag(tag)"
      >
        {{ tag.title }}
      </li>
      <v-btn
        icon="mdi-plus"
        class="addButton"
        size="x-small"
        @click="addNewTag"
      />
    </pane>
    <!-- Edit section -->
    <pane size="80">
      <v-card flat>
        <v-text-field
          v-model="data.previewTag.title"
          label="Title"
        />
      </v-card>
      <v-card flat>
        <v-text-field
          v-model="data.previewTag.background"
          label="Background Color"
        >
          <color-input
            v-model="data.previewTag.background"
            format="rgb"
            class="colorpicker"
          />
        </v-text-field>
      </v-card>
      <v-card flat>
        <v-text-field
          v-model="data.previewTag.color"
          label="Text Color"
        >
          <color-input
            v-model="data.previewTag.color"
            format="rgb"
            class="colorpicker"
          />
        </v-text-field>
      </v-card>
      <!-- Preview Item -->
      <v-card>
        <li
          class="item d-flex align-center"
          :style="{ backgroundColor: data.previewTag.background, color: data.previewTag.color, borderColor: data.previewTag.color, display: '' }"
        >
          <a
            class="d-flex align-center"
            href="javascript:undefined"
          >
            Example Item
            <vue-feather
              title="Open in New Tab"
              size="1em"
              :stroke="data.previewTag.color"
              type="external-link"
              style="marginLeft:0.2em;"
            />
          </a>
          <vue-feather
            title="Toggle Favorite"
            class="itemIcon"
            size="1.5em"
            :stroke="data.previewTag.color"
            fill="none"
            type="star"
          />
          <span class="end d-flex align-center">
            <vue-feather
              title="Show Details"
              class="itemIcon"
              size="1.5em"
              :stroke="data.previewTag.color"
              type="more-horizontal"
            />
          </span>
        </li>
        <v-card-actions class="d-flex justify-end">
          <v-btn
            color="primary"
            @click="saveTag"
          >
            Save Tag
          </v-btn>
        </v-card-actions>
      </v-card>
    </pane>
  </splitpanes>
</template>

<style scoped>
.addButton {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.colorpicker >>> .picker-popup{
  position: relative;
  left: 0 !important;
  top: 0 !important;
  cursor: pointer
}

.splitpane >>> .splitpanes__pane {
  background-color: transparent;
  height: auto;
}

.tag {
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

a, a:visited {
    color: inherit;
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
</style>
