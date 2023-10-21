<script setup>
import { ref, inject, computed, readonly } from "vue";
import { useDialogStore } from "@/stores/dialog";
import { analyzeImportFile, IMPORT_SCOPE, MERGE_STRATEGY } from "@/js/ImportExport";

const dialogStore = useDialogStore();
const confirm = inject("confirm");

const ImportScope = readonly(IMPORT_SCOPE);
const MergeStrategy = readonly(MERGE_STRATEGY);

const busy = ref(false);

const importFileChecked = ref(false);
const importFile = ref([]);
const fileError = ref([]);
const preImportData = ref(null);

async function processFile () {
  busy.value = true;
  fileError.value = [];
  try {
    const files = importFile.value;
    if (!files.length) {
      fileError.value = ["No File selected"];
      throw new Error("No File selected");
    }
    const file = files[0];
    if (!file.type.includes("json")) {
      fileError.value = ["File has invalid Extension"];
      throw new Error(`File has invalid Extension: ${file.name} > ${file.type}`);
    }

    preImportData.value = await analyzeImportFile(file);
    importFileChecked.value = true;
  } catch (err) {
    console.error(err);
    if (!fileError.value.length) {
      fileError.value = ["Unexpected Error occurred"];
    }
  }
  busy.value = false;
}

const importOption = ref(ImportScope.CleanImport);
const mergeStrategy = ref(MergeStrategy.PreferPers);
const strategyData = computed(() => {
  const hasCollisions = preImportData.value ? preImportData.value.hasCollisions : false;
  let mergeStrategyRequired = true;
  let hint = "";
  switch (importOption.value) {
    case ImportScope.MergeOnItemLevel:
      if (!hasCollisions) {
        mergeStrategyRequired = false;
        hint = "No Merge Strategy required";
      }
      break;
    case ImportScope.MergeOnPropLevel:
      if (!hasCollisions) {
        mergeStrategyRequired = false;
        hint = "No Merge Strategy required";
      }
      break;
    default: // ImportScope.CleanImport
      mergeStrategyRequired = false;
      hint = "No Merge Strategy required";
      break;
  }
  return {
    mergeStrategyRequired,
    hint
  };
});

function resetDialog () {
  // preImport
  importFileChecked.value = false;
  importFile.value = [];
  fileError.value = [];
  preImportData.value = null;
  //merge strategy
  importOption.value = ImportScope.CleanImport;
  mergeStrategy.value = MergeStrategy.PreferPers;
}

function startImport () {
  alert(`start ${importOption.value} with ${mergeStrategy.value}`);
  dialogStore.hideImport();
  setTimeout(resetDialog, 1000);
}

function cancelImport () {
  dialogStore.hideImport();
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
    v-model="dialogStore.importData.show"
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
      <v-card-title>Import Personalization</v-card-title>
      <v-card-text v-if="!importFileChecked">
        <p>
          Please select the import file.
        </p>
        <v-file-input
          v-model="importFile"
          label="Import File"
          accept=".json"
          :error="fileError.length"
          :error-messages="fileError"
        />
      </v-card-text>
      <v-card-text v-if="importFileChecked">
        <p>
          Please select how the personalization should be imported.
        </p>
        <v-radio-group v-model="importOption">
          <v-radio
            label="Clean Import (Deletes current Personalization)"
            :value="ImportScope.CleanImport"
          />
          <v-radio
            label="Merge on Item Level"
            :value="ImportScope.MergeOnItemLevel"
          />
          <v-radio
            label="Merge on Property Level"
            :value="ImportScope.MergeOnPropLevel"
          />
        </v-radio-group>
        <v-radio-group
          v-model="mergeStrategy"
          :disabled="!strategyData.mergeStrategyRequired"
          label="Merge Strategy"
        >
          <v-radio
            label="Prefer current Personalization data"
            :value="MergeStrategy.PreferPers"
          />
          <v-radio
            label="Prefer Import data"
            :value="MergeStrategy.PreferImport"
          />
        </v-radio-group>
        <v-alert
          v-if="strategyData.hint.length"
          type="info"
          :text="strategyData.hint"
          density="compact"
        />
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          v-if="!importFileChecked"
          color="primary"
          @click="processFile"
        >
          Next
        </v-btn>
        <v-btn
          v-if="importFileChecked"
          color="primary"
          @click="startImport"
        >
          Import
        </v-btn>
        <v-btn
          color="black"
          @click="cancelImport"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
</style>
