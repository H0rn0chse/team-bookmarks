<script setup>
import { ref, provide } from "vue";
import SearchBar from "@/components/SearchBar.vue";
import SideBar from "@/components/SideBar.vue";
import MainContent from "@/components/MainContent.vue";
import SettingsDialog from "@/components/dialogs/SettingsDialog.vue";
import ImportDialog from "@/components/dialogs/ImportDialog.vue";
import ExportDialog from "@/components/dialogs/ExportDialog.vue";
import EditItemDialog from "@/components/dialogs/EditItemDialog.vue";
import AddItemDialog from "@/components/dialogs/AddItemDialog.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import ErrorDialog from "@/components/dialogs/ErrorDialog.vue";

const confirm = ref(null);
provide("confirm", (message) => {
  return confirm.value.show(message);
});

const error = ref(null);
provide("showError", (message) => {
  return error.value.show(message);
});

addEventListener("keydown", (evt) => {
  const blockedKeys = ["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
  if(blockedKeys.includes(evt.code)) {
    evt.preventDefault();
  }
}, false);

</script>

<template>
  <v-app
    id="app"
    theme="dark"
    overflow-hidden
  >
    <v-main>
      <div id="gridContainer">
        <SideBar style="gridArea:sideBar;" />
        <SearchBar style="gridArea:searchBar;" />
        <MainContent style="gridArea:main;" />
      </div>
      <SettingsDialog />
      <ImportDialog />
      <ExportDialog />
      <EditItemDialog />
      <AddItemDialog />
      <ConfirmDialog ref="confirm" />
      <ErrorDialog ref="error" />
    </v-main>
  </v-app>
</template>

<style scoped>
#app, #gridContainer {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

#gridContainer {
  display: grid;
  grid-template-columns: 5em auto;
  grid-template-rows: min-content auto;
  grid-template-areas:
  "sideBar searchBar"
  "sideBar main";
}
</style>
