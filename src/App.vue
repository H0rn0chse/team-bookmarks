<script setup>
import SearchBar from "@/components/SearchBar.vue";
import SideBar from "@/components/SideBar.vue";
import MainContent from "@/components/MainContent.vue";
</script>

<template>
    <v-app theme="dark" id="app" overflow-hidden>
        <v-main class="d-flex flex-row">
            <SideBar />
            <div style="width:100%" class="d-flex flex-column align-center">
                <SearchBar />
                <MainContent />
            </div>
        </v-main>
    </v-app>
</template>

<style>

#app {
    width: 100vw;
    height: 100vh;
}
</style>
