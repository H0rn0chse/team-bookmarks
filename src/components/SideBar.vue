<script setup>
import { readonly } from "vue";
import { useDialogStore } from "@/stores/dialog";
import { importData, exportData } from "@/js/ImportExport";

const dialogStore = useDialogStore();

const icons = readonly({
  size: "3em",
  color: "var(--common-font-primary)"
});

async function importDataLocal () {
  console.log ("starting import");
  await importData();
  console.log ("import done");
}

async function exportDataLocal () {
  console.log("starting export");
  await exportData();
  console.log("export done");
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
        :stroke="icons.color"
        type="settings"
        title="Settings"
        class="sideItem"
        @click="dialogStore.showSettings"
      />
      <div
        title="Import"
        class="sideItem"
      >
        <vue-feather
          :size="icons.size"
          :stroke="icons.color"
          type="upload-cloud"
          @click="importDataLocal"
        />
      </div>
      <div
        title="Export"
        class="sideItem"
      >
        <vue-feather
          :size="icons.size"
          :stroke="icons.color"
          type="download-cloud"
          @click="exportDataLocal"
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
          :stroke="icons.color"
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
