<script setup>
import { reactive } from "vue";
import { useDialogStore } from "@/stores/dialog";
import Tags from "@/components/dialogs/SettingsDialogSubComponents/SettingsDialog.Tags.vue";

const dialogStore = useDialogStore();
const data = reactive({
  tab: "tags"
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
      <v-toolbar
        color="primary"
      >
        <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>
      <div class="d-flex flex-row">
        <v-tabs
          v-model="data.tab"
          direction="vertical"
          color="primary"
        >
          <v-tab value="tags">
            <v-icon start>
              mdi-tab
            </v-icon>
            Tags
          </v-tab>
        </v-tabs>
        <v-window
          v-model="data.tab"
          class="tags"
        >
          <v-window-item value="tags" />
          <Tags />
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
.tags {
  width: 100%
}
</style>
