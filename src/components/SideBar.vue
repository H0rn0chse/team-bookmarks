<script setup>
import { reactive } from "vue";
import SettingsDialog from "@/components/SettingsDialog.vue";

const icons = reactive({
    size: "3em",
    color: "var(--common-font-primary)"
});

function importData () {
    alert("import");
}

function exportData () {
    alert("export");
}

function showAddItemDialog () {
    alert("add");
}

</script>

<template>
    <div class="sideBar d-flex flex-column align-center bg-background-dark">
        <div class="top d-flex flex-column align-center">
                <SettingsDialog
                    title="Settings"
                    class="sideItem"
                />
            <div
                title="Import"
                class="sideItem"
            >
                <vue-feather
                    :size="icons.size"
                    :stroke="icons.color"
                    type="upload-cloud"
                    @click="importData"
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
                    @click="exportData"
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