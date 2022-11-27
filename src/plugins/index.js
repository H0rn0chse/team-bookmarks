/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import VueFeather from "vue-feather";
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import pinia from "./pinia";

export function registerPlugins (app) {
    loadFonts();
    app.use(vuetify);
    app.use(pinia);
    app.component(VueFeather.name, VueFeather);
}
