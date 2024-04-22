<template>
  <div class="marketplace">
    <h1>Marketplace</h1>
    <button @click="showModal = true" class="search-button">
      Search Listings
    </button>
    <Modal
      :show="showModal"
      @close="showModal = false"
      @searchSubmitted="goToSearchResults"
    />
    <LoadingScreen v-if="loading" />
    <h2>Newest Listings</h2>
    <div class="listings-row">
      <div
        v-for="listing in listings"
        :key="listing.id"
        class="listing-card"
        @click="goToViewListing(listing)"
      >
        <img
          :src="listing.imageURL"
          :alt="listing.name"
          class="listing-image"
        />
        <div class="listing-details">
          <h3>{{ listing.name }}</h3>
          <p>{{ listing.collection }}</p>
        </div>
      </div>
    </div>

    <h2>Listings from Top Traders</h2>
    <div class="listings-row">
      <div
        v-for="listing in listingsTT"
        :key="listing.id"
        class="listing-card"
        @click="goToViewListing(listing)"
      >
        <img
          :src="listing.imageURL"
          :alt="listing.name"
          class="listing-image"
        />
        <div class="listing-details">
          <h3>{{ listing.name }}</h3>
          <p>{{ listing.collection }}</p>
        </div>
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
import LoadingScreen from "../components/LoadingScreen.vue";

export default {
  name: "Marketplace",
  components: {
    Modal,
    LoadingScreen,
  },
  setup() {
    const showModal = ref(false);
    const listings = ref([]);
    const firestore = getFirestore();
    const router = useRouter();
    const auth = getAuth();
    const listingsTT = ref([]);
    const loading = ref(false);

    const fetchListings = async () => {
      loading.value = true;
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
        if (fetchedListings.value.length >= 5) break;
        if (userDoc.id === currentUserUid) continue;

        const listingsQuery = query(
          collection(firestore, "users", userDoc.id, "listings"),
          where("status", "==", "Available")
        );

        const listingsSnapshot = await getDocs(listingsQuery);

        listingsSnapshot.docs
          .slice(0, 5 - fetchedListings.value.length)
          .forEach((doc) => {
            fetchedListings.value.push({
              id: doc.id,
              userId: userDoc.id,
              ...doc.data(),
            });
          });
      }

      console.log("Final listings:", fetchedListings.value);
      loading.value = false;
      return fetchedListings;
    };

    const fetchListingsTT = async () => {
      const fetchedListingsTT = ref([]);
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
        return fetchedListingsTT;
      }

      const usersSnapshot = await getDocs(collection(firestore, "users"));
      console.log(`Found ${usersSnapshot.docs.length} users`);

      function calculateAverage(array) {
        // Check if the array is empty
        if (array.length === 0) {
          return 0; // Return 0 for an empty array
        }

        // Calculate the sum of all elements in the array
        const sum = array.reduce((acc, currentValue) => acc + currentValue, 0);

        // Calculate the average by dividing the sum by the total number of elements
        const average = sum / array.length;

        return average;
      }

      for (const userDoc of usersSnapshot.docs) {
        if (fetchedListingsTT.value.length >= 6) break;
        if (userDoc.id === currentUserUid) continue;
        console.log(calculateAverage(userDoc.data().reviews));
        if (calculateAverage(userDoc.data().reviews) < 4.5) continue;

        const listingsQuery = query(
          collection(firestore, "users", userDoc.id, "listings"),
          where("status", "==", "Available")
        );

        const listingsSnapshot = await getDocs(listingsQuery);

        listingsSnapshot.docs
          .slice(0, 6 - fetchedListingsTT.value.length)
          .forEach((doc) => {
            fetchedListingsTT.value.push({
              id: doc.id,
              userId: userDoc.id,
              ...doc.data(),
            });
          });
      }

      console.log("Final listings:", fetchedListingsTT.value);
      return fetchedListingsTT;
    };

    onMounted(async () => {
      listings.value = (await fetchListings()).value;
      listingsTT.value = (await fetchListingsTT()).value;
    });

    const goToViewListing = (listing) => {
      router.push({
        name: "ViewListing",
        params: { userId: listing.userId, listingId: listing.id },
      });
    };

    function goToSearchResults(searchParams) {
      router.push({ name: "SearchResults", query: searchParams });
    }

    return {
      listings,
      listingsTT,
      showModal,
      goToViewListing,
      goToSearchResults,
      loading,
    };
  },
};
</script>

<style scoped>
html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

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
}

.listings {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(20vw, 1fr)
  ); /* 20vw is just an example, adjust as needed */
  gap: 20px;
  padding-left: 2vw; /* Use viewport units for padding */
  padding-right: 2vw;
}

/* Layout styles for listings */
.listings-row {
  display: flex;
  flex-wrap: nowrap; /* Prevent wrapping by default */
  overflow-x: auto; /* Enable horizontal scrolling */
  gap: 1vw; /* Spacing between listings */
  padding: 10px 70px;
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
