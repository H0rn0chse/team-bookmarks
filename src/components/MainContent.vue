<script setup>
import { reactive } from "vue";
import { getColor } from "@/js/utils";

const icons = reactive({
    size: "1.5em",
    color: getColor("--common-font-primary")
});

const state = reactive({
    items: new Array(80)
        .fill({})
        .map((item, index) => {
            return {
                id: index,
                text: `Item No. ${index.toString().padStart(2, "0")}`,
                href: "https://sap.com"
            };
        })
});
function highlightBookmark (evt) {
    evt.preventDefault();
    alert("highlight");
}
function editBookmark (evt) {
    evt.preventDefault();
    alert("edit");
}
function hideBookmark (evt) {
    evt.preventDefault();
    alert("hide");
}
function deleteBookmark (evt) {
    evt.preventDefault();
    alert("delete");
}
</script>

<template>
    <div class="cont d-flex">
        <ul v-for="item in state.items" :key="item.id">
            <a
                class="item d-flex align-center"
                :href="item.href"
                target="_blank"
            >
                <span>{{ item.text }}</span>
                <vue-feather
                    class="itemIcon"
                    :size="icons.size"
                    :stroke="icons.color"
                    type="star"
                    @click="highlightBookmark"
                />
                <vue-feather
                    class="itemIcon"
                    :size="icons.size"
                    :stroke="icons.color"
                    type="edit-2"
                    @click="editBookmark"
                />
                <span class="end d-flex align-center">
                    <vue-feather
                        class="itemIcon"
                        :size="icons.size"
                        :stroke="icons.color"
                        type="eye-off"
                        @click="hideBookmark"
                    />
                    <vue-feather
                        class="itemIcon"
                        :size="icons.size"
                        :stroke="icons.color"
                        type="trash-2"
                        @click="deleteBookmark"
                    />
                </span>
            </a>
        </ul>
    </div>
</template>

<style scoped>
.end {
    flex-grow: 1;
    justify-content: flex-end;
}
.itemIcon {
    padding-left: 1em;
}
.end > .itemIcon {
    padding-left: 0.5em;
}
.item {
    max-width: 30em;
    background-color: var(--common-bg-light);
    border-color: var(--common-input-border);
    border-width: 2px;
    border-style: solid;
    border-radius: 5px;
    margin: 1em;
    padding: 0.5em;
}

@media only screen and (min-width: 960px) {
  .item {
    width: 30em;
  }
}

.cont {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 1em;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
}

@media only screen and (min-width: 1264px) {
  .cont {
    padding: 4em;
  }
}

</style>