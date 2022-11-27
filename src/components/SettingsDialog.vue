<script setup>
import { reactive } from "vue";
import { getColor } from "@/js/utils";

const state = reactive({
    show: false
});

const icons = reactive({
    size: "3em",
    color: getColor("--common-font-primary")
});

</script>

<template>
    <v-dialog
        v-model="state.show"
        transition="dialog-top-transition"
    >
        <template v-slot:activator="{ props }">
            <vue-feather
                :size="icons.size"
                :stroke="icons.color"
                type="settings"
                v-bind="props"
                class="icon"
            />
        </template>
        <v-card>
            <v-card-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="primary"
                    block
                    @click="state.show = false"
                >
                    Close Dialog
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<style scoped>
.icon {
    cursor: pointer;
}
</style>