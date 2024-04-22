<template>
  <div id="app">
    <header class="navbar">
      <router-link to="/" class="poptrade-link">POPTRADE</router-link>
      <router-link to="/marketplace">Marketplace</router-link>
      <router-link to="/offers">Offers</router-link>
      <router-link to="/dashboard" v-if="currentUser">{{
        "Hi, " + currentUser.username
      }}</router-link>
      <router-link to="/login" v-else>Register/Login</router-link>
    </header>

    <main>
      <router-view @sign-out="signOut" :key="$route.fullPath" />
    </main>

    <footer class="footer">
      <p>Contact our support team anytime, anywhere</p>
      <p>(+65) 60000000</p>
      <p>support@poptrade.com</p>
    </footer>
  </div>
</template>

// App.vue
<script>
import { ref, onUnmounted, provide } from "vue";
import { auth, db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default {
  name: "App",
  setup() {
    const currentUser = ref(null);

    const fetchUserData = (uid) => {
      const userDocRef = doc(db, "users", uid);
      const unsubscribe = onSnapshot(
        userDocRef,
        (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            currentUser.value = {
              uid: uid,
              username: userData.username,
              fullname: `${userData.firstName} ${userData.lastName}`,
              reviews: userData.reviews,
              phoneNo: userData.phoneNumber,
              telegram: userData.telegramHandle,
              email: userData.email,
            };
          } else {
            currentUser.value = null; // Handle case where doc might not exist
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
        }
      );
      return unsubscribe; // Return the function to unsubscribe when the component unmounts
    };

    let unsubscribeAuth = null;
    let unsubscribeUserData = null;
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (unsubscribeUserData) {
          unsubscribeUserData(); // Unsubscribe previous listener if exists
        }
        unsubscribeUserData = fetchUserData(user.uid); // Set up a new listener
      } else {
        currentUser.value = null;
        if (unsubscribeUserData) {
          unsubscribeUserData();
        }
      }
    });

    provide("currentUser", currentUser);

    onUnmounted(() => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeUserData) unsubscribeUserData();
    });

    return {
      currentUser,
    };
  },
  methods: {
    signOut() {
      auth.signOut().then(() => {
        this.currentUser.value = null;
        this.$router.push("/login");
      });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap");
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8;
  height: 50px; /* Added height */
}

.navbar a {
  margin: 0 20px;
  text-decoration: none;
  color: black;
  font-weight: 500;
  font-size: 1.1em;
}

.poptrade-link {
  /* Added class for Poptrade */
  font-family: "Oswald", sans-serif;
  color: red !important;
  font-size: 1.75em !important;
  font-weight: 900 !important;
}

.navbar a.router-link-exact-active,
.navbar a:hover {
  text-decoration: underline;
}

main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  text-align: center;
}

.router-view {
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.footer {
  text-align: center;
  padding: 1rem;
  border-top: 1px solid #ccc;
  background-color: #f8f8f8;
}

/* Responsive styles for smaller screens */
@media (max-width: 768px) {
  .navbar {
    padding: 10px 2%;
  }

  .navbar a {
    margin: 0 10px;
  }

  main {
    padding: 1rem;
  }
}
</style>
