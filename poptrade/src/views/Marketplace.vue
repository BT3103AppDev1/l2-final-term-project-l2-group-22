<template>
  <div class="marketplace">
    <h1>Marketplace</h1>
    <button @click="showModal = true" class="search-button">
      Search Listings
    </button>
    <Modal
      :show="showModal"
      @close="showModal = false"
      @searchSubmitted="handleSearchSubmitted"
    />
    <h2>Newest Listings</h2>
    <div class="listings-row">
      <div
        v-for="listing in listings"
        :key="listing.id"
        class="listing"
        @click="goToViewListing(listing)"
      >
        <img
          :src="listing.imageURL"
          :alt="listing.name"
          class="listing-image"
        />
        <p>{{ listing.name }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Modal from "../components/Modal.vue";

export default {
  name: "Marketplace",
  components: {
    Modal,
  },
  setup() {
    const showModal = ref(false);
    const listings = ref([]);
    const firestore = getFirestore();
    const router = useRouter();
    const auth = getAuth();

    const fetchListings = async () => {
      const fetchedListings = ref([]);
      let currentUserUid = auth.currentUser?.uid;

      if (!currentUserUid) {
        console.log("Waiting for auth state change...");
        currentUserUid = await new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            resolve(user?.uid);
          });
        });
        console.log("Auth state changed:", currentUserUid);
      }

      if (!currentUserUid) {
        console.log("No user signed in.");
        return fetchedListings;
      }

      const usersSnapshot = await getDocs(collection(firestore, "users"));
      console.log(`Found ${usersSnapshot.docs.length} users`);

      for (const userDoc of usersSnapshot.docs) {
        if (fetchedListings.value.length >= 10) break;
        if (userDoc.id === currentUserUid) continue;

        const listingsQuery = query(
          collection(firestore, "users", userDoc.id, "listings"),
          where("status", "==", "Available")
        );

        const listingsSnapshot = await getDocs(listingsQuery);

        listingsSnapshot.docs
          .slice(0, 10 - fetchedListings.value.length)
          .forEach((doc) => {
            fetchedListings.value.push({
              id: doc.id,
              userId: userDoc.id,
              ...doc.data(),
            });
          });
      }

      console.log("Final listings:", fetchedListings.value);
      return fetchedListings;
    };

    onMounted(async () => {
      listings.value = (await fetchListings()).value;
    });

    const goToViewListing = (listing) => {
      router.push({
        name: "ViewListing",
        params: { userId: listing.userId, listingId: listing.id },
      });
    };

    function handleSearchSubmitted(searchParams) {
      router.push({ name: "SearchResults", query: searchParams });
    }
    return {
      listings,
      showModal,
      goToViewListing,
      handleSearchSubmitted,
    };
  },
};
</script>

<style scoped>
/* Header styles */
.marketplace h1 {
  color: red;
  text-align: center;
  font-size: 2em;
  margin: 0.5em 0;
  margin-top: 0; /* Removes top margin */
  padding-top: 20px;
}
.marketplace h2 {
  margin-top: 80px; /* Reduces space above the h2 if necessary */
  /* Add other styles as needed */
}
/* Adjusted button styles to class listings */
.listing {
  cursor: pointer;
}

.listing img {
  max-width: 100%;
  border-radius: 5px;
}

/* Layout styles for listings */
.listings-row {
  display: flex;
  flex-wrap: nowrap; /* Prevent wrapping by default */
  overflow-x: auto; /* Enable horizontal scrolling */
  gap: 10px; /* Spacing between listings */
  padding: 10px 0;
}

.listing {
  flex: 0 0 auto; /* Do not grow, do not shrink, and do not allow flex-basis to be auto-sized */
  margin: 0 5px; /* Horizontal margin for spacing */
  width: 180px; /* Fixed width */
  text-align: center; /* Center the text within each listing */
}

/* Responsive design adjustments */
@media (max-width: 768px) {
  .listing {
    width: 120px; /* Smaller width on small screens */
  }
}

/* Global layout adjustments */
.marketplace {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.search-button {
  padding: 10px 20px; /* Adjust padding to suit your design */
  background-color: #ff4d4d; /* A vibrant red; change as needed */
  color: white; /* Text color */
  border: none; /* Remove default border */
  border-radius: 15px; /* More pronounced rounded corners for a pill shape */
  font-size: 16px; /* Font size */
  cursor: pointer; /* Change mouse cursor on hover */
  transition: background-color 0.3s ease; /* Smooth transition for hover effect */
}

.search-button:hover {
  background-color: #e60000; /* A slightly darker shade of red for hover effect */
}

.search-button:focus {
  outline: none; /* Remove outline on focus for a clean look */
}
</style>
