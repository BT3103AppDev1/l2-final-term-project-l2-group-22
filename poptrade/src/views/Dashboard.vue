<template>
  <div class="dashboard" v-if="user">
    <user-profile @sign-out="emitSignOut2" :user="user"></user-profile>
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
    <div class="header-container">
      <h2 class="header-title">My Wishlist</h2>
      <button @click="goToManageWishlist" class="manage-button">
        Manage Wishlist
      </button>
    </div>
    <div class="wishlist">
      <div v-for="item in wishlist" :key="item.id" class="listing-card">
        <img :src="item.imageURL" alt="Item Image" class="listing-image" />
        <h3>{{ item.name }}</h3>
        <!-- Add more wishlist details as needed -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { firebase, auth } from "@/firebase.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import UserProfile from "../components/UserProfile.vue";

export default {
  name: "Dashboard",
  components: {
    UserProfile,
  },

  setup() {
    const user = ref(null);
    const listings = ref([]);
    const wishlist = ref([]);
    const firestore = getFirestore();

    // Unified fetchData function for fetching either listings or wishlist
    const fetchData = async (dataType, setData) => {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        user.value = {
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          email: firebaseUser.email,
        };

        const dataRef = collection(
          firestore,
          "users",
          firebaseUser.uid,
          dataType
        );
        const snapshot = await getDocs(dataRef);
        setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    };

    onMounted(() => {
      fetchData("listings", (data) => (listings.value = data));
      fetchData("wishlist", (data) => (wishlist.value = data));
    });

    return { user, listings, wishlist };
  },
  methods: {
    goToManageInventory() {
      this.$router.push({ name: "ManageInventory" });
    },
    goToManageWishlist() {
      this.$router.push({ name: "ManageWishlist" });
    },
    emitSignOut2() {
        this.$emit('sign-out');
    },
    
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

.signout-container {
  display: flex;
  justify-content: center;
  align-items: center; /* Aligns items vertically in the center */
  padding:15px
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
  background-color: #ff4d4d;
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
  background-color: #e60000;
}
.wishlist {
  display: flex;
  flex-wrap: nowrap; /* Prevent wrapping to a new line */
  overflow-x: auto; /* Allows horizontal scrolling if items overflow */
  gap: 20px; /* Creates consistent space between the wishlist items */
}

/* Additional styles can go here */
</style>
