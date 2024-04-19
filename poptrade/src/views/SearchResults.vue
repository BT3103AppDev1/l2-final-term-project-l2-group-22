<template>
  <div class="back-button-container">
    <GoBackButton></GoBackButton>
  </div>
  <div class="search-results-container">
    <aside class="sidebar">
      <h3>Filter by:</h3>
      <div class="filter-option">
        <label>
          <input type="checkbox" v-model="filters.condition.new" />
          Brand New
        </label>
      </div>
      <div class="filter-option">
        <label>
          <input type="checkbox" v-model="filters.condition.mint" />
          Mint
        </label>
      </div>
      <div class="filter-option">
        <label>
          <input type="checkbox" v-model="filters.condition.used" />
          Used
        </label>
      </div>
    </aside>

    <!-- Main content area -->
    <main class="main-content">
      <LoadingScreen v-if="loading" />
      <div v-else-if="currentGroup">
        <!-- Updated header to show the number of listings and item name in italics -->
        <h2>
          {{ currentGroup.listings.length }} listing found for
          <i>{{ currentGroup.name }}</i>
        </h2>
        <img :src="currentGroup.imageURL" alt="Item Image" class="item-image" />
        <div
          v-for="result in currentGroup.listings"
          :key="result.id"
          class="listing-group"
        >
          <div class="listing-row">
            <div class="condition">{{ result.condition }}</div>
            <!-- Updated wishlist display with conditional borders -->
            <div class="wishlist">
              Their wishlist:
              <img
                v-for="item in result.wishlistItems"
                :key="item.name"
                :src="item.imageURL"
                :class="{
                  'wishlist-image': true,
                  match: item.match,
                  'no-match': !item.match,
                }"
                alt="Wishlist Item"
              />
            </div>

            <div class="telegram-handle" @click="goToDashboard(result.userId)">
              {{ result.telegramHandle }}
            </div>
            <button class="view-listing-btn" @click="goToViewListing(result)">
              View Listing
            </button>
          </div>
        </div>
        <div class="pagination">
          <button class="prev-btn" @click="prevGroup" :disabled="!hasPrevGroup">
            Previous
          </button>
          <button class="next-btn" @click="nextGroup" :disabled="!hasNextGroup">
            Next
          </button>
        </div>
      </div>
      <div v-else>
        <p>No results found.</p>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from "vue";
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "../components/LoadingScreen.vue";
import GoBackButton from "../components/GoBackButton.vue";

export default {
  components: {
    LoadingScreen,
    GoBackButton,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const firestore = getFirestore();
    const auth = getAuth();
    const currentUserUid = ref(auth.currentUser?.uid);
    const itemName = ref(route.query.itemName);
    const groupedResults = ref([]);
    const currentPageIndex = ref(0);
    const loading = ref(false);
    const filters = ref({
      condition: {
        new: false,
        mint: false,
        used: false,
      },
    });

    const fetchUserDetails = async (userId) => {
      const userDetails = {
        wishlistItems: [],
        telegramHandle: "",
      };

      // Fetch wishlist items
      const wishlistRef = collection(firestore, "users", userId, "wishlist");
      const wishlistSnapshot = await getDocs(wishlistRef);

      // Fetch current user's inventory where status is "Available"
      const currentUserInventoryRef = query(
        collection(firestore, "users", currentUserUid.value, "listings"),
        where("status", "==", "Available") // Only fetch listings where status is "Available"
      );
      const currentUserInventorySnapshot = await getDocs(
        currentUserInventoryRef
      );
      const currentUserInventory = currentUserInventorySnapshot.docs.map(
        (doc) => doc.data().name
      );

      // Map through wishlist items to check for matches
      userDetails.wishlistItems = wishlistSnapshot.docs.map((doc) => {
        const itemName = doc.data().name;
        return {
          imageURL: doc.data().imageURL,
          name: itemName,
          match: currentUserInventory.includes(itemName), // Check for a match
        };
      });

      // Fetch Telegram handle
      const userRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userRef);
      userDetails.telegramHandle = userDoc.exists()
        ? userDoc.data().telegramHandle
        : "";

      return userDetails;
    };

    const fetchFilteredResults = async () => {
      loading.value = true;
      let tempResults = [];
      const usersSnapshot = await getDocs(collection(firestore, "users"));
      for (const userDoc of usersSnapshot.docs) {
        if (userDoc.id === currentUserUid.value) {
          continue; // Skip the current iteration if the listing belongs to the current user
        }
        let baseQuery = query(
          collection(firestore, "users", userDoc.id, "listings"),
          where("status", "==", "Available")
        );
        if (route.query.selectedPopmart) {
          baseQuery = query(
            baseQuery,
            where("popmart", "==", route.query.selectedPopmart)
          );
        }
        if (route.query.selectedCollection) {
          baseQuery = query(
            baseQuery,
            where("collection", "==", route.query.selectedCollection)
          );
        }
        if (route.query.itemName) {
          baseQuery = query(
            baseQuery,
            where("name", "==", route.query.itemName)
          );
        }
        let conditionQueries = [baseQuery];
        if (
          filters.value.condition.new ||
          filters.value.condition.mint ||
          filters.value.condition.used
        ) {
          conditionQueries = [];
          if (filters.value.condition.new)
            conditionQueries.push(
              query(baseQuery, where("condition", "==", "Brand New"))
            );
          if (filters.value.condition.mint)
            conditionQueries.push(
              query(baseQuery, where("condition", "==", "Mint"))
            );
          if (filters.value.condition.used)
            conditionQueries.push(
              query(baseQuery, where("condition", "==", "Used"))
            );
        }
        for (const conditionQuery of conditionQueries) {
          const listingsSnapshot = await getDocs(conditionQuery);
          tempResults.push(
            ...listingsSnapshot.docs.map((doc) => ({
              id: doc.id,
              userId: userDoc.id,
              ...doc.data(),
            }))
          );
        }
      }
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
      groupedResults.value = Object.entries(
        tempResults.reduce((acc, cur) => {
          if (!acc[cur.name]) acc[cur.name] = [];
          acc[cur.name].push(cur);
          return acc;
        }, {})
      ).map(([name, listings]) => ({
        name,
        imageURL: listings[0].imageURL,
        listings,
      }));
      currentPageIndex.value = 0;
      loading.value = false;
    };

    watch(
      [
        () => route.query.itemName,
        () => route.query.selectedPopmart,
        () => route.query.selectedCollection,
        filters,
      ],
      fetchFilteredResults,
      { immediate: true, deep: true }
    );

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        currentUserUid.value = user?.uid;
        fetchFilteredResults();
      });
    });

    const goToViewListing = (result) => {
      router.push({
        name: "ViewListing",
        params: { userId: result.userId, listingId: result.id },
      });
    };

    const prevGroup = () => {
      if (currentPageIndex.value > 0) currentPageIndex.value--;
    };

    const nextGroup = () => {
      if (currentPageIndex.value < groupedResults.value.length - 1)
        currentPageIndex.value++;
    };

    return {
      itemName,
      groupedResults,
      goToViewListing,
      currentPageIndex,
      prevGroup,
      nextGroup,
      hasPrevGroup: computed(() => currentPageIndex.value > 0),
      hasNextGroup: computed(
        () => currentPageIndex.value < groupedResults.value.length - 1
      ),
      loading,
      filters,
      currentGroup: computed(
        () => groupedResults.value[currentPageIndex.value]
      ),
    };
  },
  methods: {
    goToDashboard(userId) {
      this.$router.push({ name: "Dashboard", params: { userId } });
    },
  },
};
</script>

<style scoped>
.back-button-container {
  position: relative;
  top: -12em;
  left: 1em;
  width: 10%;
}
.search-results-container {
  display: flex;
  background-color: #f9f9f9;
}

.sidebar {
  width: 250px;
  padding: 20px;
  background: #fff;
  border-right: 2px solid #eaeaea;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.filter-option {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.filter-option:hover {
  background-color: #e9e9e9; /* Slightly darker background on hover for interaction feedback */
}

.filter-option label {
  display: flex;
  align-items: center; /* Align the checkbox and label text */
  cursor: pointer;
}

.filter-option input[type="checkbox"] {
  margin-right: 10px; /* Space out the checkbox from the label */
  cursor: pointer;
}

.main-content {
  flex-grow: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
}

.listing-group {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 10px 0;
  border-radius: 5px;
}

.listing-row {
  display: flex;
  align-items: center;
  gap: 20px;
  font-family: "Helvetica", sans-serif;
}

.condition,
.telegram-handle,
.view-listing-btn {
  flex-shrink: 0;
}

.wishlist {
  display: flex; /* Enables flexbox */
  align-items: center; /* Centers items vertically */
  justify-content: flex-start; /* Aligns items to the start of the flex container horizontally */
  gap: 10px; /* Adds space between the text and the images */
}

.wishlist-image {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  object-fit: cover;
  margin-right: 5px;
  border: 3px solid #ff4d4d; /* Default red border */
}

.wishlist-image.match {
  border-color: #4caf50; /* Green border for matched items */
}

.wishlist-image.no-match {
  border-color: #ff4d4d; /* Red border for unmatched items */
}

.view-listing-btn,
.prev-btn,
.next-btn {
  padding: 10px 20px;
  background-color: #ff4d4d;
  color: #fff;
  border: none;
  border-radius: 20px; /* More pronounced rounded corners for buttons */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow for buttons */
  letter-spacing: 0.5px; /* Slightly increase spacing between letters */
  transition: all 0.3s ease; /* Transition for hover effects */
  cursor: pointer;
}

.view-listing-btn:hover,
.prev-btn:hover,
.next-btn:hover {
  background-color: #e60000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Larger shadow on hover for a lifting effect */
  transform: translateY(
    -2px
  ); /* Slight upward movement on hover for a "button press" feel */
}

.telegram-handle {
  color: #007bff;
  cursor: pointer;
  font-family: "Arial", sans-serif; /* Choose an elegant font */
  font-weight: bold; /* Make it bold to stand out */
  text-decoration: none;
}

.telegram-handle:hover {
  text-decoration: underline; /* Only underline on hover for a clean look */
}

.item-image {
  max-width: 150px;
  max-height: 150px;
  width: auto;
  height: auto;
  border-radius: 5px;
  margin-bottom: 10px;
}

.pagination {
  margin-top: 20px;
}

.prev-btn {
  margin-right: 10px;
}

.next-btn {
  margin-left: 10px;
}

.prev-btn:disabled,
.next-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
