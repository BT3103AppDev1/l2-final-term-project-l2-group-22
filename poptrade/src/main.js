import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

onAuthStateChanged(auth, () => {
  // Initialize Vue app inside the onAuthStateChanged callback
  createApp(App).use(router).mount("#app");
});
