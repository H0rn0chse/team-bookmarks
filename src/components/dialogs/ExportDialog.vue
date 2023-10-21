<script setup>
import { ref } from "vue";
import { useDialogStore } from "@/stores/dialog";
import { exportData, EXPORT_SCOPE } from "@/js/ImportExport";

const dialogStore = useDialogStore();

const EXPORT_SCOPE_LOCAL = {
  All: "All",
  Search: "Search"
};

const exportScope = ref(EXPORT_SCOPE_LOCAL.All);
const exportFullCopy = ref(false);

function resetDialog () {
  exportScope.value = EXPORT_SCOPE_LOCAL.All;
  exportFullCopy.value = false;
}

async function startExport () {
  console.log(`Export: start scope: ${exportScope.value} with copy: ${exportFullCopy.value}`);

  if (exportScope.value === EXPORT_SCOPE_LOCAL.All) {
    if (exportFullCopy.value) {
      await exportData(EXPORT_SCOPE.allItemsCopy);
    } else {
      await exportData(EXPORT_SCOPE.allItemsPersonalization);
    }
  } else if (exportScope.value === EXPORT_SCOPE_LOCAL.Search) {
    if (exportFullCopy.value) {
      await exportData(EXPORT_SCOPE.searchItemsCopy);
    } else {
      await exportData(EXPORT_SCOPE.searchItemsPersonalization);
    }
  }

  dialogStore.hideExport();
  setTimeout(resetDialog, 1000);
}

function cancelExport () {
  dialogStore.hideExport();
  setTimeout(resetDialog, 1000);
}

function onDialogHideShow (visible) {
  if (!visible) {
    setTimeout(resetDialog, 1000);
  }
}

</script>

<template>
  <v-dialog
    v-model="dialogStore.exportData.show"
    min-width="350"
    max-width="800"
    transition="dialog-top-transition"
    @update:model-value="onDialogHideShow"
  >
    <v-card>
      <v-overlay
        v-model="busy"
        contained
        class="align-center justify-center"
        color="white"
        :persistent="true"
      >
        <v-progress-circular indeterminate />
      </v-overlay>
      <v-card-title>Export Personalization</v-card-title>
      <v-card-text>
        <p>
          Please select how the personalization should be exported.
        </p>
        <v-radio-group v-model="exportScope">
          <v-radio
            label="All Items"
            :value="EXPORT_SCOPE_LOCAL.All"
          />
          <v-radio
            label="Current Search"
            :value="EXPORT_SCOPE_LOCAL.Search"
          />
        </v-radio-group>
        <v-checkbox
          v-model="exportFullCopy"
          label="Full Copy"
        />
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="startExport"
        >
          Export
        </v-btn>
        <v-btn
          color="black"
          @click="cancelExport"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
</style>
