<template>
  <div class="search-results-container">
    <!-- Sidebar for filtering -->
    <aside class="sidebar">
      <h3>Sort by:</h3>
      <!-- Add your filtering options here -->
    </aside>

    <!-- Main content area -->
    <main class="main-content">
      <!-- Conditionally display the listing image and search results header -->
      <div v-if="results.length > 0">
        <div class="listing-image-container">
          <img
            :src="results[0].imageURL"
            alt="Listing Image"
            class="listing-image"
          />
        </div>

        <!-- Search Results Header -->
        <h1>
          <span>{{ results.length }} listings found</span>
          for <i> {{ itemName }}</i>
        </h1>

        <!-- Details for each user listing -->
        <div
          v-for="result in results"
          :key="result.id"
          class="user-listing-details"
        >
          <div class="listing-row">
            <div class="condition">{{ result.condition }}</div>
            <!-- Wishlist container -->
            <div class="wishlist">
              <img
                v-for="item in result.wishlistItems"
                :key="item"
                :src="item"
                class="wishlist-image"
              />
            </div>
            <div class="telegram-handle">{{ result.telegramHandle }}</div>
            <button class="view-listing-btn" @click="goToViewListing(result)">
              View Listing
            </button>
          </div>
        </div>
      </div>

      <!-- Display message if no results are found -->
      <div v-else>
        <p>No results found.</p>
      </div>
    </main>
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
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const firestore = getFirestore();
    const auth = getAuth();
    const results = ref([]);
    let currentUserUid = auth.currentUser?.uid;
    const itemName = route.query.itemName;
    const fetchUserDetails = async (userId) => {
      const userDetails = {
        wishlistItems: [],
        telegramHandle: "",
      };

      // Fetch Wishlist
      try {
        const wishlistRef = collection(firestore, "users", userId, "wishlist");
        const wishlistSnapshot = await getDocs(wishlistRef);
        userDetails.wishlistItems = wishlistSnapshot.docs.map(
          (doc) => doc.data().imageURL
        );
      } catch (error) {
        console.error("Error fetching wishlist details:", error);
      }

      // Fetch Telegram Handle
      try {
        const userRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userRef);
        userDetails.telegramHandle = userDoc.exists()
          ? userDoc.data().telegramHandle
          : "";
      } catch (error) {
        console.error("Error fetching user details:", error);
      }

      return userDetails;
    };

    const fetchFilteredResults = async () => {
      // Check if itemName is present in the query
      if (!route.query.itemName) {
        console.log("Item name is missing in the search query");
        return;
      }

      // Fetch all users
      const usersSnapshot = await getDocs(collection(firestore, "users"));
      let tempResults = [];
      for (const userDoc of usersSnapshot.docs) {
        if (userDoc.id === currentUserUid) continue;
        // Query to fetch listings that match the item name for each user
        const listingsQuery = query(
          collection(firestore, "users", userDoc.id, "listings"),
          where("name", "==", route.query.itemName)
        );
        const listingsSnapshot = await getDocs(listingsQuery);

        // Add each matching listing to the temp results array
        listingsSnapshot.forEach((doc) => {
          tempResults.push({
            id: doc.id,
            userId: userDoc.id,
            ...doc.data(),
          });
        });
      }

      // Fetch additional details for each result
      tempResults = await Promise.all(
        tempResults.map(async (result) => {
          const userDetails = await fetchUserDetails(result.userId);
          return {
            ...result,
            wishlistItems: userDetails.wishlistItems,
            telegramHandle: userDetails.telegramHandle,
          };
        })
      );

      results.value = tempResults;
    };

    watch(() => route.query.itemName, fetchFilteredResults, {
      immediate: true,
    });

    const goToViewListing = (result) => {
      router.push({
        name: "ViewListing",
        params: { userId: result.userId, listingId: result.id },
      });
    };

    return {
      results,
      goToViewListing,
      itemName,
    };
  },
};
</script>

<style scoped>
.search-results-container {
  display: flex;
  background-color: #f9f9f9; /* Light background for the entire container */
}

.sidebar {
  width: 250px; /* Fixed width for sidebar */
  padding: 20px;
  border-right: 1px solid #ccc;
}

.main-content {
  flex-grow: 1; /* Take up the remaining space */
  background-color: #fff; /* White background for content */
  padding: 20px;
  border-radius: 5px; /* Optional: adds rounded corners to the content area */
}

.listing-image-container {
  margin-bottom: 20px;
}

.listing-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  margin-bottom: 10px;
  border-radius: 5px; /* Rounded corners for the main image */
}

.user-listing-details {
  background-color: #fff; /* White background for each card */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Shadow for depth */
  padding: 20px;
  margin: 10px 0;
  border-radius: 5px;
}
.listing-row {
  display: flex; /* Align items in a row */
  align-items: center; /* Center items vertically */
  gap: 20px; /* Add some space between items */
}
.condition,
.telegram-handle,
.view-listing-btn {
  flex-shrink: 0; /* Prevent these items from shrinking */
}

.wishlist {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  flex-grow: 1; /* Allow wishlist to take up remaining space */
}

.wishlist img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  object-fit: cover;
}

.wishlist img:hover {
  transform: scale(1.1); /* Scale up wishlist images on hover */
}

.view-listing-btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px; /* Space from the last element */
}

.view-listing-btn:hover {
  background-color: #0056b3;
}

.telegram-handle {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}
.listing-image-container {
  text-align: center; /* Center-align the image container */
}

.listing-image {
  max-width: 100%; /* Make sure the image is responsive */
  max-height: 300px; /* Set a maximum height */
  width: auto; /* Keep width auto to maintain aspect ratio */
  height: auto; /* Keep height auto to maintain aspect ratio */
  border-radius: 5px; /* Rounded corners for the main image */
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */
}

/* Optional: Add media queries for responsiveness */
@media (max-width: 768px) {
  .search-results-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%; /* Full width on small screens */
    border-right: none;
    border-bottom: 1px solid #ccc;
  }

  .main-content {
    width: 100%;
  }
}
</style>
