<template>
  <div class="search-results">
    <h1>Search Results</h1>
    <div class="listings-row" v-if="results.length > 0">
      <div
        v-for="result in results"
        :key="result.id"
        class="listing"
        @click="goToViewListing(result)"
      >
        <img :src="result.imageURL" :alt="result.name" class="listing-image" />
        <p>{{ result.name }}</p>
      </div>
    </div>
    <div v-else>
      <p>No results found.</p>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const firestore = getFirestore();
    const auth = getAuth();
    const results = ref([]);

    const fetchFilteredResults = async () => {
      // Check if itemName is present in the query
      if (!route.query.itemName) {
        console.log("Item name is missing in the search query");
        return;
      }

      // Wait for auth state to change to get the current user's UID
      let currentUserUid = auth.currentUser?.uid;
      if (!currentUserUid) {
        currentUserUid = await new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            resolve(user?.uid);
          });
        });
      }

      if (!currentUserUid) {
        console.log("No user signed in.");
        return;
      }

      // Fetch all users
      const usersSnapshot = await getDocs(collection(firestore, "users"));
      for (const userDoc of usersSnapshot.docs) {
        if (userDoc.id === currentUserUid) continue; // Skip the current user's listings

        // Query to fetch listings that match the item name for each user
        const listingsQuery = query(
          collection(firestore, "users", userDoc.id, "listings"),
          where("name", "==", route.query.itemName)
        );
        const listingsSnapshot = await getDocs(listingsQuery);

        // Add each matching listing to the results array
        listingsSnapshot.forEach((doc) => {
          results.value.push({
            id: doc.id,
            userId: userDoc.id,
            ...doc.data(),
          });
        });
      }
    };

    watch(() => route.query.itemName, fetchFilteredResults, {
      immediate: true,
    });

    const goToViewListing = (result) => {
      router.push({
        name: "ViewListing", // Ensure this is the correct route name for viewing a listing
        params: { userId: result.userId, listingId: result.id },
      });
    };

    return {
      results,
      goToViewListing,
    };
  },
};
</script>

<style scoped>
.search-results {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.listings-row {
  display: flex;
  flex-wrap: nowrap; /* Adjust this if you want the listings to wrap */
  overflow-x: auto; /* Enable horizontal scrolling for overflow */
  gap: 10px; /* Spacing between listings */
  padding: 10px 0;
}

.listing {
  flex: 0 0 auto; /* Do not grow, do not shrink, flex-basis is auto */
  margin: 0 5px; /* Horizontal margin for spacing */
  width: 180px; /* Fixed width for each listing */
  text-align: center; /* Center the text within each listing */
  cursor: pointer; /* Change cursor on hover to indicate clickability */
}

.listing img {
  max-width: 100%;
  border-radius: 5px; /* Rounded corners for images */
}

/* Responsive design adjustments */
@media (max-width: 768px) {
  .listing {
    width: 120px; /* Smaller width on smaller screens */
  }

  .listings-row {
    flex-wrap: wrap; /* Allow listings to wrap on smaller screens */
    justify-content: center; /* Center listings when wrapped */
  }
}
</style>
