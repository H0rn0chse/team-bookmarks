<script setup>
import { computed, reactive, ref, inject } from "vue";
import { useMainStore } from "@/stores/main";
import LinkItem from "@/components/LinkItem.vue";
import { isOriginalGroup } from "@/js/Personalization";

const confirm = inject("confirm");

const mainStore = useMainStore();
const preparedTags = computed(() => {
  return mainStore.allGroups;
});

const previewTag = reactive({
  title: "",
  background: "#FFF",
  color: "#FFF",
  enableDelete: false
});

const currentTagId = ref("");

function setSelectedTag (tag) {
  if (!tag) {
    if (!Object.keys(preparedTags.value).length) {
      currentTagId.value = "";
      return;
    }
    tag = preparedTags.value[Object.keys(preparedTags.value)[0]];
  }
  currentTagId.value = tag.id;
  previewTag.title = tag.title;
  previewTag.background = tag.background;
  previewTag.color = tag.color;
  previewTag.enableDelete = isOriginalGroup(tag.id);
}

// set initial data
setSelectedTag();

const resetSnack = ref(false);
function resetTag () {
  const tagData = preparedTags.value[currentTagId.value];
  setSelectedTag(tagData);
  resetSnack.value = true;
}

const saveSnack = ref(false);
function saveTag () {
  const originalTag = preparedTags[currentTagId.value];
  const tagData = {
    ...originalTag,
    title: previewTag.title,
    background: previewTag.background,
    color: previewTag.color,
  };
  mainStore.updateGroup(currentTagId.value, tagData);
  saveSnack.value = true;
}

const deleteSnack = ref(false);
async function deleteTag () {
  const userConfirmed = await confirm("Are you sure? This Action will permanently delete the Color Tag");
  if (userConfirmed) {
    mainStore.deleteGroup(currentTagId.value);
    deleteSnack.value = true;
    setSelectedTag();
  }
}

function addNewTag () {
  let newTag = {
    title: "New Tag",
    background: "#000",
    color: "#FFF"
  };
  const idOfNewTag = mainStore.addGroup(newTag);
  setSelectedTag(preparedTags.value[idOfNewTag]);
}
</script>

<template>
  <div class="container">
    <!-- Tag list -->
    <div class="tagList">
      <h3>Available Tags</h3>
      <ul>
        <li
          v-for="tag in preparedTags"
          :key="tag.id"
          class="tagListEntry d-flex align-center"
          :class="tag.id === currentTagId ? 'selectedTag' : ''"
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
      <div v-if="(currentTagId !== '')">
        <v-text-field
          v-model="previewTag.title"
          label="Title"
        />
        <v-text-field
          v-model="previewTag.background"
          label="Background Color"
          readonly
        >
          <div
            class="colorPicker"
            :style="{ backgroundColor: previewTag.background }"
          >
            <v-menu
              activator="parent"
              :close-on-content-click="false"
              close-delay="500"
              open-on-hover
            >
              <v-color-picker
                v-model="previewTag.background"
              />
            </v-menu>
          </div>
        </v-text-field>
        <v-text-field
          v-model="previewTag.color"
          label="Text Color"
          readonly
        >
          <div
            class="colorPicker"
            :style="{ backgroundColor: previewTag.color }"
          >
            <v-menu
              activator="parent"
              :close-on-content-click="false"
              close-delay="500"
              open-on-hover
            >
              <v-color-picker
                v-model="previewTag.color"
              />
            </v-menu>
          </div>
        </v-text-field>
        <!-- Preview Item -->
        <LinkItem
          :background-color="previewTag.background"
          :font-color="previewTag.color"
          title="Example Item"
        />
        <div class="d-flex align-center">
          <v-btn
            color="primary"
            title="Save Tag"
            @click="saveTag"
          >
            Save Tag
          </v-btn>
          <v-snackbar
            v-model="saveSnack"
            timeout="1000"
          >
            Color Tag Saved
          </v-snackbar>
          <v-btn
            color=""
            title="Reset Tag"
            style="marginLeft:0.5em;"
            @click="resetTag"
          >
            Reset Tag
          </v-btn>
          <v-snackbar
            v-model="resetSnack"
            timeout="1000"
          >
            Color Tag Reset
          </v-snackbar>
          <v-btn
            color=""
            title="Delete Tag"
            style="marginLeft:0.5em;"
            size="x-small"
            icon
            :disabled="previewTag.enableDelete"
            @click="deleteTag"
          >
            <vue-feather
              title="Delete Tag"
              type="trash"
              size="1.5em"
              stroke="var(--common-delete)"
              @click="deleteTag"
            />
          </v-btn>
          <v-snackbar
            v-model="deleteSnack"
            timeout="1000"
          >
            Color Tag Deleted
          </v-snackbar>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-left: 1em;
  margin-bottom: 1em;
  display: grid;
  grid-template-columns: clamp(9em, 20%, 15em) auto;
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

.colorPicker {
  margin-right: 0.5em;
  width: 2em;
  height: 2em;
  border-width: 2px;
  border-radius: 5px;
  cursor: pointer;
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
  border-color: black;}

.tagListEntry:hover {
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
}
</style>
