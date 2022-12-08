<script setup>
import { readonly, computed, reactive, ref, defineExpose } from "vue";
import { useDialogStore } from "@/stores/dialog";
import { useMainStore } from "@/stores/main";

const dialogStore = useDialogStore();
const mainStore = useMainStore();

const combobox = readonly({
  delimiters: [" ", ","],
  menuProps: {
    closeOnClick: false,
    closeOnContentClick: false,
    disableKeys: true,
    openOnClick: false,
    maxHeight: 200
  }
});

const keywordSuggestions = computed({
  get () {
    return mainStore.availableKeywords
      // workaround until https://github.com/vuetifyjs/vuetify/issues/16226 is fixed
      .filter(keyword => !dialogStore.itemDetails.keywords.includes(keyword));
  }
});

const form = ref(null);
const formValidation = reactive({
  valid: true,
  titleRules: [
    value => !!value.trim() || "Title is required"
  ],
  linkRules: [
    value => !!value.trim() || "Link is required"
  ],
});

async function validate () {
  const { valid } = await form.value.validate();

  if (valid) {
    alert("Form is valid");
  }
  return valid;
}
defineExpose({ validate });
</script>

<template>
  <v-form
    ref="form"
    v-model="formValidation.valid"
    lazy-validation
  >
    <v-checkbox
      v-model="dialogStore.itemDetails.favorite"
      label="Mark as Favorite"
      color="font-dark"
    />
    <v-text-field
      v-model="dialogStore.itemDetails.title"
      :rules="formValidation.titleRules"
      label="Title"
    />
    <v-text-field
      v-model="dialogStore.itemDetails.src"
      :rules="formValidation.linkRules"
      label="Link"
    />
    <v-text-field
      v-model="dialogStore.itemDetails.description"
      label="Description"
    />
    <!-- TODO Group -->
    <v-combobox
      v-model="dialogStore.itemDetails.keywords"
      :items="keywordSuggestions"
      :delimiters="combobox.delimiters"
      label="Enter Keywords"
      :menu-props="combobox.menuProps"
      hide-selected
      closable-chips
      multiple
      chips
      clearable
    />
  </v-form>
</template>


<style scoped>
</style>
