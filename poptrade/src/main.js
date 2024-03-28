import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Adjusted import

onAuthStateChanged(auth, () => {
  // Initialize Vue app inside the onAuthStateChanged callback
  createApp(App).use(router).mount("#app");
});
