<template>
  <div class="dashboard" v-if="user">
    <user-profile
      @sign-out="emitSignOut2"
      :userId="userIdToDisplay"
    ></user-profile>
    <div class="header-container">
      <h2 class="header-title">My Listings</h2>
      <button
        v-if="isCurrentUser"
        @click="goToManageInventory"
        class="manage-button"
      >
        Manage Inventory
      </button>
    </div>
    <LoadingScreen v-if="loading" />
    <div class="listings">
      <div v-for="listing in listings" :key="listing.id" class="listing-card">
        <img
          :src="listing.imageURL"
          alt="Listing Image"
          class="listing-image"
          @click="goToViewListing(listing)"
        />
        <div class="listing-details">
          <h3>{{ listing.name }}</h3>
          <p>{{ listing.collection }}</p>
        </div>
      </div>
    </div>
    <div class="header-container">
      <h2 class="header-title">My Wishlist</h2>
      <button
        v-if="isCurrentUser"
        @click="goToManageWishlist"
        class="manage-button"
      >
        Manage Wishlist
      </button>
    </div>
    <div class="wishlist">
      <div v-for="item in wishlist" :key="item.id" class="listing-card">
        <img :src="item.imageURL" alt="Item Image" class="listing-image" />
        <div class="listing-details">
          <h3>{{ item.name }}</h3>
          <p>{{ item.collection }}</p>
        </div>
        <!-- Add more wishlist details as needed -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { auth } from "@/firebase.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import UserProfile from "../components/UserProfile.vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "../components/LoadingScreen.vue";

export default {
  name: "Dashboard",
  components: { UserProfile, LoadingScreen },
  props: {
    userId: String,
  },
  setup(props) {
    const router = useRouter();
    const user = ref(null);
    const listings = ref([]);
    const wishlist = ref([]);
    const loading = ref(false);

    const userIdToDisplay = computed(() => {
      return props.userId || user.value?.uid;
    });

    const isCurrentUser = computed(() => {
      return !props.userId || props.userId === user.value?.uid;
    });

    // Listen for authentication state changes
    auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        user.value = {
          uid: userAuth.uid,
          displayName: userAuth.displayName,
          photoURL: userAuth.photoURL,
          email: userAuth.email,
        };
        // Fetch data only if userId prop is not provided
        if (!props.userId) {
          fetchData(
            "listings",
            (data) =>
              (listings.value = data.filter(
                (doc) => doc.status !== "Unavailable"
              )),
            userAuth.uid
          );
          fetchData(
            "wishlist",
            (data) =>
              (wishlist.value = data.filter(
                (doc) => doc.status !== "Unavailable"
              )),
            userAuth.uid
          );
        }
      } else {
        user.value = null;
      }
    });

    const firestore = getFirestore();
    const goToViewListing = (listing) => {
      if (!props.userId) {
        router.push({
          name: "ViewListing",
          params: { userId: getAuth().currentUser?.uid, listingId: listing.id },
        });
      } else {
        router.push({
          name: "ViewListing",
          params: { userId: props.userId, listingId: listing.id },
        });
      }
    };
    // Function to fetch data based on UID
    const fetchData = async (dataType, setData, uid) => {
      loading.value = true;
      const dataRef = collection(firestore, "users", uid, dataType);
      const snapshot = await getDocs(dataRef);
      setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      loading.value = false;
    };

    // Reactively fetch data when props.userId changes
    watch(
      () => props.userId,
      (newUserId) => {
        if (newUserId) {
          fetchData(
            "listings",
            (data) =>
              (listings.value = data.filter(
                (doc) => doc.status !== "Unavailable"
              )),
            newUserId
          );
          fetchData(
            "wishlist",
            (data) =>
              (wishlist.value = data.filter(
                (doc) => doc.status !== "Unavailable"
              )),
            newUserId
          );
        }
      },
      { immediate: true }
    );

    return {
      user,
      listings,
      wishlist,
      userIdToDisplay,
      isCurrentUser,
      goToViewListing,
      loading,
    };
  },
  methods: {
    goToManageInventory() {
      this.$router.push({ name: "ManageInventory" });
    },
    goToManageWishlist() {
      this.$router.push({ name: "ManageWishlist" });
    },
    emitSignOut2() {
      this.$emit("sign-out");
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
  padding: 15px;
}

.header-title {
  margin: 0; /* Removes default margin from h2 */
  font-family: "Oswald", sans-serif;
  font-size: 24px; /* Adjust based on your preference */
  padding: 50px;
}

.listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 5vw;
  white-space: nowrap; /* Prevent wrapping */
}

.listing-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  height: 24vw;
  width: 14vw;
}

.listing-details {
  padding: 10px;
  text-align: center;
  height: 40%;
}

.listing-details h3 {
  /* font-size: 1rem; */
  font-size: calc(1vw + 0.4vh);
  margin-top: 0.2vw;
  margin-bottom: 0.2vw;
}

.listing-details p {
  /* font-size: 0.8rem; */
  font-size: calc(0.8vw + 0.32vh);
  margin-top: 0.2vw;
  margin-bottom: 0.2vw;
}

.listing-image {
  width: 100%;
  height: 80%; /* Adjust the percentage based on your design */
  object-fit: cover;
  border-radius: 4px; /* Optional: Adds slight rounding to the image corners */
  margin-bottom: 0.1vw;
  max-width: 100%;
}

.listing-card:hover {
  transform: scale(1.03);
  transition: transform 0.3s ease;
  cursor: pointer;
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 5vw;
}
</style>
