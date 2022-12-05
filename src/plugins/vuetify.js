/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          "font-primary": "#dcddde",
          "font-secondary": "#A0A3A7",
          "font-dark": "#62666A",
          "input-border": "#ced4da",
          background: "#36393f",
          "background-light": "#4B4F58",
          "background-dark": "#26282C",
          surface: "#dcddde",
          primary: "#0074d9",
          "primary-light": "#2f8ada",
          //secondary: "#ff0000",
          //success: "#ff0000",
          warning: "#FF8000",
          error: "#ff0000",
          //info: "#ff0000",
          favorite: "#FFCC33",
        }
      }
    }
  },
});
