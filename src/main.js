/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Github-Corner
import "github-corner-element";

// Components
import App from "@/App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

// Stores
import { initialize as initializeStores } from "@/stores/setup";

// global css
import "@/styles/main.css";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");

initializeStores();
