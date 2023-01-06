<script setup>
import { readonly, inject } from "vue";
import { useDialogStore } from "@/stores/dialog";
import { importData, exportData, IMPORT_SCOPE, EXPORT_SCOPE } from "@/js/ImportExport";

const confirm = inject("confirm");

const dialogStore = useDialogStore();

const icons = readonly({
  size: "3em",
  color: "var(--common-font-primary)"
});

async function importDataLocal (scope) {
  let confirmationMessage;
  switch (scope) {
    case IMPORT_SCOPE.deleteOldPersAndImport:
      confirmationMessage = "Are you sure? This Action will permanently remove your existing Tags and Bookmarks!";
      break;
    case IMPORT_SCOPE.forceMergeItems:
      confirmationMessage = "Are you sure? This Action might permanently override your existing Tags and Bookmarks!";
      break;
    case IMPORT_SCOPE.mergeOnlyNewItems:
      break;
    default:
      console.error(`scope ${scope} is not implemented yet`);
      return;
  }

  let userConfirmed = true;
  if (confirmationMessage) {
    userConfirmed = await confirm(confirmationMessage);
  }

  if (userConfirmed) {
    await importData(scope);
  }
}

async function exportDataLocal (scope) {
  if (!EXPORT_SCOPE[scope]) {
    console.error(`scope ${scope} is not implemented yet`);
    return;
  }

  await exportData(scope);
}

function showAddItemDialog () {
  dialogStore.showAdd();
}

</script>

<template>
  <div class="sideBar d-flex flex-column align-center bg-background-dark">
    <div class="top d-flex flex-column align-center">
      <vue-feather
        :size="icons.size"
        type="settings"
        title="Settings"
        class="sideItem"
        @click="dialogStore.showSettings"
      />
      <div
        id="importBtn"
        title="Import"
        class="sideItem"
      >
        <vue-feather
          :size="icons.size"
          type="upload-cloud"
        />
      </div>
      <v-menu
        activator="#importBtn"
        location="end"
      >
        <v-card class="optionsCard">
          <v-card-title>
            Import Options
          </v-card-title>
          <div class="d-flex flex-column align-start">
            <v-btn
              variant="flat"
              @click="importDataLocal(IMPORT_SCOPE.deleteOldPersAndImport)"
            >
              Clean Import
            </v-btn>
            <v-btn
              variant="flat"
              @click="importDataLocal(IMPORT_SCOPE.mergeOnlyNewItems)"
            >
              Merge: Import Only new Items
            </v-btn>
            <v-btn
              variant="flat"
              @click="importDataLocal(IMPORT_SCOPE.forceMergeItems)"
            >
              Merge: Import All Items
            </v-btn>
          </div>
        </v-card>
      </v-menu>
      <div
        id="exportBtn"
        title="Export"
        class="sideItem"
      >
        <vue-feather
          :size="icons.size"
          type="download-cloud"
        />
      </div>
      <v-menu
        activator="#exportBtn"
        location="end"
      >
        <v-card class="optionsCard">
          <v-card-title>
            Export Options
          </v-card-title>
          <div class="d-flex flex-column align-start">
            <v-btn
              variant="flat"
              @click="exportDataLocal(EXPORT_SCOPE.allItemsPersonalization)"
            >
              All Items (Personalization)
            </v-btn>
            <v-btn
              variant="flat"
              @click="exportDataLocal(EXPORT_SCOPE.allItemsCopy)"
            >
              All Items (Full Copy)
            </v-btn>
            <v-btn
              variant="flat"
              @click="exportDataLocal(EXPORT_SCOPE.searchItemsPersonalization)"
            >
              Current Search (Personalization)
            </v-btn>
            <v-btn
              variant="flat"
              @click="exportDataLocal(EXPORT_SCOPE.searchItemsCopy)"
            >
              Current Search (Full Copy)
            </v-btn>
          </div>
        </v-card>
      </v-menu>
    </div>
    <div class="bottom d-flex flex-column align-center">
      <div
        title="Add new Bookmark"
        class="sideItem"
      >
        <vue-feather
          :size="icons.size"
          type="plus-square"
          @click="showAddItemDialog"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sideBar {
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.sideBar > .top {
  margin-top: 2em;
}

.sideBar > .bottom {
  margin-bottom: 1em;
}

.sideBar .sideItem {
  margin-top: 1em;
  margin-bottom: 1em;
  cursor: pointer;
}

.vue-feather:hover {
  color: var(--common-primary-light);
}

.optionsCard {
  margin-left: 0.5em;
}

.optionsCard .v-btn {
  margin-left: 0.5em;
  margin-right: 0.5em;
  margin-bottom: 0.5em;
}

</style>
