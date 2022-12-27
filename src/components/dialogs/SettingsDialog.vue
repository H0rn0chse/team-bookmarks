<script setup>
import { reactive } from "vue";
import { useDialogStore } from "@/stores/dialog";
import TagsEditor from "@/components/settingsEntries/TagsEditorEntry.vue";
import AboutEntry from "../settingsEntries/AboutEntry.vue";

const dialogStore = useDialogStore();
const data = reactive({
  tab: "tagEditor"
});
</script>

<template>
  <v-dialog
    v-model="dialogStore.settings.show"
    min-width="350" 
    max-width="1200"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-title>Settings</v-card-title>
      <div class="flexContainer">
        <v-tabs
          v-model="data.tab"
          direction="vertical"
          color="primary"
          class="growing"
        >
          <v-tab value="tagEditor">
            <vue-feather
              type="tag"
              class="settingsEntryIcon"
            />
            Tag Editor
          </v-tab>
          <v-tab value="about">
            <vue-feather
              type="coffee"
              class="settingsEntryIcon"
            />
            About
          </v-tab>
        </v-tabs>
        <v-window
          v-model="data.tab"
          class="settingsWindow shrinking"
        >
          <v-window-item value="tagEditor">
            <TagsEditor />
          </v-window-item>
          <v-window-item value="about">
            <AboutEntry />
          </v-window-item>
        </v-window>
      </div>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="dialogStore.hideSettings"
        >
          Close Dialog
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.flexContainer {
  display: flex;
  flex-direction: row;
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

.settingsWindow {
  width: 100%;
  overflow: auto;
}

.settingsEntryIcon {
  margin-right: 0.2em;
}
</style>
