<template>
  <div class="dashboard" v-if="user">
    <user-profile :user="user"></user-profile>
    <button @click="emitSignOut">Sign Out</button>
    <div class="header-container">
      <h2 class="header-title">My Listings</h2>
      <button @click="goToManageInventory" class="manage-button">
        Manage Inventory
      </button>
    </div>
    <div class="listings">
      <div v-for="listing in listings" :key="listing.id" class="listing-card">
        <img
          :src="listing.imageURL"
          alt="Listing Image"
          class="listing-image"
        />
        <h3>{{ listing.name }}</h3>
        <!-- Add more listing details as needed -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
<<<<<<< Updated upstream
import { firebase, auth } from '@/firebase.js';

=======
import { firebase, auth } from "@/firebase.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";
>>>>>>> Stashed changes
import UserProfile from "../components/UserProfile.vue";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export default {
  name: "Dashboard",
  components: {
    UserProfile,
  },

  data() {
      return {
        user: {},
      };
    },
    created() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.user = user;
        }
      });
    },

  setup() {
    const user = ref(null);
    const listings = ref([]);

    const firestore = getFirestore();

    const fetchListings = async () => {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        user.value = {
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          email: firebaseUser.email,
        };
        const listingsRef = collection(
          firestore,
          "users",
          firebaseUser.uid,
          "listings"
        );
        const snapshot = await getDocs(listingsRef);
        listings.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } else {
        user.value = null;
      }
    };

    onMounted(fetchListings);

    return { user, listings };
  },
  
  methods: {
    goToManageInventory() {
      this.$router.push({ name: "ManageInventory" });
    },
<<<<<<< Updated upstream
=======
    goToManageWishlist() {
      this.$router.push({ name: "ManageWishlist" });
    },
    emitSignOut() {
        this.$emit('sign-out');
    },
>>>>>>> Stashed changes
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");

.dashboard {
  padding: 20px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Aligns items vertically in the center */
}

.header-title {
  margin: 0; /* Removes default margin from h2 */
  font-family: "Oswald", sans-serif;
  font-size: 24px; /* Adjust based on your preference */
  padding: 50px;
}

.listings {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px; /* Creates consistent space between the listings */
}

.listing-card {
  width: 180px; /* Adjust the width as needed */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  margin-bottom: 20px; /* Adjust or remove if gap property is sufficient */
}

.listing-image {
  width: 100%;
  height: auto;
  border-radius: 4px; /* Optional: Adds slight rounding to the image corners */
  margin-bottom: 10px;
}

.manage-button,
.button {
  /* This selector targets both your manage button and any other button */
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-family: "Oswald", sans-serif; /* Oswald font for buttons */
}

.manage-button:hover,
.button:hover {
  /* Hover effects for both manage and other buttons */
  background-color: #45a049;
}

/* Additional styles can go here */
</style>
