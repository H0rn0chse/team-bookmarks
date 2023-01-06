<script setup>
import { } from "vue";
import imageUrl from "/assets/favicon_small.png";

</script>

<template>
  <div class="content">
    <img
      :src="imageUrl"
      style="height:8em;padding-bottom: 1em;"
    >
    <h3>Team-Bookmarks</h3>
    <p>Version 0.0.1</p>
    <a href="https://github.com/H0rn0chse/team-bookmarks">Repository</a>
    <a href="https://github.com/H0rn0chse/team-bookmarks/issues">Issues</a>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
