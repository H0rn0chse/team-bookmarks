<script setup>
import { reactive } from "vue";

const data = reactive({
  display: "none"
});
function show (message) {
  data.display = "";
  return new Promise((resolve, reject) =>{
    if (globalThis.confirm(message)) {
      resolve(true);
    }
    resolve(false);
    //todo
    data.display = "none";
  });
}

defineExpose({
  show
});
</script>

<template>
  <div
    ref="container"
    :style="{ background:'red', display:data.display, position:'absolute', top:0, left:0 }"
  >
    Test123
  </div>
</template>


<style scoped>
</style>
