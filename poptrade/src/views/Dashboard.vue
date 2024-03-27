<template>
  <div class="dashboard" v-if="user">
    <user-profile :user="user"></user-profile>
    <button @click="goToManageInventory">Manage Inventory</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import firebase from "@/uifire.js";
import UserProfile from "../components/UserProfile.vue";

export default {
  name: "Dashboard",
  components: {
    UserProfile, // This is the correct usage, assuming UserProfile.vue is correctly exported
  },

  setup() {
    const user = ref(null);

    onMounted(() => {
      firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          // Assuming firebaseUser has the properties you need
          user.value = {
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            email: firebaseUser.email, // Added email as an example
          };
          // Optionally, fetch additional profile data from Firestore
        } else {
          user.value = null;
        }
      });
    });

    return { user };
  },
  methods: {
    goToManageInventory() {
      // Programmatic navigation to ViewListing.vue
      this.$router.push({ name: "ManageInventory" }); //
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");

.user-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Oswald", sans-serif;
  width: 100%;
}

.profile-container {
  padding: 2em;
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1em;
}

h1,
h2 {
  font-family: "Oswald", sans-serif;
  color: #333;
}

p {
  font-size: 1em;
  color: #666;
  font-family: "Oswald", sans-serif;
}
</style>
