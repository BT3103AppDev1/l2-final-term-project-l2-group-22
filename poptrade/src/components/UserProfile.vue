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
  display: flex;
  align-items: center;
  gap: 20px; /* Space between elements */
  padding: 1em;
  text-align: left;
  max-width: 600px; /* Adjust based on your preference */
  border: 1px solid #ccc; /* Optional: adds a border around the profile */
  border-radius: 8px; /* Optional: rounds the corners of the border */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: adds a subtle shadow */
}

.profile-image {
  width: 80px; /* Smaller profile image */
  height: 80px; /* Maintain aspect ratio */
  border-radius: 50%;
  object-fit: cover; /* Ensures the image covers the space without stretching */
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 4px; /* Space between text elements */
}

h1,
h2,
p {
  margin: 0; /* Removes default margins */
  font-family: "Oswald", sans-serif;
}

h1 {
  font-size: 1.5rem; /* Smaller heading */
  color: #333;
}

h2 {
  font-size: 1.25rem; /* Smaller subheading */
}

p {
  font-size: 0.9rem; /* Smaller paragraph text */
  color: #666;
}
</style>
