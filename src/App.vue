<script setup>
import SearchBar from "@/components/SearchBar.vue";
import SideBar from "@/components/SideBar.vue";
import MainContent from "@/components/MainContent.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import EditItemDialog from "@/components/EditItemDialog.vue";
import AddItemDialog from "@/components/AddItemDialog.vue";
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
      <EditItemDialog />
      <AddItemDialog />
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
    grid-template-rows: 10em auto;
    grid-template-areas:
    "sideBar searchBar"
    "sideBar main";
}
</style>
