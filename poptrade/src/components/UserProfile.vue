<template>
  <div class="user-profile" v-if="user">
    <div class="profile-container">
      <h1>User Profile</h1>
      <img :src="user.photoURL" alt="Profile Image" class="profile-image" />
      <h2>{{ user.displayName }}</h2>
      <p>Email: {{ user.email }}</p>
      <!-- Additional user details can be added here -->
    </div>
  </div>
  <div class="login" v-else>
    <div class="login-container">
      <p>You must be logged in to view this page.</p>
      <!-- You might want to add a login button here -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import firebase from "@/uifire.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseApp from "@/firebase";

export default {
  name: "UserProfile",
  setup() {
    const user = ref(null);
    const firestore = getFirestore(firebaseApp);

    onMounted(() => {
      firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          // User is signed in
          user.value = {
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            email: firebaseUser.email,
          };

          // Fetch additional profile data from Firestore
          const userDocRef = doc(firestore, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            // Merge the additional data with the authentication data
            user.value = { ...user.value, ...userDoc.data() };
          }
        } else {
          // User is signed out
          user.value = null;
        }
      });
    });

    return { user };
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
