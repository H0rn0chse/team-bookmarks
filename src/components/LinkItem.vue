<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  tag: {
    type: String,
    default: "div",
    required: false
  },
  backgroundColor: {
    type: String,
    default: "var(--common-bg-light)",
    required: false
  },
  fontColor: {
    type: String,
    default: "var(--common-font-primary)",
    required: false
  },
  hidden: {
    type: Boolean,
    default: false,
    required: false,
  },
  src: {
    type: String,
    default: "javascript:undefined",
    required: false
  },
  title: {
    type: String,
    default: "Default Title",
    required: false
  },
  isFavorite: {
    type: Boolean,
    default: false,
    required: false
  }
});

const emit = defineEmits([
  "favoriteClick",
  "moreClick"
]);

const linkTarget = computed(() => {
  if (props.src && !props.src.startsWith("javascript:")) {
    return "_blank";
  }
  return "";
});

const containerStyles = computed(() => {
  return {
    backgroundColor: props.backgroundColor,
    color: props.fontColor || "var(--common-font-primary)",
    borderColor: props.fontColor || "var(--common-font-primary)",
    display: props.hidden ? "none !important" : ""
  };
});

const iconSize = ref("1.5em");

const favorite = computed(() => {
  return {
    stroke: props.isFavorite ? "var(--common-favorite)" : (props.fontColor || "var(--common-font-primary)"),
    //stroke: props.fontColor,
    fill: props.isFavorite ? "var(--common-favorite)" : "none",
  };
});

</script>

<template>
  <v-lazy
    :tag="props.tag"
    class="item"
    :style="containerStyles"
  >
    <div
      class="itemContainer flexContainer"
      @click="emit('moreClick')"
    >
      <div class="start shrinking flexContainer">
        <a
          class="link shrinking flexContainer"
          :href="props.src"
          :target="linkTarget"
        >
          <span class="linkText shrinking">
            {{ props.title }}
          </span>
          <vue-feather
            title="Open in New Tab"
            class="linkIcon growing"
            size="1em"
            type="external-link"
          />
        </a>
        <vue-feather
          title="Toggle Favorite"
          class="itemIcon growing"
          :size="iconSize"
          :stroke="favorite.stroke"
          :fill="favorite.fill"
          type="star"
          @click="emit('favoriteClick')"
        />
      </div>
      <div class="end growing flexContainer">
        <vue-feather
          title="Show Details"
          class="itemIcon"
          :size="iconSize"
          type="more-horizontal"
          @click="emit('moreClick')"
        />
      </div>
    </div>
  </v-lazy>
</template>

<style scoped>
a, a:visited {
  color: inherit;
}

.itemIcon {
  margin-left: 1em;
  cursor: pointer;
}

.item {
  display: block;
  max-width: 30em;
  min-height: calc(2.5em + 4px);
  min-width: 5em;
  border-color: var(--common-font-secondary);
  border-width: 2px;
  border-style: solid;
  border-radius: 10px;
  margin: 1em;
  padding: 0.5em;
}

.item:hover {
  filter: brightness(130%);
}

@media only screen and (min-width: 960px) {
  .item {
    width: 30em;
  }
}

.flexContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.growing {
  flex-grow: 1;
  flex-shrink: 0;
}

.shrinking {
  flex-shrink: 1;
  min-width: 0;
}

.start {
  justify-content: flex-start;
}

.linkText {
  justify-content: flex-start;
  overflow: hidden;
}

.linkIcon {
  margin-left: 0.2em;
}

.end {
  justify-content: flex-end;
}

</style>
