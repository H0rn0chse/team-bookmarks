<script setup>
import { readonly } from "vue";
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

const icons = readonly({
  size: "3em",
  color: "var(--common-font-primary)"
});

function showAddItemDialog () {
  dialogStore.showAdd();
}

function showImportDialog () {
  dialogStore.showImport();
}

function showExportDialog () {
  dialogStore.showExport();
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
        @click="showImportDialog"
      >
        <vue-feather
          :size="icons.size"
          type="upload-cloud"
        />
      </div>
      <div
        id="exportBtn"
        title="Export"
        class="sideItem"
        @click="showExportDialog"
      >
        <vue-feather
          :size="icons.size"
          type="download-cloud"
        />
      </div>
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

</style>
