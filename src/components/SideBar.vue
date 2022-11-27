<script setup>
import { reactive } from "vue";
import { getColor } from "@/js/utils";
import SettingsDialog from "@/components/SettingsDialog.vue";

const icons = reactive({
    size: "3em",
    color: getColor("--common-font-primary")
});

const settings = reactive({
    showDialog: false
});

function toggleSettingsDialog () {
    settings.showDialog = !settings.showDialog;
}

</script>

<template>
    <div
        class="sideBar d-flex flex-column align-center bg-background-dark"
    >
        <div
            class="top d-flex flex-column align-center"
        >

                <SettingsDialog
                    :show="settings.showDialog"
                    @close="toggleSettingsDialog"
                    title="Settings"
                    class="sideItem"
                >

                </SettingsDialog>
            <div
                title="Import"
                class="sideItem"
            >
                <vue-feather
                    :size="icons.size"
                    :stroke="icons.color"
                    type="upload-cloud"
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
                />
            </div>
        </div>
        <div
            class="bottom d-flex flex-column align-center"
        >
            <div
                title="Add new Bookmark"
                class="sideItem"
            >
                <vue-feather
                    :size="icons.size"
                    :stroke="icons.color"
                    type="plus-square"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.sideBar {
    justify-content: space-between;
    width: 5em;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
}

.sideBar > .top {
    margin-top: 1em;
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